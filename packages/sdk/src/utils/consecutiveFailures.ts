import { TrackingResult } from "../tracking-module/startTracking";

/**
 * Checks if the system should be considered DOWN based on consecutive failures
 * @param trackingData Array of tracking results
 * @param consecutiveCount Number of consecutive failures to check for (default: 5)
 * @returns true if:
 *   - There are N or more consecutive failures from the end, OR
 *   - There are fewer than N results but ALL are failures
 */
export function hasConsecutiveFailures(trackingData: TrackingResult[], consecutiveCount: number = 5): boolean {
    if (trackingData.length === 0) {
        return false;
    }

    // If we have fewer results than the threshold, check if ALL are failures
    if (trackingData.length < consecutiveCount) {
        return trackingData.every(result => !result.success);
    }

    // Get the last N results
    const lastResults = trackingData.slice(-consecutiveCount);
    
    // Check if all are failures
    return lastResults.every(result => !result.success);
}

/**
 * Gets the count of consecutive failures from the end of the tracking data
 * @param trackingData Array of tracking results
 * @returns Number of consecutive failures from the end
 */
export function getConsecutiveFailureCount(trackingData: TrackingResult[]): number {
    let count = 0;
    for (let i = trackingData.length - 1; i >= 0; i--) {
        if (!trackingData[i].success) {
            count++;
        } else {
            break;
        }
    }
    return count;
}
