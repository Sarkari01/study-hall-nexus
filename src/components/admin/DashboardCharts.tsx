
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const DashboardCharts = () => {
  // Revenue trend data
  const revenueData = [
    { name: 'Mon', revenue: 45000, bookings: 120, students: 89 },
    { name: 'Tue', revenue: 52000, bookings: 145, students: 102 },
    { name: 'Wed', revenue: 48000, bookings: 132, students: 95 },
    { name: 'Thu', revenue: 61000, bookings: 168, students: 118 },
    { name: 'Fri', revenue: 55000, bookings: 155, students: 108 },
    { name: 'Sat', revenue: 67000, bookings: 189, students: 134 },
    { name: 'Sun', revenue: 59000, bookings: 171, students: 121 }
  ];

  // Top merchants data
  const merchantData = [
    { name: 'Sneha Patel', revenue: 125000, bookings: 186, growth: 23.5 },
    { name: 'Rajesh Kumar', revenue: 89000, bookings: 134, growth: 18.2 },
    { name: 'Amit Singh', revenue: 67000, bookings: 98, growth: 15.7 },
    { name: 'Priya Sharma', revenue: 74000, bookings: 112, growth: 22.1 },
    { name: 'Vikram Gupta', revenue: 45000, bookings: 78, growth: 12.8 }
  ];

  // Booking distribution data
  const bookingDistribution = [
    { name: 'Morning (6-12)', value: 35, color: '#0088FE' },
    { name: 'Afternoon (12-18)', value: 45, color: '#00C49F' },
    { name: 'Evening (18-24)', value: 20, color: '#FFBB28' }
  ];

  // Student activity data
  const studentActivityData = [
    { hour: '06:00', active: 45 },
    { hour: '08:00', active: 125 },
    { hour: '10:00', active: 189 },
    { hour: '12:00', active: 234 },
    { hour: '14:00', active: 198 },
    { hour: '16:00', active: 267 },
    { hour: '18:00', active: 234 },
    { hour: '20:00', active: 178 },
    { hour: '22:00', active: 89 }
  ];

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Revenue & Bookings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Merchants Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={merchantData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]}
              />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Booking Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <PieChart>
              <Pie
                data={bookingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Student Activity Heatmap */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Student Activity Throughout the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={studentActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="active" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
