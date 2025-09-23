import { deployMessageReceiver } from './deployMessageReceiver';
import type { SetupConfig, SetupResult } from './types';

/**
 * Sets up MessageReceiver contracts on both origin and destination chains
 * 
 * @param config - Setup configuration for both chains
 * @returns Promise with deployment results for both chains
 * 
 * @example
 * ```typescript
 * import { setupContracts } from '@wakeuplabs/op-interop-alerts-sdk';
 * import { optimismSepolia, baseSepolia } from 'viem/chains';
 * 
 * const result = await setupContracts({
 *   origin: {
 *     chain: optimismSepolia,
 *     rpcUrl: 'https://sepolia.optimism.io',
 *     privateKey: process.env.ORIGIN_PRIVATE_KEY as `0x${string}`
 *   },
 *   destination: {
 *     chain: baseSepolia,
 *     rpcUrl: 'https://sepolia.base.org',
 *     privateKey: process.env.DESTINATION_PRIVATE_KEY as `0x${string}`
 *   }
 * });
 * 
 * console.log('Origin contract:', result.origin.messageReceiverAddress);
 * console.log('Destination contract:', result.destination.messageReceiverAddress);
 * ```
 */
export async function setupContracts(config: SetupConfig): Promise<SetupResult> {
  console.log('🚀 Starting contract deployment setup...');
  
  try {
    // Deploy on origin chain
    console.log(`📡 Deploying MessageReceiver on origin chain (${config.origin.chain.name})...`);
    const originResult = await deployMessageReceiver({
      privateKey: config.origin.privateKey,
      chain: config.origin.chain,
      rpcUrl: config.origin.rpcUrl,
    });
    
    console.log(`✅ Origin deployment successful: ${originResult.contractAddress}`);

    // Deploy on destination chain
    console.log(`📡 Deploying MessageReceiver on destination chain (${config.destination.chain.name})...`);
    const destinationResult = await deployMessageReceiver({
      privateKey: config.destination.privateKey,
      chain: config.destination.chain,
      rpcUrl: config.destination.rpcUrl,
    });
    
    console.log(`✅ Destination deployment successful: ${destinationResult.contractAddress}`);

    const result: SetupResult = {
      origin: {
        chainId: config.origin.chain.id,
        messageReceiverAddress: originResult.contractAddress,
        transactionHash: originResult.transactionHash,
        blockNumber: originResult.blockNumber,
      },
      destination: {
        chainId: config.destination.chain.id,
        messageReceiverAddress: destinationResult.contractAddress,
        transactionHash: destinationResult.transactionHash,
        blockNumber: destinationResult.blockNumber,
      },
    };

    console.log('🎉 Setup completed successfully!');
    console.log('📋 Summary:');
    console.log(`   Origin (${config.origin.chain.name}): ${result.origin.messageReceiverAddress}`);
    console.log(`   Destination (${config.destination.chain.name}): ${result.destination.messageReceiverAddress}`);

    return result;
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw new Error(`Contract setup failed: ${error}`);
  }
}
