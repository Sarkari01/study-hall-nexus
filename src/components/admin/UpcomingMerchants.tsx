import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Calendar, CheckCircle, Clock, Eye } from "lucide-react";

interface Merchant {
  id: string;
  name: string;
  businessName: string;
  location: string;
  phone: string;
  registrationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  documentsSubmitted: number;
  totalDocuments: number;
  revenue?: number;
}

const UpcomingMerchants = () => {
  const upcomingMerchants: Merchant[] = [
    {
      id: '1',
      name: 'Ravi Patel',
      businessName: 'Study Hub Central',
      location: 'Karol Bagh, Delhi',
      phone: '+91 9876543210',
      registrationDate: '2024-06-14',
      status: 'pending',
      documentsSubmitted: 3,
      totalDocuments: 5
    },
    {
      id: '2',
      name: 'Neha Gupta',
      businessName: 'Focus Learning Center',
      location: 'Lajpat Nagar, Delhi',
      phone: '+91 9876543211',
      registrationDate: '2024-06-13',
      status: 'under_review',
      documentsSubmitted: 5,
      totalDocuments: 5
    },
    {
      id: '3',
      name: 'Amit Sharma',
      businessName: 'Elite Study Space',
      location: 'Gurgaon, Haryana',
      phone: '+91 9876543212',
      registrationDate: '2024-06-12',
      status: 'approved',
      documentsSubmitted: 5,
      totalDocuments: 5,
      revenue: 0
    }
  ];

  const recentlyRegistered: Merchant[] = [
    {
      id: '4',
      name: 'Priya Singh',
      businessName: 'Smart Study Solutions',
      location: 'CP, Delhi',
      phone: '+91 9876543213',
      registrationDate: '2024-06-11',
      status: 'approved',
      documentsSubmitted: 5,
      totalDocuments: 5,
      revenue: 15000
    },
    {
      id: '5',
      name: 'Vikram Kumar',
      businessName: 'Knowledge Corner',
      location: 'Rohini, Delhi',
      phone: '+91 9876543214',
      registrationDate: '2024-06-10',
      status: 'approved',
      documentsSubmitted: 5,
      totalDocuments: 5,
      revenue: 8500
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
      case 'under_review':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Merchant Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMerchants.map((merchant) => (
              <div key={merchant.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {merchant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{merchant.name}</h4>
                      <p className="text-sm text-gray-600">{merchant.businessName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {merchant.location}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {merchant.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(merchant.registrationDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(merchant.status)} flex items-center gap-1`}>
                            {getStatusIcon(merchant.status)}
                            {merchant.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Docs: {merchant.documentsSubmitted}/{merchant.totalDocuments}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Registered */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Registered Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyRegistered.map((merchant) => (
              <div key={merchant.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {merchant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{merchant.name}</h4>
                      <p className="text-sm text-gray-600">{merchant.businessName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {merchant.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(merchant.registrationDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(merchant.status)} flex items-center gap-1`}>
                            {getStatusIcon(merchant.status)}
                            Active
                          </Badge>
                          {merchant.revenue !== undefined && (
                            <span className="text-sm font-medium text-green-600">
                              ₹{merchant.revenue.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingMerchants;
