# Alert Generation Module

The alert generation module provides a comprehensive system for creating and managing alerts based on interoperability metrics. It uses all types from the metrics generation module and tracking module to create rule-based alerts with configurable notification callbacks.

## Features

- **Configurable Rules**: Define custom rules with complex conditions
- **Notification Callbacks**: Integration with email, Slack, SMS, Discord, Telegram, webhooks
- **State Management**: Duration-based conditions and cooldown periods
- **Rate Limiting**: Prevents alert spam
- **Complete History**: Tracks all alerts and notifications
- **Detailed Statistics**: Metrics about alert system performance
- **Full TypeScript**: Strict typing without any usage

## Main Functions

### processAlerts

Processes a set of rules against metrics data and triggers notifications.

### evaluateRule

Evaluates a single rule against the current context.

### evaluateCondition

Evaluates a single condition within a rule.

### createAlert

Creates a new alert based on a triggered rule.

### createAlertContext

Creates an alert context from metrics and tracking data.

### createSimpleNotificationCallback

Creates a notification callback that routes to different channels.

## Rule Management

### validateAlertRule

Validates an alert rule configuration.

### createRuleFromTemplate

Creates a rule from a predefined template.

### createAlertRule

Creates a custom alert rule.

## Types

The module defines comprehensive types for alerts, rules, conditions, notifications, and contexts. All types are fully typed without any usage.

## Alert Categories

- LATENCY: Latency-related alerts
- THROUGHPUT: Message throughput alerts  
- ERROR_RATE: Error rate alerts
- SYSTEM_STATUS: System status alerts
- CONSECUTIVE_FAILURES: Consecutive failure alerts
- GAS_USAGE: Gas usage alerts
- TIMING: Message timing alerts

## Alert Severities

- LOW: Low priority alerts
- MEDIUM: Medium priority alerts
- HIGH: High priority alerts
- CRITICAL: Critical priority alerts

## Notification Channels

- EMAIL: Email notifications
- SLACK: Slack notifications
- SMS: SMS notifications
- WEBHOOK: Webhook notifications
- DISCORD: Discord notifications
- TELEGRAM: Telegram notifications

## Predefined Rules

The module includes predefined rules for common scenarios:

- High and critical latency alerts
- Low and critical success rate alerts
- High error rate alerts
- System down and degraded alerts
- Consecutive failure detection
- High gas usage alerts
- Severe timing delay alerts

## Usage Pattern

The module follows the same functional pattern as other modules in the SDK. Import the required functions and types, configure your rules and notification callbacks, then process alerts based on your metrics data.

All functions are pure and stateless where possible, with minimal internal state management for duration tracking and cooldowns.
