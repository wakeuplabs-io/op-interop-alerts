import { createPublicClient, createWalletClient, http, type Address, type Chain, type WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { messageReceiverAbi } from '../abis/generated';
import MessageReceiverArtifact from '../abis/MessageReceiver.json';

export interface DeployMessageReceiverParams {
  /**
   * Private key to deploy the contract with
   */
  privateKey: `0x${string}`;
  /**
   * Chain configuration to deploy on
   */
  chain: Chain;
  /**
   * RPC URL for the chain
   */
  rpcUrl: string;
}

export interface DeploymentResult {
  /**
   * Address of the deployed MessageReceiver contract
   */
  contractAddress: Address;
  /**
   * Transaction hash of the deployment
   */
  transactionHash: `0x${string}`;
  /**
   * Block number where the contract was deployed
   */
  blockNumber: bigint;
}

/**
 * Deploys the MessageReceiver contract to a specified chain
 * 
 * @param params - Deployment parameters
 * @returns Promise with deployment result
 * 
 * @example
 * ```typescript
 * import { deployMessageReceiver } from '@wakeuplabs/op-interop-alerts-sdk';
 * import { optimismSepolia } from 'viem/chains';
 * 
 * const result = await deployMessageReceiver({
 *   privateKey: process.env.PRIVATE_KEY as `0x${string}`,
 *   chain: optimismSepolia,
 *   rpcUrl: 'https://sepolia.optimism.io'
 * });
 * 
 * console.log('Contract deployed at:', result.contractAddress);
 * ```
 */
export async function deployMessageReceiver(
  params: DeployMessageReceiverParams
): Promise<DeploymentResult> {
  const { privateKey, chain, rpcUrl } = params;

  // Create account from private key
  const account = privateKeyToAccount(privateKey);

  // Create wallet client
  const walletClient: WalletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  try {
    // Deploy the contract
    const deployHash = await walletClient.deployContract({
      abi: messageReceiverAbi,
      bytecode: MessageReceiverArtifact.bytecode as `0x${string}`,
      account: walletClient.account!,
      chain: walletClient.chain!,
    });

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: deployHash,
    });

    if (!receipt.contractAddress) {
      throw new Error('Contract deployment failed: no contract address in receipt');
    }

    return {
      contractAddress: receipt.contractAddress,
      transactionHash: deployHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    throw new Error(`Failed to deploy MessageReceiver contract: ${error}`);
  }
}
