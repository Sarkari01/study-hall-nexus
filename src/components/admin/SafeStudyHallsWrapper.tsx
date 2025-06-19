
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
    <ErrorBoundary
      fallback={
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Study Halls Loading Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                There was an error loading the study halls data. This could be due to:
              </p>
              <ul className="text-sm text-gray-500 mb-6 text-left max-w-md mx-auto">
                <li>• Database connection issues</li>
                <li>• Permission problems</li>
                <li>• Network connectivity</li>
                <li>• Component rendering errors</li>
              </ul>
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry Loading
              </Button>
            </div>
          </CardContent>
        </Card>
      }
    >
      <StudyHallsTable />
    </ErrorBoundary>
  );
};

export default SafeStudyHallsWrapper;
