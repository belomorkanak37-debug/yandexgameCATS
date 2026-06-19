export type ItemType = 'coffee' | 'tea' | 'milk' | 'croissant' | 'cake' | 'cookie' | 'fish' | 'strawberryDessert' | 'sugarBomb' | 'goldenFish' | 'coffeeBoost';
export type BasicItemType = Exclude<ItemType, 'sugarBomb' | 'goldenFish' | 'coffeeBoost'>;
export type ItemState = 'idle' | 'selected' | 'falling' | 'collecting' | 'special';
export type MoodState = 'happy' | 'waiting' | 'impatient' | 'served';
export type Screen = 'loading' | 'menu' | 'tutorial' | 'gameplay' | 'pause' | 'results' | 'shop' | 'leaderboard' | 'settings' | 'dailyBonus';

export interface Item {
  id: number;
  type: ItemType;
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: ItemState;
  selected: boolean;
  falling: boolean;
  scale: number;
  animationTime: number;
}

export interface OrderRequirement { type: BasicItemType; count: number; progress: number; }
export interface Order { id: number; requirements: OrderRequirement[]; reward: number; patience: number; maxPatience: number; difficulty: number; createdAt: number; }
export interface Customer { id: number; name: string; variant: 'orange'|'gray'|'white'|'black'|'tabby'; mood: MoodState; order: Order; x: number; y: number; bob: number; }

export interface FloatingText { id: number; text: string; x: number; y: number; vy: number; life: number; maxLife: number; size: number; }
export interface Particle { id: number; kind: 'heart'|'coin'|'spark'|'crumb'; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; scale: number; }
export interface BoardLayout { x: number; y: number; size: number; cell: number; }

export interface UpgradeState { coffeeMachine: number; cozyTables: number; dessertCase: number; baristaHelper: number; treatMagnet: number; premiumBowls: number; }
export interface GameSettings { sound: boolean; music: boolean; vibration: boolean; quality: 'low'|'medium'|'high'; language: 'ru'|'en'; }
export interface SaveData { saveVersion: number; coins: number; bestScore: number; currentDay: number; upgrades: UpgradeState; dailyBonusDate: string; settings: GameSettings; tutorialCompleted: boolean; totalOrdersServed: number; totalPlayTime: number; adsWatchedCount: number; boosters: { hint: number; mix: number; boost: number; }; }
export interface LevelConfig { day: number; duration: number; activeItems: BasicItemType[]; customers: number; basePatience: number; multiItemChance: number; maxRequirementCount: number; }
export interface Button { id: string; label: string; x: number; y: number; w: number; h: number; enabled?: boolean; tag?: string; }
