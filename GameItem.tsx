import { motion } from 'framer-motion';

interface GameItemProps {
  type: string;
  position: { x: number; y: number };
}

// SVG Item Sprites
const ItemSprites = {
  banana: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Banana curve */}
      <path
        d="M 8 16 Q 12 8 16 8 Q 20 8 24 10 Q 26 12 26 16 Q 26 20 22 24 Q 18 26 14 24"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="1"
      />
      {/* Banana highlight */}
      <path
        d="M 10 14 Q 14 10 18 10 Q 20 10 22 12"
        fill="none"
        stroke="#FFED4E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Stem */}
      <rect x="7" y="14" width="3" height="4" fill="#8B4513" rx="1"/>
    </svg>
  ),

  apple: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Apple body */}
      <circle cx="16" cy="18" r="9" fill="#DC143C"/>
      {/* Apple highlight */}
      <circle cx="13" cy="15" r="3" fill="#FF6B6B" opacity="0.6"/>
      {/* Stem */}
      <rect x="15" y="8" width="2" height="6" fill="#8B4513" rx="1"/>
      {/* Leaf */}
      <ellipse cx="18" cy="10" rx="3" ry="2" fill="#228B22" transform="rotate(-20 18 10)"/>
    </svg>
  ),

  orange: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Orange body */}
      <circle cx="16" cy="16" r="9" fill="#FF8C00"/>
      {/* Orange texture */}
      <circle cx="16" cy="16" r="9" fill="none" stroke="#FFA500" strokeWidth="1" strokeDasharray="2,2"/>
      {/* Highlight */}
      <circle cx="13" cy="13" r="3" fill="#FFB84D" opacity="0.6"/>
      {/* Stem */}
      <rect x="15" y="6" width="2" height="4" fill="#8B4513" rx="1"/>
      <circle cx="16" cy="6" r="1.5" fill="#8B4513"/>
    </svg>
  ),

  milk: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Bottle body */}
      <rect x="10" y="14" width="12" height="14" fill="white" stroke="#E0E0E0" strokeWidth="1" rx="2"/>
      {/* Bottle neck */}
      <rect x="13" y="10" width="6" height="5" fill="white" stroke="#E0E0E0" strokeWidth="1" rx="1"/>
      {/* Cap */}
      <rect x="12" y="8" width="8" height="3" fill="#FF6B6B" rx="1"/>
      {/* Label */}
      <rect x="11" y="18" width="10" height="6" fill="#4A90E2" opacity="0.3" rx="1"/>
      {/* Milk level */}
      <rect x="11" y="20" width="10" height="7" fill="#F5F5F5" rx="1"/>
    </svg>
  ),

  egg: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Egg shape */}
      <ellipse cx="16" cy="17" rx="7" ry="9" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
      {/* Egg spots */}
      <ellipse cx="14" cy="15" rx="1.5" ry="2" fill="#F5DEB3" opacity="0.4"/>
      <ellipse cx="18" cy="18" rx="1" ry="1.5" fill="#F5DEB3" opacity="0.4"/>
      {/* Highlight */}
      <ellipse cx="13" cy="13" rx="2" ry="3" fill="white" opacity="0.6"/>
    </svg>
  ),

  corn: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Corn cob */}
      <rect x="12" y="10" width="8" height="16" fill="#FFD700" rx="3"/>
      {/* Corn kernels texture */}
      {[...Array(5)].map((_, row) =>
        [...Array(3)].map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={13.5 + col * 2.5}
            cy={12 + row * 3}
            r="1"
            fill="#DAA520"
          />
        ))
      )}
      {/* Husk */}
      <path d="M 8 8 Q 10 6 12 8 L 12 18 Q 10 20 8 18 Z" fill="#90EE90" opacity="0.7"/>
      <path d="M 24 8 Q 22 6 20 8 L 20 18 Q 22 20 24 18 Z" fill="#90EE90" opacity="0.7"/>
    </svg>
  ),

  carrot: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Carrot body */}
      <path
        d="M 16 8 L 12 26 Q 16 28 20 26 Z"
        fill="#FF8C00"
      />
      {/* Carrot lines */}
      <line x1="15" y1="12" x2="14" y2="18" stroke="#CC6600" strokeWidth="0.5"/>
      <line x1="17" y1="12" x2="18" y2="18" stroke="#CC6600" strokeWidth="0.5"/>
      {/* Carrot top/leaves */}
      <path d="M 16 8 L 14 4 L 15 6 L 16 4 L 17 6 L 18 4 L 16 8" fill="#228B22"/>
      <path d="M 15 8 L 13 5 L 14 7" fill="#32CD32"/>
      <path d="M 17 8 L 19 5 L 18 7" fill="#32CD32"/>
    </svg>
  ),

  shelf: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Shelf structure */}
      <rect x="4" y="12" width="24" height="3" fill="#8B4513" rx="1"/>
      <rect x="4" y="20" width="24" height="3" fill="#8B4513" rx="1"/>
      {/* Shelf legs */}
      <rect x="5" y="15" width="2" height="12" fill="#654321" rx="0.5"/>
      <rect x="25" y="15" width="2" height="12" fill="#654321" rx="0.5"/>
      {/* Shelf back */}
      <rect x="6" y="10" width="20" height="1" fill="#A0522D"/>
    </svg>
  ),
};

export const GameItem = ({ type, position }: GameItemProps) => {
  const ItemComponent = ItemSprites[type as keyof typeof ItemSprites] || ItemSprites.banana;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateX(-16px) translateY(-16px)',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Item sprite */}
      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ItemComponent />
      </motion.div>

      {/* Item shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"
      />
    </motion.div>
  );
};
