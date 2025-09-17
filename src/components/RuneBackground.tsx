export const RuneBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mystical runes floating in background */}
      <div className="absolute top-20 left-10 text-6xl text-primary/10 animate-rune-glow font-mono">
        ᚱ
      </div>
      <div className="absolute top-40 right-20 text-8xl text-accent/10 animate-rune-glow font-mono delay-1000">
        ᚦ
      </div>
      <div className="absolute bottom-32 left-1/4 text-4xl text-primary/10 animate-rune-glow font-mono delay-2000">
        ᚠ
      </div>
      <div className="absolute bottom-20 right-1/3 text-7xl text-accent/10 animate-rune-glow font-mono delay-3000">
        ᚴ
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl text-primary/5 animate-rune-glow font-mono delay-4000">
        ᛟ
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-forge-flicker"></div>
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-forge-flicker delay-2000"></div>
      
      {/* Mystical particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-rune-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};