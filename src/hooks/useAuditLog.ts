
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface AuditLogEntry {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
}

interface UseAuditLogReturn {
  logAction: (params: Omit<AuditLogEntry, 'id' | 'user_id' | 'timestamp'>) => Promise<void>;
  getAuditLogs: (filters?: {
    resource_type?: string;
    user_id?: string;
    action?: string;
    start_date?: string;
    end_date?: string;
  }) => Promise<AuditLogEntry[]>;
  loading: boolean;
}

export const useAuditLog = (): UseAuditLogReturn => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const logAction = async (params: Omit<AuditLogEntry, 'id' | 'user_id' | 'timestamp'>) => {
    if (!user) {
      console.warn('Cannot log audit action: User not authenticated');
      return;
    }

    try {
      setLoading(true);
      
      const auditEntry: Omit<AuditLogEntry, 'id'> = {
        ...params,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        session_id: generateSessionId()
      };

      const { error } = await supabase
        .from('audit_logs')
        .insert([auditEntry]);

      if (error) throw error;

      console.log('Audit log created:', auditEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't show toast for audit failures to avoid disrupting user experience
    } finally {
      setLoading(false);
    }
  };

  const getAuditLogs = async (filters?: {
    resource_type?: string;
    user_id?: string;
    action?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<AuditLogEntry[]> => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.start_date) {
        query = query.gte('timestamp', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('timestamp', filters.end_date);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as unknown as AuditLogEntry[];
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    logAction,
    getAuditLogs,
    loading
  };
};

// Helper functions
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
