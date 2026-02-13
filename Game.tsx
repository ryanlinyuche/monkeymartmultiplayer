import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from './Player';
import { GameItem } from './GameItem';
import { GameControls } from './GameControls';

interface Position {
  x: number;
  y: number;
}

interface PlayerData {
  id: string;
  position: Position;
  direction: 'left' | 'right' | 'up' | 'down';
  carrying?: string;
  animal_type: 'monkey' | 'panda' | 'elephant' | 'lion';
}

interface GameState {
  players: Record<string, PlayerData>;
  items: Array<{ id: string; type: string; position: Position }>;
}

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    items: [],
  });
  const [playerId] = useState(() => crypto.randomUUID());
  const [selectedAnimal, setSelectedAnimal] = useState<'monkey' | 'panda' | 'elephant' | 'lion'>('monkey');
  const gameLoopRef = useRef<number>();

  // Initialize player
  useEffect(() => {
    const initializePlayer = async () => {
      const newPlayer: PlayerData = {
        id: playerId,
        position: { x: 400, y: 300 },
        direction: 'right',
        animal_type: selectedAnimal,
      };

      setGameState(prev => ({
        ...prev,
        players: { ...prev.players, [playerId]: newPlayer },
      }));

      // Broadcast initial state
      await supabase
        .channel('game-room')
        .send({
          type: 'broadcast',
          event: 'player-update',
          payload: newPlayer,
        });
    };

    initializePlayer();
  }, [playerId, selectedAnimal]);

  // Subscribe to game updates
  useEffect(() => {
    const channel = supabase.channel('game-room');

    channel
      .on('broadcast', { event: 'player-update' }, ({ payload }) => {
        setGameState(prev => ({
          ...prev,
          players: { ...prev.players, [payload.id]: payload },
        }));
      })
      .on('broadcast', { event: 'player-disconnect' }, ({ payload }) => {
        setGameState(prev => {
          const newPlayers = { ...prev.players };
          delete newPlayers[payload.id];
          return { ...prev, players: newPlayers };
        });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Handle movement
  const handleMove = async (direction: 'left' | 'right' | 'up' | 'down') => {
    setGameState(prev => {
      const player = prev.players[playerId];
      if (!player) return prev;

      const speed = 5;
      let newX = player.position.x;
      let newY = player.position.y;

      switch (direction) {
        case 'left':
          newX -= speed;
          break;
        case 'right':
          newX += speed;
          break;
        case 'up':
          newY -= speed;
          break;
        case 'down':
          newY += speed;
          break;
      }

      const updatedPlayer = {
        ...player,
        position: { x: newX, y: newY },
        direction,
      };

      // Broadcast movement
      supabase.channel('game-room').send({
        type: 'broadcast',
        event: 'player-update',
        payload: updatedPlayer,
      });

      return {
        ...prev,
        players: { ...prev.players, [playerId]: updatedPlayer },
      };
    });
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-green-100 to-green-200 overflow-hidden">
      {/* Game Canvas */}
      <div className="relative w-full h-full">
        {/* Render all players */}
        {Object.values(gameState.players).map(player => (
          <Player
            key={player.id}
            position={player.position}
            direction={player.direction}
            animalType={player.animal_type}
            carrying={player.carrying}
            isCurrentPlayer={player.id === playerId}
          />
        ))}

        {/* Render game items */}
        {gameState.items.map(item => (
          <GameItem
            key={item.id}
            type={item.type}
            position={item.position}
          />
        ))}
      </div>

      {/* Game Controls */}
      <GameControls onMove={handleMove} />

      {/* Animal Selection (top right) */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Choose Animal</h3>
        <div className="flex gap-2">
          {(['monkey', 'panda', 'elephant', 'lion'] as const).map(animal => (
            <button
              key={animal}
              onClick={() => setSelectedAnimal(animal)}
              className={`px-3 py-2 rounded transition-all ${
                selectedAnimal === animal
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {animal}
            </button>
          ))}
        </div>
      </div>

      {/* Player count */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <span className="text-sm font-semibold">
          Players: {Object.keys(gameState.players).length}
        </span>
      </div>
    </div>
  );
};
