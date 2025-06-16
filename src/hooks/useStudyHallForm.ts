
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface StudyHallFormData {
  id?: number;
  name: string;
  merchantId: string;
  merchantName: string;
  location: string;
  rows: number;
  seatsPerRow: number;
  layout: Array<{ id: string; status: 'available' | 'occupied' | 'maintenance' | 'disabled' }>;
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  amenities: string[];
  customAmenities: string[];
  images: string[];
  mainImage: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  qrCode?: string;
}

interface UseStudyHallFormProps {
  editData?: StudyHallFormData | null;
  isAdmin?: boolean;
  currentMerchant?: { id: number; name: string; businessName: string };
}

export const useStudyHallForm = ({ editData, isAdmin, currentMerchant }: UseStudyHallFormProps) => {
  const [formData, setFormData] = useState<StudyHallFormData>({
    name: '',
    merchantId: '',
    merchantName: '',
    location: '',
    rows: 6,
    seatsPerRow: 8,
    layout: [],
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    amenities: [],
    customAmenities: [],
    images: [],
    mainImage: '',
    description: '',
    status: 'draft'
  });

  const [merchants, setMerchants] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  // Fetch merchants from Supabase
  useEffect(() => {
    const fetchMerchants = async () => {
      setLoadingMerchants(true);
      try {
        const { data, error } = await supabase
          .from('merchant_profiles')
          .select('id, full_name, business_name')
          .eq('approval_status', 'approved')
          .order('full_name');

        if (error) throw error;
        setMerchants(data || []);
      } catch (error) {
        console.error('Error fetching merchants:', error);
        toast({
          title: "Error",
          description: "Failed to load merchants",
          variant: "destructive",
        });
      } finally {
        setLoadingMerchants(false);
      }
    };

    if (isAdmin) {
      fetchMerchants();
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        amenities: editData.amenities || [],
        customAmenities: editData.customAmenities || [],
        images: editData.images || [],
        layout: editData.layout || [],
        pricePerDay: editData.pricePerDay?.toString() || '',
        pricePerWeek: editData.pricePerWeek?.toString() || '',
        pricePerMonth: editData.pricePerMonth?.toString() || '',
        merchantId: editData.merchantId?.toString() || '',
        status: editData.status || 'draft'
      });
    } else if (!isAdmin && currentMerchant) {
      setFormData(prev => ({
        ...prev,
        merchantId: currentMerchant.id.toString(),
        merchantName: currentMerchant.name
      }));
    }
  }, [editData, isAdmin, currentMerchant]);

  const generateSeatLayout = (rows: number, seatsPerRow: number) => {
    const layout = [];
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= seatsPerRow; j++) {
        layout.push({
          id: `${rowLetter}${j}`,
          status: 'available' as const
        });
      }
    }
    return layout;
  };

  const handleLayoutChange = (rows: number, seatsPerRow: number) => {
    setFormData(prev => ({
      ...prev,
      rows,
      seatsPerRow,
      layout: generateSeatLayout(rows, seatsPerRow)
    }));
  };

  const handleSeatStatusChange = (seatId: string, status: 'available' | 'occupied' | 'maintenance' | 'disabled') => {
    setFormData(prev => ({
      ...prev,
      layout: prev.layout.map(seat =>
        seat.id === seatId ? { ...seat, status } : seat
      )
    }));
  };

  const updateFormData = (updates: Partial<StudyHallFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    setFormData,
    merchants,
    loadingMerchants,
    newAmenity,
    setNewAmenity,
    showQRCode,
    setShowQRCode,
    handleLayoutChange,
    handleSeatStatusChange,
    updateFormData,
    toast
  };
};
