"use client";
import React, { useState } from 'react';
import {
  FiUsers, 
  FiCalendar, 
  FiAlertCircle, 
  FiPlus, 
  FiEdit, 
  FiRefreshCw,
  FiTrendingUp, 
  FiCheckCircle, 
  FiSearch, 
  FiX
} from "react-icons/fi";

const DesktopLeaveBalanceContent = ({
  activeTab,
  employees = [],
  selectedEmployee,
  employeeBalance = [],
  leaveTypes = [],
  loading = false,
  onEmployeeSelect,
  initializeForm = { employeeId: '', year: new Date().getFullYear() },
  setInitializeForm,
  adjustForm = { 
    employeeId: '', 
    leaveTypeId: '', 
    adjustmentType: 'ADD', 
    days: 0, 
    year: new Date().getFullYear(), 
    reason: '' 
  },
  setAdjustForm,
  bulkForm = { year: new Date().getFullYear() },
  setBulkForm,
  onInitializeBalance,
  onAdjustBalance,
  onBulkInitialize,
  onCarryForward,
  user = {}
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Utility Functions
  const filteredEmployees = employees.filter(employee =>
    (employee.FullName || `${employee.FirstName} ${employee.LastName}`)
      .toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.EmployeeCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.DepartmentName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceColor = (used = 0, total = 0) => {
    if (total === 0) return "text-gray-600 bg-gray-100";
    const percentage = (used / total) * 100;
    if (percentage >= 80) return "text-red-600 bg-red-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getBalanceStatus = (balance) => {
    if (!balance.BalanceDays && balance.BalanceDays !== 0) return 'Unknown';
    if (balance.BalanceDays <= 0) return 'Exhausted';
    if (balance.BalanceDays <= 2) return 'Low';
    return 'Good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Low': return 'text-yellow-600 bg-yellow-100';
      case 'Exhausted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Component Render Functions
  const renderEmployeeList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FiUsers className="mr-2 h-5 w-5 text-blue-600" />
          Select Employee
        </h3>
        <span className="text-sm text-gray-500">
          ({filteredEmployees.length} of {employees.length})
        </span>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-base font-medium">No employees found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.EmployeeID}
              onClick={() => onEmployeeSelect(employee)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                selectedEmployee?.EmployeeID === employee.EmployeeID
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {employee.EmployeeCode} • {employee.DepartmentName}
                  </div>
                </div>
                {selectedEmployee?.EmployeeID === employee.EmployeeID && (
                  <FiCheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBalanceCard = (balance) => (
    <div
      key={balance.LeaveTypeID}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-base font-medium text-gray-900">
          {balance.LeaveTypeName}
        </h4>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getBalanceColor(
              balance.UsedDays,
              balance.AllocatedDays
            )}`}
          >
            {balance.BalanceDays || 0} days remaining
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getBalanceStatus(balance))}`}>
            {getBalanceStatus(balance)}
          </span>
        </div>
      </div>
      
      {/* Balance Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-600 font-medium mb-1">Allocated</div>
          <div className="text-xl font-semibold text-blue-700">
            {balance.AllocatedDays || 0}
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xs text-red-600 font-medium mb-1">Used</div>
          <div className="text-xl font-semibold text-red-700">
            {balance.UsedDays || 0}
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xs text-purple-600 font-medium mb-1">Carry Forward</div>
          <div className="text-xl font-semibold text-purple-700">
            {balance.CarryForwardDays || 0}
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-green-600 font-medium mb-1">Balance</div>
          <div className="text-xl font-semibold text-green-700">
            {balance.BalanceDays || 0}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>
            Usage: {balance.AllocatedDays > 0 ? Math.round(
              (balance.UsedDays / balance.AllocatedDays) * 100
            ) : 0}%
          </span>
          <span>
            {balance.UsedDays || 0} / {balance.AllocatedDays || 0} days
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                balance.AllocatedDays > 0 ? (balance.UsedDays / balance.AllocatedDays) * 100 : 0,
                100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeBalance = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <FiCalendar className="mr-2 h-5 w-5 text-green-600" />
        Leave Balance
        {selectedEmployee && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            - {selectedEmployee.FullName || `${selectedEmployee.FirstName} ${selectedEmployee.LastName}`}
          </span>
        )}
      </h3>
      
      {selectedEmployee ? (
        employeeBalance.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <p className="text-base font-medium text-gray-700 mb-2">No leave balance found</p>
            <p className="text-sm text-gray-500 mb-4">
              This employee doesn't have leave balance initialized for the current year.
            </p>
            <button
              onClick={() => setActiveTab('initialize')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Initialize Balance
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {employeeBalance.map(renderBalanceCard)}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-base font-medium text-gray-700 mb-2">Select an Employee</p>
          <p className="text-sm text-gray-500">
            Choose an employee from the list to view their leave balance details.
          </p>
        </div>
      )}
    </div>
  );

  const renderViewBalance = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderEmployeeList()}
        {renderEmployeeBalance()}
      </div>
    </div>
  );

  const renderInitialize = () => (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
            <FiPlus className="mr-3 h-5 w-5 text-blue-600" />
            Initialize Employee Leave Balance
          </h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FiCalendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">What happens when you initialize:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                  <li>Creates leave balance entries for all active leave types</li>
                  <li>Days are automatically pro-rated if employee joined mid-year</li>
                  <li>Existing balances for the year will not be affected</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={initializeForm.employeeId}
                onChange={(e) =>
                  setInitializeForm({
                    ...initializeForm,
                    employeeId: e.target.value,
                  })
                }
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Select an employee to initialize balance</option>
                {employees.map((emp) => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName || `${emp.FirstName} ${emp.LastName}`} ({emp.EmployeeCode}) - {emp.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={initializeForm.year}
                onChange={(e) =>
                  setInitializeForm({
                    ...initializeForm,
                    year: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                min="2020"
                max="2030"
              />
            </div>
            
            <button
              onClick={onInitializeBalance}
              disabled={!initializeForm.employeeId || loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                  Initializing Leave Balance...
                </>
              ) : (
                <>
                  <FiPlus className="mr-3 h-4 w-4" />
                  Initialize Leave Balance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdjust = () => (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
            <FiEdit className="mr-3 h-5 w-5 text-green-600" />
            Adjust Employee Leave Balance
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={adjustForm.employeeId}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      employeeId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.EmployeeID} value={emp.EmployeeID}>
                      {emp.FullName || `${emp.FirstName} ${emp.LastName}`} ({emp.EmployeeCode})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={adjustForm.leaveTypeId}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      leaveTypeId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.LeaveTypeID} value={type.LeaveTypeID}>
                      {type.LeaveTypeName} (Max: {type.MaxDaysPerYear} days)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={adjustForm.adjustmentType}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      adjustmentType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                >
                  <option value="ADD">Add Days</option>
                  <option value="DEDUCT">Deduct Days</option>
                  <option value="SET">Set Total Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={adjustForm.days}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      days: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  min="0"
                  max="365"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={adjustForm.year}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  min="2020"
                  max="2030"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Adjustment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adjustForm.reason}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    reason: e.target.value,
                  })
                }
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                rows="4"
                placeholder="Please provide a detailed reason for this adjustment..."
              />
            </div>
            
            <button
              onClick={onAdjustBalance}
              disabled={
                !adjustForm.employeeId ||
                !adjustForm.leaveTypeId ||
                !adjustForm.reason.trim() ||
                loading
              }
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                  Adjusting Balance...
                </>
              ) : (
                <>
                  <FiEdit className="mr-3 h-4 w-4" />
                  Adjust Leave Balance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBulkOperations = () => (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bulk Initialize */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiUsers className="mr-3 h-5 w-5 text-purple-600" />
              Bulk Initialize Leave Balance
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Initialize leave balance for all employees in{" "}
              <span className="font-medium">{user?.company?.companyName || 'your company'}</span>{" "}
              who don't have balance for the selected year.
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-purple-800 mb-2">This process will:</p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Create balance entries for all active leave types</li>
                <li>• Pro-rate days for employees who joined mid-year</li>
                <li>• Skip employees who already have balance for the year</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={bulkForm.year}
                  onChange={(e) =>
                    setBulkForm({
                      ...bulkForm,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  min="2020"
                  max="2030"
                />
              </div>
              
              <button
                onClick={onBulkInitialize}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUsers className="mr-2 h-4 w-4" />
                    Bulk Initialize All Employees
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Carry Forward */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiTrendingUp className="mr-3 h-5 w-5 text-orange-600" />
              Carry Forward Leave Balance
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Carry forward unused leave balance from previous year to current year 
              for applicable leave types.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-orange-800 mb-2">This operation will:</p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Transfer eligible unused days from {new Date().getFullYear() - 1}</li>
                <li>• Apply carry forward limits per leave type</li>
                <li>• Update current year balance automatically</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Year
                  </label>
                  <input
                    type="number"
                    value={new Date().getFullYear() - 1}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg text-gray-900 bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Year
                  </label>
                  <input
                    type="number"
                    value={new Date().getFullYear()}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg text-gray-900 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              
              <button
                onClick={onCarryForward}
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiTrendingUp className="mr-2 h-4 w-4" />
                    Carry Forward Balance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-base font-medium text-yellow-800 mb-3">Important Notes</h5>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• Bulk operations cannot be undone. Please ensure you have proper backups.</li>
                <li>• These operations may take several minutes for large organizations.</li>
                <li>• All affected employees will be notified via email about balance changes.</li>
                <li>• System administrators will receive a detailed report upon completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render Function
  const renderTabContent = () => {
    switch (activeTab) {
      case "view-balance":
        return renderViewBalance();
      case "initialize":
        return renderInitialize();
      case "adjust":
        return renderAdjust();
      case "bulk-operations":
        return renderBulkOperations();
      default:
        return renderViewBalance();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {renderTabContent()}
    </div>
  );
};

export default DesktopLeaveBalanceContent;