
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import StudyHallsTable from './StudyHallsTable';
import ErrorBoundary from '../ErrorBoundary';

const SafeStudyHallsWrapper: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      <StudyHallsTable />
    </ErrorBoundary>
  );
};

export default SafeStudyHallsWrapper;
