import { useState } from 'react';

interface GameRoomProps {
  roomCode: string;
  isHost: boolean;
  players: { id: number; name: string }[];
  onStart: () => void;
  onLeave: () => void;
}

export default function GameRoom({ roomCode, isHost, players, onStart, onLeave }: GameRoomProps) {
  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <h1 className="font-display text-4xl font-bold text-foreground">🐒 Monkey Mart 🐒</h1>

      <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="text-center">
          <p className="font-display font-bold text-sm text-muted-foreground">Room Code</p>
          <p className="font-mono text-4xl font-bold text-primary tracking-widest">{roomCode}</p>
          <p className="text-muted-foreground text-xs mt-1">Share this code with friends!</p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="font-display font-bold text-sm text-muted-foreground mb-2">
            Players ({players.length}/4)
          </p>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2"
              >
                <span className="text-lg">🐒</span>
                <span className="font-body font-bold text-foreground">{p.name}</span>
                {p.id === 1 && (
                  <span className="ml-auto text-xs bg-primary/20 text-primary font-display font-bold px-2 py-0.5 rounded-full">
                    HOST
                  </span>
                )}
              </div>
            ))}
            {players.length < 4 && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-dashed border-border">
                <span className="text-lg opacity-30">🐒</span>
                <span className="font-body text-muted-foreground text-sm">Waiting for player...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLeave}
            className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-display font-bold py-3 rounded-xl transition-colors"
          >
            Leave
          </button>
          {isHost && (
            <button
              onClick={onStart}
              disabled={players.length < 1}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-display font-bold py-3 rounded-xl transition-colors"
            >
              🎮 Start Game
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl px-4 py-2 text-sm font-body text-muted-foreground">
        Controls: <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">W</kbd>
        <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">A</kbd>
        <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">S</kbd>
        <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">D</kbd>
        <span className="mx-2">move</span>
        <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">E</kbd> / <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">Space</kbd>
        <span className="ml-1">interact</span>
      </div>
    </div>
  );
}
