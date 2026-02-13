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
  return setupChannel(roomCode, playerName, true);
}

export function joinRoom(roomCode: string, playerName: string): MultiplayerManager {
  return setupChannel(roomCode, playerName, false);
}

function setupChannel(roomCode: string, playerName: string, isHost: boolean): MultiplayerManager {
  const channel = supabase.channel(`game:${roomCode}`, {
    config: { broadcast: { self: false } },
  });

  let nextId = 2; // host uses this to assign IDs

  const manager: MultiplayerManager = {
    channel,
    roomCode,
    playerId: isHost ? 1 : 0,
    isHost,
    onStateUpdate: null,
    onPlayerInput: null,
    onPlayersChanged: null,
    onGameStart: null,
    destroy: () => {
      channel.unsubscribe();
    },
    broadcastState: (state: GameState) => {
      channel.send({ type: 'broadcast', event: 'game_state', payload: { state } });
    },
    sendInput: (input: PlayerInput) => {
      channel.send({ type: 'broadcast', event: 'player_input', payload: { input } });
    },
    startGame: () => {
      channel.send({ type: 'broadcast', event: 'game_start', payload: {} });
    },
  };

  // Register ALL listeners before subscribing to avoid race conditions
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
      if (manager.onGameStart) manager.onGameStart();
    })
    .on('broadcast', { event: 'assign_id' }, ({ payload }) => {
      if (!isHost && payload.playerId) {
        manager.playerId = payload.playerId;
        console.log('[MP] Assigned player ID:', payload.playerId);
      }
    })
    .on('broadcast', { event: 'request_id' }, ({ payload }) => {
      if (isHost) {
        const assignedId = nextId++;
        console.log('[MP] Host assigning ID', assignedId, 'to', payload.name);
        channel.send({
          type: 'broadcast',
          event: 'assign_id',
          payload: { playerId: assignedId, name: payload.name },
        });
        // Also broadcast updated presence
        setTimeout(() => {
          const presenceState = channel.presenceState();
          const players: { id: number; name: string }[] = [];
          for (const key in presenceState) {
            const entries = presenceState[key] as any[];
            for (const entry of entries) {
              players.push({ id: entry.playerId || assignedId, name: entry.playerName });
            }
          }
          if (manager.onPlayersChanged) manager.onPlayersChanged(players);
        }, 500);
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
      console.log('[MP] Presence sync:', players);
      if (manager.onPlayersChanged) manager.onPlayersChanged(players);
    });

  // NOW subscribe after all listeners are set up
  channel.subscribe(async (status) => {
    console.log('[MP] Channel status:', status);
    if (status === 'SUBSCRIBED') {
      await channel.track({
        playerId: isHost ? 1 : 0,
        playerName: playerName,
      });

      if (!isHost) {
        // Small delay to ensure host listeners are ready
        setTimeout(() => {
          channel.send({
            type: 'broadcast',
            event: 'request_id',
            payload: { name: playerName },
          });
        }, 300);
      }
    }
  });

  return manager;
}
