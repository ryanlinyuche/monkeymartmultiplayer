import { FruitType } from './types';

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;
export const PLAYER_SIZE = 28;
export const PLAYER_SPEED = 3;
export const PLOT_SIZE = 50;
export const SHELF_SIZE = 44;
export const CASHIER_SIZE = 50;
export const CUSTOMER_SIZE = 24;
export const CUSTOMER_SPEED = 1.5;
export const INTERACTION_DISTANCE = 50;
export const CUSTOMER_SPAWN_INTERVAL = 200; // frames
export const FRUIT_GROW_TIME = 240; // frames
export const SHELF_MAX_STOCK = 5;
export const CUSTOMER_PATIENCE = 800; // frames

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

export const PLOT_COSTS: Record<FruitType, number> = {
  banana: 20,
  apple: 35,
  orange: 25,
};

export const FRUIT_EMOJI: Record<FruitType, string> = {
  banana: '🍌',
  apple: '🍎',
  orange: '🍊',
};

export const PLAYER_COLORS = ['#4a9eed', '#ed4a7a', '#4aed8b', '#eda74a'];
export const PLAYER_BODY_COLORS = ['#8B5E3C', '#6B4226', '#7A6B3C', '#5C3D2E'];
