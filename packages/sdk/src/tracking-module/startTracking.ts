import { ChainsInfo, PKsInfo } from "../config";
import { sendPing } from "./sendPing";
import { waitForRelayedMessage } from "./waitForRelayedMessage";
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

// Keep EventData for backward compatibility
export interface EventData {
    logs: Log[];
    gasUsed: bigint;
    timestamp: Date;
    transactionHash: `0x${string}`;
}

export type TrackingCallback = (data: TrackingCallbackData) => void;

const MINUTE = 60 * 1000;

export async function startTracking (
    chainsInfo: ChainsInfo, 
    pksInfo: PKsInfo, 
    callback?: TrackingCallback,
    intervalMinutes: number = 10,
) {
    while (true) {
        const sentResult = await sendPing(chainsInfo, pksInfo);
        const relayResult = await waitForRelayedMessage(chainsInfo, sentResult.sentMessageSender, sentResult.sentMessagePayload);

        if (callback) {
            callback({
                sentMessage: sentResult.eventData,
                relayMessage: relayResult.eventData
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