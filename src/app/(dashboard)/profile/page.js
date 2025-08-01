// src/app/(dashboard)/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, authAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import MobileProfilePage from '@/components/profile/mobile/MobileProfilePage';
import DesktopProfilePage from '@/components/profile/desktop/DesktopProfilePage';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(user.employeeId);
      if (response.data.success) {
        setProfileData(response.data.data);
        setFormData({
          FirstName: response.data.data.FirstName,
          LastName: response.data.data.LastName,
          Email: response.data.data.Email,
          MobileNumber: response.data.data.MobileNumber,
          Address: response.data.data.Address,
          EmergencyContact: response.data.data.EmergencyContact
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await employeeAPI.update(user.employeeId, formData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setEditing(false);
        fetchProfileData();
        // Update user context with new name
        updateUser({
          ...user,
          fullName: `${formData.FirstName} ${formData.LastName}`,
          email: formData.Email
        });
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully');
        setChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  // Helper function to format date
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Common props for both components
  const commonProps = {
    profileData,
    loading,
    editing,
    setEditing,
    formData,
    setFormData,
    handleUpdateProfile,
    changingPassword,
    setChangingPassword,
    passwordData,
    setPasswordData,
    handleChangePassword,
    formatDate
  };

  return (
    <>
      {/* Mobile Component - Shows on small screens */}
      <MobileProfilePage {...commonProps} />
      
      {/* Desktop Component - Shows on medium and large screens */}
      <DesktopProfilePage {...commonProps} />
    </>
  );
}