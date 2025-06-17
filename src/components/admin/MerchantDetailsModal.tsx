
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin, DollarSign, Calendar, User, CreditCard, Users, Building } from "lucide-react";

interface Merchant {
  id: string;
  business_name: string;
  full_name: string;
  business_phone: string;
  contact_number: string;
  email?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  verification_status: 'unverified' | 'verified' | 'rejected';
  onboarding_completed: boolean;
  created_at: string;
  business_address: any;
  communication_address?: any;
  bank_account_details?: any;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  refundable_security_deposit?: number;
  notes?: string;
  total_revenue?: number;
  total_study_halls?: number;
}

interface MerchantDetailsModalProps {
  merchant: Merchant | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (merchantId: string, status: 'approved' | 'rejected') => void;
}

const MerchantDetailsModal: React.FC<MerchantDetailsModalProps> = ({
  merchant,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!merchant) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': case 'unverified': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Not provided';
    return [address.street, address.city, address.state, address.pincode, address.country]
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{merchant.business_name}</h2>
              <p className="text-sm text-gray-500">Owner: {merchant.full_name}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(merchant.approval_status)}>
                {merchant.approval_status}
              </Badge>
              <Badge className={getStatusColor(merchant.verification_status)}>
                {merchant.verification_status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Owner:</span>
                <span className="text-sm">{merchant.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{merchant.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Business Phone:</span>
                <span className="text-sm">{merchant.business_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Contact Number:</span>
                <span className="text-sm">{merchant.contact_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm">{new Date(merchant.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Business Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="font-semibold">₹{(merchant.total_revenue || 0).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Building className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Study Halls</p>
                  <p className="font-semibold">{merchant.total_study_halls || 0}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Security Deposit</p>
                  <p className="font-semibold text-xs">₹{(merchant.refundable_security_deposit || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{formatAddress(merchant.business_address)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Communication Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Communication Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{formatAddress(merchant.communication_address)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Point of Contact */}
          {(merchant.incharge_name || merchant.incharge_phone || merchant.incharge_email) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Point of Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{merchant.incharge_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Designation:</span>
                  <span className="text-sm">{merchant.incharge_designation || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{merchant.incharge_phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{merchant.incharge_email || 'Not provided'}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bank Details */}
          {merchant.bank_account_details && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Account Holder:</span>
                  <span className="text-sm">{merchant.bank_account_details.account_holder_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Account Number:</span>
                  <span className="text-sm">{merchant.bank_account_details.account_number || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">IFSC Code:</span>
                  <span className="text-sm">{merchant.bank_account_details.ifsc_code || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Bank:</span>
                  <span className="text-sm">{merchant.bank_account_details.bank_name || 'Not provided'}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notes */}
        {merchant.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{merchant.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            {merchant.approval_status === 'pending' && onUpdateStatus && (
              <>
                <Button 
                  variant="outline" 
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => onUpdateStatus(merchant.id, 'approved')}
                >
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => onUpdateStatus(merchant.id, 'rejected')}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailsModal;
