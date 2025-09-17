import { useState } from "react";
import { CraftingHeader } from "@/components/CraftingHeader";
import { WalletConnection } from "@/components/WalletConnection";
import { RecipeGrid } from "@/components/RecipeGrid";
import { CraftingWorkspace } from "@/components/CraftingWorkspace";
import { RuneBackground } from "@/components/RuneBackground";
import workshopHero from "@/assets/workshop-hero.jpg";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${workshopHero})` }}
      />
      
      <RuneBackground />
      
      <div className="relative z-10">
        <CraftingHeader />
        
        <main className="container mx-auto px-4 py-8">
          {!isWalletConnected ? (
            <WalletConnection onConnect={() => setIsWalletConnected(true)} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <RecipeGrid 
                selectedRecipe={selectedRecipe}
                onSelectRecipe={setSelectedRecipe}
              />
              <CraftingWorkspace selectedRecipe={selectedRecipe} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;