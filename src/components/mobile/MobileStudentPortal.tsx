
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, MapPin, Clock, Star, BookOpen, Users, Newspaper, Menu, Bell } from "lucide-react";
import DashboardOverview from '@/components/student/DashboardOverview';
import StudentBookings from '@/components/student/StudentBookings';
import StudentProfile from '@/components/student/StudentProfile';
import StudentNewsFeed from '@/components/news/StudentNewsFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileStudentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Mobile Header */}
      <div className="bg-emerald-600 text-white shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">StudySpace</h1>
                <p className="text-emerald-100 text-sm">Welcome back!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white p-2">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border-none h-16">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 py-2"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="my-bookings"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 py-2"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Bookings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="news"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 py-2"
            >
              <Newspaper className="h-5 w-5" />
              <span className="text-xs">News</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 py-2"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content with bottom padding for fixed navigation */}
      <div className="px-4 py-4 pb-20">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard" className="mt-0">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="my-bookings" className="mt-0">
            <StudentBookings />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <StudentNewsFeed />
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <StudentProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileStudentPortal;
