import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface WalletConnectionProps {
  onConnect?: () => void;
}

export const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md bg-card border-2 border-primary/30 shadow-mystical backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-mystical rounded-full flex items-center justify-center animate-rune-glow">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-foreground">Connect Your Wallet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Secure access to the Rune Forge Secrets requires wallet authentication
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>FHE-encrypted recipes</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Your crafting secrets stay private</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            {/* FHE Security Badge */}
            <Badge variant="outline" className="holographic-border glow-primary">
              <Shield className="h-3 w-3 mr-1" />
              FHE Secured
            </Badge>
            
            {/* Wallet Connection Button */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={() => {
                              openConnectModal();
                              onConnect?.();
                            }}
                            variant="mystical"
                            size="lg"
                            className="w-full"
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button 
                            onClick={openChainModal} 
                            variant="destructive"
                            size="lg"
                            className="w-full"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="flex flex-col items-center gap-2 w-full">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            className="w-full"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By connecting, you agree to keep your crafting secrets safe
          </p>
        </CardContent>
      </Card>
    </div>
  );
};