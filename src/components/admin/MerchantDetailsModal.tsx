
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Building, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Not provided';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                {merchant.approval_status}
              </Badge>
              <Badge className={getStatusColor(merchant.verification_status)}>
                {merchant.verification_status}
              </Badge>
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

          <Separator />

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Business Address:</span>
                </div>
                <p className="text-gray-700 ml-6">{formatAddress(merchant.business_address)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {merchant.communication_address && (
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Communication Address:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{formatAddress(merchant.communication_address)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Business Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Business Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {merchant.total_study_halls || 0}
                </div>
                <div className="text-sm text-gray-500">Study Halls</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₹{(merchant.total_revenue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {merchant.verification_status === 'verified' ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-500">Verified</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Joined
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(merchant.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {merchant.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
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
