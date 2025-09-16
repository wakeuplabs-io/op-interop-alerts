import { TrackingResult } from "../tracking-module/startTracking";
import { SendPingResultStatus } from "../tracking-module/sendPing";
import { WaitForRelayedMessageResultStatus } from "../tracking-module/waitForRelayedMessage";

export interface ErrorSummary {
    sendErrors: {
        [key in SendPingResultStatus]?: number;
    };
    relayErrors: {
        [key in WaitForRelayedMessageResultStatus]?: number;
    };
    totalErrors: number;
    errorRate: number; // percentage
}

export function calculateErrorSummary(trackingData: TrackingResult[]): ErrorSummary {
    const sendErrors: { [key in SendPingResultStatus]?: number } = {};
    const relayErrors: { [key in WaitForRelayedMessageResultStatus]?: number } = {};
    
    let totalErrors = 0;

    trackingData.forEach(d => {
        if (!d.success && d.error) {
            totalErrors++;
            
            if ('status' in d.error) {
                if (Object.values(SendPingResultStatus).includes(d.error.status as SendPingResultStatus)) {
                    const status = d.error.status as SendPingResultStatus;
                    sendErrors[status] = (sendErrors[status] || 0) + 1;
                } else if (Object.values(WaitForRelayedMessageResultStatus).includes(d.error.status as WaitForRelayedMessageResultStatus)) {
                    const status = d.error.status as WaitForRelayedMessageResultStatus;
                    relayErrors[status] = (relayErrors[status] || 0) + 1;
                }
            }
        }
    });

    const errorRate = trackingData.length > 0 ? (totalErrors / trackingData.length) * 100 : 0;

    return {
        sendErrors,
        relayErrors,
        totalErrors,
        errorRate
    };
}
