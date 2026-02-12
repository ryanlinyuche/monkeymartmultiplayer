import { useRef, useEffect, useCallback, useState } from 'react';
import { GameState, Keys } from '@/game/types';
import { createInitialState } from '@/game/init';
import { updateGame } from '@/game/logic';
import { renderGame } from '@/game/renderer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/constants';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const keysRef = useRef<Keys>({});
  const rafRef = useRef<number>(0);
  const [scores, setScores] = useState([0, 0]);
  const [carrying, setCarrying] = useState<(string | null)[]>([null, null]);

  const gameLoop = useCallback(() => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateGame(state, keysRef.current);
    renderGame(ctx, state);

    // Update React state for HUD (throttled)
    if (state.gameTime % 10 === 0) {
      setScores([state.players[0].money, state.players[1].money]);
      setCarrying([state.players[0].carrying, state.players[1].carrying]);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      // Prevent scrolling with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop]);

  const resetGame = () => {
    stateRef.current = createInitialState();
    setScores([0, 0]);
    setCarrying([null, null]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD */}
      <div className="flex w-full max-w-[960px] justify-between items-center px-2">
        <div className="flex items-center gap-3 bg-game-p1/20 border-2 border-game-p1 rounded-xl px-4 py-2">
          <span className="text-2xl">🐒</span>
          <div>
            <div className="font-display font-bold text-sm" style={{ color: '#4a9eed' }}>Player 1</div>
            <div className="font-display font-bold text-xl text-foreground">💰 ${scores[0]}</div>
          </div>
          {carrying[0] && <span className="text-lg ml-1">📦{carrying[0] === 'banana' ? '🍌' : carrying[0] === 'apple' ? '🍎' : '🍊'}</span>}
        </div>

        <button
          onClick={resetGame}
          className="bg-primary hover:bg-primary/80 text-primary-foreground font-display font-bold px-5 py-2 rounded-xl transition-colors text-sm"
        >
          🔄 Restart
        </button>

        <div className="flex items-center gap-3 bg-game-p2/20 border-2 border-game-p2 rounded-xl px-4 py-2">
          {carrying[1] && <span className="text-lg mr-1">📦{carrying[1] === 'banana' ? '🍌' : carrying[1] === 'apple' ? '🍎' : '🍊'}</span>}
          <div className="text-right">
            <div className="font-display font-bold text-sm" style={{ color: '#ed4a7a' }}>Player 2</div>
            <div className="font-display font-bold text-xl text-foreground">💰 ${scores[1]}</div>
          </div>
          <span className="text-2xl">🐒</span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-2xl border-4 border-game-shelf shadow-2xl"
        style={{ imageRendering: 'auto', maxWidth: '100%' }}
      />

      {/* Controls */}
      <div className="flex gap-8 text-sm font-body">
        <div className="bg-card rounded-xl px-4 py-2 border border-border">
          <span className="font-display font-bold" style={{ color: '#4a9eed' }}>P1:</span>
          <span className="ml-2 text-muted-foreground">
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">W</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">A</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">S</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">D</kbd>
          </span>
        </div>
        <div className="bg-card rounded-xl px-4 py-2 border border-border">
          <span className="font-display font-bold" style={{ color: '#ed4a7a' }}>P2:</span>
          <span className="ml-2 text-muted-foreground">
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">↑</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">←</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">↓</kbd>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">→</kbd>
          </span>
        </div>
      </div>

      <p className="text-muted-foreground text-xs max-w-md text-center">
        Walk near fruit trees to pick fruit automatically, then walk to shelves to stock them.
        Customers will come buy from stocked shelves!
      </p>
    </div>
  );
}
