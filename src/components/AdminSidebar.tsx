import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Building2, Calendar, ArrowRightLeft, DollarSign, MapPin, UserPlus, TrendingUp, ChevronDown, ChevronRight, LayoutDashboard, Megaphone, MessageSquare, Users2, Settings, Code, Package, Gift, Wallet, Percent, Bell, LogOut, User, BookOpen } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: Array<{
    id: string;
    label: string;
  }>;
}

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  expandedItems: string[];
  onToggleExpand: (itemId: string) => void;
}

const sidebarItems: AdminSidebarItem[] = [{
  id: "dashboard",
  label: "Dashboard",
  icon: <LayoutDashboard className="h-5 w-5" />
}, {
  id: "students",
  label: "Students",
  icon: <Users className="h-5 w-5" />
}, {
  id: "merchants",
  label: "Merchants",
  icon: <Building2 className="h-5 w-5" />
}, {
  id: "study-halls",
  label: "Study Halls",
  icon: <Calendar className="h-5 w-5" />
}, {
  id: "bookings",
  label: "Bookings",
  icon: <BookOpen className="h-5 w-5" />
}, {
  id: "subscriptions",
  label: "Subscription Management",
  icon: <Package className="h-5 w-5" />,
  hasSubmenu: true,
  submenu: [{
    id: "subscription-plans",
    label: "Subscription Plans"
  }, {
    id: "merchant-subscriptions",
    label: "Merchant Subscriptions"
  }, {
    id: "payment-history",
    label: "Payment History"
  }]
}, {
  id: "promotions",
  label: "Promotions & Rewards",
  icon: <Gift className="h-5 w-5" />,
  hasSubmenu: true,
  submenu: [{
    id: "coupons",
    label: "Coupon Management"
  }, {
    id: "reward-rules",
    label: "Reward Rules"
  }, {
    id: "wallet-management",
    label: "Wallet Management"
  }]
}, {
  id: "notifications",
  label: "Push Notifications",
  icon: <Bell className="h-5 w-5" />
}, {
  id: "transactions",
  label: "Transactions",
  icon: <ArrowRightLeft className="h-5 w-5" />
}, {
  id: "settle-now",
  label: "Settle Now (Payouts)",
  icon: <DollarSign className="h-5 w-5" />
}, {
  id: "locations",
  label: "Locations",
  icon: <MapPin className="h-5 w-5" />
}, {
  id: "leads",
  label: "Leads",
  icon: <UserPlus className="h-5 w-5" />
}, {
  id: "banners",
  label: "Banner Management",
  icon: <Megaphone className="h-5 w-5" />
}, {
  id: "community",
  label: "Community Feed",
  icon: <Users2 className="h-5 w-5" />
}, {
  id: "chat",
  label: "Chat System",
  icon: <MessageSquare className="h-5 w-5" />
}, {
  id: "ai-features",
  label: "AI Features",
  icon: <Code className="h-5 w-5" />,
  hasSubmenu: true,
  submenu: [{
    id: "ai-chatbot",
    label: "24/7 AI Assistant"
  }, {
    id: "content-moderation",
    label: "Content Moderation"
  }, {
    id: "smart-text-assistant",
    label: "Smart Text Assistant"
  }, {
    id: "ai-analytics",
    label: "AI Analytics & Predictions"
  }]
}, {
  id: "revenue",
  label: "Our Revenue (Reports)",
  icon: <TrendingUp className="h-5 w-5" />,
  hasSubmenu: true,
  submenu: [{
    id: "daily-revenue",
    label: "Daily Revenue"
  }, {
    id: "weekly-revenue",
    label: "Weekly Revenue"
  }, {
    id: "monthly-revenue",
    label: "Monthly Revenue"
  }, {
    id: "merchant-revenue",
    label: "By Merchant"
  }, {
    id: "location-revenue",
    label: "By Location"
  }]
}, {
  id: "settings",
  label: "Settings",
  icon: <Settings className="h-5 w-5" />,
  hasSubmenu: true,
  submenu: [{
    id: "general-settings",
    label: "General Settings"
  }, {
    id: "developer-management",
    label: "Developer Management"
  }]
}];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onItemClick,
  expandedItems,
  onToggleExpand
}) => {
  const {
    toast
  } = useToast();
  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    // In a real app, you would clear the session and redirect
    window.location.href = '/';
  };
  return <div className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-gray-900 font-bold text-4xl">Sarkari Ninja</h2>
          <p className="text-sm text-gray-600">Advanced Management System</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarItems.map(item => <div key={item.id}>
              {item.hasSubmenu ? <Collapsible open={expandedItems.includes(item.id)} onOpenChange={() => onToggleExpand(item.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className={cn("w-full justify-between text-left", expandedItems.includes(item.id) && "bg-gray-100")}>
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {expandedItems.includes(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map(subItem => <Button key={subItem.id} variant={activeItem === subItem.id ? "default" : "ghost"} className={cn("w-full justify-start text-sm", activeItem === subItem.id && "bg-blue-600 text-white hover:bg-blue-700")} onClick={() => onItemClick(subItem.id)}>
                        {subItem.label}
                      </Button>)}
                  </CollapsibleContent>
                </Collapsible> : <Button variant={activeItem === item.id ? "default" : "ghost"} className={cn("w-full justify-start", activeItem === item.id && "bg-blue-600 text-white hover:bg-blue-700")} onClick={() => onItemClick(item.id)}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>}
            </div>)}
        </nav>
      </div>

      {/* Admin Profile & Logout Section */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@sarkarininja.com
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>;
};

export default AdminSidebar;
