import { startTracking } from '@wakeuplabs/op-interop-alerts-sdk';
import { chainsInfoMock as chainsInfo } from '@wakeuplabs/op-interop-alerts-sdk/config';
import { config } from 'dotenv';

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

console.log('🚀 Starting OP Interop Alerts tracking...');
console.log('📊 Configuration:');
console.log(`   - Origin Chain: ${chainsInfo.chainOrigin.chainId} (${chainsInfo.chainOrigin.rpcUrl})`);
console.log(`   - Destination Chain: ${chainsInfo.chainDestination.chainId} (${chainsInfo.chainDestination.rpcUrl})`);
console.log(`   - Tracking interval: ${intervalMinutes} minutes`);
console.log('');

// Start the tracking process
try {
    await startTracking(chainsInfo, pksInfo, intervalMinutes);
} catch (error) {
    console.error('❌ Error during tracking:', error);
    process.exit(1);
}
