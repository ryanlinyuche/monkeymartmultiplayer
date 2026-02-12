export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: 1 | 2;
  pos: Position;
  carrying: FruitType | null;
  money: number;
  speed: number;
  size: number;
  color: string;
  name: string;
}

export type FruitType = 'banana' | 'apple' | 'orange';

export interface FruitSource {
  pos: Position;
  type: FruitType;
  growTimer: number;
  maxGrow: number;
  ready: boolean;
  size: number;
}

export interface Shelf {
  pos: Position;
  type: FruitType | null;
  stock: number;
  maxStock: number;
  size: number;
}

export interface Customer {
  pos: Position;
  targetShelf: number;
  wants: FruitType;
  served: boolean;
  leaving: boolean;
  patience: number;
  maxPatience: number;
  speed: number;
  size: number;
}

export interface GameState {
  players: [Player, Player];
  fruitSources: FruitSource[];
  shelves: Shelf[];
  customers: Customer[];
  customerTimer: number;
  customerInterval: number;
  gameTime: number;
  paused: boolean;
}

export interface Keys {
  [key: string]: boolean;
}
