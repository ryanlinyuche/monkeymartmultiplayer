import { GameState } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, FRUIT_COLORS, FRUIT_EMOJI, FRUIT_PRICES } from './constants';

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState) {
  // Clear
  ctx.fillStyle = '#7ab87a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw floor pattern
  ctx.fillStyle = '#6aaa6a';
  for (let x = 0; x < CANVAS_WIDTH; x += 64) {
    for (let y = 0; y < CANVAS_HEIGHT; y += 64) {
      if ((x / 64 + y / 64) % 2 === 0) {
        ctx.fillRect(x, y, 64, 64);
      }
    }
  }

  // Draw market area (center lighter area)
  ctx.fillStyle = '#d4b88c';
  ctx.fillRect(CANVAS_WIDTH / 2 - 200, 60, 400, 520);
  ctx.strokeStyle = '#b08a5a';
  ctx.lineWidth = 3;
  ctx.strokeRect(CANVAS_WIDTH / 2 - 200, 60, 400, 520);

  // Sign
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(CANVAS_WIDTH / 2 - 100, 10, 200, 40);
  ctx.fillStyle = '#f0d040';
  ctx.font = 'bold 22px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐒 MONKEY MART 🐒', CANVAS_WIDTH / 2, 38);

  // Draw fruit sources (trees)
  for (const source of state.fruitSources) {
    // Tree trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(source.pos.x - 6, source.pos.y - 5, 12, 20);
    
    // Tree top
    ctx.fillStyle = source.ready ? '#2d8a2d' : '#5a7a5a';
    ctx.beginPath();
    ctx.arc(source.pos.x, source.pos.y - 15, source.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Fruit indicator
    if (source.ready) {
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.fillText(FRUIT_EMOJI[source.type], source.pos.x, source.pos.y - 8);
    } else {
      // Growth bar
      const progress = source.growTimer / source.maxGrow;
      ctx.fillStyle = '#333';
      ctx.fillRect(source.pos.x - 15, source.pos.y + 18, 30, 5);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(source.pos.x - 15, source.pos.y + 18, 30 * progress, 5);
    }

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(source.type.toUpperCase(), source.pos.x, source.pos.y + 35);
  }

  // Draw shelves
  for (const shelf of state.shelves) {
    // Shelf body
    ctx.fillStyle = '#a0744a';
    const sw = shelf.size;
    const sh = shelf.size * 0.7;
    ctx.fillRect(shelf.pos.x - sw / 2, shelf.pos.y - sh / 2, sw, sh);
    
    // Shelf top
    ctx.fillStyle = '#c09060';
    ctx.fillRect(shelf.pos.x - sw / 2 - 3, shelf.pos.y - sh / 2 - 4, sw + 6, 8);

    // Stock display
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

  // Draw customers
  for (const customer of state.customers) {
    const alpha = customer.leaving && !customer.served ? 0.5 : 1;
    ctx.globalAlpha = alpha;

    // Body
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.arc(customer.pos.x, customer.pos.y, customer.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(customer.pos.x - 4, customer.pos.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(customer.pos.x + 4, customer.pos.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Want bubble
    if (!customer.served && !customer.leaving) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(customer.pos.x + 16, customer.pos.y - 20, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(FRUIT_EMOJI[customer.wants], customer.pos.x + 16, customer.pos.y - 16);

      // Patience bar
      const ratio = customer.patience / customer.maxPatience;
      ctx.fillStyle = '#333';
      ctx.fillRect(customer.pos.x - 12, customer.pos.y + 16, 24, 3);
      ctx.fillStyle = ratio > 0.5 ? '#4CAF50' : ratio > 0.2 ? '#ff9800' : '#f44336';
      ctx.fillRect(customer.pos.x - 12, customer.pos.y + 16, 24 * ratio, 3);
    }

    if (customer.served) {
      ctx.font = '14px serif';
      ctx.fillText('💰', customer.pos.x, customer.pos.y - 18);
    }

    ctx.globalAlpha = 1;
  }

  // Draw players (monkeys!)
  for (const player of state.players) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(player.pos.x, player.pos.y + player.size / 2 + 2, player.size / 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = player.id === 1 ? '#8B5E3C' : '#6B4226';
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.arc(player.pos.x - player.size / 2 + 2, player.pos.y - player.size / 3, 6, 0, Math.PI * 2);
    ctx.arc(player.pos.x + player.size / 2 - 2, player.pos.y - player.size / 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dba87a';
    ctx.beginPath();
    ctx.arc(player.pos.x - player.size / 2 + 2, player.pos.y - player.size / 3, 3, 0, Math.PI * 2);
    ctx.arc(player.pos.x + player.size / 2 - 2, player.pos.y - player.size / 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = '#dba87a';
    ctx.beginPath();
    ctx.ellipse(player.pos.x, player.pos.y + 2, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(player.pos.x - 5, player.pos.y - 3, 2.5, 0, Math.PI * 2);
    ctx.arc(player.pos.x + 5, player.pos.y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.pos.x - 4, player.pos.y - 4, 1, 0, Math.PI * 2);
    ctx.arc(player.pos.x + 6, player.pos.y - 4, 1, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y + 3, 4, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Player indicator ring
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size / 2 + 4, 0, Math.PI * 2);
    ctx.stroke();

    // Player label
    ctx.fillStyle = player.color;
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`P${player.id}`, player.pos.x, player.pos.y - player.size / 2 - 10);

    // Carrying indicator
    if (player.carrying) {
      ctx.font = '16px serif';
      ctx.fillText(FRUIT_EMOJI[player.carrying], player.pos.x, player.pos.y - player.size / 2 - 20);
    }
  }
}
