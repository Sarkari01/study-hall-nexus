
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Zap } from 'lucide-react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-emerald-200 mt-auto flex-shrink-0">
      <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-xs lg:text-sm text-emerald-600 text-center sm:text-left">
              © 2024 Sarkari Ninja. All rights reserved.
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-2 text-xs lg:text-sm text-emerald-600">
              <Zap className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500" />
              <span className="hidden sm:inline">System Status: All systems operational</span>
              <span className="sm:hidden">All systems operational</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-6 lg:h-8 px-2 text-xs lg:text-sm">
                Privacy
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-6 lg:h-8 px-2 text-xs lg:text-sm">
                Terms
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-6 lg:h-8 px-2 text-xs lg:text-sm">
                Support
              </Button>
            </div>
          </div>

          <div className="flex items-center text-xs lg:text-sm text-emerald-500">
            Made with <Heart className="h-3 w-3 lg:h-4 lg:w-4 mx-1 text-red-500" /> for education
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
