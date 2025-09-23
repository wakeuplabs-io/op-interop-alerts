import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, TrendingUp, Clock, Zap, AlertTriangle, Info } from 'lucide-react';
import CodeBlock, { CodeTabs, TabPanel } from '@/components/CodeBlock';
import ResponsiveBox, { ResponsiveGrid, ResponsiveCard } from '@/components/ResponsiveBox';

export const metadata: Metadata = {
  title: 'Metrics Module',
  description: 'Learn how to use the Metrics Module to generate comprehensive analytics from cross-chain tracking data.',
};

export default function Metrics() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange" />
          </div>
          <h1 className="text-3xl font-bold text-midnight">Metrics Module</h1>
        </div>
        <p className="text-lg text-gray-600">
          Transform raw tracking data into actionable insights with comprehensive metrics 
          including latency analysis, throughput calculations, gas usage, and system health indicators.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-600 mb-6">
          The Metrics Module analyzes tracking data to provide operational intelligence for cross-chain messaging. 
          It generates structured metrics that help you understand system performance and identify potential issues.
        </p>
        
        <ResponsiveGrid cols={2} className="mb-6">
          <ResponsiveCard>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Core Metrics</h3>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
              <li>• Latency analysis with percentiles</li>
              <li>• Throughput and success rates</li>
              <li>• Gas usage statistics</li>
              <li>• Message timing analysis</li>
            </ul>
          </ResponsiveCard>
          <ResponsiveCard>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Health Monitoring</h3>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
              <li>• System status determination</li>
              <li>• Error rate analysis</li>
              <li>• Health alerts generation</li>
              <li>• Performance recommendations</li>
            </ul>
          </ResponsiveCard>
        </ResponsiveGrid>
      </div>

      {/* generateMetrics Function */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">generateMetrics</h2>
        <p className="text-gray-600 mb-6">
          The main function that processes tracking data and returns comprehensive metrics. 
          It analyzes all successful and failed tracking attempts to provide insights.
        </p>

        <div className="bg-orange/5 border border-orange/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-midnight mb-1">Function Signature</h3>
              <code className="text-gray-700 text-sm">
                generateMetrics(trackingResults: TrackingResult[], config?: MetricsConfig): InteropMetrics
              </code>
            </div>
          </div>
        </div>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  generateMetrics, 
  InteropMetrics,
  TrackingResult,
  MetricsConfig
} from '@wakeuplabs/op-interop-alerts-sdk';

// Sample tracking results (normally collected from startTracking)
const trackingResults: TrackingResult[] = [
  // ... your tracking results from monitoring
];

// Optional configuration for metrics generation
const metricsConfig: MetricsConfig = {
  expectedLatencyMs: 30000,    // Expected latency threshold (30 seconds)
  severeLatencyMs: 120000,     // Severe latency threshold (2 minutes)
  expectedGasLimit: 100000n,   // Expected gas limit
  healthThresholds: {
    successRateWarning: 0.95,  // Warn if success rate < 95%
    successRateCritical: 0.90, // Critical if success rate < 90%
    latencyWarningMs: 60000,   // Warn if latency > 1 minute
    latencyCriticalMs: 180000  // Critical if latency > 3 minutes
  }
};

// Generate comprehensive metrics
const metrics: InteropMetrics = generateMetrics(trackingResults, metricsConfig);

// Access different metric categories
console.log('=== System Status ===');
console.log('Interop Status:', metrics.status.interopStatus);
console.log('Health Level:', metrics.status.healthLevel);
console.log('Timing Status:', metrics.status.timingStatus);

console.log('\\n=== Throughput Metrics ===');
const throughput = metrics.coreMetrics.throughput;
console.log(\`Total Messages: \${throughput.totalMessages}\`);
console.log(\`Success Rate: \${throughput.successRate.toFixed(2)}%\`);
console.log(\`Messages/Hour: \${throughput.messagesPerHour.toFixed(2)}\`);

console.log('\\n=== Latency Metrics ===');
const latency = metrics.coreMetrics.latency;
console.log(\`Average: \${(latency.averageLatencyMs / 1000).toFixed(2)}s\`);
console.log(\`Median: \${(latency.medianLatencyMs / 1000).toFixed(2)}s\`);
console.log(\`P95: \${(latency.p95LatencyMs / 1000).toFixed(2)}s\`);
console.log(\`P99: \${(latency.p99LatencyMs / 1000).toFixed(2)}s\`);

console.log('\\n=== Gas Metrics ===');
const gas = metrics.coreMetrics.gas;
console.log(\`Avg Send Gas: \${gas.averageSendGas.toString()}\`);
console.log(\`Avg Relay Gas: \${gas.averageRelayGas.toString()}\`);
console.log(\`Total Gas Used: \${gas.totalGasUsed.toString()}\`);

console.log('\\n=== Health Summary ===');
if (metrics.health.alerts.length > 0) {
  console.log('Active Alerts:');
  metrics.health.alerts.forEach((alert, index) => {
    console.log(\`  \${index + 1}. [\${alert.level}] \${alert.type}: \${alert.message}\`);
  });
}

if (metrics.health.recommendations.length > 0) {
  console.log('\\nRecommendations:');
  metrics.health.recommendations.forEach((rec, index) => {
    console.log(\`  \${index + 1}. \${rec}\`);
  });
}`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { generateMetrics } = require('@wakeuplabs/op-interop-alerts-sdk');

// Sample tracking results (normally collected from startTracking)
const trackingResults = [
  // ... your tracking results from monitoring
];

// Optional configuration for metrics generation
const metricsConfig = {
  expectedLatencyMs: 30000,    // Expected latency threshold (30 seconds)
  severeLatencyMs: 120000,     // Severe latency threshold (2 minutes)
  expectedGasLimit: 100000n,   // Expected gas limit
  healthThresholds: {
    successRateWarning: 0.95,  // Warn if success rate < 95%
    successRateCritical: 0.90, // Critical if success rate < 90%
    latencyWarningMs: 60000,   // Warn if latency > 1 minute
    latencyCriticalMs: 180000  // Critical if latency > 3 minutes
  }
};

// Generate comprehensive metrics
const metrics = generateMetrics(trackingResults, metricsConfig);

// Access different metric categories
console.log('=== System Status ===');
console.log('Interop Status:', metrics.status.interopStatus);
console.log('Health Level:', metrics.status.healthLevel);
console.log('Timing Status:', metrics.status.timingStatus);

console.log('\\n=== Throughput Metrics ===');
const throughput = metrics.coreMetrics.throughput;
console.log(\`Total Messages: \${throughput.totalMessages}\`);
console.log(\`Success Rate: \${throughput.successRate.toFixed(2)}%\`);
console.log(\`Messages/Hour: \${throughput.messagesPerHour.toFixed(2)}\`);

console.log('\\n=== Latency Metrics ===');
const latency = metrics.coreMetrics.latency;
console.log(\`Average: \${(latency.averageLatencyMs / 1000).toFixed(2)}s\`);
console.log(\`Median: \${(latency.medianLatencyMs / 1000).toFixed(2)}s\`);
console.log(\`P95: \${(latency.p95LatencyMs / 1000).toFixed(2)}s\`);
console.log(\`P99: \${(latency.p99LatencyMs / 1000).toFixed(2)}s\`);

console.log('\\n=== Gas Metrics ===');
const gas = metrics.coreMetrics.gas;
console.log(\`Avg Send Gas: \${gas.averageSendGas.toString()}\`);
console.log(\`Avg Relay Gas: \${gas.averageRelayGas.toString()}\`);
console.log(\`Total Gas Used: \${gas.totalGasUsed.toString()}\`);

console.log('\\n=== Health Summary ===');
if (metrics.health.alerts.length > 0) {
  console.log('Active Alerts:');
  metrics.health.alerts.forEach((alert, index) => {
    console.log(\`  \${index + 1}. [\${alert.level}] \${alert.type}: \${alert.message}\`);
  });
}

if (metrics.health.recommendations.length > 0) {
  console.log('\\nRecommendations:');
  metrics.health.recommendations.forEach((rec, index) => {
    console.log(\`  \${index + 1}. \${rec}\`);
  });
}`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Complete Example */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Example</h2>
        <p className="text-gray-600 mb-6">
          Here's a complete example that combines tracking with metrics generation:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  startTracking, 
  generateMetrics,
  TrackingResult,
  InteropMetrics
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

// Store tracking results for metrics generation
const trackingResults: TrackingResult[] = [];
const METRICS_THRESHOLD = 5; // Generate metrics after 5 data points

const trackingCallback = (result: TrackingResult) => {
  console.log(\`[\${result.timestamp.toISOString()}] Tracking: \${result.success ? '✅' : '❌'}\`);
  
  // Store the result
  trackingResults.push(result);
  
  // Generate metrics when we have enough data
  if (trackingResults.length >= METRICS_THRESHOLD) {
    generateAndDisplayMetrics();
  }
};

function generateAndDisplayMetrics() {
  try {
    const metrics: InteropMetrics = generateMetrics(trackingResults);
    
    console.log('\\n📊 === METRICS REPORT ===');
    console.log(\`Status: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\`);
    console.log(\`Data Points: \${metrics.status.totalDataPoints}\`);
    
    // Throughput summary
    const throughput = metrics.coreMetrics.throughput;
    console.log(\`\\n🚀 Throughput: \${throughput.successRate.toFixed(1)}% success rate\`);
    console.log(\`   Messages: \${throughput.successfulMessages}/\${throughput.totalMessages}\`);
    console.log(\`   Rate: \${throughput.messagesPerHour.toFixed(1)} msg/hour\`);
    
    // Latency summary
    const latency = metrics.coreMetrics.latency;
    console.log(\`\\n⏱️  Latency: \${(latency.averageLatencyMs / 1000).toFixed(1)}s avg\`);
    console.log(\`   P95: \${(latency.p95LatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`   Range: \${(latency.minLatencyMs / 1000).toFixed(1)}s - \${(latency.maxLatencyMs / 1000).toFixed(1)}s\`);
    
    // Gas summary
    const gas = metrics.coreMetrics.gas;
    console.log(\`\\n⛽ Gas: \${gas.averageSendGas.toString()} send, \${gas.averageRelayGas.toString()} relay\`);
    
    // Health alerts
    if (metrics.health.alerts.length > 0) {
      console.log(\`\\n🚨 Alerts:\`);
      metrics.health.alerts.forEach(alert => {
        console.log(\`   [\${alert.level}] \${alert.message}\`);
      });
    }
    
    // Recommendations
    if (metrics.health.recommendations.length > 0) {
      console.log(\`\\n💡 Recommendations:\`);
      metrics.health.recommendations.forEach(rec => {
        console.log(\`   • \${rec}\`);
      });
    }
    
    console.log('=== END REPORT ===\\n');
    
  } catch (error) {
    console.error('❌ Error generating metrics:', error);
  }
}

// Start monitoring with metrics
async function main() {
  console.log('🚀 Starting monitoring with metrics generation...');
  console.log(\`📊 Will generate metrics after \${METRICS_THRESHOLD} data points\\n\`);
  
  try {
    await startTracking(chainsInfoMock, pksInfo, trackingCallback, 5);
  } catch (error) {
    console.error('❌ Monitoring failed:', error);
  }
}

main();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { 
  startTracking, 
  generateMetrics
} = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

// Store tracking results for metrics generation
const trackingResults = [];
const METRICS_THRESHOLD = 5; // Generate metrics after 5 data points

const trackingCallback = (result) => {
  console.log(\`[\${result.timestamp.toISOString()}] Tracking: \${result.success ? '✅' : '❌'}\`);
  
  // Store the result
  trackingResults.push(result);
  
  // Generate metrics when we have enough data
  if (trackingResults.length >= METRICS_THRESHOLD) {
    generateAndDisplayMetrics();
  }
};

function generateAndDisplayMetrics() {
  try {
    const metrics = generateMetrics(trackingResults);
    
    console.log('\\n📊 === METRICS REPORT ===');
    console.log(\`Status: \${metrics.status.interopStatus} (\${metrics.status.healthLevel})\`);
    console.log(\`Data Points: \${metrics.status.totalDataPoints}\`);
    
    // Throughput summary
    const throughput = metrics.coreMetrics.throughput;
    console.log(\`\\n🚀 Throughput: \${throughput.successRate.toFixed(1)}% success rate\`);
    console.log(\`   Messages: \${throughput.successfulMessages}/\${throughput.totalMessages}\`);
    console.log(\`   Rate: \${throughput.messagesPerHour.toFixed(1)} msg/hour\`);
    
    // Latency summary
    const latency = metrics.coreMetrics.latency;
    console.log(\`\\n⏱️  Latency: \${(latency.averageLatencyMs / 1000).toFixed(1)}s avg\`);
    console.log(\`   P95: \${(latency.p95LatencyMs / 1000).toFixed(1)}s\`);
    console.log(\`   Range: \${(latency.minLatencyMs / 1000).toFixed(1)}s - \${(latency.maxLatencyMs / 1000).toFixed(1)}s\`);
    
    // Gas summary
    const gas = metrics.coreMetrics.gas;
    console.log(\`\\n⛽ Gas: \${gas.averageSendGas.toString()} send, \${gas.averageRelayGas.toString()} relay\`);
    
    // Health alerts
    if (metrics.health.alerts.length > 0) {
      console.log(\`\\n🚨 Alerts:\`);
      metrics.health.alerts.forEach(alert => {
        console.log(\`   [\${alert.level}] \${alert.message}\`);
      });
    }
    
    // Recommendations
    if (metrics.health.recommendations.length > 0) {
      console.log(\`\\n💡 Recommendations:\`);
      metrics.health.recommendations.forEach(rec => {
        console.log(\`   • \${rec}\`);
      });
    }
    
    console.log('=== END REPORT ===\\n');
    
  } catch (error) {
    console.error('❌ Error generating metrics:', error);
  }
}

// Start monitoring with metrics
async function main() {
  console.log('🚀 Starting monitoring with metrics generation...');
  console.log(\`📊 Will generate metrics after \${METRICS_THRESHOLD} data points\\n\`);
  
  try {
    await startTracking(chainsInfoMock, pksInfo, trackingCallback, 5);
  } catch (error) {
    console.error('❌ Monitoring failed:', error);
  }
}

main();`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Next Steps */}
      <div className="bg-orange/5 border border-orange/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Now that you understand metrics generation, learn how to set up intelligent alerts based on your metrics:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/alerts"
            className="inline-flex items-center px-4 py-2 bg-orange text-white font-medium rounded-lg hover:bg-orange/80 transition-colors"
          >
            Alerts Module
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Examples
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
