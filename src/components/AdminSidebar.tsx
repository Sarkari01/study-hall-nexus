
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sidebarItems, AdminSidebarItem } from "./AdminSidebar/sidebarItems";

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  expandedItems: string[];
  onToggleExpand: (itemId: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onItemClick,
  expandedItems,
  onToggleExpand
}) => {
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-72 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 flex-1">
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-emerald-700">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Building2 className="h-8 w-8 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-2xl">Sarkari Ninja</h2>
            <p className="text-emerald-200 text-xs font-semibold">Advanced Management System</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <Collapsible
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => onToggleExpand(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-left text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200",
                        expandedItems.includes(item.id) && "bg-white/10 text-white"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="text-emerald-300">{item.icon}</span>
                        <span className="ml-3 font-medium">{item.label}</span>
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-emerald-300" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map((subItem) => (
                      <Button
                        key={subItem.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm text-emerald-200 hover:bg-white/10 hover:text-white transition-all duration-200 pl-4",
                          activeItem === subItem.id &&
                            "bg-white text-emerald-900 hover:bg-white/90 shadow-sm font-semibold"
                        )}
                        onClick={() => onItemClick(subItem.id)}
                      >
                        <span className="text-current">{subItem.icon}</span>
                        <span className="ml-2">{subItem.label}</span>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200",
                    activeItem === item.id &&
                      "bg-white text-emerald-900 hover:bg-white/90 shadow-sm font-semibold"
                  )}
                  onClick={() => onItemClick(item.id)}
                >
                  <span className="text-current">{item.icon}</span>
                  <span className="ml-3 font-medium">{item.label}</span>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Logout Footer */}
      <div className="p-6 border-t border-emerald-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
