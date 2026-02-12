import { GameState, Keys, Customer, FruitType, Position } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, INTERACTION_DISTANCE, CUSTOMER_SIZE,
  CUSTOMER_SPEED, CUSTOMER_PATIENCE, FRUIT_PRICES, P1_KEYS, P2_KEYS,
} from './constants';

function dist(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

const fruitTypes: FruitType[] = ['banana', 'apple', 'orange'];

function spawnCustomer(state: GameState) {
  const wants = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
  // find a shelf that has this fruit
  const shelfIdx = state.shelves.findIndex(s => s.type === wants && s.stock > 0);
  const targetShelf = shelfIdx >= 0 ? shelfIdx : Math.floor(Math.random() * state.shelves.length);

  const customer: Customer = {
    pos: { x: CANVAS_WIDTH - 40, y: 280 + Math.random() * 80 },
    targetShelf,
    wants,
    served: false,
    leaving: false,
    patience: CUSTOMER_PATIENCE,
    maxPatience: CUSTOMER_PATIENCE,
    speed: CUSTOMER_SPEED,
    size: CUSTOMER_SIZE,
  };
  state.customers.push(customer);
}

export function updateGame(state: GameState, keys: Keys): GameState {
  if (state.paused) return state;

  state.gameTime++;

  // Move players
  const keyMaps = [P1_KEYS, P2_KEYS];
  state.players.forEach((player, i) => {
    const km = keyMaps[i];
    let dx = 0, dy = 0;
    if (keys[km.up]) dy -= player.speed;
    if (keys[km.down]) dy += player.speed;
    if (keys[km.left]) dx -= player.speed;
    if (keys[km.right]) dx += player.speed;
    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    player.pos.x = clamp(player.pos.x + dx, player.size, CANVAS_WIDTH - player.size);
    player.pos.y = clamp(player.pos.y + dy, player.size, CANVAS_HEIGHT - player.size);

    // Auto-interact with fruit sources
    if (player.carrying === null) {
      for (const source of state.fruitSources) {
        if (source.ready && dist(player.pos, source.pos) < INTERACTION_DISTANCE) {
          player.carrying = source.type;
          source.ready = false;
          source.growTimer = 0;
          break;
        }
      }
    }

    // Auto-interact with shelves (stock fruit)
    if (player.carrying !== null) {
      for (const shelf of state.shelves) {
        if (dist(player.pos, shelf.pos) < INTERACTION_DISTANCE) {
          if ((shelf.type === null || shelf.type === player.carrying) && shelf.stock < shelf.maxStock) {
            shelf.type = player.carrying;
            shelf.stock++;
            player.carrying = null;
            break;
          }
        }
      }
    }
  });

  // Grow fruit sources
  for (const source of state.fruitSources) {
    if (!source.ready) {
      source.growTimer++;
      if (source.growTimer >= source.maxGrow) {
        source.ready = true;
      }
    }
  }

  // Spawn customers
  state.customerTimer++;
  if (state.customerTimer >= state.customerInterval && state.customers.length < 8) {
    spawnCustomer(state);
    state.customerTimer = 0;
  }

  // Update customers
  for (let i = state.customers.length - 1; i >= 0; i--) {
    const c = state.customers[i];

    if (c.leaving) {
      c.pos.x += c.speed * 2;
      if (c.pos.x > CANVAS_WIDTH + 50) {
        state.customers.splice(i, 1);
      }
      continue;
    }

    c.patience--;
    if (c.patience <= 0) {
      c.leaving = true;
      continue;
    }

    // Move toward target shelf
    const shelf = state.shelves[c.targetShelf];
    if (shelf) {
      const d = dist(c.pos, shelf.pos);
      if (d > INTERACTION_DISTANCE) {
        const dx = (shelf.pos.x - c.pos.x) / d;
        const dy = (shelf.pos.y - c.pos.y) / d;
        c.pos.x += dx * c.speed;
        c.pos.y += dy * c.speed;
      } else {
        // Try to buy
        if (shelf.type === c.wants && shelf.stock > 0) {
          shelf.stock--;
          if (shelf.stock === 0) shelf.type = null;
          c.served = true;
          c.leaving = true;
          // Give money to closest player
          const closestPlayer = state.players.reduce((a, b) =>
            dist(a.pos, c.pos) < dist(b.pos, c.pos) ? a : b
          );
          closestPlayer.money += FRUIT_PRICES[c.wants];
        } else {
          // Look for another shelf with the wanted fruit
          const altIdx = state.shelves.findIndex((s, idx) => idx !== c.targetShelf && s.type === c.wants && s.stock > 0);
          if (altIdx >= 0) {
            c.targetShelf = altIdx;
          }
        }
      }
    }
  }

  return state;
}
