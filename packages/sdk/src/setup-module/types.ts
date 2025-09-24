import type { Address, Chain } from 'viem';

/**
 * Configuration for a single chain in the setup
 */
export interface ChainSetupConfig {
  /**
   * Chain configuration (from viem/chains)
   */
  chain: Chain;
  /**
   * RPC URL for the chain
   */
  rpcUrl: string;
  /**
   * Private key to use for deployment on this chain
   */
  privateKey: `0x${string}`;
}

/**
 * Complete setup configuration for both origin and destination chains
 */
export interface SetupConfig {
  /**
   * Origin chain configuration
   */
  origin: ChainSetupConfig;
  /**
   * Destination chain configuration
   */
  destination: ChainSetupConfig;
}

/**
 * Result of setting up contracts on both chains
 */
export interface SetupResult {
  /**
   * Origin chain deployment result
   */
  origin: {
    chainId: number;
    messageReceiverAddress: Address;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
  };
  /**
   * Destination chain deployment result
   */
  destination: {
    chainId: number;
    messageReceiverAddress: Address;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
  };
}

/**
 * Verification result for a deployed contract
 */
export interface ContractVerification {
  /**
   * Whether the contract is deployed and accessible
   */
  isDeployed: boolean;
  /**
   * Contract address
   */
  address: Address;
  /**
   * Chain ID where the contract is deployed
   */
  chainId: number;
  /**
   * Error message if verification failed
   */
  error?: string;
}
