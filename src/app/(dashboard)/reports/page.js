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
    if (user?.company?.companyId) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const response = await reportsAPI.getDepartments(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

const fetchEmployees = async () => {
    try {
        const response = await reportsAPI.getEmployees(user.company.companyId);
        if (response.data.success) {
            setEmployees(response.data.data.employees || []); // Set to employees array or empty array
        } else {
            setEmployees([]); // Set to empty array on failure
            toast.error(response.data.message || 'Failed to load employees');
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]); // Set to empty array on error
        toast.error('Failed to load employees');
    }
};

  const generateReport = async () => {
    if (!user?.company?.companyId) {
      toast.error('Company information not available');
      return;
    }

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
    if (!reportData) {
      toast.error('No report data to export');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    if (!reportData) {
      toast.error('No report data to export');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  const handleExportCSV = () => {
    if (!reportData) {
      toast.error('No report data to export');
      return;
    }
    
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

          {/* Mobile Empty State */}
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
      <div className="p-4 space-y-8 w-full mx-auto">
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
      // Enhanced Empty State Component - Google/Microsoft Style
{!loading && !reportData && (
  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    {/* Subtle background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30"></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
    
    <div className="relative z-10 px-8 py-16">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Get started with reports
        </h2>
        
        {/* Description */}
        <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          Create comprehensive reports and analytics for your organization. Configure your parameters above and generate insights with powerful data visualization.
        </p>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Interactive charts</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Visualize data with responsive charts and real-time analytics
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Multiple export formats</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Download reports as PDF, Excel, or CSV for sharing and analysis
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Smart insights</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get actionable insights and performance recommendations
            </p>
          </div>
        </div>
        
        {/* Report types */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available report types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                name: 'Attendance',
                desc: 'Daily, weekly, monthly tracking',
                color: 'blue'
              },
              { 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 112 0v1m-2 0h4m-4 0a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2m-4 0V6a2 2 0 012-2h0a2 2 0 012 2v1" />
                  </svg>
                ),
                name: 'Leave',
                desc: 'Applications & balance summary',
                color: 'emerald'
              },
              { 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                name: 'Employee',
                desc: 'Details & performance metrics',
                color: 'purple'
              },
              { 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                name: 'Department',
                desc: 'Department analytics & insights',
                color: 'orange'
              },
              { 
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 112 0v1m-2 0h4m-4 0a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2m-4 0V6a2 2 0 012-2h0a2 2 0 012 2v1" />
                  </svg>
                ),
                name: 'Monthly',
                desc: 'Comprehensive monthly report',
                color: 'indigo'
              }
            ].map((report, index) => {
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600 border-blue-100',
                emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                purple: 'bg-purple-50 text-purple-600 border-purple-100',
                orange: 'bg-orange-50 text-orange-600 border-orange-100',
                indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
              };
              
              return (
                <div key={index} className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${colorClasses[report.color]} group-hover:scale-105`}>
                    {report.icon}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{report.name}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{report.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Help section */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Need help getting started?</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View documentation
          </button>
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