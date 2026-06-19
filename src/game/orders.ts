import type { BasicItemType, LevelConfig, Order, OrderRequirement, UpgradeState } from './types';
import { choice, uid } from './utils';

export function createOrder(level: LevelConfig, upgrades: UpgradeState): Order {
  const requirements: OrderRequirement[] = [];
  const itemCount = Math.random()<level.multiItemChance ? Math.min(level.maxRequirementCount, 2 + (Math.random()<0.2?1:0)) : 1;
  const pool = [...level.activeItems];
  for(let i=0;i<itemCount;i++){
    const t = choice(pool); pool.splice(pool.indexOf(t),1);
    requirements.push({ type:t, count: 1 + Math.floor(Math.random()*Math.min(3, level.day<4?2:3)), progress:0 });
  }
  const dessertBonus = requirements.some(r=>r.type==='cake'||r.type==='strawberryDessert') ? upgrades.dessertCase*3 : 0;
  const fishBonus = requirements.some(r=>r.type==='fish') ? upgrades.premiumBowls*3 : 0;
  const reward = 12 + requirements.reduce((a,r)=>a+r.count*6,0) + dessertBonus + fishBonus;
  const patience = level.basePatience + upgrades.cozyTables*2 + requirements.length*5;
  return { id:uid(), requirements, reward, patience, maxPatience:patience, difficulty:requirements.length, createdAt:performance.now()/1000 };
}
export function applyCollected(order:Order, type:BasicItemType, count:number){
  let used=0;
  for(const r of order.requirements) if(r.type===type && r.progress<r.count){ const add=Math.min(count-used, r.count-r.progress); r.progress+=add; used+=add; if(used>=count) break; }
  return used;
}
export function applyWild(order:Order, count=1){
  let used=0;
  for(const r of order.requirements) while(r.progress<r.count && used<count){ r.progress++; used++; }
  return used;
}
export function isComplete(order:Order){ return order.requirements.every(r=>r.progress>=r.count); }
