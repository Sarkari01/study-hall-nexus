
import { StudyHall, StudyHallFormData, StudyHallViewData } from "@/types/studyHall";

export const convertToViewData = (studyHall: StudyHall): StudyHallViewData => {
  return {
    id: parseInt(studyHall.id),
    name: studyHall.name || '',
    merchantId: parseInt(studyHall.merchant_id || '1'),
    merchantName: 'Default Merchant',
    description: studyHall.description || '',
    location: studyHall.location || '',
    gpsLocation: { lat: 28.6139, lng: 77.2090 },
    capacity: studyHall.capacity || 30,
    rows: 5,
    seatsPerRow: 6,
    layout: Array.from({ length: studyHall.capacity || 30 }, (_, i) => ({
      id: `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`,
      status: Math.random() > 0.7 ? 'occupied' : 'available' as 'available' | 'occupied' | 'maintenance' | 'disabled'
    })),
    pricePerDay: studyHall.price_per_day || 0,
    pricePerWeek: studyHall.price_per_week || 0,
    pricePerMonth: studyHall.price_per_month || 0,
    amenities: studyHall.amenities || [],
    customAmenities: [],
    status: (studyHall.status === 'maintenance' ? 'inactive' : studyHall.status) as 'draft' | 'active' | 'inactive',
    images: [],
    mainImage: '',
    qrCode: '',
    rating: studyHall.rating,
    totalBookings: studyHall.total_bookings
  };
};

export const convertToFormData = (studyHall: StudyHall): StudyHallFormData => {
  return {
    id: parseInt(studyHall.id),
    name: studyHall.name || '',
    merchantId: studyHall.merchant_id?.toString() || '',
    merchantName: 'Default Merchant',
    description: studyHall.description || '',
    location: studyHall.location || '',
    gpsLocation: { lat: 28.6139, lng: 77.2090 },
    capacity: studyHall.capacity || 30,
    rows: 5,
    seatsPerRow: 6,
    layout: Array.from({ length: studyHall.capacity || 30 }, (_, i) => 
      `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`
    ),
    pricePerDay: studyHall.price_per_day?.toString() || '',
    pricePerWeek: studyHall.price_per_week?.toString() || '',
    pricePerMonth: studyHall.price_per_month?.toString() || '',
    amenities: studyHall.amenities || [],
    customAmenities: [],
    status: (studyHall.status === 'maintenance' ? 'inactive' : studyHall.status) as 'draft' | 'active' | 'inactive',
    images: [],
    mainImage: '',
    operatingHours: {
      open: '09:00',
      close: '21:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    qrCode: ''
  };
};
