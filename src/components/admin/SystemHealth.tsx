
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Database, Wifi, AlertTriangle, CheckCircle } from "lucide-react";

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  icon: React.ReactNode;
}

const SystemHealth: React.FC = () => {
  const healthMetrics: HealthMetric[] = [
    {
      name: "Server Uptime",
      status: 'healthy',
      value: 99.9,
      unit: '%',
      icon: <Server className="h-4 w-4" />
    },
    {
      name: "Database Performance",
      status: 'healthy',
      value: 95.2,
      unit: '%',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: "API Response Time",
      status: 'warning',
      value: 89.1,
      unit: 'ms',
      icon: <Wifi className="h-4 w-4" />
    },
    {
      name: "Error Rate",
      status: 'healthy',
      value: 0.1,
      unit: '%',
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>System Health</span>
        </CardTitle>
        <Badge className="bg-green-100 text-green-800">
          All Systems Operational
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-gray-500">
                  {metric.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {metric.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">
                        {metric.value}{metric.unit}
                      </span>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Last Updated:</strong> {new Date().toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
