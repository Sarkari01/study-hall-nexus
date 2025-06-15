
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Edit, Trash2, Eye, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import ImageUploader from '@/components/shared/ImageUploader';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  target_audience: string[];
  priority: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    target_audience: [] as string[],
    priority: 0,
    is_active: true,
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage banners",
          variant: "destructive"
        });
        return;
      }

      const bannerData = {
        ...formData,
        start_date: formData.start_date?.toISOString(),
        end_date: formData.end_date?.toISOString(),
        created_by: user.id
      };

      if (selectedBanner) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', selectedBanner.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Banner updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Banner created successfully"
        });
      }

      setIsFormOpen(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Banner deleted successfully"
      });
      
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      video_url: '',
      target_audience: [],
      priority: 0,
      is_active: true,
      start_date: undefined,
      end_date: undefined
    });
    setSelectedBanner(null);
  };

  const openEditForm = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url || '',
      video_url: banner.video_url || '',
      target_audience: banner.target_audience || [],
      priority: banner.priority,
      is_active: banner.is_active,
      start_date: banner.start_date ? new Date(banner.start_date) : undefined,
      end_date: banner.end_date ? new Date(banner.end_date) : undefined
    });
    setIsFormOpen(true);
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, image_url: urls[0] }));
    }
  };

  const handleAudienceChange = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading banners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Banner
        </Button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {banner.image_url && (
                <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {banner.description}
                    </p>
                  </div>
                  <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>
                    {banner.target_audience.length > 0 
                      ? banner.target_audience.join(', ') 
                      : 'All users'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Priority: {banner.priority}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditForm(banner)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banner Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? 'Edit Banner' : 'Create New Banner'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <ImageUploader
                onImagesUploaded={handleImageUpload}
                currentImages={formData.image_url ? [formData.image_url] : []}
                maxImages={1}
                folder="banners"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <div className="flex gap-4">
                {['admin', 'merchant', 'student'].map((audience) => (
                  <div key={audience} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={audience}
                      checked={formData.target_audience.includes(audience)}
                      onChange={() => handleAudienceChange(audience)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={audience} className="capitalize">
                      {audience}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_date ? format(formData.end_date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.end_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
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
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {selectedBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerManager;
