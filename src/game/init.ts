import { GameState, Plot, Shelf, Player, Cashier } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SIZE, PLAYER_SPEED,
  PLOT_SIZE, SHELF_SIZE, CASHIER_SIZE, FRUIT_GROW_TIME,
  SHELF_MAX_STOCK, CUSTOMER_SPAWN_INTERVAL, PLOT_COSTS,
  PLAYER_COLORS,
} from './constants';

export function createPlayer(id: number, name: string): Player {
  const startPositions = [
    { x: 200, y: CANVAS_HEIGHT / 2 },
    { x: CANVAS_WIDTH - 200, y: CANVAS_HEIGHT / 2 },
    { x: 200, y: CANVAS_HEIGHT / 2 - 100 },
    { x: CANVAS_WIDTH - 200, y: CANVAS_HEIGHT / 2 - 100 },
  ];
  return {
    id,
    pos: startPositions[id - 1] || startPositions[0],
    carrying: null,
    speed: PLAYER_SPEED,
    size: PLAYER_SIZE,
    color: PLAYER_COLORS[id - 1] || PLAYER_COLORS[0],
    name,
  };
}

export function createInitialState(playerCount: number = 1, playerNames: string[] = ['Player 1']): GameState {
  const players: Player[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push(createPlayer(i + 1, playerNames[i] || `Player ${i + 1}`));
  }

  // Plots - some purchased (starter), some buyable
  const plots: Plot[] = [
    // Starter plot (free, already has banana)
    { pos: { x: 80, y: 180 }, type: 'banana', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: true, size: PLOT_SIZE, cost: 0, purchased: true },
    // Buyable plots
    { pos: { x: 80, y: 320 }, type: 'apple', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: false, size: PLOT_SIZE, cost: PLOT_COSTS.apple, purchased: false },
    { pos: { x: 80, y: 460 }, type: 'orange', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: false, size: PLOT_SIZE, cost: PLOT_COSTS.orange, purchased: false },
    { pos: { x: 880, y: 180 }, type: 'banana', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: false, size: PLOT_SIZE, cost: PLOT_COSTS.banana, purchased: false },
    { pos: { x: 880, y: 320 }, type: 'apple', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: false, size: PLOT_SIZE, cost: PLOT_COSTS.apple, purchased: false },
    { pos: { x: 880, y: 460 }, type: 'orange', growTimer: 0, maxGrow: FRUIT_GROW_TIME, ready: false, size: PLOT_SIZE, cost: PLOT_COSTS.orange, purchased: false },
  ];

  const shelves: Shelf[] = [
    { pos: { x: CANVAS_WIDTH / 2 - 120, y: 150 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2, y: 150 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 + 120, y: 150 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 - 120, y: 350 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2, y: 350 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
    { pos: { x: CANVAS_WIDTH / 2 + 120, y: 350 }, type: null, stock: 0, maxStock: SHELF_MAX_STOCK, size: SHELF_SIZE },
  ];

  const cashier: Cashier = {
    pos: { x: CANVAS_WIDTH / 2, y: 540 },
    size: CASHIER_SIZE,
  };

  return {
    players,
    plots,
    shelves,
    cashier,
    customers: [],
    customerTimer: 0,
    customerInterval: CUSTOMER_SPAWN_INTERVAL,
    gameTime: 0,
    paused: false,
    money: 0,
  };
}
