// src/app/(dashboard)/leaves/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI, dropdownAPI } from '@/app/lib/api/leaveAPI';
import { FiPlus, FiCalendar, FiClock, FiUser, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LeavesPage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Check if user can manage leaves (only admin and manager)
  const canManageLeaves = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    if (user?.employeeId) {
      fetchLeaveData();
      fetchLeaveTypes();
    }
  }, [user]);

  // Fetch leave types from dropdown API
  const fetchLeaveTypes = async () => {
    try {
      const response = await dropdownAPI.getLeaveTypes();
      if (response.data.success) {
        setLeaveTypes(response.data.data);
        if (response.data.data.length > 0 && !formData.leaveTypeId) {
          setFormData(prev => ({ ...prev, leaveTypeId: response.data.data[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast.error('Failed to load leave types');
    }
  };

  const fetchLeaveData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (!user?.employeeId) {
        console.error('No employeeId found');
        return;
      }

      // Fetch employee's own leaves with pagination
      const leavesResponse = await leaveAPI.getEmployeeLeaves(user.employeeId, {
        page: 1,
        limit: 50, // Get more records for personal view
        sortBy: 'AppliedDate',
        sortOrder: 'DESC'
      });
      
      if (leavesResponse.data.success) {
        setLeaves(leavesResponse.data.data || []);
      } else {
        console.error('Failed to fetch leaves:', leavesResponse.data.message);
        setLeaves([]);
      }

      // Fetch leave balance
      const balanceResponse = await leaveAPI.getBalance(user.employeeId);
      if (balanceResponse.data.success) {
        setLeaveBalance(balanceResponse.data.data || []);
      } else {
        console.error('Failed to fetch balance:', balanceResponse.data.message);
        setLeaveBalance([]);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
      setLeaves([]);
      setLeaveBalance([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchLeaveData(true);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    
    if (!formData.leaveTypeId || !formData.fromDate || !formData.toDate || !formData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate dates
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      toast.error('From date cannot be in the past');
      return;
    }

    if (toDate < fromDate) {
      toast.error('To date cannot be before from date');
      return;
    }

    // Calculate total days
    const totalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Check leave balance
    const selectedLeaveType = leaveBalance.find(
      balance => balance.LeaveTypeID == formData.leaveTypeId
    );
    
    if (selectedLeaveType && selectedLeaveType.BalanceDays < totalDays) {
      toast.error(`Insufficient leave balance. You have ${selectedLeaveType.BalanceDays} days available.`);
      return;
    }

    try {
      // Use the enhanced API call
      const response = await leaveAPI.apply({
        employeeId: user.employeeId,
        leaveTypeId: parseInt(formData.leaveTypeId),
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason.trim()
      });
      
      if (response.data.success) {
        toast.success('Leave application submitted successfully!');
        setShowApplyModal(false);
        resetForm();
        fetchLeaveData(true); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to apply for leave');
      }
    } catch (error) {
      console.error('Apply leave error:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!confirm('Are you sure you want to cancel this leave?')) {
      return;
    }

    try {
      const response = await leaveAPI.cancel(leaveId);
      if (response.data.success) {
        toast.success('Leave cancelled successfully');
        fetchLeaveData(true); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to cancel leave');
      }
    } catch (error) {
      console.error('Cancel leave error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const resetForm = () => {
    setFormData({
      leaveTypeId: leaveTypes.length > 0 ? leaveTypes[0].id.toString() : '',
      fromDate: '',
      toDate: '',
      reason: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Approved': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'Rejected': return 'text-red-700 bg-red-100 border-red-200';
      case 'Cancelled': return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'Revoked': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getBalanceStatusColor = (balance) => {
    if (!balance.BalanceDays || balance.BalanceDays === 0) return 'from-red-500 via-red-600 to-red-700';
    if (balance.BalanceDays <= 2) return 'from-amber-500 via-orange-500 to-red-500';
    if (balance.BalanceDays <= 5) return 'from-yellow-500 via-amber-500 to-orange-500';
    return 'from-blue-500 via-purple-500 to-pink-500';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show no user state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Please log in to view leave information</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="mt-2 text-gray-600">
              Apply for leaves and track your leave history
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 flex items-center transition-colors duration-200 font-medium disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            {/* Management Button - Only for admin and manager */}
            {canManageLeaves && (
              <Link
                href="/leaves/approved"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center transition-colors duration-200 shadow-lg font-medium"
              >
                <FiSettings className="mr-2" />
                Manage Leaves
              </Link>
            )}
            
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center transition-colors duration-200 shadow-lg font-medium"
            >
              <FiPlus className="mr-2" />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveBalance.length === 0 ? (
            <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800">
                No leave balance found. Please contact HR to initialize your leave balance.
              </p>
            </div>
          ) : (
            leaveBalance.map((balance) => (
              <div key={balance.LeaveTypeID} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${getBalanceStatusColor(balance)}`}></div>
                
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{balance.LeaveTypeName}</h3>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {balance.BalanceDays || 0}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      / {balance.AllocatedDays || balance.MaxDaysPerYear || 0}
                    </span>
                  </div>
                  <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-black font-medium">Used:</span>
                      <span className="font-semibold text-black">{balance.UsedDays || 0} days</span>
                    </div>
                    {(balance.CarryForwardDays || 0) > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 font-medium">Carry Forward:</span>
                        <span className="font-semibold text-purple-600">{balance.CarryForwardDays} days</span>
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (balance.AllocatedDays || balance.MaxDaysPerYear || 0) > 0 
                              ? ((balance.UsedDays || 0) / (balance.AllocatedDays || balance.MaxDaysPerYear || 1)) * 100 
                              : 0,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* My Leave History */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiUser className="mr-3 text-blue-600" />
              My Leave History ({leaves.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave, index) => (
                  <tr key={leave.LeaveApplicationID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.LeaveTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(leave.FromDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(leave.ToDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.TotalDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(leave.ApplicationStatus)}`}>
                        {leave.ApplicationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {leave.AppliedDate ? format(new Date(leave.AppliedDate), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {leave.ApplicationStatus === 'Pending' ? (
                        <button
                          onClick={() => handleCancelLeave(leave.LeaveApplicationID)}
                          className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No leave applications found. Click "Apply Leave" to submit your first application.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowApplyModal(false)}></div>
              
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Apply for Leave</h3>
                  <p className="text-gray-600 mt-2">Submit your leave application with details</p>
                </div>
                
                <form onSubmit={handleApplyLeave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Leave Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.leaveTypeId}
                        onChange={(e) => setFormData({...formData, leaveTypeId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => {
                          const balance = leaveBalance.find(b => b.LeaveTypeID == type.id);
                          return (
                            <option key={type.id} value={type.id}>
                              {type.label} {balance ? `(${balance.BalanceDays || 0} days available)` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.fromDate}
                          onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.toDate}
                          onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                          min={formData.fromDate || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Show calculated days */}
                    {formData.fromDate && formData.toDate && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>Total Days:</strong> {
                            Math.ceil((new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24)) + 1
                          } days
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide a reason for your leave..."
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {formData.reason.length}/500 characters
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        resetForm();
                      }}
                      className="bg-white py-3 px-6 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 py-3 px-6 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Leave
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}