// Additional Animal and Item Sprites
// Copy these into your Player.tsx or GameItem.tsx files to expand your game!

// ==================== ADDITIONAL ANIMALS ====================

export const AdditionalAnimalSprites = {
  rabbit: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="12" ry="10" fill="#F5F5DC"/>
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#F5F5DC"/>
      {/* Long ears */}
      <ellipse cx="18" cy="8" rx="3" ry="10" fill="#FFE4E1"/>
      <ellipse cx="30" cy="8" rx="3" ry="10" fill="#FFE4E1"/>
      {/* Inner ears */}
      <ellipse cx="18" cy="8" rx="2" ry="7" fill="#FFB6C1"/>
      <ellipse cx="30" cy="8" rx="2" ry="7" fill="#FFB6C1"/>
      {/* Eyes */}
      <circle cx="20" cy="17" r="2" fill="black"/>
      <circle cx="28" cy="17" r="2" fill="black"/>
      {/* Nose */}
      <circle cx="24" cy="21" r="1.5" fill="#FFB6C1"/>
      {/* Mouth */}
      <path d="M 24 22 L 24 24 M 22 24 Q 24 25 26 24" stroke="black" strokeWidth="0.8" fill="none"/>
      {/* Front teeth */}
      <rect x="22" y="23" width="1.5" height="2" fill="white"/>
      <rect x="24.5" y="23" width="1.5" height="2" fill="white"/>
      {/* Fluffy tail */}
      <circle cx="10" cy="34" r="4" fill="#F5F5DC"/>
      {/* Legs */}
      <ellipse cx="20" cy="42" rx="3" ry="6" fill="#F5F5DC"/>
      <ellipse cx="28" cy="42" rx="3" ry="6" fill="#F5F5DC"/>
    </svg>
  ),

  fox: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="12" ry="10" fill="#FF6347"/>
      {/* Body white patch */}
      <ellipse cx="24" cy="34" rx="8" ry="6" fill="white"/>
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#FF6347"/>
      {/* Ears - triangular */}
      <path d="M 16 12 L 12 4 L 18 10 Z" fill="#FF6347"/>
      <path d="M 32 12 L 36 4 L 30 10 Z" fill="#FF6347"/>
      {/* Ear inner */}
      <path d="M 16 10 L 14 6 L 18 9 Z" fill="white"/>
      <path d="M 32 10 L 34 6 L 30 9 Z" fill="white"/>
      {/* Face white patch */}
      <ellipse cx="24" cy="20" rx="6" ry="5" fill="white"/>
      {/* Eyes */}
      <circle cx="20" cy="17" r="2" fill="black"/>
      <circle cx="28" cy="17" r="2" fill="black"/>
      {/* Nose */}
      <circle cx="24" cy="22" r="1.5" fill="black"/>
      {/* Bushy tail */}
      <path d="M 8 32 Q 4 28 6 24 Q 8 20 12 22" fill="#FF6347" strokeWidth="4" stroke="#FF6347" strokeLinecap="round"/>
      <path d="M 8 32 Q 6 30 7 28" fill="white" strokeWidth="2" stroke="white" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="18" y="38" width="3" height="8" fill="#FF6347" rx="1"/>
      <rect x="27" y="38" width="3" height="8" fill="#FF6347" rx="1"/>
      {/* White leg tips */}
      <rect x="18" y="44" width="3" height="2" fill="white"/>
      <rect x="27" y="44" width="3" height="2" fill="white"/>
    </svg>
  ),

  bear: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="14" ry="12" fill="#8B4513"/>
      {/* Body patch */}
      <ellipse cx="24" cy="34" rx="10" ry="8" fill="#A0522D"/>
      {/* Head */}
      <circle cx="24" cy="18" r="11" fill="#8B4513"/>
      {/* Round ears */}
      <circle cx="14" cy="12" r="5" fill="#8B4513"/>
      <circle cx="34" cy="12" r="5" fill="#8B4513"/>
      {/* Inner ears */}
      <circle cx="14" cy="12" r="3" fill="#A0522D"/>
      <circle cx="34" cy="12" r="3" fill="#A0522D"/>
      {/* Snout */}
      <ellipse cx="24" cy="22" rx="6" ry="5" fill="#D2691E"/>
      {/* Eyes */}
      <circle cx="20" cy="17" r="2" fill="black"/>
      <circle cx="28" cy="17" r="2" fill="black"/>
      {/* Nose */}
      <ellipse cx="24" cy="24" rx="2.5" ry="2" fill="black"/>
      {/* Mouth */}
      <path d="M 21 26 Q 24 28 27 26" stroke="black" strokeWidth="1.5" fill="none"/>
      {/* Legs */}
      <ellipse cx="18" cy="42" rx="4" ry="6" fill="#8B4513"/>
      <ellipse cx="30" cy="42" rx="4" ry="6" fill="#8B4513"/>
      {/* Paws */}
      <ellipse cx="18" cy="44" rx="5" ry="3" fill="#A0522D"/>
      <ellipse cx="30" cy="44" rx="5" ry="3" fill="#A0522D"/>
    </svg>
  ),

  penguin: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body - black */}
      <ellipse cx="24" cy="28" rx="12" ry="14" fill="black"/>
      {/* Belly - white */}
      <ellipse cx="24" cy="30" rx="8" ry="10" fill="white"/>
      {/* Head - black */}
      <circle cx="24" cy="14" r="9" fill="black"/>
      {/* Face - white */}
      <ellipse cx="24" cy="16" rx="6" ry="7" fill="white"/>
      {/* Eyes */}
      <circle cx="21" cy="14" r="2" fill="black"/>
      <circle cx="27" cy="14" r="2" fill="black"/>
      {/* White dots in eyes */}
      <circle cx="21.5" cy="13.5" r="0.8" fill="white"/>
      <circle cx="27.5" cy="13.5" r="0.8" fill="white"/>
      {/* Beak */}
      <path d="M 24 18 L 20 20 L 24 19 L 28 20 Z" fill="#FFA500"/>
      {/* Wings/Flippers */}
      <ellipse cx="14" cy="26" rx="3" ry="10" fill="black" transform="rotate(-20 14 26)"/>
      <ellipse cx="34" cy="26" rx="3" ry="10" fill="black" transform="rotate(20 34 26)"/>
      {/* Feet */}
      <ellipse cx="20" cy="42" rx="4" ry="2" fill="#FFA500"/>
      <ellipse cx="28" cy="42" rx="4" ry="2" fill="#FFA500"/>
    </svg>
  ),
};

// ==================== ADDITIONAL FOOD ITEMS ====================

export const AdditionalItemSprites = {
  strawberry: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Berry body */}
      <path d="M 16 10 Q 10 12 10 18 Q 10 24 16 28 Q 22 24 22 18 Q 22 12 16 10" fill="#DC143C"/>
      {/* Seeds */}
      {[...Array(8)].map((_, i) => (
        <ellipse
          key={i}
          cx={14 + (i % 2) * 4}
          cy={14 + Math.floor(i / 2) * 3}
          rx="0.8"
          ry="0.6"
          fill="#FFD700"
        />
      ))}
      {/* Leaves */}
      <path d="M 12 10 L 10 6 L 13 9" fill="#228B22"/>
      <path d="M 16 8 L 16 4 L 16 9" fill="#228B22"/>
      <path d="M 20 10 L 22 6 L 19 9" fill="#228B22"/>
      {/* Stem */}
      <rect x="15.5" y="8" width="1" height="3" fill="#8B4513"/>
    </svg>
  ),

  pineapple: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Body */}
      <ellipse cx="16" cy="22" rx="7" ry="10" fill="#FFD700"/>
      {/* Diamond pattern */}
      {[...Array(4)].map((_, row) =>
        [...Array(3)].map((_, col) => (
          <path
            key={`${row}-${col}`}
            d={`M ${12 + col * 2.5} ${14 + row * 4} L ${13 + col * 2.5} ${16 + row * 4} L ${12 + col * 2.5} ${18 + row * 4} L ${11 + col * 2.5} ${16 + row * 4} Z`}
            fill="#DAA520"
          />
        ))
      )}
      {/* Crown/Leaves */}
      <path d="M 14 10 L 12 6 L 14 8" fill="#228B22"/>
      <path d="M 16 8 L 16 4 L 16 7" fill="#228B22"/>
      <path d="M 18 10 L 20 6 L 18 8" fill="#228B22"/>
      <path d="M 15 11 L 14 7 L 15 9" fill="#32CD32"/>
      <path d="M 17 11 L 18 7 L 17 9" fill="#32CD32"/>
    </svg>
  ),

  watermelon: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Watermelon slice shape */}
      <path d="M 8 24 Q 16 8 24 24 Z" fill="#FF6B6B"/>
      {/* Pink inner part */}
      <path d="M 10 22 Q 16 10 22 22 Z" fill="#FFB6C1"/>
      {/* Seeds */}
      <ellipse cx="13" cy="18" rx="1" ry="1.5" fill="black"/>
      <ellipse cx="16" cy="15" rx="1" ry="1.5" fill="black"/>
      <ellipse cx="19" cy="18" rx="1" ry="1.5" fill="black"/>
      <ellipse cx="14.5" cy="20" rx="1" ry="1.5" fill="black"/>
      <ellipse cx="17.5" cy="20" rx="1" ry="1.5" fill="black"/>
      {/* Rind */}
      <path d="M 8 24 Q 16 26 24 24" stroke="#228B22" strokeWidth="3" fill="none"/>
    </svg>
  ),

  bread: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Bread loaf */}
      <ellipse cx="16" cy="20" rx="10" ry="8" fill="#DEB887"/>
      {/* Top crust curve */}
      <path d="M 8 20 Q 16 12 24 20" fill="#D2691E"/>
      {/* Crust lines */}
      <path d="M 10 18 Q 16 14 22 18" stroke="#CD853F" strokeWidth="1" fill="none"/>
      {/* Texture dots */}
      <circle cx="13" cy="20" r="0.8" fill="#CD853F"/>
      <circle cx="16" cy="18" r="0.8" fill="#CD853F"/>
      <circle cx="19" cy="20" r="0.8" fill="#CD853F"/>
    </svg>
  ),

  cheese: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Cheese wedge */}
      <path d="M 24 8 L 8 24 L 24 24 Z" fill="#FFD700"/>
      {/* Holes */}
      <circle cx="18" cy="18" r="2" fill="#FFA500"/>
      <circle cx="14" cy="20" r="1.5" fill="#FFA500"/>
      <circle cx="20" cy="14" r="1.8" fill="#FFA500"/>
      {/* Highlight */}
      <path d="M 22 10 L 10 22" stroke="#FFED4E" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  ),

  fish: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Fish body */}
      <ellipse cx="18" cy="16" rx="10" ry="6" fill="#4682B4"/>
      {/* Fish head */}
      <circle cx="26" cy="16" r="4" fill="#4682B4"/>
      {/* Eye */}
      <circle cx="27" cy="15" r="1.5" fill="white"/>
      <circle cx="27.5" cy="15" r="0.8" fill="black"/>
      {/* Tail */}
      <path d="M 8 16 L 4 12 L 8 14 L 4 20 Z" fill="#5F9EA0"/>
      {/* Top fin */}
      <path d="M 18 10 L 16 6 L 20 10" fill="#5F9EA0"/>
      {/* Bottom fin */}
      <path d="M 18 22 L 16 26 L 20 22" fill="#5F9EA0"/>
      {/* Scales */}
      <circle cx="16" cy="16" r="1" fill="#B0E0E6" opacity="0.5"/>
      <circle cx="20" cy="15" r="1" fill="#B0E0E6" opacity="0.5"/>
      <circle cx="20" cy="17" r="1" fill="#B0E0E6" opacity="0.5"/>
    </svg>
  ),

  donut: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Donut */}
      <circle cx="16" cy="16" r="10" fill="#FFB6C1"/>
      {/* Hole */}
      <circle cx="16" cy="16" r="4" fill="white"/>
      {/* Frosting drips */}
      <circle cx="12" cy="12" r="1.5" fill="#FF69B4"/>
      <circle cx="20" cy="11" r="1.5" fill="#FF1493"/>
      <circle cx="22" cy="18" r="1.5" fill="#FF69B4"/>
      <circle cx="14" cy="22" r="1.5" fill="#FF1493"/>
      {/* Sprinkles */}
      <rect x="10" y="14" width="1" height="3" fill="#FFD700" transform="rotate(20 10 14)"/>
      <rect x="22" y="15" width="1" height="3" fill="#00CED1" transform="rotate(-20 22 15)"/>
      <rect x="18" y="20" width="1" height="3" fill="#FF6347" transform="rotate(45 18 20)"/>
    </svg>
  ),
};

// ==================== STORE/ENVIRONMENT ITEMS ====================

export const StoreItemSprites = {
  cashRegister: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Base */}
      <rect x="8" y="20" width="16" height="8" fill="#4A4A4A" rx="1"/>
      {/* Screen */}
      <rect x="10" y="12" width="12" height="8" fill="#2C3E50" rx="1"/>
      {/* Display */}
      <rect x="11" y="13" width="10" height="6" fill="#3498DB"/>
      {/* Numbers on display */}
      <text x="16" y="18" fontSize="4" fill="white" textAnchor="middle">$$$</text>
      {/* Buttons */}
      <rect x="10" y="22" width="2" height="2" fill="#7F8C8D" rx="0.5"/>
      <rect x="13" y="22" width="2" height="2" fill="#7F8C8D" rx="0.5"/>
      <rect x="16" y="22" width="2" height="2" fill="#7F8C8D" rx="0.5"/>
      <rect x="19" y="22" width="2" height="2" fill="#7F8C8D" rx="0.5"/>
    </svg>
  ),

  shoppingCart: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Cart basket */}
      <path d="M 10 12 L 8 24 L 24 24 L 22 12 Z" fill="none" stroke="#E74C3C" strokeWidth="2"/>
      {/* Handle */}
      <path d="M 10 12 Q 8 8 12 8" fill="none" stroke="#E74C3C" strokeWidth="2"/>
      {/* Wire grid */}
      <line x1="13" y1="12" x2="12" y2="24" stroke="#C0392B" strokeWidth="1"/>
      <line x1="16" y1="12" x2="15" y2="24" stroke="#C0392B" strokeWidth="1"/>
      <line x1="19" y1="12" x2="18" y2="24" stroke="#C0392B" strokeWidth="1"/>
      {/* Wheels */}
      <circle cx="12" cy="27" r="2" fill="#34495E"/>
      <circle cx="20" cy="27" r="2" fill="#34495E"/>
    </svg>
  ),

  plant: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Pot */}
      <path d="M 12 22 L 10 28 L 22 28 L 20 22 Z" fill="#8B4513"/>
      {/* Soil */}
      <rect x="11" y="20" width="10" height="3" fill="#654321"/>
      {/* Leaves */}
      <ellipse cx="14" cy="16" rx="4" ry="6" fill="#228B22" transform="rotate(-30 14 16)"/>
      <ellipse cx="18" cy="16" rx="4" ry="6" fill="#228B22" transform="rotate(30 18 16)"/>
      <ellipse cx="16" cy="12" rx="3" ry="5" fill="#32CD32"/>
      {/* Stem */}
      <rect x="15.5" y="14" width="1" height="8" fill="#2E7D32"/>
    </svg>
  ),
};
