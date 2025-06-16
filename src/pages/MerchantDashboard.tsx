import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, TrendingUp, Building2, MapPin, Star, Eye, Plus, UserPlus, Edit, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import MerchantSidebar from "@/components/MerchantSidebar";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";
import { useMerchantStudyHalls } from "@/hooks/useMerchantStudyHalls";
import { useMerchantBookings } from "@/hooks/useMerchantBookings";
import StudyHallForm from "@/components/admin/StudyHallForm";
import StudyHallView from "@/components/admin/StudyHallView";
import CommunityFeed from "@/components/community/CommunityFeed";
import ChatSystem from "@/components/chat/ChatSystem";
import MerchantAnalytics from "@/components/merchant/MerchantAnalytics";
import MerchantBookings from "@/components/merchant/MerchantBookings";
import MerchantTransactions from "@/components/merchant/MerchantTransactions";
import MerchantPayments from "@/components/merchant/MerchantPayments";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import MerchantSettings from "@/components/merchant/MerchantSettings";
import SubscriptionStatus from "@/components/merchant/SubscriptionStatus";
import TeamManagement from "@/components/merchant/TeamManagement";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Use real data hooks
  const { merchantProfile, loading: profileLoading, error: profileError } = useMerchantProfile();
  const { studyHalls, loading: studyHallsLoading, createStudyHall, updateStudyHall } = useMerchantStudyHalls();
  const { bookings, loading: bookingsLoading } = useMerchantBookings();

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading merchant dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-4">{profileError}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No merchant profile state
  if (!merchantProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Merchant Profile Required</h3>
          <p className="text-gray-600 mb-4">Please complete your merchant profile to access the dashboard.</p>
          <Button onClick={() => setActiveTab("profile")}>
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Study Halls",
      value: studyHalls.length.toString(),
      change: "+2 this month",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      change: "+12% from last month",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${bookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0).toLocaleString()}`,
      change: "+8.5% from last month",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: studyHalls.length > 0 ? (studyHalls.reduce((sum, hall) => sum + hall.rating, 0) / studyHalls.length).toFixed(1) : "0.0",
      change: "+0.2 from last month",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600"
    }
  ];

  const renderDashboardContent = () => {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => setActiveTab("study-halls")}
              >
                <Plus className="h-6 w-6 mb-2" />
                Add Study Hall
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => setActiveTab("bookings")}
              >
                <Calendar className="h-6 w-6 mb-2" />
                View Bookings
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => setActiveTab("analytics")}
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                Analytics
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <DollarSign className="h-6 w-6 mb-2" />
                Revenue Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Study Halls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Study Halls</CardTitle>
              <Button onClick={() => setActiveTab("study-halls")} variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {studyHallsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading study halls...</span>
              </div>
            ) : studyHalls.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Halls Yet</h3>
                <p className="text-gray-600 mb-4">Create your first study hall to start accepting bookings</p>
                <Button onClick={() => setActiveTab("study-halls")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study Hall
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studyHalls.slice(0, 3).map((hall) => (
                  <Card key={hall.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-lg">{hall.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{hall.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{hall.capacity} seats</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{hall.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">₹{hall.price_per_day}/day</span>
                          <Badge variant={hall.status === 'active' ? "default" : "secondary"}>
                            {hall.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<any>(null);
  const [editingStudyHall, setEditingStudyHall] = useState<any>(null);
  
  const handleAddStudyHall = (data: any) => {
    createStudyHall(data);
    setEditingStudyHall(null);
    toast({
      title: "Success",
      description: "Study hall created successfully",
    });
  };

  const handleEditStudyHall = (data: any) => {
    if (!editingStudyHall) return;
    updateStudyHall(editingStudyHall.id, data);
    setEditingStudyHall(null);
    toast({
      title: "Success",
      description: "Study hall updated successfully",
    });
  };

  const openViewModal = (hall: any) => {
    setSelectedStudyHall(hall);
    setIsViewOpen(true);
  };

  const openEditModal = (hall: any) => {
    setEditingStudyHall(hall);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingStudyHall(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderDashboardContent();
      case "study-halls":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Study Hall
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyHalls.map((hall) => (
                <Card key={hall.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{hall.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{hall.location}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={hall.status === 'active' ? 'default' : 'secondary'}
                          className={hall.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {hall.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{hall.capacity} seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{hall.total_bookings} bookings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{hall.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>₹{hall.price_per_day}/day</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openViewModal(hall)} className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditModal(hall)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "bookings":
        return <MerchantBookings />;

      case "transactions":
        return <MerchantTransactions />;

      case "analytics":
        return <MerchantAnalytics />;

      case "team":
        return <TeamManagement />;

      case "community":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
            </div>
            <CommunityFeed />
          </div>
        );

      case "chat":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            </div>
            <ChatSystem />
          </div>
        );

      case "profile":
        return <MerchantProfile />;

      case "settings":
        return <MerchantSettings />;

      default:
        return renderDashboardContent();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <MerchantSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          merchantName={merchantProfile?.full_name || ''}
          businessName={merchantProfile?.business_name || ''}
        />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            {/* Enhanced Header */}
            <div className="bg-white border-b shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'overview' && 'Dashboard Overview'}
                      {activeTab === 'study-halls' && 'Study Halls Management'}
                      {activeTab === 'bookings' && 'Bookings Management'}
                      {activeTab === 'transactions' && 'Transaction History'}
                      {activeTab === 'analytics' && 'Analytics & Insights'}
                      {activeTab === 'team' && 'Team Management'}
                      {activeTab === 'community' && 'Community Feed'}
                      {activeTab === 'chat' && 'Messages & Support'}
                      {activeTab === 'profile' && 'Business Profile'}
                      {activeTab === 'settings' && 'Account Settings'}
                    </h1>
                    <p className="text-gray-600">Welcome back, {merchantProfile?.full_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </SidebarInset>

        {/* Study Hall Form Modal */}
        <StudyHallForm
          isOpen={isFormOpen}
          onClose={closeFormModal}
          onSubmit={editingStudyHall ? handleEditStudyHall : handleAddStudyHall}
          editData={editingStudyHall}
          isAdmin={false}
          currentMerchant={{
            id: merchantProfile.id,
            name: merchantProfile.full_name,
            businessName: merchantProfile.business_name
          }}
        />

        {/* Study Hall View Modal */}
        {selectedStudyHall && (
          <StudyHallView
            studyHall={selectedStudyHall}
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            onEdit={() => {
              setIsViewOpen(false);
              openEditModal(selectedStudyHall);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default MerchantDashboard;
