import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, Bell, Zap, Info, CheckCircle, XCircle } from 'lucide-react';
import CodeBlock, { CodeTabs, TabPanel } from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Alerts Module',
  description: 'Learn how to use the Alerts Module to set up intelligent notifications based on cross-chain metrics and system health.',
};

export default function Alerts() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow" />
          </div>
          <h1 className="text-3xl font-bold text-midnight">Alerts Module</h1>
        </div>
        <p className="text-lg text-gray-600">
          Set up intelligent alerts with configurable rules, cooldown periods, and multi-channel 
          notifications. Get notified when your cross-chain operations need attention.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-600 mb-6">
          The Alerts Module provides a comprehensive system for creating and managing alerts based on 
          interoperability metrics. It uses data from both the Tracking and Metrics modules to trigger 
          intelligent notifications through various channels.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Bell className="w-5 h-5 text-yellow" />
              <h3 className="font-semibold text-gray-900">Smart Notifications</h3>
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Multi-channel support (Slack, Discord, webhooks)</li>
              <li>• Configurable alert rules and conditions</li>
              <li>• Cooldown periods to prevent spam</li>
              <li>• Alert severity levels and categorization</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-5 h-5 text-yellow" />
              <h3 className="font-semibold text-gray-900">Rule-Based System</h3>
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Pre-defined rules for common scenarios</li>
              <li>• Custom rule creation and templates</li>
              <li>• Duration-based conditions</li>
              <li>• Context-aware alert generation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* processAlerts Function */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">processAlerts</h2>
        <p className="text-gray-600 mb-6">
          The main function for processing alert rules against current metrics and triggering notifications 
          when conditions are met.
        </p>

        <div className="bg-yellow/5 border border-yellow/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-midnight mb-1">Function Signature</h3>
              <code className="text-gray-700 text-sm">
                processAlerts(rules, context, notificationCallback): Promise&lt;AlertRuleEvaluationResult[]&gt;
              </code>
            </div>
          </div>
        </div>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  processAlerts,
  createAlertContext,
  createSimpleNotificationCallback,
  DEFAULT_ALERT_RULES,
  AlertNotification,
  NotificationChannel
} from '@wakeuplabs/op-interop-alerts-sdk';

// Create notification callback for Slack
const alertNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.SLACK]: async (notification: AlertNotification) => {
    const { alert, rule, context } = notification;
    
    console.log(\`🚨 ALERT: [\${alert.severity}] \${alert.title}\`);
    console.log(\`Message: \${alert.message}\`);
    
    // Send to Slack webhook
    const slackMessage = {
      text: \`🚨 *\${alert.title}*\`,
      attachments: [{
        color: alert.severity === 'CRITICAL' ? 'danger' : 'warning',
        fields: [
          { title: 'Severity', value: alert.severity, short: true },
          { title: 'Category', value: alert.category, short: true },
          { title: 'Message', value: alert.message, short: false }
        ],
        ts: Math.floor(alert.timestamp.getTime() / 1000)
      }]
    };
    
    try {
      const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });
      
      if (response.ok) {
        console.log('✅ Alert sent to Slack');
      } else {
        console.error('❌ Failed to send Slack alert');
      }
    } catch (error) {
      console.error('Error sending Slack alert:', error);
    }
  }
});

// Process alerts with metrics and tracking data
async function checkAlerts(metrics: InteropMetrics, trackingData: TrackingResult[]) {
  try {
    // Create alert context from current data
    const alertContext = createAlertContext(
      metrics,
      trackingData,
      undefined, // No previous metrics for comparison
      60 * 60 * 1000 // 1 hour time window
    );

    // Process all default alert rules
    const results = await processAlerts(
      DEFAULT_ALERT_RULES,
      alertContext,
      alertNotificationCallback
    );

    // Log results
    const triggeredAlerts = results.filter(r => r.triggered);
    console.log(\`📋 Processed \${results.length} rules, \${triggeredAlerts.length} alerts triggered\`);
    
    if (triggeredAlerts.length > 0) {
      triggeredAlerts.forEach((result, index) => {
        console.log(\`  \${index + 1}. [\${result.alert?.severity}] \${result.rule.name}\`);
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Error processing alerts:', error);
    return [];
  }
}`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { 
  processAlerts,
  createAlertContext,
  createSimpleNotificationCallback,
  DEFAULT_ALERT_RULES,
  NotificationChannel
} = require('@wakeuplabs/op-interop-alerts-sdk');

// Create notification callback for Slack
const alertNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.SLACK]: async (notification) => {
    const { alert, rule, context } = notification;
    
    console.log(\`🚨 ALERT: [\${alert.severity}] \${alert.title}\`);
    console.log(\`Message: \${alert.message}\`);
    
    // Send to Slack webhook
    const slackMessage = {
      text: \`🚨 *\${alert.title}*\`,
      attachments: [{
        color: alert.severity === 'CRITICAL' ? 'danger' : 'warning',
        fields: [
          { title: 'Severity', value: alert.severity, short: true },
          { title: 'Category', value: alert.category, short: true },
          { title: 'Message', value: alert.message, short: false }
        ],
        ts: Math.floor(alert.timestamp.getTime() / 1000)
      }]
    };
    
    try {
      const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });
      
      if (response.ok) {
        console.log('✅ Alert sent to Slack');
      } else {
        console.error('❌ Failed to send Slack alert');
      }
    } catch (error) {
      console.error('Error sending Slack alert:', error);
    }
  }
});

// Process alerts with metrics and tracking data
async function checkAlerts(metrics, trackingData) {
  try {
    // Create alert context from current data
    const alertContext = createAlertContext(
      metrics,
      trackingData,
      undefined, // No previous metrics for comparison
      60 * 60 * 1000 // 1 hour time window
    );

    // Process all default alert rules
    const results = await processAlerts(
      DEFAULT_ALERT_RULES,
      alertContext,
      alertNotificationCallback
    );

    // Log results
    const triggeredAlerts = results.filter(r => r.triggered);
    console.log(\`📋 Processed \${results.length} rules, \${triggeredAlerts.length} alerts triggered\`);
    
    if (triggeredAlerts.length > 0) {
      triggeredAlerts.forEach((result, index) => {
        console.log(\`  \${index + 1}. [\${result.alert?.severity}] \${result.rule.name}\`);
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Error processing alerts:', error);
    return [];
  }
}`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Custom Alert Rules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Custom Alert Rules</h2>
        <p className="text-gray-600 mb-6">
          You can create custom alert rules tailored to your specific monitoring needs:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  createAlertRule,
  createRuleFromTemplate,
  ALERT_RULE_TEMPLATES,
  AlertSeverity,
  AlertCategory
} from '@wakeuplabs/op-interop-alerts-sdk';

// Create a custom alert rule from scratch
const customLatencyRule = createAlertRule({
  name: 'Custom High Latency Alert',
  description: 'Triggers when average latency exceeds 2 minutes',
  category: AlertCategory.LATENCY,
  severity: AlertSeverity.HIGH,
  conditions: [
    {
      field: 'coreMetrics.latency.averageLatencyMs',
      operator: 'gt',
      value: 120000 // 2 minutes in milliseconds
    }
  ],
  cooldownMs: 10 * 60 * 1000, // 10 minutes cooldown
  channels: [NotificationChannel.SLACK, NotificationChannel.WEBHOOK]
});

// Create a rule from a template
const criticalSuccessRateRule = createRuleFromTemplate(
  ALERT_RULE_TEMPLATES.CRITICAL_SUCCESS_RATE,
  {
    // Override template values
    conditions: [
      {
        field: 'coreMetrics.throughput.successRate',
        operator: 'lt',
        value: 85 // Alert when success rate < 85%
      }
    ],
    cooldownMs: 5 * 60 * 1000 // 5 minutes cooldown
  }
);

// Create a rule with duration-based conditions
const persistentErrorRule = createAlertRule({
  name: 'Persistent Error Rate',
  description: 'Triggers when error rate stays high for 15 minutes',
  category: AlertCategory.ERROR_RATE,
  severity: AlertSeverity.CRITICAL,
  conditions: [
    {
      field: 'health.errorSummary.errorRate',
      operator: 'gt',
      value: 10, // Error rate > 10%
      duration: 15 * 60 * 1000 // Must persist for 15 minutes
    }
  ],
  cooldownMs: 30 * 60 * 1000, // 30 minutes cooldown
  channels: [NotificationChannel.SLACK]
});

// Use custom rules
const customRules = [
  customLatencyRule,
  criticalSuccessRateRule,
  persistentErrorRule
];

// Process with custom rules
const results = await processAlerts(
  customRules,
  alertContext,
  alertNotificationCallback
);`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { 
  createAlertRule,
  createRuleFromTemplate,
  ALERT_RULE_TEMPLATES,
  AlertSeverity,
  AlertCategory,
  NotificationChannel
} = require('@wakeuplabs/op-interop-alerts-sdk');

// Create a custom alert rule from scratch
const customLatencyRule = createAlertRule({
  name: 'Custom High Latency Alert',
  description: 'Triggers when average latency exceeds 2 minutes',
  category: AlertCategory.LATENCY,
  severity: AlertSeverity.HIGH,
  conditions: [
    {
      field: 'coreMetrics.latency.averageLatencyMs',
      operator: 'gt',
      value: 120000 // 2 minutes in milliseconds
    }
  ],
  cooldownMs: 10 * 60 * 1000, // 10 minutes cooldown
  channels: [NotificationChannel.SLACK, NotificationChannel.WEBHOOK]
});

// Create a rule from a template
const criticalSuccessRateRule = createRuleFromTemplate(
  ALERT_RULE_TEMPLATES.CRITICAL_SUCCESS_RATE,
  {
    // Override template values
    conditions: [
      {
        field: 'coreMetrics.throughput.successRate',
        operator: 'lt',
        value: 85 // Alert when success rate < 85%
      }
    ],
    cooldownMs: 5 * 60 * 1000 // 5 minutes cooldown
  }
);

// Create a rule with duration-based conditions
const persistentErrorRule = createAlertRule({
  name: 'Persistent Error Rate',
  description: 'Triggers when error rate stays high for 15 minutes',
  category: AlertCategory.ERROR_RATE,
  severity: AlertSeverity.CRITICAL,
  conditions: [
    {
      field: 'health.errorSummary.errorRate',
      operator: 'gt',
      value: 10, // Error rate > 10%
      duration: 15 * 60 * 1000 // Must persist for 15 minutes
    }
  ],
  cooldownMs: 30 * 60 * 1000, // 30 minutes cooldown
  channels: [NotificationChannel.SLACK]
});

// Use custom rules
const customRules = [
  customLatencyRule,
  criticalSuccessRateRule,
  persistentErrorRule
];

// Process with custom rules
const results = await processAlerts(
  customRules,
  alertContext,
  alertNotificationCallback
);`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Default Alert Rules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Default Alert Rules</h2>
        <p className="text-gray-600 mb-6">
          The SDK comes with pre-configured alert rules for common monitoring scenarios:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rule Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Severity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">High Latency</td>
                <td className="px-4 py-3 text-sm text-gray-600">LATENCY</td>
                <td className="px-4 py-3 text-sm text-yellow font-medium">HIGH</td>
                <td className="px-4 py-3 text-sm text-gray-600">Average latency &gt; 60s</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Critical Latency</td>
                <td className="px-4 py-3 text-sm text-gray-600">LATENCY</td>
                <td className="px-4 py-3 text-sm text-orange font-medium">CRITICAL</td>
                <td className="px-4 py-3 text-sm text-gray-600">Average latency &gt; 180s</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Low Success Rate</td>
                <td className="px-4 py-3 text-sm text-gray-600">THROUGHPUT</td>
                <td className="px-4 py-3 text-sm text-yellow font-medium">HIGH</td>
                <td className="px-4 py-3 text-sm text-gray-600">Success rate &lt; 95%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Critical Success Rate</td>
                <td className="px-4 py-3 text-sm text-gray-600">THROUGHPUT</td>
                <td className="px-4 py-3 text-sm text-orange font-medium">CRITICAL</td>
                <td className="px-4 py-3 text-sm text-gray-600">Success rate &lt; 90%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">System Down</td>
                <td className="px-4 py-3 text-sm text-gray-600">SYSTEM_STATUS</td>
                <td className="px-4 py-3 text-sm text-orange font-medium">CRITICAL</td>
                <td className="px-4 py-3 text-sm text-gray-600">Interop status = DOWN</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Consecutive Failures</td>
                <td className="px-4 py-3 text-sm text-gray-600">CONSECUTIVE_FAILURES</td>
                <td className="px-4 py-3 text-sm text-orange font-medium">CRITICAL</td>
                <td className="px-4 py-3 text-sm text-gray-600">5+ consecutive failures</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Channels</h2>
        <p className="text-gray-600 mb-6">
          Configure multiple notification channels to ensure alerts reach the right people:
        </p>

        <CodeTabs>
          <TabPanel label="Slack Integration">
            <CodeBlock language="typescript">
{`// Set up Slack notifications
const slackNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.SLACK]: async (notification: AlertNotification) => {
    const { alert } = notification;
    
    const slackPayload = {
      username: 'OP Interop Alerts',
      icon_emoji: ':warning:',
      channel: '#alerts',
      attachments: [{
        color: alert.severity === 'CRITICAL' ? 'danger' : 'warning',
        title: alert.title,
        text: alert.message,
        fields: [
          { title: 'Severity', value: alert.severity, short: true },
          { title: 'Category', value: alert.category, short: true },
          { title: 'Time', value: alert.timestamp.toISOString(), short: false }
        ],
        footer: 'OP Interop Alerts',
        ts: Math.floor(alert.timestamp.getTime() / 1000)
      }]
    };
    
    const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload)
    });
    
    return response.ok;
  }
});`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="Discord Integration">
            <CodeBlock language="typescript">
{`// Set up Discord notifications
const discordNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.DISCORD]: async (notification: AlertNotification) => {
    const { alert } = notification;
    
    const discordPayload = {
      username: 'OP Interop Alerts',
      avatar_url: 'https://your-domain.com/alert-bot-avatar.png',
      embeds: [{
        title: alert.title,
        description: alert.message,
        color: alert.severity === 'CRITICAL' ? 0xFF0000 : 0xFFA500,
        fields: [
          { name: 'Severity', value: alert.severity, inline: true },
          { name: 'Category', value: alert.category, inline: true },
          { name: 'Time', value: alert.timestamp.toISOString(), inline: false }
        ],
        footer: { text: 'OP Interop Alerts' },
        timestamp: alert.timestamp.toISOString()
      }]
    };
    
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });
    
    return response.ok;
  }
});`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="Custom Webhook">
            <CodeBlock language="typescript">
{`// Set up custom webhook notifications
const webhookNotificationCallback = createSimpleNotificationCallback({
  [NotificationChannel.WEBHOOK]: async (notification: AlertNotification) => {
    const { alert, rule, context } = notification;
    
    const webhookPayload = {
      alert: {
        id: alert.id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        category: alert.category,
        timestamp: alert.timestamp.toISOString()
      },
      rule: {
        name: rule.name,
        description: rule.description
      },
      metrics: {
        status: context.metrics.status.interopStatus,
        healthLevel: context.metrics.status.healthLevel,
        successRate: context.metrics.coreMetrics.throughput.successRate,
        averageLatency: context.metrics.coreMetrics.latency.averageLatencyMs
      }
    };
    
    const response = await fetch(process.env.CUSTOM_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.WEBHOOK_TOKEN}\`
      },
      body: JSON.stringify(webhookPayload)
    });
    
    return response.ok;
  }
});`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Best Practices */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
        
        <div className="space-y-6">
          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Use Appropriate Cooldown Periods</h3>
                <p className="text-gray-700 text-sm">
                  Set cooldown periods to prevent alert spam. Critical alerts might need shorter cooldowns (5-10 minutes), 
                  while warning alerts can have longer cooldowns (15-30 minutes).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Layer Alert Severity</h3>
                <p className="text-gray-700 text-sm">
                  Use different severity levels strategically. Start with warnings for early detection, 
                  then escalate to critical alerts for urgent issues that require immediate attention.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Test Your Alert Rules</h3>
                <p className="text-gray-700 text-sm">
                  Regularly test your alert rules with known conditions to ensure they trigger correctly. 
                  Consider creating test scenarios that simulate various failure modes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange/5 border border-orange/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Avoid Alert Fatigue</h3>
                <p className="text-gray-700 text-sm">
                  Don't create too many alerts or set thresholds too low. Focus on alerts that require action. 
                  Use duration-based conditions for transient issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-yellow/5 border border-yellow/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Now that you understand the Alerts Module, explore complete examples that combine all three modules:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/examples"
            className="inline-flex items-center px-4 py-2 bg-yellow text-white font-medium rounded-lg hover:bg-yellow/80 transition-colors"
          >
            View Examples
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/installation"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Installation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
