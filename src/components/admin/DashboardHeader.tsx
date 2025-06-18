
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
    <header className="bg-white border-b border-emerald-200 shadow-sm flex-shrink-0 relative z-30">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          {onToggleSidebar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSidebar}
              className="flex-shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8 w-8 lg:h-9 lg:w-9 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-2xl font-bold text-emerald-900 truncate">Admin Dashboard</h1>
            <p className="text-emerald-600 text-xs lg:text-sm hidden sm:block truncate">Welcome back, manage your platform efficiently</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
          {onSearchChange && (
            <div className="hidden md:block">
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search..."
                className="w-40 lg:w-60 xl:w-80 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 text-sm"
              />
            </div>
          )}

          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hidden sm:flex h-8 lg:h-9 px-2 lg:px-3">
            <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            <span className="hidden lg:inline text-sm">Messages</span>
          </Button>

          <Button variant="outline" size="sm" className="relative border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8 lg:h-9 w-8 lg:w-9 p-0">
            <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hidden sm:flex h-8 lg:h-9 w-8 lg:w-9 p-0">
            <HelpCircle className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8 lg:h-9 px-2 lg:px-3">
                <User className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline text-xs lg:text-sm truncate max-w-20 lg:max-w-none">
                  {user?.email?.split('@')[0] || 'Admin'}
                </span>
                <ChevronDown className="h-2 w-2 lg:h-3 lg:w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 lg:w-56 bg-white border-emerald-200">
              <DropdownMenuItem className="text-sm">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600 text-sm">
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
