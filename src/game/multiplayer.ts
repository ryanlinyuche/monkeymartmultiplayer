import { supabase } from '@/integrations/supabase/client';
import { GameState, PlayerInput } from './types';
import { RealtimeChannel } from '@supabase/supabase-js';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export interface MultiplayerManager {
  channel: RealtimeChannel;
  roomCode: string;
  playerId: number;
  isHost: boolean;
  onStateUpdate: ((state: GameState) => void) | null;
  onPlayerInput: ((input: PlayerInput) => void) | null;
  onPlayersChanged: ((players: { id: number; name: string }[]) => void) | null;
  onGameStart: (() => void) | null;
  destroy: () => void;
  broadcastState: (state: GameState) => void;
  sendInput: (input: PlayerInput) => void;
  startGame: () => void;
}

export function createRoom(playerName: string): MultiplayerManager {
  const roomCode = generateRoomCode();
  return joinRoom(roomCode, playerName, true);
}

export function joinRoom(roomCode: string, playerName: string, isHost: boolean = false): MultiplayerManager {
  const channel = supabase.channel(`game:${roomCode}`, {
    config: { broadcast: { self: false } },
  });

  const manager: MultiplayerManager = {
    channel,
    roomCode,
    playerId: isHost ? 1 : 0, // will be assigned by host
    isHost,
    onStateUpdate: null,
    onPlayerInput: null,
    onPlayersChanged: null,
    onGameStart: null,
    destroy: () => {
      channel.unsubscribe();
    },
    broadcastState: (state: GameState) => {
      channel.send({
        type: 'broadcast',
        event: 'game_state',
        payload: { state },
      });
    },
    sendInput: (input: PlayerInput) => {
      channel.send({
        type: 'broadcast',
        event: 'player_input',
        payload: { input },
      });
    },
    startGame: () => {
      channel.send({
        type: 'broadcast',
        event: 'game_start',
        payload: {},
      });
    },
  };

  channel
    .on('broadcast', { event: 'game_state' }, ({ payload }) => {
      if (manager.onStateUpdate && payload.state) {
        manager.onStateUpdate(payload.state);
      }
    })
    .on('broadcast', { event: 'player_input' }, ({ payload }) => {
      if (manager.onPlayerInput && payload.input) {
        manager.onPlayerInput(payload.input);
      }
    })
    .on('broadcast', { event: 'game_start' }, () => {
      if (manager.onGameStart) {
        manager.onGameStart();
      }
    })
    .on('broadcast', { event: 'player_joined' }, ({ payload }) => {
      if (manager.onPlayersChanged && payload.players) {
        manager.onPlayersChanged(payload.players);
      }
    })
    .on('broadcast', { event: 'assign_id' }, ({ payload }) => {
      if (!isHost && payload.playerId) {
        manager.playerId = payload.playerId;
      }
    })
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const players: { id: number; name: string }[] = [];
      for (const key in presenceState) {
        const entries = presenceState[key] as any[];
        for (const entry of entries) {
          players.push({ id: entry.playerId, name: entry.playerName });
        }
      }
      if (manager.onPlayersChanged) {
        manager.onPlayersChanged(players);
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          playerId: isHost ? 1 : 0,
          playerName: playerName,
        });

        if (!isHost) {
          // Request ID assignment from host
          channel.send({
            type: 'broadcast',
            event: 'request_id',
            payload: { name: playerName },
          });
        }
      }
    });

  // Host listens for ID requests
  if (isHost) {
    let nextId = 2;
    channel.on('broadcast', { event: 'request_id' }, ({ payload }) => {
      const assignedId = nextId++;
      channel.send({
        type: 'broadcast',
        event: 'assign_id',
        payload: { playerId: assignedId, name: payload.name },
      });
    });
  }

  return manager;
}
