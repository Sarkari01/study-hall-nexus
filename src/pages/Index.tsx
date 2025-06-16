
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate } from "react-router-dom";
import { MapPin, Star, Users, Wifi, Car, Coffee, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, userRole, loading } = useAuth();

  // If user is authenticated, redirect to their dashboard
  if (user && userRole && !loading) {
    const roleRoutes = {
      admin: '/admin',
      merchant: '/merchant',
      student: '/student',
      editor: '/editor',
      telecaller: '/telecaller',
      incharge: '/incharge'
    };
    
    const targetRoute = roleRoutes[userRole.name as keyof typeof roleRoutes] || '/dashboard';
    return <Navigate to={targetRoute} replace />;
  }

  const featuredStudyHalls = [
    {
      id: 1,
      name: "Central Library Study Hub",
      location: "Downtown, City Center",
      rating: 4.8,
      price: 299,
      image: "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
      amenities: ["Wi-Fi", "AC", "Parking", "Coffee"]
    },
    {
      id: 2,
      name: "Tech Park Study Space",
      location: "IT Corridor, Sector 5",
      rating: 4.6,
      price: 249,
      image: "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
      amenities: ["Wi-Fi", "AC", "Silent Zone"]
    },
    {
      id: 3,
      name: "University Area Study Center",
      location: "Near ABC University",
      rating: 4.9,
      price: 199,
      image: "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
      amenities: ["Wi-Fi", "AC", "Parking", "Coffee", "Silent Zone"]
    }
  ];

  const amenityIcons = {
    "Wi-Fi": <Wifi className="h-4 w-4" />,
    "AC": "❄️",
    "Parking": <Car className="h-4 w-4" />,
    "Coffee": <Coffee className="h-4 w-4" />,
    "Silent Zone": "🔇"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Sarkari Ninja</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded bg-gray-200 h-10 w-20"></div>
                  <div className="rounded bg-gray-200 h-10 w-20"></div>
                </div>
              ) : user ? (
                <Link to="/dashboard">
                  <Button className="flex items-center gap-2">
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-blue-600"> Study Space</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover quiet, comfortable study halls near you. Book by the hour, day, or month. 
              Focus on your goals while we handle the space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Browse Study Halls
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Study Halls */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Study Halls</h2>
            <p className="text-gray-600">Popular spaces loved by students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStudyHalls.map((hall) => (
              <Card key={hall.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                    <img
                      src={hall.image}
                      alt={hall.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{hall.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{hall.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{hall.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hall.amenities.slice(0, 3).map(amenity => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {typeof amenityIcons[amenity as keyof typeof amenityIcons] === 'string' ? 
                            amenityIcons[amenity as keyof typeof amenityIcons] : 
                            amenityIcons[amenity as keyof typeof amenityIcons]
                          } {amenity}
                        </Badge>
                      ))}
                      {hall.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hall.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-green-600">₹{hall.price}</span>
                        <span className="text-sm text-gray-500">/day</span>
                      </div>
                      <Link to="/auth">
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Sarkari Ninja?</h2>
            <p className="text-gray-600">Everything you need for focused studying</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Study halls in convenient locations near universities and transport hubs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Amenities</h3>
              <p className="text-gray-600">High-speed Wi-Fi, comfortable seating, air conditioning, and more</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Connect with like-minded students and join study groups</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Studying?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of students who have found their perfect study space</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Sarkari Ninja</span>
              </div>
              <p className="text-gray-400">Find your perfect study space and achieve your academic goals.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white transition-colors">Browse Study Halls</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Book a Space</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Student Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Merchants</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white transition-colors">List Your Space</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Merchant Dashboard</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Pricing Plans</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@sarkarininja.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sarkari Ninja. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
