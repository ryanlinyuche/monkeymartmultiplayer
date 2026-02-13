import { useState } from 'react';

interface GameLobbyProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (code: string, name: string) => void;
}

export default function GameLobby({ onCreateRoom, onJoinRoom }: GameLobbyProps) {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'menu' | 'join'>('menu');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateRoom(name.trim());
  };

  const handleJoin = () => {
    if (!name.trim() || !joinCode.trim()) return;
    onJoinRoom(joinCode.trim().toUpperCase(), name.trim());
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <h1 className="font-display text-5xl font-bold text-foreground">🐒 Monkey Mart 🐒</h1>
      <p className="text-muted-foreground font-body text-center">
        Online Co-op — Work together to run your market!
      </p>

      <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-4">
        <div>
          <label className="font-display font-bold text-sm text-muted-foreground">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={16}
            className="w-full mt-1 px-4 py-3 bg-muted rounded-xl border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {mode === 'menu' ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-display font-bold py-3 rounded-xl transition-colors text-lg"
            >
              🏪 Create Room
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display font-bold py-3 rounded-xl transition-colors text-lg"
            >
              🔗 Join Room
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="font-display font-bold text-sm text-muted-foreground">Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABCD"
                maxLength={4}
                className="w-full mt-1 px-4 py-3 bg-muted rounded-xl border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMode('menu')}
                className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-display font-bold py-3 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleJoin}
                disabled={!name.trim() || joinCode.length < 4}
                className="flex-1 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-secondary-foreground font-display font-bold py-3 rounded-xl transition-colors"
              >
                Join →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-muted-foreground text-xs font-body space-y-1">
        <p>🎮 2-4 players cooperate to run one market</p>
        <p>🌱 Buy plots to grow fruit, stock shelves, man the cashier!</p>
      </div>
    </div>
  );
}
