import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { History, Eye, Lock, CheckCircle, XCircle, Clock } from 'lucide-react';
import { decryptNumber } from '@/lib/fhe-utils';

interface CraftingRecord {
  id: string;
  recipeId: number;
  sessionId: number;
  success: boolean;
  manaSpent: string; // Encrypted
  experienceGained: string; // Encrypted
  timestamp: number;
  txHash: string;
  isDecrypted: boolean;
}

export const CraftingHistory = () => {
  const { address } = useAccount();
  const [records, setRecords] = useState<CraftingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [decryptedData, setDecryptedData] = useState<Record<string, any>>({});

  // Mock data for demonstration
  useEffect(() => {
    if (address) {
      setIsLoading(true);
      // Simulate loading crafting history
      setTimeout(() => {
        const mockRecords: CraftingRecord[] = [
          {
            id: '1',
            recipeId: 1,
            sessionId: 1001,
            success: true,
            manaSpent: '0x0000000000000000000000000000000000000000000000000000000000000032', // 50
            experienceGained: '0x0000000000000000000000000000000000000000000000000000000000000005', // 5
            timestamp: Date.now() - 3600000,
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            isDecrypted: false,
          },
          {
            id: '2',
            recipeId: 2,
            sessionId: 1002,
            success: false,
            manaSpent: '0x0000000000000000000000000000000000000000000000000000000000000028', // 40
            experienceGained: '0x0000000000000000000000000000000000000000000000000000000000000002', // 2
            timestamp: Date.now() - 7200000,
            txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            isDecrypted: false,
          },
        ];
        setRecords(mockRecords);
        setIsLoading(false);
      }, 1000);
    }
  }, [address]);

  const decryptRecord = async (recordId: string, encryptedData: string) => {
    try {
      const decrypted = await decryptNumber(encryptedData);
      setDecryptedData(prev => ({
        ...prev,
        [recordId]: decrypted,
      }));
      
      // Update record to show as decrypted
      setRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, isDecrypted: true }
          : record
      ));
    } catch (error) {
      console.error('Failed to decrypt record:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (!address) {
    return (
      <Card className="bg-card border-border shadow-forge">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Lock className="w-12 h-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">Connect Wallet Required</h4>
          <p className="text-muted-foreground">
            Please connect your wallet to view crafting history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-forge">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <History className="w-5 h-5 text-primary" />
          <span>Crafting History</span>
        </CardTitle>
        <CardDescription>
          Your encrypted crafting records stored on-chain
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No crafting history found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start crafting to see your encrypted records here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {record.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-semibold text-foreground">
                      Recipe #{record.recipeId}
                    </span>
                    <Badge variant={record.success ? "default" : "destructive"}>
                      {record.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(record.timestamp)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Mana Spent</span>
                    <div className="flex items-center space-x-2">
                      {record.isDecrypted ? (
                        <span className="text-foreground font-semibold">
                          {decryptedData[record.id] || 'Decrypting...'}
                        </span>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Encrypted</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => decryptRecord(record.id, record.manaSpent)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Decrypt
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Experience</span>
                    <div className="flex items-center space-x-2">
                      {record.isDecrypted ? (
                        <span className="text-foreground font-semibold">
                          +{decryptedData[record.id] || 'Decrypting...'}
                        </span>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Encrypted</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => decryptRecord(record.id, record.experienceGained)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Decrypt
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Session ID: {record.sessionId}</span>
                    <span>TX: {truncateHash(record.txHash)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {records.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Records</span>
              <span className="text-foreground font-semibold">{records.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Successful Crafts</span>
              <span className="text-foreground font-semibold">
                {records.filter(r => r.success).length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
