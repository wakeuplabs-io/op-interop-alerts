import { ChainsInfo, PKsInfo } from "../config";
import { sendPing, SendPingFailedResult } from "./sendPing";
import { waitForRelayedMessage, WaitForRelayedMessageFailedResult } from "./waitForRelayedMessage";
import { Log, GetContractEventsReturnType, ParseEventLogsReturnType } from "viem";
import { l2ToL2CrossDomainMessengerAbi } from "../abis/generated";

// Specific types for L2ToL2CrossDomainMessenger events
export type SentMessageEvent = GetContractEventsReturnType<
    typeof l2ToL2CrossDomainMessengerAbi,
    'SentMessage'
>[0];

export type RelayedMessageEvent = GetContractEventsReturnType<
    typeof l2ToL2CrossDomainMessengerAbi,
    'RelayedMessage'
>[0];

export type L2ToL2CrossDomainMessengerLogs = ParseEventLogsReturnType<
    typeof l2ToL2CrossDomainMessengerAbi
>;

export interface SentMessageEventData {
    event: SentMessageEvent;
    logs: L2ToL2CrossDomainMessengerLogs;
    gasUsed: bigint;
    timestamp: Date;
    localTimestamp: Date;
    transactionHash: `0x${string}`;
}

export interface RelayedMessageEventData {
    event: RelayedMessageEvent;
    logs: L2ToL2CrossDomainMessengerLogs;
    gasUsed: bigint;
    timestamp: Date;
    localTimestamp: Date;
    transactionHash: `0x${string}`;
}

export interface TrackingCallbackData {
    sentMessage: SentMessageEventData;
    relayMessage: RelayedMessageEventData;
}

export interface EventData {
    logs: Log[];
    gasUsed: bigint;
    timestamp: Date;
    transactionHash: `0x${string}`;
}

// Unified tracking result type
export interface TrackingResult {
    timestamp: Date;
    success: boolean;
    data?: TrackingCallbackData;
    error?: SendPingFailedResult | WaitForRelayedMessageFailedResult;
}

export type TrackingCallback = (result: TrackingResult) => void;

const MINUTE = 60 * 1000;

export async function startTracking (
    chainsInfo: ChainsInfo, 
    pksInfo: PKsInfo, 
    callback?: TrackingCallback,
    intervalMinutes: number = 10,
) {
    while (true) {
        const cycleTimestamp = new Date();
        const sentResult = await sendPing(chainsInfo, pksInfo);
        
        if (sentResult.status !== 'SUCCESS') {
            console.error('❌ Failed to send ping:', sentResult.error.message);
            
            if (callback) {
                callback({
                    timestamp: cycleTimestamp,
                    success: false,
                    error: sentResult
                });
            }
            
            console.log('');
            console.log("=== 🔄 Waiting for next tracking cycle ===");
            console.log('');
            await wait(intervalMinutes * MINUTE);
            continue;
        }

        const relayResult = await waitForRelayedMessage(
            chainsInfo, 
            sentResult.data.sentMessageSender, 
            sentResult.data.sentMessagePayload
        );

        if (relayResult.status !== 'SUCCESS') {
            console.error('❌ Failed to wait for relayed message:', relayResult.error.message);
            
            if (callback) {
                callback({
                    timestamp: cycleTimestamp,
                    success: false,
                    error: relayResult
                });
            }
            
            console.log('');
            console.log("=== 🔄 Waiting for next tracking cycle ===");
            console.log('');
            await wait(intervalMinutes * MINUTE);
            continue;
        }

        if (callback) {
            callback({
                timestamp: cycleTimestamp,
                success: true,
                data: {
                    sentMessage: sentResult.data.eventData,
                    relayMessage: relayResult.data.eventData
                }
            });
        }

        console.log('');
        console.log("=== 🔄 Waiting for next tracking cycle ===");
        console.log('');

        await wait(intervalMinutes * MINUTE);
    }
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
