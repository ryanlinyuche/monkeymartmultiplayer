import { motion } from 'framer-motion';

interface PlayerProps {
  position: { x: number; y: number };
  direction: 'left' | 'right' | 'up' | 'down';
  animalType: 'monkey' | 'panda' | 'elephant' | 'lion';
  carrying?: string;
  isCurrentPlayer: boolean;
}

// SVG Animal Sprites
const AnimalSprites = {
  monkey: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="14" ry="12" fill="#8B4513"/>
      {/* Head */}
      <circle cx="24" cy="18" r="12" fill="#A0522D"/>
      {/* Ears */}
      <circle cx="14" cy="14" r="4" fill="#8B4513"/>
      <circle cx="34" cy="14" r="4" fill="#8B4513"/>
      {/* Face patch */}
      <ellipse cx="24" cy="20" rx="8" ry="6" fill="#D2691E"/>
      {/* Eyes */}
      <circle cx="20" cy="17" r="2.5" fill="white"/>
      <circle cx="28" cy="17" r="2.5" fill="white"/>
      <circle cx="20.5" cy="17.5" r="1.5" fill="black"/>
      <circle cx="28.5" cy="17.5" r="1.5" fill="black"/>
      {/* Nose */}
      <ellipse cx="24" cy="22" rx="2" ry="1.5" fill="#654321"/>
      {/* Mouth */}
      <path d="M 22 24 Q 24 26 26 24" stroke="#654321" strokeWidth="1" fill="none"/>
      {/* Tail */}
      <path
        d="M 10 32 Q 8 28 12 24"
        stroke="#8B4513"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arms - position based on direction */}
      <ellipse
        cx={direction === 'right' ? "32" : "16"}
        cy="28"
        rx="3"
        ry="8"
        fill="#8B4513"
      />
      {/* Legs */}
      <ellipse cx="20" cy="42" rx="3" ry="6" fill="#8B4513"/>
      <ellipse cx="28" cy="42" rx="3" ry="6" fill="#8B4513"/>
    </svg>
  ),

  panda: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="14" ry="12" fill="white"/>
      <ellipse cx="24" cy="32" rx="12" ry="10" fill="white" stroke="black" strokeWidth="1"/>
      {/* Head */}
      <circle cx="24" cy="18" r="12" fill="white"/>
      {/* Ears */}
      <circle cx="14" cy="12" r="5" fill="black"/>
      <circle cx="34" cy="12" r="5" fill="black"/>
      {/* Eye patches */}
      <ellipse cx="19" cy="17" rx="4" ry="5" fill="black"/>
      <ellipse cx="29" cy="17" rx="4" ry="5" fill="black"/>
      {/* Eyes */}
      <circle cx="19" cy="17" r="2" fill="white"/>
      <circle cx="29" cy="17" r="2" fill="white"/>
      <circle cx="19.5" cy="17.5" r="1" fill="black"/>
      <circle cx="29.5" cy="17.5" r="1" fill="black"/>
      {/* Nose */}
      <ellipse cx="24" cy="22" rx="2.5" ry="2" fill="black"/>
      {/* Mouth */}
      <path d="M 21 24 Q 24 26 27 24" stroke="black" strokeWidth="1.5" fill="none"/>
      {/* Arms */}
      <ellipse cx="16" cy="28" rx="4" ry="8" fill="black"/>
      <ellipse cx="32" cy="28" rx="4" ry="8" fill="black"/>
      {/* Legs */}
      <ellipse cx="20" cy="42" rx="4" ry="6" fill="black"/>
      <ellipse cx="28" cy="42" rx="4" ry="6" fill="black"/>
    </svg>
  ),

  elephant: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Body */}
      <ellipse cx="24" cy="32" rx="16" ry="14" fill="#A9A9A9"/>
      {/* Head */}
      <circle cx="24" cy="18" r="13" fill="#808080"/>
      {/* Ears */}
      <ellipse cx="12" cy="16" rx="6" ry="10" fill="#A9A9A9"/>
      <ellipse cx="36" cy="16" rx="6" ry="10" fill="#A9A9A9"/>
      {/* Trunk */}
      <path
        d="M 24 24 Q 24 30 22 36 Q 20 42 24 44"
        stroke="#808080"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Eyes */}
      <circle cx="19" cy="16" r="2" fill="white"/>
      <circle cx="29" cy="16" r="2" fill="white"/>
      <circle cx="19.5" cy="16.5" r="1.2" fill="black"/>
      <circle cx="29.5" cy="16.5" r="1.2" fill="black"/>
      {/* Tusks */}
      <path d="M 18 24 L 16 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 30 24 L 32 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="16" y="40" width="4" height="8" fill="#808080" rx="2"/>
      <rect x="28" y="40" width="4" height="8" fill="#808080" rx="2"/>
    </svg>
  ),

  lion: ({ direction }: { direction: string }) => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Mane */}
      <circle cx="24" cy="18" r="15" fill="#DAA520"/>
      {/* Body */}
      <ellipse cx="24" cy="32" rx="13" ry="11" fill="#F4A460"/>
      {/* Head */}
      <circle cx="24" cy="18" r="11" fill="#F4A460"/>
      {/* Ears */}
      <circle cx="16" cy="12" r="3" fill="#DAA520"/>
      <circle cx="32" cy="12" r="3" fill="#DAA520"/>
      {/* Inner ears */}
      <circle cx="16" cy="12" r="1.5" fill="#F4A460"/>
      <circle cx="32" cy="12" r="1.5" fill="#F4A460"/>
      {/* Eyes */}
      <circle cx="20" cy="17" r="2.5" fill="white"/>
      <circle cx="28" cy="17" r="2.5" fill="white"/>
      <circle cx="20.5" cy="17.5" r="1.5" fill="black"/>
      <circle cx="28.5" cy="17.5" r="1.5" fill="black"/>
      {/* Nose */}
      <path d="M 24 20 L 22 22 L 26 22 Z" fill="#8B4513"/>
      {/* Mouth */}
      <path d="M 20 23 Q 24 25 28 23" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
      {/* Whiskers */}
      <line x1="16" y1="20" x2="10" y2="19" stroke="#654321" strokeWidth="1"/>
      <line x1="16" y1="22" x2="10" y2="23" stroke="#654321" strokeWidth="1"/>
      <line x1="32" y1="20" x2="38" y2="19" stroke="#654321" strokeWidth="1"/>
      <line x1="32" y1="22" x2="38" y2="23" stroke="#654321" strokeWidth="1"/>
      {/* Tail */}
      <path
        d="M 10 32 Q 6 30 8 26"
        stroke="#F4A460"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="26" r="2" fill="#DAA520"/>
      {/* Legs */}
      <ellipse cx="20" cy="42" rx="3" ry="6" fill="#F4A460"/>
      <ellipse cx="28" cy="42" rx="3" ry="6" fill="#F4A460"/>
    </svg>
  ),
};

export const Player = ({ position, direction, animalType, carrying, isCurrentPlayer }: PlayerProps) => {
  const AnimalComponent = AnimalSprites[animalType];

  return (
    <motion.div
      className="absolute pointer-events-none"
      animate={{
        left: position.x,
        top: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transform: `translateX(-24px) translateY(-24px) ${direction === 'left' ? 'scaleX(-1)' : ''}`,
      }}
    >
      {/* Character sprite */}
      <div className="relative">
        <AnimalComponent direction={direction} />
        
        {/* Carrying item indicator */}
        {carrying && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="text-2xl">{carrying}</div>
          </div>
        )}

        {/* Current player indicator */}
        {isCurrentPlayer && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              You
            </div>
          </div>
        )}
      </div>

      {/* Walking animation effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
