import type { SaveData, UpgradeState, GameSettings } from './types';

const KEY = 'catCafeMatchServeSave';
export const defaultUpgrades: UpgradeState = { coffeeMachine:0, cozyTables:0, dessertCase:0, baristaHelper:0, treatMagnet:0, premiumBowls:0 };
export const defaultSettings: GameSettings = { sound:true, music:true, vibration:true, quality:'high', language:'ru' };
export function defaultSave(): SaveData { return { saveVersion:1, coins:120, bestScore:0, currentDay:1, upgrades:{...defaultUpgrades}, dailyBonusDate:'', settings:{...defaultSettings}, tutorialCompleted:false, totalOrdersServed:0, totalPlayTime:0, adsWatchedCount:0, boosters:{hint:3,mix:3,boost:3} }; }
export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return persist(defaultSave());
    const parsed = JSON.parse(raw);
    const merged: SaveData = { ...defaultSave(), ...parsed, upgrades:{...defaultUpgrades,...parsed.upgrades}, settings:{...defaultSettings,...parsed.settings}, boosters:{hint:0,mix:0,boost:0,...parsed.boosters} };
    return persist(merged);
  } catch { return persist(defaultSave()); }
}
export function persist(data: SaveData): SaveData { localStorage.setItem(KEY, JSON.stringify(data)); return data; }
