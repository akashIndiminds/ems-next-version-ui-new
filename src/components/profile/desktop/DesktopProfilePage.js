// src/components/profile/desktop/DesktopProfilePage.js
'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLock, FiEdit2, FiSave, FiX, FiCamera, FiCheck, FiEye, FiEyeOff, FiBriefcase, FiShield, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DesktopProfilePage = ({ 
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
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your personal information and security settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {profileData?.FullName || `${profileData?.FirstName} ${profileData?.LastName}`}
              </p>
              <p className="text-xs text-slate-600">{profileData?.DesignationName}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              {profileData?.FirstName?.[0]}{profileData?.LastName?.[0]}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Profile Overview */}
          <div className="col-span-4">
            <div className="bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden sticky top-6">
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                      {profileData?.FirstName?.[0]}{profileData?.LastName?.[0]}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors border-2 border-white">
                      <FiCamera className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {profileData?.FullName || `${profileData?.FirstName} ${profileData?.LastName}`}
                  </h3>
                  <p className="text-blue-600 font-semibold mt-1">{profileData?.DesignationName}</p>
                  <p className="text-slate-600 text-sm">{profileData?.DepartmentName}</p>
                  
                  {/* Quick Contact Cards */}
                  <div className="mt-8 w-full space-y-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                      <FiMail className="h-5 w-5 text-slate-500 mr-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm text-slate-900 font-medium truncate">{profileData?.Email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                      <FiPhone className="h-5 w-5 text-blue-600 mr-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Mobile</p>
                        <p className="text-sm text-blue-900 font-medium">{profileData?.MobileNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl">
                      <FiMapPin className="h-5 w-5 text-emerald-600 mr-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">Location</p>
                        <p className="text-sm text-emerald-900 font-medium">{profileData?.LocationName}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="mt-8 w-full pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl">
                        <FiCalendar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Joined</p>
                        <p className="text-lg text-indigo-900 font-bold mt-1">
                          {formatDate(profileData?.DateOfJoining, { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-8 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                      <FiUser className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                      <p className="text-slate-600 text-sm mt-1">Manage your personal details and contact information</p>
                    </div>
                  </div>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <FiEdit2 className="mr-2 w-5 h-5" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <FiSave className="mr-2 w-5 h-5" />
                        Save Changes
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
                        className="flex items-center px-6 py-3 text-slate-600 bg-slate-100 border-2 border-slate-200 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                      >
                        <FiX className="mr-2 w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">First Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.FirstName || ''}
                        onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                        className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                        {profileData?.FirstName || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Last Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.LastName || ''}
                        onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                        className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                        {profileData?.LastName || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Email Address</label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.Email || ''}
                        onChange={(e) => setFormData({...formData, Email: e.target.value})}
                        className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                        {profileData?.Email || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Mobile Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.MobileNumber || ''}
                        onChange={(e) => setFormData({...formData, MobileNumber: e.target.value})}
                        className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                        placeholder="Enter your mobile number"
                      />
                    ) : (
                      <div className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                        {profileData?.MobileNumber || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Date of Birth</label>
                    <div className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                      {formatDate(profileData?.DateOfBirth, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Gender</label>
                    <div className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                      {profileData?.Gender || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                {/* Address - Full Width */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Address</label>
                  {editing ? (
                    <textarea
                      rows="4"
                      value={formData.Address || ''}
                      onChange={(e) => setFormData({...formData, Address: e.target.value})}
                      className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white resize-none"
                      placeholder="Enter your complete address"
                    />
                  ) : (
                    <div className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium min-h-[100px]">
                      {profileData?.Address || 'Not provided'}
                    </div>
                  )}
                </div>
                
                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Emergency Contact</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.EmergencyContact || ''}
                      onChange={(e) => setFormData({...formData, EmergencyContact: e.target.value})}
                      className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white max-w-md"
                      placeholder="Enter emergency contact number"
                    />
                  ) : (
                    <div className="w-full max-w-md px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                      {profileData?.EmergencyContact || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings Card */}
            <div className="bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                    <FiShield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Security Settings</h2>
                    <p className="text-slate-600 text-sm mt-1">Manage your account security and password</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {!changingPassword ? (
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mr-6">
                        <FiLock className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Password Security</h3>
                        <p className="text-slate-600 text-sm mt-1">Keep your account secure with a strong password</p>
                        <p className="text-xs text-slate-500 mt-2">Last updated: Never</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChangingPassword(true)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
                    >
                      <FiSettings className="mr-3 w-5 h-5" />
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 max-w-2xl">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-4 pr-12 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-4 pr-12 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                            placeholder="Enter new password (minimum 8 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-4 pr-12 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white"
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6">
                      <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
                      >
                        <FiCheck className="mr-3 w-5 h-5" />
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
                          setShowCurrentPassword(false);
                          setShowNewPassword(false);
                          setShowConfirmPassword(false);
                        }}
                        className="px-8 py-4 bg-slate-100 text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold flex items-center"
                      >
                        <FiX className="mr-3 w-5 h-5" />
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
    </div>
  );
};

export default DesktopProfilePage;