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

    // If report type changes, reset other filters
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

  // Filter employees based on selected department
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
    let fromDate,
      toDate = new Date().toISOString().split("T")[0];

    if (range.days === "month") {
      fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0];
    } else if (range.days === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      fromDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      toDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
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
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiBarChart className="mr-3 text-blue-600" />
          Report Configuration
        </h2>
        <p className="text-gray-600 mt-1">
          Configure your report parameters and generate insights
        </p>
      </div>

      <div className="p-6">
        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-6">
          {/* Report Type */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => handleInputChange("reportType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏢 Department
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDepartment}
                  onChange={(e) =>
                    handleInputChange("departmentId", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Employee
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedEmployee}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 From Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => handleDateChange("fromDate", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 To Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => handleDateChange("toDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={onGenerateReport}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
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
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
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
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg transition-all duration-200 font-medium hover:shadow-md transform hover:scale-105"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            📋 Current Selection
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
