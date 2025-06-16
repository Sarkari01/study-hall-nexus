import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Calendar, Shield, ArrowRight, CheckCircle, Star, Menu, X, ChevronDown, Mail, Phone, MapPin, UserCheck, Settings, BookOpen, Phone as PhoneIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard options for direct access
  const dashboardOptions = [
    {
      title: "Admin Dashboard",
      description: "Complete system administration and management",
      icon: Settings,
      path: "/admin",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Merchant Dashboard", 
      description: "Manage your study halls and bookings",
      icon: Building2,
      path: "/merchant",
      color: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Student Portal",
      description: "Book study halls and manage your sessions",
      icon: BookOpen,
      path: "/student", 
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Editor Dashboard",
      description: "Content management and moderation",
      icon: UserCheck,
      path: "/editor",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Telecaller Dashboard",
      description: "Customer support and communication",
      icon: PhoneIcon,
      path: "/telecaller",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Incharge Dashboard",
      description: "Regional management and oversight",
      icon: Users,
      path: "/incharge",
      color: "bg-indigo-600 hover:bg-indigo-700"
    }
  ];

  const testimonials = [{
    name: "Dr. Rajesh Kumar",
    role: "Study Center Director",
    content: "Sarkari Ninja has transformed how we manage our study hall operations. The booking system is seamless and our students love the convenience.",
    rating: 5
  }, {
    name: "Priya Sharma",
    role: "UPSC Aspirant",
    content: "Finding quality study spaces was always a challenge. This platform made it so easy to book and manage my study sessions.",
    rating: 5
  }, {
    name: "Amit Patel",
    role: "Study Hall Owner",
    content: "The merchant dashboard provides excellent insights and has helped us increase our bookings by 40% in just 3 months.",
    rating: 5
  }];
  
  const faqs = [{
    question: "How does the booking system work?",
    answer: "Students can browse available study halls, check real-time availability, and book their preferred slots instantly through our platform."
  }, {
    question: "What payment methods are supported?",
    answer: "We support all major payment methods including UPI, credit/debit cards, and digital wallets for seamless transactions."
  }, {
    question: "How do merchants get verified?",
    answer: "Our verification process includes document verification, site inspection, and quality assessment to ensure the best experience for students."
  }, {
    question: "Is there customer support available?",
    answer: "Yes, we provide 24/7 customer support through chat, email, and phone to assist both students and merchants."
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Notification Bar */}
      <div className="bg-emerald-600 text-white text-center py-2 text-sm">
        <span>🎉 Development Mode: Direct dashboard access enabled!</span>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Sarkari Ninja</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
                  Dashboards <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Admin</Link>
                    <Link to="/merchant" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Merchant</Link>
                    <Link to="/student" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Student</Link>
                    <Link to="/editor" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Editor</Link>
                  </div>
                </div>
              </div>
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">Contact</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">Free Demo</Button>
              <Link to="/admin">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Quick Access</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-emerald-600">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-emerald-600">Pricing</a>
                <a href="#testimonials" className="text-gray-700 hover:text-emerald-600">Reviews</a>
                <a href="#contact" className="text-gray-700 hover:text-emerald-600">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm">Free Demo</Button>
                  <Link to="/admin">
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">Quick Access</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Dashboard Access */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="text-emerald-600 block">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Development mode enabled. Access any dashboard directly to explore the features and functionality.
            </p>
          </div>

          {/* Dashboard Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {dashboardOptions.map((dashboard, index) => {
              const IconComponent = dashboard.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <CardTitle>{dashboard.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">
                      {dashboard.description}
                    </CardDescription>
                    <Link to={dashboard.path}>
                      <Button className={`w-full ${dashboard.color}`}>
                        Access Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">500+</div>
              <div className="text-sm text-gray-600">Study Halls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">10K+</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline operations and enhance the study experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Complete student lifecycle management with profiles, bookings, and usage analytics
                </CardDescription>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Profile Management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Booking History</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Usage Analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Building2 className="h-12 w-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Merchant Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Comprehensive merchant dashboard with verification and growth tools
                </CardDescription>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Easy Onboarding</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Revenue Analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Quality Verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Smart Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  AI-powered booking system with real-time availability and recommendations
                </CardDescription>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Real-time Availability</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Smart Recommendations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Flexible Scheduling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Advanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Enterprise-grade security with comprehensive admin controls and reporting
                </CardDescription>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Role-based Access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Data Encryption</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />Audit Trails</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle>Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹999</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Up to 100 bookings</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Basic analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Email support</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-emerald-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
              </div>
              <CardHeader className="text-center">
                <CardTitle>Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹2999</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Unlimited bookings</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Advanced analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Priority support</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />AI recommendations</li>
                </ul>
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Everything in Pro</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Custom integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />Dedicated support</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />SLA guarantee</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Study Hall Management?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Explore our dashboards and see the power of our platform in action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Try Admin Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/merchant">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white hover:bg-white text-slate-950 font-normal">
                Explore Merchant Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 text-xl font-bold">Sarkari Ninja</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing study hall management with intelligent technology and seamless user experiences. 
                Trusted by thousands of students and merchants across India.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-emerald-400 mr-3" />
                  <span className="text-gray-400">support@sarkarininja.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-emerald-400 mr-3" />
                  <span className="text-gray-400">+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-emerald-400 mr-3" />
                  <span className="text-gray-400">New Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dashboards</h3>
              <ul className="space-y-2">
                <li><Link to="/admin" className="text-gray-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
                <li><Link to="/merchant" className="text-gray-400 hover:text-white transition-colors">Merchant Portal</Link></li>
                <li><Link to="/student" className="text-gray-400 hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/editor" className="text-gray-400 hover:text-white transition-colors">Editor Dashboard</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <span className="text-gray-400">© 2024 Sarkari Ninja. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
