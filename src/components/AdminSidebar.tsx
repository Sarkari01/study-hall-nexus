
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  Calendar, 
  CreditCard, 
  ArrowRightLeft, 
  DollarSign, 
  MapPin, 
  UserPlus, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Users2,
  Settings,
  Code,
  Package,
  Gift,
  Wallet,
  Percent,
  Bell,
  LogOut,
  User,
  Shield
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  badge?: string;
  submenu?: Array<{
    id: string;
    label: string;
    badge?: string;
  }>;
}

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  expandedItems: string[];
  onToggleExpand: (itemId: string) => void;
}

const sidebarItems: AdminSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    id: "students",
    label: "Students",
    icon: <Users className="h-5 w-5" />,
    badge: "2,847"
  },
  {
    id: "merchants",
    label: "Merchants",
    icon: <Building2 className="h-5 w-5" />,
    badge: "156"
  },
  {
    id: "study-halls",
    label: "Study Halls",
    icon: <Calendar className="h-5 w-5" />,
    badge: "89"
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: <Package className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "subscription-plans",
        label: "Subscription Plans"
      },
      {
        id: "merchant-subscriptions",
        label: "Merchant Subscriptions",
        badge: "Active: 142"
      },
      {
        id: "payment-history",
        label: "Payment History"
      }
    ]
  },
  {
    id: "promotions",
    label: "Promotions & Rewards",
    icon: <Gift className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "coupons",
        label: "Coupon Management",
        badge: "12 Active"
      },
      {
        id: "reward-rules",
        label: "Reward Rules"
      },
      {
        id: "wallet-management",
        label: "Wallet Management"
      }
    ]
  },
  {
    id: "notifications",
    label: "Push Notifications",
    icon: <Bell className="h-5 w-5" />,
    badge: "New"
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <ArrowRightLeft className="h-5 w-5" />
  },
  {
    id: "settle-now",
    label: "Settle Now (Payouts)",
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    id: "locations",
    label: "Locations",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    id: "leads",
    label: "Leads",
    icon: <UserPlus className="h-5 w-5" />,
    badge: "24"
  },
  {
    id: "banners",
    label: "Banner Management",
    icon: <Megaphone className="h-5 w-5" />
  },
  {
    id: "community",
    label: "Community Feed",
    icon: <Users2 className="h-5 w-5" />
  },
  {
    id: "chat",
    label: "Chat System",
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    id: "ai-features",
    label: "AI Features",
    icon: <Code className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "ai-chatbot",
        label: "24/7 AI Assistant"
      },
      {
        id: "content-moderation",
        label: "Content Moderation"
      },
      {
        id: "smart-text-assistant",
        label: "Smart Text Assistant"
      },
      {
        id: "ai-analytics",
        label: "AI Analytics & Predictions"
      }
    ]
  },
  {
    id: "revenue",
    label: "Revenue Reports",
    icon: <TrendingUp className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "daily-revenue",
        label: "Daily Revenue"
      },
      {
        id: "weekly-revenue",
        label: "Weekly Revenue"
      },
      {
        id: "monthly-revenue",
        label: "Monthly Revenue"
      },
      {
        id: "merchant-revenue",
        label: "By Merchant"
      },
      {
        id: "location-revenue",
        label: "By Location"
      }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "general-settings",
        label: "General Settings"
      },
      {
        id: "developer-management",
        label: "Developer Management"
      }
    ]
  }
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onItemClick,
  expandedItems,
  onToggleExpand
}) => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    window.location.href = '/';
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 min-h-screen flex flex-col shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sarkari Ninja</h2>
            <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div key={item.id} className="group">
            {item.hasSubmenu ? (
              <Collapsible open={expandedItems.includes(item.id)} onOpenChange={() => onToggleExpand(item.id)}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-between text-left h-11 px-3 rounded-lg transition-all duration-200",
                      "hover:bg-slate-100 hover:text-slate-900",
                      expandedItems.includes(item.id) && "bg-slate-100 text-slate-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-600 group-hover:text-slate-700">
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-700 border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-slate-400">
                      {expandedItems.includes(item.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-2">
                  {item.submenu?.map((subItem) => (
                    <Button 
                      key={subItem.id} 
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm h-10 ml-6 pl-3 rounded-lg transition-all duration-200",
                        "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
                        activeItem === subItem.id && "bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm"
                      )} 
                      onClick={() => onItemClick(subItem.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{subItem.label}</span>
                        {subItem.badge && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {subItem.badge}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button 
                variant="ghost"
                className={cn(
                  "w-full justify-start h-11 px-3 rounded-lg transition-all duration-200",
                  "hover:bg-slate-100 hover:text-slate-900",
                  activeItem === item.id && "bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm"
                )} 
                onClick={() => onItemClick(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={cn(
                    "text-slate-600",
                    activeItem === item.id && "text-blue-600"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className={cn(
                      "text-xs border-0",
                      item.badge === "New" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            )}
            
            {/* Add separator after certain groups */}
            {(index === 3 || index === 7 || index === 12 || index === 16) && (
              <Separator className="my-4 bg-slate-200/60" />
            )}
          </div>
        ))}
      </div>

      {/* Admin Profile & Logout Section */}
      <div className="border-t border-slate-200/60 p-4 bg-slate-50/50">
        <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-white border border-slate-200/60 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-slate-500 truncate">
              admin@sarkarininja.com
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 shadow-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
