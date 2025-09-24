import { ChainsInfo } from "@wakeuplabs/op-interop-alerts-sdk/config";

/**
 * Format time difference in a human-readable way with consistent format
 * @param ms Time difference in milliseconds
 * @returns Formatted string with labels (e.g., "1h 23m 45s 123ms")
 */
export const formatTimeDifference = (ms: number): string => {
    const absMs = Math.abs(ms);
    const hours = Math.floor(absMs / (1000 * 60 * 60));
    const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absMs % (1000 * 60)) / 1000);
    const milliseconds = absMs % 1000;
    
    const sign = ms < 0 ? '-' : '';
    
    // Always use the same format with labels
    const parts: string[] = [];
    
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    
    if (minutes > 0 || hours > 0) {
        parts.push(`${minutes}m`);
    }
    
    if (seconds > 0 || minutes > 0 || hours > 0) {
        parts.push(`${seconds}s`);
    }
    
    // Always show milliseconds
    parts.push(`${milliseconds}ms`);
    
    return `${sign}${parts.join(' ')}`;
};

export const chainsInfoOpSepoliaToBaseSepolia: ChainsInfo = {
    chainOrigin: {
        rpcUrl: "https://sepolia.optimism.io",
        chainId: 11155420,
        l2CrossDomainMessenger: "0x5fa8f9b682061e5610498396bb6f8b5f51865d06",
    },
    chainDestination: {
        rpcUrl: "https://base-sepolia.g.alchemy.com/v2/RIiPWUo_3q3FPNciqRon2QmVIUmExg9p",
        chainId: 84532,
        messageReceiver: "0x1f77040905bb10b5ff623846082bd1fd7a3ddf9b",
        l2CrossDomainMessenger: "0x92c6145cb183d6801b07bba47a18bf44668b2d5b",
    },
}