// src/components/attendanceManagement/MobileEmployeeSelection.js
import { FiUser, FiCalendar, FiSearch, FiEye, FiChevronDown, FiX, FiUsers } from 'react-icons/fi';
import { useState, useRef, useEffect, useTransition } from 'react';

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
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedEmployeeDetails = getSelectedEmployeeDetails();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDropdown]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    startTransition(() => {
      if (value.length >= 2) {
        fetchEmployees(value);
      } else if (value.length === 0) {
        fetchEmployees();
      }
    });
  };

  const handleEmployeeSelect = (employeeId) => {
    onEmployeeSelect(employeeId);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchEmployees();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FiUsers className="text-white h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">Selection</h2>
              <p className="text-xs text-gray-600">Employee & date</p>
            </div>
          </div>
          
          {/* Compact progress dots */}
          <div className="flex items-center space-x-1">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              selectedEmployee ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              selectedDate ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
        </div>
      </div>
      
      <div className="p-3 space-y-4">
        {/* Employee Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">
              Employee <span className="text-red-500">*</span>
            </label>
            {employees.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {employees.length}
              </span>
            )}
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full min-h-[44px] p-3 text-left border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between"
              aria-expanded={showDropdown}
              aria-haspopup="listbox"
            >
              <div className="flex items-center flex-1 min-w-0">
                {selectedEmployeeDetails ? (
                  <>
                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-200 rounded-lg flex items-center justify-center mr-2.5">
                      <FiUser className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {selectedEmployeeDetails.EmployeeName}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {selectedEmployeeDetails.EmployeeCode}
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center ml-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2.5">
                      <FiUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 text-sm">Choose employee...</span>
                    </div>
                  </>
                )}
              </div>
              <FiChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ml-2 ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm bg-white"
                      autoComplete="off"
                      style={{ fontSize: '16px' }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => handleSearch('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Employee List */}
                <div className="max-h-48 overflow-y-auto">
                  {searching || isPending ? (
                    <div className="p-1 space-y-0.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-2 animate-pulse">
                          <div className="h-7 w-7 bg-gray-200 rounded-lg mr-2" />
                          <div className="flex-1 space-y-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                            <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : employees.length > 0 ? (
                    <div className="p-1">
                      {employees.map((employee) => (
                        <button
                          key={employee.EmployeeID}
                          onClick={() => handleEmployeeSelect(employee.EmployeeID)}
                          className={`w-full text-left p-2 rounded-md transition-all duration-200 border mb-0.5 ${
                            selectedEmployee == employee.EmployeeID
                              ? 'bg-blue-50 border-blue-200'
                              : 'border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-7 w-7 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-2">
                              <FiUser className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {employee.EmployeeName}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {employee.EmployeeCode} • {employee.DepartmentName}
                              </div>
                            </div>
                            {selectedEmployee == employee.EmployeeID && (
                              <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                <div className="w-1 h-1 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-0.5">
                        {searchTerm ? 'No employees found' : 'No employees'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {searchTerm ? 'Try different terms' : 'Contact administrator'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            {selectedDate && (
              <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">
                Set
              </span>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 z-10">
              <FiCalendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200 text-sm"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>

        {/* Action Button */}
        {selectedEmployee && selectedDate && (
          <button
            onClick={onFetchData}
            disabled={loading}
            className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Loading...
              </>
            ) : (
              <>
                <FiEye className="mr-2 h-4 w-4" />
                View Attendance
              </>
            )}
          </button>
        )}

        {/* Compact helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiUsers className="h-2.5 w-2.5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-medium text-blue-900 mb-1">Tips</h4>
              <ul className="text-xs text-blue-800 space-y-0.5">
                <li>• Search to find employees quickly</li>
                <li>• Both fields required to proceed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEmployeeSelection;