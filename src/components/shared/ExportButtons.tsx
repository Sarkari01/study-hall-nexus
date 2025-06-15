
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF, formatDataForExport, checkBrowserSupport, exportForMobile } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

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
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();
  const exportData = formatDataForExport(data);
  const exportColumns = columns || (data.length > 0 ? Object.keys(data[0]) : []);
  const isMobile = window.innerWidth < 768;
  const browserSupport = checkBrowserSupport();

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(format);
    
    try {
      if (isMobile) {
        await exportForMobile(data, format, filename, title, exportColumns);
      } else {
        switch (format) {
          case 'csv':
            exportToCSV(exportData, filename);
            break;
          case 'excel':
            exportToExcel(exportData, filename);
            break;
          case 'pdf':
            exportToPDF(exportData, exportColumns, filename, title);
            break;
        }
      }

      toast({
        title: "Export Successful",
        description: `${format.toUpperCase()} file has been downloaded`,
      });
    } catch (error) {
      console.error(`Export error (${format}):`, error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : `Failed to export ${format.toUpperCase()} file`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  if (data.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="opacity-50">
        <Download className="h-4 w-4 mr-2" />
        No data to export
      </Button>
    );
  }

  // Mobile: Use dropdown menu to save space
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!!isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => handleExport('csv')}
            disabled={!browserSupport.csv || isExporting === 'csv'}
          >
            <FileText className="h-4 w-4 mr-2" />
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleExport('excel')}
            disabled={!browserSupport.excel || isExporting === 'excel'}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleExport('pdf')}
            disabled={!browserSupport.pdf || isExporting === 'pdf'}
          >
            <Table className="h-4 w-4 mr-2" />
            PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Desktop: Show individual buttons
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('csv')}
        disabled={!browserSupport.csv || isExporting === 'csv'}
      >
        {isExporting === 'csv' ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FileText className="h-4 w-4 mr-2" />
        )}
        CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('excel')}
        disabled={!browserSupport.excel || isExporting === 'excel'}
      >
        {isExporting === 'excel' ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4 mr-2" />
        )}
        Excel
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('pdf')}
        disabled={!browserSupport.pdf || isExporting === 'pdf'}
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Table className="h-4 w-4 mr-2" />
        )}
        PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
