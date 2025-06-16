
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, Clock, CheckCircle, LogOut } from 'lucide-react';
import HallOperations from '@/components/incharge/HallOperations';

const InchargeDashboard = () => {
  const [activeTab, setActiveTab] = useState('operations');
  const { userProfile, signOut } = useAuth();

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
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Incharge Portal</span>
            </div>
            
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'operations' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('operations')}
              >
                <Users className="mr-2 h-4 w-4" />
                Hall Operations
              </Button>
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('schedule')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button
                variant={activeTab === 'reports' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('reports')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Reports
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
                  {activeTab === 'operations' && 'Hall Operations'}
                  {activeTab === 'schedule' && 'Schedule Management'}
                  {activeTab === 'reports' && 'Reports & Analytics'}
                </h1>
                <p className="text-gray-600">
                  Welcome, {userProfile?.full_name || 'Incharge'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'operations' && <HallOperations />}
            {activeTab === 'schedule' && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Management</h3>
                <p className="text-gray-500">Manage booking schedules and time slots</p>
              </div>
            )}
            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
                <p className="text-gray-500">View hall performance and usage statistics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InchargeDashboard;
