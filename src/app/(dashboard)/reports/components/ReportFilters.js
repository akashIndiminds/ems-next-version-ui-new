// src/app/(dashboard)/reports/components/ReportFilters.js
'use client';

import { FiBarChart } from 'react-icons/fi';

export default function ReportFilters({
  reportType,
  dateRange,
  selectedDepartment,
  selectedEmployee,
  departments,
  employees,
  loading,
  onFilterChange,
  onGenerateReport
}) {
  
  const handleInputChange = (field, value) => {
    const newFilters = {
      reportType,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      departmentId: selectedDepartment,
      employeeId: selectedEmployee,
      [field]: value
    };
    
    // If report type changes, reset other filters
    if (field === 'reportType') {
      newFilters.departmentId = 'all';
      newFilters.employeeId = 'all';
    }
    
    onFilterChange(newFilters);
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    onFilterChange({
      reportType,
      fromDate: newDateRange.fromDate,
      toDate: newDateRange.toDate,
      departmentId: selectedDepartment,
      employeeId: selectedEmployee
    });
  };

  // Filter employees based on selected department
  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.DepartmentID == selectedDepartment);

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiBarChart className="mr-3 text-blue-600" />
          Report Configuration
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => handleInputChange('reportType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="attendance">📊 Attendance Report</option>
              <option value="leave">🏖️ Leave Report</option>
              <option value="employee">👥 Employee Report</option>
              <option value="department">🏢 Department Report</option>
              <option value="monthly">📅 Monthly Summary</option>
            </select>
          </div>
          
          {/* Department Filter - Show for relevant reports */}
          {(['attendance', 'employee', 'monthly'].includes(reportType)) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => handleInputChange('departmentId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Employee Filter - Show for individual reports */}
          {(['attendance', 'monthly'].includes(reportType)) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Employees</option>
                {filteredEmployees.map(emp => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName} ({emp.EmployeeCode})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* From Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => handleDateChange('fromDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) => handleDateChange('toDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onGenerateReport}
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

        {/* Quick Filters */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Date Ranges</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Today', days: 0 },
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'This Month', days: 'month' },
              { label: 'Last Month', days: 'lastMonth' },
              { label: 'Last 3 Months', days: 90 }
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  let fromDate, toDate = new Date().toISOString().split('T')[0];
                  
                  if (range.days === 'month') {
                    fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                  } else if (range.days === 'lastMonth') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    fromDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
                    toDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
                  } else {
                    const date = new Date();
                    date.setDate(date.getDate() - range.days);
                    fromDate = date.toISOString().split('T')[0];
                  }
                  
                  onFilterChange({
                    reportType,
                    fromDate,
                    toDate,
                    departmentId: selectedDepartment,
                    employeeId: selectedEmployee
                  });
                }}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}