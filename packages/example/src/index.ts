import { 
    startTracking, 
    TrackingResult, 
    generateMetrics, 
    InteropMetrics, 
    hasConsecutiveFailures, 
    getConsecutiveFailureCount,
    // Alert generation imports
    processAlerts,
    createAlertContext,
    createSimpleNotificationCallback,
    DEFAULT_ALERT_RULES,
    AlertNotification,
    AlertNotificationCallback,
    NotificationChannel
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoOpSepoliaToBaseSepolia as chainsInfo } from './utils';
import { config } from 'dotenv';
import { formatTimeDifference } from './utils';

// Load environment variables
config();

/**
 * OP Interop Alerts Example - New Flexible Notification System
 * 
 * With the updated SDK, developers have complete control over how alerts are handled.
 * The SDK no longer dictates notification channels - instead, it provides:
 * - Alert severity level (CRITICAL, HIGH, MEDIUM, LOW)
 * - Complete alert information
 * - Developer decides routing based on severity
 * 
 * This example demonstrates:
 * - Different handling for different severity levels
 * - Flexibility to add multiple channels for critical alerts
 * - Clean separation of concerns
 */

// Private keys from environment variables
const pksInfo = {
    origin: process.env.ORIGIN_PRIVATE_KEY as `0x${string}`,
    destination: process.env.DESTINATION_PRIVATE_KEY as `0x${string}`,
};

// Slack configuration from environment variables
const slackConfig = {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_CHANNEL || '#alerts',
    username: process.env.SLACK_USERNAME || 'OP Interop Alerts',
    iconEmoji: process.env.SLACK_ICON_EMOJI || ':warning:'
};

// Validate required environment variables
if (!pksInfo.origin) {
    console.error('❌ Error: ORIGIN_PRIVATE_KEY environment variable is required');
    process.exit(1);
}

if (!pksInfo.destination) {
    console.error('❌ Error: DESTINATION_PRIVATE_KEY environment variable is required');
    process.exit(1);
}

// Validate Slack configuration
if (!slackConfig.webhookUrl) {
    console.warn('⚠️  Warning: No Slack webhook URL configured. Alerts will only be logged to console.');
    console.warn('   Configure SLACK_WEBHOOK_URL to enable Slack notifications.');
}

// Interval in minutes between tracking cycles
const intervalMinutes = parseInt(process.env.TRACKING_INTERVAL_MINUTES || "10");

// Memory storage for tracking results
const trackingResults: TrackingResult[] = [];
const METRICS_THRESHOLD = 1;

// Status reporting configuration
const STATUS_REPORT_INTERVAL = 10; // Send status every 10 iterations
let iterationCount = 0;
const startTime = Date.now();

// Slack notification functions
async function sendSlackMessage(message: string, severity: string = 'info'): Promise<boolean> {
    if (!slackConfig.webhookUrl) {
        return false;
    }
    
    const color = getSeverityColor(severity);
    const emoji = getSeverityEmoji(severity);
    
    return await sendSlackWebhook(message, color, emoji);
}

async function sendSlackWebhook(message: string, color: string, emoji: string): Promise<boolean> {
    try {
        const payload = {
            username: slackConfig.username,
            icon_emoji: emoji,
            channel: slackConfig.channel,
            attachments: [{
                color: color,
                text: message,
                ts: Math.floor(Date.now() / 1000)
            }]
        };

        const response = await fetch(slackConfig.webhookUrl!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`❌ Slack webhook error: ${response.status} ${response.statusText}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending Slack webhook:', error);
        return false;
    }
}


function getSeverityColor(severity: string): string {
    switch (severity.toUpperCase()) {
        case 'CRITICAL': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return '#ff9500'; // Orange
        case 'LOW': return 'good';
        default: return '#36a64f'; // Green
    }
}

function getSeverityEmoji(severity: string): string {
    switch (severity.toUpperCase()) {
        case 'CRITICAL': return ':rotating_light:';
        case 'HIGH': return ':warning:';
        case 'MEDIUM': return ':large_orange_diamond:';
        case 'LOW': return ':information_source:';
        default: return ':bell:';
    }
}

// Create alert notification callback that handles notifications based on severity
// The SDK no longer dictates channels - developers have full control based on severity
const alertNotificationCallback: AlertNotificationCallback = async (notification: AlertNotification) => {
    const { alert, rule, context } = notification;
    
    console.log(`🚨 ALERT TRIGGERED: [${alert.severity}] ${alert.title}`);
    
    // Handle notifications based on severity level
    switch (alert.severity) {
        case 'CRITICAL':
            // For critical alerts: Send to Slack and could add more channels
            await handleCriticalAlert(alert, rule, context);
            break;
        
        case 'HIGH':
            // For high alerts: Send to Slack (could add email here)
            await handleHighAlert(alert, rule, context);
            break;
        
        case 'MEDIUM':
        case 'LOW':
        default:
            // For medium/low alerts: Just Slack
            await handleStandardAlert(alert, rule, context);
            break;
    }
};

// Helper functions to handle different severity levels
async function handleCriticalAlert(alert: any, rule: any, context: any) {
    console.log('🚨 CRITICAL ALERT - Sending to all available channels');
    
    const slackMessage = formatAlertForSlack(alert, rule, context);
    const success = await sendSlackMessage(slackMessage, alert.severity);
    
    if (success) {
        console.log('✅ Critical alert sent to Slack successfully');
    } else {
        console.log('❌ Failed to send critical alert to Slack');
    }
    
    // In a real implementation, you might also:
    // - Send SMS to on-call engineer
    // - Send email to multiple recipients
    // - Create PagerDuty incident
    // - Send to multiple Slack channels
}

async function handleHighAlert(alert: any, rule: any, context: any) {
    console.log('⚠️  HIGH ALERT - Sending to primary channels');
    
    const slackMessage = formatAlertForSlack(alert, rule, context);
    const success = await sendSlackMessage(slackMessage, alert.severity);
    
    if (success) {
        console.log('✅ High alert sent to Slack successfully');
    } else {
        console.log('❌ Failed to send high alert to Slack');
    }
    
    // Could also send email here for high severity
}

async function handleStandardAlert(alert: any, rule: any, context: any) {
    const slackMessage = formatAlertForSlack(alert, rule, context);
    const success = await sendSlackMessage(slackMessage, alert.severity);
    
    if (success) {
        console.log('✅ Alert sent to Slack successfully');
    } else {
        console.log('❌ Failed to send alert to Slack');
    }
};

function formatAlertForSlack(alert: any, rule: any, context: any): string {
    const timestamp = alert.timestamp.toISOString();
    const duration = context.timeWindowMs / (60 * 1000); // Convert to minutes
    
    let message = `*🚨 ${alert.title}*\n`;
    message += `*Severity:* ${alert.severity}\n`;
    message += `*Category:* ${alert.category}\n`;
    message += `*Time:* ${timestamp}\n`;
    message += `*Message:* ${alert.message}\n`;
    
    // Add relevant metrics
    if (alert.metadata?.metricsSnapshot) {
        message += `\n*📊 Current Metrics:*\n`;
        const metrics = alert.metadata.metricsSnapshot;
        
        if (metrics.interopStatus) {
            message += `• Status: ${metrics.interopStatus}\n`;
        }
        if (metrics.healthLevel) {
            message += `• Health: ${metrics.healthLevel}\n`;
        }
        
        // Add specific metric values based on alert category
        Object.entries(metrics).forEach(([key, value]) => {
            if (key !== 'interopStatus' && key !== 'healthLevel' && key !== 'lastUpdateTimestamp') {
                if (typeof value === 'number') {
                    if (key.includes('latency') || key.includes('Ms')) {
                        message += `• ${key}: ${(value / 1000).toFixed(2)}s\n`;
                    } else if (key.includes('rate') || key.includes('Rate')) {
                        message += `• ${key}: ${value.toFixed(1)}%\n`;
                    } else {
                        message += `• ${key}: ${value}\n`;
                    }
                } else {
                    message += `• ${key}: ${value}\n`;
                }
            }
        });
    }
    
    message += `\n*⏱️ Data Window:* ${duration} minutes`;
    
    return message;
}

// Status report function
async function sendStatusReport(metrics: InteropMetrics, iteration: number) {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
    
    let statusMessage = `*✅ OP Interop Status: OK*\n`;
    statusMessage += `*Iteration:* ${iteration}\n`;
    statusMessage += `*Time:* ${timestamp}\n`;
    statusMessage += `*Uptime:* ${uptime} minutes\n\n`;
    
    statusMessage += `*📊 Current Status:*\n`;
    statusMessage += `• Interop Status: ${metrics.status.interopStatus}\n`;
    statusMessage += `• Health Level: ${metrics.status.healthLevel}\n`;
    statusMessage += `• Timing Status: ${metrics.status.timingStatus}\n\n`;
    
    statusMessage += `*📈 Key Metrics:*\n`;
    statusMessage += `• Success Rate: ${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\n`;
    statusMessage += `• Avg Latency: ${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\n`;
    statusMessage += `• Total Messages: ${metrics.coreMetrics.throughput.totalMessages}\n`;
    statusMessage += `• Error Rate: ${metrics.health.errorSummary.errorRate.toFixed(1)}%\n`;
    
    const success = await sendSlackMessage(statusMessage, 'good');
    
    if (success) {
        console.log('✅ Status report sent to Slack successfully');
    } else {
        console.log('❌ Failed to send status report to Slack');
    }
}

// Alert processing function
async function processAlertsForMetrics(metrics: InteropMetrics, trackingData: TrackingResult[]) {
    try {
        // Create alert context
        const alertContext = createAlertContext(
            metrics,
            trackingData,
            undefined, // No previous metrics for now
            60 * 60 * 1000 // 1 hour time window
        );

        // Process alerts using default rules
        const alertResults = await processAlerts(
            DEFAULT_ALERT_RULES,
            alertContext,
            alertNotificationCallback
        );

        // Log alert processing results
        const triggeredAlerts = alertResults.filter(result => result.triggered);
        const totalRules = alertResults.length;

        console.log(`📋 Alert Processing Summary:`);
        console.log(`   - Total rules evaluated: ${totalRules}`);
        console.log(`   - Alerts triggered: ${triggeredAlerts.length}`);

        if (triggeredAlerts.length > 0) {
            console.log(`\n🚨 Triggered Alerts:`);
            triggeredAlerts.forEach((result, index) => {
                console.log(`   ${index + 1}. [${result.alert?.severity}] ${result.rule.name}`);
                if (result.alert?.message) {
                    console.log(`      Message: ${result.alert.message}`);
                }
            });
        } else {
            console.log(`   ✅ No alerts triggered - system is healthy`);
        }

        // Log disabled or failed rules for debugging        
        const disabledRulesWithAllConditionsMet = alertResults.filter(result => !result.triggered && result.reason !== "Not all conditions are met");
        
        if (disabledRulesWithAllConditionsMet.length > 0) {
            console.log(`\n📝 Non-triggered rules:`);
            disabledRulesWithAllConditionsMet.forEach((result, index) => {
                console.log(`   ${index + 1}. ${result.rule.name}: ${result.reason}`);
            });
        }

        console.log()

        // Send status report every N iterations if no alerts were triggered
        if (triggeredAlerts.length === 0) {
            iterationCount++;
            
            if (iterationCount === 1 || iterationCount % STATUS_REPORT_INTERVAL === 0) {
                console.log(`\n📡 Sending status report (iteration ${iterationCount})...`);
                await sendStatusReport(metrics, iterationCount);
            }
        } else {
            // Reset counter if there were alerts (we don't want status reports during issues)
            console.log(`\n⚠️  Status report skipped due to active alerts`);
        }

    } catch (error) {
        console.error('❌ Error processing alerts:', error);
    }
}

console.log('🚀 Starting OP Interop Alerts tracking...');
console.log('📊 Configuration:');
console.log(`   - Origin Chain: ${chainsInfo.chainOrigin.chainId} (${chainsInfo.chainOrigin.rpcUrl})`);
console.log(`   - Destination Chain: ${chainsInfo.chainDestination.chainId} (${chainsInfo.chainDestination.rpcUrl})`);
console.log(`   - Tracking interval: ${intervalMinutes} minutes`);
console.log(`   - Status reports: Every ${STATUS_REPORT_INTERVAL} iterations ${slackConfig.webhookUrl ? '(to Slack)' : '(Slack disabled)'}`);
console.log('');

// Function to display metrics in a readable format
function displayMetrics(metrics: InteropMetrics) {
    console.log('\n=== 📈 INTEROP METRICS REPORT ===');
    
    // Status information
    console.log('\n🔍 System Status:');
    console.log(`   - Interop Status: ${metrics.status.interopStatus}`);
    console.log(`   - Timing Status: ${metrics.status.timingStatus}`);
    console.log(`   - Health Level: ${metrics.status.healthLevel}`);
    console.log(`   - Data Window: ${metrics.status.dataWindowStart.toISOString()} to ${metrics.status.dataWindowEnd.toISOString()}`);
    
    // Core metrics
    console.log('\n📊 Core Metrics:');
    console.log(`   🚀 Throughput:`);
    console.log(`     • Total Messages: ${metrics.coreMetrics.throughput.totalMessages}`);
    console.log(`     • Successful: ${metrics.coreMetrics.throughput.successfulMessages}`);
    console.log(`     • Failed: ${metrics.coreMetrics.throughput.failedMessages}`);
    console.log(`     • Success Rate: ${metrics.coreMetrics.throughput.successRate.toFixed(2)}%`);
    console.log(`     • Messages/Hour: ${metrics.coreMetrics.throughput.messagesPerHour.toFixed(2)}`);
    
    console.log(`   ⏱️  Latency:`);
    console.log(`     • Average: ${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(2)}s`);
    console.log(`     • Median: ${(metrics.coreMetrics.latency.medianLatencyMs / 1000).toFixed(2)}s`);
    console.log(`     • Min: ${(metrics.coreMetrics.latency.minLatencyMs / 1000).toFixed(2)}s`);
    console.log(`     • Max: ${(metrics.coreMetrics.latency.maxLatencyMs / 1000).toFixed(2)}s`);
    console.log(`     • P95: ${(metrics.coreMetrics.latency.p95LatencyMs / 1000).toFixed(2)}s`);
    console.log(`     • P99: ${(metrics.coreMetrics.latency.p99LatencyMs / 1000).toFixed(2)}s`);
    
    console.log(`   ⛽ Gas Usage:`);
    console.log(`     • Avg Send Gas: ${metrics.coreMetrics.gas.averageSendGas.toString()}`);
    console.log(`     • Avg Relay Gas: ${metrics.coreMetrics.gas.averageRelayGas.toString()}`);
    console.log(`     • Total Gas Used: ${metrics.coreMetrics.gas.totalGasUsed.toString()}`);
    
    console.log(`   ⏰ Timing:`);
    console.log(`     • On Time: ${metrics.coreMetrics.timing.onTimeMessages}`);
    console.log(`     • Delayed: ${metrics.coreMetrics.timing.delayedMessages}`);
    console.log(`     • Severely Delayed: ${metrics.coreMetrics.timing.severelyDelayedMessages}`);
    console.log(`     • Average Delay: ${(metrics.coreMetrics.timing.averageDelayMs / 1000).toFixed(2)}s`);
    
    // Health alerts
    if (metrics.health.alerts.length > 0) {
        console.log('\n🚨 Health Alerts:');
        metrics.health.alerts.forEach((alert, index) => {
            console.log(`   ${index + 1}. [${alert.level}] ${alert.type}: ${alert.message}`);
        });
    }
    
    // Error summary
    if (metrics.health.errorSummary.totalErrors > 0) {
        console.log('\n❌ Error Summary:');
        console.log(`   - Total Errors: ${metrics.health.errorSummary.totalErrors}`);
        console.log(`   - Error Rate: ${metrics.health.errorSummary.errorRate.toFixed(2)}%`);
        
        if (Object.keys(metrics.health.errorSummary.sendErrors).length > 0) {
            console.log(`   - Send Errors:`, metrics.health.errorSummary.sendErrors);
        }
        
        if (Object.keys(metrics.health.errorSummary.relayErrors).length > 0) {
            console.log(`   - Relay Errors:`, metrics.health.errorSummary.relayErrors);
        }
    }
    
    // Recommendations
    if (metrics.health.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        metrics.health.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
    }
    
    console.log('\n=== END METRICS REPORT ===\n');
}

// Define callback to handle tracking events
const trackingCallback = async (result: TrackingResult) => {
    console.log('\n=== 📊 TRACKING RESULT ===');
    console.log(`   - Timestamp: ${result.timestamp.toISOString()}`);
    console.log(`   - Success: ${result.success}`);
    
    if (result.success && result.data) {
        const data = result.data;
        
        console.log('\n🚀 SentMessage Event:');
        console.log(`   - Transaction Hash: ${data.sentMessage.transactionHash}`);
        console.log(`   - Gas Used: ${data.sentMessage.gasUsed.toString()}`);
        console.log(`   - Blockchain Timestamp: ${data.sentMessage.timestamp.toISOString()}`);
        console.log(`   - Local Timestamp: ${data.sentMessage.localTimestamp.toISOString()}`);
        console.log(`   - Logs Count: ${data.sentMessage.logs.length}`);
        console.log(`   - Event Args:`);
        console.log(`     • Destination: ${data.sentMessage.event.args.destination?.toString() ?? 'N/A'}`);
        console.log(`     • Target: ${data.sentMessage.event.args.target ?? 'N/A'}`);
        console.log(`     • Message Nonce: ${data.sentMessage.event.args.messageNonce?.toString() ?? 'N/A'}`);
        console.log(`     • Sender: ${data.sentMessage.event.args.sender ?? 'N/A'}`);
        
        console.log('\n📨 RelayMessage Event:');
        console.log(`   - Transaction Hash: ${data.relayMessage.transactionHash}`);
        console.log(`   - Gas Used: ${data.relayMessage.gasUsed.toString()}`);
        console.log(`   - Blockchain Timestamp: ${data.relayMessage.timestamp.toISOString()}`);
        console.log(`   - Local Timestamp: ${data.relayMessage.localTimestamp.toISOString()}`);
        console.log(`   - Logs Count: ${data.relayMessage.logs.length}`);
        console.log(`   - Event Args:`);
        console.log(`     • Source: ${data.relayMessage.event.args.source?.toString() ?? 'N/A'}`);
        console.log(`     • Message Nonce: ${data.relayMessage.event.args.messageNonce?.toString() ?? 'N/A'}`);
        console.log(`     • Message Hash: ${data.relayMessage.event.args.messageHash ?? 'N/A'}`);
        console.log(`     • Return Data Hash: ${data.relayMessage.event.args.returnDataHash ?? 'N/A'}`);
        
        // Calculate time difference
        const timeDiff = data.relayMessage.localTimestamp.getTime() - data.sentMessage.localTimestamp.getTime();
        
        if (timeDiff < 0) {
            console.log(`\n⚠️  WARNING: Negative time difference detected!`);
            console.log(`   - Sent message timestamp: ${data.sentMessage.timestamp.toISOString()}`);
            console.log(`   - Relay message timestamp: ${data.relayMessage.timestamp.toISOString()}`);
            console.log(`   - This might indicate clock synchronization issues between chains`);
        }
        
        console.log(`\n⏱️  Time between events: ${formatTimeDifference(timeDiff)}`);
    } else if (!result.success && result.error) {
        console.log('\n❌ Error Details:');
        console.log(`   - Status: ${result.error.status}`);
        console.log(`   - Message: ${result.error.error.message}`);
    }
    
    console.log('\n=== END TRACKING RESULT ===');
    
    // Add result to memory
    trackingResults.push(result);
    console.log(`\n📚 Tracking results in memory: ${trackingResults.length}`);
    
    // Check for consecutive failures
    if (hasConsecutiveFailures(trackingResults, 5)) {
        const failureCount = getConsecutiveFailureCount(trackingResults);
        const isAllFailures = trackingResults.length < 5 && trackingResults.every(r => !r.success);
        
        if (isAllFailures) {
            console.log(`\n🚨 CRITICAL ALERT: System is DOWN - All ${trackingResults.length} attempts have failed!`);
        } else {
            console.log(`\n🚨 CRITICAL ALERT: System is DOWN - ${failureCount} consecutive failures detected!`);
        }
    } else if (hasConsecutiveFailures(trackingResults, 3)) {
        const failureCount = getConsecutiveFailureCount(trackingResults);
        console.log(`\n⚠️  WARNING: ${failureCount} consecutive failures detected - system may be degrading`);
    }
    
    // Generate and display metrics when we have enough data
    if (trackingResults.length >= METRICS_THRESHOLD) {
        console.log(`\n🎯 Generating metrics from ${trackingResults.length} tracking results...`);
        
        try {
            const metrics = generateMetrics(trackingResults);
            displayMetrics(metrics);
            
            // Process alerts based on the generated metrics
            console.log(`\n🔍 Processing alerts for iteration ${iterationCount+1}...`);

            await processAlertsForMetrics(metrics, trackingResults);
            
        } catch (error) {
            console.error('❌ Error generating metrics:', error);
        }
    } else {
        console.log(`\n⏳ Need ${METRICS_THRESHOLD - trackingResults.length} more results to generate metrics`);
    }
};

// Main async function
async function main() {
    try {
        await startTracking(chainsInfo, pksInfo, trackingCallback, intervalMinutes);
    } catch (error) {
        console.error('❌ Error during tracking:', error);
        process.exit(1);
    }
}

// Start the tracking process
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
