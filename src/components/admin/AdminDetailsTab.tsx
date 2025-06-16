
import React from 'react';
import AdminDetails from './AdminDetails';
import ErrorBoundary from './ErrorBoundary';

const AdminDetailsTab = () => {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <AdminDetails />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDetailsTab;
