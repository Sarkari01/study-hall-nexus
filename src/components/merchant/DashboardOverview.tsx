
import React from 'react';
import DashboardStatsCards from './DashboardStatsCards';
import DashboardQuickActions from './DashboardQuickActions';
import DashboardStudyHallsOverview from './DashboardStudyHallsOverview';

interface DashboardOverviewProps {
  studyHalls: any[];
  bookings: any[];
  studyHallsLoading: boolean;
  onTabChange: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  studyHalls,
  bookings,
  studyHallsLoading,
  onTabChange
}) => {
  return (
    <div className="space-y-6">
      <DashboardStatsCards studyHalls={studyHalls} bookings={bookings} />
      <DashboardQuickActions onTabChange={onTabChange} />
      <DashboardStudyHallsOverview 
        studyHalls={studyHalls}
        studyHallsLoading={studyHallsLoading}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default DashboardOverview;
