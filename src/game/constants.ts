import { FruitType } from './types';

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;
export const PLAYER_SIZE = 28;
export const PLAYER_SPEED = 3;
export const FRUIT_SOURCE_SIZE = 40;
export const SHELF_SIZE = 44;
export const CUSTOMER_SIZE = 24;
export const CUSTOMER_SPEED = 1.5;
export const INTERACTION_DISTANCE = 45;
export const CUSTOMER_SPAWN_INTERVAL = 180; // frames
export const FRUIT_GROW_TIME = 180; // frames
export const SHELF_MAX_STOCK = 5;
export const CUSTOMER_PATIENCE = 600; // frames

export const FRUIT_COLORS: Record<FruitType, string> = {
  banana: '#f0d040',
  apple: '#e04040',
  orange: '#e88030',
};

export const FRUIT_PRICES: Record<FruitType, number> = {
  banana: 5,
  apple: 8,
  orange: 6,
};

export const FRUIT_EMOJI: Record<FruitType, string> = {
  banana: '🍌',
  apple: '🍎',
  orange: '🍊',
};

export const P1_KEYS = { up: 'w', down: 's', left: 'a', right: 'd' };
export const P2_KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
