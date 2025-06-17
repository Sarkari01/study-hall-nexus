
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, Mail, MapPin, DollarSign, Calendar, User } from "lucide-react";

interface Merchant {
  id: string;
  business_name: string;
  full_name: string;
  business_phone: string;
  contact_number: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  business_address: any;
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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">{merchant.business_name}</h2>
              <p className="text-sm text-gray-500">Owner: {merchant.full_name}</p>
            </div>
            <Badge className={getStatusColor(merchant.approval_status)}>
              {merchant.approval_status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{merchant.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{merchant.contact_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{merchant.business_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {merchant.business_address?.city || 'Address not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Business Statistics */}
          <div>
            <h3 className="text-lg font-medium mb-3">Business Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="font-semibold">₹{(merchant.total_revenue || 0).toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Study Halls</p>
                <p className="font-semibold">{merchant.total_study_halls || 0}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold text-xs">
                  {new Date(merchant.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Business Address */}
          {merchant.business_address && (
            <div>
              <h3 className="text-lg font-medium mb-3">Business Address</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  {[
                    merchant.business_address.street,
                    merchant.business_address.city,
                    merchant.business_address.state,
                    merchant.business_address.pincode
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

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
