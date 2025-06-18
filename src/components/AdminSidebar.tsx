
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, ChevronDown, ChevronRight, LogOut, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sidebarItems, AdminSidebarItem } from "./AdminSidebar/sidebarItems";

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  expandedItems: string[];
  onToggleExpand: (itemId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onItemClick,
  expandedItems,
  onToggleExpand,
  collapsed = false,
  onToggleCollapse
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

  const handleItemClick = (itemId: string, hasSubmenu: boolean = false) => {
    console.log('Clicked item:', itemId, 'Has submenu:', hasSubmenu, 'Collapsed:', collapsed);
    
    if (hasSubmenu) {
      // Always toggle expansion for items with submenus, regardless of collapsed state
      onToggleExpand(itemId);
    } else {
      // Navigate to the item if it doesn't have a submenu
      onItemClick(itemId);
    }
  };

  const handleSubItemClick = (itemId: string) => {
    console.log('Clicked sub-item:', itemId);
    onItemClick(itemId);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-green-600 via-green-700 to-green-800 text-white flex flex-col shadow-2xl relative w-full">
      {/* Mobile Close Button */}
      {onToggleCollapse && !collapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-white/20 text-green-50 lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
        {/* Logo Section */}
        <div className={cn(
          "mb-6 lg:mb-8 flex items-center gap-3 pb-4 lg:pb-6 border-b border-green-500/30 transition-all duration-300",
          collapsed && "justify-center"
        )}>
          <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/10">
            <Building2 className={cn("text-green-50", collapsed ? "h-6 w-6" : "h-8 w-8")} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-white font-extrabold text-lg lg:text-2xl truncate drop-shadow-sm">Sarkari Ninja</h2>
              <p className="text-green-100 text-xs font-semibold hidden sm:block opacity-90">Advanced Management System</p>
            </div>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className="space-y-1 lg:space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <Collapsible
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => handleItemClick(item.id, true)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full text-left text-green-50 hover:bg-white/15 hover:text-white transition-all duration-200 rounded-xl border border-transparent",
                        collapsed ? "justify-center px-2 h-10" : "justify-between h-10 lg:h-12",
                        expandedItems.includes(item.id) && "bg-white/15 text-white border-white/10 shadow-lg"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center min-w-0">
                        <span className="text-green-200 flex-shrink-0 text-lg lg:text-xl">{item.icon}</span>
                        {!collapsed && <span className="ml-2 lg:ml-3 font-medium truncate text-sm lg:text-base">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        expandedItems.includes(item.id) ? (
                          <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-green-200 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 text-green-200 flex-shrink-0" />
                        )
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden transition-all duration-200">
                    {!collapsed && (
                      <div className="ml-4 lg:ml-6 mt-1 space-y-1">
                        {item.submenu?.map((subItem) => (
                          <Button
                            key={subItem.id}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-xs lg:text-sm text-green-100 hover:bg-white/15 hover:text-white transition-all duration-200 pl-3 lg:pl-4 h-8 lg:h-10 rounded-lg",
                              activeItem === subItem.id &&
                                "bg-white text-green-700 hover:bg-white/90 shadow-md font-semibold border border-white/20"
                            )}
                            onClick={() => handleSubItemClick(subItem.id)}
                          >
                            <span className="text-current flex-shrink-0">{subItem.icon}</span>
                            <span className="ml-2 truncate">{subItem.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-green-50 hover:bg-white/15 hover:text-white transition-all duration-200 rounded-xl border border-transparent",
                    collapsed ? "justify-center px-2 h-10" : "justify-start h-10 lg:h-12",
                    activeItem === item.id &&
                      "bg-white text-green-700 hover:bg-white/90 shadow-md font-semibold border border-white/20"
                  )}
                  onClick={() => handleItemClick(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-current flex-shrink-0 text-lg lg:text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-2 lg:ml-3 font-medium truncate text-sm lg:text-base">{item.label}</span>}
                </Button>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Logout Footer */}
      <div className="p-4 lg:p-6 border-t border-green-500/30">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-red-200 hover:text-red-100 hover:bg-red-500/20 transition-all duration-200 h-10 lg:h-12 rounded-xl border border-transparent hover:border-red-400/30",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-2 lg:ml-3 text-sm lg:text-base">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
