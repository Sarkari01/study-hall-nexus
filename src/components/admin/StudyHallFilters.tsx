
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import ExportButtons from "@/components/shared/ExportButtons";

interface StudyHallFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onCreateClick: () => void;
  isSubmitting: boolean;
  exportData: any[];
  exportColumns: string[];
}

const StudyHallFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreateClick,
  isSubmitting,
  exportData,
  exportColumns
}: StudyHallFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Study Hall
          </Button>

          <ExportButtons
            data={exportData}
            filename="study-halls"
            title="Study Halls Report"
            columns={exportColumns}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHallFilters;
