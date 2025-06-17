
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

  const StudyHallsErrorFallback = ({ resetError }: { resetError: () => void }) => (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Study Halls Management Error</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          There was an error loading the Study Halls management interface. 
          This might be due to a configuration issue with Google Maps or another service.
        </p>
        <div className="flex space-x-2">
          <Button onClick={resetError} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin?tab=developer-management'} 
            variant="default" 
            size="sm"
          >
            Check Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary fallback={StudyHallsErrorFallback}>
      <StudyHallsTable />
    </ErrorBoundary>
  );
};

export default SafeStudyHallsWrapper;
