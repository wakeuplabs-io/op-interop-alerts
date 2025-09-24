import { 
    AlertRule, 
    AlertRuleCondition, 
    AlertContext, 
    Alert, 
    AlertSeverity,
    AlertRuleEvaluationResult,
    AlertNotification,
    AlertNotificationCallback,
    NotificationChannel
} from "./types";
import { InteropMetrics } from "../metrics-gen-module/generateMetrics";
import { TrackingResult } from "../tracking-module/startTracking";

// Utility to get nested property value from object
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
        if (current && typeof current === 'object' && key in current) {
            return (current as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
}

// Condition evaluation
export function evaluateCondition(condition: AlertRuleCondition, context: AlertContext): boolean {
    const value = getNestedValue(context.metrics as unknown as Record<string, unknown>, condition.field);
    
    if (value === undefined || value === null) {
        return false;
    }

    return compareValues(value, condition.operator, condition.value);
}

function compareValues(
    actualValue: unknown, 
    operator: AlertRuleCondition['operator'], 
    expectedValue: AlertRuleCondition['value']
): boolean {
    switch (operator) {
        case 'gt':
            return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue > expectedValue;
        
        case 'gte':
            return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue >= expectedValue;
        
        case 'lt':
            return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue < expectedValue;
        
        case 'lte':
            return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue <= expectedValue;
        
        case 'eq':
            return actualValue === expectedValue;
        
        case 'neq':
            return actualValue !== expectedValue;
        
        case 'contains':
            if (Array.isArray(actualValue) && typeof expectedValue === 'string') {
                return actualValue.some(item => 
                    typeof item === 'object' && item !== null && 
                    'type' in item && item.type === expectedValue
                );
            }
            return typeof actualValue === 'string' && typeof expectedValue === 'string' && 
                   actualValue.includes(expectedValue);
        
        case 'in':
            return Array.isArray(expectedValue) && expectedValue.includes(actualValue as string | number);
        
        default:
            return false;
    }
}

// Alert state tracking for duration-based conditions
interface ConditionState {
    startTime: Date;
    lastTriggered: Date;
    isActive: boolean;
}

const conditionStates = new Map<string, ConditionState>();

export function checkDurationCondition(
    ruleId: string, 
    conditionIndex: number, 
    condition: AlertRuleCondition, 
    isTriggered: boolean
): boolean {
    const key = `${ruleId}_${conditionIndex}`;
    const now = new Date();
    
    if (!condition.duration) {
        return isTriggered;
    }

    const state = conditionStates.get(key);

    if (isTriggered) {
        if (!state || !state.isActive) {
            // Start tracking this condition
            conditionStates.set(key, {
                startTime: now,
                lastTriggered: now,
                isActive: true
            });
            return false; // Not enough duration yet
        } else {
            // Update last triggered time
            state.lastTriggered = now;
            
            // Check if enough time has passed
            const elapsedMs = now.getTime() - state.startTime.getTime();
            return elapsedMs >= condition.duration;
        }
    } else {
        // Condition is not triggered, reset state
        if (state) {
            state.isActive = false;
        }
        return false;
    }
}

// Alert cooldown management
const cooldowns = new Map<string, Date>();

export function isInCooldown(ruleId: string, cooldownMs: number): boolean {
    const lastAlert = cooldowns.get(ruleId);
    if (!lastAlert) {
        return false;
    }

    const now = new Date();
    return (now.getTime() - lastAlert.getTime()) < cooldownMs;
}

export function setCooldown(ruleId: string): void {
    cooldowns.set(ruleId, new Date());
}

// Alert creation
export function createAlert(rule: AlertRule, context: AlertContext): Alert {
    const id = `${rule.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
        id,
        timestamp: new Date(),
        severity: rule.severity,
        category: rule.category,
        title: rule.name,
        message: generateAlertMessage(rule, context),
        metadata: {
            ruleId: rule.id,
            ruleName: rule.name,
            conditions: rule.conditions,
            metricsSnapshot: extractRelevantMetrics(rule, context),
            ...rule.metadata
        },
        resolved: false
    };
}

function generateAlertMessage(rule: AlertRule, context: AlertContext): string {
    let message = rule.description;

    // Add specific context based on rule conditions
    for (const condition of rule.conditions) {
        const actualValue = getNestedValue(context.metrics as unknown as Record<string, unknown>, condition.field);
        
        if (actualValue !== undefined) {
            const fieldName = condition.field.split('.').pop() || condition.field;
            
            if (typeof actualValue === 'number') {
                const unit = getUnitForField(condition.field);
                message += ` Current ${fieldName}: ${formatValue(actualValue, unit)}.`;
            } else if (Array.isArray(actualValue)) {
                message += ` Current ${fieldName}: ${formatArrayValue(actualValue, condition.field)}.`;
            } else if (typeof actualValue === 'object' && actualValue !== null) {
                message += ` Current ${fieldName}: ${formatObjectValue(actualValue as Record<string, unknown>, condition.field)}.`;
            } else {
                message += ` Current ${fieldName}: ${String(actualValue)}.`;
            }
        }
    }

    // Add timing context
    const windowDuration = context.timeWindowMs / (60 * 1000); // Convert to minutes
    message += ` Data window: ${windowDuration} minutes.`;

    return message;
}

function extractRelevantMetrics(rule: AlertRule, context: AlertContext): Record<string, unknown> {
    const relevant: Record<string, unknown> = {};
    
    for (const condition of rule.conditions) {
        const value = getNestedValue(context.metrics as unknown as Record<string, unknown>, condition.field);
        if (value !== undefined) {
            relevant[condition.field] = value;
        }
    }

    // Always include basic status info
    relevant['interopStatus'] = context.metrics.status.interopStatus;
    relevant['healthLevel'] = context.metrics.status.healthLevel;
    relevant['lastUpdateTimestamp'] = context.metrics.status.lastUpdateTimestamp;

    return relevant;
}

function getUnitForField(field: string): string {
    if (field.includes('latency') || field.includes('delay') || field.includes('Ms')) {
        return 'ms';
    }
    if (field.includes('rate') || field.includes('Rate')) {
        return '%';
    }
    if (field.includes('gas') || field.includes('Gas')) {
        return 'gas';
    }
    if (field.includes('messages') || field.includes('Messages')) {
        return 'messages';
    }
    return '';
}

function formatValue(value: number, unit: string): string {
    switch (unit) {
        case 'ms':
            if (value >= 60000) {
                return `${(value / 60000).toFixed(1)} minutes`;
            } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)} seconds`;
            }
            return `${value} ms`;
        
        case '%':
            return `${value.toFixed(1)}%`;
        
        case 'gas':
            if (value >= 1000000) {
                return `${(value / 1000000).toFixed(2)}M gas`;
            } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K gas`;
            }
            return `${value} gas`;
        
        case 'messages':
            return `${value} messages`;
        
        default:
            return String(value);
    }
}

function formatArrayValue(value: unknown[], field: string): string {
    if (value.length === 0) {
        return 'none';
    }
    
    // Handle health alerts specifically
    if (field.includes('alerts') && value.length > 0 && typeof value[0] === 'object') {
        const alerts = value as Array<{ type?: string; level?: string; message?: string; count?: number }>;
        return alerts.map(alert => {
            if (alert.type && alert.level) {
                return `${alert.level}: ${alert.type}${alert.count ? ` (${alert.count})` : ''}`;
            } else if (alert.type) {
                return alert.type;
            }
            return 'Unknown alert';
        }).join(', ');
    }
    
    // For other arrays, show count and first few items
    if (value.length <= 3) {
        return value.map(item => String(item)).join(', ');
    } else {
        return `${value.length} items: ${value.slice(0, 2).map(item => String(item)).join(', ')}, ...`;
    }
}

function formatObjectValue(value: Record<string, unknown>, field: string): string {
    // Handle specific object types based on field
    if (field.includes('error') && 'message' in value) {
        return String(value.message);
    }
    
    // For general objects, show key count or main properties
    const keys = Object.keys(value);
    if (keys.length === 0) {
        return 'empty';
    } else if (keys.length <= 3) {
        return keys.map(key => `${key}: ${String(value[key])}`).join(', ');
    } else {
        return `${keys.length} properties`;
    }
}

// Rule evaluation
export function evaluateRule(rule: AlertRule, context: AlertContext): AlertRuleEvaluationResult {
    // Check cooldown first
    if (isInCooldown(rule.id, rule.cooldownMs)) {
        return {
            rule,
            triggered: false,
            reason: "Rule is in cooldown period"
        };
    }

    // Evaluate all conditions
    const conditionResults = rule.conditions.map((condition, index) => {
        const isTriggered = evaluateCondition(condition, context);
        return checkDurationCondition(rule.id, index, condition, isTriggered);
    });

    // All conditions must be true for rule to trigger
    const allConditionsMet = conditionResults.every(result => result);

    if (!allConditionsMet) {
        return {
            rule,
            triggered: false,
            reason: "Not all conditions are met"
        };
    }

    // Create alert
    const alert = createAlert(rule, context);
    
    // Set cooldown
    setCooldown(rule.id);

    return {
        rule,
        triggered: true,
        alert
    };
}

// Main alert processing function
export async function processAlerts(
    rules: AlertRule[], 
    context: AlertContext,
    notificationCallback?: AlertNotificationCallback
): Promise<AlertRuleEvaluationResult[]> {
    const results: AlertRuleEvaluationResult[] = [];

    for (const rule of rules) {
        if (!rule.enabled) {
            results.push({
                rule,
                triggered: false,
                reason: "Rule is disabled"
            });
            continue;
        }

        const evaluationResult = evaluateRule(rule, context);
        results.push(evaluationResult);

        if (evaluationResult.triggered && evaluationResult.alert && notificationCallback) {
            await sendNotification({
                alert: evaluationResult.alert,
                rule,
                context
            }, notificationCallback);
        }
    }

    // Cleanup old state periodically
    cleanupConditionStates();
    cleanupCooldowns();

    return results;
}

async function sendNotification(
    notification: AlertNotification, 
    callback: AlertNotificationCallback
): Promise<void> {
    try {
        await callback(notification);
    } catch (error) {
        console.error('Failed to send alert notification:', error);
    }
}

// Cleanup functions
export function cleanupConditionStates(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = new Date(Date.now() - olderThanMs);
    
    for (const [key, state] of conditionStates.entries()) {
        if (state.lastTriggered < cutoffTime && !state.isActive) {
            conditionStates.delete(key);
        }
    }
}

export function cleanupCooldowns(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = new Date(Date.now() - olderThanMs);
    
    for (const [ruleId, lastAlert] of cooldowns.entries()) {
        if (lastAlert < cutoffTime) {
            cooldowns.delete(ruleId);
        }
    }
}

// Utility functions for creating alert contexts
export function createAlertContext(
    metrics: InteropMetrics,
    trackingData: TrackingResult[],
    previousMetrics?: InteropMetrics,
    timeWindowMs: number = 60 * 60 * 1000 // Default 1 hour
): AlertContext {
    return {
        metrics,
        trackingData,
        previousMetrics,
        timeWindowMs
    };
}

export function createSimpleNotificationCallback(
    callbacks: Partial<Record<NotificationChannel, (notification: AlertNotification) => Promise<void> | void>>
): AlertNotificationCallback {
    return async (notification: AlertNotification) => {
        const promises: Promise<void>[] = [];

        // If channels are specified, use them
        if (notification.channels && notification.channels.length > 0) {
            for (const channel of notification.channels) {
                const callback = callbacks[channel];
                if (callback) {
                    const result = callback(notification);
                    if (result instanceof Promise) {
                        promises.push(result);
                    }
                } else {
                    console.warn(`⚠️  No callback configured for notification channel: ${channel}. Skipping...`);
                }
            }
        } else {
            // If no channels specified, call all available callbacks
            // This allows developers to handle notification routing based on severity inside their callbacks
            for (const [channel, callback] of Object.entries(callbacks)) {
                if (callback) {
                    const result = callback(notification);
                    if (result instanceof Promise) {
                        promises.push(result);
                    }
                }
            }
        }

        if (promises.length > 0) {
            await Promise.allSettled(promises);
        }
    };
}
