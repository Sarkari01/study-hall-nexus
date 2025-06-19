
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Building, User, Calendar, CheckCircle, XCircle, CreditCard, TrendingUp } from 'lucide-react';

interface MerchantDetailsModalProps {
  merchant: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (merchantId: string, status: 'approved' | 'rejected') => void;
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
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Not provided';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '');
  };

  const formatBankDetails = (bankDetails: any) => {
    if (!bankDetails) return null;
    if (typeof bankDetails === 'string') {
      try {
        return JSON.parse(bankDetails);
      } catch {
        return null;
      }
    }
    return bankDetails;
  };

  const bankDetails = formatBankDetails(merchant.bank_account_details);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building className="h-6 w-6" />
            {merchant.business_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(merchant.approval_status)}>
                Approval: {merchant.approval_status}
              </Badge>
              <Badge className={getStatusColor(merchant.verification_status)}>
                Verification: {merchant.verification_status}
              </Badge>
              {merchant.onboarding_completed && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Onboarding Complete
                </Badge>
              )}
            </div>
            {merchant.approval_status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(merchant.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUpdateStatus(merchant.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {merchant.total_study_halls || 0}
                </div>
                <div className="text-sm text-gray-500">Study Halls</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{(merchant.total_revenue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {merchant.verification_status === 'verified' ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-500">Verified</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Joined
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(merchant.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Business Name:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{merchant.business_name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Business Phone:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{merchant.business_phone}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Business Address:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{formatAddress(merchant.business_address)}</p>
                </div>

                {merchant.communication_address && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Communication Address:</span>
                    </div>
                    <p className="text-gray-700 ml-6">{formatAddress(merchant.communication_address)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Full Name:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{merchant.full_name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Contact Number:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{merchant.contact_number}</p>
                </div>

                {merchant.email && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                    </div>
                    <p className="text-gray-700 ml-6">{merchant.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incharge Details */}
            {(merchant.incharge_name || merchant.incharge_designation || merchant.incharge_phone || merchant.incharge_email) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Incharge Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {merchant.incharge_name && (
                    <div className="space-y-2">
                      <span className="font-medium">Name:</span>
                      <p className="text-gray-700">{merchant.incharge_name}</p>
                    </div>
                  )}
                  
                  {merchant.incharge_designation && (
                    <div className="space-y-2">
                      <span className="font-medium">Designation:</span>
                      <p className="text-gray-700">{merchant.incharge_designation}</p>
                    </div>
                  )}

                  {merchant.incharge_phone && (
                    <div className="space-y-2">
                      <span className="font-medium">Phone:</span>
                      <p className="text-gray-700">{merchant.incharge_phone}</p>
                    </div>
                  )}

                  {merchant.incharge_email && (
                    <div className="space-y-2">
                      <span className="font-medium">Email:</span>
                      <p className="text-gray-700">{merchant.incharge_email}</p>
                    </div>
                  )}

                  {merchant.incharge_address && (
                    <div className="space-y-2">
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-700">{formatAddress(merchant.incharge_address)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bank Details */}
            {bankDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Bank Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bankDetails.account_number && (
                    <div className="space-y-2">
                      <span className="font-medium">Account Number:</span>
                      <p className="text-gray-700 font-mono">
                        ****{bankDetails.account_number.slice(-4)}
                      </p>
                    </div>
                  )}
                  
                  {bankDetails.ifsc_code && (
                    <div className="space-y-2">
                      <span className="font-medium">IFSC Code:</span>
                      <p className="text-gray-700 font-mono">{bankDetails.ifsc_code}</p>
                    </div>
                  )}

                  {bankDetails.bank_name && (
                    <div className="space-y-2">
                      <span className="font-medium">Bank Name:</span>
                      <p className="text-gray-700">{bankDetails.bank_name}</p>
                    </div>
                  )}

                  {bankDetails.account_holder_name && (
                    <div className="space-y-2">
                      <span className="font-medium">Account Holder:</span>
                      <p className="text-gray-700">{bankDetails.account_holder_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Financial Information */}
          {merchant.refundable_security_deposit && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="font-medium">Refundable Security Deposit:</span>
                  <p className="text-gray-700">₹{merchant.refundable_security_deposit.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {merchant.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Admin Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{merchant.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailsModal;
