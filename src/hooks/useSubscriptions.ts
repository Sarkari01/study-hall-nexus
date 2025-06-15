
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billing_period: string;
  validity_days: number;
  features: any;
  max_study_halls: number | null;
  max_cabins: number | null;
  has_analytics: boolean;
  has_chat_support: boolean;
  auto_renew_enabled: boolean;
  is_active: boolean;
  is_trial: boolean;
  trial_days: number;
  created_at: string;
}

interface MerchantSubscription {
  id: string;
  merchant_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  subscription_plans?: SubscriptionPlan;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<MerchantSubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('merchant_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans",
        variant: "destructive",
      });
    }
  };

  const assignSubscription = async (merchantId: string, planId: string, autoRenew: boolean = true) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validity_days);

      const { data, error } = await supabase
        .from('merchant_subscriptions')
        .insert({
          merchant_id: merchantId,
          plan_id: planId,
          end_date: endDate.toISOString(),
          auto_renew: autoRenew
        })
        .select(`
          *,
          subscription_plans (*)
        `)
        .single();

      if (error) throw error;

      setSubscriptions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Subscription assigned successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error assigning subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign subscription",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscriptions(), fetchPlans()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    subscriptions,
    plans,
    loading,
    fetchSubscriptions,
    fetchPlans,
    assignSubscription
  };
};
