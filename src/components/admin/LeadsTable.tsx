
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Phone, Mail, MapPin, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  location: string;
  leadSource: 'website' | 'referral' | 'social_media' | 'google_ads' | 'direct';
  status: 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  estimatedRevenue: number;
  notes: string;
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  nextFollowUp: string;
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const { toast } = useToast();

  const mockLeads: Lead[] = [
    {
      id: 1,
      name: "Priya Mehta",
      email: "priya.mehta@email.com",
      phone: "+91 98765 43210",
      businessName: "Mehta Study Point",
      location: "Janakpuri, Delhi",
      leadSource: 'website',
      status: 'new',
      priority: 'high',
      estimatedRevenue: 50000,
      notes: "Interested in premium study hall setup. Has existing space.",
      assignedTo: "Sales Team A",
      createdDate: "2024-06-14",
      lastContact: "2024-06-14",
      nextFollowUp: "2024-06-15"
    },
    {
      id: 2,
      name: "Arjun Sharma",
      email: "arjun.business@email.com", 
      phone: "+91 87654 32109",
      businessName: "Sharma Learning Hub",
      location: "Rohini, Delhi",
      leadSource: 'referral',
      status: 'contacted',
      priority: 'medium',
      estimatedRevenue: 35000,
      notes: "Contacted via phone. Scheduled demo for next week.",
      assignedTo: "Sales Team B",
      createdDate: "2024-06-12",
      lastContact: "2024-06-13",
      nextFollowUp: "2024-06-18"
    },
    {
      id: 3,
      name: "Kavita Singh",
      email: "kavita.singh@email.com",
      phone: "+91 76543 21098",
      businessName: "Singh Study Center",
      location: "Gurgaon, Haryana",
      leadSource: 'google_ads',
      status: 'interested',
      priority: 'high',
      estimatedRevenue: 75000,
      notes: "Very interested. Looking for multiple locations.",
      assignedTo: "Sales Team A",
      createdDate: "2024-06-10",
      lastContact: "2024-06-12",
      nextFollowUp: "2024-06-16"
    },
    {
      id: 4,
      name: "Ravi Kumar",
      email: "ravi.k@email.com",
      phone: "+91 65432 10987",
      businessName: "Kumar Coaching Institute",
      location: "Laxmi Nagar, Delhi",
      leadSource: 'social_media',
      status: 'qualified',
      priority: 'medium',
      estimatedRevenue: 40000,
      notes: "Qualified lead. Ready to proceed with basic setup.",
      assignedTo: "Sales Team C",
      createdDate: "2024-06-08",
      lastContact: "2024-06-11",
      nextFollowUp: "2024-06-17"
    },
    {
      id: 5,
      name: "Sunita Agarwal",
      email: "sunita.agarwal@email.com",
      phone: "+91 54321 09876",
      businessName: "Agarwal Study Zone",
      location: "Karol Bagh, Delhi",
      leadSource: 'direct',
      status: 'converted',
      priority: 'high',
      estimatedRevenue: 60000,
      notes: "Successfully converted. Onboarding in progress.",
      assignedTo: "Sales Team A",
      createdDate: "2024-06-05",
      lastContact: "2024-06-10",
      nextFollowUp: "N/A"
    },
    {
      id: 6,
      name: "Manoj Gupta",
      email: "manoj.gupta@email.com",
      phone: "+91 43210 98765",
      businessName: "Gupta Learning Academy",
      location: "Dwarka, Delhi",
      leadSource: 'website',
      status: 'rejected',
      priority: 'low',
      estimatedRevenue: 0,
      notes: "Not interested at this time. Budget constraints.",
      assignedTo: "Sales Team B",
      createdDate: "2024-06-01",
      lastContact: "2024-06-05",
      nextFollowUp: "N/A"
    }
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLeads(mockLeads);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateLeadStatus = (id: number, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : lead
    ));
    
    const lead = leads.find(l => l.id === id);
    toast({
      title: "Lead Updated",
      description: `${lead?.name} status changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-orange-100 text-orange-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return '🌐';
      case 'referral': return '👥';
      case 'social_media': return '📱';
      case 'google_ads': return '🎯';
      case 'direct': return '📞';
      default: return '❓';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.leadSource === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
                <p className="text-xs text-green-600">+{newLeads} new</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold">{qualifiedLeads}</p>
                <p className="text-xs text-blue-600">Ready to convert</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold">{convertedLeads}</p>
                <p className="text-xs text-green-600">{conversionRate}% rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Est. Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{leads.filter(l => l.status !== 'rejected').reduce((sum, l) => sum + l.estimatedRevenue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="google_ads">Google Ads</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Management ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Details</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Est. Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-xs text-gray-400">Assigned: {lead.assignedTo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.businessName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {lead.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{getSourceIcon(lead.leadSource)}</span>
                        <span className="text-sm capitalize">{lead.leadSource.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(lead.priority)}>
                        {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ₹{lead.estimatedRevenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.nextFollowUp !== 'N/A' ? lead.nextFollowUp : 'None'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Select onValueChange={(value) => updateLeadStatus(lead.id, value as Lead['status'])}>
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsTable;
