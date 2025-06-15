
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, WebP, or GIF files only.",
          variant: "destructive"
        });
        return null;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive"
        });
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload images.",
          variant: "destructive"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[], folder: string = 'general'): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading
  };
};
