import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Building2, Calendar, CreditCard, ArrowRightLeft, DollarSign, MapPin, UserPlus, TrendingUp, ChevronDown, ChevronRight, LayoutDashboard, Megaphone, MessageSquare, Users2, Settings, Code, Package, Gift, Wallet, Percent, Bell, LogOut, User, BookOpen } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import Footer from "./Footer";

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
  id: "payments",
  label: "Payments",
  icon: <CreditCard className="h-5 w-5" />
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
  return <div className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-lg">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sarkari Ninja</h2>
            </div>
          </div>
          <p className="text-zinc-700 font-medium text-xs ml-12">Advanced Management System</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarItems.map(item => <div key={item.id}>
              {item.hasSubmenu ? <Collapsible open={expandedItems.includes(item.id)} onOpenChange={() => onToggleExpand(item.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className={cn("w-full justify-between text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg", expandedItems.includes(item.id) && "bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm")}>
                      <div className="flex items-center">
                        <div className="text-blue-600">
                          {item.icon}
                        </div>
                        <span className="ml-3 font-medium">{item.label}</span>
                      </div>
                      {expandedItems.includes(item.id) ? <ChevronDown className="h-4 w-4 text-blue-600" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map(subItem => <Button key={subItem.id} variant={activeItem === subItem.id ? "default" : "ghost"} className={cn("w-full justify-start text-sm transition-all duration-200 rounded-lg", activeItem === subItem.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md" : "hover:bg-gray-50")} onClick={() => onItemClick(subItem.id)}>
                        {subItem.label}
                      </Button>)}
                  </CollapsibleContent>
                </Collapsible> : <Button variant={activeItem === item.id ? "default" : "ghost"} className={cn("w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg", activeItem === item.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md" : "")} onClick={() => onItemClick(item.id)}>
                  <div className={cn("transition-colors", activeItem === item.id ? "text-white" : "text-blue-600")}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{item.label}</span>
                </Button>}
            </div>)}
        </nav>
      </div>

      {/* Enhanced Admin Profile & Logout Section */}
      <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-600">admin@sarkarininja.com</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>;
};
export default AdminSidebar;
