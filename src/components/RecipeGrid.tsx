import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, Sparkles, Flame, Zap, Sword } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  category: string;
  difficulty: "Novice" | "Adept" | "Master";
  isEncrypted: boolean;
  icon: any;
  description: string;
  materials?: number;
}

const recipes: Recipe[] = [
  {
    id: "1",
    name: "Shadowblade Essence",
    category: "Weapons",
    difficulty: "Master",
    isEncrypted: true,
    icon: Sword,
    description: "A legendary weapon essence that bends reality",
    materials: 7
  },
  {
    id: "2", 
    name: "Phoenix Elixir",
    category: "Potions",
    difficulty: "Adept",
    isEncrypted: true,
    icon: Flame,
    description: "Resurrection potion of immense power",
    materials: 5
  },
  {
    id: "3",
    name: "Lightning Rune",
    category: "Enchantments", 
    difficulty: "Novice",
    isEncrypted: false,
    icon: Zap,
    description: "Basic lightning enchantment for beginners",
    materials: 3
  },
  {
    id: "4",
    name: "Void Crystal",
    category: "Materials",
    difficulty: "Master",
    isEncrypted: true,
    icon: Sparkles,
    description: "Crystallized void energy - handle with extreme care",
    materials: 12
  }
];

interface RecipeGridProps {
  selectedRecipe: string | null;
  onSelectRecipe: (id: string) => void;
}

export const RecipeGrid = ({ selectedRecipe, onSelectRecipe }: RecipeGridProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Novice": return "bg-secondary text-secondary-foreground";
      case "Adept": return "bg-primary text-primary-foreground";
      case "Master": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Ancient Recipes</h3>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {recipes.length} Discovered
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {recipes.map((recipe) => {
          const IconComponent = recipe.icon;
          const isSelected = selectedRecipe === recipe.id;
          
          return (
            <Card
              key={recipe.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-mystical border-border bg-card ${
                isSelected ? "ring-2 ring-primary shadow-mystical" : ""
              } ${recipe.isEncrypted ? "bg-gradient-encrypted bg-[length:200%_200%] animate-encrypted-pulse" : ""}`}
              onClick={() => onSelectRecipe(recipe.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      recipe.isEncrypted ? "bg-accent/20" : "bg-primary/20"
                    }`}>
                      {recipe.isEncrypted ? (
                        <Lock className="w-5 h-5 text-accent" />
                      ) : (
                        <IconComponent className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {recipe.isEncrypted ? "██████████" : recipe.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {recipe.category}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                    {!recipe.isEncrypted && (
                      <Eye className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {recipe.isEncrypted ? "Recipe details encrypted until completion" : recipe.description}
                </p>
                
                {!recipe.isEncrypted && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Materials needed</span>
                    <span className="text-foreground font-medium">{recipe.materials}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};