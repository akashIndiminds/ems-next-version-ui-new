"use client";
import { useState } from "react";
import {
  FiUsers,
  FiCalendar,
  FiAlertCircle,
  FiPlus,
  FiEdit,
  FiRefreshCw,
  FiTrendingUp,
  FiChevronRight,
  FiCheckCircle,
  FiSearch,
  FiX,
  FiZap,
  FiClock,
  FiTrendingDown,
  FiTarget,
} from "react-icons/fi";

const MobileLeaveBalanceContent = ({
  activeTab,
  employees,
  selectedEmployee,
  employeeBalance,
  leaveTypes,
  loading,
  onEmployeeSelect,
  initializeForm,
  setInitializeForm,
  adjustForm,
  setAdjustForm,
  bulkForm,
  setBulkForm,
  onInitializeBalance,
  onAdjustBalance,
  onBulkInitialize,
  onCarryForward,
  user,
}) => {
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [expandedBalance, setExpandedBalance] = useState(null);

  const filteredEmployees = employees.filter(employee => {
    if (!employeeSearchTerm) return true;
    
    const fullName = employee.FullName || `${employee.FirstName || ''} ${employee.LastName || ''}`;
    const employeeCode = employee.EmployeeCode || '';
    const departmentName = employee.DepartmentName || '';
    
    return fullName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
           employeeCode.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
           departmentName.toLowerCase().includes(employeeSearchTerm.toLowerCase());
  });

  const getBalanceColor = (used, total) => {
    if (total === 0) return { bg: "bg-gray-100", text: "text-gray-600", ring: "ring-gray-200" };
    const percentage = (used / total) * 100;
    if (percentage >= 80) return { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
    if (percentage >= 60) return { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" };
    return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };
  };

  const getBalanceStatus = (balance) => {
    if (!balance.BalanceDays && balance.BalanceDays !== 0) return { status: 'Unknown', icon: FiAlertCircle, color: 'text-gray-500' };
    if (balance.BalanceDays <= 0) return { status: 'Exhausted', icon: FiTrendingDown, color: 'text-red-600' };
    if (balance.BalanceDays <= 2) return { status: 'Low', icon: FiClock, color: 'text-amber-600' };
    return { status: 'Good', icon: FiTarget, color: 'text-emerald-600' };
  };

  const renderViewBalance = () => (
    <div className="space-y-4 px-4 pb-6 pt-6">
      {/* Modern Employee Selection Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Employee</h3>
            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-full">
              <FiUsers className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">{employees.length}</span>
            </div>
          </div>
          
          {selectedEmployee ? (
            <button
              onClick={() => setSelectedEmployeeModal(true)}
              className="w-full group"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(selectedEmployee.FirstName?.[0] || '') + (selectedEmployee.LastName?.[0] || '')}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {selectedEmployee.FullName || `${selectedEmployee.FirstName} ${selectedEmployee.LastName}`}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {selectedEmployee.EmployeeCode} • {selectedEmployee.DepartmentName}
                    </p>
                  </div>
                </div>
                <FiChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setSelectedEmployeeModal(true)}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors duration-200 bg-gradient-to-br from-gray-50 to-gray-100/50"
            >
              <FiUsers className="mx-auto h-8 w-8 mb-2" />
              <span className="font-medium">Select Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Sophisticated Balance Display */}
      {selectedEmployee && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FiCalendar className="mr-2 text-emerald-600" />
                Leave Balance
              </h3>
              {employeeBalance.length > 0 && (
                <div className="px-2 py-1 bg-emerald-50 rounded-full">
                  <span className="text-xs font-semibold text-emerald-700">
                    {employeeBalance.length} types
                  </span>
                </div>
              )}
            </div>
            
            {employeeBalance.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-gray-600 font-medium mb-3">No leave balance found</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Initialize Balance
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeBalance.map((balance) => {
                  const colors = getBalanceColor(balance.UsedDays, balance.AllocatedDays);
                  const statusInfo = getBalanceStatus(balance);
                  const isExpanded = expandedBalance === balance.LeaveTypeID;
                  
                  return (
                    <div key={balance.LeaveTypeID} className="group">
                      <button
                        onClick={() => setExpandedBalance(isExpanded ? null : balance.LeaveTypeID)}
                        className="w-full"
                      >
                        <div className={`p-4 rounded-xl border transition-all duration-200 ${colors.bg} ${colors.ring} border-opacity-50 hover:shadow-md`}>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-900 text-left">
                              {balance.LeaveTypeName}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${colors.text} bg-white/60`}>
                                {balance.BalanceDays || 0} left
                              </div>
                              <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-white/80 rounded-full h-2 mb-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  balance.AllocatedDays > 0 ? (balance.UsedDays / balance.AllocatedDays) * 100 : 0,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-600">Allocated</div>
                                <div className="font-bold text-blue-600">{balance.AllocatedDays || 0}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600">Used</div>
                                <div className="font-bold text-red-600">{balance.UsedDays || 0}</div>
                              </div>
                            </div>
                            <FiChevronRight 
                              className={`h-4 w-4 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`} 
                            />
                          </div>
                        </div>
                      </button>
                      
                      {/* Progressive Disclosure Details */}
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xs text-gray-500">Usage %</div>
                              <div className="font-bold text-gray-900">
                                {balance.AllocatedDays > 0 ? Math.round((balance.UsedDays / balance.AllocatedDays) * 100) : 0}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Status</div>
                              <div className={`font-bold ${statusInfo.color}`}>
                                {statusInfo.status}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Remaining</div>
                              <div className="font-bold text-emerald-600">
                                {balance.BalanceDays || 0} days
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Employee Selection Modal */}
      {selectedEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl mt-20 max-h-[80vh] overflow-hidden shadow-2xl border-t border-white/30">
            <div className="p-6 border-b border-gray-200/50">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Select Employee</h3>
                <button
                  onClick={() => {
                    setSelectedEmployeeModal(false);
                    setEmployeeSearchTerm("");
                  }}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              
              {/* Modern Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <FiUsers className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">
                    {employeeSearchTerm ? 'No employees found matching your search' : 'No employees found'}
                  </p>
                  {employeeSearchTerm && (
                    <button
                      onClick={() => setEmployeeSearchTerm("")}
                      className="mt-3 text-blue-600 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEmployees.map((employee) => (
                    <button
                      key={employee.EmployeeID}
                      onClick={() => {
                        onEmployeeSelect(employee);
                        setSelectedEmployeeModal(false);
                        setEmployeeSearchTerm("");
                      }}
                      className={`w-full group transition-all duration-200 ${
                        selectedEmployee?.EmployeeID === employee.EmployeeID
                          ? "transform scale-105"
                          : "hover:scale-102"
                      }`}
                    >
                      <div className={`p-4 rounded-2xl border transition-all duration-200 ${
                        selectedEmployee?.EmployeeID === employee.EmployeeID
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-md"
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedEmployee?.EmployeeID === employee.EmployeeID
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}>
                            <span className={`font-bold ${
                              selectedEmployee?.EmployeeID === employee.EmployeeID
                                ? "text-white"
                                : "text-gray-700"
                            }`}>
                              {(employee.FirstName?.[0] || '') + (employee.LastName?.[0] || '')}
                            </span>
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-gray-900">
                              {employee.FullName || `${employee.FirstName || ''} ${employee.LastName || ''}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {employee.EmployeeCode} • {employee.DepartmentName}
                            </div>
                          </div>
                          {selectedEmployee?.EmployeeID === employee.EmployeeID && (
                            <FiCheckCircle className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInitialize = () => (
    <div className="px-4 pb-6 pt-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <FiPlus className="h-6 w-6 text-blue-600" />
            </div>
            Initialize Balance
          </h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FiZap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Smart Initialization</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Creates leave balance for all active leave types with automatic pro-rating for mid-year joiners.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={initializeForm.employeeId}
                onChange={(e) =>
                  setInitializeForm({
                    ...initializeForm,
                    employeeId: e.target.value,
                  })
                }
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName || `${emp.FirstName} ${emp.LastName}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
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
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min="2020"
                max="2030"
              />
            </div>
            
            <button
              onClick={onInitializeBalance}
              disabled={!initializeForm.employeeId || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center min-h-[52px] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Initializing...
                </>
              ) : (
                <>
                  <FiZap className="mr-3 h-5 w-5" />
                  Initialize Balance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdjust = () => (
    <div className="px-4 pb-6 pt-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="p-2 bg-emerald-100 rounded-xl mr-3">
              <FiEdit className="h-6 w-6 text-emerald-600" />
            </div>
            Adjust Balance
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={adjustForm.employeeId}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    employeeId: e.target.value,
                  })
                }
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-black"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName || `${emp.FirstName} ${emp.LastName}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
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
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-black"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((type) => (
                  <option key={type.LeaveTypeID} value={type.LeaveTypeID}>
                    {type.LeaveTypeName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={adjustForm.adjustmentType}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      adjustmentType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-black"
                >
                  <option value="ADD">Add</option>
                  <option value="DEDUCT">Deduct</option>
                  <option value="SET">Set</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Days <span className="text-red-500">*</span>
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
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-black"
                  min="0"
                  max="365"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adjustForm.reason}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    reason: e.target.value,
                  })
                }
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-black resize-none"
                rows="4"
                placeholder="Enter reason for adjustment..."
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
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center min-h-[52px] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Adjusting...
                </>
              ) : (
                <>
                  <FiEdit className="mr-3 h-5 w-5" />
                  Adjust Balance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBulkOperations = () => (
    <div className="px-4 pb-6 pt-6 space-y-4">
      {/* Bulk Initialize */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <div className="p-2 bg-purple-100 rounded-xl mr-3">
              <FiUsers className="h-5 w-5 text-purple-600" />
            </div>
            Bulk Initialize
          </h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Initialize leave balance for all employees without balance for the selected year. Smart pro-rating included.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Year</label>
              <input
                type="number"
                value={bulkForm.year}
                onChange={(e) =>
                  setBulkForm({
                    ...bulkForm,
                    year: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                min="2020"
                max="2030"
              />
            </div>
            
            <button
              onClick={onBulkInitialize}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center min-h-[52px] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiUsers className="mr-3 h-5 w-5" />
                  Bulk Initialize
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Carry Forward */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <div className="p-2 bg-orange-100 rounded-xl mr-3">
              <FiTrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            Carry Forward Balance
          </h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Automatically carry forward unused leave from previous year to current year. This action cannot be undone.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">From Year</label>
              <input
                type="number"
                value={new Date().getFullYear() - 1}
                className="w-full px-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">To Year</label>
              <input
                type="number"
                value={new Date().getFullYear()}
                className="w-full px-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium"
                readOnly
              />
            </div>
          </div>
          
          <button
            onClick={onCarryForward}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center min-h-[52px] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <FiTrendingUp className="mr-3 h-5 w-5" />
                Carry Forward
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-fitcontent bg-gradient-to-br from-gray-50 to-gray-100">
      {activeTab === "view-balance" && renderViewBalance()}
      {activeTab === "initialize" && renderInitialize()}
      {activeTab === "adjust" && renderAdjust()}
      {activeTab === "bulk-operations" && renderBulkOperations()}
    </div>
  );
};

export default MobileLeaveBalanceContent;