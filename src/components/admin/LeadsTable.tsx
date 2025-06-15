import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Phone, Mail, User, Star, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'ads' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo: string;
  score: number;
  message: string;
  estimatedValue: number;
  createdAt: string;
  lastContactDate?: string;
  notes: string;
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website' as Lead['source'],
    assignedTo: '',
    message: '',
    estimatedValue: '',
    notes: ''
  });
  const { toast } = useToast();

  const mockLeads: Lead[] = [
    {
      id: 1,
      name: "Arjun Kapoor",
      email: "arjun.kapoor@email.com",
      phone: "+91 9876543210",
      source: 'website',
      status: 'new',
      assignedTo: "Admin Staff",
      score: 85,
      message: "Looking for a quiet study space near CP for competitive exam preparation",
      estimatedValue: 5000,
      createdAt: "2024-06-14",
      notes: "High potential lead, premium location preference"
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya.singh@email.com",
      phone: "+91 9876543211",
      source: 'referral',
      status: 'contacted',
      assignedTo: "Sales Team",
      score: 92,
      message: "Need study hall for group study sessions, referred by existing customer",
      estimatedValue: 8000,
      createdAt: "2024-06-13",
      lastContactDate: "2024-06-14",
      notes: "Already contacted, scheduled demo for tomorrow"
    },
    {
      id: 3,
      name: "Rohit Sharma",
      email: "rohit.sharma@email.com",
      phone: "+91 9876543212",
      source: 'social',
      status: 'qualified',
      assignedTo: "Admin Staff",
      score: 78,
      message: "Interested in monthly packages for CA preparation",
      estimatedValue: 15000,
      createdAt: "2024-06-12",
      lastContactDate: "2024-06-13",
      notes: "Budget confirmed, looking for long-term commitment"
    },
    {
      id: 4,
      name: "Neha Gupta",
      email: "neha.gupta@email.com",
      phone: "+91 9876543213",
      source: 'ads',
      status: 'converted',
      assignedTo: "Sales Team",
      score: 95,
      message: "Already booked premium study room, very satisfied",
      estimatedValue: 12000,
      createdAt: "2024-06-10",
      lastContactDate: "2024-06-11",
      notes: "Successfully converted, potential for referrals"
    }
  ];

  const staffMembers = ["Admin Staff", "Sales Team", "Manager", "Support Team"];
  const leadSources = ["website", "referral", "social", "ads", "direct"];

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
        description: "Failed to fetch leads data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    try {
      const newLead: Lead = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        assignedTo: formData.assignedTo,
        message: formData.message,
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        notes: formData.notes,
        status: 'new',
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        createdAt: new Date().toISOString().split('T')[0]
      };

      setLeads(prev => [...prev, newLead]);
      resetForm();
      setIsAddModalOpen(false);

      toast({
        title: "Success",
        description: "Lead added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive",
      });
    }
  };

  const handleEditLead = async () => {
    if (!selectedLead) return;

    try {
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id 
          ? { 
              ...lead, 
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              source: formData.source,
              assignedTo: formData.assignedTo,
              message: formData.message,
              estimatedValue: parseFloat(formData.estimatedValue) || 0,
              notes: formData.notes
            }
          : lead
      ));

      setIsEditModalOpen(false);
      setSelectedLead(null);
      resetForm();

      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              status: newStatus as Lead['status'],
              lastContactDate: ['contacted', 'qualified', 'converted'].includes(newStatus) 
                ? new Date().toISOString().split('T')[0] 
                : lead.lastContactDate
            }
          : lead
      ));

      toast({
        title: "Success",
        description: `Lead status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      assignedTo: lead.assignedTo,
      message: lead.message,
      estimatedValue: lead.estimatedValue.toString(),
      notes: lead.notes
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: 'website',
      assignedTo: '',
      message: '',
      estimatedValue: '',
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'contacted': return 'default';
      case 'qualified': return 'outline';
      case 'converted': return 'default';
      case 'lost': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'referral': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'ads': return 'bg-orange-100 text-orange-800';
      case 'direct': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold">{leads.filter(l => l.status === 'new').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold">{leads.filter(l => l.status === 'contacted').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold">{leads.filter(l => l.status === 'qualified').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold">{leads.filter(l => l.status === 'converted').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {leadSources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter lead name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        value={formData.estimatedValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                        placeholder="Enter estimated value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value as Lead['source'] }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map(source => (
                            <SelectItem key={source} value={source}>
                              {source.charAt(0).toUpperCase() + source.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.map(staff => (
                            <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter lead message or requirements"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter internal notes"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLead}>
                      Add Lead
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Estimated Value</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">Created: {lead.createdAt}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSourceColor(lead.source)}>
                        {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="font-medium">{lead.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">₹{lead.estimatedValue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(lead)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(lead)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLead(lead.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter lead name"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit-estimatedValue">Estimated Value (₹)</Label>
                <Input
                  id="edit-estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                  placeholder="Enter estimated value"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value as Lead['source'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSources.map(source => (
                      <SelectItem key={source} value={source}>
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-assignedTo">Assigned To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter lead message or requirements"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter internal notes"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditLead}>
                Update Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label>Score</Label>
                  <p className="font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {selectedLead.score}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{selectedLead.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <Badge className={getSourceColor(selectedLead.source)}>
                    {selectedLead.source.charAt(0).toUpperCase() + selectedLead.source.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label>Estimated Value</Label>
                  <p className="font-medium text-green-600">₹{selectedLead.estimatedValue.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label>Message</Label>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedLead.message}</p>
              </div>
              <div>
                <Label>Notes</Label>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedLead.notes}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsTable;
