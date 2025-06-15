
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Package, CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    if (merchantId) {
      fetchSubscription();
    }
  }, [merchantId]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            billing_period,
            features,
            max_study_halls,
            max_cabins,
            has_analytics,
            has_chat_support
          )
        `)
        .eq('merchant_id', merchantId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data || null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch subscription details",
        variant: "destructive",
      });
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
    
    return ((totalDays - remainingDays) / totalDays) * 100;
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
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
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
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining();
  const progress = getSubscriptionProgress();

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Current Subscription</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(subscription.status)}
              <Badge variant={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{subscription.subscription_plans.name}</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{subscription.subscription_plans.price}
                <span className="text-sm text-gray-500">/{subscription.subscription_plans.billing_period}</span>
              </p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                <span>{new Date(subscription.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {daysRemaining <= 7 && daysRemaining > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Study Halls</span>
                <Badge variant="outline">
                  {subscription.subscription_plans.max_study_halls === -1 
                    ? 'Unlimited' 
                    : subscription.subscription_plans.max_study_halls}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Cabins per Hall</span>
                <Badge variant="outline">
                  {subscription.subscription_plans.max_cabins === -1 
                    ? 'Unlimited' 
                    : subscription.subscription_plans.max_cabins}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Analytics Dashboard</span>
                <Badge variant={subscription.subscription_plans.has_analytics ? "default" : "secondary"}>
                  {subscription.subscription_plans.has_analytics ? 'Included' : 'Not Available'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Chat Support</span>
                <Badge variant={subscription.subscription_plans.has_chat_support ? "default" : "secondary"}>
                  {subscription.subscription_plans.has_chat_support ? 'Included' : 'Not Available'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-renewal</p>
                <p className="text-sm text-gray-500">
                  {subscription.auto_renew 
                    ? 'Your subscription will automatically renew' 
                    : 'Auto-renewal is disabled'}
                </p>
              </div>
              <Badge variant={subscription.auto_renew ? "default" : "secondary"}>
                {subscription.auto_renew ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                View Payment History
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantSubscriptionStatus;
