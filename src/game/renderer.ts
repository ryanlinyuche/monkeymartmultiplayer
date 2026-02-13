import { GameState, Position } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, FRUIT_EMOJI,
  PLAYER_BODY_COLORS,
} from './constants';
import {
  preloadSprites, getPlayerSprite, getCustomerSprite,
  getFruitSprite, getTreeSprite, getShelfSprite, getCashierSprite,
} from './sprites';

const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 320;
const SCALE = 2;

let spritesPreloaded = false;

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState, localPlayerId: number) {
  if (!spritesPreloaded) {
    preloadSprites();
    spritesPreloaded = true;
  }

  const canvasW = ctx.canvas.width;
  const canvasH = ctx.canvas.height;

  // Find local player for camera
  const localPlayer = state.players.find(p => p.id === localPlayerId) || state.players[0];
  const camX = localPlayer ? localPlayer.pos.x - VIEW_WIDTH / 2 : 0;
  const camY = localPlayer ? localPlayer.pos.y - VIEW_HEIGHT / 2 : 0;

  ctx.save();
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.scale(SCALE, SCALE);
  ctx.translate(-camX, -camY);

  // Background grass
  ctx.fillStyle = '#7ab87a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Floor pattern
  ctx.fillStyle = '#6aaa6a';
  for (let x = 0; x < CANVAS_WIDTH; x += 64) {
    for (let y = 0; y < CANVAS_HEIGHT; y += 64) {
      if ((x / 64 + y / 64) % 2 === 0) {
        ctx.fillRect(x, y, 64, 64);
      }
    }
  }

  // Grass tufts
  ctx.fillStyle = '#5d9d5d';
  for (let i = 0; i < 30; i++) {
    const gx = (i * 137 + 50) % CANVAS_WIDTH;
    const gy = (i * 97 + 30) % CANVAS_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 3, gy - 6);
    ctx.lineTo(gx + 1, gy - 4);
    ctx.lineTo(gx + 3, gy - 7);
    ctx.lineTo(gx + 5, gy);
    ctx.fill();
  }

  // Market area
  ctx.fillStyle = '#d4b88c';
  ctx.fillRect(CANVAS_WIDTH / 2 - 220, 80, 440, 340);
  ctx.strokeStyle = '#b08a5a';
  ctx.lineWidth = 3;
  ctx.strokeRect(CANVAS_WIDTH / 2 - 220, 80, 440, 340);

  // Market floor tiles
  ctx.fillStyle = '#c9a878';
  for (let x = CANVAS_WIDTH / 2 - 220; x < CANVAS_WIDTH / 2 + 220; x += 40) {
    for (let y = 80; y < 420; y += 40) {
      if (((x - (CANVAS_WIDTH / 2 - 220)) / 40 + (y - 80) / 40) % 2 === 0) {
        ctx.fillRect(x, y, 40, 40);
      }
    }
  }

  // Sign
  ctx.fillStyle = '#8B4513';
  roundRect(ctx, CANVAS_WIDTH / 2 - 115, 8, 230, 44, 8);
  ctx.fill();
  ctx.strokeStyle = '#6B3310';
  ctx.lineWidth = 2;
  roundRect(ctx, CANVAS_WIDTH / 2 - 115, 8, 230, 44, 8);
  ctx.stroke();
  ctx.fillStyle = '#f0d040';
  ctx.font = 'bold 20px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐒 MONKEY MART 🐒', CANVAS_WIDTH / 2, 38);

  // Draw plots (trees)
  for (const plot of state.plots) {
    if (!plot.purchased) {
      // Unpurchased plot - dashed outline with price
      ctx.fillStyle = '#a0d4a0';
      ctx.strokeStyle = '#6a9a6a';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      roundRect(ctx, plot.pos.x - plot.size / 2, plot.pos.y - plot.size / 2, plot.size, plot.size, 6);
      ctx.fill();
      roundRect(ctx, plot.pos.x - plot.size / 2, plot.pos.y - plot.size / 2, plot.size, plot.size, 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price tag
      ctx.fillStyle = '#fff';
      roundRect(ctx, plot.pos.x - 18, plot.pos.y - 16, 36, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#2d7a2d';
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`$${plot.cost}`, plot.pos.x, plot.pos.y - 4);

      ctx.font = '18px serif';
      ctx.fillText(plot.type ? FRUIT_EMOJI[plot.type] : '🌱', plot.pos.x, plot.pos.y + 16);
      ctx.fillStyle = '#555';
      ctx.font = '8px Nunito, sans-serif';
      ctx.fillText('PRESS E', plot.pos.x, plot.pos.y + 28);
    } else {
      // Purchased plot - draw tree sprite
      const progress = plot.growTimer / plot.maxGrow;
      const treeImg = getTreeSprite(plot.type, plot.ready, progress);
      if (treeImg) {
        ctx.drawImage(treeImg, plot.pos.x - 24, plot.pos.y - 28, 48, 56);
      } else {
        // Fallback
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(plot.pos.x - 4, plot.pos.y, 8, 16);
        ctx.fillStyle = plot.ready ? '#2d8a2d' : '#5a7a5a';
        ctx.beginPath();
        ctx.arc(plot.pos.x, plot.pos.y - 8, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      if (plot.ready && plot.type) {
        ctx.font = '18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(FRUIT_EMOJI[plot.type], plot.pos.x, plot.pos.y - 6);
      }

      if (plot.type) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(plot.type.toUpperCase(), plot.pos.x, plot.pos.y + 32);
      }
    }
  }

  // Draw shelves
  for (const shelf of state.shelves) {
    const shelfImg = getShelfSprite(shelf.stock, shelf.maxStock, shelf.type);
    if (shelfImg) {
      ctx.drawImage(shelfImg, shelf.pos.x - 24, shelf.pos.y - 18, 48, 36);
    } else {
      // Fallback
      ctx.fillStyle = '#a0744a';
      const sw = shelf.size;
      const sh = shelf.size * 0.7;
      ctx.fillRect(shelf.pos.x - sw / 2, shelf.pos.y - sh / 2, sw, sh);
    }

    // Draw fruit items on shelf
    if (shelf.type) {
      const fruitImg = getFruitSprite(shelf.type);
      if (fruitImg) {
        for (let i = 0; i < shelf.stock; i++) {
          const ox = (i - (shelf.stock - 1) / 2) * 9;
          ctx.drawImage(fruitImg, shelf.pos.x + ox - 5, shelf.pos.y - 8, 10, 10);
        }
      }
    }
  }

  // Draw cashier
  const cash = state.cashier;
  const cashImg = getCashierSprite(state.gameTime);
  if (cashImg) {
    ctx.drawImage(cashImg, cash.pos.x - 24, cash.pos.y - 20, 48, 40);
  } else {
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(cash.pos.x - cash.size / 2, cash.pos.y - cash.size / 2.5, cash.size, cash.size * 0.5);
  }
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CASHIER', cash.pos.x, cash.pos.y + cash.size / 2.5 + 14);

  // Draw customers with SVG sprites
  for (const customer of state.customers) {
    const alpha = customer.leaving && !customer.served ? 0.5 : 1;
    ctx.globalAlpha = alpha;

    const custImg = getCustomerSprite(state.gameTime);
    if (custImg) {
      ctx.drawImage(custImg, customer.pos.x - 16, customer.pos.y - 20, 32, 40);
    } else {
      // Fallback circle
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.arc(customer.pos.x, customer.pos.y, customer.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyes on fallback already in sprite, but keep thought bubble
    if (!customer.served && !customer.leaving) {
      // Thought bubble
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.arc(customer.pos.x + 16, customer.pos.y - 24, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Small bubbles
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(customer.pos.x + 8, customer.pos.y - 14, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(customer.pos.x + 5, customer.pos.y - 10, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(FRUIT_EMOJI[customer.wants], customer.pos.x + 16, customer.pos.y - 20);
    }

    if (customer.atCashier && !customer.served) {
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏳', customer.pos.x, customer.pos.y - 26);
    }

    if (customer.served) {
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillText('💰', customer.pos.x, customer.pos.y - 26);
    }

    ctx.globalAlpha = 1;
  }

  // Draw players with SVG monkey sprites
  for (const player of state.players) {
    const facing = player.pos.x > (localPlayer?.pos.x ?? 0) ? 'right' : 'left';
    // Use gameTime as animation frame driver
    const animFrame = state.gameTime;
    const sprite = getPlayerSprite(facing === 'left' ? 'left' : 'right', animFrame);

    if (sprite) {
      ctx.drawImage(sprite, player.pos.x - 24, player.pos.y - 28, 48, 56);
    } else {
      // Fallback - draw basic monkey
      const bodyColor = PLAYER_BODY_COLORS[player.id - 1] || PLAYER_BODY_COLORS[0];
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(player.pos.x, player.pos.y, player.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player ring color
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size / 2 + 6, 0, Math.PI * 2);
    ctx.stroke();

    // Name tag
    const nameWidth = ctx.measureText(player.name).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    roundRect(ctx, player.pos.x - nameWidth / 2 - 4, player.pos.y - player.size / 2 - 22, nameWidth + 8, 14, 4);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, player.pos.x, player.pos.y - player.size / 2 - 12);

    // Carrying indicator
    if (player.carrying) {
      ctx.font = '18px serif';
      ctx.fillText(FRUIT_EMOJI[player.carrying], player.pos.x, player.pos.y - player.size / 2 - 28);
    }
  }

  ctx.restore();

  // HUD (drawn in screen space)
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  roundRect(ctx, canvasW - 170, 8, 160, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#f0d040';
  ctx.font = 'bold 24px Fredoka, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`💰 $${state.money}`, canvasW - 20, 40);
}

// Helper for rounded rectangles
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
