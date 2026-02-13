import { useRef, useEffect, useCallback, useState } from 'react';
import { GameState, Keys, PlayerInput } from '@/game/types';
import { createInitialState } from '@/game/init';
import { updateGame } from '@/game/logic';
import { renderGame } from '@/game/renderer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/constants';
import { MultiplayerManager } from '@/game/multiplayer';

interface GameCanvasProps {
  multiplayer: MultiplayerManager;
  playerCount: number;
  playerNames: string[];
}

export default function GameCanvas({ multiplayer, playerCount, playerNames }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState(playerCount, playerNames));
  const keysRef = useRef<Keys>({});
  const rafRef = useRef<number>(0);
  const remoteInputsRef = useRef<Map<number, PlayerInput>>(new Map());
  const [money, setMoney] = useState(0);

  const gameLoop = useCallback(() => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!multiplayer) return;

    if (multiplayer.isHost) {
      // Build inputs from local keys + remote inputs
      const localInput: PlayerInput = {
        playerId: multiplayer.playerId,
        keys: {
          up: !!keysRef.current['w'] || !!keysRef.current['W'],
          down: !!keysRef.current['s'] || !!keysRef.current['S'],
          left: !!keysRef.current['a'] || !!keysRef.current['A'],
          right: !!keysRef.current['d'] || !!keysRef.current['D'],
          interact: !!keysRef.current['e'] || !!keysRef.current['E'] || !!keysRef.current[' '],
        },
      };

      const allInputs: PlayerInput[] = [localInput];
      remoteInputsRef.current.forEach(input => allInputs.push(input));

      updateGame(state, allInputs);

      // Broadcast state to other players (throttled)
      if (state.gameTime % 2 === 0) {
        multiplayer.broadcastState(state);
      }
    }

    renderGame(ctx, state);

    if (state.gameTime % 10 === 0) {
      setMoney(state.money);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [multiplayer]);

  useEffect(() => {
    if (!multiplayer) return;
    
    if (multiplayer.isHost) {
      multiplayer.onPlayerInput = (input: PlayerInput) => {
        remoteInputsRef.current.set(input.playerId, input);
      };
    } else {
      // Client: receive state updates
      multiplayer.onStateUpdate = (state: GameState) => {
        stateRef.current = state;
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Non-host: send inputs
      if (!multiplayer.isHost) {
        sendInput();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
      if (!multiplayer.isHost) {
        sendInput();
      }
    };

    function sendInput() {
      const input: PlayerInput = {
        playerId: multiplayer.playerId,
        keys: {
          up: !!keysRef.current['w'] || !!keysRef.current['W'],
          down: !!keysRef.current['s'] || !!keysRef.current['S'],
          left: !!keysRef.current['a'] || !!keysRef.current['A'],
          right: !!keysRef.current['d'] || !!keysRef.current['D'],
          interact: !!keysRef.current['e'] || !!keysRef.current['E'] || !!keysRef.current[' '],
        },
      };
      multiplayer.sendInput(input);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop, multiplayer]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4 text-sm font-body">
        <span className="bg-card border border-border rounded-xl px-3 py-1.5 font-display font-bold">
          💰 ${money}
        </span>
        <span className="text-muted-foreground">
          Room: <span className="font-mono font-bold text-primary">{multiplayer?.roomCode ?? '...'}</span>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-2xl border-4 border-game-shelf shadow-2xl"
        style={{ imageRendering: 'auto', maxWidth: '100%' }}
      />

      <div className="flex gap-4 text-xs font-body text-muted-foreground">
        <span>
          <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">WASD</kbd> move
        </span>
        <span>
          <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">E</kbd> / <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">Space</kbd> buy plot
        </span>
      </div>

      <p className="text-muted-foreground text-xs max-w-md text-center">
        Walk near trees to pick fruit, stock shelves, and stand at the cashier to check out customers. 
        Buy new plots with shared earnings!
      </p>
    </div>
  );
}
