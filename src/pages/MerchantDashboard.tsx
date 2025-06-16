
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Building2 } from "lucide-react";
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
import MerchantProfile from "@/components/merchant/MerchantProfile";
import MerchantSettings from "@/components/merchant/MerchantSettings";
import TeamManagement from "@/components/merchant/TeamManagement";
import DashboardOverview from "@/components/merchant/DashboardOverview";
import StudyHallsManagement from "@/components/merchant/StudyHallsManagement";
import { uuidToNumericId } from "@/utils/uuidUtils";
import { useAuth } from "@/contexts/AuthContext";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<any>(null);
  const [editingStudyHall, setEditingStudyHall] = useState<any>(null);
  
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  // Use real data hooks
  const { merchantProfile, loading: profileLoading, error: profileError } = useMerchantProfile();
  const { studyHalls, loading: studyHallsLoading, createStudyHall, updateStudyHall } = useMerchantStudyHalls();
  const { bookings, loading: bookingsLoading } = useMerchantBookings();

  console.log('MerchantDashboard: Auth context data', {
    userProfile: !!userProfile,
    merchantProfile: !!merchantProfile,
    profileLoading,
    profileError
  });

  // Loading state - wait for profile to load
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

  // If no merchant profile, show onboarding prompt
  if (!merchantProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Merchant Profile</h3>
          <p className="text-gray-600 mb-4">
            Please complete your merchant profile to access the dashboard features.
          </p>
          <Button onClick={() => setActiveTab('profile')}>
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }
  
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
        return (
          <DashboardOverview 
            studyHalls={studyHalls}
            bookings={bookings}
            studyHallsLoading={studyHallsLoading}
            onTabChange={setActiveTab}
          />
        );
      case "study-halls":
        return (
          <StudyHallsManagement
            studyHalls={studyHalls}
            onCreateClick={() => setIsFormOpen(true)}
            onViewClick={openViewModal}
            onEditClick={openEditModal}
          />
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
        return (
          <DashboardOverview 
            studyHalls={studyHalls}
            bookings={bookings}
            studyHallsLoading={studyHallsLoading}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <MerchantSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          merchantName={merchantProfile.full_name}
          businessName={merchantProfile.business_name}
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
                    <p className="text-gray-600">Welcome back, {merchantProfile.full_name}</p>
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
            id: uuidToNumericId(merchantProfile.id),
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
