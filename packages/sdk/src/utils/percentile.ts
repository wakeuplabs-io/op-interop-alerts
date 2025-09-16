/**
 * Calculate percentile with linear interpolation
 * @param sortedValues - Array of numbers sorted in ascending order
 * @param p - Percentile value between 0 and 1 (e.g., 0.95 for 95th percentile)
 * @returns The percentile value
 */
export function percentile(sortedValues: number[], p: number): number {
  const n = sortedValues.length;
  if (n === 0) return 0;
  if (n === 1) return sortedValues[0];
  
  const rank = p * (n - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  const weight = rank - lower;
  
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}
