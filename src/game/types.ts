export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: number; // 1-4
  pos: Position;
  carrying: FruitType | null;
  speed: number;
  size: number;
  color: string;
  name: string;
}

export type FruitType = 'banana' | 'apple' | 'orange';

export interface Plot {
  pos: Position;
  type: FruitType | null; // null = empty/purchasable
  growTimer: number;
  maxGrow: number;
  ready: boolean;
  size: number;
  cost: number;
  purchased: boolean;
}

export interface Shelf {
  pos: Position;
  type: FruitType | null;
  stock: number;
  maxStock: number;
  size: number;
}

export interface Cashier {
  pos: Position;
  size: number;
}

export interface Customer {
  pos: Position;
  targetShelf: number;
  wants: FruitType;
  served: boolean;
  leaving: boolean;
  atCashier: boolean;
  patience: number;
  maxPatience: number;
  speed: number;
  size: number;
}

export interface GameState {
  players: Player[];
  plots: Plot[];
  shelves: Shelf[];
  cashier: Cashier;
  customers: Customer[];
  customerTimer: number;
  customerInterval: number;
  gameTime: number;
  paused: boolean;
  money: number; // shared money pool
}

export interface Keys {
  [key: string]: boolean;
}

export interface PlayerInput {
  playerId: number;
  keys: { up: boolean; down: boolean; left: boolean; right: boolean; interact: boolean };
}

export interface MultiplayerState {
  roomCode: string;
  playerId: number;
  isHost: boolean;
  playerCount: number;
  playerNames: string[];
  connected: boolean;
  status: 'lobby' | 'playing';
}
