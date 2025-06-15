// src/app/(dashboard)/leaves/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI } from '@/app/lib/api';
import { FiPlus, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';
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
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leave Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Apply for leaves and manage leave requests
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {leaveBalance.map((balance) => (
          <div key={balance.LeaveTypeID} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">{balance.LeaveTypeName}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900">
                {balance.BalanceDays || 0}
              </span>
              <span className="ml-1 text-sm text-gray-500">/ {balance.MaxDaysPerYear}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Used: {balance.UsedDays || 0} days
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      {(user.role === 'admin' || user.role === 'manager') && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-leaves')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-leaves'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Leaves
            </button>
            <button
              onClick={() => setActiveTab('pending-approvals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending-approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approvals ({pendingLeaves.length})
            </button>
          </nav>
        </div>
      )}

      {/* Leave Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab === 'pending-approvals' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(activeTab === 'my-leaves' ? leaves : pendingLeaves).map((leave) => (
              <tr key={leave.LeaveApplicationID}>
                {activeTab === 'pending-approvals' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.EmployeeName}</div>
                    <div className="text-sm text-gray-500">{leave.EmployeeCode}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {leave.LeaveTypeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(leave.FromDate), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(leave.ToDate), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {leave.TotalDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.ApplicationStatus)}`}>
                    {leave.ApplicationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {activeTab === 'pending-approvals' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Rejected')}
                        className="text-red-600 hover:text-red-900"
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
                        className="text-red-600 hover:text-red-900"
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

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowApplyModal(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for Leave</h3>
              
              <form onSubmit={handleApplyLeave}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                    <select
                      value={formData.leaveTypeId}
                      onChange={(e) => setFormData({...formData, leaveTypeId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="1">Annual Leave</option>
                      <option value="2">Sick Leave</option>
                      <option value="3">Casual Leave</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From Date</label>
                      <input
                        type="date"
                        required
                        value={formData.fromDate}
                        onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Date</label>
                      <input
                        type="date"
                        required
                        value={formData.toDate}
                        onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                        min={formData.fromDate}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Please provide a reason for your leave..."
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyModal(false);
                      resetForm();
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
  );
}