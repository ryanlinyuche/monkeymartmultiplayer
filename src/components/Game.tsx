import { useState, useRef, useCallback } from 'react';
import GameLobby from './GameLobby';
import GameRoom from './GameRoom';
import GameCanvas from './GameCanvas';
import { createRoom, joinRoom, MultiplayerManager } from '@/game/multiplayer';

type Phase = 'lobby' | 'room' | 'playing';

export function Game() {
  const [phase, setPhase] = useState<Phase>('lobby');
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const mpRef = useRef<MultiplayerManager | null>(null);

  const handleCreateRoom = useCallback((name: string) => {
    const mp = createRoom(name);
    mpRef.current = mp;
    setPlayers([{ id: 1, name }]);
    mp.onPlayersChanged = (p) => setPlayers(p);
    mp.onGameStart = () => setPhase('playing');
    setPhase('room');
  }, []);

  const handleJoinRoom = useCallback((code: string, name: string) => {
    const mp = joinRoom(code, name);
    mpRef.current = mp;
    mp.onPlayersChanged = (p) => setPlayers(p);
    mp.onGameStart = () => setPhase('playing');
    setPhase('room');
  }, []);

  const handleStart = useCallback(() => {
    const mp = mpRef.current;
    if (!mp) return;
    mp.startGame();
    setPhase('playing');
  }, []);

  const handleLeave = useCallback(() => {
    mpRef.current?.destroy();
    mpRef.current = null;
    setPlayers([]);
    setPhase('lobby');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {phase === 'lobby' && (
        <GameLobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}
      {phase === 'room' && mpRef.current && (
        <GameRoom
          roomCode={mpRef.current.roomCode}
          isHost={mpRef.current.isHost}
          players={players}
          onStart={handleStart}
          onLeave={handleLeave}
        />
      )}
      {phase === 'playing' && mpRef.current && (
        <GameCanvas
          multiplayer={mpRef.current}
          playerCount={players.length}
          playerNames={players.map(p => p.name)}
        />
      )}
    </div>
  );
}

export default Game;
