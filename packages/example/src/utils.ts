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
