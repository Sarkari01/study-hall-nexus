
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, Store, Shield } from "lucide-react";
import { useSecureAuth } from '@/components/security/SecureAuthProvider';
import { SecureValidator, CSRFManager, AuditLogger } from '@/utils/securityEnhancements';

const SecureMerchantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rateLimiter, isSecurityInitialized } = useSecureAuth();

  useEffect(() => {
    if (isSecurityInitialized) {
      const token = CSRFManager.generateToken();
      setCsrfToken(token);
    }
  }, [isSecurityInitialized]);

  const handleSecureMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate input
    if (!SecureValidator.validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const sanitizedEmail = SecureValidator.sanitizeInput(email);
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(sanitizedEmail)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(sanitizedEmail) / 1000 / 60);
      setError(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    // Validate CSRF token
    if (!CSRFManager.validateToken(csrfToken)) {
      setError('Security validation failed. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting secure merchant login for:', sanitizedEmail);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (signInError) {
        console.error('Secure merchant login error:', signInError);
        
        // Log failed attempt
        await AuditLogger.logLogin(sanitizedEmail, false, 'password');
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        console.log('Secure merchant login successful:', data.user.id);
        
        // Log successful login
        await AuditLogger.logLogin(data.user.id, true, 'password');
        
        // Check if user has merchant role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, merchant_id')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.role !== 'merchant') {
          setError('Access denied. This account is not registered as a merchant.');
          await supabase.auth.signOut();
          
          // Log unauthorized access attempt
          await AuditLogger.logSuspiciousActivity(
            data.user.id,
            'unauthorized_merchant_access',
            { role: profile?.role }
          );
          return;
        }

        // Reset rate limiting on successful login
        rateLimiter.reset(sanitizedEmail);

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to merchant dashboard",
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Generate new CSRF token for next request
        const newToken = CSRFManager.generateToken();
        setCsrfToken(newToken);
        
        // Redirect to merchant dashboard
        navigate('/merchant', { replace: true });
      }
    } catch (error: any) {
      console.error('Unexpected secure merchant login error:', error);
      
      // Log unexpected errors as suspicious activity
      if (email) {
        await AuditLogger.logSuspiciousActivity(
          sanitizedEmail,
          'unexpected_login_error',
          { error: error.message }
        );
      }
      
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
              <h1 className="text-3xl font-bold text-blue-900">Secure Merchant Portal</h1>
              <p className="text-sm text-blue-700">Enhanced security for your business</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Secure Login
            </CardTitle>
            <p className="text-sm text-blue-600 text-center">
              Protected with enhanced security measures
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSecureMerchantLogin} className="space-y-4">
              <input type="hidden" name="csrf_token" value={csrfToken} />
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800">Business Email</Label>
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
                    maxLength={255}
                    autoComplete="username"
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
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-lg" 
                disabled={loading || !isSecurityInitialized}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isSecurityInitialized && <Shield className="mr-2 h-4 w-4" />}
                {loading ? 'Signing In...' : !isSecurityInitialized ? 'Initializing Security...' : 'Secure Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
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

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-blue-700">
            <Shield className="inline h-4 w-4 mr-1" />
            Protected by advanced security measures
          </p>
          <p className="text-xs text-blue-600">
            Enhanced authentication • Rate limiting • Audit logging
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureMerchantLogin;
