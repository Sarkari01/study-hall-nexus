
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import StudentsTable from '@/components/admin/StudentsTable';
import MerchantsTable from '@/components/admin/MerchantsTable';
import StudyHallsTable from '@/components/admin/StudyHallsTable';
import BookingsTable from '@/components/admin/BookingsTable';
import RoleManagementTab from '@/components/admin/RoleManagementTab';

import AdminDetailsTab from '@/components/admin/AdminDetailsTab';

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
            {(() => {
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
                case "analytics":
                  return <div>Analytics coming soon...</div>;
                case "settings":
                  return <div>Settings coming soon...</div>;
                default:
                  return <DashboardOverview />;
              }
            })()}
          </div>
        </main>
    </div>
  );
};

export default AdminDashboard;
