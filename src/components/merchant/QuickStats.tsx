
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, MapPin, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const QuickStats: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['merchant-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get merchant profile
      const { data: merchantProfile } = await supabase
        .from('merchant_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!merchantProfile) return null;

      // Get study halls count
      const { count: studyHallsCount } = await supabase
        .from('study_halls')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantProfile.id);

      // Get total bookings for merchant's study halls
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          final_amount,
          status,
          study_halls!inner (
            merchant_id
          )
        `)
        .eq('study_halls.merchant_id', merchantProfile.id);

      const totalRevenue = bookings?.reduce((sum, booking) => 
        booking.status === 'confirmed' ? sum + Number(booking.final_amount) : sum, 0) || 0;

      const totalBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

      // Get this month's revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select(`
          final_amount,
          created_at,
          study_halls!inner (
            merchant_id
          )
        `)
        .eq('study_halls.merchant_id', merchantProfile.id)
        .eq('status', 'confirmed')
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

      const monthlyRevenue = monthlyBookings?.reduce((sum, booking) => 
        sum + Number(booking.final_amount), 0) || 0;

      return {
        studyHallsCount: studyHallsCount || 0,
        totalRevenue,
        totalBookings,
        monthlyRevenue
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Halls</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.studyHallsCount || 0}</div>
          <p className="text-xs text-muted-foreground">Active locations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</div>
          <p className="text-xs text-muted-foreground">All time earnings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
          <p className="text-xs text-muted-foreground">Confirmed bookings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats?.monthlyRevenue || 0}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
