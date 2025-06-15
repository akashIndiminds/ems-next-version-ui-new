// src/app/(dashboard)/reports/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI, employeeAPI, leaveAPI, departmentAPI } from '@/app/lib/api';
import { FiDownload, FiCalendar, FiUsers, FiClock, FiPieChart } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getByCompany(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let data = null;
      
      switch (reportType) {
        case 'attendance':
          data = await generateAttendanceReport();
          break;
        case 'leave':
          data = await generateLeaveReport();
          break;
        case 'employee':
          data = await generateEmployeeReport();
          break;
        case 'department':
          data = await generateDepartmentReport();
          break;
      }
      
      setReportData(data);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceReport = async () => {
    const response = await attendanceAPI.getRecords({
      companyId: user.company.companyId,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      departmentId: selectedDepartment !== 'all' ? selectedDepartment : undefined
    });

    if (response.data.success) {
      const records = response.data.data;
      
      // Process data for charts
      const dailyAttendance = {};
      const employeeStats = {};
      
      records.forEach(record => {
        const date = format(new Date(record.AttendanceDate), 'MMM dd');
        
        if (!dailyAttendance[date]) {
          dailyAttendance[date] = { date, present: 0, absent: 0, late: 0 };
        }
        
        if (record.AttendanceStatus === 'Present') {
          dailyAttendance[date].present++;
        } else if (record.AttendanceStatus === 'Absent') {
          dailyAttendance[date].absent++;
        } else if (record.AttendanceStatus === 'Late') {
          dailyAttendance[date].late++;
        }
        
        // Employee statistics
        if (!employeeStats[record.EmployeeID]) {
          employeeStats[record.EmployeeID] = {
            name: record.EmployeeName,
            present: 0,
            absent: 0,
            late: 0,
            totalDays: 0
          };
        }
        
        employeeStats[record.EmployeeID].totalDays++;
        employeeStats[record.EmployeeID][record.AttendanceStatus.toLowerCase()]++;
      });
      
      return {
        type: 'attendance',
        summary: {
          totalRecords: records.length,
          totalEmployees: Object.keys(employeeStats).length,
          avgAttendance: Math.round((records.filter(r => r.AttendanceStatus === 'Present').length / records.length) * 100)
        },
        chartData: Object.values(dailyAttendance),
        tableData: Object.values(employeeStats),
        rawData: records
      };
    }
    
    return null;
  };

  const generateLeaveReport = async () => {
    const response = await leaveAPI.getPending({
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate
    });

    if (response.data.success) {
      const leaves = response.data.data;
      
      // Process leave data
      const leaveTypeStats = {};
      const monthlyLeaves = {};
      
      leaves.forEach(leave => {
        // Leave type statistics
        if (!leaveTypeStats[leave.LeaveTypeName]) {
          leaveTypeStats[leave.LeaveTypeName] = { name: leave.LeaveTypeName, value: 0 };
        }
        leaveTypeStats[leave.LeaveTypeName].value++;
        
        // Monthly statistics
        const month = format(new Date(leave.FromDate), 'MMM yyyy');
        if (!monthlyLeaves[month]) {
          monthlyLeaves[month] = { month, approved: 0, pending: 0, rejected: 0 };
        }
        monthlyLeaves[month][leave.ApplicationStatus.toLowerCase()]++;
      });
      
      return {
        type: 'leave',
        summary: {
          totalLeaves: leaves.length,
          approved: leaves.filter(l => l.ApplicationStatus === 'Approved').length,
          pending: leaves.filter(l => l.ApplicationStatus === 'Pending').length,
          rejected: leaves.filter(l => l.ApplicationStatus === 'Rejected').length
        },
        pieData: Object.values(leaveTypeStats),
        chartData: Object.values(monthlyLeaves),
        tableData: leaves,
        rawData: leaves
      };
    }
    
    return null;
  };

  const generateEmployeeReport = async () => {
    const response = await employeeAPI.getAll({
      companyId: user.company.companyId,
      departmentId: selectedDepartment !== 'all' ? selectedDepartment : undefined
    });

    if (response.data.success) {
      const employees = response.data.data;
      
      // Department distribution
      const deptDistribution = {};
      const designationStats = {};
      
      employees.forEach(emp => {
        // Department stats
        if (!deptDistribution[emp.DepartmentName]) {
          deptDistribution[emp.DepartmentName] = { name: emp.DepartmentName, value: 0 };
        }
        deptDistribution[emp.DepartmentName].value++;
        
        // Designation stats
        if (!designationStats[emp.DesignationName]) {
          designationStats[emp.DesignationName] = 0;
        }
        designationStats[emp.DesignationName]++;
      });
      
      return {
        type: 'employee',
        summary: {
          totalEmployees: employees.length,
          activeEmployees: employees.filter(e => e.IsActive).length,
          inactiveEmployees: employees.filter(e => !e.IsActive).length,
          departments: Object.keys(deptDistribution).length
        },
        pieData: Object.values(deptDistribution),
        tableData: employees,
        rawData: employees
      };
    }
    
    return null;
  };

  const generateDepartmentReport = async () => {
    const deptResponse = await departmentAPI.getByCompany(user.company.companyId);
    
    if (deptResponse.data.success) {
      const departments = deptResponse.data.data;
      
      return {
        type: 'department',
        summary: {
          totalDepartments: departments.length,
          totalEmployees: departments.reduce((sum, d) => sum + (d.TotalEmployees || 0), 0),
          totalBudget: departments.reduce((sum, d) => sum + (d.Budget || 0), 0)
        },
        chartData: departments.map(d => ({
          name: d.DepartmentName,
          employees: d.TotalEmployees || 0,
          budget: d.Budget || 0
        })),
        tableData: departments,
        rawData: departments
      };
    }
    
    return null;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(`From: ${dateRange.fromDate} To: ${dateRange.toDate}`, 14, 35);
    
    // Add summary
    if (reportData?.summary) {
      let y = 50;
      doc.setFontSize(14);
      doc.text('Summary', 14, y);
      y += 10;
      
      doc.setFontSize(11);
      Object.entries(reportData.summary).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        doc.text(`${label}: ${value}`, 14, y);
        y += 7;
      });
    }
    
    // Add table using autoTable
    if (reportData?.tableData && reportData.tableData.length > 0) {
      const columns = Object.keys(reportData.tableData[0]).map(key => ({
        header: key.replace(/([A-Z])/g, ' $1').trim(),
        dataKey: key
      }));
      
      // Use autoTable function directly
      autoTable(doc, {
        columns,
        body: reportData.tableData,
        startY: 100,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    doc.save(`${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF exported successfully');
  };

  const exportToExcel = () => {
    if (!reportData || !reportData.rawData) return;
    
    const ws = XLSX.utils.json_to_sheet(reportData.rawData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    
    XLSX.writeFile(wb, `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Excel exported successfully');
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate and export various reports for your organization
        </p>
      </div>

      {/* Report filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setReportData(null);
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="attendance">Attendance Report</option>
              <option value="leave">Leave Report</option>
              <option value="employee">Employee Report</option>
              <option value="department">Department Report</option>
            </select>
          </div>
          
          {(reportType === 'attendance' || reportType === 'employee') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => setDateRange({...dateRange, fromDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) => setDateRange({...dateRange, toDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Export buttons */}
      {reportData && (
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Results
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={exportToPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FiDownload className="mr-2" />
                Export PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FiDownload className="mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report content */}
      {reportData && (
        <div className="space-y-8">
          {/* Summary Cards */}
          {reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(reportData.summary).map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm font-medium text-gray-500">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line/Bar Chart */}
            {reportData.chartData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {reportType === 'attendance' ? 'Daily Attendance' : 'Trend Analysis'}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={Object.keys(reportData.chartData[0])[0]} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(reportData.chartData[0]).slice(1).map((key, index) => (
                        <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {reportData.pieData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Data Table */}
          {reportData.tableData && reportData.tableData.length > 0 && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(reportData.tableData[0]).slice(0, 6).map(key => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.tableData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).slice(0, 6).map((value, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {reportData.tableData.length > 10 && (
                <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
                  Showing 10 of {reportData.tableData.length} records. Export to view all.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !reportData && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <FiPieChart className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Select report parameters and click Generate Report to view results
            </p>
          </div>
        </div>
      )}
    </div>
  );
}