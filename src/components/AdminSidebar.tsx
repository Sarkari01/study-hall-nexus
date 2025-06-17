
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
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8 flex items-center gap-3">
          <Building2 className="h-10 w-10 text-blue-600" />
          <div>
            <h2 className="text-gray-900 font-extrabold text-3xl">Sarkari Ninja</h2>
            <p className="text-zinc-950 text-xs font-semibold">Advanced Management System</p>
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
                        "w-full justify-between text-left",
                        expandedItems.includes(item.id) && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map((subItem) => (
                      <Button
                        key={subItem.id}
                        variant={activeItem === subItem.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-sm",
                          activeItem === subItem.id &&
                            "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                        onClick={() => onItemClick(subItem.id)}
                      >
                        {subItem.label}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant={activeItem === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeItem === item.id &&
                      "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                  onClick={() => onItemClick(item.id)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Logout Footer */}
      <div className="p-6 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
