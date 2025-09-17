import { useState } from "react";
import { CraftingHeader } from "@/components/CraftingHeader";
import { WalletConnection } from "@/components/WalletConnection";
import { RecipeGrid } from "@/components/RecipeGrid";
import { CraftingWorkspace } from "@/components/CraftingWorkspace";
import { CrafterRegistration } from "@/components/CrafterRegistration";
import { CraftingHistory } from "@/components/CraftingHistory";
import { RuneBackground } from "@/components/RuneBackground";
import { useAccount } from "wagmi";
import workshopHero from "@/assets/workshop-hero.jpg";

const Index = () => {
  const { isConnected } = useAccount();
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
          {!isConnected ? (
            <WalletConnection />
          ) : (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <RecipeGrid 
                    selectedRecipe={selectedRecipe}
                    onSelectRecipe={setSelectedRecipe}
                  />
                  <CraftingWorkspace selectedRecipe={selectedRecipe} />
                </div>
                <div className="lg:col-span-1 space-y-8">
                  <CrafterRegistration />
                  <CraftingHistory />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;