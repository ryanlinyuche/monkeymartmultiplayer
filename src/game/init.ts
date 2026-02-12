import { GameState, FruitSource, Shelf, Player } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SIZE, PLAYER_SPEED,
  FRUIT_SOURCE_SIZE, SHELF_SIZE, FRUIT_GROW_TIME, SHELF_MAX_STOCK,
  CUSTOMER_SPAWN_INTERVAL,
} from './constants';

export function createInitialState(): GameState {
  const p1: Player = {
    id: 1,
    pos: { x: 200, y: CANVAS_HEIGHT / 2 },
    carrying: null,
    money: 0,
    speed: PLAYER_SPEED,
    size: PLAYER_SIZE,
    color: '#4a9eed',
    name: 'Player 1',
  };

  const p2: Player = {
    id: 2,
    pos: { x: CANVAS_WIDTH - 200, y: CANVAS_HEIGHT / 2 },
    carrying: null,
    money: 0,
    speed: PLAYER_SPEED,
    size: PLAYER_SIZE,
    color: '#ed4a7a',
    name: 'Player 2',
  };

  const fruitSources: FruitSource[] = [
    { pos: { x: 80, y: 100 }, type: 'banana', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: true, size: FRUIT_SOURCE_SIZE },
    { pos: { x: 80, y: 280 }, type: 'apple', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: true, size: FRUIT_SOURCE_SIZE },
    { pos: { x: 80, y: 460 }, type: 'orange', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: true, size: FRUIT_SOURCE_SIZE },
  ];

  const shelves: Shelf[] = [
    { pos: { x: CANVAS_WIDTH / 2 - 120, y: 120 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2, y: 120 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 + 120, y: 120 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 - 120, y: 520 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2, y: 520 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 + 120, y: 520 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
  ];

  return {
    players: [p1, p2],
    fruitSources,
    shelves,
    customers: [],
    customerTimer: 0,
    customerInterval: CUSTOMER_SPAWN_INTERVAL,
    gameTime: 0,
    paused: false,
  };
}
