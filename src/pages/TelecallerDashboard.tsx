
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Users, TrendingUp, LogOut, Target } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import LeadsOverview from '@/components/telecaller/LeadsOverview';

const TelecallerDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Phone className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold">Telecaller Portal</span>
            </div>
            
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'leads' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('leads')}
              >
                <Users className="mr-2 h-4 w-4" />
                Leads Management
              </Button>
              <Button
                variant={activeTab === 'performance' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('performance')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Performance
              </Button>
              <Button
                variant={activeTab === 'targets' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('targets')}
              >
                <Target className="mr-2 h-4 w-4" />
                Targets
              </Button>
            </nav>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'leads' && 'Leads Management'}
                  {activeTab === 'performance' && 'Performance Dashboard'}
                  {activeTab === 'targets' && 'Sales Targets'}
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.email?.split('@')[0]}!
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'leads' && <LeadsOverview />}
            {activeTab === 'performance' && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
                <p className="text-gray-500">Track your sales performance and conversion rates</p>
              </div>
            )}
            {activeTab === 'targets' && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Targets</h3>
                <p className="text-gray-500">View and track your monthly and quarterly targets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelecallerDashboard;
