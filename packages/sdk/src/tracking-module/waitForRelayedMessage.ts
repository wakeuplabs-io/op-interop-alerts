import { createPublicClient } from "viem/_types/clients/createPublicClient";
import { ChainsInfo } from "../config";
import { hardhat as hardhatChain } from "viem/chains";
import { Address, encodeAbiParameters, http, keccak256, Log, parseAbiParameters, parseEventLogs } from "viem";
import { l2ToL2CrossDomainMessengerAbi } from "../abis/generated";

export async function waitForRelayedMessage(chainsInfo: ChainsInfo, expectedSender: string, expectedMessagePayload: `0x${string}`) : Promise<number> {
    return new Promise((resolve, reject) => {
        console.log("=== 🔍 Waiting for Relayed Message ===");

        const publicDestination = createPublicClient({
            chain: { ...hardhatChain, id: chainsInfo.chainDestination.chainId },
            transport: http(chainsInfo.chainDestination.rpcUrl),
        });
    
        const unwatch = publicDestination.watchContractEvent({
            address: chainsInfo.chainDestination.l2CrossDomainMessenger,
            abi: l2ToL2CrossDomainMessengerAbi,
            eventName: 'RelayedMessage',
            onLogs: (logs: Log[]) => {
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
                    unwatch();
                    resolve(0); // Success
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