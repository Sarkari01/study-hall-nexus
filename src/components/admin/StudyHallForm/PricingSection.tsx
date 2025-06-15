
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface PricingSectionProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ formData, updateFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pricePerDay">Per Day (₹) *</Label>
            <Input
              id="pricePerDay"
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => updateFormData({ pricePerDay: e.target.value })}
              placeholder="50"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pricePerWeek">Per Week (₹)</Label>
            <Input
              id="pricePerWeek"
              type="number"
              value={formData.pricePerWeek}
              onChange={(e) => updateFormData({ pricePerWeek: e.target.value })}
              placeholder="300"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pricePerMonth">Per Month (₹)</Label>
            <Input
              id="pricePerMonth"
              type="number"
              value={formData.pricePerMonth}
              onChange={(e) => updateFormData({ pricePerMonth: e.target.value })}
              placeholder="1000"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
