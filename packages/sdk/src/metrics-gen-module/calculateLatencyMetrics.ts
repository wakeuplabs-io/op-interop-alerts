import { TrackingResult } from "../tracking-module/startTracking";
import { percentile } from "../utils/percentile";

export interface LatencyMetrics {
    averageLatencyMs: number;
    medianLatencyMs: number;
    minLatencyMs: number;
    maxLatencyMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
}

export function calculateLatencyMetrics(successfulData: TrackingResult[]): LatencyMetrics {
    if (successfulData.length === 0) {
      return {
        averageLatencyMs: 0,
        medianLatencyMs: 0,
        minLatencyMs: 0,
        maxLatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0
      };
    }
  
    // Extraemos latencias y las ordenamos
    const latencies = successfulData
      .map(d => d.data
        ? d.data.relayMessage.localTimestamp.getTime() - d.data.sentMessage.localTimestamp.getTime()
        : 0
      )
      .sort((a, b) => a - b);
  
    const n = latencies.length;
  
    // Promedio
    const average = latencies.reduce((sum, l) => sum + l, 0) / n;
  
    // Mediana
    const median = n % 2 === 1
      ? latencies[Math.floor(n / 2)]
      : (latencies[n / 2 - 1] + latencies[n / 2]) / 2;
  
    return {
      averageLatencyMs: average,
      medianLatencyMs: median,
      minLatencyMs: latencies[0],
      maxLatencyMs: latencies[n - 1],
      p95LatencyMs: percentile(latencies, 0.95),
      p99LatencyMs: percentile(latencies, 0.99)
    };
}
