import { useState, useCallback } from 'react';
import GameLobby from '@/components/GameLobby';
import GameRoom from '@/components/GameRoom';
import GameCanvas from '@/components/GameCanvas';
import { createRoom, joinRoom, MultiplayerManager } from '@/game/multiplayer';

type Phase = 'lobby' | 'room' | 'playing';

const Index = () => {
  const [phase, setPhase] = useState<Phase>('lobby');
  const [manager, setManager] = useState<MultiplayerManager | null>(null);
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [myName, setMyName] = useState('');

  const handleCreateRoom = useCallback((name: string) => {
    setMyName(name);
    const mgr = createRoom(name);
    mgr.onPlayersChanged = (p) => setPlayers(p);
    mgr.onGameStart = () => setPhase('playing');
    setManager(mgr);
    setPlayers([{ id: 1, name }]);
    setPhase('room');
  }, []);

  const handleJoinRoom = useCallback((code: string, name: string) => {
    setMyName(name);
    const mgr = joinRoom(code, name);
    mgr.onPlayersChanged = (p) => setPlayers(p);
    mgr.onGameStart = () => setPhase('playing');
    setManager(mgr);
    setPhase('room');
  }, []);

  const handleStart = useCallback(() => {
    if (!manager) return;
    manager.startGame();
    setPhase('playing');
  }, [manager]);

  const handleLeave = useCallback(() => {
    if (manager) manager.destroy();
    setManager(null);
    setPlayers([]);
    setPhase('lobby');
  }, [manager]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-6 px-4">
      {phase === 'lobby' && (
        <GameLobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}
      {phase === 'room' && manager && (
        <GameRoom
          roomCode={manager.roomCode}
          isHost={manager.isHost}
          players={players}
          onStart={handleStart}
          onLeave={handleLeave}
        />
      )}
      {phase === 'playing' && manager && (
        <GameCanvas
          multiplayer={manager}
          playerCount={players.length}
          playerNames={players.map(p => p.name)}
        />
      )}
    </div>
  );
};

export default Index;
