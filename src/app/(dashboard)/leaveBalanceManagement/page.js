"use client";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, leaveBalanceAPI } from '@/app/lib/api';
import {
  FiPlus,
  FiEdit,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import toast from 'react-hot-toast';

const LeaveBalanceManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeBalance, setEmployeeBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view-balance");
  const [statistics, setStatistics] = useState(null);

  // Form states
  const [initializeForm, setInitializeForm] = useState({
    employeeId: "",
    year: new Date().getFullYear(),
  });

  const [adjustForm, setAdjustForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    year: new Date().getFullYear(),
    adjustmentType: "ADD",
    days: 0,
    reason: "",
  });

  const [bulkForm, setBulkForm] = useState({
    companyId: user?.company?.companyId || 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'admin' || user?.role === 'manager') {
        await loadEmployees();
      }
      await loadLeaveTypes();
      await loadStatistics();
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getAll({
        companyId: user?.company?.companyId,
        limit: 100
      });
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const response = await leaveBalanceAPI.getLeaveTypes();
      if (response.data.success) {
        setLeaveTypes(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load leave types:', error);
      toast.error('Failed to load leave types');
    }
  };

  const loadStatistics = async () => {
    try {
      // Fix: Use correct path for companyId
      const companyId = user?.company?.companyId;
      
      if (!companyId) {
        console.warn('Company ID not found in user object');
        return;
      }

      const response = await leaveBalanceAPI.getSummary({
        companyId: companyId,
        year: new Date().getFullYear()
      });
      if (response.data.success) {
        setStatistics({
          totalEmployees: response.data.data.length,
          employeesWithBalance: response.data.data.filter(emp => 
            emp.leaveBalance && emp.leaveBalance.length > 0
          ).length
        });
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleEmployeeSelect = async (employee) => {
    try {
      setSelectedEmployee(employee);
      setLoading(true);
      const response = await leaveBalanceAPI.getBalance(employee.EmployeeID, new Date().getFullYear());
      if (response.data.success) {
        setEmployeeBalance(response.data.data);
      } else {
        setEmployeeBalance([]);
        toast.error('No leave balance found for this employee');
      }
      setInitializeForm({ ...initializeForm, employeeId: employee.EmployeeID });
      setAdjustForm({ ...adjustForm, employeeId: employee.EmployeeID });
    } catch (error) {
      console.error('Failed to load employee balance:', error);
      setEmployeeBalance([]);
      toast.error('Failed to load employee balance');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeBalance = async () => {
    if (!initializeForm.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    try {
      setLoading(true);
      const response = await leaveBalanceAPI.initialize(initializeForm.employeeId, initializeForm.year);
      if (response.data.success) {
        toast.success('Leave balance initialized successfully!');
        if (selectedEmployee?.EmployeeID == initializeForm.employeeId) {
          await handleEmployeeSelect(selectedEmployee);
        }
        await loadStatistics();
      } else {
        toast.error(response.data.message || 'Failed to initialize leave balance');
      }
    } catch (error) {
      console.error('Failed to initialize balance:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize leave balance');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!adjustForm.employeeId || !adjustForm.leaveTypeId || !adjustForm.reason.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const response = await leaveBalanceAPI.adjust({
        employeeId: adjustForm.employeeId,
        leaveTypeId: adjustForm.leaveTypeId,
        year: adjustForm.year,
        adjustmentType: adjustForm.adjustmentType,
        days: adjustForm.days,
        reason: adjustForm.reason
      });
      if (response.data.success) {
        toast.success('Leave balance adjusted successfully!');
        setAdjustForm({ ...adjustForm, days: 0, reason: '', leaveTypeId: '' });
        if (selectedEmployee?.EmployeeID == adjustForm.employeeId) {
          await handleEmployeeSelect(selectedEmployee);
        }
      } else {
        toast.error(response.data.message || 'Failed to adjust leave balance');
      }
    } catch (error) {
      console.error('Failed to adjust balance:', error);
      toast.error(error.response?.data?.message || 'Failed to adjust leave balance');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkInitialize = async () => {
    // Fix: Use correct path for companyId
    const companyId = user?.company?.companyId;
    
    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }
    
    const confirmMessage = `Are you sure you want to initialize leave balance for all employees in ${user.company.companyName} for year ${bulkForm.year}?`;
    if (!confirm(confirmMessage)) {
      return;
    }
    try {
      setLoading(true);
      const response = await leaveBalanceAPI.bulkInitialize(companyId, bulkForm.year);
      if (response.data.success) {
        toast.success(`Bulk initialization completed! Processed: ${response.data.data.processedEmployees} employees`);
        await loadStatistics();
        if (selectedEmployee) {
          await handleEmployeeSelect(selectedEmployee);
        }
      } else {
        toast.error(response.data.message || 'Failed to bulk initialize');
      }
    } catch (error) {
      console.error('Failed to bulk initialize:', error);
      toast.error(error.response?.data?.message || 'Failed to bulk initialize');
    } finally {
      setLoading(false);
    }
  };

  const handleCarryForward = async () => {
    const currentYear = new Date().getFullYear();
    const fromYear = currentYear - 1;
    const toYear = currentYear;
    const confirmMessage = `Are you sure you want to carry forward leave balance from ${fromYear} to ${toYear}? This action cannot be undone.`;
    if (!confirm(confirmMessage)) {
      return;
    }
    try {
      setLoading(true);
      const response = await leaveBalanceAPI.carryForward(fromYear, toYear);
      if (response.data.success) {
        toast.success(`Carry forward completed! Processed: ${response.data.data.summary.processed} employees`);
        await loadStatistics();
        if (selectedEmployee) {
          await handleEmployeeSelect(selectedEmployee);
        }
      } else {
        toast.error(response.data.message || 'Failed to carry forward balance');
      }
    } catch (error) {
      console.error('Failed to carry forward:', error);
      toast.error(error.response?.data?.message || 'Failed to carry forward balance');
    } finally {
      setLoading(false);
    }
  };

  const getBalanceColor = (used, total) => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leave Balance Management
          </h1>
          <p className="text-gray-600">
            Manage employee leave allocations, adjustments, and balance tracking for {user?.company?.companyName}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "view-balance", label: "View Balance", icon: FiUsers },
                { id: "initialize", label: "Initialize Balance", icon: FiPlus },
                { id: "adjust", label: "Adjust Balance", icon: FiEdit },
                { id: "bulk-operations", label: "Bulk Operations", icon: FiRefreshCw },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "view-balance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiUsers className="mr-2 text-blue-600" />
                      Select Employee ({employees.length})
                    </h3>
                    {employees.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>No employees found</p>
                        <button
                          onClick={loadEmployees}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Refresh
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {employees.map((employee) => (
                          <div
                            key={employee.EmployeeID}
                            onClick={() => handleEmployeeSelect(employee)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                              selectedEmployee?.EmployeeID === employee.EmployeeID
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.EmployeeCode} • {employee.DepartmentName}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiCalendar className="mr-2 text-green-600" />
                      Leave Balance{" "}
                      {selectedEmployee && `- ${selectedEmployee.FullName || selectedEmployee.FirstName + ' ' + selectedEmployee.LastName}`}
                    </h3>
                    {selectedEmployee ? (
                      employeeBalance.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                          <p>No leave balance found for this employee</p>
                          <button
                            onClick={() => setActiveTab('initialize')}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Initialize Balance
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {employeeBalance.map((balance) => (
                            <div
                              key={balance.LeaveTypeID}
                              className="bg-gray-50 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {balance.LeaveTypeName}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(
                                      balance.UsedDays,
                                      balance.AllocatedDays
                                    )}`}
                                  >
                                    {balance.BalanceDays || 0} days left
                                  </span>
                                  <span className={`text-xs font-semibold ${
                                    getBalanceStatus(balance) === 'Good' ? 'text-green-600' :
                                    getBalanceStatus(balance) === 'Low' ? 'text-yellow-600' :
                                    getBalanceStatus(balance) === 'Exhausted' ? 'text-red-600' :
                                    'text-gray-600'
                                  }`}>
                                    {getBalanceStatus(balance)}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Allocated</div>
                                  <div className="font-medium text-blue-600">
                                    {balance.AllocatedDays || 0}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Used</div>
                                  <div className="font-medium text-red-600">
                                    {balance.UsedDays || 0}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Carry Forward</div>
                                  <div className="font-medium text-purple-600">
                                    {balance.CarryForwardDays || 0}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Balance</div>
                                  <div className="font-medium text-green-600">
                                    {balance.BalanceDays || 0}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>
                                    Usage:{" "}
                                    {balance.AllocatedDays > 0 ? Math.round(
                                      (balance.UsedDays / balance.AllocatedDays) * 100
                                    ) : 0}%
                                  </span>
                                  <span>
                                    {balance.UsedDays || 0} / {balance.AllocatedDays || 0} days
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>Select an employee to view their leave balance</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "initialize" && (
              <div className="space-y-6">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiPlus className="mr-2 text-blue-600" />
                    Initialize Employee Leave Balance
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-blue-700">
                      <strong>Note:</strong> This will create leave balance entries for all active leave types. 
                      Days will be pro-rated if the employee joined mid-year.
                    </div>
                  </div>
                  <div className="space-y-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.EmployeeID} value={emp.EmployeeID}>
                            {emp.FullName || `${emp.FirstName} ${emp.LastName}`} ({emp.EmployeeCode})
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                        min="2020"
                        max="2030"
                      />
                    </div>
                    <button
                      onClick={handleInitializeBalance}
                      disabled={!initializeForm.employeeId || loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Initializing...
                        </>
                      ) : (
                        <>
                          <FiPlus className="mr-2" />
                          Initialize Balance
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "adjust" && (
              <div className="space-y-6">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiEdit className="mr-2 text-green-600" />
                    Adjust Employee Leave Balance
                  </h3>
                  <div className="space-y-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                      >
                        <option value="">Select Employee</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                          <option key={type.LeaveTypeID} value={type.LeaveTypeID}>
                            {type.LeaveTypeName} (Max: {type.MaxDaysPerYear} days)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                        >
                          <option value="ADD">Add Days</option>
                          <option value="DEDUCT">Deduct Days</option>
                          <option value="SET">Set Total Days</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                          min="0"
                          max="365"
                        />
                      </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                        min="2020"
                        max="2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                        rows="3"
                        placeholder="Enter reason for adjustment..."
                      />
                    </div>
                    <button
                      onClick={handleAdjustBalance}
                      disabled={
                        !adjustForm.employeeId ||
                        !adjustForm.leaveTypeId ||
                        !adjustForm.reason.trim() ||
                        loading
                      }
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Adjusting...
                        </>
                      ) : (
                        <>
                          <FiEdit className="mr-2" />
                          Adjust Balance
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bulk-operations" && (
              <div className="space-y-6">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiRefreshCw className="mr-2 text-purple-600" />
                    Bulk Operations
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Bulk Initialize Leave Balance
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Initialize leave balance for all employees in {user?.employee?.company?.companyName} 
                        who don't have balance for the selected year.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                            min="2020"
                            max="2030"
                          />
                        </div>
                        <button
                          onClick={handleBulkInitialize}
                          disabled={loading}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiUsers className="mr-2" />
                              Bulk Initialize
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Carry Forward Balance
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Carry forward unused leave balance from previous year to current year 
                        for applicable leave types.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Year
                          </label>
                          <input
                            type="number"
                            value={new Date().getFullYear() - 1}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-100"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Year
                          </label>
                          <input
                            type="number"
                            value={new Date().getFullYear()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-100"
                            readOnly
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCarryForward}
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FiTrendingUp className="mr-2" />
                            Carry Forward Balance
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics?.employeesWithBalance || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leave Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaveTypes.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Year</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().getFullYear()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceManagement;