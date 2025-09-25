import { createPublicClient } from "viem";
import { ChainsInfo } from "../config";
import { hardhat as hardhatChain } from "viem/chains";
import { Address, encodeAbiParameters, http, keccak256, Log, parseAbiParameters, parseEventLogs } from "viem";
import { l2ToL2CrossDomainMessengerAbi } from "../abis/generated";
import { RelayedMessageEventData } from "./startTracking";

export enum WaitForRelayedMessageResultStatus {
  SUCCESS = "SUCCESS",
  FAILED_TIMEOUT = "FAILED_TIMEOUT",
  FAILED_WATCH_ERROR = "FAILED_WATCH_ERROR",
  FAILED_TRANSACTION_INFO = "FAILED_TRANSACTION_INFO",
  FAILED_UNKNOWN = "FAILED_UNKNOWN"
}

export interface WaitForRelayedMessageSuccessResult {
  status: WaitForRelayedMessageResultStatus.SUCCESS;
  data: {
    eventData: RelayedMessageEventData;
    messageHash: `0x${string}`;
    source: bigint;
    messageNonce: bigint;
  };
}

export interface WaitForRelayedMessageFailedResult {
  status: WaitForRelayedMessageResultStatus.FAILED_TIMEOUT | WaitForRelayedMessageResultStatus.FAILED_WATCH_ERROR | WaitForRelayedMessageResultStatus.FAILED_TRANSACTION_INFO | WaitForRelayedMessageResultStatus.FAILED_UNKNOWN;
  error: {
    message: string;
    context: Record<string, any>;
    timestamp: Date;
  };
}

export type WaitForRelayedMessageResult = WaitForRelayedMessageSuccessResult | WaitForRelayedMessageFailedResult;

export async function waitForRelayedMessage(chainsInfo: ChainsInfo, expectedSender: string, expectedMessagePayload: `0x${string}`) : Promise<WaitForRelayedMessageResult> {
    try {

        return new Promise(async (resolve) => {
            console.log("\n=== 🔍 Waiting for Relayed Message ===");

            const publicDestination = createPublicClient({
                chain: { ...hardhatChain, id: chainsInfo.chainDestination.chainId },
                transport: http(chainsInfo.chainDestination.rpcUrl),
            });

            // Setup 15-minute timeout
            const timeoutMs = 15 * 60 * 1000; // 15 minutes
            let unwatch: (() => void) | null = null;
            
            const timeoutId = setTimeout(() => {
                if (unwatch) {
                    try {
                        unwatch();
                    } catch (error) {
                        console.warn('Warning: Error stopping event watcher during timeout:', error);
                    }
                }
                resolve({
                    status: WaitForRelayedMessageResultStatus.FAILED_TIMEOUT,
                    error: {
                        message: "Timeout waiting for RelayedMessage event after 15 minutes",
                        context: {
                            timeoutMs,
                            expectedSender,
                            expectedMessagePayload,
                            destinationChain: chainsInfo.chainDestination.chainId,
                            l2CrossDomainMessenger: chainsInfo.chainDestination.l2CrossDomainMessenger,
                            messageReceiver: chainsInfo.chainDestination.messageReceiver
                        },
                        timestamp: new Date()
                    }
                });
            }, timeoutMs);
        
            try {
                unwatch = publicDestination.watchContractEvent({
                    address: chainsInfo.chainDestination.l2CrossDomainMessenger,
                    abi: l2ToL2CrossDomainMessengerAbi,
                    eventName: 'RelayedMessage',
                onLogs: async (logs: Log[]) => {
                    try {
                        const logsParsed = parseEventLogs({
                            abi: l2ToL2CrossDomainMessengerAbi,
                            logs: logs,
                        });
            
                        const relayedMessage = logsParsed.find((log) => log.eventName === 'RelayedMessage');
            
                        if (!relayedMessage) {
                            return;
                        }
            
                        const { source, messageNonce, messageHash } = relayedMessage.args;
            
                        const expectedMessageHash = generateExpectedMessageHash(
                            BigInt(chainsInfo.chainDestination.chainId),
                            source,
                            messageNonce,
                            expectedSender,
                            chainsInfo.chainDestination.messageReceiver,
                            expectedMessagePayload
                        );
            
                        if (messageHash.toLowerCase() === expectedMessageHash.toLowerCase()) {
                            console.log("\n📨 RelayedMessage event received:");
                            console.log("   - Source Chain ID:", source.toString());
                            console.log("   - Relayed Tx Hash:", relayedMessage.transactionHash);
                            console.log("   - Message Nonce:", messageNonce.toString());
                            console.log("   - Message Hash:", messageHash);

                            try {
                                // Get transaction information for the callback
                                const txReceipt = await publicDestination.getTransactionReceipt({ 
                                    hash: logsParsed[0].transactionHash 
                                });
                                const block = await publicDestination.getBlock({ 
                                    blockHash: txReceipt.blockHash 
                                });

                                const eventData: RelayedMessageEventData = {
                                    event: relayedMessage,
                                    logs: logsParsed,
                                    gasUsed: txReceipt.gasUsed,
                                    timestamp: new Date(Number(block.timestamp) * 1000),
                                    localTimestamp: new Date(),
                                    transactionHash: logsParsed[0].transactionHash
                                };

                            clearTimeout(timeoutId);
                            if (unwatch) {
                                try {
                                    unwatch();
                                } catch (error) {
                                    console.warn('Warning: Error stopping event watcher:', error);
                                }
                            }
                                resolve({
                                    status: WaitForRelayedMessageResultStatus.SUCCESS,
                                    data: {
                                        eventData,
                                        messageHash,
                                        source,
                                        messageNonce
                                    }
                                });
                            } catch (error) {
                            clearTimeout(timeoutId);
                            if (unwatch) {
                                try {
                                    unwatch();
                                } catch (error) {
                                    console.warn('Warning: Error stopping event watcher:', error);
                                }
                            }
                                resolve({
                                    status: WaitForRelayedMessageResultStatus.FAILED_TRANSACTION_INFO,
                                    error: {
                                        message: error instanceof Error ? error.message : String(error),
                                        context: {
                                            transactionHash: logsParsed[0].transactionHash,
                                            destinationChain: chainsInfo.chainDestination.chainId,
                                            rpcUrl: chainsInfo.chainDestination.rpcUrl,
                                            messageHash,
                                            source: source.toString(),
                                            messageNonce: messageNonce.toString()
                                        },
                                        timestamp: new Date()
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.error("❌ Error parsing RelayedMessage event:", error);
                            clearTimeout(timeoutId);
                            if (unwatch) {
                                try {
                                    unwatch();
                                } catch (error) {
                                    console.warn('Warning: Error stopping event watcher:', error);
                                }
                            }
                        resolve({
                            status: WaitForRelayedMessageResultStatus.FAILED_WATCH_ERROR,
                            error: {
                                message: error instanceof Error ? error.message : String(error),
                                context: {
                                    expectedSender,
                                    expectedMessagePayload,
                                    destinationChain: chainsInfo.chainDestination.chainId,
                                    l2CrossDomainMessenger: chainsInfo.chainDestination.l2CrossDomainMessenger,
                                    logsReceived: logs.length,
                                    errorType: error?.constructor?.name || 'Unknown'
                                },
                                timestamp: new Date()
                            }
                        });
                    }
                },
                onError: (error: Error) => {
                    console.error("❌ Error watching for RelayedMessage events:", error);
                            clearTimeout(timeoutId);
                            if (unwatch) {
                                try {
                                    unwatch();
                                } catch (error) {
                                    console.warn('Warning: Error stopping event watcher:', error);
                                }
                            }
                    resolve({
                        status: WaitForRelayedMessageResultStatus.FAILED_WATCH_ERROR,
                        error: {
                            message: error.message,
                            context: {
                                expectedSender,
                                expectedMessagePayload,
                                destinationChain: chainsInfo.chainDestination.chainId,
                                l2CrossDomainMessenger: chainsInfo.chainDestination.l2CrossDomainMessenger,
                                rpcUrl: chainsInfo.chainDestination.rpcUrl,
                                errorType: error.constructor.name
                            },
                            timestamp: new Date()
                        }
                    });
                }
            });
            } catch (watchError) {
                // Handle errors when setting up the event watcher
                console.error("❌ Error setting up event watcher:", watchError);
                clearTimeout(timeoutId);
                resolve({
                    status: WaitForRelayedMessageResultStatus.FAILED_WATCH_ERROR,
                    error: {
                        message: `Failed to setup event watcher: ${watchError instanceof Error ? watchError.message : String(watchError)}`,
                        context: {
                            expectedSender,
                            expectedMessagePayload,
                            destinationChain: chainsInfo.chainDestination.chainId,
                            l2CrossDomainMessenger: chainsInfo.chainDestination.l2CrossDomainMessenger,
                            errorType: watchError?.constructor?.name || 'Unknown',
                            rpcUrl: chainsInfo.chainDestination.rpcUrl
                        },
                        timestamp: new Date()
                    }
                });
            }
        });
    } catch (error) {
        // Captura cualquier error inesperado que no hayamos contemplado
        return {
            status: WaitForRelayedMessageResultStatus.FAILED_UNKNOWN,
            error: {
                message: error instanceof Error ? error.message : String(error),
                context: {
                    functionName: 'waitForRelayedMessage',
                    expectedSender,
                    expectedMessagePayload,
                    destinationChain: chainsInfo?.chainDestination?.chainId,
                    errorType: error?.constructor?.name || 'Unknown',
                    stack: error instanceof Error ? error.stack : undefined
                },
                timestamp: new Date()
            }
        };
    }
}

function generateExpectedMessageHash(
    destination: bigint,
    source: bigint,
    nonce: bigint,
    sender: string,
    target: string,
    message: `0x${string}`
  ): `0x${string}` {
    // Generate the same hash that the contract generates
    // Based on the contract code: keccak256(abi.encode(destination, source, nonce, sender, target, message))
    const encoded = encodeAbiParameters(
      parseAbiParameters('uint256, uint256, uint256, address, address, bytes'),
      [destination, source, nonce, sender as Address, target as Address, message]
    );
    return keccak256(encoded);
  }