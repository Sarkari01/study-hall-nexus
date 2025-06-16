
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ValidRole } from "@/utils/roleValidation";

interface RoleChangeAudit {
  user_id: string;
  changed_by: string;
  old_role: ValidRole | null;
  new_role: ValidRole;
  reason?: string;
}

export const useRoleAudit = () => {
  const { toast } = useToast();

  const logRoleChange = async (auditData: RoleChangeAudit) => {
    try {
      // For now, we'll log to console and show a toast
      // In a real application, you'd store this in an audit table
      console.log('Role Change Audit:', {
        timestamp: new Date().toISOString(),
        ...auditData
      });

      toast({
        title: "Role Change Logged",
        description: "Role change has been recorded for audit purposes.",
      });

      return true;
    } catch (error) {
      console.error('Error logging role change:', error);
      toast({
        title: "Audit Warning",
        description: "Role was changed but audit logging failed.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { logRoleChange };
};
