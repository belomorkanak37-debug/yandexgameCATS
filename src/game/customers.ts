import type { Customer, LevelConfig, UpgradeState } from './types';
import { CAT_NAMES, CAT_VARIANTS } from './config';
import { choice, uid } from './utils';
import { createOrder } from './orders';

export function createCustomer(level:LevelConfig, upgrades:UpgradeState): Customer {
  return { id:uid(), name:choice(CAT_NAMES), variant:choice([...CAT_VARIANTS]), mood:'waiting', order:createOrder(level, upgrades), x:0, y:0, bob:Math.random()*10 };
}
export function updateCustomerMood(c:Customer){
  const p=c.order.patience/c.order.maxPatience;
  c.mood = p < .33 ? 'impatient' : 'waiting';
}
