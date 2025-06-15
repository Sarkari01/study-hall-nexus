
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Building2, MapPin, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RevenueData {
  period: string;
  revenue: number;
  bookings: number;
  growth: number;
}

interface MerchantRevenue {
  name: string;
  revenue: number;
  percentage: number;
  bookings: number;
}

interface LocationRevenue {
  location: string;
  revenue: number;
  growth: number;
  merchants: number;
}

interface RevenueReportsProps {
  reportType: string;
}

const RevenueReports: React.FC<RevenueReportsProps> = ({ reportType }) => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantRevenue[]>([]);
  const [locationData, setLocationData] = useState<LocationRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedMerchant, setSelectedMerchant] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const { toast } = useToast();

  const mockDailyData: RevenueData[] = [
    { period: '2024-06-08', revenue: 15650, bookings: 23, growth: 12.5 },
    { period: '2024-06-09', revenue: 18920, bookings: 28, growth: 15.2 },
    { period: '2024-06-10', revenue: 16430, bookings: 25, growth: -8.1 },
    { period: '2024-06-11', revenue: 21340, bookings: 32, growth: 18.7 },
    { period: '2024-06-12', revenue: 19870, bookings: 29, growth: -2.3 },
    { period: '2024-06-13', revenue: 23450, bookings: 35, growth: 22.1 },
    { period: '2024-06-14', revenue: 25680, bookings: 38, growth: 15.8 }
  ];

  const mockWeeklyData: RevenueData[] = [
    { period: 'Week 20', revenue: 89450, bookings: 134, growth: 8.5 },
    { period: 'Week 21', revenue: 92340, bookings: 145, growth: 12.2 },
    { period: 'Week 22', revenue: 87690, bookings: 128, growth: -5.1 },
    { period: 'Week 23', revenue: 94570, bookings: 152, growth: 15.8 },
    { period: 'Week 24', revenue: 102340, bookings: 168, growth: 18.9 }
  ];

  const mockMonthlyData: RevenueData[] = [
    { period: 'Jan 2024', revenue: 345000, bookings: 520, growth: 15.2 },
    { period: 'Feb 2024', revenue: 389000, bookings: 584, growth: 12.8 },
    { period: 'Mar 2024', revenue: 425000, bookings: 638, growth: 18.5 },
    { period: 'Apr 2024', revenue: 398000, bookings: 595, growth: -6.4 },
    { period: 'May 2024', revenue: 445000, bookings: 672, growth: 22.1 },
    { period: 'Jun 2024', revenue: 465000, bookings: 698, growth: 8.9 }
  ];

  const mockMerchantData: MerchantRevenue[] = [
    { name: 'Sneha Patel', revenue: 125000, percentage: 35.2, bookings: 186 },
    { name: 'Rajesh Kumar', revenue: 89000, percentage: 25.1, bookings: 134 },
    { name: 'Amit Singh', revenue: 67000, percentage: 18.9, bookings: 98 },
    { name: 'Priya Sharma', revenue: 74000, percentage: 20.8, bookings: 112 }
  ];

  const mockLocationData: LocationRevenue[] = [
    { location: 'Connaught Place', revenue: 156000, growth: 22.5, merchants: 8 },
    { location: 'Karol Bagh', revenue: 134000, growth: 18.2, merchants: 6 },
    { location: 'Gurgaon', revenue: 98000, growth: 15.7, merchants: 4 },
    { location: 'Lajpat Nagar', revenue: 87000, growth: 12.3, merchants: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchRevenueData();
  }, [reportType, dateRange, selectedMerchant, selectedLocation]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        switch (reportType) {
          case 'daily-revenue':
            setRevenueData(mockDailyData);
            break;
          case 'weekly-revenue':
            setRevenueData(mockWeeklyData);
            break;
          case 'monthly-revenue':
            setRevenueData(mockMonthlyData);
            break;
          default:
            setRevenueData(mockDailyData);
        }
        setMerchantData(mockMerchantData);
        setLocationData(mockLocationData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch revenue data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast({
      title: "Export Started",
      description: "Revenue report export will be available shortly",
    });
  };

  const getTotalRevenue = () => {
    return revenueData.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getTotalBookings = () => {
    return revenueData.reduce((sum, item) => sum + item.bookings, 0);
  };

  const getAverageGrowth = () => {
    const totalGrowth = revenueData.reduce((sum, item) => sum + item.growth, 0);
    return (totalGrowth / revenueData.length).toFixed(1);
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'daily-revenue': return 'Daily Revenue Report';
      case 'weekly-revenue': return 'Weekly Revenue Report';
      case 'monthly-revenue': return 'Monthly Revenue Report';
      case 'merchant-revenue': return 'Merchant Revenue Analysis';
      case 'location-revenue': return 'Location Revenue Analysis';
      default: return 'Revenue Analytics';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{getReportTitle()}</h2>
              <p className="text-gray-600">Comprehensive revenue analytics and insights</p>
            </div>
            <div className="flex gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{getTotalRevenue().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{getTotalBookings().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              {parseFloat(getAverageGrowth()) >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Growth</p>
                <p className={`text-2xl font-bold ${parseFloat(getAverageGrowth()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getAverageGrowth()}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg per Booking</p>
                <p className="text-2xl font-bold">₹{Math.round(getTotalRevenue() / getTotalBookings()).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      {(reportType.includes('revenue') || reportType === 'daily-revenue' || reportType === 'weekly-revenue' || reportType === 'monthly-revenue') && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Bookings'
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                <Line type="monotone" dataKey="bookings" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Merchant Revenue Analysis */}
      {(reportType === 'merchant-revenue' || reportType === 'dashboard') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Merchants by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={merchantData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={merchantData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percentage}) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {merchantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Location Revenue Analysis */}
      {(reportType === 'location-revenue' || reportType === 'dashboard') && (
        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {locationData.map((location, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <p className="font-medium">{location.location}</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">₹{location.revenue.toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                          {location.growth >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                          )}
                          <span className={`text-sm ${location.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {location.growth}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{location.merchants} merchants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Merchant Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {merchantData.map((merchant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{merchant.name}</p>
                    <p className="text-sm text-gray-500">{merchant.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{merchant.revenue.toLocaleString()}</p>
                    <Badge variant="secondary">{merchant.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Period Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.slice(-5).map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{period.period}</p>
                    <p className="text-sm text-gray-500">{period.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{period.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      {period.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                      )}
                      <span className={`text-sm ${period.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {period.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueReports;
