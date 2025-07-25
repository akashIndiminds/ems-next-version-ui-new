// src/app/(dashboard)/leaves/approved/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { leaveAPI} from '@/app/lib/api/leaveAPI';
import { dropdownAPI } from '@/app/lib/api';
import { format, parseISO, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Mobile Components
import { MobileLeaveManagementHeader } from '@/components/leaveApproveComponent/mobile/MobileLeaveManagementHeader';
import { MobileLeaveManagementFilters } from '@/components/leaveApproveComponent/mobile/MobileLeaveManagementFilters';
import { MobileLeaveManagementTabs } from '@/components/leaveApproveComponent/mobile/MobileLeaveManagementTabs';
import { MobileLeaveManagementContent } from '@/components/leaveApproveComponent/mobile/MobileLeaveManagementContent';

// Desktop Components
import { DesktopLeaveManagementHeader } from '@/components/leaveApproveComponent/desktop/DesktopLeaveManagementHeader';
import { DesktopLeaveManagementTabs } from '@/components/leaveApproveComponent/desktop/DesktopLeaveManagementTabs';
import { DesktopLeaveManagementFilters } from '@/components/leaveApproveComponent/desktop/DesktopLeaveManagementFilters';
import { DesktopLeaveManagementContent } from '@/components/leaveApproveComponent/desktop/DesktopLeaveManagementContent';

// Modal Components
import { LeaveViewModal } from '@/components/leaveApproveComponent/modals/LeaveViewModal';
import { LeaveHistoryModal } from '@/components/leaveApproveComponent/modals/LeaveHistoryModal';
import { LeaveRevokeModal } from '@/components/leaveApproveComponent/modals/LeaveRevokeModal';
import { LeaveModifyModal } from '@/components/leaveApproveComponent/modals/LeaveModifyModal';

// Hook for responsive design
function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile };
}

export default function ResponsiveLeaveManagementPage() {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  
  // Separate state for approved and pending leaves to avoid resetting
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Loading states for each tab
  const [loadingStates, setLoadingStates] = useState({
    pending: false,
    approved: false,
    initial: true
  });
  
  // Data fetch status to avoid unnecessary API calls
  const [dataFetched, setDataFetched] = useState({
    pending: false,
    approved: false
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Separate pagination for each tab
  const [paginationStates, setPaginationStates] = useState({
    pending: { page: 1, limit: 20, total: 0 },
    approved: { page: 1, limit: 20, total: 0 }
  });

  // Form states
  const [revokeReason, setRevokeReason] = useState('');
  const [modifyData, setModifyData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Modal loading states
  const [modalLoadingStates, setModalLoadingStates] = useState({
    revoke: false,
    modify: false
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  const canManageLeaves = user?.role === 'admin' || user?.role === 'manager';

  // Get current pagination based on active tab
  const currentPagination = paginationStates[activeTab];

  // Check if filters are active
  const hasActiveFilters = searchTerm || selectedDepartment || dateRange.from || dateRange.to;

  // Fetch pending leaves
  const fetchPendingLeaves = useCallback(async (params = {}) => {
    if (!canManageLeaves) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, pending: true }));
      
      const searchParams = {
        page: paginationStates.pending.page,
        limit: paginationStates.pending.limit,
        employeeFilter: searchTerm,
        departmentFilter: selectedDepartment,
        fromDate: dateRange.from,
        toDate: dateRange.to,
        ...params
      };

      const response = await leaveAPI.getPending(searchParams);
      
      if (response.data.success) {
        setPendingLeaves(response.data.data || []);
        setPaginationStates(prev => ({
          ...prev,
          pending: { ...prev.pending, total: response.data.total || 0 }
        }));
        setDataFetched(prev => ({ ...prev, pending: true }));
      } else {
        console.error('Failed to fetch pending leaves:', response.data.message);
        setPendingLeaves([]);
        toast.error(response.data.message || 'Failed to fetch pending leaves');
      }
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      toast.error('Failed to load pending leaves');
      setPendingLeaves([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, pending: false, initial: false }));
    }
  }, [canManageLeaves, searchTerm, selectedDepartment, dateRange.from, dateRange.to, paginationStates.pending.page, paginationStates.pending.limit]);

  // Fetch approved leaves
  const fetchApprovedLeaves = useCallback(async (params = {}) => {
    if (!canManageLeaves) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, approved: true }));
      
      const searchParams = {
        page: paginationStates.approved.page,
        limit: paginationStates.approved.limit,
        employeeFilter: searchTerm,
        departmentFilter: selectedDepartment,
        fromDate: dateRange.from,
        toDate: dateRange.to,
        ...params
      };

      const response = await leaveAPI.getApprovedLeaves(searchParams);
      
      if (response.data.success) {
        setApprovedLeaves(response.data.data || []);
        setPaginationStates(prev => ({
          ...prev,
          approved: { ...prev.approved, total: response.data.total || 0 }
        }));
        setDataFetched(prev => ({ ...prev, approved: true }));
      } else {
        console.error('Failed to fetch approved leaves:', response.data);
        setApprovedLeaves([]);
        toast.error(response.data.message || 'Failed to fetch approved leaves');
      }
    } catch (error) {
      console.error('Error fetching approved leaves:', error);
      toast.error('Failed to load approved leaves');
      setApprovedLeaves([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, approved: false, initial: false }));
    }
  }, [canManageLeaves, searchTerm, selectedDepartment, dateRange.from, dateRange.to, paginationStates.approved.page, paginationStates.approved.limit]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await dropdownAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }, []);

  // Fetch leave history
  const fetchLeaveHistory = async (leaveId) => {
    try {
      const response = await leaveAPI.getLeaveHistory(leaveId);
      if (response.data.success) {
        setLeaveHistory(response.data.data || []);
      } else {
        toast.error('Failed to fetch leave history');
        setLeaveHistory([]);
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
      toast.error('Failed to load leave history');
      setLeaveHistory([]);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    if (canManageLeaves) {
      fetchDepartments();
      fetchPendingLeaves();
      fetchApprovedLeaves();
    }
  }, [canManageLeaves]);

  // Handle filter/search changes - refetch data when filters change
  useEffect(() => {
    if (canManageLeaves && !loadingStates.initial) {
      // Reset pagination when filters change
      setPaginationStates(prev => ({
        pending: { ...prev.pending, page: 1 },
        approved: { ...prev.approved, page: 1 }
      }));
      
      // Refetch data for current tab
      if (activeTab === 'pending') {
        fetchPendingLeaves();
      } else {
        fetchApprovedLeaves();
      }
    }
  }, [searchTerm, selectedDepartment, dateRange.from, dateRange.to]);

  // Handle pagination changes
  useEffect(() => {
    if (canManageLeaves && !loadingStates.initial) {
      if (activeTab === 'pending') {
        fetchPendingLeaves();
      } else {
        fetchApprovedLeaves();
      }
    }
  }, [paginationStates.pending.page, paginationStates.approved.page]);

  // Event Handlers
  const handleRefresh = () => {
    if (activeTab === 'pending') {
      fetchPendingLeaves();
    } else {
      fetchApprovedLeaves();
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'pending' && !dataFetched.pending) {
      fetchPendingLeaves();
    } else if (tab === 'approved' && !dataFetched.approved) {
      fetchApprovedLeaves();
    }
  };

  const updatePagination = (tab, updates) => {
    setPaginationStates(prev => ({
      ...prev,
      [tab]: { ...prev[tab], ...updates }
    }));
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
        fetchPendingLeaves();
        fetchApprovedLeaves();
      } else {
        toast.error(response.data.message || `Failed to ${status.toLowerCase()} leave`);
      }
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} leave:`, error);
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} leave`);
    }
  };

  const handleModifyLeave = async () => {
    if (!selectedLeave || !modifyData.fromDate || !modifyData.toDate || !modifyData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const fromDate = new Date(modifyData.fromDate);
    const toDate = new Date(modifyData.toDate);
    const now = new Date();

    if (fromDate < now) {
      toast.error('From date cannot be in the past');
      return;
    }

    if (toDate < fromDate) {
      toast.error('To date cannot be before from date');
      return;
    }

    const hoursDifference = differenceInHours(fromDate, now);
    if (hoursDifference < 12) {
      toast.error('Leave can only be modified at least 12 hours before the start date');
      return;
    }

    if (modifyData.reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters long');
      return;
    }

    try {
      setModalLoadingStates(prev => ({ ...prev, modify: true }));
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
        fetchApprovedLeaves();
      } else {
        toast.error(response.data.message || 'Failed to modify leave');
      }
    } catch (error) {
      console.error('Error modifying leave:', error);
      toast.error(error.response?.data?.message || 'Failed to modify leave');
    } finally {
      setModalLoadingStates(prev => ({ ...prev, modify: false }));
    }
  };

  const handleRevokeLeave = async () => {
    if (!selectedLeave || !revokeReason.trim()) {
      toast.error('Please provide a reason for revocation');
      return;
    }

    if (revokeReason.trim().length < 10) {
      toast.error('Revocation reason must be at least 10 characters long');
      return;
    }

    const now = new Date();
    const leaveStartDate = parseISO(selectedLeave.FromDate);
    const hoursDifference = differenceInHours(leaveStartDate, now);
    
    if (hoursDifference < 12) {
      toast.error('Leave can only be revoked at least 12 hours before the start date');
      return;
    }

    const confirmMessage = `Are you sure you want to revoke this leave? This will restore ${selectedLeave.TotalDays} days to the employee's leave balance.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setModalLoadingStates(prev => ({ ...prev, revoke: true }));
      const response = await leaveAPI.revokeApprovedLeave(selectedLeave.LeaveApplicationID, {
        reason: revokeReason.trim()
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Leave revoked successfully');
        setShowRevokeModal(false);
        setSelectedLeave(null);
        setRevokeReason('');
        fetchApprovedLeaves();
      } else {
        toast.error(response.data.message || 'Failed to revoke leave');
      }
    } catch (error) {
      console.error('Error revoking leave:', error);
      toast.error(error.response?.data?.message || 'Failed to revoke leave');
    } finally {
      setModalLoadingStates(prev => ({ ...prev, revoke: false }));
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setDateRange({ from: '', to: '' });
    setPaginationStates({
      pending: { page: 1, limit: 20, total: 0 },
      approved: { page: 1, limit: 20, total: 0 }
    });
  };

  // Modal Handlers
  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const handleViewHistory = async (leave) => {
    setSelectedLeave(leave);
    await fetchLeaveHistory(leave.LeaveApplicationID);
    setShowHistoryModal(true);
  };

  const handleModifyClick = (leave) => {
    setSelectedLeave(leave);
    setModifyData({
      fromDate: leave.FromDate.split('T')[0],
      toDate: leave.ToDate.split('T')[0],
      reason: ''
    });
    setShowModifyModal(true);
  };

  const handleRevokeClick = (leave) => {
    setSelectedLeave(leave);
    setShowRevokeModal(true);
  };

  const closeAllModals = () => {
    setShowViewModal(false);
    setShowHistoryModal(false);
    setShowModifyModal(false);
    setShowRevokeModal(false);
    setSelectedLeave(null);
    setRevokeReason('');
    setModifyData({ fromDate: '', toDate: '', reason: '' });
    setLeaveHistory([]);
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

  // Show loading only for initial load
  if (loadingStates.initial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  const currentData = activeTab === 'pending' ? pendingLeaves : approvedLeaves;
  const isCurrentTabLoading = loadingStates[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? (
        // Mobile Layout
        <div className="bg-gray-50 min-h-screen">
          <MobileLeaveManagementHeader
            onRefresh={handleRefresh}
            onExport={handleExportData}
            isLoading={isCurrentTabLoading}
            activeTab={activeTab}
            pendingCount={pendingLeaves.length}
            approvedCount={approvedLeaves.length}
          />
          
          <MobileLeaveManagementFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            dateRange={dateRange}
            setDateRange={setDateRange}
            departments={departments}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
          
          <MobileLeaveManagementTabs
            activeTab={activeTab}
            onTabChange={handleTabSwitch}
            pendingCount={paginationStates.pending.total}
            approvedCount={paginationStates.approved.total}
            isLoading={isCurrentTabLoading}
          />
          
          <MobileLeaveManagementContent
            currentData={currentData}
            activeTab={activeTab}
            isLoading={isCurrentTabLoading}
            currentPagination={currentPagination}
            onUpdatePagination={updatePagination}
            onView={handleViewLeave}
            onApprove={(id) => handleUpdateStatus(id, 'Approved')}
            onReject={(id) => handleUpdateStatus(id, 'Rejected')}
            onModify={handleModifyClick}
            onRevoke={handleRevokeClick}
            onViewHistory={handleViewHistory}
            canManageLeaves={canManageLeaves}
            isAdmin={isAdmin}
            currentUser={user}
          />
        </div>
      ) : (
        // Desktop Layout
        <div className="p-6 space-y-8">
          <DesktopLeaveManagementHeader
            onRefresh={handleRefresh}
            onExport={handleExportData}
            isLoading={isCurrentTabLoading}
          />

          <DesktopLeaveManagementTabs
            activeTab={activeTab}
            onTabChange={handleTabSwitch}
            pendingCount={paginationStates.pending.total}
            approvedCount={paginationStates.approved.total}
            isLoading={isCurrentTabLoading}
          />

          <DesktopLeaveManagementFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            dateRange={dateRange}
            setDateRange={setDateRange}
            departments={departments}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <DesktopLeaveManagementContent
            currentData={currentData}
            activeTab={activeTab}
            isLoading={isCurrentTabLoading}
            currentPagination={currentPagination}
            onUpdatePagination={updatePagination}
            onView={handleViewLeave}
            onApprove={(id) => handleUpdateStatus(id, 'Approved')}
            onReject={(id) => handleUpdateStatus(id, 'Rejected')}
            onModify={handleModifyClick}
            onRevoke={handleRevokeClick}
            onViewHistory={handleViewHistory}
            canManageLeaves={canManageLeaves}
            isAdmin={isAdmin}
            currentUser={user}
          />
        </div>
      )}

      {/* Modals - Shared between mobile and desktop */}
      <LeaveViewModal
        isOpen={showViewModal}
        onClose={closeAllModals}
        leave={selectedLeave}
      />

      <LeaveHistoryModal
        isOpen={showHistoryModal}
        onClose={closeAllModals}
        leave={selectedLeave}
        leaveHistory={leaveHistory}
      />

      <LeaveRevokeModal
        isOpen={showRevokeModal}
        onClose={closeAllModals}
        leave={selectedLeave}
        revokeReason={revokeReason}
        setRevokeReason={setRevokeReason}
        onRevoke={handleRevokeLeave}
        isLoading={modalLoadingStates.revoke}
      />

      <LeaveModifyModal
        isOpen={showModifyModal}
        onClose={closeAllModals}
        leave={selectedLeave}
        modifyData={modifyData}
        setModifyData={setModifyData}
        onModify={handleModifyLeave}
        isLoading={modalLoadingStates.modify}
      />
    </div>
  );
}