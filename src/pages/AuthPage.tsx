import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isValidRole, getRoleRoute, ValidRole } from '@/utils/roleValidation';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const { user, userRole, userProfile, isAuthReady, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Only attempt redirect once when conditions are met
    if (isAuthReady && user && !authLoading && !redirectAttempted) {
      console.log('Auth ready, checking for redirect...', { 
        user: !!user, 
        userRole: userRole?.name, 
        userProfile: !!userProfile 
      });
      
      setRedirectAttempted(true);
      
      // Try to determine the user's role for redirect
      let targetRole = userRole?.name || userProfile?.role;
      
      if (targetRole && isValidRole(targetRole)) {
        const targetRoute = getRoleRoute(targetRole as ValidRole);
        const from = location.state?.from?.pathname || targetRoute;
        
        console.log(`Redirecting ${targetRole} to ${from}`);
        
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      } else if (targetRole) {
        // If we have a role but it's not valid, log and redirect to a default
        console.warn('Invalid role detected:', targetRole, 'redirecting to student portal');
        navigate('/student', { replace: true });
      } else {
        // If no role determined yet, wait a bit more or redirect to default
        console.log('No role determined yet, waiting...');
        setTimeout(() => {
          if (!userRole && !userProfile?.role) {
            console.log('Still no role after wait, redirecting to student portal as fallback');
            navigate('/student', { replace: true });
          }
        }, 2000); // Wait 2 seconds for role to load
      }
    }
  }, [user, userRole, userProfile, isAuthReady, authLoading, navigate, location.state, redirectAttempted]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setRedirectAttempted(false);

    try {
      console.log('Attempting sign in for:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is initializing
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-green-700">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show loading while user profile is being loaded after authentication
  if (user && (authLoading || !redirectAttempted) && isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-green-700">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-green-600 p-3 rounded-2xl shadow-lg">
              <img 
                src="/lovable-uploads/a0f60459-3d97-4bba-9582-45a8b069134e.png" 
                alt="Sarkari Ninja Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-900">Sarkari Ninja</h1>
              <p className="text-sm text-green-700">Advanced Management System</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-green-900">Welcome Back</CardTitle>
            <p className="text-sm text-green-600 text-center">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 shadow-lg" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-green-700 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
