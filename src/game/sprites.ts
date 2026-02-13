// SVG Sprite system - converts SVG strings to canvas-drawable images

const spriteCache = new Map<string, HTMLImageElement>();
const loadingSprites = new Map<string, Promise<HTMLImageElement>>();

function svgToImage(svgString: string, width: number, height: number): Promise<HTMLImageElement> {
  const key = svgString;
  if (spriteCache.has(key)) return Promise.resolve(spriteCache.get(key)!);
  if (loadingSprites.has(key)) return loadingSprites.get(key)!;

  const promise = new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      spriteCache.set(key, img);
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(img); // resolve anyway, we'll skip drawing
    };
    img.src = url;
  });
  loadingSprites.set(key, promise);
  return promise;
}

// ===== PLAYER SPRITES =====

function monkeySVG(facing: 'left' | 'right', frame: number): string {
  const bobY = Math.sin(frame * 0.3) * 2;
  const armSwing = Math.sin(frame * 0.3) * 8;
  const flip = facing === 'left' ? 'transform="scale(-1,1) translate(-48,0)"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
    <g ${flip}>
      <!-- Shadow -->
      <ellipse cx="24" cy="52" rx="14" ry="4" fill="rgba(0,0,0,0.15)"/>
      <!-- Tail -->
      <path d="M 10 ${32 + bobY} Q ${6 + armSwing * 0.3} ${28 + bobY} ${8 + armSwing * 0.2} ${22 + bobY} Q 10 ${18 + bobY} 14 ${20 + bobY}" stroke="#6B3A1F" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Body -->
      <ellipse cx="24" cy="${34 + bobY}" rx="11" ry="10" fill="#8B5E3C"/>
      <!-- Belly -->
      <ellipse cx="24" cy="${35 + bobY}" rx="7" ry="6" fill="#D2A87A"/>
      <!-- Left arm -->
      <ellipse cx="${16 + armSwing * 0.4}" cy="${30 + bobY}" rx="4" ry="7" fill="#8B5E3C" transform="rotate(${-15 + armSwing} 16 ${30 + bobY})"/>
      <!-- Right arm -->
      <ellipse cx="${32 - armSwing * 0.4}" cy="${30 + bobY}" rx="4" ry="7" fill="#8B5E3C" transform="rotate(${15 - armSwing} 32 ${30 + bobY})"/>
      <!-- Left leg -->
      <ellipse cx="19" cy="${44 + bobY}" rx="4" ry="6" fill="#8B5E3C"/>
      <ellipse cx="19" cy="${48 + bobY}" rx="5" ry="3" fill="#6B3A1F"/>
      <!-- Right leg -->
      <ellipse cx="29" cy="${44 + bobY}" rx="4" ry="6" fill="#8B5E3C"/>
      <ellipse cx="29" cy="${48 + bobY}" rx="5" ry="3" fill="#6B3A1F"/>
      <!-- Head -->
      <circle cx="24" cy="${16 + bobY}" r="12" fill="#A0724A"/>
      <!-- Ears -->
      <circle cx="13" cy="${12 + bobY}" r="5" fill="#8B5E3C"/>
      <circle cx="13" cy="${12 + bobY}" r="3" fill="#D2A87A"/>
      <circle cx="35" cy="${12 + bobY}" r="5" fill="#8B5E3C"/>
      <circle cx="35" cy="${12 + bobY}" r="3" fill="#D2A87A"/>
      <!-- Face -->
      <ellipse cx="24" cy="${18 + bobY}" rx="8" ry="6" fill="#D2A87A"/>
      <!-- Eyes -->
      <ellipse cx="20" cy="${15 + bobY}" rx="3" ry="3.5" fill="white"/>
      <circle cx="21" cy="${15.5 + bobY}" r="2" fill="#1a1a2e"/>
      <circle cx="21.5" cy="${14.5 + bobY}" r="0.7" fill="white"/>
      <ellipse cx="28" cy="${15 + bobY}" rx="3" ry="3.5" fill="white"/>
      <circle cx="27" cy="${15.5 + bobY}" r="2" fill="#1a1a2e"/>
      <circle cx="27.5" cy="${14.5 + bobY}" r="0.7" fill="white"/>
      <!-- Nose -->
      <ellipse cx="24" cy="${19 + bobY}" rx="2.5" ry="2" fill="#5C3318"/>
      <!-- Mouth -->
      <path d="M 21 ${21 + bobY} Q 24 ${23.5 + bobY} 27 ${21 + bobY}" stroke="#5C3318" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

function customerSVG(wantEmoji: string, frame: number): string {
  const bobY = Math.sin(frame * 0.15) * 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <!-- Shadow -->
    <ellipse cx="16" cy="37" rx="10" ry="3" fill="rgba(0,0,0,0.12)"/>
    <!-- Body -->
    <ellipse cx="16" cy="${26 + bobY}" rx="8" ry="9" fill="#E8C9A0"/>
    <!-- Shirt -->
    <ellipse cx="16" cy="${28 + bobY}" rx="7" ry="7" fill="#5B9BD5"/>
    <!-- Head -->
    <circle cx="16" cy="${12 + bobY}" r="8" fill="#F0D5B0"/>
    <!-- Hair -->
    <path d="M 8 ${10 + bobY} Q 10 ${4 + bobY} 16 ${4 + bobY} Q 22 ${4 + bobY} 24 ${10 + bobY}" fill="#4A3728" stroke="none"/>
    <!-- Eyes -->
    <circle cx="13" cy="${11 + bobY}" r="1.5" fill="#1a1a2e"/>
    <circle cx="19" cy="${11 + bobY}" r="1.5" fill="#1a1a2e"/>
    <!-- Smile -->
    <path d="M 13 ${14 + bobY} Q 16 ${16 + bobY} 19 ${14 + bobY}" stroke="#8B6B4A" stroke-width="1" fill="none"/>
    <!-- Legs -->
    <rect x="12" y="${33 + bobY}" width="3" height="5" rx="1.5" fill="#4A7ABF"/>
    <rect x="17" y="${33 + bobY}" width="3" height="5" rx="1.5" fill="#4A7ABF"/>
    <!-- Shoes -->
    <ellipse cx="13.5" cy="${38 + bobY}" rx="2.5" ry="1.5" fill="#3D2B1F"/>
    <ellipse cx="18.5" cy="${38 + bobY}" rx="2.5" ry="1.5" fill="#3D2B1F"/>
  </svg>`;
}

// Fruit SVGs
function bananaSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M 5 10 Q 8 4 10 4 Q 12 4 15 6 Q 16 8 16 10 Q 15 14 12 15" fill="#FFD700" stroke="#DAA520" stroke-width="0.8"/>
    <path d="M 6 9 Q 9 5 12 6" fill="none" stroke="#FFED4E" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="4" y="9" width="2" height="3" fill="#8B4513" rx="0.5"/>
  </svg>`;
}

function appleSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="11" r="7" fill="#DC143C"/>
    <circle cx="8" cy="9" r="2.5" fill="#FF6B6B" opacity="0.5"/>
    <rect x="9" y="3" width="1.5" height="4" fill="#8B4513" rx="0.5"/>
    <ellipse cx="12" cy="5" rx="2.5" ry="1.5" fill="#228B22" transform="rotate(-20 12 5)"/>
  </svg>`;
}

function orangeSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="7" fill="#FF8C00"/>
    <circle cx="10" cy="10" r="7" fill="none" stroke="#FFA500" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
    <circle cx="8" cy="8" r="2" fill="#FFB84D" opacity="0.5"/>
    <rect x="9" y="2" width="1.5" height="3" fill="#8B4513" rx="0.5"/>
    <circle cx="10" cy="2.5" r="1" fill="#228B22"/>
  </svg>`;
}

// ===== ENVIRONMENT SPRITES =====

function treeSVG(fruitType: string | null, ready: boolean, progress: number): string {
  const fruitColor = fruitType === 'banana' ? '#FFD700' : fruitType === 'apple' ? '#DC143C' : '#FF8C00';
  const leafColor = ready ? '#2d8a2d' : '#5a7a5a';
  const fruits = ready ? `
    <circle cx="18" cy="14" r="3" fill="${fruitColor}"/>
    <circle cx="30" cy="18" r="3" fill="${fruitColor}"/>
    <circle cx="24" cy="10" r="3" fill="${fruitColor}"/>
  ` : '';
  const progressBar = !ready ? `
    <rect x="12" y="48" width="24" height="4" rx="2" fill="#333"/>
    <rect x="12" y="48" width="${24 * progress}" height="4" rx="2" fill="#4CAF50"/>
  ` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
    <!-- Trunk -->
    <rect x="20" y="28" width="8" height="22" rx="2" fill="#8B6B3C"/>
    <rect x="22" y="30" width="3" height="18" rx="1" fill="#A0825A" opacity="0.5"/>
    <!-- Canopy -->
    <ellipse cx="24" cy="20" rx="18" ry="16" fill="${leafColor}"/>
    <ellipse cx="20" cy="16" rx="12" ry="10" fill="${leafColor}" opacity="0.8"/>
    <ellipse cx="28" cy="18" rx="10" ry="8" fill="${leafColor}" opacity="0.6"/>
    <!-- Leaf highlights -->
    <ellipse cx="18" cy="14" rx="6" ry="4" fill="#3da83d" opacity="0.4"/>
    ${fruits}
    ${progressBar}
  </svg>`;
}

function shelfSVG(stock: number, maxStock: number, fruitType: string | null): string {
  const fruitColor = fruitType === 'banana' ? '#FFD700' : fruitType === 'apple' ? '#DC143C' : fruitType === 'orange' ? '#FF8C00' : '#888';
  let fruitItems = '';
  for (let i = 0; i < stock; i++) {
    const ox = 10 + i * 8;
    fruitItems += `<circle cx="${ox}" cy="16" r="3.5" fill="${fruitColor}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="36" viewBox="0 0 48 36">
    <!-- Back panel -->
    <rect x="2" y="2" width="44" height="32" rx="3" fill="#C09060" stroke="#8B6B3C" stroke-width="1.5"/>
    <!-- Shelf board -->
    <rect x="0" y="20" width="48" height="4" rx="1" fill="#A0744A"/>
    <rect x="0" y="8" width="48" height="4" rx="1" fill="#A0744A"/>
    <!-- Items -->
    ${fruitItems}
    <!-- Label -->
    ${fruitType ? `<text x="24" y="32" font-size="7" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="bold">${fruitType.toUpperCase()}</text>` : '<text x="24" y="32" font-size="7" fill="#aaa" text-anchor="middle" font-family="sans-serif">EMPTY</text>'}
  </svg>`;
}

function cashierSVG(frame: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40">
    <!-- Counter -->
    <rect x="2" y="14" width="44" height="22" rx="3" fill="#6A5A4A" stroke="#5A4A3A" stroke-width="1.5"/>
    <rect x="4" y="16" width="40" height="8" rx="2" fill="#8A7A6A"/>
    <!-- Register screen -->
    <rect x="14" y="4" width="20" height="12" rx="2" fill="#2C3E50"/>
    <rect x="16" y="6" width="16" height="8" rx="1" fill="#3498DB"/>
    <text x="24" y="12" font-size="6" fill="white" text-anchor="middle" font-family="monospace">$$$</text>
    <!-- Buttons -->
    <rect x="10" y="26" width="4" height="3" rx="1" fill="#95A5A6"/>
    <rect x="16" y="26" width="4" height="3" rx="1" fill="#95A5A6"/>
    <rect x="22" y="26" width="4" height="3" rx="1" fill="#E74C3C"/>
    <rect x="28" y="26" width="4" height="3" rx="1" fill="#95A5A6"/>
    <rect x="34" y="26" width="4" height="3" rx="1" fill="#95A5A6"/>
  </svg>`;
}

// ===== SPRITE LOADING & CACHING =====

const imageCache = new Map<string, HTMLImageElement>();

function getOrCreateImage(key: string, svgFn: () => string): HTMLImageElement | null {
  if (imageCache.has(key)) return imageCache.get(key)!;

  const svgStr = svgFn();
  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    imageCache.set(key, img);
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
  // Return null on first call (image not loaded yet), cached on subsequent
  return null;
}

// Pre-generate frames for animated sprites
const ANIM_FRAMES = 16;

export function preloadSprites() {
  // Pre-load monkey frames for both directions
  for (let f = 0; f < ANIM_FRAMES; f++) {
    const keyL = `monkey_left_${f}`;
    const keyR = `monkey_right_${f}`;
    const frame = f;
    getOrCreateImage(keyL, () => monkeySVG('left', frame));
    getOrCreateImage(keyR, () => monkeySVG('right', frame));
  }
  // Pre-load customer frames
  for (let f = 0; f < 8; f++) {
    getOrCreateImage(`customer_${f}`, () => customerSVG('', f));
  }
  // Pre-load static sprites
  getOrCreateImage('fruit_banana', bananaSVG);
  getOrCreateImage('fruit_apple', appleSVG);
  getOrCreateImage('fruit_orange', orangeSVG);
  getOrCreateImage('cashier_0', () => cashierSVG(0));
}

export function getPlayerSprite(facing: 'left' | 'right', frame: number): HTMLImageElement | null {
  const f = Math.floor(frame) % ANIM_FRAMES;
  const key = `monkey_${facing}_${f}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  getOrCreateImage(key, () => monkeySVG(facing, f));
  return null;
}

export function getCustomerSprite(frame: number): HTMLImageElement | null {
  const f = Math.floor(frame) % 8;
  const key = `customer_${f}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  getOrCreateImage(key, () => customerSVG('', f));
  return null;
}

export function getFruitSprite(type: string): HTMLImageElement | null {
  const key = `fruit_${type}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  if (type === 'banana') getOrCreateImage(key, bananaSVG);
  else if (type === 'apple') getOrCreateImage(key, appleSVG);
  else if (type === 'orange') getOrCreateImage(key, orangeSVG);
  return null;
}

export function getTreeSprite(fruitType: string | null, ready: boolean, progress: number): HTMLImageElement | null {
  const key = `tree_${fruitType}_${ready}_${Math.floor(progress * 10)}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  getOrCreateImage(key, () => treeSVG(fruitType, ready, progress));
  return null;
}

export function getShelfSprite(stock: number, maxStock: number, fruitType: string | null): HTMLImageElement | null {
  const key = `shelf_${fruitType}_${stock}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  getOrCreateImage(key, () => shelfSVG(stock, maxStock, fruitType));
  return null;
}

export function getCashierSprite(frame: number): HTMLImageElement | null {
  const key = `cashier_0`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  getOrCreateImage(key, () => cashierSVG(0));
  return null;
}
