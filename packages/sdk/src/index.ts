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

// Alert generation module
import { 
    processAlerts,
    evaluateRule,
    evaluateCondition,
    createAlert,
    createAlertContext,
    createSimpleNotificationCallback,
    isInCooldown,
    setCooldown,
    checkDurationCondition,
    cleanupConditionStates,
    cleanupCooldowns
} from "./alert-gen-module/processAlerts";
import { 
    validateAlertRule, 
    createRuleFromTemplate, 
    createAlertRule,
    DEFAULT_ALERT_RULES, 
    ALERT_RULE_TEMPLATES 
} from "./alert-gen-module/alertRules";
import type {
    Alert,
    AlertContext,
    AlertRule,
    AlertRuleCondition,
    AlertRuleEvaluationResult,
    AlertNotification,
    AlertNotificationCallback,
    AlertRuleTemplate
} from "./alert-gen-module/types";
import {
    AlertSeverity,
    AlertCategory,
    NotificationChannel
} from "./alert-gen-module/types";

export { 
    startTracking, 
    sendPing, 
    waitForRelayedMessage, 
    generateMetrics, 
    hasConsecutiveFailures, 
    getConsecutiveFailureCount, 
    percentile,
    // Alert generation exports
    processAlerts,
    evaluateRule,
    evaluateCondition,
    createAlert,
    createAlertContext,
    createSimpleNotificationCallback,
    isInCooldown,
    setCooldown,
    checkDurationCondition,
    cleanupConditionStates,
    cleanupCooldowns,
    validateAlertRule,
    createRuleFromTemplate,
    createAlertRule,
    DEFAULT_ALERT_RULES,
    ALERT_RULE_TEMPLATES,
    AlertSeverity,
    AlertCategory,
    NotificationChannel
};
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
    MetricsConfig,
    // Alert generation types
    Alert,
    AlertContext,
    AlertRule,
    AlertRuleCondition,
    AlertRuleEvaluationResult,
    AlertNotification,
    AlertNotificationCallback,
    AlertRuleTemplate
};