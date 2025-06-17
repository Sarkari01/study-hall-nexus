
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Bell, Settings, User, MessageSquare, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedDashboardHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  notifications?: number;
}

const EnhancedDashboardHeader: React.FC<EnhancedDashboardHeaderProps> = ({
  searchValue = '',
  onSearchChange,
  notifications = 0
}) => {
  const { user } = useAuth();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, manage your platform efficiently</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onSearchChange && (
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search across dashboard..."
                className="w-80"
              />
            )}

            <Button variant="outline" size="sm" className="relative">
              <MessageSquare className="h-4 w-4" />
              <span className="ml-2">Messages</span>
            </Button>

            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications > 99 ? '99+' : notifications}
                </Badge>
              )}
            </Button>

            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user?.email?.split('@')[0] || 'Admin'}</span>
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
                <DropdownMenuItem className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardHeader;
