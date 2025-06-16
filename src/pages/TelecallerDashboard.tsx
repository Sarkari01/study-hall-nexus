
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, Calendar, MessageSquare, Filter, Search } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const TelecallerDashboard = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [searchQuery, setSearchQuery] = useState("");
  const { userProfile } = useAuth();

  // Mock data for leads
  const leads = [
    {
      id: 1,
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john@example.com",
      status: "new",
      priority: "high",
      source: "website",
      lastContact: "2025-01-15",
      notes: "Interested in premium study halls"
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "+91 87654 32109",
      email: "jane@example.com",
      status: "contacted",
      priority: "medium",
      source: "referral",
      lastContact: "2025-01-14",
      notes: "Looking for group study options"
    }
  ];

  // Mock data for follow-ups
  const followUps = [
    {
      id: 1,
      leadName: "John Doe",
      scheduledDate: "2025-01-16",
      scheduledTime: "10:00 AM",
      type: "call",
      notes: "Follow up on pricing discussion"
    },
    {
      id: 2,
      leadName: "Jane Smith",
      scheduledDate: "2025-01-16",
      scheduledTime: "2:00 PM",
      type: "email",
      notes: "Send study hall brochure"
    }
  ];

  const renderLeadsManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search leads by name, phone, or email..."
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

      {/* Leads List */}
      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <Badge variant={
                      lead.status === 'new' ? 'default' :
                      lead.status === 'contacted' ? 'secondary' :
                      lead.status === 'interested' ? 'outline' : 'destructive'
                    }>
                      {lead.status}
                    </Badge>
                    <Badge variant={
                      lead.priority === 'high' ? 'destructive' :
                      lead.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {lead.priority} priority
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{lead.phone}</span>
                    </div>
                    <div>Email: {lead.email}</div>
                    <div>Source: {lead.source}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{lead.notes}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFollowUps = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Follow-ups</h2>
      <div className="grid gap-4">
        {followUps.map((followUp) => (
          <Card key={followUp.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{followUp.leadName}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{followUp.scheduledTime}</span>
                    </div>
                    <Badge variant="outline">{followUp.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{followUp.notes}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Complete</Button>
                  <Button size="sm" variant="outline">Reschedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calls Today</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Phone className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-ups</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversions</p>
              <p className="text-2xl font-bold">6</p>
            </div>
            <Badge className="bg-green-100 text-green-800">26.7%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "leads":
        return renderLeadsManagement();
      case "followups":
        return renderFollowUps();
      default:
        return renderLeadsManagement();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Telecaller Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {userProfile?.full_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderStats()}
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="leads">Leads Management</TabsTrigger>
                  <TabsTrigger value="followups">Follow-ups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="leads" className="mt-6">
                  {renderLeadsManagement()}
                </TabsContent>
                
                <TabsContent value="followups" className="mt-6">
                  {renderFollowUps()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TelecallerDashboard;
