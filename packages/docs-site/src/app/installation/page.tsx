import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, CheckCircle, AlertCircle } from 'lucide-react';
import CodeBlock, { CodeTabs, TabPanel } from '@/components/CodeBlock';
import ResponsiveBox from '@/components/ResponsiveBox';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'Learn how to install and set up the OP Interop Alerts SDK in your project. Includes npm, yarn, and pnpm installation instructions.',
};

export default function Installation() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-midnight/10 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-midnight" />
          </div>
          <h1 className="text-3xl font-bold text-midnight">Installation</h1>
        </div>
        <p className="text-lg text-gray-600">
          Get started with the OP Interop Alerts SDK by installing it in your project.
        </p>
      </div>

      {/* Requirements */}
      <ResponsiveBox 
        variant="neutral" 
        icon={AlertCircle} 
        title="Requirements"
        className="mb-8"
      >
        <ul className="space-y-1 text-gray-700">
          <li>• Node.js 18.0.0 or higher</li>
          <li>• TypeScript 5.0.0 or higher (recommended)</li>
          <li>• A project using Viem for Ethereum interactions</li>
        </ul>
      </ResponsiveBox>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Installation</h2>
        <p className="text-gray-600 mb-6">
          Install the SDK using your preferred package manager:
        </p>

        <CodeTabs>
          <TabPanel label="npm">
            <CodeBlock language="bash">
{`npm install @wakeuplabs/op-interop-alerts-sdk`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="yarn">
            <CodeBlock language="bash">
{`yarn add @wakeuplabs/op-interop-alerts-sdk`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="pnpm">
            <CodeBlock language="bash">
{`pnpm add @wakeuplabs/op-interop-alerts-sdk`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Basic Setup */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Setup</h2>
        <p className="text-gray-600 mb-6">
          Here's how to get started with the SDK in your project:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript" filename="src/monitoring.ts">
{`import { 
  startTracking, 
  generateMetrics, 
  processAlerts,
  TrackingResult 
} from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Define your private keys
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`,
  destination: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`,
};

// Define tracking callback
const trackingCallback = (result: TrackingResult) => {
  console.log('Tracking result:', result);
  
  if (result.success) {
    console.log('✅ Message tracked successfully');
  } else {
    console.error('❌ Tracking failed:', result.error);
  }
};

// Start monitoring
async function startMonitoring() {
  try {
    await startTracking(
      chainsInfoMock, 
      pksInfo, 
      trackingCallback,
      10 // Check every 10 minutes
    );
  } catch (error) {
    console.error('Failed to start monitoring:', error);
  }
}

startMonitoring();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript" filename="src/monitoring.js">
{`const { 
  startTracking, 
  generateMetrics, 
  processAlerts 
} = require('@wakeuplabs/op-interop-alerts-sdk');
const { chainsInfoMock } = require('@wakeuplabs/op-interop-alerts-sdk/config');

// Define your private keys
const pksInfo = {
  origin: process.env.ORIGIN_PRIVATE_KEY,
  destination: process.env.DESTINATION_PRIVATE_KEY,
};

// Define tracking callback
const trackingCallback = (result) => {
  console.log('Tracking result:', result);
  
  if (result.success) {
    console.log('✅ Message tracked successfully');
  } else {
    console.error('❌ Tracking failed:', result.error);
  }
};

// Start monitoring
async function startMonitoring() {
  try {
    await startTracking(
      chainsInfoMock, 
      pksInfo, 
      trackingCallback,
      10 // Check every 10 minutes
    );
  } catch (error) {
    console.error('Failed to start monitoring:', error);
  }
}

startMonitoring();`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Contract Deployment Setup */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Deployment</h2>
        <p className="text-gray-600 mb-6">
          Before using the SDK, you need to deploy MessageReceiver contracts on both your origin and destination chains. 
          The SDK provides convenient functions to handle this deployment process.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-3">Deploy on Both Chains</h3>
        <p className="text-gray-600 mb-4">
          Use the <code>setupContracts</code> function to deploy on both chains simultaneously:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript" filename="deploy-contracts.ts">
{`import { setupContracts } from '@wakeuplabs/op-interop-alerts-sdk';
import { optimismSepolia, baseSepolia } from 'viem/chains';

async function deployContracts() {
  try {
    const result = await setupContracts({
      origin: {
        chain: optimismSepolia,
        rpcUrl: 'https://sepolia.optimism.io',
        privateKey: process.env.ORIGIN_PRIVATE_KEY as \`0x\${string}\`
      },
      destination: {
        chain: baseSepolia,
        rpcUrl: 'https://sepolia.base.org',
        privateKey: process.env.DESTINATION_PRIVATE_KEY as \`0x\${string}\`
      }
    });

    console.log('🎉 Deployment completed!');
    console.log('Origin contract:', result.origin.messageReceiverAddress);
    console.log('Destination contract:', result.destination.messageReceiverAddress);
    
    // Save these addresses for your chain configuration
    return result;
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

deployContracts();`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript" filename="deploy-contracts.js">
{`import { setupContracts } from '@wakeuplabs/op-interop-alerts-sdk';
import { optimismSepolia, baseSepolia } from 'viem/chains';

async function deployContracts() {
  try {
    const result = await setupContracts({
      origin: {
        chain: optimismSepolia,
        rpcUrl: 'https://sepolia.optimism.io',
        privateKey: process.env.ORIGIN_PRIVATE_KEY
      },
      destination: {
        chain: baseSepolia,
        rpcUrl: 'https://sepolia.base.org',
        privateKey: process.env.DESTINATION_PRIVATE_KEY
      }
    });

    console.log('🎉 Deployment completed!');
    console.log('Origin contract:', result.origin.messageReceiverAddress);
    console.log('Destination contract:', result.destination.messageReceiverAddress);
    
    // Save these addresses for your chain configuration
    return result;
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

deployContracts();`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>

        <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Deploy Single Contract</h3>
        <p className="text-gray-600 mb-4">
          For deploying on a single chain, use the <code>deployMessageReceiver</code> function:
        </p>

        <CodeTabs>
          <TabPanel label="TypeScript">
            <CodeBlock language="typescript">
{`import { deployMessageReceiver } from '@wakeuplabs/op-interop-alerts-sdk';
import { optimismSepolia } from 'viem/chains';

const result = await deployMessageReceiver({
  privateKey: process.env.PRIVATE_KEY as \`0x\${string}\`,
  chain: optimismSepolia,
  rpcUrl: 'https://sepolia.optimism.io'
});

console.log('Contract deployed at:', result.contractAddress);
console.log('Transaction hash:', result.transactionHash);`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="JavaScript">
            <CodeBlock language="javascript">
{`import { deployMessageReceiver } from '@wakeuplabs/op-interop-alerts-sdk';
import { optimismSepolia } from 'viem/chains';

const result = await deployMessageReceiver({
  privateKey: process.env.PRIVATE_KEY,
  chain: optimismSepolia,
  rpcUrl: 'https://sepolia.optimism.io'
});

console.log('Contract deployed at:', result.contractAddress);
console.log('Transaction hash:', result.transactionHash);`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>

      </div>

      {/* Environment Variables */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables</h2>
        <p className="text-gray-600 mb-6">
          Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in your project root with the following variables:
        </p>

        <CodeBlock language="bash" filename=".env">
{`# Required: Private keys for origin and destination chains
ORIGIN_PRIVATE_KEY=0x...
DESTINATION_PRIVATE_KEY=0x...

# Optional: Tracking interval in minutes (default: 10)
TRACKING_INTERVAL_MINUTES=10

# Optional: Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL=#alerts
SLACK_USERNAME=OP Interop Alerts
SLACK_ICON_EMOJI=:warning:`}
        </CodeBlock>

          <ResponsiveBox variant="warning" icon={AlertCircle} className="mt-4">
            <p className="text-midnight">
              <strong>Security Note:</strong> Never commit your private keys to version control. 
              Use environment variables and add <code>.env</code> to your <code>.gitignore</code> file.
            </p>
          </ResponsiveBox>
      </div>

      {/* Chain Configuration */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chain Configuration</h2>
        <p className="text-gray-600 mb-6">
          The SDK comes with pre-configured chain information for testing. You can also define your own chains:
        </p>

        <CodeTabs>
          <TabPanel label="Using Mock Configuration">
            <CodeBlock language="typescript">
{`import { chainsInfoMock } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Use the pre-configured chains for testing
console.log('Origin Chain ID:', chainsInfoMock.chainOrigin.chainId);
console.log('Destination Chain ID:', chainsInfoMock.chainDestination.chainId);`}
            </CodeBlock>
          </TabPanel>
          <TabPanel label="Custom Configuration">
            <CodeBlock language="typescript">
{`import type { ChainsInfo } from '@wakeuplabs/op-interop-alerts-sdk';

const customChainsInfo: ChainsInfo = {
  chainOrigin: {
    chainId: 11155420, // OP Sepolia
    rpcUrl: 'https://sepolia.optimism.io',
    l2ToL2CrossDomainMessengerAddress: '0x4200000000000000000000000000000000000023',
    messageReceiverAddress: '0x...' // Your deployed contract
  },
  chainDestination: {
    chainId: 84532, // Base Sepolia  
    rpcUrl: 'https://sepolia.base.org',
    l2ToL2CrossDomainMessengerAddress: '0x4200000000000000000000000000000000000023',
    messageReceiverAddress: '0x...' // Your deployed contract
  }
};

// Use your custom configuration
await startTracking(customChainsInfo, pksInfo, trackingCallback);`}
            </CodeBlock>
          </TabPanel>
        </CodeTabs>
      </div>

      {/* Next Steps */}
      <ResponsiveBox variant="neutral" className="bg-midnight/5 border-midnight/20">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-5 h-5 text-midnight mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Installation Complete!</h2>
        </div>
        <p className="text-gray-700 mb-4">
          You've successfully installed the OP Interop Alerts SDK. Now you can explore the different modules:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tracking"
            className="inline-flex items-center px-4 py-2 bg-midnight text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            Tracking Module
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/metrics"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Metrics Module
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Alerts Module
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </ResponsiveBox>
    </div>
  );
}
