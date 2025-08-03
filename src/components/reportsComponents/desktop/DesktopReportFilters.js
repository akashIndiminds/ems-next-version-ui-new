
// Compact DesktopReportFilters.js
import React from "react";
import { FiBarChart, FiCalendar, FiUsers, FiHome } from "react-icons/fi";

const DesktopReportFilters = ({
  reportType,
  dateRange,
  selectedDepartment,
  selectedEmployee,
  departments,
  employees,
  loading,
  onFilterChange,
  onGenerateReport,
}) => {
  const handleInputChange = (field, value) => {
    const newFilters = {
      reportType,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      departmentId: selectedDepartment,
      employeeId: selectedEmployee,
      [field]: value,
    };

    if (field === "reportType") {
      newFilters.departmentId = "all";
      newFilters.employeeId = "all";
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
      employeeId: selectedEmployee,
    });
  };

  const filteredEmployees =
    selectedDepartment === "all"
      ? employees
      : employees.filter((emp) => emp.DepartmentID == selectedDepartment);

  const quickDateRanges = [
    { label: "Today", days: 0 },
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "This Month", days: "month" },
    { label: "Last Month", days: "lastMonth" },
    { label: "Last 3 Months", days: 90 },
  ];

  const handleQuickDateRange = (range) => {
    let fromDate, toDate = new Date().toISOString().split("T")[0];

    if (range.days === "month") {
      fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split("T")[0];
    } else if (range.days === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      fromDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        .toISOString().split("T")[0];
      toDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
        .toISOString().split("T")[0];
    } else {
      const date = new Date();
      date.setDate(date.getDate() - range.days);
      fromDate = date.toISOString().split("T")[0];
    }

    onFilterChange({
      reportType,
      fromDate,
      toDate,
      departmentId: selectedDepartment,
      employeeId: selectedEmployee,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FiBarChart className="mr-2 text-blue-600 h-4 w-4" />
          Report Configuration
        </h2>
        <p className="text-gray-600 text-sm">
          Configure your report parameters and generate insights
        </p>
      </div>

      <div className="p-4">
        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
          {/* Report Type */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📊 Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => handleInputChange("reportType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200 hover:border-gray-400 text-sm"
            >
              <option value="attendance">📊 Attendance Report</option>
              <option value="leave">🏖️ Leave Report</option>
              <option value="employee">👥 Employee Report</option>
              <option value="department">🏢 Department Report</option>
              <option value="monthly">📅 Monthly Summary</option>
            </select>
          </div>

          {/* Department Filter */}
          {["attendance", "employee", "monthly"].includes(reportType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏢 Department
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  value={selectedDepartment}
                  onChange={(e) =>
                    handleInputChange("departmentId", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200 hover:border-gray-400 appearance-none text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentID} value={dept.DepartmentID}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Employee Filter */}
          {["attendance", "monthly"].includes(reportType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👤 Employee
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  value={selectedEmployee}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200 hover:border-gray-400 appearance-none text-sm"
                >
                  <option value="all">All Employees</option>
                  {filteredEmployees.map((emp) => (
                    <option key={emp.EmployeeID} value={emp.EmployeeID}>
                      {emp.FullName} ({emp.EmployeeCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 From Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => handleDateChange("fromDate", e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 hover:border-gray-400 text-sm"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 To Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => handleDateChange("toDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 hover:border-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={onGenerateReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow text-sm font-medium group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiBarChart className="mr-2 group-hover:scale-110 transition-transform" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              ⚡ Quick Date Ranges
            </h3>
            <span className="text-xs text-gray-500">
              Click to apply instantly
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickDateRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleQuickDateRange(range)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors duration-200 font-medium hover:shadow-sm transform hover:scale-105"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            📋 Current Selection
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Report Type:</span>
              <span className="ml-2 font-medium text-gray-900">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Date Range:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(dateRange.fromDate).toLocaleDateString()} -{" "}
                {new Date(dateRange.toDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Filters:</span>
              <span className="ml-2 font-medium text-gray-900">
                {selectedDepartment !== "all" || selectedEmployee !== "all"
                  ? `${selectedDepartment !== "all" ? "Dept" : ""}${
                      selectedDepartment !== "all" && selectedEmployee !== "all"
                        ? " + "
                        : ""
                    }${selectedEmployee !== "all" ? "Employee" : ""} filtered`
                  : "All data"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopReportFilters;

