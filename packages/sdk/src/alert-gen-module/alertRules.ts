import { 
    AlertRule, 
    AlertCategory, 
    AlertSeverity, 
    NotificationChannel,
    AlertRuleTemplate,
    AlertRuleCondition
} from "./types";

// Predefined alert rule templates
export const ALERT_RULE_TEMPLATES: AlertRuleTemplate[] = [
    {
        name: "High Latency Alert",
        description: "Triggers when average latency exceeds threshold",
        category: AlertCategory.LATENCY,
        severity: AlertSeverity.HIGH,
        conditions: [
            {
                field: "coreMetrics.latency.averageLatencyMs",
                operator: "gt",
                duration: 60000 // 1 minute
            }
        ],
        defaultValues: {
            value: 30000 // 30 seconds
        }
    },
    {
        name: "Critical Latency Alert", 
        description: "Triggers when average latency is critically high",
        category: AlertCategory.LATENCY,
        severity: AlertSeverity.CRITICAL,
        conditions: [
            {
                field: "coreMetrics.latency.averageLatencyMs",
                operator: "gt",
                duration: 30000 // 30 seconds
            }
        ],
        defaultValues: {
            value: 120000 // 2 minutes
        }
    },
    {
        name: "Low Success Rate Alert",
        description: "Triggers when success rate drops below threshold",
        category: AlertCategory.THROUGHPUT,
        severity: AlertSeverity.HIGH,
        conditions: [
            {
                field: "coreMetrics.throughput.successRate",
                operator: "lt",
                duration: 120000 // 2 minutes
            }
        ],
        defaultValues: {
            value: 95 // 95%
        }
    },
    {
        name: "Critical Success Rate Alert",
        description: "Triggers when success rate is critically low",
        category: AlertCategory.THROUGHPUT,
        severity: AlertSeverity.CRITICAL,
        conditions: [
            {
                field: "coreMetrics.throughput.successRate",
                operator: "lt",
                duration: 60000 // 1 minute
            }
        ],
        defaultValues: {
            value: 80 // 80%
        }
    },
    {
        name: "High Error Rate Alert",
        description: "Triggers when error rate exceeds threshold",
        category: AlertCategory.ERROR_RATE,
        severity: AlertSeverity.MEDIUM,
        conditions: [
            {
                field: "health.errorSummary.errorRate",
                operator: "gt",
                duration: 180000 // 3 minutes
            }
        ],
        defaultValues: {
            value: 5 // 5%
        }
    },
    {
        name: "System Down Alert",
        description: "Triggers when interop status is DOWN",
        category: AlertCategory.SYSTEM_STATUS,
        severity: AlertSeverity.CRITICAL,
        conditions: [
            {
                field: "status.interopStatus",
                operator: "eq"
            }
        ],
        defaultValues: {
            value: "DOWN"
        }
    },
    {
        name: "System Degraded Alert",
        description: "Triggers when interop status is DEGRADED",
        category: AlertCategory.SYSTEM_STATUS,
        severity: AlertSeverity.HIGH,
        conditions: [
            {
                field: "status.interopStatus",
                operator: "eq",
                duration: 300000 // 5 minutes
            }
        ],
        defaultValues: {
            value: "DEGRADED"
        }
    },
    {
        name: "Consecutive Failures Alert",
        description: "Triggers when there are consecutive failures",
        category: AlertCategory.CONSECUTIVE_FAILURES,
        severity: AlertSeverity.CRITICAL,
        conditions: [
            {
                field: "health.alerts",
                operator: "contains"
            }
        ],
        defaultValues: {
            value: "CONSECUTIVE_FAILURES"
        }
    },
    {
        name: "High Gas Usage Alert",
        description: "Triggers when average gas usage is unusually high",
        category: AlertCategory.GAS_USAGE,
        severity: AlertSeverity.MEDIUM,
        conditions: [
            {
                field: "coreMetrics.gas.averageSendGas",
                operator: "gt",
                duration: 600000 // 10 minutes
            }
        ],
        defaultValues: {
            value: 1000000 // 1M gas
        }
    },
    {
        name: "Severe Timing Delays Alert",
        description: "Triggers when message timing is severely delayed",
        category: AlertCategory.TIMING,
        severity: AlertSeverity.HIGH,
        conditions: [
            {
                field: "status.timingStatus",
                operator: "eq",
                duration: 180000 // 3 minutes
            }
        ],
        defaultValues: {
            value: "SEVERELY_DELAYED"
        }
    }
];

// Helper function to get default notification channels based on severity
function getDefaultChannelsForSeverity(severity: AlertSeverity): NotificationChannel[] {
    switch (severity) {
        case AlertSeverity.CRITICAL:
            return [NotificationChannel.EMAIL, NotificationChannel.SLACK, NotificationChannel.SMS];
        case AlertSeverity.HIGH:
            return [NotificationChannel.EMAIL, NotificationChannel.SLACK];
        case AlertSeverity.MEDIUM:
            return [NotificationChannel.SLACK];
        case AlertSeverity.LOW:
            return [NotificationChannel.SLACK];
        default:
            return [NotificationChannel.SLACK];
    }
}

// Helper function to get cooldown period based on severity
function getCooldownForSeverity(severity: AlertSeverity): number {
    switch (severity) {
        case AlertSeverity.CRITICAL:
            return 5 * 60 * 1000; // 5 minutes
        case AlertSeverity.HIGH:
            return 15 * 60 * 1000; // 15 minutes
        case AlertSeverity.MEDIUM:
            return 30 * 60 * 1000; // 30 minutes
        case AlertSeverity.LOW:
            return 60 * 60 * 1000; // 1 hour
        default:
            return 15 * 60 * 1000; // 15 minutes
    }
}

// Default alert rules based on templates
export const DEFAULT_ALERT_RULES: AlertRule[] = ALERT_RULE_TEMPLATES.map((template, index) => ({
    id: `rule_${template.category.toLowerCase()}_${index + 1}`,
    name: template.name,
    description: template.description,
    category: template.category,
    severity: template.severity,
    enabled: true,
    conditions: template.conditions.map(condition => ({
        ...condition,
        value: template.defaultValues.value
    })) as AlertRuleCondition[],
    channels: getDefaultChannelsForSeverity(template.severity),
    cooldownMs: getCooldownForSeverity(template.severity),
    metadata: {
        template: template.name,
        autoGenerated: true
    }
}));

// Rule validation function
export function validateAlertRule(rule: AlertRule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rule.id?.trim()) {
        errors.push("Rule ID is required");
    }

    if (!rule.name?.trim()) {
        errors.push("Rule name is required");
    }

    if (!rule.description?.trim()) {
        errors.push("Rule description is required");
    }

    if (!Object.values(AlertCategory).includes(rule.category)) {
        errors.push("Invalid alert category");
    }

    if (!Object.values(AlertSeverity).includes(rule.severity)) {
        errors.push("Invalid alert severity");
    }

    if (!rule.conditions || rule.conditions.length === 0) {
        errors.push("At least one condition is required");
    }

    if (rule.conditions) {
        rule.conditions.forEach((condition, index) => {
            if (!condition.field?.trim()) {
                errors.push(`Condition ${index + 1}: field is required`);
            }

            if (!['gt', 'gte', 'lt', 'lte', 'eq', 'neq', 'contains', 'in'].includes(condition.operator)) {
                errors.push(`Condition ${index + 1}: invalid operator`);
            }

            if (condition.value === undefined || condition.value === null) {
                errors.push(`Condition ${index + 1}: value is required`);
            }

            if (condition.duration !== undefined && condition.duration < 0) {
                errors.push(`Condition ${index + 1}: duration must be positive`);
            }
        });
    }

    if (!rule.channels || rule.channels.length === 0) {
        errors.push("At least one notification channel is required");
    }

    if (rule.channels) {
        rule.channels.forEach(channel => {
            if (!Object.values(NotificationChannel).includes(channel)) {
                errors.push(`Invalid notification channel: ${channel}`);
            }
        });
    }

    if (rule.cooldownMs < 0) {
        errors.push("Cooldown must be positive");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Rule creation from template
export function createRuleFromTemplate(
    template: AlertRuleTemplate, 
    id: string, 
    customValues?: Record<string, unknown>
): AlertRule {
    const values = { ...template.defaultValues, ...customValues };
    
    return {
        id,
        name: template.name,
        description: template.description,
        category: template.category,
        severity: template.severity,
        enabled: true,
        conditions: template.conditions.map(condition => ({
            ...condition,
            value: values[condition.field.split('.').pop() || 'value'] || values.value
        })) as AlertRuleCondition[],
        channels: getDefaultChannelsForSeverity(template.severity),
        cooldownMs: getCooldownForSeverity(template.severity),
        metadata: {
            template: template.name,
            customValues: customValues || {}
        }
    };
}

// Rule builder function
export function createAlertRule(config: {
    id: string;
    name: string;
    description: string;
    category: AlertCategory;
    severity: AlertSeverity;
    conditions: AlertRuleCondition[];
    channels?: NotificationChannel[];
    cooldownMs?: number;
    enabled?: boolean;
    metadata?: Record<string, unknown>;
}): AlertRule {
    return {
        id: config.id,
        name: config.name,
        description: config.description,
        category: config.category,
        severity: config.severity,
        enabled: config.enabled ?? true,
        conditions: config.conditions,
        channels: config.channels ?? getDefaultChannelsForSeverity(config.severity),
        cooldownMs: config.cooldownMs ?? getCooldownForSeverity(config.severity),
        metadata: config.metadata ?? {}
    };
}