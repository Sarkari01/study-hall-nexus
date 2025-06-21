import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, Store } from "lucide-react";

const MerchantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting merchant login for:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        console.error('Merchant login error:', signInError);
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        console.log('Merchant login successful:', data.user.id);
        
        // Check if user has merchant role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, merchant_id')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.role !== 'merchant') {
          setError('Access denied. This account is not registered as a merchant.');
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to merchant dashboard",
        });
        
        setEmail('');
        setPassword('');
        
        // Redirect to merchant dashboard
        navigate('/merchant', { replace: true });
      }
    } catch (error: any) {
      console.error('Unexpected merchant login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Merchant Portal</h1>
              <p className="text-sm text-blue-700">Manage your study halls</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900">Merchant Login</CardTitle>
            <p className="text-sm text-blue-600 text-center">
              Access your business dashboard
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleMerchantLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your business email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-lg" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In to Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button 
                variant="link" 
                onClick={() => navigate('/merchant-signup')}
                className="text-blue-600 hover:text-blue-700"
              >
                New merchant? Create account
              </Button>
              <br />
              <Button 
                variant="link" 
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-700"
              >
                Back to main login
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-blue-700 mt-6">
          Need help? Contact our merchant support team.
        </p>
      </div>
    </div>
  );
};

export default MerchantLogin;
