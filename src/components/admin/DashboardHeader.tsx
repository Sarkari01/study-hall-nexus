
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Bell, Settings, User, MessageSquare, HelpCircle, ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notifications?: number;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchValue = '',
  onSearchChange,
  notifications = 3,
  onToggleSidebar,
  sidebarCollapsed = false
}) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-emerald-200 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-emerald-900">Admin Dashboard</h1>
            <p className="text-emerald-600 text-sm hidden sm:block">Welcome back, manage your platform efficiently</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {onSearchChange && (
            <div className="hidden md:block">
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search across dashboard..."
                className="w-60 lg:w-80 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
          )}

          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hidden sm:flex">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Messages</span>
          </Button>

          <Button variant="outline" size="sm" className="relative border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500"
              >
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hidden sm:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email?.split('@')[0] || 'Admin'}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
