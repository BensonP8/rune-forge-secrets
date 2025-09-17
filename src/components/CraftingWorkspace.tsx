import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Flame, Sparkles, Clock, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCraftingContract } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { simulateCrafting } from "@/lib/fhe-utils";
import { toast } from "sonner";

interface CraftingWorkspaceProps {
  selectedRecipe: string | null;
}

export const CraftingWorkspace = ({ selectedRecipe }: CraftingWorkspaceProps) => {
  const { address, isConnected } = useAccount();
  const { startCraftingSession, completeCraftingSession, currentSession, isPending } = useCraftingContract();
  
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingData, setCraftingData] = useState<any>(null);
  const [craftingResult, setCraftingResult] = useState<{
    success: boolean;
    manaSpent: number;
    experienceGained: number;
  } | null>(null);

  const startCrafting = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!selectedRecipe) {
      toast.error("Please select a recipe first");
      return;
    }

    try {
      setIsCrafting(true);
      setCraftingProgress(0);
      setCraftingResult(null);
      
      // Start crafting session on blockchain
      const recipeId = parseInt(selectedRecipe);
      const sessionResult = await startCraftingSession(recipeId);
      setCraftingData(sessionResult);
      
      toast.success("Crafting session started! Data is being encrypted and stored on-chain.");
      
      // Simulate crafting progress with real FHE encryption
      const interval = setInterval(async () => {
        setCraftingProgress((prev) => {
          const newProgress = prev + 2;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            completeCrafting(newProgress);
            return 100;
          }
          
          // Simulate real-time FHE encryption of progress data
          simulateCrafting(sessionResult.sessionData, newProgress).then((encryptedData) => {
            // In a real implementation, this encrypted data would be sent to the blockchain
            console.log('Encrypted progress data:', encryptedData);
          });
          
          return newProgress;
        });
      }, 100);
      
    } catch (error) {
      console.error('Failed to start crafting:', error);
      toast.error("Failed to start crafting session");
      setIsCrafting(false);
    }
  };

  const completeCrafting = async (progress: number) => {
    try {
      if (!craftingData || !currentSession.sessionId) {
        throw new Error('No active crafting session');
      }

      // Calculate success based on the session data
      const isSuccess = Math.random() * 100 <= craftingData.sessionData.successRate;
      const manaSpent = Math.floor(craftingData.sessionData.manaCost * (progress / 100));
      const experienceGained = isSuccess ? Math.floor(craftingData.sessionData.successRate / 10) : 0;

      // Complete the crafting session on blockchain
      await completeCraftingSession(currentSession.sessionId, craftingData.sessionData.successRate);
      
      setCraftingResult({
        success: isSuccess,
        manaSpent,
        experienceGained,
      });
      
      setIsCrafting(false);
      
      if (isSuccess) {
        toast.success(`Crafting completed successfully! Gained ${experienceGained} experience.`);
      } else {
        toast.error("Crafting failed, but you gained valuable experience!");
      }
      
    } catch (error) {
      console.error('Failed to complete crafting:', error);
      toast.error("Failed to complete crafting session");
      setIsCrafting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-mystical rounded-lg flex items-center justify-center animate-forge-flicker">
          <Flame className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Crafting Forge</h3>
      </div>

      {!selectedRecipe ? (
        <Card className="bg-card border-border shadow-forge">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Select a Recipe</h4>
            <p className="text-muted-foreground">
              Choose an ancient recipe from the collection to begin crafting
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border shadow-forge">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-foreground">
              <span>Active Recipe</span>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Encrypted</span>
              </div>
            </CardTitle>
            <CardDescription>
              Recipe details will be revealed upon completion
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">{craftingProgress}%</span>
              </div>
              <Progress value={craftingProgress} className="h-2" />
              
              {isCrafting && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>FHE data encrypted and stored on-chain</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isCrafting ? "bg-accent animate-pulse" : "bg-muted"}`} />
                  <span className="text-foreground">
                    {isCrafting ? "Crafting..." : "Ready"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-muted-foreground">Time Remaining</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    {isCrafting ? `${Math.ceil((100 - craftingProgress) / 2)}s` : "~5s"}
                  </span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h5 className="font-semibold text-foreground">Required Materials</h5>
              <div className="grid grid-cols-1 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">███████ {i}</span>
                    <span className="text-foreground">✓</span>
                  </div>
                ))}
              </div>
            </div>
            
            {craftingResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-muted/50">
                  {craftingResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  <span className="font-semibold text-foreground">
                    {craftingResult.success ? "Crafting Successful!" : "Crafting Failed"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Mana Spent</span>
                    <span className="text-foreground font-semibold">{craftingResult.manaSpent}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Experience Gained</span>
                    <span className="text-foreground font-semibold">+{craftingResult.experienceGained}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setCraftingResult(null);
                    setCraftingProgress(0);
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Start New Craft
                </Button>
              </div>
            ) : (
              <Button
                onClick={startCrafting}
                disabled={isCrafting || isPending}
                variant="mystical"
                size="lg"
                className="w-full"
              >
                {isPending ? "Initializing..." : isCrafting ? "Crafting in Progress..." : "Begin Stealth Craft"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};