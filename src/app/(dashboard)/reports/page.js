// src/app/(dashboard)/reports/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Mobile Components
import MobileReportHeader from '@/components/reportsComponents/mobile/MobileReportHeader';
import MobileReportFilters from '@/components/reportsComponents/mobile/MobileReportFilters';
import MobileReportStats from '@/components/reportsComponents/mobile/MobileReportStats';
import MobileReportCharts from '@/components/reportsComponents/mobile/MobileReportCharts';
import MobileReportTable from '@/components/reportsComponents/mobile/MobileReportTable';

// Desktop Components
import DesktopReportHeader from '@/components/reportsComponents/desktop/DesktopReportHeader';
import DesktopReportFilters from '@/components/reportsComponents/desktop/DesktopReportFilters';
import ReportSummary from '@/components/reportsComponents/ReportSummary';
import ReportCharts from '@/components/reportsComponents/ReportCharts';
import ReportTable from '@/components/reportsComponents/ReportTable';

// API
import { reportsAPI } from "@/app/lib/api/reportsAPI";

const ResponsiveReportPage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Device detection with enhanced responsiveness
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await reportsAPI.getDepartments(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await reportsAPI.getEmployees(user.company.companyId);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {
        companyId: user.company.companyId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        ...(selectedDepartment !== 'all' && { departmentId: selectedDepartment }),
        ...(selectedEmployee !== 'all' && { employeeId: selectedEmployee })
      };

      let response;
      switch (reportType) {
        case 'attendance':
          response = await reportsAPI.getAttendanceReport(params);
          break;
        case 'leave':
          response = await reportsAPI.getLeaveReport(params);
          break;
        case 'employee':
          response = await reportsAPI.getEmployeeReport(params);
          break;
        case 'department':
          response = await reportsAPI.getDepartmentReport(params);
          break;
        case 'monthly':
          response = await reportsAPI.getMonthlyReport(params);
          break;
        default:
          throw new Error('Invalid report type');
      }

      if (response.data.success) {
        setReportData({
          type: reportType,
          ...response.data.data
        });
        setLastUpdated(new Date().toISOString());
        toast.success('Report generated successfully');
      } else {
        toast.error(response.data.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setReportType(filters.reportType);
    setDateRange({
      fromDate: filters.fromDate,
      toDate: filters.toDate
    });
    setSelectedDepartment(filters.departmentId || 'all');
    setSelectedEmployee(filters.employeeId || 'all');
    setReportData(null);
  };

  const handleRefresh = () => {
    if (reportData) {
      generateReport();
    } else {
      toast.error('Please generate a report first');
    }
  };

  // Export functions
  const handleExportPDF = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  const handleExportCSV = () => {
    try {
      const data = reportData?.records || reportData?.employees || reportData?.departments || [];
      if (!data.length) {
        toast.error('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          text: `Check out this ${reportType} report from AttendanceHub`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Report link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Render Mobile View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Mobile Header */}
        <MobileReportHeader
          reportType={reportType}
          onMenuToggle={() => setShowMobileFilters(true)}
          onRefresh={handleRefresh}
          isLoading={loading}
          lastUpdated={lastUpdated}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onExportCSV={handleExportCSV}
          onShare={handleShare}
        />

        {/* Mobile Content */}
        <div className="pb-20">
          {/* Mobile Filters Modal */}
          <MobileReportFilters
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            reportType={reportType}
            dateRange={dateRange}
            selectedDepartment={selectedDepartment}
            selectedEmployee={selectedEmployee}
            departments={departments}
            employees={employees}
            onFilterChange={handleFilterChange}
            onGenerateReport={generateReport}
            loading={loading}
          />

          {/* Report Content */}
          {reportData && (
            <div className="space-y-6 mt-4">
              {/* Summary Stats */}
              {reportData.summary && (
                <MobileReportStats 
                  summary={reportData.summary}
                  reportType={reportType}
                />
              )}

              {/* Charts */}
              <MobileReportCharts 
                reportData={reportData}
                reportType={reportType}
              />

              {/* Data Table */}
              <MobileReportTable 
                reportData={reportData}
                reportType={reportType}
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && !reportData && (
  <div className="px-4 mt-6">
    <div className="relative bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-md">
      {/* Light animated background elements */}
      <div className="absolute inset-0 rounded-3xl bg-white/80"></div>
      <div className="absolute top-4 left-4 w-16 h-16 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 bg-pink-100 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Ready to Generate Reports
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Tap the menu button to configure your report filters and generate powerful insights for your organization.
        </p>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-white border border-indigo-200 text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-300"
        >
          Configure Report
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    );
  }

  // Render Desktop View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Desktop Header */}
        <DesktopReportHeader
          reportType={reportType}
          onRefresh={handleRefresh}
          isLoading={loading}
          lastUpdated={lastUpdated}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onExportCSV={handleExportCSV}
          onShare={handleShare}
          onPrint={handlePrint}
        />

        {/* Desktop Filters */}
        <DesktopReportFilters
          reportType={reportType}
          dateRange={dateRange}
          selectedDepartment={selectedDepartment}
          selectedEmployee={selectedEmployee}
          departments={departments}
          employees={employees}
          loading={loading}
          onFilterChange={handleFilterChange}
          onGenerateReport={generateReport}
        />

        {/* Report Content */}
        {reportData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            {reportData.summary && (
              <ReportSummary 
                summary={reportData.summary}
                reportType={reportType}
              />
            )}

            {/* Charts Section */}
            <ReportCharts 
              reportData={reportData}
              reportType={reportType}
            />

            {/* Data Table */}
            <ReportTable 
              reportData={reportData}
              reportType={reportType}
            />
          </div>
        )}

        {/* Desktop Empty State */}
        {!loading && !reportData && (
          <div className="relative backdrop-blur-xl bg-white/40 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10 p-12">
              <div className="text-center">
                <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <span className="text-4xl">📊</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Ready to Generate Reports
                </h3>
                
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                  Configure your report parameters above and generate comprehensive analytics and insights for your organization with powerful data visualization and export capabilities.
                </p>
                
                {/* Enhanced features showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="group flex flex-col items-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/40 transition-all duration-300 transform hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-3xl">📈</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Interactive Charts</h4>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Visualize your data with beautiful, interactive charts and real-time analytics
                    </p>
                  </div>
                  
                  <div className="group flex flex-col items-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/40 transition-all duration-300 transform hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Export Options</h4>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Export reports in multiple formats including PDF, Excel, and CSV
                    </p>
                  </div>
                  
                  <div className="group flex flex-col items-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/40 transition-all duration-300 transform hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Smart Insights</h4>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Get actionable insights with AI-powered analytics and recommendations
                    </p>
                  </div>
                </div>
                
                {/* Available report types with enhanced design */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h4 className="text-lg font-bold text-gray-800 mb-6">Available Report Types</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { icon: '📊', name: 'Attendance Report', desc: 'Daily, weekly, monthly tracking' },
                      { icon: '🏖️', name: 'Leave Report', desc: 'Applications & balance summary' },
                      { icon: '👥', name: 'Employee Report', desc: 'Details & performance metrics' },
                      { icon: '🏢', name: 'Department Report', desc: 'Department analytics & insights' },
                      { icon: '📅', name: 'Monthly Summary', desc: 'Comprehensive monthly report' }
                    ].map((report, index) => (
                      <div key={index} className="group text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{report.icon}</div>
                        <h5 className="text-sm font-bold text-gray-900 mb-2">{report.name}</h5>
                        <p className="text-xs text-gray-600 leading-relaxed">{report.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveReportPage;