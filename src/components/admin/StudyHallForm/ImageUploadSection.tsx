
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface ImageUploadSectionProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ formData, updateFormData }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      updateFormData({
        images: [...formData.images, ...newImages],
        mainImage: formData.mainImage || newImages[0]
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({
      images: newImages,
      mainImage: formData.mainImage === formData.images[index] ? newImages[0] || '' : formData.mainImage
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-3"
          />
          <p className="text-sm text-gray-500">Upload multiple images. First image will be the main image.</p>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Study hall ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg border-2 ${
                    image === formData.mainImage ? 'border-blue-500' : 'border-gray-200'
                  }`}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
                {image === formData.mainImage && (
                  <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
