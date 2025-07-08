// src/app/(dashboard)/reports/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiBarChart, FiPieChart } from 'react-icons/fi';
import ReportFilters from './components/ReportFilters';
import ReportSummary from './components/ReportSummary';
import ReportCharts from './components/ReportCharts';
import ReportTable from './components/ReportTable';
import ExportControls from './components/ExportControls';
import EmptyState from './components/EmptyState';
import { reportsAPI } from "@/app/lib/api/reportsAPI"; // Adjust the import path as necessary
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { user } = useAuth();
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
    setReportData(null); // Clear previous report data
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Generate comprehensive reports and insights for your organization
          </p>
        </div>

        {/* Report Filters */}
        <ReportFilters
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

        {/* Export Controls */}
        {reportData && (
          <ExportControls 
            reportType={reportType}
            reportData={reportData}
          />
        )}

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

        {/* Empty State */}
        {!loading && !reportData && <EmptyState />}
      </div>
    </div>
  );
}