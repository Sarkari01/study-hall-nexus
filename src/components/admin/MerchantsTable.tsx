
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useMerchants } from "@/hooks/useMerchants";

const MerchantsTable = () => {
  const { merchants, loading, updateMerchant } = useMerchants();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMerchants = merchants.filter(merchant =>
    merchant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.contact_number.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleStatusUpdate = async (merchantId: string, newStatus: 'approved' | 'rejected') => {
    await updateMerchant(merchantId, { approval_status: newStatus });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchants Management</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Study Halls</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{merchant.full_name}</p>
                      <p className="text-sm text-gray-500">{merchant.contact_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{merchant.business_name}</p>
                      <p className="text-sm text-gray-500">{merchant.business_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{merchant.business_address?.city || 'N/A'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">₹{merchant.total_revenue?.toLocaleString() || '0'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-center">{merchant.total_study_halls || 0}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(merchant.approval_status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(merchant.approval_status)}
                      {merchant.approval_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {merchant.approval_status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(merchant.id, 'approved')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(merchant.id, 'rejected')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredMerchants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No merchants found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantsTable;
