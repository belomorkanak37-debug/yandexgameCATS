import type { SaveData, UpgradeState } from './types';
import { upgradePrice } from './balance';

export const upgradeDescriptions: Record<keyof UpgradeState, {title:string; effect:string}> = {
  coffeeMachine:{title:'Быстрая кофемашина',effect:'+ очки за кофе'},
  cozyTables:{title:'Уютные столики',effect:'+ терпение котиков'},
  dessertCase:{title:'Витрина десертов',effect:'+ монеты за десерты'},
  baristaHelper:{title:'Помощник-бариста',effect:'авто-прогресс заказа'},
  treatMagnet:{title:'Магнит лакомств',effect:'+ шанс бонусов'},
  premiumBowls:{title:'Премиум миски',effect:'+ монеты за рыбу'}
};
export function buyUpgrade(save:SaveData,key:keyof UpgradeState){ const lvl=save.upgrades[key]; if(lvl>=5) return false; const price=upgradePrice(key,lvl); if(save.coins<price) return false; save.coins-=price; save.upgrades[key]=lvl+1; return true; }
