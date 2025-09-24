import { TrackingResult } from "../tracking-module/startTracking";
import { hasConsecutiveFailures } from "../utils";
import { LatencyMetrics } from "./calculateLatencyMetrics";
import { ThroughputMetrics } from "./calculateThroughputMetrics";
import { MetricsConfig } from "./calculateTimingMetrics";

export enum InteropStatus {
    ACTIVE = "ACTIVE",
    DEGRADED = "DEGRADED", 
    DOWN = "DOWN",
    UNKNOWN = "UNKNOWN"
}

export function determineInteropStatus(
    throughputMetrics: ThroughputMetrics,
    latencyMetrics: LatencyMetrics,
    config: MetricsConfig,
    trackingData: TrackingResult[]
): InteropStatus {
    if (throughputMetrics.totalMessages === 0) {
        return InteropStatus.UNKNOWN;
    }

    // Check for consecutive failures first - this takes priority
    if (hasConsecutiveFailures(trackingData, config.consecutiveFailureThreshold)) {
        return InteropStatus.DOWN;
    }

    // Calculate failure rate (inverse of success rate)
    const failureRate = 100 - throughputMetrics.successRate;

    if (throughputMetrics.successRate === 0) {
        return InteropStatus.DOWN;
    }

    // Check critical thresholds - any of these conditions means system is DOWN
    if (throughputMetrics.successRate < config.criticalSuccessRateThreshold || 
        latencyMetrics.averageLatencyMs > config.criticalLatencyMs ||
        failureRate > config.criticalFailureRateThreshold) {
        return InteropStatus.DOWN;
    }

    // Check healthy thresholds - any of these conditions means system is DEGRADED
    if (throughputMetrics.successRate < config.healthySuccessRateThreshold || 
        latencyMetrics.averageLatencyMs > config.maxHealthyLatencyMs ||
        failureRate > config.maxHealthyFailureRateThreshold) {
        return InteropStatus.DEGRADED;
    }

    return InteropStatus.ACTIVE;
}
