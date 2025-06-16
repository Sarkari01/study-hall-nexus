
import React from 'react';
import RoleManagement from './RoleManagement';
import ErrorBoundary from './ErrorBoundary';

const RoleManagementTab = () => {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <RoleManagement />
      </div>
    </ErrorBoundary>
  );
};

export default RoleManagementTab;
