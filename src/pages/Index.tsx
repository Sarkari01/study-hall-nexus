
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, MapPin, Star, Shield } from "lucide-react";
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Role Management",
      description: "Admin, Merchant, Incharge, Student, Editor & Telecaller dashboards"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Smart Booking System",
      description: "Real-time seat selection with QR code integration"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Analytics & Reports",
      description: "Comprehensive revenue and usage analytics"
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-600" />,
      title: "Location-Based Search",
      description: "Find study halls near you with interactive maps"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Rewards System",
      description: "Referral programs and loyalty rewards"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure Payments",
      description: "Integrated payment gateway with multiple options"
    }
  ];

  const stats = [
    { label: "Active Study Halls", value: "150+", color: "text-blue-600" },
    { label: "Daily Bookings", value: "2,500+", color: "text-green-600" },
    { label: "Registered Students", value: "25,000+", color: "text-purple-600" },
    { label: "Cities Covered", value: "45+", color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
              🎯 Study Hall Management Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Study Hall
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Complete solution for managing study halls with real-time bookings, 
              analytics, and seamless user experience across all devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admin">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Admin Dashboard
                </Button>
              </Link>
              <Link to="/student">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Student Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute top-20 left-10 opacity-20">
          <Card className="w-32 h-32 bg-blue-100"></Card>
        </div>
        <div className="absolute top-32 right-16 opacity-20">
          <Card className="w-24 h-24 bg-purple-100 rounded-full"></Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage study halls efficiently with modern technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Study Hall?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of study hall owners and students who trust our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/merchant">
              <Button variant="secondary" size="lg" className="px-8 py-3 text-lg">
                For Hall Owners
              </Button>
            </Link>
            <Link to="/student">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                For Students
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Study Hall Nexus</h3>
              <p className="text-gray-400">
                Modern study hall management made simple and efficient.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/merchant" className="hover:text-white">Merchant Dashboard</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin Panel</Link></li>
                <li><Link to="/analytics" className="hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/student" className="hover:text-white">Book Now</Link></li>
                <li><Link to="/rewards" className="hover:text-white">Rewards</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Study Hall Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
