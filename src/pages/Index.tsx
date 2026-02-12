import GameCanvas from '@/components/GameCanvas';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-6 px-4">
      <h1 className="font-display text-4xl font-bold text-foreground mb-1">
        🐒 Monkey Mart 🐒
      </h1>
      <p className="text-muted-foreground font-body mb-4 text-sm">
        Multiplayer Edition — Stock the shelves, serve the customers!
      </p>
      <GameCanvas />
    </div>
  );
};

export default Index;
