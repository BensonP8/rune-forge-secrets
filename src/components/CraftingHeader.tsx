import { Flame, Shield, Zap } from "lucide-react";

export const CraftingHeader = () => {
  return (
    <header className="border-b border-border bg-gradient-workshop backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-mystical rounded-lg flex items-center justify-center animate-rune-glow">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rune Forge Secrets</h1>
              <p className="text-muted-foreground text-sm">FHE-Encrypted Workshop</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Secure</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-4 bg-gradient-mystical bg-clip-text text-transparent">
            Craft Secrets Only You Control
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your recipes remain encrypted until completion. Master the ancient arts without revealing your methods.
          </p>
        </div>
      </div>
    </header>
  );
};