
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDemoAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDemoAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-demo-accounts');

      if (error) {
        throw error;
      }

      console.log('Demo accounts creation result:', data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create demo accounts';
      setError(errorMessage);
      console.error('Error creating demo accounts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDemoAccounts,
    loading,
    error
  };
};
