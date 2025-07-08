// src/app/(dashboard)/reports/components/ReportCharts.js
'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { FiBarChart, FiPieChart, FiTrendingUp } from 'react-icons/fi';

export default function ReportCharts({ reportData, reportType }) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderAttendanceCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return null;

    // Prepare daily trend data
    const dailyData = {};
    reportData.records.forEach(record => {
      if (record.AttendanceDate) {
        const date = new Date(record.AttendanceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyData[date]) {
          dailyData[date] = { date, Present: 0, Absent: 0, Late: 0, Total: 0 };
        }
        dailyData[date][record.AttendanceStatus] = (dailyData[date][record.AttendanceStatus] || 0) + 1;
        dailyData[date].Total += 1;
      }
    });

    const chartData = Object.values(dailyData).slice(-14); // Last 14 days

    // Prepare department wise data
    const deptData = {};
    reportData.records.forEach(record => {
      if (record.DepartmentName) {
        if (!deptData[record.DepartmentName]) {
          deptData[record.DepartmentName] = { name: record.DepartmentName, value: 0 };
        }
        if (record.AttendanceStatus === 'Present') {
          deptData[record.DepartmentName].value += 1;
        }
      }
    });

    const pieData = Object.values(deptData);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Attendance Trend */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiTrendingUp className="mr-3 text-blue-600" />
              Daily Attendance Trend
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="Present" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Late" 
                    stackId="1"
                    stroke="#F59E0B" 
                    fill="#F59E0B"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Absent" 
                    stackId="1"
                    stroke="#EF4444" 
                    fill="#EF4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        {pieData.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiPieChart className="mr-3 text-purple-600" />
                Department-wise Present Days
              </h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLeaveCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return null;

    // Monthly leave trends
    const monthlyData = {};
    reportData.records.forEach(record => {
      if (record.FromDate) {
        const month = new Date(record.FromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, Approved: 0, Pending: 0, Rejected: 0 };
        }
        monthlyData[month][record.ApplicationStatus] = (monthlyData[month][record.ApplicationStatus] || 0) + 1;
      }
    });

    const monthlyChartData = Object.values(monthlyData);

    // Leave type distribution
    const leaveTypeData = {};
    reportData.records.forEach(record => {
      if (record.LeaveTypeName && record.ApplicationStatus === 'Approved') {
        if (!leaveTypeData[record.LeaveTypeName]) {
          leaveTypeData[record.LeaveTypeName] = { name: record.LeaveTypeName, value: 0 };
        }
        leaveTypeData[record.LeaveTypeName].value += record.TotalDays || 1;
      }
    });

    const leaveTypePieData = Object.values(leaveTypeData);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Leave Trends */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiBarChart className="mr-3 text-emerald-600" />
              Monthly Leave Applications
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Leave Type Distribution */}
        {leaveTypePieData.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiPieChart className="mr-3 text-orange-600" />
                Leave Type Distribution (Days)
              </h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveTypePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value} days`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveTypePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmployeeCharts = () => {
    if (!reportData.departmentStats || reportData.departmentStats.length === 0) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department-wise Employee Distribution */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiBarChart className="mr-3 text-blue-600" />
              Employee Distribution by Department
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.departmentStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="DepartmentName" type="category" stroke="#64748b" fontSize={12} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="ActiveEmployees" fill="#10B981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="InactiveEmployees" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active vs Inactive Employees */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiPieChart className="mr-3 text-green-600" />
              Employee Status Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active Employees', value: reportData.summary?.activeEmployees || 0 },
                      { name: 'Inactive Employees', value: reportData.summary?.inactiveEmployees || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDepartmentCharts = () => {
    if (!reportData.departments || reportData.departments.length === 0) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Employee Count */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiBarChart className="mr-3 text-indigo-600" />
              Employees per Department
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.departments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="DepartmentName" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="TotalEmployees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Budget Distribution */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiPieChart className="mr-3 text-yellow-600" />
              Budget Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.departments.filter(dept => dept.Budget > 0).map(dept => ({
                      name: dept.DepartmentName,
                      value: dept.Budget
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.departments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
                            <p className="text-sm text-blue-600">
                              Budget: ₹{payload[0].value?.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlyCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return null;

    // Employee performance comparison
    const performanceData = reportData.records.map(record => ({
      name: record.EmployeeName?.substring(0, 15) + (record.EmployeeName?.length > 15 ? '...' : ''),
      fullName: record.EmployeeName,
      attendance: record.AttendancePercentage || 0,
      workingHours: record.TotalWorkingHours || 0,
      presentDays: record.PresentDays || 0
    })).sort((a, b) => b.attendance - a.attendance).slice(0, 10);

    return (
      <div className="grid grid-cols-1 gap-8">
        {/* Employee Performance Comparison */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiTrendingUp className="mr-3 text-blue-600" />
              Top Employee Performance (Attendance %)
            </h3>
          </div>
          <div className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={120} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900">{data.fullName}</p>
                            <p className="text-sm text-blue-600">Attendance: {data.attendance}%</p>
                            <p className="text-sm text-green-600">Present Days: {data.presentDays}</p>
                            <p className="text-sm text-purple-600">Working Hours: {data.workingHours}h</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="attendance" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render charts based on report type
  const renderCharts = () => {
    switch (reportType) {
      case 'attendance':
        return renderAttendanceCharts();
      case 'leave':
        return renderLeaveCharts();
      case 'employee':
        return renderEmployeeCharts();
      case 'department':
        return renderDepartmentCharts();
      case 'monthly':
        return renderMonthlyCharts();
      default:
        return null;
    }
  };

  return renderCharts();
}