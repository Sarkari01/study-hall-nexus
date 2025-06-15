
import React from 'react';
import { Building2, Calendar, DollarSign, BarChart3, Settings, User, Home, MessageSquare, Users, CreditCard, UserPlus, ChevronRight } from "lucide-react";
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
  const menuItems = [
    {
      title: "Overview",
      value: "overview",
      icon: Home,
      badge: null
    },
    {
      title: "Study Halls",
      value: "study-halls",
      icon: Building2,
      badge: "3"
    },
    {
      title: "Bookings",
      value: "bookings",
      icon: Calendar,
      badge: "12"
    },
    {
      title: "Transactions",
      value: "transactions",
      icon: CreditCard,
      badge: null
    },
    {
      title: "Analytics",
      value: "analytics",
      icon: BarChart3,
      badge: null
    },
    {
      title: "Team Management",
      value: "team",
      icon: UserPlus,
      badge: "2",
      hasChevron: true
    },
    {
      title: "Community",
      value: "community",
      icon: MessageSquare,
      badge: null
    },
    {
      title: "Chat",
      value: "chat",
      icon: Users,
      badge: "3"
    },
    {
      title: "Profile",
      value: "profile",
      icon: User,
      badge: null
    },
    {
      title: "Settings",
      value: "settings",
      icon: Settings,
      badge: null
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white w-72">
      <SidebarHeader className="p-6 border-b border-gray-50">
        <div className="space-y-4">
          <div>
            <h2 className="text-gray-900 font-bold text-2xl mb-1">Sarkari Ninja</h2>
            <p className="text-sm text-gray-500">Advanced Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeTab === item.value} 
                    onClick={() => onTabChange(item.value)}
                    className="group w-full h-12"
                  >
                    <button className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.value 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 ${
                          activeTab === item.value ? 'text-white' : 'text-gray-400'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-sm font-medium ${
                          activeTab === item.value ? 'text-white' : 'text-gray-700'
                        }`}>
                          {item.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-2 py-0.5 font-medium ${
                              activeTab === item.value 
                                ? 'bg-white/20 text-white border-white/30' 
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.hasChevron && (
                          <ChevronRight className={`h-4 w-4 ${
                            activeTab === item.value ? 'text-white' : 'text-gray-400'
                          }`} />
                        )}
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
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
              {getInitials(merchantName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{merchantName}</p>
            <p className="text-xs text-gray-500 truncate">{businessName}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MerchantSidebar;
