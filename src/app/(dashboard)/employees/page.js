// src/app/(dashboard)/employees/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, departmentAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { DeleteAlert } from '@/components/ui/AlertDialog';

// Mobile Components - Updated import paths
import MobileEmployeesHeader from '@/components/employees/mainpage/mobile/MobileEmployeesHeader';
import MobileEmployeesFilters from '@/components/employees/mainpage/mobile/MobileEmployeesFilters';
import MobileEmployeesContent from '@/components/employees/mainpage/mobile/MobileEmployeesContent';
import MobileEmployeesStats from '@/components/employees/mainpage/mobile/MobileEmployeesStats';

// Desktop Components - Updated import paths
import DesktopEmployeesHeader from '@/components/employees/mainpage/desktop/DesktopEmployeesHeader';
import DesktopEmployeesFilters from '@/components/employees/mainpage/desktop/DesktopEmployeesFilters';
import DesktopEmployeesStats from '@/components/employees/mainpage/desktop/DesktopEmployeesStats';
import DesktopEmployeesTable from '@/components/employees/mainpage/desktop/DesktopEmployeesTable';

export default function ResponsiveEmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Mobile specific states
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('list'); // 'list' or 'card'
  
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [user]);

  // Fetch both employees and departments in parallel and map them
const fetchData = async () => {
  try {
    setLoading(true);
    
    const [employeesResponse, departmentsResponse] = await Promise.all([
      employeeAPI.getAll({
        companyId: user.company.companyId,
        page: 1,
        limit: 100
      }),
      departmentAPI.getByCompany(user.company.companyId)
    ]);
    
    if (employeesResponse.data.success && departmentsResponse.data.success) {
      const employeesData = employeesResponse.data.data.employees || [];
      const departmentsData = departmentsResponse.data.data || [];
      
      const enrichedEmployees = employeesData.map(employee => ({
        ...employee,
        DepartmentName: employee.DepartmentName || 'Unassigned',
        IsActive: employee.IsActive !== undefined ? employee.IsActive : true,
        Gender: employee.Gender || 'Other',
        BloodGroup: employee.BloodGroup || null
      }));
      
      setEmployees(enrichedEmployees);
      setDepartments(departmentsData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to load data');
  } finally {
    setLoading(false);
  }
};

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      setDeleteLoading(true);
      const response = await employeeAPI.delete(employeeToDelete.EmployeeID);
      if (response.data.success) {
        toast.success('Employee deleted successfully');
        setShowDeleteAlert(false);
        setEmployeeToDelete(null);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteAlert(true);
  };

  const handleFilterChange = (key, value) => {
    if (key === null) {
      setActiveFilters(value);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setCurrentPage(1);
  };

  // Navigation handlers - Updated for static export compatibility
  const handleAddEmployee = () => {
    // For static export, we'll use a different approach
    if (typeof window !== 'undefined') {
      router.push('/employees/new');
    }
  };

  const handleViewEmployee = (id) => {
    if (typeof window !== 'undefined') {
      // For static export, consider using query params
      router.push(`/employees/${id}?action=view`);
    }
  };

  const handleEditEmployee = (id) => {
    if (typeof window !== 'undefined') {
      // For static export, consider using query params
      router.push(`/employees/${id}?action=edit`);
    }
  };

  // Filter configuration
const defaultFilters = [
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'unassigned', label: 'Unassigned' },
      ...departments.map(dept => ({
        value: dept.DepartmentName,
        label: dept.DepartmentName
      }))
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ]
  },
  {
    key: 'bloodGroup',
    label: 'Blood Group',
    type: 'select',
    options: [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ]
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' }
    ]
  },
  {
    key: 'joiningDate',
    label: 'Joined After',
    type: 'date'
  }
];

  // Enhanced filtering logic
const filteredEmployees = employees.filter(emp => {
  const matchesSearch = !searchTerm || 
    emp.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.EmployeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.DepartmentName?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesDepartment = !activeFilters.department || 
    (activeFilters.department === 'unassigned' && (!emp.DepartmentName || emp.DepartmentName === 'Unassigned')) ||
    emp.DepartmentName === activeFilters.department;

  const matchesStatus = !activeFilters.status || 
    (emp.IsActive?.toString() || 'true') === activeFilters.status;

  const matchesBloodGroup = !activeFilters.bloodGroup || 
    emp.BloodGroup === activeFilters.bloodGroup;

  const matchesGender = !activeFilters.gender || 
    emp.Gender === activeFilters.gender;

  const matchesJoiningDate = !activeFilters.joiningDate || 
    (emp.DateOfJoining && new Date(emp.DateOfJoining) >= new Date(activeFilters.joiningDate));

  return matchesSearch && matchesDepartment && matchesStatus && 
         matchesBloodGroup && matchesGender && matchesJoiningDate;
});
  const activeFiltersCount = Object.values(activeFilters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <MobileEmployeesHeader
          onAddEmployee={handleAddEmployee}
          onToggleSearch={() => setShowMobileSearch(!showMobileSearch)}
          onToggleFilters={() => setShowMobileFilters(!showMobileFilters)}
          showSearch={showMobileSearch}
          activeFiltersCount={activeFiltersCount}
          totalEmployees={employees.length}
          filteredCount={filteredEmployees.length}
          viewMode={mobileViewMode}
          onViewModeChange={setMobileViewMode}
        />
        
        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="px-4 py-3 bg-white border-b border-gray-200">
           <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl text-black 
                         border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
            />
          </div>
        )}

        <MobileEmployeesContent
          employees={employees}
          departments={departments}
          filteredEmployees={filteredEmployees}
          searchTerm={searchTerm}
          activeFilters={activeFilters}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onDelete={openDeleteDialog}
          onAddEmployee={handleAddEmployee}
          loading={loading}
          viewMode={mobileViewMode}
        />

        <MobileEmployeesFilters
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filters={defaultFilters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6 space-y-6">
        <DesktopEmployeesHeader
          onAddEmployee={handleAddEmployee}
          totalEmployees={employees.length}
          filteredCount={filteredEmployees.length}
        />

        <DesktopEmployeesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={defaultFilters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />

        <DesktopEmployeesStats
          employees={employees}
          departments={departments}
        />

        <DesktopEmployeesTable
          employees={employees}
          filteredEmployees={filteredEmployees}
          searchTerm={searchTerm}
          activeFilters={activeFilters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onDelete={openDeleteDialog}
          onAddEmployee={handleAddEmployee}
          loading={loading}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteAlert
        isOpen={showDeleteAlert}
        onClose={() => {
          setShowDeleteAlert(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteEmployee}
        itemName={`employee ${employeeToDelete?.FirstName} ${employeeToDelete?.LastName}`}
        loading={deleteLoading}
      />
    </div>
  );
}