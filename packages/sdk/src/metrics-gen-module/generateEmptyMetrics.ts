import { InteropStatus } from "./determineInteropStatus";
import { MessageTimingStatus } from "./calculateTimingMetrics";
import { HealthLevel } from "./generateHealthAlerts";

// Main metrics interface
export interface InteropMetrics {
    // Status information
    status: {
        interopStatus: InteropStatus;
        timingStatus: MessageTimingStatus;
        healthLevel: HealthLevel;
        lastUpdateTimestamp: Date;
        dataWindowStart: Date;
        dataWindowEnd: Date;
    };
    
    // Core metrics
    coreMetrics: {
        latency: import('./calculateLatencyMetrics').LatencyMetrics;
        gas: import('./calculateGasMetrics').GasMetrics;
        throughput: import('./calculateThroughputMetrics').ThroughputMetrics;
        timing: import('./calculateTimingMetrics').TimingMetrics;
    };
    
    // Health and error information
    health: {
        alerts: import('./generateHealthAlerts').HealthAlert[];
        errorSummary: import('./calculateErrorSummary').ErrorSummary;
        recommendations: string[];
    };
}

export function generateEmptyMetrics(): InteropMetrics {
    return {
        status: {
            interopStatus: InteropStatus.UNKNOWN,
            timingStatus: MessageTimingStatus.ON_TIME,
            healthLevel: HealthLevel.HEALTHY,
            lastUpdateTimestamp: new Date(),
            dataWindowStart: new Date(),
            dataWindowEnd: new Date()
        },
        coreMetrics: {
            latency: {
                averageLatencyMs: 0,
                medianLatencyMs: 0,
                minLatencyMs: 0,
                maxLatencyMs: 0,
                p95LatencyMs: 0,
                p99LatencyMs: 0
            },
            gas: {
                averageSendGas: 0n,
                averageRelayGas: 0n,
                totalGasUsed: 0n,
                minSendGas: 0n,
                maxSendGas: 0n,
                minRelayGas: 0n,
                maxRelayGas: 0n
            },
            throughput: {
                totalMessages: 0,
                successfulMessages: 0,
                failedMessages: 0,
                successRate: 0,
                messagesPerHour: 0
            },
            timing: {
                onTimeMessages: 0,
                delayedMessages: 0,
                severelyDelayedMessages: 0,
                averageDelayMs: 0,
                timingStatus: MessageTimingStatus.ON_TIME
            }
        },
        health: {
            alerts: [],
            errorSummary: {
                sendErrors: {},
                relayErrors: {},
                totalErrors: 0,
                errorRate: 0
            },
            recommendations: ["No data available for analysis"]
        }
    };
}
