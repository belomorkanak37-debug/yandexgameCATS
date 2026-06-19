import type { UpgradeState } from './types';

export const SCORE_PER_ITEM = 10;
export const ORDER_SCORE = 100;
export const FAST_ORDER_SCORE = 50;
export const UPGRADE_BASE_PRICES: Record<keyof UpgradeState, number> = {
  coffeeMachine: 60, cozyTables: 70, dessertCase: 80, baristaHelper: 110, treatMagnet: 90, premiumBowls: 80
};

export function chainScore(length: number, combo: number) {
  let score = length * SCORE_PER_ITEM;
  if (length === 4) score += 20;
  if (length === 5) score += 50;
  if (length >= 6) score += 100;
  return Math.round(score * comboMultiplier(combo));
}
export function comboMultiplier(combo: number) { return 1 + Math.floor(combo / 3) * 0.2; }
export function upgradePrice(key: keyof UpgradeState, level: number) { return UPGRADE_BASE_PRICES[key] * Math.max(1, level + 1) * Math.max(1, level + 1); }
export function orderCoinReward(base: number, combo: number) { return Math.round(base + combo * 2); }
