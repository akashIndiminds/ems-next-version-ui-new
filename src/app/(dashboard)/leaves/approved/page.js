'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI, dropdownAPI } from '@/app/lib/api';
import { 
  FiArrowLeft, FiSearch, FiFilter, FiCalendar, FiUser, 
  FiEdit3, FiX, FiClock, FiCheckCircle, FiAlertTriangle,
  FiEye, FiRefreshCw, FiCheck, FiXCircle, FiDownload
} from 'react-icons/fi';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  // Form states
  const [revokeReason, setRevokeReason] = useState('');
  const [modifyData, setModifyData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  const canManageLeaves = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    if (canManageLeaves) {
      fetchLeaveData();
      fetchDepartments();
    }
  }, [pagination.page, searchTerm, selectedDepartment, dateRange, activeTab, canManageLeaves]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        employeeFilter: searchTerm,
        departmentFilter: selectedDepartment,
        fromDate: dateRange.from,
        toDate: dateRange.to
      };

      if (activeTab === 'pending') {
        // Fetch pending leaves using the enhanced API
        const pendingResponse = await leaveAPI.getPending(params);
        if (pendingResponse.data.success) {
          setPendingLeaves(pendingResponse.data.data || []);
          setPagination(prev => ({
            ...prev,
            total: pendingResponse.data.total || 0
          }));
        } else {
          console.error('Failed to fetch pending leaves:', pendingResponse.data.message);
          setPendingLeaves([]);
        }
      } else {
        // Fetch approved leaves using the new API
        const approvedResponse = await leaveAPI.getApprovedLeaves(params);
        if (approvedResponse.data.success) {
          setApprovedLeaves(approvedResponse.data.data || []);
          setPagination(prev => ({
            ...prev,
            total: approvedResponse.data.total || 0
          }));
        } else {
          console.error('Failed to fetch approved leaves:', approvedResponse.data.message);
          setApprovedLeaves([]);
        }
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
      if (activeTab === 'pending') {
        setPendingLeaves([]);
      } else {
        setApprovedLeaves([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await dropdownAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    if (!canManageLeaves) {
      toast.error('You do not have permission to approve/reject leaves');
      return;
    }

    try {
      const response = await leaveAPI.updateStatus(leaveId, {
        status,
        remarks: status === 'Approved' ? 'Approved by manager' : 'Rejected by manager'
      });
      if (response.data.success) {
        toast.success(`Leave ${status.toLowerCase()} successfully`);
        fetchLeaveData(); // Refresh data
      } else {
        toast.error(response.data.message || `Failed to ${status.toLowerCase()} leave`);
      }
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} leave:`, error);
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} leave`);
    }
  };

  const handleRevokeLeave = async () => {
    if (!selectedLeave || !revokeReason.trim()) {
      toast.error('Please provide a reason for revocation');
      return;
    }

    try {
      const response = await leaveAPI.revokeApprovedLeave(selectedLeave.LeaveApplicationID, {
        reason: revokeReason.trim()
      });

      if (response.data.success) {
        toast.success('Leave revoked successfully');
        setShowRevokeModal(false);
        setSelectedLeave(null);
        setRevokeReason('');
        fetchLeaveData(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to revoke leave');
      }
    } catch (error) {
      console.error('Error revoking leave:', error);
      toast.error(error.response?.data?.message || 'Failed to revoke leave');
    }
  };

  const handleModifyLeave = async () => {
    if (!selectedLeave || !modifyData.fromDate || !modifyData.toDate || !modifyData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate dates
    const fromDate = new Date(modifyData.fromDate);
    const toDate = new Date(modifyData.toDate);
    const today = new Date();

    if (fromDate < today) {
      toast.error('From date cannot be in the past');
      return;
    }

    if (toDate < fromDate) {
      toast.error('To date cannot be before from date');
      return;
    }

    try {
      const response = await leaveAPI.modifyApprovedLeave(selectedLeave.LeaveApplicationID, {
        fromDate: modifyData.fromDate,
        toDate: modifyData.toDate,
        reason: modifyData.reason.trim()
      });

      if (response.data.success) {
        toast.success('Leave dates modified successfully');
        setShowModifyModal(false);
        setSelectedLeave(null);
        setModifyData({ fromDate: '', toDate: '', reason: '' });
        fetchLeaveData(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to modify leave');
      }
    } catch (error) {
      console.error('Error modifying leave:', error);
      toast.error(error.response?.data?.message || 'Failed to modify leave');
    }
  };

  const handleExportData = async () => {
    try {
      const params = {
        employeeFilter: searchTerm,
        departmentFilter: selectedDepartment,
        fromDate: dateRange.from,
        toDate: dateRange.to,
        status: activeTab === 'pending' ? 'Pending' : 'Approved'
      };

      const response = await leaveAPI.exportLeaves(params, 'excel');
      
      // Handle blob download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}_leaves_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Leave data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export leave data');
    }
  };

  const getLeaveStatusBadge = (leave) => {
    if (activeTab === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <FiClock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }

    const today = new Date();
    const fromDate = parseISO(leave.FromDate);
    const toDate = parseISO(leave.ToDate);

    if (isBefore(toDate, today)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <FiCheckCircle className="mr-1 h-3 w-3" />
          Completed
        </span>
      );
    } else if (isAfter(fromDate, today)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiClock className="mr-1 h-3 w-3" />
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiAlertTriangle className="mr-1 h-3 w-3" />
          Ongoing
        </span>
      );
    }
  };

  const canModifyLeave = (leave) => {
    const today = new Date();
    const fromDate = parseISO(leave.FromDate);
    return isAdmin && isAfter(fromDate, today); // Can only modify future leaves
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setDateRange({ from: '', to: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Redirect if user doesn't have permission
  if (!canManageLeaves) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Access Denied</div>
          <p className="text-sm text-gray-600">You don't have permission to manage leaves.</p>
          <Link href="/leaves" className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block">
            Go back to Leave Applications
          </Link>
        </div>
      </div>
    );
  }

  if (loading && pagination.page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  const currentData = activeTab === 'pending' ? pendingLeaves : approvedLeaves;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/leaves" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="mr-2 h-5 w-5" />
              Back to Leaves
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Leave Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage pending approvals and approved leave requests
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Export
            </button>
            <button
              onClick={fetchLeaveData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === 'pending'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiClock className="inline mr-2" />
                Pending Approvals ({pendingLeaves.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('approved');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiCheckCircle className="inline mr-2" />
                Approved Leaves ({approvedLeaves.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiFilter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Filter Actions */}
            {(searchTerm || selectedDepartment || dateRange.from || dateRange.to) && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-6 border-b border-gray-200 ${
            activeTab === 'pending' 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50' 
              : 'bg-gradient-to-r from-green-50 to-blue-50'
          }`}>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {activeTab === 'pending' ? (
                <>
                  <FiClock className="mr-3 text-amber-600" />
                  Pending Approvals ({pagination.total})
                </>
              ) : (
                <>
                  <FiCheckCircle className="mr-3 text-green-600" />
                  Approved Leaves ({pagination.total})
                </>
              )}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'approved' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Approved By
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((leave, index) => (
                  <tr key={leave.LeaveApplicationID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{leave.EmployeeName}</div>
                          <div className="text-sm text-gray-500">{leave.EmployeeCode}</div>
                          <div className="text-xs text-gray-500">{leave.DepartmentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.LeaveTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div className="font-medium">
                          {format(parseISO(leave.FromDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">to</div>
                        <div className="font-medium">
                          {format(parseISO(leave.ToDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.TotalDays} {leave.TotalDays === 1 ? 'day' : 'days'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLeaveStatusBadge(leave)}
                    </td>
                    {activeTab === 'approved' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{leave.ApproverName || 'System'}</div>
                          <div className="text-xs text-gray-500">
                            {leave.ApprovedDate ? format(parseISO(leave.ApprovedDate), 'MMM d, yyyy') : '-'}
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        
                        {activeTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Approved')}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                              title="Approve"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(leave.LeaveApplicationID, 'Rejected')}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Reject"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'approved' && canModifyLeave(leave) && (
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setModifyData({
                                fromDate: leave.FromDate.split('T')[0],
                                toDate: leave.ToDate.split('T')[0],
                                reason: ''
                              });
                              setShowModifyModal(true);
                            }}
                            className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-50 transition-colors"
                            title="Modify Dates"
                          >
                            <FiEdit3 className="h-4 w-4" />
                          </button>
                        )}
                        
                        {activeTab === 'approved' && isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowRevokeModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Revoke Leave"
                          >
                            <FiXCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'approved' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                      {activeTab === 'pending' 
                        ? 'No pending leave applications'
                        : 'No approved leaves found'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm">
                  {pagination.page}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page * pagination.limit >= pagination.total}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Modal */}
        {showViewModal && selectedLeave && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowViewModal(false)}></div>
              
              <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Leave Details</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedLeave.EmployeeName}</p>
                      <p><span className="font-medium">Code:</span> {selectedLeave.EmployeeCode}</p>
                      <p><span className="font-medium">Department:</span> {selectedLeave.DepartmentName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Leave Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Type:</span> {selectedLeave.LeaveTypeName}</p>
                      <p><span className="font-medium">From:</span> {format(parseISO(selectedLeave.FromDate), 'MMM d, yyyy')}</p>
                      <p><span className="font-medium">To:</span> {format(parseISO(selectedLeave.ToDate), 'MMM d, yyyy')}</p>
                      <p><span className="font-medium">Total Days:</span> {selectedLeave.TotalDays}</p>
                      {selectedLeave.ApproverName && (
                        <p><span className="font-medium">Approved By:</span> {selectedLeave.ApproverName}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedLeave.Reason && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLeave.Reason}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Modal */}
        {showRevokeModal && selectedLeave && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowRevokeModal(false)}></div>
              
              <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Revoke Leave</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to revoke this leave? This action will restore the employee's leave balance.
                  </p>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <strong>{selectedLeave.EmployeeName}</strong> - {selectedLeave.LeaveTypeName}
                    <br />
                    {format(parseISO(selectedLeave.FromDate), 'MMM d, yyyy')} to {format(parseISO(selectedLeave.ToDate), 'MMM d, yyyy')}
                    <br />
                    {selectedLeave.TotalDays} {selectedLeave.TotalDays === 1 ? 'day' : 'days'}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Revocation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide a reason for revoking this leave..."
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {revokeReason.length}/500 characters
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRevokeModal(false);
                      setRevokeReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevokeLeave}
                    disabled={!revokeReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Revoke Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modify Modal */}
        {showModifyModal && selectedLeave && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModifyModal(false)}></div>
              
              <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Modify Leave Dates</h3>
                  <p className="text-gray-600 mt-2">
                    Update the leave dates for {selectedLeave.EmployeeName}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={modifyData.fromDate}
                        onChange={(e) => setModifyData(prev => ({ ...prev, fromDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={modifyData.toDate}
                        onChange={(e) => setModifyData(prev => ({ ...prev, toDate: e.target.value }))}
                        min={modifyData.fromDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Modification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={modifyData.reason}
                      onChange={(e) => setModifyData(prev => ({ ...prev, reason: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide a reason for modifying the dates..."
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {modifyData.reason.length}/500 characters
                    </div>
                  </div>
                  
                  {/* Calculate new total days */}
                  {modifyData.fromDate && modifyData.toDate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>New Duration:</strong> {
                          Math.ceil((new Date(modifyData.toDate) - new Date(modifyData.fromDate)) / (1000 * 60 * 60 * 24)) + 1
                        } days
                        <br />
                        <strong>Original Duration:</strong> {selectedLeave.TotalDays} days
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowModifyModal(false);
                      setModifyData({ fromDate: '', toDate: '', reason: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModifyLeave}
                    disabled={!modifyData.fromDate || !modifyData.toDate || !modifyData.reason.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Modify Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}