import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import CodeBlock, { CodeTabs, TabPanel } from '@/components/CodeBlock';
import ResponsiveBox, { ResponsiveGrid, ResponsiveCard } from '@/components/ResponsiveBox';

export const metadata: Metadata = {
  title: 'Tracking Module',
  description: 'Learn how to use the Tracking Module to monitor cross-chain messages across Optimism Superchain networks.',
};

export default function Tracking() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue" />
          </div>
          <h1 className="text-3xl font-bold text-midnight">Tracking Module</h1>
        </div>
        <p className="text-lg text-gray-600">
          Monitor cross-chain messages in real-time across Optimism Superchain networks. 
          Track send and relay events with detailed timing and gas information.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-600 mb-6">
          The Tracking Module provides three main functions for monitoring cross-chain interoperability:
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">startTracking</h3>
            <p className="text-sm text-gray-600">Continuous monitoring loop that tracks messages at regular intervals</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">sendPing</h3>
            <p className="text-sm text-gray-600">Send a test message from origin to destination chain</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">waitForRelayedMessage</h3>
            <p className="text-sm text-gray-600">Wait for and track the relay of a specific message</p>
          </div>
        </div>
      </div>

      {/* startTracking Function */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">startTracking</h2>
        <p className="text-gray-600 mb-6">
          The main function for continuous cross-chain message monitoring. It runs in a loop, 
          sending ping messages and tracking their relay status.
        </p>

        <ResponsiveBox variant="info" icon={Info} title="Function Signature" className="mb-6">
          <code className="text-gray-700 text-sm">
            startTracking(chainsInfo, pksInfo, callback?, intervalMinutes?)
          </code>
        </ResponsiveBox>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  startTracking, 
  TrackingResult, 
  TrackingCallback 
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Define your private keys
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

// Define callback to handle tracking results
const trackingCallback: TrackingCallback = (result: TrackingResult) => {
  console.log(\`[\${result.timestamp.toISOString()}] Tracking result:\`, result.success);
  
  if (result.success && result.data) {
    const { sentMessage, relayMessage } = result.data;
    
    // Calculate latency
    const latency = relayMessage.localTimestamp.getTime() - 
                   sentMessage.localTimestamp.getTime();
    
    console.log(\`✅ Message relayed successfully in \${latency}ms\`);
    console.log(\`📊 Gas used - Send: \${sentMessage.gasUsed}, Relay: \${relayMessage.gasUsed}\`);
    
  } else if (result.error) {
    console.error(\`❌ Tracking failed: \${result.error.error.message}\`);
  }
};

// Start continuous tracking (checks every 10 minutes)
async function main() {
  try {
    await startTracking(
      chainsInfoMock,
      pksInfo, 
      trackingCallback,
      10 // Check every 10 minutes
    );
  } catch (error) {
    console.error('Failed to start tracking:', error);
  }
}

main();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { 
  startTracking 
} = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

// Define your private keys
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

// Define callback to handle tracking results
const trackingCallback = (result) => {
  console.log(\`[\${result.timestamp.toISOString()}] Tracking result:\`, result.success);
  
  if (result.success && result.data) {
    const { sentMessage, relayMessage } = result.data;
    
    // Calculate latency
    const latency = relayMessage.localTimestamp.getTime() - 
                   sentMessage.localTimestamp.getTime();
    
    console.log(\`✅ Message relayed successfully in \${latency}ms\`);
    console.log(\`📊 Gas used - Send: \${sentMessage.gasUsed}, Relay: \${relayMessage.gasUsed}\`);
    
  } else if (result.error) {
    console.error(\`❌ Tracking failed: \${result.error.error.message}\`);
  }
};

// Start continuous tracking (checks every 10 minutes)
async function main() {
  try {
    await startTracking(
      chainsInfoMock,
      pksInfo, 
      trackingCallback,
      10 // Check every 10 minutes
    );
  } catch (error) {
    console.error('Failed to start tracking:', error);
  }
}

main();`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>

        {/* Parameters */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Parameter</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">chainsInfo</td>
                  <td className="px-4 py-3 text-sm text-gray-600">ChainsInfo</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Configuration for origin and destination chains</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">pksInfo</td>
                  <td className="px-4 py-3 text-sm text-gray-600">PKsInfo</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Private keys for both chains</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">callback</td>
                  <td className="px-4 py-3 text-sm text-gray-600">TrackingCallback?</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Optional callback function for tracking results</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">intervalMinutes</td>
                  <td className="px-4 py-3 text-sm text-gray-600">number?</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Interval between checks in minutes (default: 10)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* sendPing Function */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">sendPing</h2>
        <p className="text-gray-600 mb-6">
          Send a test message from the origin chain to the destination chain. 
          This function returns detailed information about the sent message.
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  sendPing, 
  SendPingResult 
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

async function testSendPing() {
  try {
    const result: SendPingResult = await sendPing(chainsInfoMock, pksInfo);
    
    if (result.status === 'SUCCESS') {
      console.log('✅ Ping sent successfully!');
      console.log('Transaction Hash:', result.data.transactionHash);
      console.log('Gas Used:', result.data.eventData.gasUsed.toString());
      console.log('Message Sender:', result.data.sentMessageSender);
      console.log('Message Payload:', result.data.sentMessagePayload);
      
      // Access the event data
      const eventData = result.data.eventData;
      console.log('Event Args:', {
        destination: eventData.event.args.destination?.toString(),
        target: eventData.event.args.target,
        messageNonce: eventData.event.args.messageNonce?.toString(),
        sender: eventData.event.args.sender
      });
      
    } else {
      console.error('❌ Failed to send ping:', result.error.message);
    }
  } catch (error) {
    console.error('Error sending ping:', error);
  }
}

testSendPing();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { sendPing } = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

async function testSendPing() {
  try {
    const result = await sendPing(chainsInfoMock, pksInfo);
    
    if (result.status === 'SUCCESS') {
      console.log('✅ Ping sent successfully!');
      console.log('Transaction Hash:', result.data.transactionHash);
      console.log('Gas Used:', result.data.eventData.gasUsed.toString());
      console.log('Message Sender:', result.data.sentMessageSender);
      console.log('Message Payload:', result.data.sentMessagePayload);
      
      // Access the event data
      const eventData = result.data.eventData;
      console.log('Event Args:', {
        destination: eventData.event.args.destination?.toString(),
        target: eventData.event.args.target,
        messageNonce: eventData.event.args.messageNonce?.toString(),
        sender: eventData.event.args.sender
      });
      
    } else {
      console.error('❌ Failed to send ping:', result.error.message);
    }
  } catch (error) {
    console.error('Error sending ping:', error);
  }
}

testSendPing();`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* waitForRelayedMessage Function */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">waitForRelayedMessage</h2>
        <p className="text-gray-600 mb-6">
          Wait for and track the relay of a specific message on the destination chain. 
          This function monitors for the RelayedMessage event that corresponds to a previously sent message.
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { 
  sendPing, 
  waitForRelayedMessage,
  WaitForRelayedMessageResult 
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

async function trackMessageRelay() {
  try {
    // First, send a ping message
    const sendResult = await sendPing(chainsInfoMock, pksInfo);
    
    if (sendResult.status !== 'SUCCESS') {
      console.error('Failed to send ping:', sendResult.error.message);
      return;
    }
    
    console.log('✅ Ping sent, waiting for relay...');
    
    // Wait for the message to be relayed
    const relayResult: WaitForRelayedMessageResult = await waitForRelayedMessage(
      chainsInfoMock,
      sendResult.data.sentMessageSender,
      sendResult.data.sentMessagePayload
    );
    
    if (relayResult.status === 'SUCCESS') {
      console.log('✅ Message relayed successfully!');
      
      const relayData = relayResult.data;
      console.log('Relay Transaction Hash:', relayData.transactionHash);
      console.log('Relay Gas Used:', relayData.eventData.gasUsed.toString());
      
      // Calculate total latency
      const sendTime = sendResult.data.eventData.localTimestamp;
      const relayTime = relayData.eventData.localTimestamp;
      const latency = relayTime.getTime() - sendTime.getTime();
      
      console.log(\`⏱️  Total latency: \${latency}ms\`);
      
      // Access relay event data
      const eventData = relayData.eventData;
      console.log('Relay Event Args:', {
        source: eventData.event.args.source?.toString(),
        messageNonce: eventData.event.args.messageNonce?.toString(),
        messageHash: eventData.event.args.messageHash,
        returnDataHash: eventData.event.args.returnDataHash
      });
      
    } else {
      console.error('❌ Failed to wait for relay:', relayResult.error.message);
    }
    
  } catch (error) {
    console.error('Error tracking message relay:', error);
  }
}

trackMessageRelay();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`const { 
  sendPing, 
  waitForRelayedMessage 
} = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

async function trackMessageRelay() {
  try {
    // First, send a ping message
    const sendResult = await sendPing(chainsInfoMock, pksInfo);
    
    if (sendResult.status !== 'SUCCESS') {
      console.error('Failed to send ping:', sendResult.error.message);
      return;
    }
    
    console.log('✅ Ping sent, waiting for relay...');
    
    // Wait for the message to be relayed
    const relayResult = await waitForRelayedMessage(
      chainsInfoMock,
      sendResult.data.sentMessageSender,
      sendResult.data.sentMessagePayload
    );
    
    if (relayResult.status === 'SUCCESS') {
      console.log('✅ Message relayed successfully!');
      
      const relayData = relayResult.data;
      console.log('Relay Transaction Hash:', relayData.transactionHash);
      console.log('Relay Gas Used:', relayData.eventData.gasUsed.toString());
      
      // Calculate total latency
      const sendTime = sendResult.data.eventData.localTimestamp;
      const relayTime = relayData.eventData.localTimestamp;
      const latency = relayTime.getTime() - sendTime.getTime();
      
      console.log(\`⏱️  Total latency: \${latency}ms\`);
      
      // Access relay event data
      const eventData = relayData.eventData;
      console.log('Relay Event Args:', {
        source: eventData.event.args.source?.toString(),
        messageNonce: eventData.event.args.messageNonce?.toString(),
        messageHash: eventData.event.args.messageHash,
        returnDataHash: eventData.event.args.returnDataHash
      });
      
    } else {
      console.error('❌ Failed to wait for relay:', relayResult.error.message);
    }
    
  } catch (error) {
    console.error('Error tracking message relay:', error);
  }
}

trackMessageRelay();`}
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
                <h3 className="font-semibold text-midnight mb-1">Handle Errors Gracefully</h3>
                <p className="text-gray-700 text-sm">
                  Always check the status of results and handle both success and failure cases. 
                  Network issues and chain congestion can cause temporary failures.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Use Appropriate Intervals</h3>
                <p className="text-gray-700 text-sm">
                  Choose tracking intervals based on your needs. Shorter intervals provide more data 
                  but consume more resources. For production monitoring, 5-10 minutes is usually sufficient.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Store Tracking Results</h3>
                <p className="text-gray-700 text-sm">
                  Keep a history of tracking results to generate meaningful metrics and detect patterns. 
                  This data is essential for the Metrics and Alerts modules.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange/5 border border-orange/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-midnight mb-1">Avoid Very Short Intervals</h3>
                <p className="text-gray-700 text-sm">
                  Don't set intervals shorter than 1 minute as this can overwhelm the networks 
                  and may be considered spam by RPC providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue/5 border border-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Now that you understand message tracking, learn how to generate metrics from your tracking data:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/metrics"
            className="inline-flex items-center px-4 py-2 bg-blue text-white font-medium rounded-lg hover:bg-blue/80 transition-colors"
          >
            Metrics Module
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
