
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Table, FileSpreadsheet } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF, formatDataForExport } from "@/utils/exportUtils";

interface ExportButtonsProps {
  data: any[];
  filename: string;
  title: string;
  columns?: string[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  data, 
  filename, 
  title, 
  columns 
}) => {
  const exportData = formatDataForExport(data);
  const exportColumns = columns || (data.length > 0 ? Object.keys(data[0]) : []);

  const handleCSVExport = () => {
    exportToCSV(exportData, `${filename}_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExcelExport = () => {
    exportToExcel(exportData, `${filename}_${new Date().toISOString().split('T')[0]}`);
  };

  const handlePDFExport = () => {
    exportToPDF(exportData, exportColumns, `${filename}_${new Date().toISOString().split('T')[0]}`, title);
  };

  if (data.length === 0) {
    return (
      <div className="flex gap-2 opacity-50">
        <Button variant="outline" size="sm" disabled>
          <Download className="h-4 w-4 mr-2" />
          No data to export
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCSVExport}>
        <FileText className="h-4 w-4 mr-2" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExcelExport}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handlePDFExport}>
        <Table className="h-4 w-4 mr-2" />
        PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
