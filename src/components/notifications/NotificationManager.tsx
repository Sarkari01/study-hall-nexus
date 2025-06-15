
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send, Users, Building2, UserCheck, Image as ImageIcon, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import ImageUploader from '@/components/shared/ImageUploader';

const NotificationManager = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [notificationImages, setNotificationImages] = useState<string[]>([]);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "Please log in to send notifications",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('send-notification', {
        body: {
          title,
          message,
          targetAudience,
          images: notificationImages
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: `Notification sent to ${response.data.sent_count} users`,
      });
      
      setTitle('');
      setMessage('');
      setNotificationImages([]);
      setTargetAudience('all');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setNotificationImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Push Notifications</h1>
          <p className="text-gray-600">Send real-time notifications with images to users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
            />
          </div>

          <div>
            <Label>Notification Images</Label>
            <div className="space-y-3">
              {/* Image Preview Grid */}
              {notificationImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {notificationImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Notification ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageUploaderOpen(true)}
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Images ({notificationImages.length}/3)
              </Button>
            </div>
          </div>

          <div>
            <Label>Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Users
                  </div>
                </SelectItem>
                <SelectItem value="students">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Students Only
                  </div>
                </SelectItem>
                <SelectItem value="merchants">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Merchants Only
                  </div>
                </SelectItem>
                <SelectItem value="admins">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Admins Only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSendNotification} 
            disabled={sending || !title || !message}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Image Uploader Dialog */}
      <Dialog open={isImageUploaderOpen} onOpenChange={setIsImageUploaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Images to Notification</DialogTitle>
          </DialogHeader>
          
          <ImageUploader
            onImagesUploaded={(urls) => {
              setNotificationImages(prev => [...prev, ...urls].slice(0, 3)); // Limit to 3 images
              setIsImageUploaderOpen(false);
            }}
            currentImages={notificationImages}
            maxImages={3}
            folder="notifications"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationManager;
