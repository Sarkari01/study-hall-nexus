
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import StudentsTable from '@/components/admin/StudentsTable';
import MerchantsTable from '@/components/admin/MerchantsTable';
import StudyHallsTable from '@/components/admin/StudyHallsTable';
import BookingsTable from '@/components/admin/BookingsTable';
import RoleManagementTab from '@/components/admin/RoleManagementTab';
import AdminDetailsTab from '@/components/admin/AdminDetailsTab';
import AIAnalyticsDashboard from '@/components/ai/AIAnalyticsDashboard';
import AIChatbot from '@/components/ai/AIChatbot';
import ContentModerator from '@/components/ai/ContentModerator';
import SmartTextAssistant from '@/components/ai/SmartTextAssistant';
import ChatSystem from '@/components/chat/ChatSystem';
import CommunityFeed from '@/components/community/CommunityFeed';
import DeveloperManagement from '@/components/admin/DeveloperManagement';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardOverview />;
      case "admin-details":
        return <AdminDetailsTab />;
      case "students":
        return <StudentsTable />;
      case "role-management":
        return <RoleManagementTab />;
      case "merchants":
        return <MerchantsTable />;
      case "study-halls":
        return <StudyHallsTable />;
      case "bookings":
        return <BookingsTable />;
      case "ai-analytics":
        return <AIAnalyticsDashboard />;
      case "ai-chatbot":
        return <AIChatbot userType="admin" />;
      case "content-moderation":
        return <ContentModerator />;
      case "text-assistant":
        return <SmartTextAssistant />;
      case "chat-system":
        return <ChatSystem />;
      case "community":
        return <CommunityFeed />;
      case "developer-management":
        return <DeveloperManagement />;
      case "analytics":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">Advanced analytics coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-600">System configuration coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expandedItems={expandedItems}
        onToggleExpand={handleToggleExpand}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
