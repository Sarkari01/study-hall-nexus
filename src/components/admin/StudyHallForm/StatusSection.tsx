
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface StatusSectionProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({ formData, updateFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Publication Status</Label>
            <p className="text-sm text-gray-500">Control visibility of this study hall</p>
          </div>
          <Select
            value={formData.status}
            onValueChange={(value: 'draft' | 'active' | 'inactive') => 
              updateFormData({ status: value })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSection;
