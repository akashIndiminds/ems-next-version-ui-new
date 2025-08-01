// src/components/profile/mobile/MobileProfilePage.js
'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX, FiCamera, FiCheck, FiEye, FiEyeOff, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MobileProfilePage = ({ 
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
  const [activeTab, setActiveTab] = useState('profile'); // profile, security

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:hidden">
      {/* Mobile Header - Fixed */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <button className="mr-3 p-2 -ml-2 rounded-lg hover:bg-slate-100">
              <FiArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">My Profile</h1>
              <p className="text-xs text-slate-600">Manage your account</p>
            </div>
          </div>
          {!editing && !changingPassword && (
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profileData?.FirstName?.[0]}{profileData?.LastName?.[0]}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600">
              <FiCamera className="w-3 h-3" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">
            {profileData?.FullName || `${profileData?.FirstName} ${profileData?.LastName}`}
          </h2>
          <p className="text-blue-100 text-sm font-medium mt-1">{profileData?.DesignationName}</p>
          <p className="text-blue-200 text-sm">{profileData?.DepartmentName}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Employee ID</p>
              <p className="text-sm text-slate-900 font-bold mt-1">{profileData?.EmployeeCode}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Joined</p>
              <p className="text-sm text-slate-900 font-bold mt-1">
                {formatDate(profileData?.DateOfJoining, { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiUser className="w-4 h-4 mx-auto mb-1" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'security'
                  ? 'bg-red-50 text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiLock className="w-4 h-4 mx-auto mb-1" />
              Security
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        {activeTab === 'profile' && (
          <div className="mt-4 space-y-4">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Contact Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <FiMail className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-900 font-medium truncate">{profileData?.Email}</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FiPhone className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-blue-900 font-medium">{profileData?.MobileNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-emerald-900 font-medium">{profileData?.LocationName}</span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Personal Details</h3>
                {editing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg"
                    >
                      <FiSave className="w-3 h-3 mr-1 inline" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
                    >
                      <FiX className="w-3 h-3 mr-1 inline" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.FirstName || ''}
                      onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                      {profileData?.FirstName || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.LastName || ''}
                      onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                      {profileData?.LastName || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.Email || ''}
                      onChange={(e) => setFormData({...formData, Email: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                      {profileData?.Email || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Mobile Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.MobileNumber || ''}
                      onChange={(e) => setFormData({...formData, MobileNumber: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                      {profileData?.MobileNumber || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Date of Birth</label>
                  <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                    {formatDate(profileData?.DateOfBirth, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Gender</label>
                  <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                    {profileData?.Gender || 'Not provided'}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Address</label>
                  {editing ? (
                    <textarea
                      rows="3"
                      value={formData.Address || ''}
                      onChange={(e) => setFormData({...formData, Address: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter address"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 min-h-[80px]">
                      {profileData?.Address || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Emergency Contact</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.EmergencyContact || ''}
                      onChange={(e) => setFormData({...formData, EmergencyContact: e.target.value})}
                      className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter emergency contact"
                    />
                  ) : (
                    <div className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                      {profileData?.EmergencyContact || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Security Settings</h3>
              </div>
              <div className="p-4">
                {!changingPassword ? (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiLock className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 mb-2">Change Password</h3>
                    <p className="text-xs text-slate-600 mb-4">Update your account password for better security</p>
                    <button
                      onClick={() => setChangingPassword(true)}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-3 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? <FiEyeOff className="w-4 h-4 text-slate-400" /> : <FiEye className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-3 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? <FiEyeOff className="w-4 h-4 text-slate-400" /> : <FiEye className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-3 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? <FiEyeOff className="w-4 h-4 text-slate-400" /> : <FiEye className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="space-y-3 pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center justify-center"
                      >
                        <FiCheck className="w-4 h-4 mr-2" />
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
                        className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 flex items-center justify-center"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProfilePage;