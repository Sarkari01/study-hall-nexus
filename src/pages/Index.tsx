import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Sarkari Ninja</span>
            </div>
            <nav className="flex space-x-4">
              <Link to="/auth">
                <Button variant="outline">Admin Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Study Hall
            <span className="text-blue-600"> Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive management system for study halls, students, and merchants. 
            Streamline operations with our powerful admin dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Access Admin Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your study hall ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage student profiles, bookings, and track their study hall usage
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Merchant Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete merchant onboarding and management system with verification
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Booking System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced booking management with real-time availability tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Admin Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive admin dashboard with analytics and reporting
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">StudyHall Manager</span>
          </div>
          <p className="text-gray-400">
            © 2024 StudyHall Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;