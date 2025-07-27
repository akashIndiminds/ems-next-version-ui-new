// src/app/(dashboard)/employees/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, departmentAPI, dropdownAPI } from '@/app/lib/api';
import { locationAPI } from '@/app/lib/api/locationAPI';
import toast from 'react-hot-toast';

// Mobile Components
import MobileEditEmployeeHeader from '@/components/employees/edit/mobile/MobileEditEmployeeHeader';
import MobileEditEmployeeStep1 from '@/components/employees/edit/mobile/MobileEditEmployeeStep1';
import MobileEditEmployeeStep2 from '@/components/employees/edit/mobile/MobileEditEmployeeStep2';
import MobileEditEmployeeStep3 from '@/components/employees/edit/mobile/MobileEditEmployeeStep3';

// Desktop Components
import DesktopEditEmployeeHeader from '@/components/employees/edit/desktop/DesktopEditEmployeeHeader';
import DesktopEditEmployeeForm from '@/components/employees/edit/desktop/DesktopEditEmployeeForm';

export default function EditEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCustomDesignation, setShowCustomDesignation] = useState(false);
  
  // Mobile specific states
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    departmentId: '',
    designationId: '',
    customDesignation: '',
    locationId: '',
    dateOfBirth: '',
    dateOfJoining: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    status: 'Active',
    employeeType: 'Full Time',
    userRole: 'employee'
  });

  useEffect(() => {
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    fetchEmployeeData();
  }, [params.id, user]);

  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [employeeRes, departmentsRes, locationsRes] = await Promise.all([
        employeeAPI.getById(params.id),
        departmentAPI.getByCompany(user.company.companyId),
        locationAPI.getByCompany(user.company.companyId)
      ]);

      if (employeeRes.data.success) {
        const empData = employeeRes.data.data;
        setEmployee(empData);
        
        // Set form data
        setFormData({
          firstName: empData.FirstName || '',
          lastName: empData.LastName || '',
          email: empData.Email || '',
          mobileNumber: empData.MobileNumber || '',
          departmentId: empData.DepartmentID?.toString() || '',
          designationId: empData.DesignationID?.toString() || '',
          customDesignation: '',
          locationId: empData.LocationID?.toString() || '',
          dateOfBirth: empData.DateOfBirth ? empData.DateOfBirth.split('T')[0] : '',
          dateOfJoining: empData.DateOfJoining ? empData.DateOfJoining.split('T')[0] : '',
          gender: empData.Gender || 'Male',
          address: empData.Address || '',
          emergencyContact: empData.EmergencyContact || '',
          bloodGroup: empData.BloodGroup || '',
          status: empData.Status || 'Active',
          employeeType: empData.EmployeeType || 'Full Time',
          userRole: empData.UserRole || 'employee'
        });

        // Set departments
        if (departmentsRes.data.success) {
          setDepartments(departmentsRes.data.data);
        }

        // Set locations
        if (locationsRes.data.success) {
          setLocations(locationsRes.data.data);
        }

        // Fetch designations for the employee's department
        if (empData.DepartmentID) {
          fetchDesignationsByDepartment(empData.DepartmentID.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Failed to load employee data');
      router.push('/employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch designations based on selected department
  const fetchDesignationsByDepartment = async (departmentId) => {
    if (!departmentId) {
      setDesignations([]);
      setShowCustomDesignation(false);
      return;
    }

    try {
      setLoadingDesignations(true);
      const response = await dropdownAPI.getDesignationsByDepartment(departmentId);
      
      if (response.data.success) {
        setDesignations(response.data.data);
        setShowCustomDesignation(response.data.data.length === 0);
      } else {
        setDesignations([]);
        setShowCustomDesignation(true);
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      setDesignations([]);
      setShowCustomDesignation(true);
    } finally {
      setLoadingDesignations(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.departmentId || !formData.locationId) {
      toast.error('Please select department and location');
      return;
    }

    // Check designation selection
    if (!showCustomDesignation && !formData.designationId) {
      toast.error('Please select a designation');
      return;
    }

    if (showCustomDesignation && !formData.customDesignation.trim()) {
      toast.error('Please enter a custom designation');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        departmentId: parseInt(formData.departmentId),
        locationId: parseInt(formData.locationId),
        dateOfBirth: formData.dateOfBirth || null,
        dateOfJoining: formData.dateOfJoining || null,
        gender: formData.gender,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bloodGroup: formData.bloodGroup,
        status: formData.status,
        employeeType: formData.employeeType,
        userRole: formData.userRole
      };

      // Handle designation
      if (showCustomDesignation) {
        updateData.customDesignation = formData.customDesignation;
      } else {
        updateData.designationId = parseInt(formData.designationId);
      }

      const response = await employeeAPI.update(params.id, updateData);
      if (response.data.success) {
        toast.success('Employee updated successfully!');
        router.push('/employees');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update employee');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle department change
    if (field === 'departmentId') {
      setFormData(prev => ({
        ...prev,
        designationId: '',
        customDesignation: ''
      }));
      fetchDesignationsByDepartment(value);
    }

    // Handle designation selection
    if (field === 'designationId' && value === 'custom') {
      setShowCustomDesignation(true);
      setFormData(prev => ({
        ...prev,
        designationId: ''
      }));
    } else if (field === 'designationId' && value !== 'custom') {
      setShowCustomDesignation(false);
      setFormData(prev => ({
        ...prev,
        customDesignation: ''
      }));
    }
  };

  // Navigation handlers
  const handleBack = () => router.push('/employees');
  const handleCancel = () => router.push('/employees');

  // Mobile step navigation
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMobileSubmit = () => {
    handleUpdateEmployee({ preventDefault: () => {} });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <MobileEditEmployeeHeader
          onBack={handleBack}
          currentStep={currentStep}
          totalSteps={totalSteps}
          employeeName={`${formData.firstName} ${formData.lastName}`}
        />
        
        {/* Step Content */}
        {currentStep === 1 && (
          <MobileEditEmployeeStep1
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            bloodGroups={bloodGroups}
          />
        )}
        
        {currentStep === 2 && (
          <MobileEditEmployeeStep2
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )}
        
        {currentStep === 3 && (
          <MobileEditEmployeeStep3
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleMobileSubmit}
            onPrevious={handlePreviousStep}
            departments={departments}
            designations={designations}
            locations={locations}
            loadingDesignations={loadingDesignations}
            loadingLocations={loadingLocations}
            showCustomDesignation={showCustomDesignation}
            setShowCustomDesignation={setShowCustomDesignation}
            saving={saving}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6 space-y-8">
        <DesktopEditEmployeeHeader 
          onBack={handleBack}
          employeeName={`${formData.firstName} ${formData.lastName}`}
        />
        
        <DesktopEditEmployeeForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleUpdateEmployee}
          onCancel={handleCancel}
          departments={departments}
          designations={designations}
          locations={locations}
          loadingDesignations={loadingDesignations}
          loadingLocations={loadingLocations}
          showCustomDesignation={showCustomDesignation}
          setShowCustomDesignation={setShowCustomDesignation}
          saving={saving}
          bloodGroups={bloodGroups}
        />
      </div>
    </div>
  );
}