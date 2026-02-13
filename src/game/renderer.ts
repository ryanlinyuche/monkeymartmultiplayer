import { GameState, Position } from './types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, FRUIT_EMOJI,
  PLAYER_BODY_COLORS,
} from './constants';

const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 320;
const SCALE = 2;

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState, localPlayerId: number) {
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

  // Market area
  ctx.fillStyle = '#d4b88c';
  ctx.fillRect(CANVAS_WIDTH / 2 - 220, 80, 440, 340);
  ctx.strokeStyle = '#b08a5a';
  ctx.lineWidth = 3;
  ctx.strokeRect(CANVAS_WIDTH / 2 - 220, 80, 440, 340);

  // Sign
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(CANVAS_WIDTH / 2 - 110, 10, 220, 40);
  ctx.fillStyle = '#f0d040';
  ctx.font = 'bold 20px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐒 MONKEY MART 🐒', CANVAS_WIDTH / 2, 38);

  // Draw plots
  for (const plot of state.plots) {
    if (!plot.purchased) {
      ctx.fillStyle = '#a0d4a0';
      ctx.strokeStyle = '#6a9a6a';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.fillRect(plot.pos.x - plot.size / 2, plot.pos.y - plot.size / 2, plot.size, plot.size);
      ctx.strokeRect(plot.pos.x - plot.size / 2, plot.pos.y - plot.size / 2, plot.size, plot.size);
      ctx.setLineDash([]);

      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`$${plot.cost}`, plot.pos.x, plot.pos.y - 5);
      ctx.font = '16px serif';
      ctx.fillText(plot.type ? FRUIT_EMOJI[plot.type] : '🌱', plot.pos.x, plot.pos.y + 14);
      ctx.fillStyle = '#555';
      ctx.font = '9px Nunito, sans-serif';
      ctx.fillText('PRESS E/SPACE', plot.pos.x, plot.pos.y + 28);
    } else {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(plot.pos.x - 6, plot.pos.y - 5, 12, 20);
      ctx.fillStyle = plot.ready ? '#2d8a2d' : '#5a7a5a';
      ctx.beginPath();
      ctx.arc(plot.pos.x, plot.pos.y - 15, plot.size / 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (plot.ready && plot.type) {
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText(FRUIT_EMOJI[plot.type], plot.pos.x, plot.pos.y - 8);
      } else {
        const progress = plot.growTimer / plot.maxGrow;
        ctx.fillStyle = '#333';
        ctx.fillRect(plot.pos.x - 15, plot.pos.y + 18, 30, 5);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(plot.pos.x - 15, plot.pos.y + 18, 30 * progress, 5);
      }

      if (plot.type) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(plot.type.toUpperCase(), plot.pos.x, plot.pos.y + 35);
      }
    }
  }

  // Draw shelves
  for (const shelf of state.shelves) {
    ctx.fillStyle = '#a0744a';
    const sw = shelf.size;
    const sh = shelf.size * 0.7;
    ctx.fillRect(shelf.pos.x - sw / 2, shelf.pos.y - sh / 2, sw, sh);
    ctx.fillStyle = '#c09060';
    ctx.fillRect(shelf.pos.x - sw / 2 - 3, shelf.pos.y - sh / 2 - 4, sw + 6, 8);

    if (shelf.type) {
      const emoji = FRUIT_EMOJI[shelf.type];
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < shelf.stock; i++) {
        const ox = (i - (shelf.stock - 1) / 2) * 10;
        ctx.fillText(emoji, shelf.pos.x + ox, shelf.pos.y + 4);
      }
    } else {
      ctx.fillStyle = '#888';
      ctx.font = '10px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EMPTY', shelf.pos.x, shelf.pos.y + 4);
    }
  }

  // Draw cashier
  const cash = state.cashier;
  ctx.fillStyle = '#6a5a4a';
  ctx.fillRect(cash.pos.x - cash.size / 2, cash.pos.y - cash.size / 2.5, cash.size, cash.size * 0.5);
  ctx.fillStyle = '#8a7a6a';
  ctx.fillRect(cash.pos.x - cash.size / 2 - 3, cash.pos.y - cash.size / 2.5 - 4, cash.size + 6, 8);
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('💵', cash.pos.x, cash.pos.y + 2);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px Fredoka, sans-serif';
  ctx.fillText('CASHIER', cash.pos.x, cash.pos.y + cash.size / 2.5 + 14);

  // Draw customers
  for (const customer of state.customers) {
    const alpha = customer.leaving && !customer.served ? 0.5 : 1;
    ctx.globalAlpha = alpha;

    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.arc(customer.pos.x, customer.pos.y, customer.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(customer.pos.x - 4, customer.pos.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(customer.pos.x + 4, customer.pos.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    if (!customer.served && !customer.leaving) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(customer.pos.x + 16, customer.pos.y - 20, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(FRUIT_EMOJI[customer.wants], customer.pos.x + 16, customer.pos.y - 16);
    }

    if (customer.atCashier && !customer.served) {
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏳', customer.pos.x, customer.pos.y - 18);
    }

    if (customer.served) {
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillText('💰', customer.pos.x, customer.pos.y - 18);
    }

    ctx.globalAlpha = 1;
  }

  // Draw players
  for (const player of state.players) {
    const bodyColor = PLAYER_BODY_COLORS[player.id - 1] || PLAYER_BODY_COLORS[0];

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(player.pos.x, player.pos.y + player.size / 2 + 2, player.size / 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player.pos.x - player.size / 2 + 2, player.pos.y - player.size / 3, 6, 0, Math.PI * 2);
    ctx.arc(player.pos.x + player.size / 2 - 2, player.pos.y - player.size / 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dba87a';
    ctx.beginPath();
    ctx.arc(player.pos.x - player.size / 2 + 2, player.pos.y - player.size / 3, 3, 0, Math.PI * 2);
    ctx.arc(player.pos.x + player.size / 2 - 2, player.pos.y - player.size / 3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dba87a';
    ctx.beginPath();
    ctx.ellipse(player.pos.x, player.pos.y + 2, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(player.pos.x - 5, player.pos.y - 3, 2.5, 0, Math.PI * 2);
    ctx.arc(player.pos.x + 5, player.pos.y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.pos.x - 4, player.pos.y - 4, 1, 0, Math.PI * 2);
    ctx.arc(player.pos.x + 6, player.pos.y - 4, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y + 3, 4, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = player.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size / 2 + 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = player.color;
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, player.pos.x, player.pos.y - player.size / 2 - 10);

    if (player.carrying) {
      ctx.font = '16px serif';
      ctx.fillText(FRUIT_EMOJI[player.carrying], player.pos.x, player.pos.y - player.size / 2 - 22);
    }
  }

  ctx.restore();

  // HUD (drawn in screen space, not world space)
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(canvasW - 160, 10, 150, 40);
  ctx.fillStyle = '#f0d040';
  ctx.font = 'bold 22px Fredoka, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`💰 $${state.money}`, canvasW - 20, 38);
}
