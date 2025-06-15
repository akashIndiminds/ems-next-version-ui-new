// src/app/(dashboard)/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { employeeAPI, authAPI } from '@/app/lib/api';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your personal information and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
                {profileData?.FirstName?.[0]}{profileData?.LastName?.[0]}
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                {profileData?.FullName || `${profileData?.FirstName} ${profileData?.LastName}`}
              </h3>
              <p className="text-sm text-gray-500">{profileData?.DesignationName}</p>
              <p className="text-sm text-gray-500">{profileData?.DepartmentName}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center text-sm">
                  <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{profileData?.Email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{profileData?.MobileNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiMapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{profileData?.LocationName}</span>
                </div>
              </div>
              
              <div className="mt-6 w-full pt-6 border-t border-gray-200">
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Employee Code</dt>
                    <dd className="text-gray-900 font-medium">{profileData?.EmployeeCode}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Joined</dt>
                    <dd className="text-gray-900">
                      {format(new Date(profileData?.DateOfJoining), 'MMM yyyy')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <FiEdit2 className="mr-1" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="text-green-600 hover:text-green-700 flex items-center"
                  >
                    <FiSave className="mr-1" />
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
                    className="text-red-600 hover:text-red-700 flex items-center"
                  >
                    <FiX className="mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.FirstName}
                      onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.FirstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.LastName}
                      onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.LastName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.Email}
                      onChange={(e) => setFormData({...formData, Email: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.Email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.MobileNumber}
                      onChange={(e) => setFormData({...formData, MobileNumber: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.MobileNumber || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData?.DateOfBirth 
                      ? format(new Date(profileData.DateOfBirth), 'MMM d, yyyy')
                      : 'Not provided'
                    }
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData?.Gender || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                {editing ? (
                  <textarea
                    rows="2"
                    value={formData.Address}
                    onChange={(e) => setFormData({...formData, Address: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData?.Address || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.EmergencyContact}
                    onChange={(e) => setFormData({...formData, EmergencyContact: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData?.EmergencyContact || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            </div>
            
            <div className="p-6">
              {!changingPassword ? (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiLock className="mr-2" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}