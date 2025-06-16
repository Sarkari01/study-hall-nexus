
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface BasicInformationProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
  merchants: any[];
  loadingMerchants: boolean;
  isAdmin: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  updateFormData,
  merchants,
  loadingMerchants,
  isAdmin
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Study Hall Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter study hall name"
            className="mt-1"
          />
        </div>

        {isAdmin ? (
          <div>
            <Label htmlFor="merchant">Select Merchant *</Label>
            <Select
              value={formData.merchantId}
              onValueChange={(value) => {
                const merchant = merchants.find((m: any) => m.id === value);
                updateFormData({
                  merchantId: value,
                  merchantName: merchant ? merchant.full_name : ''
                });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={loadingMerchants ? "Loading merchants..." : "Choose merchant"} />
              </SelectTrigger>
              <SelectContent>
                {merchants.map((merchant: any) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.full_name} - {merchant.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label>Merchant</Label>
            <Input
              value={formData.merchantName}
              disabled
              className="mt-1 bg-gray-50"
            />
          </div>
        )}

        <div>
          <Label htmlFor="location">Location Address *</Label>
          <Textarea
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="Enter complete address with city, state, and pincode"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your study hall..."
            className="mt-1"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
