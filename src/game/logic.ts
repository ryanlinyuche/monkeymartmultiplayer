import { GameState, PlayerInput, Customer, FruitType, Position } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, INTERACTION_DISTANCE, CUSTOMER_SIZE,
  CUSTOMER_SPEED, CUSTOMER_PATIENCE, FRUIT_PRICES, PLOT_COSTS,
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
  const shelfIdx = state.shelves.findIndex(s => s.type === wants && s.stock > 0);
  const targetShelf = shelfIdx >= 0 ? shelfIdx : Math.floor(Math.random() * state.shelves.length);

  const customer: Customer = {
    pos: { x: CANVAS_WIDTH / 2, y: -20 },
    targetShelf,
    wants,
    served: false,
    leaving: false,
    atCashier: false,
    patience: CUSTOMER_PATIENCE,
    maxPatience: CUSTOMER_PATIENCE,
    speed: CUSTOMER_SPEED,
    size: CUSTOMER_SIZE,
  };
  state.customers.push(customer);
}

export function updateGame(state: GameState, inputs: PlayerInput[]): GameState {
  if (state.paused) return state;

  state.gameTime++;

  // Move players based on inputs
  for (const input of inputs) {
    const player = state.players.find(p => p.id === input.playerId);
    if (!player) continue;

    let dx = 0, dy = 0;
    if (input.keys.up) dy -= player.speed;
    if (input.keys.down) dy += player.speed;
    if (input.keys.left) dx -= player.speed;
    if (input.keys.right) dx += player.speed;
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    player.pos.x = clamp(player.pos.x + dx, player.size, CANVAS_WIDTH - player.size);
    player.pos.y = clamp(player.pos.y + dy, player.size, CANVAS_HEIGHT - player.size);

    // Interact button pressed
    if (input.keys.interact) {
      // Buy unpurchased plots
      for (const plot of state.plots) {
        if (!plot.purchased && dist(player.pos, plot.pos) < INTERACTION_DISTANCE) {
          if (state.money >= plot.cost) {
            state.money -= plot.cost;
            plot.purchased = true;
            plot.ready = true;
            plot.growTimer = 0;
          }
        }
      }
    }

    // Auto-interact: pick fruit from purchased plots
    if (player.carrying === null) {
      for (const plot of state.plots) {
        if (plot.purchased && plot.ready && dist(player.pos, plot.pos) < INTERACTION_DISTANCE) {
          player.carrying = plot.type;
          plot.ready = false;
          plot.growTimer = 0;
          break;
        }
      }
    }

    // Auto-interact: stock shelves
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
  }

  // Grow purchased plots
  for (const plot of state.plots) {
    if (plot.purchased && !plot.ready) {
      plot.growTimer++;
      if (plot.growTimer >= plot.maxGrow) {
        plot.ready = true;
      }
    }
  }

  // Spawn customers
  state.customerTimer++;
  if (state.customerTimer >= state.customerInterval && state.customers.length < 6) {
    spawnCustomer(state);
    state.customerTimer = 0;
  }

  // Check if any player is at the cashier
  const playerAtCashier = state.players.some(
    p => dist(p.pos, state.cashier.pos) < INTERACTION_DISTANCE
  );

  // Update customers
  for (let i = state.customers.length - 1; i >= 0; i--) {
    const c = state.customers[i];

    if (c.leaving) {
      c.pos.y -= c.speed * 2;
      if (c.pos.y < -50) {
        state.customers.splice(i, 1);
      }
      continue;
    }

    c.patience--;
    if (c.patience <= 0) {
      c.leaving = true;
      continue;
    }

    if (c.atCashier) {
      // Waiting at cashier for a player
      if (playerAtCashier) {
        state.money += FRUIT_PRICES[c.wants];
        c.served = true;
        c.leaving = true;
      }
      continue;
    }

    // Move toward target shelf
    const shelf = state.shelves[c.targetShelf];
    if (shelf) {
      const d = dist(c.pos, shelf.pos);
      if (d > INTERACTION_DISTANCE) {
        const ddx = (shelf.pos.x - c.pos.x) / d;
        const ddy = (shelf.pos.y - c.pos.y) / d;
        c.pos.x += ddx * c.speed;
        c.pos.y += ddy * c.speed;
      } else {
        // Try to buy from shelf
        if (shelf.type === c.wants && shelf.stock > 0) {
          shelf.stock--;
          if (shelf.stock === 0) shelf.type = null;
          // Now go to cashier
          c.atCashier = false; // will move to cashier
          c.targetShelf = -1; // signal: heading to cashier
        } else {
          const altIdx = state.shelves.findIndex((s, idx) => idx !== c.targetShelf && s.type === c.wants && s.stock > 0);
          if (altIdx >= 0) {
            c.targetShelf = altIdx;
          }
        }
      }
    }

    // If targetShelf is -1, move to cashier
    if (c.targetShelf === -1 && !c.atCashier) {
      const d = dist(c.pos, state.cashier.pos);
      if (d > INTERACTION_DISTANCE) {
        const ddx = (state.cashier.pos.x - c.pos.x) / d;
        const ddy = (state.cashier.pos.y - c.pos.y) / d;
        c.pos.x += ddx * c.speed;
        c.pos.y += ddy * c.speed;
      } else {
        c.atCashier = true;
      }
    }
  }

  return state;
}
