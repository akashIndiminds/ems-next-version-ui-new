import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { FiBarChart, FiPieChart, FiTrendingUp, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';

const MobileReportCharts = ({ reportData, reportType }) => {
  const [currentChart, setCurrentChart] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 max-w-48">
          <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartsForReportType = () => {
    switch (reportType) {
      case 'attendance':
        return getAttendanceCharts();
      case 'leave':
        return getLeaveCharts();
      case 'employee':
        return getEmployeeCharts();
      case 'department':
        return getDepartmentCharts();
      case 'monthly':
        return getMonthlyCharts();
      default:
        return [];
    }
  };

  const getAttendanceCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return [];

    // Daily trend data (last 14 days)
    const dailyData = {};
    reportData.records.forEach(record => {
      if (record.AttendanceDate) {
        const date = new Date(record.AttendanceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyData[date]) {
          dailyData[date] = { date, Present: 0, Absent: 0, Late: 0 };
        }
        dailyData[date][record.AttendanceStatus] = (dailyData[date][record.AttendanceStatus] || 0) + 1;
      }
    });

    const trendData = Object.values(dailyData).slice(-7); // Last 7 days for mobile

    // Department data
    const deptData = {};
    reportData.records.forEach(record => {
      if (record.DepartmentName && record.AttendanceStatus === 'Present') {
        if (!deptData[record.DepartmentName]) {
          deptData[record.DepartmentName] = { name: record.DepartmentName, value: 0 };
        }
        deptData[record.DepartmentName].value += 1;
      }
    });

    const pieData = Object.values(deptData).slice(0, 5); // Top 5 for mobile

    return [
      {
        title: '📈 Daily Attendance Trend',
        subtitle: 'Last 7 days overview',
        icon: FiTrendingUp,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
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
        )
      },
      {
        title: '🏢 Department Distribution',
        subtitle: 'Present days by department',
        icon: FiPieChart,
        component: pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : <div className="flex items-center justify-center h-48 text-gray-500">No data available</div>
      }
    ];
  };

  const getLeaveCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return [];

    const monthlyData = {};
    reportData.records.forEach(record => {
      if (record.FromDate) {
        const month = new Date(record.FromDate).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, Approved: 0, Pending: 0, Rejected: 0 };
        }
        monthlyData[month][record.ApplicationStatus] = (monthlyData[month][record.ApplicationStatus] || 0) + 1;
      }
    });

    const monthlyChartData = Object.values(monthlyData).slice(-6); // Last 6 months

    const leaveTypeData = {};
    reportData.records.forEach(record => {
      if (record.LeaveTypeName && record.ApplicationStatus === 'Approved') {
        if (!leaveTypeData[record.LeaveTypeName]) {
          leaveTypeData[record.LeaveTypeName] = { name: record.LeaveTypeName, value: 0 };
        }
        leaveTypeData[record.LeaveTypeName].value += record.TotalDays || 1;
      }
    });

    const leaveTypePieData = Object.values(leaveTypeData).slice(0, 5);

    return [
      {
        title: '📊 Monthly Leave Trends',
        subtitle: 'Applications by status',
        icon: FiBarChart,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyChartData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Approved" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Pending" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Rejected" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      },
      {
        title: '🏖️ Leave Type Distribution',
        subtitle: 'Days by leave type',
        icon: FiPieChart,
        component: leaveTypePieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={leaveTypePieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {leaveTypePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : <div className="flex items-center justify-center h-48 text-gray-500">No data available</div>
      }
    ];
  };

  const getEmployeeCharts = () => {
    if (!reportData.departmentStats || reportData.departmentStats.length === 0) return [];

    return [
      {
        title: '👥 Employee Distribution',
        subtitle: 'By department',
        icon: FiBarChart,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportData.departmentStats.slice(0, 5)} layout="horizontal">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="DepartmentName" type="category" tick={{ fontSize: 8 }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ActiveEmployees" fill="#10B981" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      },
      {
        title: '📈 Active vs Inactive',
        subtitle: 'Employee status overview',
        icon: FiPieChart,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active', value: reportData.summary?.activeEmployees || 0 },
                  { name: 'Inactive', value: reportData.summary?.inactiveEmployees || 0 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )
      }
    ];
  };

  const getDepartmentCharts = () => {
    if (!reportData.departments || reportData.departments.length === 0) return [];

    return [
      {
        title: '🏢 Department Sizes',
        subtitle: 'Employee count per department',
        icon: FiBarChart,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportData.departments.slice(0, 6)}>
              <XAxis dataKey="DepartmentName" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="TotalEmployees" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    ];
  };

  const getMonthlyCharts = () => {
    if (!reportData.records || reportData.records.length === 0) return [];

    const performanceData = reportData.records.map(record => ({
      name: record.EmployeeName?.substring(0, 10) + '...',
      fullName: record.EmployeeName,
      attendance: record.AttendancePercentage || 0,
      presentDays: record.PresentDays || 0
    })).sort((a, b) => b.attendance - a.attendance).slice(0, 8);

    return [
      {
        title: '🏆 Top Performers',
        subtitle: 'Attendance percentage',
        icon: FiTrendingUp,
        component: (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData} layout="horizontal">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={60} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 max-w-48">
                        <p className="text-sm font-semibold text-gray-900">{data.fullName}</p>
                        <p className="text-xs text-blue-600">Attendance: {data.attendance}%</p>
                        <p className="text-xs text-green-600">Present Days: {data.presentDays}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="attendance" fill="#3B82F6" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    ];
  };

  const charts = getChartsForReportType();

  if (!charts.length) {
    return (
      <div className="px-4">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No chart data available</p>
        </div>
      </div>
    );
  }

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length);
  };

  const chart = charts[currentChart];
  const IconComponent = chart.icon;

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">📊 Analytics Charts</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentChart + 1} of {charts.length}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <FiMaximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chart Card */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{chart.title}</h3>
                <p className="text-sm text-gray-600">{chart.subtitle}</p>
              </div>
            </div>
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 touch-manipulation"
              >
                <FiMaximize2 className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Chart Content */}
        <div className={`p-4 ${isFullscreen ? 'h-96' : 'h-64'}`}>
          {chart.component}
        </div>

        {/* Navigation */}
        {charts.length > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={prevChart}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation"
                style={{ minHeight: '40px' }}
              >
                <FiChevronLeft className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Previous</span>
              </button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {charts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChart(index)}
                    className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                      index === currentChart ? 'bg-blue-500 w-6' : 'bg-gray-300'
                    }`}
                    style={{ minWidth: '16px', minHeight: '16px' }}
                  />
                ))}
              </div>

              <button
                onClick={nextChart}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation"
                style={{ minHeight: '40px' }}
              >
                <span className="text-sm font-medium text-gray-700">Next</span>
                <FiChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe hint */}
      <div className="text-center mt-3">
        <div className="inline-flex items-center text-xs text-gray-500">
          <div className="w-4 h-0.5 bg-gray-300 rounded mr-2"></div>
          Swipe or use arrows to navigate
          <div className="w-4 h-0.5 bg-gray-300 rounded ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileReportCharts;