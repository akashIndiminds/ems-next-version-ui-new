// src/app/(dashboard)/employees/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { departmentAPI, authAPI, dropdownAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { locationAPI } from '@/app/lib/api/locationAPI';

// Mobile Components
import MobileAddEmployeeHeader from '@/components/employees/new/mobile/MobileAddEmployeeHeader';
import MobileAddEmployeeStep1 from '@/components/employees/new/mobile/MobileAddEmployeeStep1';
import MobileAddEmployeeStep2 from '@/components/employees/new/mobile/MobileAddEmployeeStep2';
import MobileAddEmployeeStep3 from '@/components/employees/new/mobile/MobileAddEmployeeStep3';

// Desktop Components
import DesktopAddEmployeeHeader from '@/components/employees/new/desktop/DesktopAddEmployeeHeader';
import DesktopAddEmployeeForm from '@/components/employees/new/desktop/DesktopAddEmployeeForm';

export default function ResponsiveAddEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCustomDesignation, setShowCustomDesignation] = useState(false);
  
  // Mobile specific states
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Constants - move to top to ensure they're always available
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
    password: '',
    dateOfBirth: '',
    dateOfJoining: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    bloodGroup: ''
  });

  // Remove the duplicate bloodGroups declaration that was here

  useEffect(() => {
    if (user?.role === 'employee') {
      router.push('/dashboard');
      return;
    }
    fetchInitialData();
    // Set default joining date to today
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dateOfJoining: today }));
  }, [user]);

  // Fetch initial data (departments and locations)
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDepartments(),
        fetchLocations()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getByCompany(user.company.companyId);
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await locationAPI.getByCompany(user.company.companyId);
      
      if (response.data.success) {
        setLocations(response.data.data);
        
        // Set first location as default if available
        if (response.data.data.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            locationId: response.data.data[0].LocationID.toString()
          }));
        }
      } else {
        setLocations([]);
        toast.error('Failed to load locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
      
      if (error.response?.status === 404) {
        toast.error('No locations found for your company. Please contact admin.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view locations.');
      } else {
        toast.error('Failed to load locations. Please try again.');
      }
    } finally {
      setLoadingLocations(false);
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
        
        if (response.data.data.length === 0) {
          toast.info('No designations found for this department. You can add a custom designation.');
        }
      } else {
        setDesignations([]);
        setShowCustomDesignation(true);
        toast.info('No designations found for this department. You can add a custom designation.');
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      setDesignations([]);
      setShowCustomDesignation(true);
      toast.error('Failed to load designations. You can add a custom designation.');
    } finally {
      setLoadingDesignations(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.departmentId) {
      toast.error('Please select a department');
      return;
    }

    if (!formData.locationId) {
      toast.error('Please select a location');
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
      
      const employeeData = {
        ...formData,
        companyId: parseInt(user.company.companyId),
        departmentId: parseInt(formData.departmentId),
        locationId: parseInt(formData.locationId)
      };

      // Handle designation
      if (showCustomDesignation) {
        delete employeeData.designationId;
      } else {
        employeeData.designationId = parseInt(formData.designationId);
        delete employeeData.customDesignation;
      }

      const response = await authAPI.addEmployee(employeeData);
      if (response.data.success) {
        toast.success('Employee added successfully!');
        router.push('/employees');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(`Validation Error: ${error.response.data.error}`);
      } else {
        toast.error('Failed to add employee');
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

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const defaultLocationId = locations.length > 0 ? locations[0].LocationID.toString() : '';
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      departmentId: '',
      designationId: '',
      customDesignation: '',
      locationId: defaultLocationId,
      password: '',
      dateOfBirth: '',
      dateOfJoining: today,
      gender: 'Male',
      address: '',
      emergencyContact: '',
      bloodGroup: ''
    });
    setDesignations([]);
    setShowCustomDesignation(false);
    setCurrentStep(1);
  };

  // Navigation handlers
  const handleBack = () => router.push('/employees');

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
    handleAddEmployee({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <MobileAddEmployeeHeader
          onBack={handleBack}
          onReset={resetForm}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        
        {/* Step Content */}
        {currentStep === 1 && (
          <MobileAddEmployeeStep1
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            bloodGroups={bloodGroups}
          />
        )}
        
        {currentStep === 2 && (
          <MobileAddEmployeeStep2
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )}
        
        {currentStep === 3 && (
          <MobileAddEmployeeStep3
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
        <DesktopAddEmployeeHeader onBack={handleBack} />
        
        <DesktopAddEmployeeForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleAddEmployee}
          onReset={resetForm}
          onBack={handleBack}
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