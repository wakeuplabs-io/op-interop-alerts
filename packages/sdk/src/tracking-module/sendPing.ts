import { createPublicClient, createWalletClient, decodeEventLog, encodeFunctionData, http, parseEventLogs } from "viem";
import { ChainsInfo, PKsInfo } from "../config";
import { hardhat as hardhatChain } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { l2ToL2CrossDomainMessengerAbi, messageReceiverAbi } from "../abis/generated";
import { SentMessageEventData } from "./startTracking";

const messageToSend = "ping";

export enum SendPingResultStatus {
  SUCCESS = "SUCCESS",
  FAILED_SEND_MESSAGE = "FAILED_SEND_MESSAGE",
  FAILED_WAIT_RECEIPT = "FAILED_WAIT_RECEIPT", 
  FAILED_MISSING_EVENT = "FAILED_MISSING_EVENT",
  FAILED_UNKNOWN = "FAILED_UNKNOWN"
}

export interface SendPingSuccessResult {
  status: SendPingResultStatus.SUCCESS;
  data: {
    sendTxHash: `0x${string}`;
    sentMessageNonce: bigint | undefined;
    sentMessageSender: string;
    sentMessagePayload: `0x${string}`;
    eventData: SentMessageEventData;
  };
}

export interface SendPingFailedResult {
  status: SendPingResultStatus.FAILED_SEND_MESSAGE | SendPingResultStatus.FAILED_WAIT_RECEIPT | SendPingResultStatus.FAILED_MISSING_EVENT | SendPingResultStatus.FAILED_UNKNOWN;
  error: {
    message: string;
    context: Record<string, any>;
    timestamp: Date;
  };
}

export type SendPingResult = SendPingSuccessResult | SendPingFailedResult;

export async function sendPing (chainsInfo: ChainsInfo, pksInfo: PKsInfo): Promise<SendPingResult> {
  try {
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

    let sendTxHash: `0x${string}`;
    try {
      sendTxHash = await walletOrigin.writeContract({
        abi: l2ToL2CrossDomainMessengerAbi,
        address: chainsInfo.chainOrigin.l2CrossDomainMessenger,
        functionName: "sendMessage",
        args: [BigInt(chainsInfo.chainDestination.chainId), chainsInfo.chainDestination.messageReceiver, calldata],
        account: walletOrigin.account,
        chain: walletOrigin.chain
      });
    } catch (error) {
      return {
        status: SendPingResultStatus.FAILED_SEND_MESSAGE,
        error: {
          message: error instanceof Error ? error.message : String(error),
          context: {
            originChain: chainsInfo.chainOrigin.chainId,
            destinationChain: chainsInfo.chainDestination.chainId,
            l2CrossDomainMessenger: chainsInfo.chainOrigin.l2CrossDomainMessenger,
            messageReceiver: chainsInfo.chainDestination.messageReceiver,
            sender: sentMessageSender,
            message: messageToSend
          },
          timestamp: new Date()
        }
      };
    }

    let sendMessageReceipt;
    try {
      sendMessageReceipt = await publicOrigin.waitForTransactionReceipt({ hash: sendTxHash });
    } catch (error) {
      return {
        status: SendPingResultStatus.FAILED_WAIT_RECEIPT,
        error: {
          message: error instanceof Error ? error.message : String(error),
          context: {
            transactionHash: sendTxHash,
            originChain: chainsInfo.chainOrigin.chainId,
            rpcUrl: chainsInfo.chainOrigin.rpcUrl,
            sender: sentMessageSender
          },
          timestamp: new Date()
        }
      };
    }

    const sendMessageLogs = parseEventLogs({
      abi: l2ToL2CrossDomainMessengerAbi,
      logs: sendMessageReceipt.logs,
    });

    sentMessageNonce = sendMessageLogs.find((log) => log.eventName === "SentMessage")?.args.messageNonce;

    console.log(`🔥 Message sent! Tx hash: ${sendTxHash}`);

    // Get the block timestamp
    const block = await publicOrigin.getBlock({ blockHash: sendMessageReceipt.blockHash });

    // Find the specific SentMessage event
    const sentMessageEvent = sendMessageLogs.find((log) => log.eventName === "SentMessage");

    if (!sentMessageEvent) {
      return {
        status: SendPingResultStatus.FAILED_MISSING_EVENT,
        error: {
          message: "SentMessage event not found in transaction logs",
          context: {
            transactionHash: sendTxHash,
            originChain: chainsInfo.chainOrigin.chainId,
            destinationChain: chainsInfo.chainDestination.chainId,
            l2CrossDomainMessenger: chainsInfo.chainOrigin.l2CrossDomainMessenger,
            messageReceiver: chainsInfo.chainDestination.messageReceiver,
            totalLogs: sendMessageReceipt.logs.length,
            parsedLogs: sendMessageLogs.length,
            availableEvents: sendMessageLogs.map(log => log.eventName),
            sender: sentMessageSender,
            blockHash: sendMessageReceipt.blockHash,
            gasUsed: sendMessageReceipt.gasUsed.toString()
          },
          timestamp: new Date()
        }
      };
    }

    // Crear SentMessageEventData para el callback
    const eventData: SentMessageEventData = {
      event: sentMessageEvent,
      logs: sendMessageLogs,
      gasUsed: sendMessageReceipt.gasUsed,
      timestamp: new Date(Number(block.timestamp) * 1000),
      localTimestamp: new Date(),
      transactionHash: sendTxHash
    };

    return {
      status: SendPingResultStatus.SUCCESS,
      data: {
        sendTxHash,
        sentMessageNonce,
        sentMessageSender,
        sentMessagePayload: calldata,
        eventData,
      }
    };
  } catch (error) {
    // Captura cualquier error inesperado que no hayamos contemplado
    return {
      status: SendPingResultStatus.FAILED_UNKNOWN,
      error: {
        message: error instanceof Error ? error.message : String(error),
        context: {
          functionName: 'sendPing',
          originChain: chainsInfo?.chainOrigin?.chainId,
          destinationChain: chainsInfo?.chainDestination?.chainId,
          errorType: error?.constructor?.name || 'Unknown',
          stack: error instanceof Error ? error.stack : undefined
        },
        timestamp: new Date()
      }
    };
  }
}