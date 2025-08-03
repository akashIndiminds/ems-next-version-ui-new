// src/components/attendanceManagement/DesktopEmployeeSelection.js
import {
  FiUser,
  FiCalendar,
  FiSearch,
  FiEye,
  FiRefreshCw,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const DesktopEmployeeSelection = ({
  selectedEmployee,
  selectedDate,
  employees,
  searching,
  loading,
  onEmployeeSelect,
  onDateChange,
  onFetchData,
  getSelectedEmployeeDetails,
  fetchEmployees,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedEmployeeDetails = getSelectedEmployeeDetails();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      fetchEmployees(value);
    } else if (value.length === 0) {
      fetchEmployees();
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    onEmployeeSelect(employeeId);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchEmployees(); // Load employees when opening dropdown
    }
  };

  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FiSearch className="mr-2 text-blue-600 h-4 w-4" />
            Employee & Date Selection
          </h2>
          <button
            onClick={onFetchData}
            disabled={!selectedEmployee || !selectedDate || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-sm text-sm font-medium disabled:opacity-50"
          >
            <FiRefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Fetch Data"}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Compact Employee Selection with Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full px-3 py-3 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm flex items-center justify-between text-sm"
              >
                <div className="flex items-center flex-1 min-w-0">
                  {selectedEmployeeDetails ? (
                    <>
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FiUser className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {selectedEmployeeDetails.EmployeeName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {selectedEmployeeDetails.EmployeeCode} •{" "}
                          {selectedEmployeeDetails.DepartmentName}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <FiUser className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-gray-500 text-sm">
                        Click to select employee...
                      </span>
                    </>
                  )}
                </div>
                <FiChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Fixed Dropdown with proper positioning */}
              {showDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}>
                  <div 
                    className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden"
                    style={{
                      top: dropdownRef.current?.getBoundingClientRect().bottom + window.scrollY,
                      left: dropdownRef.current?.getBoundingClientRect().left + window.scrollX,
                      width: dropdownRef.current?.getBoundingClientRect().width,
                      zIndex: 1000
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                          autoFocus
                        />
                        {searchTerm && (
                          <button
                            onClick={() => handleSearch("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Employee List - Fixed height with scrolling */}
                    <div className="max-h-80 overflow-y-auto bg-white">
                      {searching ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">
                            Searching employees...
                          </p>
                        </div>
                      ) : employees.length > 0 ? (
                        employees.slice(0, 10).map((employee, index) => (
                          <button
                            key={employee.EmployeeID}
                            onClick={() => handleEmployeeSelect(employee.EmployeeID)}
                            className={`w-full text-left p-3 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                              selectedEmployee == employee.EmployeeID
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <FiUser className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {employee.EmployeeName}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {employee.EmployeeCode} • {employee.DepartmentName}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FiUser className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm">
                            {searchTerm
                              ? "No employees found"
                              : "No employees available"}
                          </p>
                        </div>
                      )}
                      {employees.length > 10 && (
                        <div className="text-center py-2 bg-gray-50 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Showing first 10 results. Use search to find more.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        {/* Compact Fetch Button - Centered */}
        {selectedEmployee && selectedDate && (
          <div className="flex justify-center pt-3">
            <button
              onClick={onFetchData}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-70 text-sm font-medium"
            >
              <FiEye
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "View Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopEmployeeSelection;