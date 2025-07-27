// src/components/employees/edit/mobile/MobileEditEmployeeStep3.js
'use client';

import { FiBriefcase, FiMapPin, FiCalendar, FiChevronLeft, FiSave, FiShield, FiToggleLeft } from 'react-icons/fi';

export default function MobileEditEmployeeStep3({ 
  formData, 
  onInputChange,
  onSubmit,
  onPrevious,
  departments,
  designations,
  locations,
  loadingDesignations,
  loadingLocations,
  showCustomDesignation,
  setShowCustomDesignation,
  saving
}) {
  const isValid = formData.departmentId && formData.locationId && formData.dateOfJoining &&
    (showCustomDesignation ? formData.customDesignation.trim() : formData.designationId);

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Work Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBriefcase className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Work Information</h2>
          </div>

          <div className="space-y-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => onInputChange('departmentId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                {loadingDesignations ? (
                  <div className="flex items-center justify-center py-4 border border-gray-300 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600 text-sm">Loading designations...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {designations.length > 0 && !showCustomDesignation && (
                      <select
                        required
                        value={formData.designationId}
                        onChange={(e) => onInputChange('designationId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        ← Back to available designations
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Work Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-4 pl-10 border border-gray-300 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600 text-sm">Loading locations...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Date of Joining */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Employee Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Type
              </label>
              <select
                value={formData.employeeType}
                onChange={(e) => onInputChange('employeeType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiShield className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>

          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => onInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* User Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <select
                value={formData.userRole}
                onChange={(e) => onInputChange('userRole', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="sticky bottom-4 space-y-3 mt-4">
        <button
          onClick={onPrevious}
          className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
        >
          <FiChevronLeft className="mr-2 h-5 w-5" />
          Previous: Contact Info
        </button>
        
        <button
          onClick={onSubmit}
          disabled={!isValid || saving || loadingDesignations || loadingLocations}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
            isValid && !saving
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Updating Employee...
            </>
          ) : (
            <>
              <FiSave className="mr-2 h-5 w-5" />
              Update Employee
            </>
          )}
        </button>
      </div>
    </div>
  );
}