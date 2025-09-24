import { InteropStatus } from "./determineInteropStatus";
import { HealthAlert } from "./generateHealthAlerts";
import { LatencyMetrics } from "./calculateLatencyMetrics";
import { ThroughputMetrics } from "./calculateThroughputMetrics";

export function generateRecommendations(
    interopStatus: InteropStatus,
    alerts: HealthAlert[],
    throughputMetrics: ThroughputMetrics,
    latencyMetrics: LatencyMetrics
): string[] {
    const recommendations: string[] = [];
    const failureRate = 100 - throughputMetrics.successRate;

    if (interopStatus === InteropStatus.DOWN) {
        recommendations.push("Immediate investigation required - interop messaging is down");
        recommendations.push("Check RPC endpoints and network connectivity");
        recommendations.push("Verify smart contract configurations");
    }

    if (interopStatus === InteropStatus.DEGRADED) {
        recommendations.push("Monitor system closely - performance is degraded");
    }

    // Failure rate specific recommendations
    if (failureRate > 20) {
        recommendations.push("Critical failure rate detected - immediate action required");
        recommendations.push("Check for network outages or infrastructure issues");
        recommendations.push("Review recent deployments or configuration changes");
    } else if (failureRate > 10) {
        recommendations.push("High failure rate detected - investigate error patterns");
        recommendations.push("Monitor RPC endpoint stability and response times");
    } else if (failureRate > 5) {
        recommendations.push("Elevated failure rate - consider proactive monitoring");
    }

    // Legacy success rate recommendations (kept for backwards compatibility)
    if (throughputMetrics.successRate < 90) {
        recommendations.push("Investigate frequent message failures");
        recommendations.push("Review error logs for common failure patterns");
    }

    if (latencyMetrics.averageLatencyMs > 60000) {
        recommendations.push("High latency detected - check network conditions");
    }

    // Check for specific alert types
    const hasFailureRateAlert = alerts.some(a => a.type.includes("FAILURE_RATE"));
    const hasConsecutiveFailuresAlert = alerts.some(a => a.type === "CONSECUTIVE_FAILURES");
    
    if (hasConsecutiveFailuresAlert) {
        recommendations.push("CRITICAL: Multiple consecutive failures detected - system is DOWN");
        recommendations.push("Check network connectivity between chains immediately");
        recommendations.push("Verify L2CrossDomainMessenger contracts are functioning");
        recommendations.push("Review recent infrastructure or configuration changes");
    }
    if (hasFailureRateAlert) {
        recommendations.push("Analyze failed transaction patterns and error types");
    }

    if (alerts.length === 0 && interopStatus === InteropStatus.ACTIVE) {
        recommendations.push("System is operating normally");
    }

    return recommendations;
}
