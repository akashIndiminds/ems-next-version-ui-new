import React, { useState, useEffect } from "react";
import { FiFilter, FiX, FiCalendar, FiUsers, FiHome } from "react-icons/fi";

const MobileReportFilters = ({
  isOpen,
  onClose,
  reportType,
  dateRange,
  selectedDepartment,
  selectedEmployee,
  departments,
  employees,
  onFilterChange,
  onGenerateReport,
  loading,
}) => {
  const [localFilters, setLocalFilters] = useState({
    reportType,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    departmentId: selectedDepartment,
    employeeId: selectedEmployee,
  });

  useEffect(() => {
    setLocalFilters({
      reportType,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      departmentId: selectedDepartment,
      employeeId: selectedEmployee,
    });
  }, [reportType, dateRange, selectedDepartment, selectedEmployee]);

  const handleLocalChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };

    // Reset dependent filters when report type changes
    if (field === "reportType") {
      newFilters.departmentId = "all";
      newFilters.employeeId = "all";
    }

    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onGenerateReport();
    onClose();
  };

  const resetFilters = () => {
    const resetFilters = {
      reportType: "attendance",
      fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      departmentId: "all",
      employeeId: "all",
    };
    setLocalFilters(resetFilters);
  };

  const quickDateRanges = [
    {
      label: "Today",
      getValue: () => ({
        from: new Date().toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      }),
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return {
          from: date.toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
        };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return {
          from: date.toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
        };
      },
    },
    {
      label: "This Month",
      getValue: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        to: new Date().toISOString().split("T")[0],
      }),
    },
  ];

  const filteredEmployees =
    localFilters.departmentId === "all"
      ? employees
      : employees.filter(
          (emp) => emp.DepartmentID == localFilters.departmentId
        );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FiFilter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Report Filters
              </h2>
              <p className="text-sm text-gray-500">
                Configure your report parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📊 Report Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    value: "attendance",
                    label: "📊 Attendance Report",
                    desc: "Daily attendance tracking",
                  },
                  {
                    value: "leave",
                    label: "🏖️ Leave Report",
                    desc: "Leave applications & balance",
                  },
                  {
                    value: "employee",
                    label: "👥 Employee Report",
                    desc: "Employee details & metrics",
                  },
                  {
                    value: "department",
                    label: "🏢 Department Report",
                    desc: "Department-wise analytics",
                  },
                  {
                    value: "monthly",
                    label: "📅 Monthly Summary",
                    desc: "Comprehensive monthly report",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleLocalChange("reportType", option.value)
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                      localFilters.reportType === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Date Ranges */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ⚡ Quick Date Ranges
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickDateRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      const dates = range.getValue();
                      handleLocalChange("fromDate", dates.from);
                      handleLocalChange("toDate", dates.to);
                    }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors touch-manipulation"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 From Date
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={localFilters.fromDate}
                    onChange={(e) =>
                      handleLocalChange("fromDate", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 To Date
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={localFilters.toDate}
                    onChange={(e) =>
                      handleLocalChange("toDate", e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Department Filter */}
            {["attendance", "employee", "monthly"].includes(
              localFilters.reportType
            ) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏢 Department
                </label>
                <div className="relative">
                  <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={localFilters.departmentId}
                    onChange={(e) =>
                      handleLocalChange("departmentId", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
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
            {["attendance", "monthly"].includes(localFilters.reportType) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Employee
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={localFilters.employeeId}
                    onChange={(e) =>
                      handleLocalChange("employeeId", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
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
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors touch-manipulation"
              style={{ minHeight: "44px" }}
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all touch-manipulation"
              style={{ minHeight: "44px" }}
            >
              {loading ? "Generating..." : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileReportFilters;
