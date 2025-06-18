
import React from 'react';
import { Calendar, DollarSign, BarChart3, Settings, User, Home, MessageSquare, Users, CreditCard, UserPlus, Shield } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      description: "Dashboard overview"
    },
    {
      title: "Study Halls",
      value: "study-halls",
      icon: Building2,
      description: "Manage your spaces"
    },
    {
      title: "Bookings",
      value: "bookings",
      icon: Calendar,
      description: "View reservations"
    },
    {
      title: "Transactions",
      value: "transactions",
      icon: CreditCard,
      description: "Financial history"
    },
    {
      title: "Analytics",
      value: "analytics",
      icon: BarChart3,
      description: "Performance insights"
    }
  ];

  const managementItems = [
    {
      title: "Team Management",
      value: "team",
      icon: UserPlus,
      description: "Manage incharge users"
    },
    {
      title: "Community",
      value: "community",
      icon: MessageSquare,
      description: "Community posts"
    },
    {
      title: "Chat",
      value: "chat",
      icon: Users,
      description: "Customer support"
    }
  ];

  const settingsItems = [
    {
      title: "Profile",
      value: "profile",
      icon: User,
      description: "Business profile"
    },
    {
      title: "Settings",
      value: "settings",
      icon: Settings,
      description: "Account settings"
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="space-y-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center p-2">
              <img 
                src="/lovable-uploads/a0f60459-3d97-4bba-9582-45a8b069134e.png" 
                alt="Sarkari Ninja Logo" 
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sarkari Ninja</h2>
              <p className="text-xs text-gray-500">Merchant Panel</p>
            </div>
          </div>
          
          {/* Merchant Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {getInitials(merchantName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{merchantName}</p>
                <p className="text-xs text-gray-600">Business Owner</p>
              </div>
            </div>
            <Badge variant="outline" className="w-full bg-white/60 text-blue-700 border-blue-200 justify-center">
              {businessName}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map(item => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeTab === item.value} 
                    onClick={() => onTabChange(item.value)}
                    className="group relative"
                  >
                    <button className="w-full text-left hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3 py-2 px-3 rounded-lg">
                        <item.icon className={`h-5 w-5 ${activeTab === item.value ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${activeTab === item.value ? 'text-blue-600' : 'text-gray-700'}`}>
                            {item.title}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map(item => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeTab === item.value} 
                    onClick={() => onTabChange(item.value)}
                    className="group relative"
                  >
                    <button className="w-full text-left hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3 py-2 px-3 rounded-lg">
                        <item.icon className={`h-5 w-5 ${activeTab === item.value ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${activeTab === item.value ? 'text-blue-600' : 'text-gray-700'}`}>
                            {item.title}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map(item => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeTab === item.value} 
                    onClick={() => onTabChange(item.value)}
                    className="group relative"
                  >
                    <button className="w-full text-left hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3 py-2 px-3 rounded-lg">
                        <item.icon className={`h-5 w-5 ${activeTab === item.value ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${activeTab === item.value ? 'text-blue-600' : 'text-gray-700'}`}>
                            {item.title}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Sarkari Ninja v2.0</span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MerchantSidebar;
