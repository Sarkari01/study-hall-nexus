
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Store, MapPin, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import QuickStats from '@/components/merchant/QuickStats';
import StudyHallsManagement from '@/components/merchant/StudyHallsManagement';
import MerchantBookings from '@/components/merchant/MerchantBookings';
import MerchantProfile from '@/components/merchant/MerchantProfile';

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
              <Store className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold">Merchant Portal</span>
            </div>
            
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === 'study-halls' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('study-halls')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Study Halls
              </Button>
              <Button
                variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('bookings')}
              >
                <Users className="mr-2 h-4 w-4" />
                Bookings
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('profile')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile
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
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'study-halls' && 'Study Halls Management'}
                  {activeTab === 'bookings' && 'Bookings Management'}
                  {activeTab === 'profile' && 'Business Profile'}
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.email?.split('@')[0]}!
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <QuickStats />
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Merchant Dashboard</h3>
                  <p className="text-gray-500">Manage your study halls and view business analytics</p>
                </div>
              </div>
            )}
            {activeTab === 'study-halls' && <StudyHallsManagement />}
            {activeTab === 'bookings' && <MerchantBookings />}
            {activeTab === 'profile' && <MerchantProfile />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
