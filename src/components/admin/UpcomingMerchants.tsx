
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Calendar, CheckCircle, Clock, Eye, XCircle, Loader2, User, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useMerchants } from "@/hooks/useMerchants";
import { useAuth } from '@/contexts/AuthContext';

const UpcomingMerchants = () => {
  const { merchants, loading, error, updateMerchant } = useMerchants();
  const { user, userRole, isAuthReady } = useAuth();

  console.log('UpcomingMerchants: Rendering with merchants:', merchants, 'loading:', loading, 'error:', error);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const pendingMerchants = merchants.filter(m => 
    m.approval_status === 'pending'
  ).slice(0, 5);

  const recentlyApproved = merchants.filter(m => 
    m.approval_status === 'approved'
  ).slice(0, 5);

  const topPerformers = merchants.filter(m => 
    m.approval_status === 'approved' && (m.total_revenue || 0) > 0
  ).sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)).slice(0, 3);

  // Show authentication error state
  if (!isAuthReady || loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access merchant data.</p>
        </div>
      </div>
    );
  }

  if (userRole?.name !== 'admin') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Admin privileges required to view merchant data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Pending Approvals */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Approvals
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              {pendingMerchants.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingMerchants.map((merchant) => (
              <div key={merchant.id} className="p-3 border rounded-lg hover:bg-orange-50/50 transition-colors border-orange-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                        {merchant.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{merchant.full_name}</h4>
                      <p className="text-xs text-gray-600 truncate">{merchant.business_name}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {merchant.business_address?.city || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(merchant.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={`${getStatusColor(merchant.approval_status)} flex items-center gap-1 text-xs`}>
                          {getStatusIcon(merchant.approval_status)}
                          {merchant.approval_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingMerchants.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending approvals</p>
                <p className="text-xs text-gray-400 mt-1">All merchants reviewed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recently Approved */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recently Approved
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              {recentlyApproved.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyApproved.map((merchant) => (
              <div key={merchant.id} className="p-3 border rounded-lg hover:bg-green-50/50 transition-colors border-green-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                        {merchant.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{merchant.full_name}</h4>
                      <p className="text-xs text-gray-600 truncate">{merchant.business_name}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {merchant.business_address?.city || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(merchant.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={`${getStatusColor('approved')} flex items-center gap-1 text-xs`}>
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                        {merchant.total_revenue !== undefined && merchant.total_revenue > 0 && (
                          <span className="text-xs font-medium text-green-600">
                            ₹{merchant.total_revenue.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {recentlyApproved.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent approvals</p>
                <p className="text-xs text-gray-400 mt-1">No merchants approved recently</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Top Performers
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              {topPerformers.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((merchant, index) => (
              <div key={merchant.id} className="p-3 border rounded-lg hover:bg-blue-50/50 transition-colors border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {merchant.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{merchant.full_name}</h4>
                    <p className="text-xs text-gray-600 truncate">{merchant.business_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          ₹{merchant.total_revenue?.toLocaleString() || '0'}
                        </Badge>
                        {merchant.total_study_halls > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {merchant.total_study_halls}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {topPerformers.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No performance data</p>
                <p className="text-xs text-gray-400 mt-1">Revenue data will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingMerchants;
