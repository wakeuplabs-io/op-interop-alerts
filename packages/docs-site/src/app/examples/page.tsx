import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, BarChart3, AlertTriangle, Code, ExternalLink } from 'lucide-react';
import CodeBlock, { CodeTabs, TabPanel } from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Complete examples showing how to use all modules of the OP Interop Alerts SDK together for comprehensive cross-chain monitoring.',
};

export default function Examples() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-orange" />
          </div>
          <h1 className="text-3xl font-bold text-midnight">Examples</h1>
        </div>
        <p className="text-lg text-gray-600">
          Complete examples showing how to use all modules of the OP Interop Alerts SDK together 
          for comprehensive cross-chain monitoring and alerting.
        </p>
      </div>

      {/* Example Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Overview</h2>
        <p className="text-gray-600 mb-6">
          These examples demonstrate real-world usage patterns combining tracking, metrics generation, 
          and intelligent alerting. Each example is complete and ready to run.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-4 h-4 text-orange" />
              <h3 className="font-semibold text-gray-900">Basic Monitoring</h3>
            </div>
            <p className="text-sm text-gray-600">Simple setup with console logging and basic metrics</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange" />
              <h3 className="font-semibold text-gray-900">Production Monitoring</h3>
            </div>
            <p className="text-sm text-gray-600">Full production setup with Slack alerts and custom rules</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange" />
              <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">Custom metrics and multi-channel alerting</p>
          </div>
        </div>
      </div>

      {/* Basic Monitoring Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Monitoring Setup</h2>
        <p className="text-gray-600 mb-6">
          A simple example that demonstrates the core functionality with console output:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript" filename="basic-monitoring.ts">
{`import { 
  startTracking, 
  generateMetrics, 
  TrackingResult,
  InteropMetrics,
  hasConsecutiveFailures,
  getConsecutiveFailureCount
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Configuration
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

const TRACKING_INTERVAL_MINUTES = 10;
const METRICS_THRESHOLD = 3; // Generate metrics after 3 data points

// Storage for tracking results
const trackingResults: TrackingResult[] = [];

// Tracking callback with basic logging
const trackingCallback = (result: TrackingResult) => {
  const timestamp = result.timestamp.toISOString();
  
  console.log(\`\\n=== [\${timestamp}] TRACKING CYCLE ===\`);
  
  if (result.success && result.data) {
    const { sentMessage, relayMessage } = result.data;
    const latency = relayMessage.localTimestamp.getTime() - sentMessage.localTimestamp.getTime();
    
    console.log('✅ Cross-chain message successful');
    console.log(\`   Latency: \${(latency / 1000).toFixed(2)}s\`);
    console.log(\`   Send Gas: \${sentMessage.gasUsed.toString()}\`);
    console.log(\`   Relay Gas: \${relayMessage.gasUsed.toString()}\`);
    console.log(\`   Send Tx: \${sentMessage.transactionHash}\`);
    console.log(\`   Relay Tx: \${relayMessage.transactionHash}\`);
  } else {
    console.log('❌ Cross-chain message failed');
    if (result.error) {
      console.log(\`   Error: \${result.error.error.message}\`);
    }
  }
  
  // Store result for metrics
  trackingResults.push(result);
  console.log(\`   Total results: \${trackingResults.length}\`);
  
  // Check for consecutive failures
  if (hasConsecutiveFailures(trackingResults, 3)) {
    const failureCount = getConsecutiveFailureCount(trackingResults);
    console.log(\`⚠️  WARNING: \${failureCount} consecutive failures detected!\`);
  }
  
  // Generate metrics when we have enough data
  if (trackingResults.length >= METRICS_THRESHOLD) {
    displayMetrics();
  }
  
  console.log('=== END CYCLE ===\\n');
};

function displayMetrics() {
  try {
    const metrics: InteropMetrics = generateMetrics(trackingResults);
    
    console.log('\\n📊 === METRICS SUMMARY ===');
    console.log(\`System Status: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\`);
    console.log(\`Success Rate: \${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\`);
    console.log(\`Average Latency: \${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`P95 Latency: \${(metrics.coreMetrics.latency.p95LatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`Messages/Hour: \${metrics.coreMetrics.throughput.messagesPerHour.toFixed(1)}\`);
    
    if (metrics.health.alerts.length > 0) {
      console.log('\\n🚨 Health Alerts:');
      metrics.health.alerts.forEach((alert, i) => {
        console.log(\`  \${i + 1}. [\${alert.level}] \${alert.message}\`);
      });
    }
    
    if (metrics.health.recommendations.length > 0) {
      console.log('\\n💡 Recommendations:');
      metrics.health.recommendations.forEach((rec, i) => {
        console.log(\`  \${i + 1}. \${rec}\`);
      });
    }
    
    console.log('=== END METRICS ===\\n');
  } catch (error) {
    console.error('❌ Error generating metrics:', error);
  }
}

// Start monitoring
async function main() {
  console.log('🚀 Starting OP Interop Basic Monitoring');
  console.log(\`📊 Tracking interval: \${TRACKING_INTERVAL_MINUTES} minutes\`);
  console.log(\`📈 Metrics threshold: \${METRICS_THRESHOLD} data points\\n\`);
  
  try {
    await startTracking(
      chainsInfoMock, 
      pksInfo, 
      trackingCallback, 
      TRACKING_INTERVAL_MINUTES
    );
  } catch (error) {
    console.error('❌ Monitoring failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n👋 Shutting down monitoring...');
  if (trackingResults.length > 0) {
    console.log(\`📊 Final metrics from \${trackingResults.length} data points:\`);
    displayMetrics();
  }
  process.exit(0);
});

main().catch(console.error);`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript" filename="basic-monitoring.js">
{`const { 
  startTracking, 
  generateMetrics, 
  hasConsecutiveFailures,
  getConsecutiveFailureCount
} = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

// Configuration
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

const TRACKING_INTERVAL_MINUTES = 10;
const METRICS_THRESHOLD = 3; // Generate metrics after 3 data points

// Storage for tracking results
const trackingResults = [];

// Tracking callback with basic logging
const trackingCallback = (result) => {
  const timestamp = result.timestamp.toISOString();
  
  console.log(\`\\n=== [\${timestamp}] TRACKING CYCLE ===\`);
  
  if (result.success && result.data) {
    const { sentMessage, relayMessage } = result.data;
    const latency = relayMessage.localTimestamp.getTime() - sentMessage.localTimestamp.getTime();
    
    console.log('✅ Cross-chain message successful');
    console.log(\`   Latency: \${(latency / 1000).toFixed(2)}s\`);
    console.log(\`   Send Gas: \${sentMessage.gasUsed.toString()}\`);
    console.log(\`   Relay Gas: \${relayMessage.gasUsed.toString()}\`);
    console.log(\`   Send Tx: \${sentMessage.transactionHash}\`);
    console.log(\`   Relay Tx: \${relayMessage.transactionHash}\`);
  } else {
    console.log('❌ Cross-chain message failed');
    if (result.error) {
      console.log(\`   Error: \${result.error.error.message}\`);
    }
  }
  
  // Store result for metrics
  trackingResults.push(result);
  console.log(\`   Total results: \${trackingResults.length}\`);
  
  // Check for consecutive failures
  if (hasConsecutiveFailures(trackingResults, 3)) {
    const failureCount = getConsecutiveFailureCount(trackingResults);
    console.log(\`⚠️  WARNING: \${failureCount} consecutive failures detected!\`);
  }
  
  // Generate metrics when we have enough data
  if (trackingResults.length >= METRICS_THRESHOLD) {
    displayMetrics();
  }
  
  console.log('=== END CYCLE ===\\n');
};

function displayMetrics() {
  try {
    const metrics = generateMetrics(trackingResults);
    
    console.log('\\n📊 === METRICS SUMMARY ===');
    console.log(\`System Status: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\`);
    console.log(\`Success Rate: \${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\`);
    console.log(\`Average Latency: \${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`P95 Latency: \${(metrics.coreMetrics.latency.p95LatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`Messages/Hour: \${metrics.coreMetrics.throughput.messagesPerHour.toFixed(1)}\`);
    
    if (metrics.health.alerts.length > 0) {
      console.log('\\n🚨 Health Alerts:');
      metrics.health.alerts.forEach((alert, i) => {
        console.log(\`  \${i + 1}. [\${alert.level}] \${alert.message}\`);
      });
    }
    
    if (metrics.health.recommendations.length > 0) {
      console.log('\\n💡 Recommendations:');
      metrics.health.recommendations.forEach((rec, i) => {
        console.log(\`  \${i + 1}. \${rec}\`);
      });
    }
    
    console.log('=== END METRICS ===\\n');
  } catch (error) {
    console.error('❌ Error generating metrics:', error);
  }
}

// Start monitoring
async function main() {
  console.log('🚀 Starting OP Interop Basic Monitoring');
  console.log(\`📊 Tracking interval: \${TRACKING_INTERVAL_MINUTES} minutes\`);
  console.log(\`📈 Metrics threshold: \${METRICS_THRESHOLD} data points\\n\`);
  
  try {
    await startTracking(
      chainsInfoMock, 
      pksInfo, 
      trackingCallback, 
      TRACKING_INTERVAL_MINUTES
    );
  } catch (error) {
    console.error('❌ Monitoring failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n👋 Shutting down monitoring...');
  if (trackingResults.length > 0) {
    console.log(\`📊 Final metrics from \${trackingResults.length} data points:\`);
    displayMetrics();
  }
  process.exit(0);
});

main().catch(console.error);`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Production Monitoring Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Monitoring with Slack Alerts</h2>
        <p className="text-gray-600 mb-6">
          A production-ready example with Slack notifications and comprehensive alerting:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript" filename="production-monitoring.ts">
{`import { 
  startTracking, 
  generateMetrics, 
  processAlerts,
  createAlertContext,
  createSimpleNotificationCallback,
  DEFAULT_ALERT_RULES,
  TrackingResult,
  InteropMetrics,
  AlertNotification,
  NotificationChannel
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Configuration
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

const TRACKING_INTERVAL_MINUTES = parseInt(process.env.TRACKING_INTERVAL_MINUTES || "5");
const STATUS_REPORT_INTERVAL = 12; // Send status every 12 iterations (1 hour if 5min intervals)

// Slack configuration
const slackConfig = {
  webhookUrl: process.env.SLACK_WEBHOOK_URL,
  channel: process.env.SLACK_CHANNEL || '#interop-alerts',
  username: process.env.SLACK_USERNAME || 'OP Interop Monitor',
  iconEmoji: process.env.SLACK_ICON_EMOJI || ':zap:'
};

// Storage and counters
const trackingResults: TrackingResult[] = [];
let iterationCount = 0;
const startTime = Date.now();

// Slack notification helper
async function sendSlackMessage(
  message: string, 
  color: 'good' | 'warning' | 'danger' = 'good'
): Promise<boolean> {
  if (!slackConfig.webhookUrl) {
    console.log('📱 Slack not configured, logging message:', message);
    return false;
  }
  
  try {
    const payload = {
      username: slackConfig.username,
      icon_emoji: slackConfig.iconEmoji,
      channel: slackConfig.channel,
      attachments: [{
        color,
        text: message,
        footer: 'OP Interop Alerts',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    const response = await fetch(slackConfig.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Error sending Slack message:', error);
    return false;
  }
}

// Alert notification callback
const alertNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.SLACK]: async (notification: AlertNotification) => {
    const { alert, rule, context } = notification;
    
    console.log(\`🚨 ALERT TRIGGERED: [\${alert.severity}] \${alert.title}\`);
    
    let slackMessage = \`🚨 *\${alert.title}*\\n\`;
    slackMessage += \`*Severity:* \${alert.severity}\\n\`;
    slackMessage += \`*Category:* \${alert.category}\\n\`;
    slackMessage += \`*Message:* \${alert.message}\\n\`;
    
    // Add key metrics
    const metrics = context.metrics;
    slackMessage += \`\\n*📊 Current Status:*\\n\`;
    slackMessage += \`• System: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\\n\`;
    slackMessage += \`• Success Rate: \${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\\n\`;
    slackMessage += \`• Avg Latency: \${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\\n\`;
    
    const color = alert.severity === 'CRITICAL' ? 'danger' : 'warning';
    const success = await sendSlackMessage(slackMessage, color);
    
    if (success) {
      console.log('✅ Alert sent to Slack');
    } else {
      console.log('❌ Failed to send alert to Slack');
    }
  }
});

// Status report function
async function sendStatusReport(metrics: InteropMetrics, iteration: number) {
  const uptime = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
  
  let statusMessage = \`✅ *OP Interop Status: Healthy*\\n\`;
  statusMessage += \`*Iteration:* \${iteration}\\n\`;
  statusMessage += \`*Uptime:* \${uptime} minutes\\n\\n\`;
  
  statusMessage += \`*📊 Current Metrics:*\\n\`;
  statusMessage += \`• Status: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\\n\`;
  statusMessage += \`• Success Rate: \${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\\n\`;
  statusMessage += \`• Avg Latency: \${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\\n\`;
  statusMessage += \`• P95 Latency: \${(metrics.coreMetrics.latency.p95LatencyMs / 1000).toFixed(1)}s\\n\`;
  statusMessage += \`• Messages/Hour: \${metrics.coreMetrics.throughput.messagesPerHour.toFixed(1)}\\n\`;
  statusMessage += \`• Total Messages: \${metrics.coreMetrics.throughput.totalMessages}\`;
  
  const success = await sendSlackMessage(statusMessage, 'good');
  console.log(success ? '✅ Status report sent to Slack' : '❌ Failed to send status report');
}

// Alert processing function
async function processAlertsForMetrics(metrics: InteropMetrics, trackingData: TrackingResult[]) {
  try {
    const alertContext = createAlertContext(
      metrics,
      trackingData,
      undefined,
      60 * 60 * 1000 // 1 hour time window
    );

    const alertResults = await processAlerts(
      DEFAULT_ALERT_RULES,
      alertContext,
      alertNotificationCallback
    );

    const triggeredAlerts = alertResults.filter(result => result.triggered);
    console.log(\`📋 Alert processing: \${alertResults.length} rules, \${triggeredAlerts.length} triggered\`);

    if (triggeredAlerts.length > 0) {
      console.log('🚨 Triggered alerts:');
      triggeredAlerts.forEach((result, index) => {
        console.log(\`   \${index + 1}. [\${result.alert?.severity}] \${result.rule.name}\`);
      });
    }

    return triggeredAlerts.length === 0;
  } catch (error) {
    console.error('❌ Error processing alerts:', error);
    return false;
  }
}

// Main tracking callback
const trackingCallback = async (result: TrackingResult) => {
  console.log(\`\\n=== [\${result.timestamp.toISOString()}] PRODUCTION MONITORING ===\`);
  
  if (result.success && result.data) {
    const { sentMessage, relayMessage } = result.data;
    const latency = relayMessage.localTimestamp.getTime() - sentMessage.localTimestamp.getTime();
    
    console.log(\`✅ Cross-chain operation successful (\${(latency / 1000).toFixed(2)}s latency)\`);
  } else {
    console.log(\`❌ Cross-chain operation failed: \${result.error?.error.message}\`);
  }
  
  trackingResults.push(result);
  
  // Generate metrics and process alerts
  if (trackingResults.length >= 1) {
    const metrics = generateMetrics(trackingResults);
    console.log(\`📊 System: \${metrics.status.interopStatus} | Health: \${metrics.status.healthLevel}\`);
    
    const systemHealthy = await processAlertsForMetrics(metrics, trackingResults);
    
    // Send periodic status reports when system is healthy
    if (systemHealthy) {
      iterationCount++;
      if (iterationCount === 1 || iterationCount % STATUS_REPORT_INTERVAL === 0) {
        console.log(\`📡 Sending status report (iteration \${iterationCount})\`);
        await sendStatusReport(metrics, iterationCount);
      }
    } else {
      console.log('⚠️  Status report skipped due to active alerts');
    }
  }
  
  console.log('=== END MONITORING CYCLE ===\\n');
};

// Startup notification
async function sendStartupNotification() {
  const message = \`🚀 *OP Interop Monitor Started*\\n\` +
    \`*Interval:* \${TRACKING_INTERVAL_MINUTES} minutes\\n\` +
    \`*Origin:* Chain \${chainsInfoMock.chainOrigin.chainId}\\n\` +
    \`*Destination:* Chain \${chainsInfoMock.chainDestination.chainId}\\n\` +
    \`*Status Reports:* Every \${STATUS_REPORT_INTERVAL} cycles\`;
  
  await sendSlackMessage(message, 'good');
}

// Main function
async function main() {
  console.log('🚀 Starting OP Interop Production Monitoring');
  console.log(\`📊 Configuration:\`);
  console.log(\`   - Tracking interval: \${TRACKING_INTERVAL_MINUTES} minutes\`);
  console.log(\`   - Status reports: Every \${STATUS_REPORT_INTERVAL} cycles\`);
  console.log(\`   - Slack alerts: \${slackConfig.webhookUrl ? 'Enabled' : 'Disabled'}\`);
  console.log(\`   - Origin chain: \${chainsInfoMock.chainOrigin.chainId}\`);
  console.log(\`   - Destination chain: \${chainsInfoMock.chainDestination.chainId}\\n\`);
  
  await sendStartupNotification();
  
  try {
    await startTracking(
      chainsInfoMock, 
      pksInfo, 
      trackingCallback, 
      TRACKING_INTERVAL_MINUTES
    );
  } catch (error) {
    console.error('❌ Production monitoring failed:', error);
    await sendSlackMessage(\`🚨 *Monitor Crashed*\\n\${error}\`, 'danger');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\\n👋 Shutting down production monitor...');
  await sendSlackMessage('🛑 *OP Interop Monitor Stopped*', 'warning');
  process.exit(0);
});

main().catch(console.error);`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="Environment Variables">
            <CodeBlock language="bash" filename=".env">
{`# Required: Private keys
ORIGIN_PRIVATE_KEY=0x...
DESTINATION_PRIVATE_KEY=0x...

# Optional: Tracking configuration
TRACKING_INTERVAL_MINUTES=5

# Slack configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL=#interop-alerts
SLACK_USERNAME=OP Interop Monitor
SLACK_ICON_EMOJI=:zap:

# Optional: Custom webhook for additional notifications
CUSTOM_WEBHOOK_URL=https://your-api.com/webhooks/alerts
WEBHOOK_TOKEN=your-auth-token`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Custom Chains Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Chain Configuration</h2>
        <p className="text-gray-600 mb-6">
          Example showing how to monitor custom chains instead of the default mock configuration:
        </p>

        <CodeBlock language="typescript" filename="custom-chains-monitoring.ts">
{`import { 
  startTracking, 
  generateMetrics,
  TrackingResult,
  ChainsInfo
} from '@wakeuplabs/op-interop-alerts-sdk';

// Custom chain configuration for OP Sepolia <-> Base Sepolia
const customChainsInfo: ChainsInfo = {
  chainOrigin: {
    chainId: 11155420, // OP Sepolia
    rpcUrl: 'https://sepolia.optimism.io',
    l2ToL2CrossDomainMessengerAddress: '0x4200000000000000000000000000000000000023',
    messageReceiverAddress: '0x...' // Your deployed MessageReceiver contract
  },
  chainDestination: {
    chainId: 84532, // Base Sepolia  
    rpcUrl: 'https://sepolia.base.org',
    l2ToL2CrossDomainMessengerAddress: '0x4200000000000000000000000000000000000023',
    messageReceiverAddress: '0x...' // Your deployed MessageReceiver contract
  }
};

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

const trackingResults: TrackingResult[] = [];

const trackingCallback = (result: TrackingResult) => {
  console.log(\`\\n=== Custom Chains Monitoring ===\`);
  console.log(\`Time: \${result.timestamp.toISOString()}\`);
  console.log(\`OP Sepolia -> Base Sepolia: \${result.success ? '✅' : '❌'}\`);
  
  if (result.success && result.data) {
    const latency = result.data.relayMessage.localTimestamp.getTime() - 
                   result.data.sentMessage.localTimestamp.getTime();
    console.log(\`Latency: \${(latency / 1000).toFixed(2)}s\`);
  }
  
  trackingResults.push(result);
  
  // Generate metrics every 5 results
  if (trackingResults.length % 5 === 0) {
    const metrics = generateMetrics(trackingResults);
    console.log(\`\\n📊 Metrics Summary (last \${trackingResults.length} results):\`);
    console.log(\`   Success Rate: \${metrics.coreMetrics.throughput.successRate.toFixed(1)}%\`);
    console.log(\`   Avg Latency: \${(metrics.coreMetrics.latency.averageLatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`   System Status: \${metrics.status.interopStatus}\`);
  }
};

async function main() {
  console.log('🚀 Starting Custom Chains Monitoring');
  console.log(\`📍 Monitoring: OP Sepolia (\${customChainsInfo.chainOrigin.chainId}) -> Base Sepolia (\${customChainsInfo.chainDestination.chainId})\`);
  
  try {
    await startTracking(customChainsInfo, pksInfo, trackingCallback, 8);
  } catch (error) {
    console.error('❌ Custom chains monitoring failed:', error);
  }
}

main().catch(console.error);`}
        </CodeBlock>
      </div>

      {/* Package.json Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Configuration</h2>
        <p className="text-gray-600 mb-6">
          Example `package.json` and scripts for your monitoring project:
        </p>

        <CodeTabs>
          <TabPanel label="package.json">
            <CodeBlock language="json" filename="package.json">
{`{
  "name": "my-interop-monitor",
  "version": "1.0.0",
  "description": "Cross-chain monitoring for OP Superchain",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:basic": "tsx src/basic-monitoring.ts",
    "start:production": "tsx src/production-monitoring.ts",
    "start:custom": "tsx src/custom-chains-monitoring.ts",
    "test": "tsx src/test-installation.ts"
  },
  "dependencies": {
    "@wakeuplabs/op-interop-alerts-sdk": "^0.3.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="tsconfig.json">
            <CodeBlock language="json" filename="tsconfig.json">
{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Running Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Running the Examples</h2>
        <p className="text-gray-600 mb-6">
          Follow these steps to run the examples in your own project:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Step-by-step Setup</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-medium text-gray-900">Create a new project</h4>
                <CodeBlock language="bash">
{`mkdir my-interop-monitor
cd my-interop-monitor
npm init -y`}
                </CodeBlock>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-medium text-gray-900">Install dependencies</h4>
                <CodeBlock language="bash">
{`npm install @wakeuplabs/op-interop-alerts-sdk dotenv
npm install -D @types/node tsx typescript`}
                </CodeBlock>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-medium text-gray-900">Set up environment</h4>
                <CodeBlock language="bash">
{`cp .env.example .env
# Edit .env with your private keys and Slack webhook`}
                </CodeBlock>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h4 className="font-medium text-gray-900">Copy and run examples</h4>
                <CodeBlock language="bash">
{`# Basic monitoring
npm run start:basic

# Production monitoring with Slack
npm run start:production

# Custom chains monitoring
npm run start:custom`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Link */}
      <div className="mb-8">
        <div className="bg-orange/5 border border-orange/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-midnight mb-2">Complete Example Repository</h3>
              <p className="text-gray-700 mb-3">
                Find the complete working example with all the code shown above in our repository:
              </p>
              <a
                href="https://github.com/wakeuplabs-io/op-interop-alerts/tree/develop/packages/example"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange text-white font-medium rounded-lg hover:bg-orange/80 transition-colors"
              >
                View Example Code
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-orange/5 border border-orange/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Start Monitoring?</h2>
        <p className="text-gray-700 mb-4">
          These examples provide a solid foundation for monitoring your cross-chain operations. 
          Customize them based on your specific needs and infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/installation"
            className="inline-flex items-center px-4 py-2 bg-orange text-white font-medium rounded-lg hover:bg-orange/80 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <div className="flex gap-3">
            <a
              href="https://www.npmjs.com/package/@wakeuplabs/op-interop-alerts-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img 
                src="/npm-logo-red.png" 
                alt="NPM" 
                className="h-3 w-auto mr-2"
              />
              NPM Package
            </a>
            <a
              href="https://github.com/wakeuplabs-io/op-interop-alerts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img 
                src="/github-mark.png" 
                alt="GitHub" 
                className="h-4 w-auto mr-2"
              />
              Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
