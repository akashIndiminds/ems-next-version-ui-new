// src/components/employees/edit/desktop/DesktopEditEmployeeForm.js
'use client';

import { 
  FiUser, FiPhone, FiMail, FiBriefcase, FiMapPin, 
  FiCalendar, FiHeart, FiShield, FiSave, FiX 
} from 'react-icons/fi';

export default function DesktopEditEmployeeForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  departments,
  designations,
  locations,
  loadingDesignations,
  loadingLocations,
  showCustomDesignation,
  setShowCustomDesignation,
  saving,
  bloodGroups
}) {
  const safeBloodGroups = bloodGroups || ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUser className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => onInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => onInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => onInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHeart className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => onInputChange('bloodGroup', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Blood Group</option>
                    {safeBloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <div className="absolute top-2 left-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={formData.address}
                  onChange={(e) => onInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiPhone className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => onInputChange('emergencyContact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact number"
              />
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Password cannot be changed here. The employee can reset their password from the login page.
              </p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBriefcase className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Work Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => onInputChange('departmentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation Section */}
            {formData.departmentId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                {loadingDesignations ? (
                  <div className="flex items-center justify-center py-3 border border-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600 text-sm">Loading designations...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {designations.length > 0 && !showCustomDesignation && (
                      <select
                        required
                        value={formData.designationId}
                        onChange={(e) => onInputChange('designationId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Designation</option>
                        {designations.map(designation => (
                          <option key={designation.id} value={designation.id}>
                            {designation.label}
                            {designation.BaseSalary && ` (₹${designation.BaseSalary.toLocaleString()})`}
                          </option>
                        ))}
                        <option value="custom">Others (Specify Custom)</option>
                      </select>
                    )}

                    {(showCustomDesignation || designations.length === 0) && (
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.customDesignation}
                          onChange={(e) => onInputChange('customDesignation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter custom designation"
                        />
                        <p className="mt-1 text-xs text-blue-600">
                          A new designation will be created for this department
                        </p>
                      </div>
                    )}

                    {designations.length > 0 && showCustomDesignation && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomDesignation(false);
                          onInputChange('customDesignation', '');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        ← Back to available designations
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-4 w-4 text-gray-400" />
                </div>
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-3 pl-10 border border-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600 text-sm">Loading locations...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Work Location</option>
                    {locations.map(location => (
                      <option key={location.LocationID} value={location.LocationID.toString()}>
                        {location.LocationName}
                        {location.Address && ` - ${location.Address}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => onInputChange('dateOfJoining', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
              <select
                value={formData.employeeType}
                onChange={(e) => onInputChange('employeeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiShield className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => onInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
              <select
                value={formData.userRole}
                onChange={(e) => onInputChange('userRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <FiX className="h-5 w-5" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={saving || loadingDesignations || loadingLocations}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            saving
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <FiSave className="h-5 w-5" />
              <span>Update Employee</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}