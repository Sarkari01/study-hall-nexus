
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  folder?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  currentImages = [],
  maxImages = 5,
  folder = 'general',
  className = ''
}) => {
  const { uploadMultipleImages, isUploading } = useImageUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remainingSlots = maxImages - currentImages.length;
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);
    
    if (filesToUpload.length > 0) {
      const uploadedUrls = await uploadMultipleImages(filesToUpload, folder);
      if (uploadedUrls.length > 0) {
        onImagesUploaded([...currentImages, ...uploadedUrls]);
      }
    }
  }, [currentImages, maxImages, folder, uploadMultipleImages, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    disabled: isUploading || currentImages.length >= maxImages
  });

  const removeImage = (indexToRemove: number) => {
    const newImages = currentImages.filter((_, index) => index !== indexToRemove);
    onImagesUploaded(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
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

      {/* Upload Area */}
      {currentImages.length < maxImages && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer ${
                isDragActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p>Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8" />
                    <div>
                      <p className="font-medium">
                        {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse ({currentImages.length}/{maxImages})
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;
