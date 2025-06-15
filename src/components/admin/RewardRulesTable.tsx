
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon, Gift, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import ExportButtons from "@/components/shared/ExportButtons";

interface RewardRule {
  id: string;
  name: string;
  description: string | null;
  trigger_type: 'signup' | 'referral' | 'booking_milestone' | 'subscription_renewal' | 'campaign';
  trigger_condition: any;
  reward_points: number;
  reward_amount: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
}

const RewardRulesTable = () => {
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'signup' as RewardRule['trigger_type'],
    trigger_condition: {},
    reward_points: 0,
    reward_amount: 0,
    is_active: true,
    valid_from: null as Date | null,
    valid_until: null as Date | null
  });

  useEffect(() => {
    fetchRewardRules();
  }, []);

  const fetchRewardRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedRules = (data || []).map(rule => ({
        ...rule,
        trigger_type: rule.trigger_type as RewardRule['trigger_type']
      }));
      
      setRewardRules(typedRules);
    } catch (error: any) {
      console.error('Error fetching reward rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reward rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ruleData = {
        ...formData,
        created_by: '00000000-0000-0000-0000-000000000000', // Mock admin user
        valid_from: formData.valid_from?.toISOString() || null,
        valid_until: formData.valid_until?.toISOString() || null
      };

      if (editingRule) {
        const { error } = await supabase
          .from('reward_rules')
          .update(ruleData)
          .eq('id', editingRule.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Reward rule updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('reward_rules')
          .insert([ruleData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Reward rule created successfully",
        });
      }

      setDialogOpen(false);
      setEditingRule(null);
      resetForm();
      fetchRewardRules();
    } catch (error: any) {
      console.error('Error saving reward rule:', error);
      toast({
        title: "Error",
        description: "Failed to save reward rule",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (rule: RewardRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      trigger_type: rule.trigger_type,
      trigger_condition: rule.trigger_condition || {},
      reward_points: rule.reward_points,
      reward_amount: rule.reward_amount,
      is_active: rule.is_active,
      valid_from: rule.valid_from ? new Date(rule.valid_from) : null,
      valid_until: rule.valid_until ? new Date(rule.valid_until) : null
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward rule?')) return;

    try {
      const { error } = await supabase
        .from('reward_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reward rule deleted successfully",
      });
      fetchRewardRules();
    } catch (error: any) {
      console.error('Error deleting reward rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete reward rule",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_type: 'signup',
      trigger_condition: {},
      reward_points: 0,
      reward_amount: 0,
      is_active: true,
      valid_from: null,
      valid_until: null
    });
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels = {
      signup: 'Sign Up',
      referral: 'Referral',
      booking_milestone: 'Booking Milestone',
      subscription_renewal: 'Subscription Renewal',
      campaign: 'Campaign'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredRules = rewardRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || rule.trigger_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold">{rewardRules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold">{rewardRules.filter(r => r.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">{rewardRules.reduce((sum, r) => sum + r.reward_points, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Rewards</p>
                <p className="text-2xl font-bold">₹{rewardRules.reduce((sum, r) => sum + r.reward_amount, 0)}</p>
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
                  placeholder="Search reward rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="signup">Sign Up</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="booking_milestone">Booking Milestone</SelectItem>
                <SelectItem value="subscription_renewal">Subscription Renewal</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
              </SelectContent>
            </Select>
            
            <ExportButtons 
              data={filteredRules}
              filename="reward_rules"
              title="Reward Rules Report"
              columns={['name', 'trigger_type', 'reward_points', 'reward_amount', 'is_active', 'created_at']}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingRule(null); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reward Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingRule ? 'Edit Reward Rule' : 'Create New Reward Rule'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Sign Up Bonus"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Reward for new user sign up"
                    />
                  </div>

                  <div>
                    <Label htmlFor="trigger_type">Trigger Type</Label>
                    <Select value={formData.trigger_type} onValueChange={(value: RewardRule['trigger_type']) => setFormData({...formData, trigger_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="signup">Sign Up</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="booking_milestone">Booking Milestone</SelectItem>
                        <SelectItem value="subscription_renewal">Subscription Renewal</SelectItem>
                        <SelectItem value="campaign">Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reward_points">Reward Points</Label>
                      <Input
                        id="reward_points"
                        type="number"
                        value={formData.reward_points}
                        onChange={(e) => setFormData({...formData, reward_points: parseInt(e.target.value)})}
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward_amount">Reward Amount (₹)</Label>
                      <Input
                        id="reward_amount"
                        type="number"
                        value={formData.reward_amount}
                        onChange={(e) => setFormData({...formData, reward_amount: parseFloat(e.target.value)})}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Valid From (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.valid_from ? format(formData.valid_from, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.valid_from || undefined}
                            onSelect={(date) => setFormData({...formData, valid_from: date || null})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Valid Until (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.valid_until ? format(formData.valid_until, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.valid_until || undefined}
                            onSelect={(date) => setFormData({...formData, valid_until: date || null})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingRule ? 'Update' : 'Create'} Rule
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Reward Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Rules ({filteredRules.length})</CardTitle>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Trigger Type</TableHead>
                  <TableHead>Rewards</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div className="font-medium">{rule.name}</div>
                      {rule.description && (
                        <div className="text-sm text-gray-500">{rule.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTriggerTypeLabel(rule.trigger_type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {rule.reward_points > 0 && (
                          <div className="text-sm font-medium">{rule.reward_points} points</div>
                        )}
                        {rule.reward_amount > 0 && (
                          <div className="text-sm font-medium text-green-600">₹{rule.reward_amount}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rule.valid_from && rule.valid_until ? (
                          <>
                            {format(new Date(rule.valid_from), "MMM dd")} - {format(new Date(rule.valid_until), "MMM dd, yyyy")}
                          </>
                        ) : rule.valid_from ? (
                          <>From {format(new Date(rule.valid_from), "MMM dd, yyyy")}</>
                        ) : rule.valid_until ? (
                          <>Until {format(new Date(rule.valid_until), "MMM dd, yyyy")}</>
                        ) : (
                          'Always Active'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default RewardRulesTable;
