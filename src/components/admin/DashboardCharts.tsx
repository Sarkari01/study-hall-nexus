
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import ErrorBoundary from "./ErrorBoundary";

const ChartFallback = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        <p>Chart temporarily unavailable</p>
      </div>
    </CardContent>
  </Card>
);

const DashboardCharts = () => {
  const { chartData, loading } = useDashboardCharts();

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#8884d8"
    },
    bookings: {
      label: "Bookings",
      color: "#82ca9d"
    },
    students: {
      label: "Students",
      color: "#ffc658"
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={`loading-${i}`}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <ErrorBoundary fallback={<ChartFallback title="Revenue Trend" />}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={chartData.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </ErrorBoundary>

      {/* Bookings Chart */}
      <ErrorBoundary fallback={<ChartFallback title="Bookings Overview" />}>
        <Card>
          <CardHeader>
            <CardTitle>Bookings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData.bookingsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bookings" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </ErrorBoundary>

      {/* Study Halls Performance */}
      <ErrorBoundary fallback={<ChartFallback title="Study Halls Performance" />}>
        <Card>
          <CardHeader>
            <CardTitle>Study Halls Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData.studyHallsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="halls" fill="#3B82F6" />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </ErrorBoundary>

      {/* User Growth Chart */}
      <ErrorBoundary fallback={<ChartFallback title="User Growth" />}>
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={chartData.userGrowthChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="students" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Area type="monotone" dataKey="merchants" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

export default DashboardCharts;
