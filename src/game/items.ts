import type { BasicItemType, Item, ItemType } from './types';
import { choice, uid } from './utils';

export function createItem(type: ItemType, gridX: number, gridY: number): Item {
  return { id: uid(), type, gridX, gridY, x:gridX, y:gridY, targetX:gridX, targetY:gridY, state:'idle', selected:false, falling:false, scale:1, animationTime:0 };
}
export function randomItem(active: BasicItemType[], gridX:number, gridY:number, specialChance=0.015): Item {
  let t: ItemType = choice(active);
  const r = Math.random();
  if (r < specialChance) t = 'goldenFish';
  else if (r < specialChance*1.7) t = 'coffeeBoost';
  return createItem(t, gridX, gridY);
}
export function isBasic(type: ItemType): type is BasicItemType { return !['sugarBomb','goldenFish','coffeeBoost'].includes(type); }
