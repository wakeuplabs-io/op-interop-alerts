import { startTracking, TrackingResult, generateMetrics, InteropMetrics, hasConsecutiveFailures, getConsecutiveFailureCount } from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock as chainsInfo } from '@wakeuplabs/op-interop-alerts-sdk/config';
import { config } from 'dotenv';
import { formatTimeDifference } from './utils';

// Load environment variables
config();

// Private keys from environment variables
const pksInfo = {
    origin: process.env.ORIGIN_PRIVATE_KEY as `0x${string}`,
    destination: process.env.DESTINATION_PRIVATE_KEY as `0x${string}`,
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

// Interval in minutes between tracking cycles
const intervalMinutes = parseInt(process.env.TRACKING_INTERVAL_MINUTES || "10");

// Memory storage for tracking results
const trackingResults: TrackingResult[] = [];
const METRICS_THRESHOLD = 1;

console.log('🚀 Starting OP Interop Alerts tracking...');
console.log('📊 Configuration:');
console.log(`   - Origin Chain: ${chainsInfo.chainOrigin.chainId} (${chainsInfo.chainOrigin.rpcUrl})`);
console.log(`   - Destination Chain: ${chainsInfo.chainDestination.chainId} (${chainsInfo.chainDestination.rpcUrl})`);
console.log(`   - Tracking interval: ${intervalMinutes} minutes`);
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
const trackingCallback = (result: TrackingResult) => {
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
        } catch (error) {
            console.error('❌ Error generating metrics:', error);
        }
    } else {
        console.log(`\n⏳ Need ${METRICS_THRESHOLD - trackingResults.length} more results to generate metrics`);
    }
};

// Start the tracking process
try {
    await startTracking(chainsInfo, pksInfo, trackingCallback, intervalMinutes);
} catch (error) {
    console.error('❌ Error during tracking:', error);
    process.exit(1);
}
