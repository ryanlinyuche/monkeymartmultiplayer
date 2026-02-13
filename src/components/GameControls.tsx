import { useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  onMove: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export const GameControls = ({ onMove }: GameControlsProps) => {
  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        onMove('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        onMove('right');
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        onMove('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        onMove('down');
        break;
    }
  }, [onMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Mobile/touch controls
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          {/* Top row */}
          <div />
          <button
            onMouseDown={() => onMove('up')}
            onTouchStart={() => onMove('up')}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <ArrowUp size={24} />
          </button>
          <div />

          {/* Middle row */}
          <button
            onMouseDown={() => onMove('left')}
            onTouchStart={() => onMove('left')}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-14 h-14 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
          <button
            onMouseDown={() => onMove('right')}
            onTouchStart={() => onMove('right')}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <ArrowRight size={24} />
          </button>

          {/* Bottom row */}
          <div />
          <button
            onMouseDown={() => onMove('down')}
            onTouchStart={() => onMove('down')}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <ArrowDown size={24} />
          </button>
          <div />
        </div>

        {/* Instructions */}
        <div className="mt-3 text-center text-xs text-gray-600">
          Arrow keys or WASD
        </div>
      </div>
    </div>
  );
};
