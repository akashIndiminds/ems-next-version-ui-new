// src/app/(dashboard)/reports/components/ExportControls.js
'use client';

import { useState } from 'react';
import { FiDownload, FiPieChart, FiFileText, FiGrid, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ExportControls({ reportType, reportData }) {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PDF exported successfully!');
      // In real implementation, you would:
      // 1. Call the export API endpoint
      // 2. Generate PDF using a library like jsPDF or Puppeteer
      // 3. Download the file
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Simulate Excel generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Excel exported successfully!');
      // In real implementation, you would:
      // 1. Use libraries like ExcelJS or SheetJS
      // 2. Format the data properly
      // 3. Download the Excel file
    } catch (error) {
      toast.error('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    try {
      const data = reportData.records || reportData.employees || reportData.departments || [];
      if (!data.length) {
        toast.error('No data to export');
        return;
      }

      // Convert data to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const shareReport = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          text: `Check out this ${reportType} report from AttendanceHub`,
          url: window.location.href
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Report link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiPieChart className="mr-3 text-emerald-600" />
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Results
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* Export buttons */}
            <div className="flex space-x-2">
              <button
                onClick={exportToPDF}
                disabled={exporting}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
              >
                <FiDownload className="mr-2 w-4 h-4" />
                {exporting ? 'Exporting...' : 'PDF'}
              </button>
              
              <button
                onClick={exportToExcel}
                disabled={exporting}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
              >
                <FiGrid className="mr-2 w-4 h-4" />
                {exporting ? 'Exporting...' : 'Excel'}
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FiFileText className="mr-2 w-4 h-4" />
                CSV
              </button>
            </div>

            {/* Additional actions */}
            <div className="flex space-x-2 border-l border-gray-300 pl-3">
              <button
                onClick={printReport}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Print Report"
              >
                <FiFileText className="w-4 h-4" />
              </button>
              
              <button
                onClick={shareReport}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Share Report"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Report metadata */}
        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
          <span>
            Generated on: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          
          {reportData.records && (
            <span>
              Total Records: {reportData.records.length}
            </span>
          )}
          
          {reportData.summary && reportData.summary.totalEmployees && (
            <span>
              Employees: {reportData.summary.totalEmployees}
            </span>
          )}
        </div>
      </div>

      {/* Export options description */}
      <div className="p-6 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Export Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <FiDownload className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">PDF Export</p>
              <p>Formatted report with charts and summaries</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <FiGrid className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">Excel Export</p>
              <p>Spreadsheet format for data analysis</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <FiFileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">CSV Export</p>
              <p>Raw data for import into other systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}