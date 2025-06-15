
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DeepSeekService } from '@/services/deepseekService';
import { useToast } from '@/hooks/use-toast';

interface AIAnalyticsDashboardProps {
  apiKey?: string;
}

interface PredictionData {
  revenue: { prediction: number; confidence: number };
  insights: { insights: string[]; recommendations: string[] };
  lastUpdated: Date;
}

const AIAnalyticsDashboard: React.FC<AIAnalyticsDashboardProps> = ({ apiKey }) => {
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock historical data - in real app, this would come from your database
  const mockHistoricalData = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 140 },
    { month: 'Mar', revenue: 48000, bookings: 130 },
    { month: 'Apr', revenue: 58000, bookings: 155 },
    { month: 'May', revenue: 62000, bookings: 168 },
  ];

  const mockStudentData = {
    totalStudents: 1250,
    avgStudyTime: 3.5,
    peakHours: ['14:00-16:00', '19:00-21:00'],
    popularLocations: ['Downtown Library', 'University District', 'Business Center'],
    repeatBookingRate: 0.75
  };

  const generatePredictions = async () => {
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "DeepSeek API key not configured.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const deepSeekService = new DeepSeekService(apiKey);
      
      // Generate revenue prediction
      const revenuePrediction = await deepSeekService.predictRevenue(mockHistoricalData);
      
      // Generate student insights
      const studentInsights = await deepSeekService.generateInsights(mockStudentData);

      setPredictions({
        revenue: revenuePrediction,
        insights: studentInsights,
        lastUpdated: new Date()
      });

      toast({
        title: "Predictions Updated",
        description: "AI analytics have been refreshed with latest data",
      });
    } catch (error) {
      console.error('AI Analytics error:', error);
      toast({
        title: "Error",
        description: "Failed to generate predictions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      generatePredictions();
    }
  }, [apiKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Analytics & Predictions</h2>
        <Button onClick={generatePredictions} disabled={isLoading || !apiKey}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Predictions
        </Button>
      </div>

      {!apiKey ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            DeepSeek API key not configured. Please configure it in Developer Management to use AI analytics.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Prediction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              {predictions ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(predictions.revenue.prediction)}
                    </p>
                    <p className="text-sm text-gray-600">Next month prediction</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Confidence: {Math.round(predictions.revenue.confidence * 100)}%
                    </Badge>
                    <span className={`text-sm font-medium ${getConfidenceColor(predictions.revenue.confidence)}`}>
                      {predictions.revenue.confidence > 0.8 ? 'High' : 
                       predictions.revenue.confidence > 0.6 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <span className="text-gray-500">Generate predictions to view data</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Peak Time Prediction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Peak Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockStudentData.peakHours.map((time, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {time}
                  </Badge>
                ))}
                <p className="text-sm text-gray-600 mt-2">
                  Highest demand periods based on booking patterns
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demand Heatmap */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                High-Demand Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockStudentData.popularLocations.map((location, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{location}</span>
                    <Badge variant="secondary">
                      {90 - index * 10}% demand
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          {predictions && (
            <>
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.insights.insights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {predictions.insights.recommendations.map((rec, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm">
                        {rec}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Student Behavior Insights */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Student Behavior Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mockStudentData.totalStudents}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mockStudentData.avgStudyTime}h</p>
                  <p className="text-sm text-gray-600">Avg Study Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{Math.round(mockStudentData.repeatBookingRate * 100)}%</p>
                  <p className="text-sm text-gray-600">Repeat Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mockStudentData.peakHours.length}</p>
                  <p className="text-sm text-gray-600">Peak Periods</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {predictions && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {predictions.lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AIAnalyticsDashboard;
