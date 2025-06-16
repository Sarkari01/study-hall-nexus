
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { useDemoAccounts } from '@/hooks/useDemoAccounts';
import { useToast } from '@/hooks/use-toast';

const DemoAccountsManager = () => {
  const { createDemoAccounts, loading, error } = useDemoAccounts();
  const { toast } = useToast();

  const handleCreateDemoAccounts = async () => {
    try {
      const result = await createDemoAccounts();
      
      if (result?.success) {
        toast({
          title: "Success",
          description: "Demo admin accounts have been created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to create demo accounts",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create demo accounts. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Demo Admin Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Create demo admin accounts for testing:
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            <div>• superadmin@demo.com / SuperAdmin123!</div>
            <div>• admin@demo.com / Admin123!</div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCreateDemoAccounts} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>Creating Demo Accounts...</>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Demo Accounts
            </>
          )}
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This will create or verify demo admin accounts. Existing accounts will not be affected.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DemoAccountsManager;
