import { TrackingResult } from "../tracking-module/startTracking";
import { hasConsecutiveFailures, getConsecutiveFailureCount } from "../utils";
import { LatencyMetrics } from "./calculateLatencyMetrics";
import { ThroughputMetrics } from "./calculateThroughputMetrics";
import { MetricsConfig } from "./calculateTimingMetrics";

export enum HealthLevel {
    HEALTHY = "HEALTHY",
    WARNING = "WARNING", 
    CRITICAL = "CRITICAL",
    EMERGENCY = "EMERGENCY"
}

export interface HealthAlert {
    level: HealthLevel;
    type: string;
    message: string;
    count: number;
    firstOccurrence: Date;
    lastOccurrence: Date;
    context: Record<string, unknown>;
}

export function generateHealthAlerts(
    trackingData: TrackingResult[],
    latencyMetrics: LatencyMetrics,
    throughputMetrics: ThroughputMetrics,
    config: MetricsConfig
): HealthAlert[] {
    const alerts: HealthAlert[] = [];
    const failureRate = 100 - throughputMetrics.successRate;
    const failedData = trackingData.filter(d => !d.success);

    // Check for consecutive failures
    if (hasConsecutiveFailures(trackingData, config.consecutiveFailureThreshold)) {
        const consecutiveFailureCount = getConsecutiveFailureCount(trackingData);
        const isAllFailures = trackingData.length < config.consecutiveFailureThreshold && trackingData.every(r => !r.success);
        
        const message = isAllFailures 
            ? `System is DOWN: All ${trackingData.length} tracked attempts have failed`
            : `System is DOWN: ${consecutiveFailureCount} consecutive failures detected`;
            
        alerts.push({
            level: HealthLevel.CRITICAL,
            type: "CONSECUTIVE_FAILURES",
            message,
            count: consecutiveFailureCount,
            firstOccurrence: failedData.length > 0 ? new Date(Math.min(...failedData.slice(-consecutiveFailureCount).map(d => d.timestamp.getTime()))) : new Date(),
            lastOccurrence: failedData.length > 0 ? new Date(Math.max(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            context: {
                threshold: config.consecutiveFailureThreshold,
                actual: consecutiveFailureCount,
                failedMessages: throughputMetrics.failedMessages,
                totalMessages: throughputMetrics.totalMessages,
                isAllFailures
            }
        });
    }

    // High failure rate alerts (using the new failure rate thresholds)
    if (failureRate > config.criticalFailureRateThreshold) {
        alerts.push({
            level: HealthLevel.CRITICAL,
            type: "CRITICAL_FAILURE_RATE",
            message: `Failure rate is critically high at ${failureRate.toFixed(1)}%`,
            count: throughputMetrics.failedMessages,
            firstOccurrence: failedData.length > 0 ? new Date(Math.min(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            lastOccurrence: failedData.length > 0 ? new Date(Math.max(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            context: {
                threshold: config.criticalFailureRateThreshold,
                actual: failureRate,
                failedMessages: throughputMetrics.failedMessages,
                totalMessages: throughputMetrics.totalMessages,
                successRate: throughputMetrics.successRate
            }
        });
    } else if (failureRate > config.maxHealthyFailureRateThreshold) {
        alerts.push({
            level: HealthLevel.WARNING,
            type: "HIGH_FAILURE_RATE",
            message: `Failure rate is above healthy threshold at ${failureRate.toFixed(1)}%`,
            count: throughputMetrics.failedMessages,
            firstOccurrence: failedData.length > 0 ? new Date(Math.min(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            lastOccurrence: failedData.length > 0 ? new Date(Math.max(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            context: {
                threshold: config.maxHealthyFailureRateThreshold,
                actual: failureRate,
                failedMessages: throughputMetrics.failedMessages,
                totalMessages: throughputMetrics.totalMessages,
                successRate: throughputMetrics.successRate
            }
        });
    }

    // Legacy success rate alerts (kept for backwards compatibility)
    if (throughputMetrics.successRate < config.criticalSuccessRateThreshold) {
        alerts.push({
            level: HealthLevel.CRITICAL,
            type: "LOW_SUCCESS_RATE",
            message: `Success rate is critically low at ${throughputMetrics.successRate.toFixed(1)}%`,
            count: throughputMetrics.failedMessages,
            firstOccurrence: failedData.length > 0 ? new Date(Math.min(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            lastOccurrence: failedData.length > 0 ? new Date(Math.max(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            context: {
                threshold: config.criticalSuccessRateThreshold,
                actual: throughputMetrics.successRate,
                failedMessages: throughputMetrics.failedMessages,
                totalMessages: throughputMetrics.totalMessages
            }
        });
    } else if (throughputMetrics.successRate < config.healthySuccessRateThreshold) {
        alerts.push({
            level: HealthLevel.WARNING,
            type: "DEGRADED_SUCCESS_RATE",
            message: `Success rate is below healthy threshold at ${throughputMetrics.successRate.toFixed(1)}%`,
            count: throughputMetrics.failedMessages,
            firstOccurrence: failedData.length > 0 ? new Date(Math.min(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            lastOccurrence: failedData.length > 0 ? new Date(Math.max(...failedData.map(d => d.timestamp.getTime()))) : new Date(),
            context: {
                threshold: config.healthySuccessRateThreshold,
                actual: throughputMetrics.successRate
            }
        });
    }

    // High latency alert
    if (latencyMetrics.averageLatencyMs > config.criticalLatencyMs) {
        alerts.push({
            level: HealthLevel.CRITICAL,
            type: "CRITICAL_LATENCY",
            message: `Average latency is critically high at ${(latencyMetrics.averageLatencyMs / 1000).toFixed(1)}s`,
            count: 1,
            firstOccurrence: new Date(),
            lastOccurrence: new Date(),
            context: {
                threshold: config.criticalLatencyMs,
                actual: latencyMetrics.averageLatencyMs,
                p95: latencyMetrics.p95LatencyMs,
                p99: latencyMetrics.p99LatencyMs
            }
        });
    } else if (latencyMetrics.averageLatencyMs > config.maxHealthyLatencyMs) {
        alerts.push({
            level: HealthLevel.WARNING,
            type: "HIGH_LATENCY",
            message: `Average latency is above healthy threshold at ${(latencyMetrics.averageLatencyMs / 1000).toFixed(1)}s`,
            count: 1,
            firstOccurrence: new Date(),
            lastOccurrence: new Date(),
            context: {
                threshold: config.maxHealthyLatencyMs,
                actual: latencyMetrics.averageLatencyMs
            }
        });
    }

    return alerts;
}
