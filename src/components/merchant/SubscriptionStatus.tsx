
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Package, CreditCard, AlertTriangle, CheckCircle, Clock, Crown, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionData {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  subscription_plans: {
    name: string;
    price: number;
    billing_period: string;
    features: any;
    max_study_halls: number | null;
    max_cabins: number | null;
    has_analytics: boolean;
    has_chat_support: boolean;
  };
}

interface MerchantSubscriptionStatusProps {
  merchantId: string;
}

const MerchantSubscriptionStatus: React.FC<MerchantSubscriptionStatusProps> = ({ merchantId }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (merchantId) {
      fetchSubscription();
    }
  }, [merchantId]);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, we'll show a mock subscription since the tables might not exist yet
      // In production, this would fetch from the actual database
      
      // Mock data for demonstration
      const mockSubscription = {
        id: '1',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        auto_renew: true,
        subscription_plans: {
          name: 'Professional Plan',
          price: 2499,
          billing_period: 'month',
          features: {
            priority_support: true,
            mobile_app: true,
            advanced_booking: true
          },
          max_study_halls: 5,
          max_cabins: 50,
          has_analytics: true,
          has_chat_support: true
        }
      };
      
      setSubscription(mockSubscription);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      setError('Unable to load subscription data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const endDate = new Date(subscription.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSubscriptionProgress = () => {
    if (!subscription) return 0;
    const startDate = new Date(subscription.start_date);
    const endDate = new Date(subscription.end_date);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = getDaysRemaining();
    
    return Math.max(0, Math.min(100, ((totalDays - remainingDays) / totalDays) * 100));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expired': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'cancelled': return <Clock className="h-5 w-5 text-gray-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Subscription Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Subscription Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No active subscription found. Please contact support to subscribe to a plan.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              Explore Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining();
  const progress = getSubscriptionProgress();

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="shadow-md border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Current Subscription</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(subscription.status)}
              <Badge variant={getStatusColor(subscription.status)} className="capitalize">
                {subscription.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-gray-900">{subscription.subscription_plans.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-green-600">₹{subscription.subscription_plans.price}</span>
                <span className="text-sm text-gray-500">/{subscription.subscription_plans.billing_period}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Premium Features Included</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% used</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                <span>{new Date(subscription.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {daysRemaining <= 7 && daysRemaining > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Your subscription expires in {daysRemaining} days. Please renew to avoid service interruption.
              </AlertDescription>
            </Alert>
          )}

          {daysRemaining <= 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription has expired. Please renew to restore access to all features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span>Plan Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Study Halls</span>
                <Badge variant="outline" className="bg-white">
                  {subscription.subscription_plans.max_study_halls === -1 
                    ? 'Unlimited' 
                    : subscription.subscription_plans.max_study_halls}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Cabins per Hall</span>
                <Badge variant="outline" className="bg-white">
                  {subscription.subscription_plans.max_cabins === -1 
                    ? 'Unlimited' 
                    : subscription.subscription_plans.max_cabins}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Analytics Dashboard</span>
                <Badge variant={subscription.subscription_plans.has_analytics ? "default" : "secondary"}>
                  {subscription.subscription_plans.has_analytics ? 'Included' : 'Not Available'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Chat Support</span>
                <Badge variant={subscription.subscription_plans.has_chat_support ? "default" : "secondary"}>
                  {subscription.subscription_plans.has_chat_support ? 'Included' : 'Not Available'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Settings */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Subscription Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-renewal</p>
                <p className="text-sm text-gray-600">
                  {subscription.auto_renew 
                    ? 'Your subscription will automatically renew' 
                    : 'Auto-renewal is disabled'}
                </p>
              </div>
              <Badge variant={subscription.auto_renew ? "default" : "secondary"} className="ml-4">
                {subscription.auto_renew ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-12">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </Button>
              <Button variant="outline" className="h-12">
                <Package className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantSubscriptionStatus;
