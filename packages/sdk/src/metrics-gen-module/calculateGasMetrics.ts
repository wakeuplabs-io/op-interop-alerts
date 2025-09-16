import { TrackingResult } from "../tracking-module/startTracking";

export interface GasMetrics {
    averageSendGas: bigint;
    averageRelayGas: bigint;
    totalGasUsed: bigint;
    minSendGas: bigint;
    maxSendGas: bigint;
    minRelayGas: bigint;
    maxRelayGas: bigint;
}

export function calculateGasMetrics(successfulData: TrackingResult[]): GasMetrics {
    if (successfulData.length === 0) {
        return {
            averageSendGas: 0n,
            averageRelayGas: 0n,
            totalGasUsed: 0n,
            minSendGas: 0n,
            maxSendGas: 0n,
            minRelayGas: 0n,
            maxRelayGas: 0n
        };
    }

    const sendGasValues = successfulData.map(d => d.data!.sentMessage.gasUsed);
    const relayGasValues = successfulData.map(d => d.data!.relayMessage.gasUsed);
    
    const totalSendGas = sendGasValues.reduce((sum, gas) => sum + gas, 0n);
    const totalRelayGas = relayGasValues.reduce((sum, gas) => sum + gas, 0n);

    return {
        averageSendGas: totalSendGas / BigInt(sendGasValues.length),
        averageRelayGas: totalRelayGas / BigInt(relayGasValues.length),
        totalGasUsed: totalSendGas + totalRelayGas,
        minSendGas: sendGasValues.reduce((min, gas) => gas < min ? gas : min, sendGasValues[0]),
        maxSendGas: sendGasValues.reduce((max, gas) => gas > max ? gas : max, sendGasValues[0]),
        minRelayGas: relayGasValues.reduce((min, gas) => gas < min ? gas : min, relayGasValues[0]),
        maxRelayGas: relayGasValues.reduce((max, gas) => gas > max ? gas : max, relayGasValues[0])
    };
}
