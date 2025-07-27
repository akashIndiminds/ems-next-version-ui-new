// src/components/employees/new/desktop/DesktopAddEmployeeForm.js
'use client';

import { FiUser, FiMail, FiPhone, FiCalendar, FiLock, FiMapPin, FiHeart, FiBriefcase, FiSave } from 'react-icons/fi';

export default function DesktopAddEmployeeForm({
  formData,
  onInputChange,
  onSubmit,
  onReset,
  onBack,
  departments,
  designations,
  locations,
  loadingDesignations,
  loadingLocations,
  showCustomDesignation,
  setShowCustomDesignation,
  saving,
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Default value
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FiUser className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Employee Information</h2>
            <p className="text-gray-600">Please provide the employee's complete details</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiUser className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => onInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Group
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHeart className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => onInputChange('bloodGroup', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={formData.address}
                  onChange={(e) => onInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiMail className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => onInputChange('emergencyContact', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter emergency contact"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => onInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Employee will be asked to change this password on first login</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 mb-2">Contact Information</h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p>• Email cannot be changed if used for login</p>
                <p>• Mobile number used for notifications</p>
                <p>• Emergency contact for urgent situations</p>
                <p>• Changes will be reflected immediately</p>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiBriefcase className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => onInputChange('departmentId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                {loadingDesignations ? (
                  <div className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600">Loading designations...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {designations.length > 0 && !showCustomDesignation && (
                      <select
                        required
                        value={formData.designationId}
                        onChange={(e) => onInputChange('designationId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Designation</option>
                        {designations.map(designation => (
                          <option 
                            key={designation.id} 
                            value={designation.id}  
                          >
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter custom designation"
                        />
                        <p className="mt-1 text-xs text-blue-600">
                          A new designation will be created and mapped to this department
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
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        ← Back to available designations
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-3 px-4 pl-10 border border-gray-300 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600">Loading locations...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Work Location</option>
                    {locations.map(location => (
                      <option 
                        key={location.LocationID} 
                        value={location.LocationID.toString()}
                      >
                        {location.LocationName}
                        {location.Address && ` - ${location.Address}`}
                        {location.City && `, ${location.City}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Location Status Messages */}
              {!loadingLocations && locations.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">No locations found.</span> 
                    Please contact your admin to add work locations for your company.
                  </p>
                </div>
              )}
              
              {!loadingLocations && locations.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    ✓ {locations.length} location(s) available for selection
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Joining <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={formData.dateOfJoining}
                  onChange={(e) => onInputChange('dateOfJoining', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm transition-all duration-200 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Employee Setup Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {designations.length > 0 && (
                  <p>• {designations.length} designation(s) available for this department</p>
                )}
                {designations.length === 0 && formData.departmentId && (
                  <p>• No pre-defined designations found for this department</p>
                )}
                {locations.length > 0 && (
                  <p>• {locations.length} work location(s) available</p>
                )}
                <p>• Custom designations will be automatically created</p>
                <p>• Employee Code: Will be auto-generated based on department</p>
                <p>• Status: Will be set to Active by default</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onReset}
              className="bg-gray-100 py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={saving || loadingDesignations || loadingLocations}
              className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Adding Employee...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Add Employee
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}