
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, userRole, isAuthReady } = useAuth();

  // If user is authenticated, redirect to their dashboard
  if (isAuthReady && user && userRole) {
    const roleRoutes = {
      admin: '/admin',
      merchant: '/merchant',
      student: '/student',
      editor: '/editor',
      telecaller: '/telecaller',
      incharge: '/incharge'
    };
    const targetRoute = roleRoutes[userRole.name as keyof typeof roleRoutes];
    if (targetRoute) {
      return <Navigate to={targetRoute} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudySpace</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-blue-600">Study Space</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover premium study halls, book your ideal seat, and focus on what matters most - your learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Start Studying Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">List Your Study Hall</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StudySpace?</h2>
            <p className="text-lg text-gray-600">Everything you need for productive studying</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Premium Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find study halls in prime locations with easy access to transportation and amenities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Community Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a community of focused learners and share your study journey with like-minded individuals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All study halls are verified and rated by our community to ensure the best study environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have found their perfect study space
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-lg font-bold">StudySpace</span>
              </div>
              <p className="text-gray-400">
                Connecting students with premium study spaces for enhanced learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Find Study Halls</li>
                <li>Book Sessions</li>
                <li>Community</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Merchants</h3>
              <ul className="space-y-2 text-gray-400">
                <li>List Your Space</li>
                <li>Manage Bookings</li>
                <li>Analytics</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudySpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
