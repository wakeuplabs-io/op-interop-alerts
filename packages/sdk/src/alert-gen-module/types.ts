import { 
    InteropMetrics
} from "../metrics-gen-module/generateMetrics";
import { TrackingResult } from "../tracking-module/startTracking";

// Alert severity levels
export enum AlertSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

// Alert categories
export enum AlertCategory {
    LATENCY = "LATENCY",
    THROUGHPUT = "THROUGHPUT",
    ERROR_RATE = "ERROR_RATE",
    SYSTEM_STATUS = "SYSTEM_STATUS",
    CONSECUTIVE_FAILURES = "CONSECUTIVE_FAILURES",
    GAS_USAGE = "GAS_USAGE",
    TIMING = "TIMING"
}

// Alert notification channels
export enum NotificationChannel {
    EMAIL = "EMAIL",
    SLACK = "SLACK",
    WEBHOOK = "WEBHOOK",
    SMS = "SMS",
    DISCORD = "DISCORD",
    TELEGRAM = "TELEGRAM"
}

// Base alert interface
export interface Alert {
    id: string;
    timestamp: Date;
    severity: AlertSeverity;
    category: AlertCategory;
    title: string;
    message: string;
    metadata: Record<string, unknown>;
    resolved: boolean;
    resolvedAt?: Date;
}

// Alert context with metrics data
export interface AlertContext {
    metrics: InteropMetrics;
    trackingData: TrackingResult[];
    previousMetrics?: InteropMetrics;
    timeWindowMs: number;
}

// Alert rule condition interface
export interface AlertRuleCondition {
    field: string;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'contains' | 'in';
    value: number | string | boolean | Array<string | number>;
    duration?: number; // Duration in milliseconds for sustained conditions
}

// Alert rule interface
export interface AlertRule {
    id: string;
    name: string;
    description: string;
    category: AlertCategory;
    severity: AlertSeverity;
    enabled: boolean;
    conditions: AlertRuleCondition[];
    channels: NotificationChannel[];
    cooldownMs: number; // Minimum time between alerts of the same rule
    metadata?: Record<string, unknown>;
}

// Alert notification payload
export interface AlertNotification {
    alert: Alert;
    rule: AlertRule;
    context: AlertContext;
    channels: NotificationChannel[];
}

// Notification callback function type
export type AlertNotificationCallback = (notification: AlertNotification) => Promise<void> | void;

// Alert rule evaluation result
export interface AlertRuleEvaluationResult {
    rule: AlertRule;
    triggered: boolean;
    alert?: Alert;
    reason?: string;
}

// Alert manager configuration
export interface AlertManagerConfig {
    enabledCategories: AlertCategory[];
    defaultCooldownMs: number;
    maxAlertsPerMinute: number;
    retentionDays: number;
    notificationCallback: AlertNotificationCallback;
}

// Predefined rule templates
export interface AlertRuleTemplate {
    name: string;
    description: string;
    category: AlertCategory;
    severity: AlertSeverity;
    conditions: Omit<AlertRuleCondition, 'value'>[];
    defaultValues: Record<string, number | string | boolean>;
}

// Alert history entry
export interface AlertHistoryEntry {
    alert: Alert;
    rule: AlertRule;
    context: Partial<AlertContext>;
    notificationsSent: {
        channel: NotificationChannel;
        success: boolean;
        error?: string;
        timestamp: Date;
    }[];
}

// Alert statistics
export interface AlertStatistics {
    totalAlerts: number;
    alertsBySeverity: Record<AlertSeverity, number>;
    alertsByCategory: Record<AlertCategory, number>;
    alertsByRule: Record<string, number>;
    averageResolutionTimeMs: number;
    activeAlerts: number;
    resolvedAlerts: number;
}
