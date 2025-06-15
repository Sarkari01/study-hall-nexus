
import React from 'react';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Settings, 
  User,
  Home,
  MessageSquare,
  Users
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

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
    },
    {
      title: "Study Halls",
      value: "study-halls",
      icon: Building2,
    },
    {
      title: "Bookings",
      value: "bookings",
      icon: Calendar,
    },
    {
      title: "Analytics",
      value: "analytics",
      icon: BarChart3,
    },
    {
      title: "Community",
      value: "community",
      icon: MessageSquare,
    },
    {
      title: "Chat",
      value: "chat",
      icon: Users,
    },
  ];

  const settingsItems = [
    {
      title: "Profile",
      value: "profile",
      icon: User,
    },
    {
      title: "Settings",
      value: "settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Merchant Portal</h2>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">{merchantName}</p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {businessName}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.value}
                    onClick={() => onTabChange(item.value)}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.value}
                    onClick={() => onTabChange(item.value)}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          StudySpace Pro v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MerchantSidebar;
