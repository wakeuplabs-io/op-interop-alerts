import { createPublicClient, createWalletClient, decodeEventLog, encodeFunctionData, http, parseEventLogs } from "viem";
import { ChainsInfo, PKsInfo } from "../config";
import { hardhat as hardhatChain } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { l2ToL2CrossDomainMessengerAbi, messageReceiverAbi } from "../abis/generated";

const messageToSend = "ping";

export async function sendPing (chainsInfo: ChainsInfo, pksInfo: PKsInfo) {
  const publicOrigin = createPublicClient({ 
    chain: { ...hardhatChain, id: chainsInfo.chainOrigin.chainId }, 
    transport: http(chainsInfo.chainOrigin.rpcUrl) 
  });
  const walletOrigin = createWalletClient({
    account: privateKeyToAccount(pksInfo.origin),
    chain: { ...hardhatChain, id: chainsInfo.chainOrigin.chainId },
    transport: http(chainsInfo.chainOrigin.rpcUrl),
  });

  let sentMessageNonce: bigint | undefined;
  let sentMessageSender: string = walletOrigin.account.address;
  
  console.log("=== 🚀 Sending message 'ping' from Chain Origin to Chain Destination ===");
  
  const calldata = encodeFunctionData({
    abi: messageReceiverAbi,
    functionName: "receiveMessage",
    args: [messageToSend]
  });

  const sendTxHash = await walletOrigin.writeContract({
    abi: l2ToL2CrossDomainMessengerAbi,
    address: chainsInfo.chainOrigin.l2CrossDomainMessenger,
    functionName: "sendMessage",
    args: [BigInt(chainsInfo.chainDestination.chainId), chainsInfo.chainDestination.messageReceiver, calldata],
    account: walletOrigin.account,
    chain: walletOrigin.chain
  });

  const sendMessageReceipt = await publicOrigin.waitForTransactionReceipt({ hash: sendTxHash });

  const sendMessageLogs = parseEventLogs({
    abi: l2ToL2CrossDomainMessengerAbi,
    logs: sendMessageReceipt.logs,
  });

  sentMessageNonce = sendMessageLogs.find((log) => log.eventName === "SentMessage")?.args.messageNonce;

  console.log(`🔥 Message sent! Tx hash: ${sendTxHash}`);

  return {
    sendTxHash,
    sentMessageNonce,
    sentMessageSender,
    sentMessagePayload: calldata,
  };
}