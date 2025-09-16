import { TrackingResult } from "../tracking-module/startTracking";

export interface ThroughputMetrics {
    totalMessages: number;
    successfulMessages: number;
    failedMessages: number;
    successRate: number; // percentage
    messagesPerHour: number;
}

export function calculateThroughputMetrics(trackingData: TrackingResult[]): ThroughputMetrics {
    const totalMessages = trackingData.length;
    const successfulMessages = trackingData.filter(d => d.success).length;
    const failedMessages = totalMessages - successfulMessages;
    const successRate = totalMessages > 0 ? (successfulMessages / totalMessages) * 100 : 0;
    
    // Calculate messages per hour based on data window
    const timeSpanMs = trackingData.length > 1 ? 
        Math.max(...trackingData.map(d => d.timestamp.getTime())) - 
        Math.min(...trackingData.map(d => d.timestamp.getTime())) : 0;
    
    const messagesPerHour = timeSpanMs > 0 ? (totalMessages / timeSpanMs) * 3600000 : 0;

    return {
        totalMessages,
        successfulMessages,
        failedMessages,
        successRate,
        messagesPerHour
    };
}
