import { startTracking } from "./tracking-module/startTracking";
import type { 
    EventData, 
    TrackingCallbackData, 
    TrackingCallback,
    SentMessageEvent,
    RelayedMessageEvent,
    SentMessageEventData,
    RelayedMessageEventData,
    TrackingResult
} from "./tracking-module/startTracking";

import { sendPing } from "./tracking-module/sendPing";
import type {
    SendPingResult,
    SendPingSuccessResult,
    SendPingFailedResult,
    SendPingResultStatus
} from "./tracking-module/sendPing";

import { waitForRelayedMessage } from "./tracking-module/waitForRelayedMessage";
import type {
    WaitForRelayedMessageResult,
    WaitForRelayedMessageSuccessResult,
    WaitForRelayedMessageFailedResult,
    WaitForRelayedMessageResultStatus
} from "./tracking-module/waitForRelayedMessage";

import { generateMetrics } from "./metrics-gen-module/generateMetrics";
import type {
    InteropMetrics,
    InteropStatus,
    MessageTimingStatus,
    HealthLevel,
    LatencyMetrics,
    GasMetrics,
    ThroughputMetrics,
    TimingMetrics,
    HealthAlert,
    ErrorSummary,
    MetricsConfig
} from "./metrics-gen-module/generateMetrics";

import { hasConsecutiveFailures, getConsecutiveFailureCount, percentile } from "./utils";

export { startTracking, sendPing, waitForRelayedMessage, generateMetrics, hasConsecutiveFailures, getConsecutiveFailureCount, percentile };
export type { 
    EventData, 
    TrackingCallbackData, 
    TrackingCallback,
    SentMessageEvent,
    RelayedMessageEvent,
    SentMessageEventData,
    RelayedMessageEventData,
    TrackingResult,
    SendPingResult,
    SendPingSuccessResult,
    SendPingFailedResult,
    SendPingResultStatus,
    WaitForRelayedMessageResult,
    WaitForRelayedMessageSuccessResult,
    WaitForRelayedMessageFailedResult,
    WaitForRelayedMessageResultStatus,
    InteropMetrics,
    InteropStatus,
    MessageTimingStatus,
    HealthLevel,
    LatencyMetrics,
    GasMetrics,
    ThroughputMetrics,
    TimingMetrics,
    HealthAlert,
    ErrorSummary,
    MetricsConfig
};