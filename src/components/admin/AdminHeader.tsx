
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  Settings, 
  Calendar,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  activeModule: string;
  onModuleChange?: (module: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeModule, onModuleChange }) => {
  const getModuleTitle = (module: string) => {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard Overview',
      'students': 'Student Management',
      'merchants': 'Merchant Management',
      'study-halls': 'Study Hall Management',
      'payments': 'Payment Management',
      'transactions': 'Transaction Management',
      'notifications': 'Notification Center',
      'general-settings': 'General Settings'
    };
    return titles[module] || 'Admin Console';
  };

  const getModuleDescription = (module: string) => {
    const descriptions: { [key: string]: string } = {
      'dashboard': 'Monitor platform performance and key metrics',
      'students': 'Manage student accounts and study hall bookings',
      'merchants': 'Oversee merchant profiles and verification status',
      'study-halls': 'Configure study halls and manage availability',
      'payments': 'Track payments and financial transactions',
      'transactions': 'View detailed transaction history and reports',
      'notifications': 'Send push notifications to users',
      'general-settings': 'Configure platform-wide settings and preferences'
    };
    return descriptions[module] || 'Advanced administrative controls and monitoring';
  };

  return (
    <div className="bg-white border-b border-slate-200/60 shadow-sm">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Search */}
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {getModuleTitle(activeModule)}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {getModuleDescription(activeModule)}
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-80 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">2,847</span>
                <span className="text-xs text-blue-600">Students</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">₹1.2M</span>
                <span className="text-xs text-green-600">Revenue</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">+23%</span>
                <span className="text-xs text-purple-600">Growth</span>
              </div>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">New merchant registration</p>
                    <p className="text-xs text-slate-500">Raj Kumar submitted documents for verification</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Payment failed</p>
                    <p className="text-xs text-slate-500">Student payment of ₹500 requires attention</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">System maintenance</p>
                    <p className="text-xs text-slate-500">Scheduled for tonight at 2:00 AM</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onModuleChange?.('general-settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-200/60">
        <div className="flex items-center space-x-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'merchants', label: 'Merchants', icon: Users },
            { id: 'study-halls', label: 'Study Halls', icon: Calendar },
            { id: 'payments', label: 'Payments', icon: DollarSign }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeModule === tab.id ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
                activeModule === tab.id 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
              onClick={() => onModuleChange?.(tab.id)}
            >
              <tab.icon className="h-3 w-3 mr-1.5" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
