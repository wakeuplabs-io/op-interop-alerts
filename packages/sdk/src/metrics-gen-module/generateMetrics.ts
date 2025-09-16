import { TrackingResult } from "../tracking-module/startTracking";
import { calculateLatencyMetrics, LatencyMetrics } from "./calculateLatencyMetrics";
import { calculateGasMetrics, GasMetrics } from "./calculateGasMetrics";
import { calculateThroughputMetrics, ThroughputMetrics } from "./calculateThroughputMetrics";
import { calculateTimingMetrics, TimingMetrics, MessageTimingStatus, MetricsConfig } from "./calculateTimingMetrics";
import { calculateErrorSummary, ErrorSummary } from "./calculateErrorSummary";
import { generateHealthAlerts, HealthAlert, HealthLevel } from "./generateHealthAlerts";
import { determineInteropStatus, InteropStatus } from "./determineInteropStatus";
import { determineHealthLevel } from "./determineHealthLevel";
import { generateRecommendations } from "./generateRecommendations";
import { generateEmptyMetrics, InteropMetrics } from "./generateEmptyMetrics";

// Re-export types and enums from individual modules
export { InteropStatus } from "./determineInteropStatus";
export { MessageTimingStatus } from "./calculateTimingMetrics";
export type { MetricsConfig, TimingMetrics } from "./calculateTimingMetrics";
export { HealthLevel } from "./generateHealthAlerts";
export type { HealthAlert } from "./generateHealthAlerts";
export type { LatencyMetrics } from "./calculateLatencyMetrics";
export type { GasMetrics } from "./calculateGasMetrics";
export type { ThroughputMetrics } from "./calculateThroughputMetrics";
export type { ErrorSummary } from "./calculateErrorSummary";
export type { InteropMetrics } from "./generateEmptyMetrics";

const DEFAULT_CONFIG: MetricsConfig = {
    delayThresholdMs: 60000, // 1 minute
    severeDelayThresholdMs: 300000, // 5 minutes
    healthySuccessRateThreshold: 95, // 95%
    criticalSuccessRateThreshold: 80, // 80%
    maxHealthyLatencyMs: 30000, // 30 seconds
    criticalLatencyMs: 120000, // 2 minutes
    maxHealthyFailureRateThreshold: 5, // 5% - above this is degraded
    criticalFailureRateThreshold: 20, // 20% - above this is critical
    consecutiveFailureThreshold: 5 // 5 consecutive failures before system is down
};

export function generateMetrics(
    trackingData: TrackingResult[],
    config: MetricsConfig = DEFAULT_CONFIG
): InteropMetrics {
    if (trackingData.length === 0) {
        return generateEmptyMetrics();
    }

    // Keep only the last 100 tracking data entries
    const limitedTrackingData = trackingData.slice(-100);

    const successfulData = limitedTrackingData.filter(d => d.success && d.data);
    
    const latencyMetrics = calculateLatencyMetrics(successfulData);
    const gasMetrics = calculateGasMetrics(successfulData);
    const throughputMetrics = calculateThroughputMetrics(limitedTrackingData);
    const timingMetrics = calculateTimingMetrics(successfulData, config);
    const errorSummary = calculateErrorSummary(limitedTrackingData);
    const healthAlerts = generateHealthAlerts(limitedTrackingData, latencyMetrics, throughputMetrics, config);
    
    const interopStatus = determineInteropStatus(throughputMetrics, latencyMetrics, config, limitedTrackingData);
    const healthLevel = determineHealthLevel(healthAlerts);
    
    const dataWindowStart = new Date(Math.min(...limitedTrackingData.map(d => d.timestamp.getTime())));
    const dataWindowEnd = new Date(Math.max(...limitedTrackingData.map(d => d.timestamp.getTime())));

    const recommendations = generateRecommendations(interopStatus, healthAlerts, throughputMetrics, latencyMetrics);

    return {
        status: {
            interopStatus,
            timingStatus: timingMetrics.timingStatus,
            healthLevel,
            lastUpdateTimestamp: new Date(),
            dataWindowStart,
            dataWindowEnd
        },
        coreMetrics: {
            latency: latencyMetrics,
            gas: gasMetrics,
            throughput: throughputMetrics,
            timing: timingMetrics
        },
        health: {
            alerts: healthAlerts,
            errorSummary,
            recommendations
        }
    };
}