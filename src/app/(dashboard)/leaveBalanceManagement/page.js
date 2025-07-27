"use client";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, leaveBalanceAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

// Mobile Components
import MobileLeaveBalanceHeader from "@/components/leavebalanceComponent/mobile/MobileLeaveBalanceHeader";
import MobileLeaveBalanceContent from "@/components/leavebalanceComponent/mobile/MobileLeaveBalanceContent";
import MobileLeaveBalanceFilters from "@/components/leavebalanceComponent/mobile/MobileLeaveBalanceFilters";

// Desktop Components
import DesktopLeaveBalanceHeader from "@/components/leavebalanceComponent/desktop/DesktopLeaveBalanceHeader";
import DesktopLeaveBalanceContent from "@/components/leavebalanceComponent/desktop/DesktopLeaveBalanceContent";
import DesktopLeaveBalanceFilters from "@/components/leavebalanceComponent/desktop/DesktopLeaveBalanceFilters";

const ResponsiveLeaveBalancePage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  // State management
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeBalance, setEmployeeBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("view-balance");
  const [statistics, setStatistics] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    department: '',
    leaveType: '',
    balanceStatus: '',
    searchTerm: ''
  });
  const [departments, setDepartments] = useState([]);

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

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
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
        
        // Extract unique departments
        const uniqueDepartments = [...new Set(response.data.data.map(emp => emp.DepartmentName))]
          .filter(dept => dept)
          .map((dept) => ({ id: dept, name: dept }));
        setDepartments(uniqueDepartments);
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

  // Filter handlers
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // Apply filters logic here if needed
  };

  const handleClearFilters = () => {
    setFilters({
      year: new Date().getFullYear(),
      department: '',
      leaveType: '',
      balanceStatus: '',
      searchTerm: ''
    });
  };

  const handleExport = () => {
    // Export functionality
    toast.success('Export functionality to be implemented');
  };

  // Common props for both mobile and desktop
  const commonProps = {
    activeTab,
    setActiveTab,
    employees,
    selectedEmployee,
    employeeBalance,
    leaveTypes,
    loading,
    onEmployeeSelect: handleEmployeeSelect,
    initializeForm,
    setInitializeForm,
    adjustForm,
    setAdjustForm,
    bulkForm,
    setBulkForm,
    onInitializeBalance: handleInitializeBalance,
    onAdjustBalance: handleAdjustBalance,
    onBulkInitialize: handleBulkInitialize,
    onCarryForward: handleCarryForward,
    user,
    statistics,
  };

  const filterProps = {
    filters,
    setFilters,
    leaveTypes,
    departments,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
    onExport: handleExport,
    loading
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileLeaveBalanceHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          statistics={statistics}
        />
        {activeTab === "view-balance" && (
          <MobileLeaveBalanceFilters {...filterProps} />
        )}
        <MobileLeaveBalanceContent {...commonProps} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-6">
        <DesktopLeaveBalanceHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          statistics={statistics}
          employees={employees}
          leaveTypes={leaveTypes}
        />
        {activeTab === "view-balance" && (
          <DesktopLeaveBalanceFilters {...filterProps} />
        )}
        <DesktopLeaveBalanceContent {...commonProps} />
      </div>
    </div>
  );
};

export default ResponsiveLeaveBalancePage;