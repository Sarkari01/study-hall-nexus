
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate timestamp for unique filename
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.csv`;
    
    XLSX.writeFile(wb, finalFilename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

export const exportToExcel = (data: any[], filename: string) => {
  try {
    // Format data for better Excel compatibility
    const formattedData = data.map(row => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        let value = row[key];
        // Handle special characters and formatting
        if (typeof value === 'string') {
          // Remove extra whitespace and clean up text
          value = value.trim();
        }
        newRow[key] = value;
      });
      return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-adjust column widths
    const cols = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15) // Minimum width of 15 characters
    }));
    ws['!cols'] = cols;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Generate timestamp for unique filename
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    XLSX.writeFile(wb, finalFilename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export Excel file');
  }
};

export const exportToPDF = (data: any[], columns: string[], filename: string, title: string) => {
  try {
    const doc = new jsPDF({
      orientation: columns.length > 6 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 20);
    
    // Add export date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableData = data.map(row => 
      columns.map(col => {
        let value = row[col] || '';
        // Truncate long text for PDF readability
        if (typeof value === 'string' && value.length > 50) {
          value = value.substring(0, 47) + '...';
        }
        return value;
      })
    );
    
    // Auto-fit columns based on content
    const columnWidths = columns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...data.map(row => String(row[col] || '').length)
      );
      return Math.min(Math.max(maxLength * 2, 20), 40); // Min 20mm, max 40mm
    });
    
    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 40,
      styles: { 
        fontSize: columns.length > 8 ? 6 : 8,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: { 
        fillColor: [66, 139, 202],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: columnWidths.reduce((acc, width, index) => {
        acc[index] = { cellWidth: width };
        return acc;
      }, {} as any),
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }
    });
    
    // Generate timestamp for unique filename
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.pdf`;
    
    doc.save(finalFilename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF file');
  }
};

export const formatDataForExport = (data: any[]) => {
  return data.map(item => {
    const formatted: any = {};
    Object.keys(item).forEach(key => {
      let value = item[key];
      
      if (value === null || value === undefined) {
        formatted[key] = '';
      } else if (typeof value === 'object' && value !== null) {
        // Handle arrays and objects
        if (Array.isArray(value)) {
          formatted[key] = value.join(', ');
        } else {
          formatted[key] = JSON.stringify(value);
        }
      } else if (typeof value === 'boolean') {
        formatted[key] = value ? 'Yes' : 'No';
      } else {
        // Clean up strings and numbers
        formatted[key] = String(value).trim();
      }
    });
    return formatted;
  });
};

// Utility function to validate browser support
export const checkBrowserSupport = () => {
  const isSupported = {
    csv: true, // CSV is universally supported
    excel: !!(window.Blob && window.URL && window.URL.createObjectURL),
    pdf: !!(window.Blob && window.URL)
  };
  
  return isSupported;
};

// Mobile-optimized export function
export const exportForMobile = (data: any[], format: 'csv' | 'excel' | 'pdf', filename: string, title?: string, columns?: string[]) => {
  const support = checkBrowserSupport();
  
  if (!support[format]) {
    throw new Error(`${format.toUpperCase()} export is not supported on this browser`);
  }
  
  // For mobile, we might want to limit the data or columns to improve performance
  const isMobile = window.innerWidth < 768;
  let exportData = data;
  
  if (isMobile && data.length > 1000) {
    // Limit to first 1000 rows on mobile for performance
    exportData = data.slice(0, 1000);
    console.warn('Data limited to 1000 rows for mobile export');
  }
  
  const formattedData = formatDataForExport(exportData);
  
  switch (format) {
    case 'csv':
      exportToCSV(formattedData, filename);
      break;
    case 'excel':
      exportToExcel(formattedData, filename);
      break;
    case 'pdf':
      if (columns && title) {
        exportToPDF(formattedData, columns, filename, title);
      } else {
        throw new Error('PDF export requires columns and title parameters');
      }
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
