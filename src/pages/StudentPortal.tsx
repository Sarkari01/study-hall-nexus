
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Calendar, Clock, Users, Wifi, Car, Coffee, Search, Filter } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import StudentSidebar from "@/components/StudentSidebar";
import StudyHallBooking from "@/components/student/StudyHallBooking";
import StudentBookings from "@/components/student/StudentBookings";
import StudentProfile from "@/components/student/StudentProfile";
import CommunityFeed from "@/components/community/CommunityFeed";
import { Input } from "@/components/ui/input";
import { useStudyHalls } from "@/hooks/useStudyHalls";

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { studyHalls, loading } = useStudyHalls();

  const amenityIcons = {
    "AC": "❄️",
    "Wi-Fi": "📶",
    "Parking": "🚗",
    "Coffee": "☕",
    "Silent Zone": "🔇"
  };

  const handleBookNow = (hall: any) => {
    setSelectedHall(hall);
    setIsBookingOpen(true);
  };

  const filteredStudyHalls = studyHalls.filter(hall => 
    hall.status === 'active' && 
    hall.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBrowseStudyHalls = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search study halls by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Halls Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudyHalls.map((hall) => (
            <Card key={hall.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                  <img
                    src="/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png"
                    alt={hall.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{hall.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hall.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{hall.rating || 0}</span>
                        <span className="text-sm text-gray-500">({hall.total_bookings || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{hall.capacity} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>24/7</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {hall.amenities.slice(0, 4).map(amenity => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenityIcons[amenity as keyof typeof amenityIcons]} {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-lg font-bold text-green-600">₹{hall.price_per_day}</span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    <Button onClick={() => handleBookNow(hall)} className="bg-blue-600 hover:bg-blue-700">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredStudyHalls.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Halls Found</h3>
            <p className="text-gray-600">
              {searchQuery ? `No results for "${searchQuery}"` : "No study halls available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "browse":
        return renderBrowseStudyHalls();
      case "bookings":
        return <StudentBookings />;
      case "community":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
              <Badge variant="outline">Anonymous Participation</Badge>
            </div>
            <CommunityFeed />
          </div>
        );
      case "profile":
        return <StudentProfile />;
      default:
        return renderBrowseStudyHalls();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'browse' && 'Find Study Halls'}
                      {activeTab === 'bookings' && 'My Bookings'}
                      {activeTab === 'community' && 'Community'}
                      {activeTab === 'profile' && 'My Profile'}
                    </h1>
                    <p className="text-gray-600">
                      {activeTab === 'browse' && 'Discover the perfect study space for your needs'}
                      {activeTab === 'bookings' && 'Manage your current and past bookings'}
                      {activeTab === 'community' && 'Connect with fellow students anonymously'}
                      {activeTab === 'profile' && 'Manage your account and preferences'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </SidebarInset>

        {/* Booking Modal */}
        {selectedHall && (
          <StudyHallBooking
            studyHall={selectedHall}
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedHall(null);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default StudentPortal;
