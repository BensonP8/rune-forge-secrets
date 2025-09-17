import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCraftingContract, useCrafterProfile } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { User, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const CrafterRegistration = () => {
  const { address, isConnected } = useAccount();
  const { registerCrafter, isPending } = useCraftingContract();
  const { profile, isLoading } = useCrafterProfile();
  
  const [crafterName, setCrafterName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!crafterName.trim()) {
      toast.error("Please enter a crafter name");
      return;
    }

    try {
      setIsRegistering(true);
      await registerCrafter(crafterName.trim());
      toast.success("Successfully registered as a crafter!");
      setCrafterName('');
    } catch (error) {
      console.error('Failed to register crafter:', error);
      toast.error("Failed to register as crafter");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-card border-border shadow-forge">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">Connect Wallet Required</h4>
          <p className="text-muted-foreground">
            Please connect your wallet to register as a crafter
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-forge">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading crafter profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (profile && profile.isActive) {
    return (
      <Card className="bg-card border-border shadow-forge">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <User className="w-5 h-5 text-primary" />
            <span>Crafter Profile</span>
          </CardTitle>
          <CardDescription>
            Your crafting profile and statistics
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Name</Label>
              <p className="text-foreground font-semibold">{profile.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Level</Label>
              <p className="text-foreground font-semibold">{profile.level}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Experience</Label>
              <p className="text-foreground font-semibold">{profile.experience}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Reputation</Label>
              <p className="text-foreground font-semibold">{profile.reputation}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Total Crafts</Label>
              <p className="text-foreground font-semibold">{profile.totalCrafts}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Successful Crafts</Label>
              <p className="text-foreground font-semibold">{profile.successfulCrafts}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">Registered Crafter</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-forge">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          <span>Register as Crafter</span>
        </CardTitle>
        <CardDescription>
          Join the Rune Forge Secrets community and start crafting encrypted recipes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crafterName">Crafter Name</Label>
          <Input
            id="crafterName"
            value={crafterName}
            onChange={(e) => setCrafterName(e.target.value)}
            placeholder="Enter your crafter name"
            disabled={isRegistering || isPending}
          />
        </div>
        
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground">Benefits of Registration:</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Track your crafting progress and experience</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Build reputation in the community</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Access to exclusive recipes and materials</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>FHE-encrypted profile data for privacy</span>
            </li>
          </ul>
        </div>
        
        <Button
          onClick={handleRegister}
          disabled={isRegistering || isPending || !crafterName.trim()}
          variant="mystical"
          className="w-full"
        >
          {isRegistering || isPending ? "Registering..." : "Register as Crafter"}
        </Button>
      </CardContent>
    </Card>
  );
};
