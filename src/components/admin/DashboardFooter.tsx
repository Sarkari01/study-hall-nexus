
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Zap } from 'lucide-react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-emerald-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-emerald-600">
              © 2024 Sarkari Ninja. All rights reserved.
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-emerald-600">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>System Status: All systems operational</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2">
                Privacy
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2">
                Terms
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2">
                Support
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-emerald-500">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for education
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
