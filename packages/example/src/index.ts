import { startTracking, TrackingCallbackData } from '@wakeuplabs/op-interop-alerts-sdk';
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

console.log('🚀 Starting OP Interop Alerts tracking...');
console.log('📊 Configuration:');
console.log(`   - Origin Chain: ${chainsInfo.chainOrigin.chainId} (${chainsInfo.chainOrigin.rpcUrl})`);
console.log(`   - Destination Chain: ${chainsInfo.chainDestination.chainId} (${chainsInfo.chainDestination.rpcUrl})`);
console.log(`   - Tracking interval: ${intervalMinutes} minutes`);
console.log('');

// Define callback to handle tracking events
const trackingCallback = (data: TrackingCallbackData) => {
    console.log('\n=== 📊 TRACKING CALLBACK DATA ===');
    
    console.log('\n🚀 SentMessage Event:');
    console.log(`   - Transaction Hash: ${data.sentMessage.transactionHash}`);
    console.log(`   - Gas Used: ${data.sentMessage.gasUsed.toString()}`);
    console.log(`   - Blockchain Timestamp: ${data.sentMessage.timestamp.toISOString()}`);
    console.log(`   - Local Timestamp: ${data.sentMessage.localTimestamp.toISOString()}`);
    console.log(`   - Logs Count: ${data.sentMessage.logs.length}`);
    // Now we can access specific event data with type safety
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
    // Now we can access specific event data with type safety
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
    
    console.log('\n=== END CALLBACK DATA ===');
};

// Start the tracking process
try {
    await startTracking(chainsInfo, pksInfo, trackingCallback, intervalMinutes);
} catch (error) {
    console.error('❌ Error during tracking:', error);
    process.exit(1);
}
