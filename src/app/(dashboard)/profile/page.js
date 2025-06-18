// src/app/(dashboard)/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, authAPI } from '@/app/lib/api';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              {/* Gradient accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-8">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profileData?.FirstName?.[0]}{profileData?.LastName?.[0]}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {profileData?.FullName || `${profileData?.FirstName} ${profileData?.LastName}`}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{profileData?.DesignationName}</p>
                  <p className="text-sm text-gray-600">{profileData?.DepartmentName}</p>
                  
                  <div className="mt-6 w-full space-y-4">
                    <div className="flex items-center text-sm p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <FiMail className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{profileData?.Email}</span>
                    </div>
                    <div className="flex items-center text-sm p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <FiPhone className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-blue-700 font-medium">{profileData?.MobileNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center text-sm p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                      <FiMapPin className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
                      <span className="text-emerald-700 font-medium">{profileData?.LocationName}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 w-full pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                        <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Employee Code</p>
                        <p className="text-sm text-purple-900 font-bold mt-1">{profileData?.EmployeeCode}</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Joined</p>
                        <p className="text-sm text-indigo-900 font-bold mt-1">
                          {formatDate(profileData?.DateOfJoining, { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FiUser className="mr-3 text-blue-600" />
                    Personal Information
                  </h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="text-emerald-600 hover:text-emerald-800 flex items-center bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors duration-200 font-medium"
                      >
                        <FiSave className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            FirstName: profileData.FirstName,
                            LastName: profileData.LastName,
                            Email: profileData.Email,
                            MobileNumber: profileData.MobileNumber,
                            Address: profileData.Address,
                            EmergencyContact: profileData.EmergencyContact
                          });
                        }}
                        className="text-red-600 hover:text-red-800 flex items-center bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.FirstName || ''}
                        onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.FirstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.LastName || ''}
                        onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.LastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.Email || ''}
                        onChange={(e) => setFormData({...formData, Email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.Email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.MobileNumber || ''}
                        onChange={(e) => setFormData({...formData, MobileNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.MobileNumber || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {formatDate(profileData?.DateOfBirth, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.Gender || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  {editing ? (
                    <textarea
                      rows="3"
                      value={formData.Address || ''}
                      onChange={(e) => setFormData({...formData, Address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.Address || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.EmergencyContact || ''}
                      onChange={(e) => setFormData({...formData, EmergencyContact: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">{profileData?.EmergencyContact || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiLock className="mr-3 text-blue-600" />
                  Security Settings
                </h2>
              </div>
              
              <div className="p-6">
                {!changingPassword ? (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiLock className="mr-2" />
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="Minimum 8 characters"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChangingPassword(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}