import { createPublicClient } from "viem";
import { ChainsInfo } from "../config";
import { hardhat as hardhatChain } from "viem/chains";
import { Address, encodeAbiParameters, http, keccak256, Log, parseAbiParameters, parseEventLogs } from "viem";
import { l2ToL2CrossDomainMessengerAbi } from "../abis/generated";
import { RelayedMessageEventData } from "./startTracking";

export async function waitForRelayedMessage(chainsInfo: ChainsInfo, expectedSender: string, expectedMessagePayload: `0x${string}`) : Promise<{ eventData: RelayedMessageEventData }> {
    return new Promise(async (resolve, reject) => {
        console.log("\n=== 🔍 Waiting for Relayed Message ===");

        const publicDestination = createPublicClient({
            chain: { ...hardhatChain, id: chainsInfo.chainDestination.chainId },
            transport: http(chainsInfo.chainDestination.rpcUrl),
        });
    
        const unwatch = publicDestination.watchContractEvent({
            address: chainsInfo.chainDestination.l2CrossDomainMessenger,
            abi: l2ToL2CrossDomainMessengerAbi,
            eventName: 'RelayedMessage',
            onLogs: async (logs: Log[]) => {
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
                    console.log("   - Message Nonce:", messageNonce.toString());
                    console.log("   - Message Hash:", messageHash);

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

                    unwatch();
                    resolve({ eventData });
                }
            },
            onError: (error: Error) => {
              console.error("❌ Error watching for RelayedMessage events:", error);
              unwatch();
              reject(error);
            }
          });
    });
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