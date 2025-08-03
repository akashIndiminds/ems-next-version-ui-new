// src/app/(dashboard)/employees/[id]/edit/EditEmployeeClient.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function EditEmployeeClient({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCustomDesignation, setShowCustomDesignation] = useState(false);
  const [error, setError] = useState(null);
  
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
  });

  useEffect(() => {
    console.log('EditEmployeeClient mounted with params:', params);
    
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    
    const employeeId = params?.id || params;
    console.log('Employee ID extracted:', employeeId);
    
    if (employeeId) {
      fetchEmployeeData(employeeId);
    } else {
      console.error('No employee ID found in params');
      setError('No employee ID provided');
      setLoading(false);
    }
  }, [params, user]);

 const fetchEmployeeData = async (employeeId) => {
  try {
    console.log('Fetching employee data for ID:', employeeId);
    setLoading(true);
    setError(null);
    
    // Check if user and company are available
    if (!user?.company?.companyId) {
      throw new Error('User company information not available');
    }
    
    const companyId = user.company.companyId;
    console.log('Company ID:', companyId);
    
    // Fetch all required data in parallel
    const [employeeRes, departmentsRes, locationsRes] = await Promise.all([
      employeeAPI.getById(employeeId),
      departmentAPI.getByCompany(companyId),
      // Fix: Direct API call with proper company ID
      locationAPI.getByCompany(companyId)
    ]);

    console.log('API responses:', {
      employee: employeeRes?.data,
      departments: departmentsRes?.data,
      locations: locationsRes?.data
    });

    if (employeeRes?.data?.success) {
      const empData = employeeRes.data.data;
      console.log('Employee data received:', empData);
      setEmployee(empData);
      
      // Set form data with safe access to properties
      setFormData({
        firstName: empData.FirstName || '',
        lastName: empData.LastName || '',
        email: empData.Email || '',
        mobileNumber: empData.MobileNumber || '',
        departmentId: empData.DepartmentID ? empData.DepartmentID.toString() : '',
        designationId: empData.DesignationID ? empData.DesignationID.toString() : '',
        customDesignation: '',
        locationId: empData.LocationID ? empData.LocationID.toString() : '',
        dateOfBirth: empData.DateOfBirth ? empData.DateOfBirth.split('T')[0] : '',
        dateOfJoining: empData.DateOfJoining ? empData.DateOfJoining.split('T')[0] : '',
        gender: empData.Gender || 'Male',
        address: empData.Address || '',
        emergencyContact: empData.EmergencyContact || '',
        bloodGroup: empData.BloodGroup || '',
      });

      // Set departments
      if (departmentsRes?.data?.success) {
        console.log('Departments loaded:', departmentsRes.data.data);
        setDepartments(departmentsRes.data.data || []);
      } else {
        console.warn('Departments not loaded successfully:', departmentsRes?.data);
        setDepartments([]);
      }

      // Set locations - company specific
      if (locationsRes?.data?.success) {
        console.log('Locations loaded for company:', locationsRes.data.data);
        setLocations(locationsRes.data.data || []);
      } else {
        console.warn('Locations not loaded successfully:', locationsRes?.data);
        setLocations([]);
      }

      // Fetch designations for the employee's department
      if (empData.DepartmentID) {
        await fetchDesignationsByDepartment(empData.DepartmentID.toString());
      }
    } else {
      console.error('Employee API returned unsuccessful response:', employeeRes?.data);
      throw new Error('Failed to load employee data - API returned unsuccessful response');
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    setError(`Error: ${error.message}`);
    
    if (error.response?.status === 404) {
      toast.error('Employee not found');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to edit this employee');
    } else {
      toast.error('Failed to load employee data');
    }
    
    // Don't redirect immediately - let user see the error
    setTimeout(() => {
      router.push('/employees');
    }, 3000);
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
      console.log('Fetching designations for department:', departmentId);
      setLoadingDesignations(true);
      const response = await dropdownAPI.getDesignationsByDepartment(departmentId);
      
      console.log('Designations response:', response?.data);
      
      if (response?.data?.success) {
        const designationsData = response.data.data || [];
        console.log('Designations loaded:', designationsData);
        setDesignations(designationsData);
        setShowCustomDesignation(designationsData.length === 0);
      } else {
        console.warn('Designations not loaded successfully:', response?.data);
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
      const employeeId = params?.id || params;
      
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
      };

      // Handle designation
      if (showCustomDesignation) {
        updateData.customDesignation = formData.customDesignation;
      } else {
        updateData.designationId = parseInt(formData.designationId);
      }

      console.log('Updating employee with data:', updateData);
      const response = await employeeAPI.update(employeeId, updateData);
      
      if (response?.data?.success) {
        toast.success('Employee updated successfully!');
        router.push('/employees');
      } else {
        throw new Error('Update failed - API returned unsuccessful response');
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
    console.log('Input changed:', field, value);
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

  // Debug information in development
  if (process.env.NODE_ENV === 'development') {
    console.log('EditEmployeeClient current state:', {
      loading,
      employee: employee ? 'loaded' : 'null',
      error,
      params,
      user: user ? 'authenticated' : 'not authenticated',
      formData: Object.keys(formData).reduce((acc, key) => {
        acc[key] = formData[key] ? 'has value' : 'empty';
        return acc;
      }, {}),
      departments: departments.length,
      designations: designations.length,
      locations: locations.length
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs text-gray-400">ID: {params?.id || params}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error loading employee data</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go back to employees
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Employee not found</p>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go back to employees
          </button>
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