
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Sarkari Ninja</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Admin Login
              </Button>
              <Button onClick={() => navigate('/merchant/auth')}>
                Merchant Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600"> Study Space</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with premium study halls across the city. Book by the hour, day, or month. 
            Focus on your studies while we handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/student')}>
              Find Study Halls
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/merchant/auth')}>
              List Your Study Hall
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                Prime Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Study halls in convenient locations across the city with easy access to transport and amenities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with like-minded students and create a productive learning environment together.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-6 w-6 text-blue-600 mr-2" />
                Quality Assured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All study halls are verified and maintained to ensure the best possible study experience.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of students and merchants already using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/student')}>
              I'm a Student
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/merchant/auth')}>
              I'm a Merchant
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Sarkari Ninja. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
