
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, MapPin, Clock, Star, BookOpen, Users, Newspaper } from "lucide-react";
import DashboardOverview from '@/components/student/DashboardOverview';
import StudentBookings from '@/components/student/StudentBookings';
import StudentProfile from '@/components/student/StudentProfile';
import StudentNewsFeed from '@/components/news/StudentNewsFeed';
import { useAuth } from '@/contexts/AuthContext';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Study Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-none">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-bookings"
                className="flex items-center space-x-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">My Bookings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="news"
                className="flex items-center space-x-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="flex items-center space-x-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

export default StudentPortal;
