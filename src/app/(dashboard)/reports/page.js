// src/app/(dashboard)/reports/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { attendanceAPI, employeeAPI, leaveAPI, departmentAPI } from '@/app/lib/api';
import { FiDownload, FiCalendar, FiUsers, FiClock, FiPieChart, FiBarChart, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
        const date = new Date(record.AttendanceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
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
        const month = new Date(leave.FromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
    toast.success('PDF export feature coming soon!');
  };

  const exportToExcel = () => {
    toast.success('Excel export feature coming soon!');
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getSummaryIcon = (key) => {
    switch (key.toLowerCase()) {
      case 'totalrecords':
      case 'totalemployees':
      case 'totalleaves':
      case 'totaldepartments':
        return FiUsers;
      case 'avgattendance':
      case 'approved':
      case 'activeemployees':
        return FiTrendingUp;
      case 'pending':
      case 'rejected':
      case 'inactiveemployees':
        return FiClock;
      default:
        return FiBarChart;
    }
  };

  const getSummaryColor = (key) => {
    switch (key.toLowerCase()) {
      case 'approved':
      case 'activeemployees':
      case 'avgattendance':
        return 'from-emerald-500 to-emerald-600';
      case 'pending':
        return 'from-amber-500 to-amber-600';
      case 'rejected':
      case 'inactiveemployees':
        return 'from-red-500 to-red-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
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
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiBarChart className="mr-3 text-blue-600" />
              Report Configuration
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setReportData(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                >
                  <option value="attendance">📊 Attendance Report</option>
                  <option value="leave">🏖️ Leave Report</option>
                  <option value="employee">👥 Employee Report</option>
                  <option value="department">🏢 Department Report</option>
                </select>
              </div>
              
              {(reportType === 'attendance' || reportType === 'employee') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.fromDate}
                  onChange={(e) => setDateRange({...dateRange, fromDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.toDate}
                  onChange={(e) => setDateRange({...dateRange, toDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiBarChart className="mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Controls */}
        {reportData && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiPieChart className="mr-3 text-emerald-600" />
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Results
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={exportToPDF}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiDownload className="mr-2" />
                    Export PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiDownload className="mr-2" />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Content */}
        {reportData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            {reportData.summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(reportData.summary).map(([key, value]) => {
                  const IconComponent = getSummaryIcon(key);
                  const colorClass = getSummaryColor(key);
                  
                  return (
                    <div key={key} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
                      {/* Gradient accent bar */}
                      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                              {key.toLowerCase().includes('avg') && '%'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar/Line Chart */}
              {reportData.chartData && (
                <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FiBarChart className="mr-3 text-blue-600" />
                      {reportType === 'attendance' ? 'Daily Attendance Trend' : 'Analytics Overview'}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey={Object.keys(reportData.chartData[0])[0]} stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          {Object.keys(reportData.chartData[0]).slice(1).map((key, index) => (
                            <Bar 
                              key={key} 
                              dataKey={key} 
                              fill={COLORS[index % COLORS.length]} 
                              radius={[4, 4, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Pie Chart */}
              {reportData.pieData && (
                <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FiPieChart className="mr-3 text-purple-600" />
                      Distribution Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportData.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {reportData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Table */}
            {reportData.tableData && reportData.tableData.length > 0 && (
              <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FiUsers className="mr-3 text-emerald-600" />
                    Detailed Data Table
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {Object.keys(reportData.tableData[0]).slice(0, 6).map(key => (
                          <th
                            key={key}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.tableData.slice(0, 10).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).slice(0, 6).map((value, i) => (
                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {reportData.tableData.length > 10 && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 text-sm text-gray-600 font-medium border-t border-gray-200">
                    📊 Showing 10 of {reportData.tableData.length} records. Export to view complete data.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !reportData && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-12">
              <div className="text-center">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiPieChart className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Reports</h3>
                <p className="text-gray-600 mb-6">
                  Configure your report parameters above and click "Generate Report" to view comprehensive analytics and insights.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiBarChart className="mr-2 text-blue-500" />
                    Interactive Charts
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiDownload className="mr-2 text-emerald-500" />
                    Export Options
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiTrendingUp className="mr-2 text-purple-500" />
                    Analytics Insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}