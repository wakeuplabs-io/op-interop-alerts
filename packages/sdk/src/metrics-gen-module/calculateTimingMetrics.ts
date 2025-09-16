import { TrackingResult } from "../tracking-module/startTracking";

export enum MessageTimingStatus {
    ON_TIME = "ON_TIME",
    DELAYED = "DELAYED",
    SEVERELY_DELAYED = "SEVERELY_DELAYED"
}

export interface TimingMetrics {
    onTimeMessages: number;
    delayedMessages: number;
    severelyDelayedMessages: number;
    averageDelayMs: number;
    timingStatus: MessageTimingStatus;
}

export interface MetricsConfig {
    delayThresholdMs: number;
    severeDelayThresholdMs: number;
    healthySuccessRateThreshold: number;
    criticalSuccessRateThreshold: number;
    maxHealthyLatencyMs: number;
    criticalLatencyMs: number;
    maxHealthyFailureRateThreshold: number;
    criticalFailureRateThreshold: number;
    consecutiveFailureThreshold: number;
    maxTrackingDataEntries: number;
}

export function calculateTimingMetrics(successfulData: TrackingResult[], config: MetricsConfig): TimingMetrics {
    if (successfulData.length === 0) {
        return {
            onTimeMessages: 0,
            delayedMessages: 0,
            severelyDelayedMessages: 0,
            averageDelayMs: 0,
            timingStatus: MessageTimingStatus.ON_TIME
        };
    }

    let onTimeMessages = 0;
    let delayedMessages = 0;
    let severelyDelayedMessages = 0;
    let totalDelayMs = 0;

    successfulData.forEach(d => {
        if (!d.data) return;
        
        const latencyMs = d.data.relayMessage.localTimestamp.getTime() - d.data.sentMessage.localTimestamp.getTime();
        totalDelayMs += latencyMs;
        
        if (latencyMs <= config.delayThresholdMs) {
            onTimeMessages++;
        } else if (latencyMs <= config.severeDelayThresholdMs) {
            delayedMessages++;
        } else {
            severelyDelayedMessages++;
        }
    });

    const averageDelayMs = totalDelayMs / successfulData.length;
    
    let timingStatus: MessageTimingStatus;
    if (severelyDelayedMessages > successfulData.length * 0.1) { // More than 10% severely delayed
        timingStatus = MessageTimingStatus.SEVERELY_DELAYED;
    } else if (delayedMessages > successfulData.length * 0.2) { // More than 20% delayed
        timingStatus = MessageTimingStatus.DELAYED;
    } else {
        timingStatus = MessageTimingStatus.ON_TIME;
    }

    return {
        onTimeMessages,
        delayedMessages,
        severelyDelayedMessages,
        averageDelayMs,
        timingStatus
    };
}
