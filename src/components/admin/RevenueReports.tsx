
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Calendar, Users, Download, BarChart3, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RevenueData {
  period: string;
  totalRevenue: number;
  platformFee: number;
  merchantRevenue: number;
  transactionCount: number;
  averageTransaction: number;
  growth: number;
}

interface MerchantRevenue {
  merchantId: string;
  merchantName: string;
  revenue: number;
  transactions: number;
  percentage: number;
  growth: number;
}

interface LocationRevenue {
  location: string;
  revenue: number;
  merchants: number;
  transactions: number;
  percentage: number;
}

const RevenueReports = ({ reportType }: { reportType: string }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantRevenue[]>([]);
  const [locationData, setLocationData] = useState<LocationRevenue[]>([]);
  const { toast } = useToast();

  const mockRevenueData: RevenueData[] = [
    {
      period: "2024-06-14",
      totalRevenue: 45680,
      platformFee: 4568,
      merchantRevenue: 41112,
      transactionCount: 156,
      averageTransaction: 293,
      growth: 12.5
    },
    {
      period: "2024-06-13",
      totalRevenue: 38900,
      platformFee: 3890,
      merchantRevenue: 35010,
      transactionCount: 134,
      averageTransaction: 290,
      growth: 8.3
    },
    {
      period: "2024-06-12",
      totalRevenue: 52300,
      platformFee: 5230,
      merchantRevenue: 47070,
      transactionCount: 178,
      averageTransaction: 294,
      growth: 15.7
    },
    {
      period: "2024-06-11",
      totalRevenue: 41200,
      platformFee: 4120,
      merchantRevenue: 37080,
      transactionCount: 142,
      averageTransaction: 290,
      growth: 5.2
    },
    {
      period: "2024-06-10",
      totalRevenue: 47850,
      platformFee: 4785,
      merchantRevenue: 43065,
      transactionCount: 165,
      averageTransaction: 290,
      growth: 9.8
    }
  ];

  const mockMerchantData: MerchantRevenue[] = [
    {
      merchantId: "MERCH_001",
      merchantName: "Sneha Patel",
      revenue: 125600,
      transactions: 432,
      percentage: 28.5,
      growth: 15.3
    },
    {
      merchantId: "MERCH_002", 
      merchantName: "Rajesh Kumar",
      revenue: 98400,
      transactions: 356,
      percentage: 22.3,
      growth: 12.7
    },
    {
      merchantId: "MERCH_003",
      merchantName: "Amit Singh",
      revenue: 76800,
      transactions: 298,
      percentage: 17.4,
      growth: 8.9
    },
    {
      merchantId: "MERCH_004",
      merchantName: "Kumar Study Centers",
      revenue: 89200,
      transactions: 312,
      percentage: 20.2,
      growth: 18.5
    },
    {
      merchantId: "MERCH_005",
      merchantName: "Student Study Zone",
      revenue: 52400,
      transactions: 189,
      percentage: 11.6,
      growth: 6.2
    }
  ];

  const mockLocationData: LocationRevenue[] = [
    {
      location: "Connaught Place, Delhi",
      revenue: 156800,
      merchants: 15,
      transactions: 542,
      percentage: 35.2
    },
    {
      location: "Karol Bagh, Delhi",
      revenue: 124500,
      merchants: 12,
      transactions: 438,
      percentage: 27.9
    },
    {
      location: "Gurgaon, Haryana",
      revenue: 89600,
      merchants: 10,
      transactions: 321,
      percentage: 20.1
    },
    {
      location: "Rajouri Garden, Delhi",
      revenue: 52300,
      merchants: 8,
      transactions: 189,
      percentage: 11.7
    },
    {
      location: "Lajpat Nagar, Delhi",
      revenue: 23100,
      merchants: 6,
      transactions: 87,
      percentage: 5.1
    }
  ];

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange, reportType]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setRevenueData(mockRevenueData);
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

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalPlatformFee = revenueData.reduce((sum, item) => sum + item.platformFee, 0);
  const totalTransactions = revenueData.reduce((sum, item) => sum + item.transactionCount, 0);
  const averageGrowth = revenueData.reduce((sum, item) => sum + item.growth, 0) / revenueData.length;

  const renderDailyRevenue = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{averageGrowth.toFixed(1)}% avg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Platform Fee</p>
                <p className="text-2xl font-bold">₹{totalPlatformFee.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{((totalPlatformFee/totalRevenue)*100).toFixed(1)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <p className="text-xs text-purple-600">₹{(totalRevenue/totalTransactions).toFixed(0)} avg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold">₹{(totalRevenue/revenueData.length).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Platform Fee</TableHead>
                <TableHead>Merchant Revenue</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Avg Transaction</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.period}</TableCell>
                  <TableCell className="font-medium">₹{item.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-blue-600">₹{item.platformFee.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">₹{item.merchantRevenue.toLocaleString()}</TableCell>
                  <TableCell>{item.transactionCount}</TableCell>
                  <TableCell>₹{item.averageTransaction}</TableCell>
                  <TableCell>
                    <Badge variant={item.growth > 0 ? "default" : "destructive"}>
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderMerchantRevenue = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Merchant</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Avg Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchantData.map((merchant) => (
                <TableRow key={merchant.merchantId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{merchant.merchantName}</div>
                      <div className="text-sm text-gray-500">{merchant.merchantId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    ₹{merchant.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>{merchant.transactions}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${merchant.percentage}%`}}
                        ></div>
                      </div>
                      {merchant.percentage}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={merchant.growth > 0 ? "default" : "destructive"}>
                      {merchant.growth > 0 ? '+' : ''}{merchant.growth}%
                    </Badge>
                  </TableCell>
                  <TableCell>₹{(merchant.revenue / merchant.transactions).toFixed(0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderLocationRevenue = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Merchants</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Market Share</TableHead>
                <TableHead>Avg per Merchant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationData.map((location, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{location.location}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    ₹{location.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>{location.merchants}</TableCell>
                  <TableCell>{location.transactions}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${location.percentage}%`}}
                        ></div>
                      </div>
                      {location.percentage}%
                    </div>
                  </TableCell>
                  <TableCell>₹{(location.revenue / location.merchants).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Revenue</TabsTrigger>
          <TabsTrigger value="merchants">By Merchant</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          {renderDailyRevenue()}
        </TabsContent>
        <TabsContent value="merchants">
          {renderMerchantRevenue()}
        </TabsContent>
        <TabsContent value="locations">
          {renderLocationRevenue()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueReports;
