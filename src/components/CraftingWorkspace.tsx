import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Flame, Sparkles, Clock, Lock } from "lucide-react";
import { useState } from "react";

interface CraftingWorkspaceProps {
  selectedRecipe: string | null;
}

export const CraftingWorkspace = ({ selectedRecipe }: CraftingWorkspaceProps) => {
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [isCrafting, setIsCrafting] = useState(false);

  const startCrafting = () => {
    setIsCrafting(true);
    setCraftingProgress(0);
    
    const interval = setInterval(() => {
      setCraftingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCrafting(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
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
            
            <Button
              onClick={startCrafting}
              disabled={isCrafting}
              variant="mystical"
              size="lg"
              className="w-full"
            >
              {isCrafting ? "Crafting in Progress..." : "Begin Stealth Craft"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};