import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus,
  QrCode,
  Users,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  Upload,
  Building2,
  Tag,
  MapPin,
  X,
  AirVent,
  Car
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [amenities, setAmenities] = useState({
    ac: false,
    parking: false
  });

  const stats = [
    {
      title: "Today's Bookings",
      value: "24",
      change: "+8",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Revenue Today",
      value: "₹12,560",
      change: "+15.2%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      change: "+5%",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Total Seats",
      value: "45",
      change: "0",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  const bookings = [
    {
      user: "Rahul Kumar",
      seat: "A2",
      duration: "4 hours",
      amount: "₹200",
      status: "Paid",
      time: "09:00 AM"
    },
    {
      user: "Priya Sharma",
      seat: "B5",
      duration: "6 hours",
      amount: "₹300",
      status: "Unpaid",
      time: "10:30 AM"
    },
    {
      user: "Arjun Patel",
      seat: "C1",
      duration: "8 hours",
      amount: "₹400",
      status: "Paid",
      time: "08:00 AM"
    }
  ];

  const studyHalls = [
    {
      name: "Prime Study Zone - Ground Floor",
      location: "Connaught Place, New Delhi",
      seats: 30,
      occupied: 22,
      layout: "6x5 Grid (A1-F5)",
      amenities: ["AC", "Parking"],
      pricing: {
        daily: 50,
        weekly: 300,
        monthly: 1000
      }
    },
    {
      name: "Quiet Corner - First Floor",
      location: "Karol Bagh, New Delhi",
      seats: 20,
      occupied: 15,
      layout: "5x4 Grid (A1-E4)",
      amenities: ["AC"],
      pricing: {
        daily: 60,
        weekly: 350,
        monthly: 1200
      }
    }
  ];

  const coupons = [
    {
      code: "STUDENT20",
      discount: "20%",
      expiry: "31 Dec 2024",
      used: 45,
      limit: 100
    },
    {
      code: "FIRST50",
      discount: "₹50",
      expiry: "15 Jul 2024",
      used: 23,
      limit: 50
    }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "study-halls", label: "Study Halls", icon: <Building2 className="h-5 w-5" /> },
    { id: "bookings", label: "Bookings", icon: <Calendar className="h-5 w-5" /> },
    { id: "qr-generator", label: "QR Generator", icon: <QrCode className="h-5 w-5" /> },
    { id: "coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities(prev => ({ ...prev, [amenity]: checked }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        items={sidebarItems} 
        activeItem={activeTab} 
        onItemClick={setActiveTab}
        title="Merchant Panel"
      />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
          <p className="text-gray-600">Manage your study hall operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                          +{stat.change} from yesterday
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.user}</p>
                        <p className="text-sm text-gray-600">
                          Seat {booking.seat} • {booking.duration} • {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{booking.amount}</span>
                        <Badge 
                          variant={booking.status === 'Paid' ? 'default' : 'destructive'}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study-halls" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Study Hall
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Study Hall</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="hallName">Study Hall Name</Label>
                    <Input id="hallName" placeholder="e.g., Prime Study Zone - Ground Floor" />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="location" placeholder="e.g., Connaught Place, New Delhi" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label>Upload Images (Min 1 required)</Label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          Select Images
                        </Button>
                      </div>

                      {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className={`border-2 rounded-lg p-2 ${index === mainImageIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <p className="text-xs text-gray-600 truncate">{file.name}</p>
                                  <div className="flex gap-1">
                                    {index !== mainImageIndex && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setAsMainImage(index)}
                                        className="text-xs p-1"
                                      >
                                        Main
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeImage(index)}
                                      className="text-xs p-1 text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {index === mainImageIndex && (
                                <Badge className="absolute -top-2 -right-2 bg-blue-600">Main</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Custom Layout Configuration</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="rows">Number of Rows</Label>
                        <Input id="rows" placeholder="6" type="number" min="1" max="10" />
                      </div>
                      <div>
                        <Label htmlFor="cols">Seats per Row</Label>
                        <Input id="cols" placeholder="5" type="number" min="1" max="10" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Layout will be: A1, A2... B1, B2... etc.</p>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="ac" 
                          checked={amenities.ac}
                          onCheckedChange={(checked) => handleAmenityChange('ac', checked as boolean)}
                        />
                        <Label htmlFor="ac" className="flex items-center gap-2">
                          <AirVent className="h-4 w-4" />
                          Air Conditioning (AC)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="parking" 
                          checked={amenities.parking}
                          onCheckedChange={(checked) => handleAmenityChange('parking', checked as boolean)}
                        />
                        <Label htmlFor="parking" className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Parking Available
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Flexible Pricing</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="dailyPrice">Per Day</Label>
                        <Input id="dailyPrice" placeholder="₹50" />
                      </div>
                      <div>
                        <Label htmlFor="weeklyPrice">Per Week</Label>
                        <Input id="weeklyPrice" placeholder="₹300" />
                      </div>
                      <div>
                        <Label htmlFor="monthlyPrice">Per Month</Label>
                        <Input id="monthlyPrice" placeholder="₹1000" />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Create Study Hall</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Study Halls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyHalls.map((hall, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{hall.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {hall.location}
                            </div>
                          </div>
                          <Badge variant="outline">{hall.layout}</Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-3">
                          <p>Total Seats: {hall.seats}</p>
                          <p>Currently Occupied: {hall.occupied}</p>
                          <div className="flex items-center gap-2">
                            <span>Amenities:</span>
                            {hall.amenities.map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {amenity === 'AC' && <AirVent className="h-3 w-3 mr-1" />}
                                {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span>Daily: ₹{hall.pricing.daily}</span>
                            <span>Weekly: ₹{hall.pricing.weekly}</span>
                            <span>Monthly: ₹{hall.pricing.monthly}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View Layout</Button>
                          <Button size="sm" variant="outline">Images</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr-generator" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Code</CardTitle>
                  <p className="text-sm text-gray-600">Create QR posters to increase walk-in bookings.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Study Hall</Label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Prime Study Zone - Ground Floor</option>
                      <option>Quiet Corner - First Floor</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>QR Code Type</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="booking" name="qrType" className="rounded" />
                        <Label htmlFor="booking">Direct Booking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="info" name="qrType" className="rounded" />
                        <Label htmlFor="info">Hall Information</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Generate QR Code</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    QR code will appear here after generation
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Download PNG</Button>
                    <Button variant="outline" className="flex-1">Download PDF</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Coupon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <Input id="couponCode" placeholder="e.g., STUDENT20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Percentage</option>
                        <option>Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input id="discountValue" placeholder="20" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input id="usageLimit" placeholder="100" />
                    </div>
                  </div>
                  
                  <Button className="w-full">Create Coupon</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coupons.map((coupon, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-mono font-bold text-gray-900">{coupon.code}</h3>
                          <Badge variant="outline">{coupon.discount}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Expires: {coupon.expiry}</p>
                          <p>Used: {coupon.used}/{coupon.limit}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Deactivate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MerchantDashboard;
