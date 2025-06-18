
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarFooter } from "@/components/ui/sidebar";
import { Calendar, MessageSquare, User, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeTab, onTabChange }) => {
  // Mock user data since auth is not implemented yet
  const mockUserProfile = {
    full_name: "Student User"
  };

  const handleSignOut = () => {
    // Mock sign out functionality
    console.log("Sign out clicked - auth not implemented yet");
  };

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
          <img 
            src="/lovable-uploads/a0f60459-3d97-4bba-9582-45a8b069134e.png" 
            alt="Sarkari Ninja Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h2 className="font-bold text-lg">Student Portal</h2>
            <p className="text-sm text-gray-600">Welcome, {mockUserProfile?.full_name}</p>
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
              onClick={handleSignOut}
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
