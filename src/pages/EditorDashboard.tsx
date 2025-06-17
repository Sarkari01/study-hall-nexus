import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Image, 
  Calendar, 
  Eye, 
  Send, 
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  LogOut
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EditorDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [city, setCity] = useState("");
  const [publishDate, setPublishDate] = useState("");

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stats = [
    {
      title: "Published Articles",
      value: "45",
      change: "+5 this week",
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Draft Articles",
      value: "12",
      change: "3 pending review",
      icon: <Edit className="h-5 w-5" />,
      color: "text-orange-600"
    },
    {
      title: "Total Views",
      value: "15.2K",
      change: "+12% this month",
      icon: <Eye className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Active Cities",
      value: "8",
      change: "Mumbai, Delhi, Pune",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  const recentArticles = [
    {
      title: "New Study Hall Opens in Andheri",
      city: "Mumbai",
      status: "Published",
      views: "1.2K",
      date: "Today",
      type: "News"
    },
    {
      title: "Tips for Effective Study Sessions",
      city: "All Cities",
      status: "Draft",
      views: "-",
      date: "Yesterday",
      type: "Tips"
    },
    {
      title: "Weekend Special: 50% Off on Bookings",
      city: "Delhi",
      status: "Scheduled",
      views: "-",
      date: "Tomorrow",
      type: "Promotion"
    },
    {
      title: "Student Success Stories",
      city: "Pune",
      status: "Published",
      views: "890",
      date: "2 days ago",
      type: "Story"
    }
  ];

  const sidebarItems = [
    { id: "create", label: "Create Article", icon: <Plus className="h-5 w-5" /> },
    { id: "manage", label: "Manage Content", icon: <FileText className="h-5 w-5" /> },
    { id: "media", label: "Media Library", icon: <Image className="h-5 w-5" /> },
    { id: "schedule", label: "Scheduler", icon: <Calendar className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <Eye className="h-5 w-5" /> },
    { 
      id: "logout", 
      label: "Sign Out", 
      icon: <LogOut className="h-5 w-5" />,
      onClick: handleLogout,
      className: "text-red-600 hover:text-red-700 hover:bg-red-50"
    }
  ];

  const handlePublish = () => {
    if (title.length < 10) {
      alert("Title must be at least 10 characters long");
      return;
    }
    if (content.length < 80) {
      alert("Content must be at least 80 characters long");
      return;
    }
    if (!city) {
      alert("Please select a city");
      return;
    }
    alert("Article published successfully!");
  };

  const handleSaveDraft = () => {
    alert("Article saved as draft!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        items={sidebarItems} 
        activeItem={activeTab} 
        onItemClick={(id) => {
          if (id === "logout") {
            handleLogout();
          } else {
            setActiveTab(id);
          }
        }}
        title="Editor Panel"
      />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editor Dashboard</h1>
          <p className="text-gray-600">Create and manage content for study hall students</p>
        </div>

        {activeTab === "create" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color} mt-1`}>
                          {stat.change}
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

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create New Article
                </CardTitle>
                <p className="text-sm text-gray-600">Keep it short and smart. Students skim.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Article Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter compelling title..." 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {title.length}/100 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="city">Target City *</Label>
                    <select 
                      id="city" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      <option value="all">All Cities</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="pune">Pune</option>
                      <option value="bangalore">Bangalore</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Write your article content here. Make it engaging and informative for students..."
                    className="mt-1 min-h-[200px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {content.length}/5000 characters (minimum 80 required)
                  </p>
                </div>

                <div>
                  <Label htmlFor="banner">Featured Image/Banner</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Image className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Banner must be 1200x400 px (PNG, JPG up to 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="news">News</option>
                      <option value="tips">Study Tips</option>
                      <option value="promotion">Promotions</option>
                      <option value="story">Success Stories</option>
                      <option value="announcement">Announcements</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input 
                      id="publishDate" 
                      type="datetime-local"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handlePublish} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Publish Now
                  </Button>
                  <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Article
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentArticles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{article.title}</h3>
                          <Badge variant="outline">{article.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{article.city}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                          {article.views !== "-" && (
                            <>
                              <span>•</span>
                              <span>{article.views} views</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={
                            article.status === 'Published' ? 'default' : 
                            article.status === 'Draft' ? 'secondary' : 'outline'
                          }
                        >
                          {article.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "media" && (
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <p className="text-sm text-gray-600">Manage your images and banners</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Media library will be available soon</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "schedule" && (
          <Card>
            <CardHeader>
              <CardTitle>Content Scheduler</CardTitle>
              <p className="text-sm text-gray-600">Schedule your content for optimal timing</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Scheduler will be available soon</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <p className="text-sm text-gray-600">Track performance of your articles</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Eye className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Analytics dashboard will be available soon</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditorDashboard;
