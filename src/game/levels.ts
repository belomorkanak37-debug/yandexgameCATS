import type { BasicItemType, LevelConfig } from './types';

export function getLevelConfig(day: number): LevelConfig {
  const active: BasicItemType[] = ['coffee','tea','milk'];
  if (day >= 2) active.push('cookie');
  if (day >= 3) active.push('croissant');
  if (day >= 5) active.push('fish');
  if (day >= 7) active.push('cake');
  if (day >= 15) active.push('strawberryDessert');
  return {
    day,
    duration: day <= 2 ? 60 : 75,
    activeItems: active,
    customers: day >= 10 ? 3 : 2,
    basePatience: Math.max(14, 28 - Math.floor(day / 4) * 2),
    multiItemChance: day >= 20 ? 0.62 : day >= 4 ? 0.34 + day * 0.01 : 0,
    maxRequirementCount: day >= 20 ? 3 : day >= 4 ? 2 : 1
  };
}
