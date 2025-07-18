
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardFooter from '@/components/admin/DashboardFooter';
import DashboardOverview from '@/components/admin/DashboardOverview';
import StudentsTable from '@/components/admin/StudentsTable';
import MerchantsTable from '@/components/admin/MerchantsTable';
import StudyHallsTable from '@/components/admin/StudyHallsTable';
import BookingsTable from '@/components/admin/BookingsTable';
import RoleManagement from '@/components/admin/RoleManagement';
import AIAnalyticsDashboard from '@/components/ai/AIAnalyticsDashboard';
import AIChatbot from '@/components/ai/AIChatbot';
import ContentModerator from '@/components/ai/ContentModerator';
import SmartTextAssistant from '@/components/ai/SmartTextAssistant';
import ChatSystem from '@/components/chat/ChatSystem';
import CommunityFeed from '@/components/community/CommunityFeed';
import DeveloperManagement from '@/components/admin/DeveloperManagement';
import PaymentHistoryTable from '@/components/admin/PaymentHistoryTable';
import TransactionsTable from '@/components/admin/TransactionsTable';
import SettleNowTable from '@/components/admin/SettleNowTable';
import LocationsTable from '@/components/admin/LocationsTable';
import LeadsTable from '@/components/admin/LeadsTable';
import BannerManager from '@/components/banners/BannerManager';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';
import PromotionsRewards from '@/components/admin/PromotionsRewards';
import PushNotifications from '@/components/admin/PushNotifications';
import NewsManagement from '@/components/news/NewsManagement';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get API key from localStorage for AI features
  const getApiKey = () => {
    return localStorage.getItem('deepseek_api_key') || '';
  };

  const handleItemClick = (itemId: string) => {
    console.log('Navigating to:', itemId);
    setActiveItem(itemId);
  };

  const handleToggleExpand = (itemId: string) => {
    console.log('Toggling expand for:', itemId, 'Current expanded:', expandedItems);
    setExpandedItems((prev) => {
      const isCurrentlyExpanded = prev.includes(itemId);
      if (isCurrentlyExpanded) {
        const newExpanded = prev.filter((id) => id !== itemId);
        console.log('Collapsing, new expanded items:', newExpanded);
        return newExpanded;
      } else {
        const newExpanded = [...prev, itemId];
        console.log('Expanding, new expanded items:', newExpanded);
        return newExpanded;
      }
    });
  };

  const renderContent = () => {
    console.log('Rendering content for:', activeItem);
    
    switch (activeItem) {
      case "dashboard":
        return <DashboardOverview onNavigate={handleItemClick} />;
      case "students":
        return <StudentsTable />;
      case "role-management":
        return <RoleManagement />;
      case "merchants":
        return <MerchantsTable />;
      case "study-halls":
        return <StudyHallsTable />;
      case "bookings":
        return <BookingsTable />;
      case "news-management":
        return <NewsManagement />;
      case "subscription-management":
        return <SubscriptionManagement />;
      case "promotions-rewards":
        return <PromotionsRewards />;
      case "push-notifications":
        return <PushNotifications />;
      case "payments":
        return <PaymentHistoryTable />;
      case "transactions":
        return <TransactionsTable />;
      case "settle-now":
        return <SettleNowTable />;
      case "locations":
        return <LocationsTable />;
      case "leads":
        return <LeadsTable />;
      case "banner-management":
        return <BannerManager />;
      case "ai-analytics":
        return <AIAnalyticsDashboard apiKey={getApiKey()} />;
      case "ai-chatbot":
        return <AIChatbot userType="admin" apiKey={getApiKey()} />;
      case "content-moderation":
        return <ContentModerator apiKey={getApiKey()} />;
      case "text-assistant":
        return <SmartTextAssistant apiKey={getApiKey()} />;
      case "chat-system":
        return <ChatSystem />;
      case "community":
        return <CommunityFeed />;
      case "developer-management":
        return <DeveloperManagement />;
      case "analytics":
        return (
          <div className="p-4 lg:p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-emerald-200">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 text-emerald-900">Analytics Dashboard</h2>
            <p className="text-emerald-600">Advanced analytics coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-4 lg:p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-emerald-200">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 text-emerald-900">System Settings</h2>
            <p className="text-emerald-600">System configuration coming soon...</p>
          </div>
        );
      default:
        console.log('Unknown route, defaulting to dashboard');
        return <DashboardOverview onNavigate={handleItemClick} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile when collapsed, overlay on mobile when expanded */}
      <div className={`
        ${sidebarCollapsed ? 'w-0 lg:w-16' : 'w-72'} 
        transition-all duration-300 ease-in-out flex-shrink-0
        ${!sidebarCollapsed ? 'fixed lg:relative z-50 lg:z-auto' : 'hidden lg:block'}
      `}>
        <AdminSidebar
          activeItem={activeItem}
          onItemClick={(itemId) => {
            handleItemClick(itemId);
            // Auto-collapse sidebar on mobile after navigation
            if (window.innerWidth < 1024) {
              setSidebarCollapsed(true);
            }
          }}
          expandedItems={expandedItems}
          onToggleExpand={handleToggleExpand}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        <DashboardHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          notifications={3}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-auto bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="p-3 sm:p-4 lg:p-6 h-full">
            <div className="max-w-full">
              {renderContent()}
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
