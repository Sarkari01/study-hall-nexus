
export interface StudyHall {
  id: string;
  name: string;
  merchant_id?: string;
  description?: string;
  location: string;
  capacity: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  amenities: string[];
  status: 'draft' | 'active' | 'inactive' | 'maintenance';
  rating: number;
  total_bookings: number;
  total_revenue: number;
  is_featured: boolean;
  operating_hours?: any;
  created_at: string;
  updated_at: string;
}

export interface StudyHallFormData {
  id?: number;
  name: string;
  merchantId: string;
  merchantName: string;
  description: string;
  location: string;
  gpsLocation: { lat: number; lng: number };
  capacity: number;
  rows: number;
  seatsPerRow: number;
  layout: string[];
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  amenities: string[];
  customAmenities: string[];
  status: 'draft' | 'active' | 'inactive';
  images: string[];
  mainImage: string;
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  qrCode?: string;
}

export interface StudyHallViewData {
  id: number;
  name: string;
  merchantId: number;
  merchantName: string;
  location: string;
  gpsLocation: { lat: number; lng: number };
  capacity: number;
  rows: number;
  seatsPerRow: number;
  layout: Array<{ id: string; status: 'available' | 'occupied' | 'maintenance' | 'disabled' }>;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  amenities: string[];
  customAmenities?: string[];
  status: 'draft' | 'active' | 'inactive';
  rating: number;
  totalBookings: number;
  description: string;
  images: string[];
  mainImage: string;
  qrCode?: string;
}
