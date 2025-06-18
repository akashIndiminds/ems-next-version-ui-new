// src/app/(dashboard)/leaves/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI } from '@/app/lib/api';
import { FiPlus, FiCalendar, FiClock, FiCheck, FiX, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function LeavesPage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my-leaves');
  const [formData, setFormData] = useState({
    leaveTypeId: '1',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaveData();
  }, [user, activeTab]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);

      // Fetch employee's leaves
      const leavesResponse = await leaveAPI.getEmployeeLeaves(user.employeeId);
      if (leavesResponse.data.success) {
        setLeaves(leavesResponse.data.data);
      }

      // Fetch leave balance
      const balanceResponse = await leaveAPI.getBalance(user.employeeId);
      if (balanceResponse.data.success) {
        setLeaveBalance(balanceResponse.data.data);
      }

      // Fetch pending leaves for approval (managers only)
      if (user.role === 'admin' || user.role === 'manager') {
        const pendingResponse = await leaveAPI.getPending();
        if (pendingResponse.data.success) {
          setPendingLeaves(pendingResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await leaveAPI.apply({
        employeeId: user.employeeId,
        ...formData
      });
      if (response.data.success) {
        toast.success('Leave application submitted successfully!');
        setShowApplyModal(false);
        resetForm();
        fetchLeaveData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const response = await leaveAPI.updateStatus(leaveId, {
        status,
        remarks: status === 'Approved' ? 'Approved by manager' : 'Rejected by manager'
      });
      if (response.data.success) {
        toast.success(`Leave ${status.toLowerCase()} successfully`);
        fetchLeaveData();
      }
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} leave`);
    }
  };

  const resetForm = () => {
    setFormData({
      leaveTypeId: '1',
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
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <p className="mt-2 text-gray-600">
              Apply for leaves and manage leave requests
            </p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="mr-2" />
            Apply Leave
          </button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveBalance.map((balance) => (
            <div key={balance.LeaveTypeID} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
              {/* Gradient accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{balance.LeaveTypeName}</h3>
                <div className="mt-3 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {balance.BalanceDays || 0}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-500">/ {balance.MaxDaysPerYear}</span>
                </div>
                <div className="mt-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
                  <div className="text-xs text-gray-600 font-medium">
                    Used: {balance.UsedDays || 0} days
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        {(user.role === 'admin' || user.role === 'manager') && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('my-leaves')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                    activeTab === 'my-leaves'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Leaves
                </button>
                <button
                  onClick={() => setActiveTab('pending-approvals')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                    activeTab === 'pending-approvals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Approvals ({pendingLeaves.length})
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Leave Table */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiUser className="mr-3 text-blue-600" />
              {activeTab === 'my-leaves' ? 'My Leave History' : 'Pending Approvals'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {activeTab === 'pending-approvals' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employee
                    </th>
                  )}
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'my-leaves' ? leaves : pendingLeaves).map((leave, index) => (
                  <tr key={leave.LeaveApplicationID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {activeTab === 'pending-approvals' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{leave.EmployeeName}</div>
                        <div className="text-sm text-gray-600">{leave.EmployeeCode}</div>
                      </td>
                    )}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {activeTab === 'pending-approvals' ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Approved')}
                            className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
                            title="Approve"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Rejected')}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            title="Reject"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        leave.ApplicationStatus === 'Pending' && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this leave?')) {
                                leaveAPI.cancel(leave.LeaveApplicationID).then(() => {
                                  toast.success('Leave cancelled');
                                  fetchLeaveData();
                                });
                              }
                            }}
                            className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
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
                
                <div onSubmit={handleApplyLeave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
                      <select
                        value={formData.leaveTypeId}
                        onChange={(e) => setFormData({...formData, leaveTypeId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      >
                        <option value="1">Annual Leave</option>
                        <option value="2">Sick Leave</option>
                        <option value="3">Casual Leave</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                        <input
                          type="date"
                          required
                          value={formData.fromDate}
                          onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                        <input
                          type="date"
                          required
                          value={formData.toDate}
                          onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                          min={formData.fromDate}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
                      <textarea
                        required
                        rows="4"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="Please provide a reason for your leave..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        resetForm();
                      }}
                      className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyLeave}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Apply Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}