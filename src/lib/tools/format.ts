export function formatCost(cost: number): string {
  if (cost >= 1000) {
    return `${Math.floor(cost / 1000)}k`;
  }
  return cost.toString();
}

export function parseCost(str: string): number {
  const num = parseInt(str.trim(), 10);
  return isNaN(num) ? NaN : num * 1000;
}