
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

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(true);
  const { toast } = useToast();
  
  // Mock user data for development mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'demo@merchant.com'
  };
  
  const mockUserProfile = {
    id: 'demo-profile-id',
    user_id: 'demo-user-id',
    full_name: 'Demo Merchant',
    role: 'merchant',
    custom_role_id: null,
    merchant_id: 'demo-merchant-id',
    study_hall_id: null,
    phone: '+91 98765 43210',
    avatar_url: null,
    bio: 'Demo merchant account for testing'
  };
  
  // Use real data hooks (these should handle missing auth gracefully)
  const { merchantProfile, loading: profileLoading, error: profileError } = useMerchantProfile();
  const { studyHalls, loading: studyHallsLoading, createStudyHall, updateStudyHall } = useMerchantStudyHalls();
  const { bookings, loading: bookingsLoading } = useMerchantBookings();

  console.log('MerchantDashboard: Development mode - using mock auth data', {
    profileLoading,
    profileError,
    mockUser: !!mockUser,
    userProfile: mockUserProfile.role,
    merchantProfile: !!merchantProfile
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

  // For development mode, show merchant profile setup if no real profile exists and user hasn't continued
  if (!merchantProfile && mockUserProfile.role === 'merchant' && showDevelopmentMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Development Mode</h3>
          <p className="text-gray-600 mb-4">
            Merchant dashboard loaded in development mode. Real merchant profile will be loaded when authentication is enabled.
          </p>
          <Button onClick={() => setShowDevelopmentMode(false)}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

  // Use merchantProfile if available, otherwise use mock data for display
  const displayProfile = merchantProfile || {
    full_name: 'Demo Merchant',
    business_name: 'Demo Business',
    id: 'demo-merchant-id'
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <MerchantSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          merchantName={displayProfile.full_name || 'Demo Merchant'}
          businessName={displayProfile.business_name || 'Demo Business'}
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
                    <p className="text-gray-600">Welcome back, {displayProfile.full_name}</p>
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
            id: uuidToNumericId(displayProfile.id || 'demo-id'),
            name: displayProfile.full_name || 'Demo Merchant',
            businessName: displayProfile.business_name || 'Demo Business'
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
