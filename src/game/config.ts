import type { BasicItemType, ItemType } from './types';

export const BOARD_SIZE = 6;
export const SHIFT_SECONDS_DEFAULT = 75;
export const LEADERBOARD_NAME = 'cat_cafe_score';

export const BASIC_ITEMS: BasicItemType[] = ['coffee','tea','milk','croissant','cake','cookie','fish','strawberryDessert'];

export const ITEM_LABELS: Record<ItemType, string> = {
  coffee: 'Кофе', tea: 'Чай', milk: 'Молоко', croissant: 'Круассан', cake: 'Пирожное', cookie: 'Печенье', fish: 'Рыба', strawberryDessert: 'Клубничный десерт', sugarBomb: 'Бомбочка-сахарок', goldenFish: 'Золотая рыбка', coffeeBoost: 'Кофейный буст'
};

export const CAT_NAMES = ['Рыжик','Белла','Мурзик','Пуша','Барсик','Маркиз','Сима','Латте'];
export const CAT_VARIANTS = ['orange','gray','white','black','tabby'] as const;
