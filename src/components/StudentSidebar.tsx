
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarFooter } from "@/components/ui/sidebar";
import { Building2, Calendar, MessageSquare, User, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeTab, onTabChange }) => {
  const { signOut, userProfile } = useAuth();

  const menuItems = [
    {
      id: "browse",
      label: "Find Study Halls",
      icon: Search,
      description: "Browse available spaces"
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: Calendar,
      description: "Manage your reservations"
    },
    {
      id: "community",
      label: "Community",
      icon: MessageSquare,
      description: "Anonymous discussions"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Account settings"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-lg">Student Portal</h2>
            <p className="text-sm text-gray-600">Welcome, {userProfile?.full_name}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onTabChange(item.id)}
                  isActive={activeTab === item.id}
                  className="w-full"
                >
                  <item.icon className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>{item.label}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
