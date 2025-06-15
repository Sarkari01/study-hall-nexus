
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
import { Switch } from "@/components/ui/switch";
import { Search, Eye, Edit, Trash2, Plus, Package, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billing_period: string;
  validity_days: number;
  features: any;
  max_study_halls: number | null;
  max_cabins: number | null;
  has_analytics: boolean;
  has_chat_support: boolean;
  auto_renew_enabled: boolean;
  is_active: boolean;
  is_trial: boolean;
  trial_days: number;
  created_at: string;
}

const SubscriptionPlansTable = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billing_period: 'month',
    validity_days: '',
    max_study_halls: '',
    max_cabins: '',
    has_analytics: false,
    has_chat_support: false,
    auto_renew_enabled: true,
    is_active: true,
    is_trial: false,
    trial_days: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    try {
      const planData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        billing_period: formData.billing_period,
        validity_days: parseInt(formData.validity_days),
        max_study_halls: formData.max_study_halls ? parseInt(formData.max_study_halls) : null,
        max_cabins: formData.max_cabins ? parseInt(formData.max_cabins) : null,
        has_analytics: formData.has_analytics,
        has_chat_support: formData.has_chat_support,
        auto_renew_enabled: formData.auto_renew_enabled,
        is_active: formData.is_active,
        is_trial: formData.is_trial,
        trial_days: formData.is_trial ? parseInt(formData.trial_days) || 0 : 0,
        features: {}
      };

      const { error } = await supabase
        .from('subscription_plans')
        .insert([planData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan added successfully",
      });

      setIsAddModalOpen(false);
      resetForm();
      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add subscription plan",
        variant: "destructive",
      });
    }
  };

  const handleEditPlan = async () => {
    if (!selectedPlan) return;

    try {
      const planData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        billing_period: formData.billing_period,
        validity_days: parseInt(formData.validity_days),
        max_study_halls: formData.max_study_halls ? parseInt(formData.max_study_halls) : null,
        max_cabins: formData.max_cabins ? parseInt(formData.max_cabins) : null,
        has_analytics: formData.has_analytics,
        has_chat_support: formData.has_chat_support,
        auto_renew_enabled: formData.auto_renew_enabled,
        is_active: formData.is_active,
        is_trial: formData.is_trial,
        trial_days: formData.is_trial ? parseInt(formData.trial_days) || 0 : 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('subscription_plans')
        .update(planData)
        .eq('id', selectedPlan.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });

      setIsEditModalOpen(false);
      setSelectedPlan(null);
      resetForm();
      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan deleted successfully",
      });

      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription plan",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      billing_period: plan.billing_period,
      validity_days: plan.validity_days.toString(),
      max_study_halls: plan.max_study_halls?.toString() || '',
      max_cabins: plan.max_cabins?.toString() || '',
      has_analytics: plan.has_analytics,
      has_chat_support: plan.has_chat_support,
      auto_renew_enabled: plan.auto_renew_enabled,
      is_active: plan.is_active,
      is_trial: plan.is_trial,
      trial_days: plan.trial_days.toString()
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      billing_period: 'month',
      validity_days: '',
      max_study_halls: '',
      max_cabins: '',
      has_analytics: false,
      has_chat_support: false,
      auto_renew_enabled: true,
      is_active: true,
      is_trial: false,
      trial_days: ''
    });
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPlanModal = (isEdit: boolean) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit' : 'Add'} Subscription Plan</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter plan name"
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter plan description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billing_period">Billing Period</Label>
            <Select value={formData.billing_period} onValueChange={(value) => setFormData(prev => ({ ...prev, billing_period: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="validity_days">Validity (Days)</Label>
            <Input
              id="validity_days"
              type="number"
              value={formData.validity_days}
              onChange={(e) => setFormData(prev => ({ ...prev, validity_days: e.target.value }))}
              placeholder="Enter validity in days"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_study_halls">Max Study Halls</Label>
            <Input
              id="max_study_halls"
              type="number"
              value={formData.max_study_halls}
              onChange={(e) => setFormData(prev => ({ ...prev, max_study_halls: e.target.value }))}
              placeholder="Enter max study halls (-1 for unlimited)"
            />
          </div>
          <div>
            <Label htmlFor="max_cabins">Max Cabins</Label>
            <Input
              id="max_cabins"
              type="number"
              value={formData.max_cabins}
              onChange={(e) => setFormData(prev => ({ ...prev, max_cabins: e.target.value }))}
              placeholder="Enter max cabins (-1 for unlimited)"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="has_analytics"
              checked={formData.has_analytics}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_analytics: checked }))}
            />
            <Label htmlFor="has_analytics">Include Analytics</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has_chat_support"
              checked={formData.has_chat_support}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_chat_support: checked }))}
            />
            <Label htmlFor="has_chat_support">Include Chat Support</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_renew_enabled"
              checked={formData.auto_renew_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_renew_enabled: checked }))}
            />
            <Label htmlFor="auto_renew_enabled">Auto-renew Enabled</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active Plan</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_trial"
              checked={formData.is_trial}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_trial: checked }))}
            />
            <Label htmlFor="is_trial">Trial Plan</Label>
          </div>

          {formData.is_trial && (
            <div>
              <Label htmlFor="trial_days">Trial Days</Label>
              <Input
                id="trial_days"
                type="number"
                value={formData.trial_days}
                onChange={(e) => setFormData(prev => ({ ...prev, trial_days: e.target.value }))}
                placeholder="Enter trial period in days"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => {
            isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditPlan : handleAddPlan}>
            {isEdit ? 'Update' : 'Create'} Plan
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.is_active).length}</p>
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
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </DialogTrigger>
              {renderPlanModal(false)}
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans ({filteredPlans.length})</CardTitle>
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
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">₹{plan.price}</div>
                      <div className="text-sm text-gray-500">per {plan.billing_period}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{plan.validity_days} days</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {plan.max_study_halls && (
                          <Badge variant="outline" className="mr-1">
                            {plan.max_study_halls === -1 ? 'Unlimited' : plan.max_study_halls} Study Halls
                          </Badge>
                        )}
                        {plan.has_analytics && <Badge variant="outline" className="mr-1">Analytics</Badge>}
                        {plan.has_chat_support && <Badge variant="outline" className="mr-1">Chat Support</Badge>}
                        {plan.is_trial && <Badge variant="outline" className="mr-1">Trial</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
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
        {renderPlanModal(true)}
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansTable;
