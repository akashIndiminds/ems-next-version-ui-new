// src/components/attendanceManagement/MobileEmployeeSelection.js
import { FiUser, FiCalendar, FiSearch, FiEye, FiChevronDown, FiX } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

const MobileEmployeeSelection = ({
  selectedEmployee,
  selectedDate,
  employees,
  searching,
  loading,
  onEmployeeSelect,
  onDateChange,
  onFetchData,
  getSelectedEmployeeDetails,
  fetchEmployees
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedEmployeeDetails = getSelectedEmployeeDetails();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchEmployees(); // Load employees when opening dropdown
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiSearch className="mr-2 text-blue-600 h-5 w-5" />
          Selection
        </h2>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Employee Selection with Dropdown */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Employee <span className="text-red-500">*</span>
          </label>
          
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full p-3 text-left border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center flex-1 min-w-0">
                {selectedEmployeeDetails ? (
                  <>
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {selectedEmployeeDetails.EmployeeName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {selectedEmployeeDetails.EmployeeCode} • {selectedEmployeeDetails.DepartmentName}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-gray-500 text-sm">Select employee...</span>
                  </>
                )}
              </div>
              <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => handleSearch('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Employee List */}
                <div className="max-h-48 overflow-y-auto">
                  {searching ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Searching...</p>
                    </div>
                  ) : employees.length > 0 ? (
                    employees.map((employee) => (
                      <button
                        key={employee.EmployeeID}
                        onClick={() => handleEmployeeSelect(employee.EmployeeID)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                          selectedEmployee == employee.EmployeeID ? 'bg-blue-50 border-blue-100' : ''
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
                    <div className="text-center py-6 text-gray-500">
                      <FiUser className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">
                        {searchTerm ? 'No employees found' : 'No employees available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection Card */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Date <span className="text-red-500">*</span>
          </label>
          
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Fetch Button */}
        {selectedEmployee && selectedDate && (
          <button
            onClick={onFetchData}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium"
          >
            <FiEye className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'View Attendance'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileEmployeeSelection;