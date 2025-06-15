
import React from 'react';
import { Building2, Calendar, DollarSign, BarChart3, Settings, User, Home, MessageSquare, Users, CreditCard, UserPlus, Shield } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MerchantSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  merchantName: string;
  businessName: string;
}

const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  activeTab,
  onTabChange,
  merchantName,
  businessName
}) => {
  const mainMenuItems = [
    {
      title: "Overview",
      value: "overview",
      icon: Home,
      description: "Dashboard overview",
      badge: null
    },
    {
      title: "Study Halls",
      value: "study-halls",
      icon: Building2,
      description: "Manage your spaces",
      badge: "3"
    },
    {
      title: "Bookings",
      value: "bookings",
      icon: Calendar,
      description: "View reservations",
      badge: "12"
    },
    {
      title: "Transactions",
      value: "transactions",
      icon: CreditCard,
      description: "Financial history",
      badge: null
    },
    {
      title: "Analytics",
      value: "analytics",
      icon: BarChart3,
      description: "Performance insights",
      badge: null
    }
  ];

  const managementItems = [
    {
      title: "Team Management",
      value: "team",
      icon: UserPlus,
      description: "Manage incharge users",
      badge: "2"
    },
    {
      title: "Community",
      value: "community",
      icon: MessageSquare,
      description: "Community posts",
      badge: null
    },
    {
      title: "Chat",
      value: "chat",
      icon: Users,
      description: "Customer support",
      badge: "3"
    }
  ];

  const settingsItems = [
    {
      title: "Profile",
      value: "profile",
      icon: User,
      description: "Business profile",
      badge: null
    },
    {
      title: "Settings",
      value: "settings",
      icon: Settings,
      description: "Account settings",
      badge: null
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.value}>
      <SidebarMenuButton 
        asChild 
        isActive={activeTab === item.value} 
        onClick={() => onTabChange(item.value)}
        className="group relative overflow-hidden"
      >
        <button className="w-full text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                activeTab === item.value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  activeTab === item.value ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {item.title}
                </span>
                <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 transition-colors duration-200">
                  {item.description}
                </p>
              </div>
            </div>
            {item.badge && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-1 font-medium"
              >
                {item.badge}
              </Badge>
            )}
          </div>
          {activeTab === item.value && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
          )}
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-50">
        <div className="space-y-4">
          {/* Enhanced Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sarkari Ninja</h2>
              <p className="text-xs text-gray-500 font-medium">Merchant Panel</p>
            </div>
          </div>
          
          {/* Enhanced Merchant Info Card */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl p-4 space-y-3 border border-blue-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-bold text-sm">
                  {getInitials(merchantName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{merchantName}</p>
                <p className="text-xs text-gray-600 font-medium">Business Owner</p>
              </div>
            </div>
            <Badge variant="outline" className="w-full bg-white/80 text-blue-700 border-blue-200 justify-center font-medium">
              <Building2 className="h-3 w-3 mr-1" />
              {businessName}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500 font-medium">Sarkari Ninja v2.0</div>
          </div>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 px-2 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Online
          </Badge>
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          © 2024 All rights reserved
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MerchantSidebar;
