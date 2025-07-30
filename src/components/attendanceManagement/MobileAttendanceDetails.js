// src/components/attendanceManagement/MobileAttendanceDetails.js
import { FiUser, FiClock, FiSave, FiTrash2, FiXCircle, FiAlertCircle, FiCheckCircle, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useState, useTransition } from 'react';

const MobileAttendanceDetails = ({
  attendanceData,
  selectedDate,
  formData,
  setFormData,
  isEditMode,
  saving,
  onSubmit,
  onDelete,
  onReset,
  attendanceManagementUtils,
  ATTENDANCE_CONSTANTS
}) => {
  const [isPending, startTransition] = useTransition();
  const [focusedField, setFocusedField] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateWorkingHours = () => {
    if (formData.checkInTime && formData.checkOutTime) {
      return attendanceManagementUtils.calculateWorkingHours(
        formData.checkInTime, 
        formData.checkOutTime
      );
    }
    return 0;
  };

  const workingHours = calculateWorkingHours();

  const handleFormChange = (field, value) => {
    startTransition(() => {
      setFormData(prev => ({ ...prev, [field]: value }));
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <FiUser className="text-white h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <p className="text-xs text-gray-600">Manage record</p>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isEditMode 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isEditMode ? 'Edit' : 'New'}
          </div>
        </div>
      </div>
      
      <div className="p-3 space-y-4">
        {/* Employee Info - Horizontal scroll */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-700 flex items-center">
            <FiUser className="h-3 w-3 mr-1.5" />
            Employee Info
          </h3>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* Employee Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2.5 min-w-[120px] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-blue-700 mb-0.5">Employee</div>
                  <div className="text-sm font-medium text-blue-900 truncate">
                    {attendanceData.employee.employeeName}
                  </div>
                  <div className="text-xs text-blue-600 truncate">
                    {attendanceData.employee.employeeCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-2.5 min-w-[100px] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FiMapPin className="h-3 w-3 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-emerald-700 mb-0.5">Dept</div>
                  <div className="text-sm font-medium text-emerald-900 truncate">
                    {attendanceData.employee.departmentName}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Card */}  
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-2.5 min-w-[90px] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="h-3 w-3 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-purple-700 mb-0.5">Date</div>
                  <div className="text-sm font-medium text-purple-900">
                    {attendanceManagementUtils.formatDate(selectedDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context Alerts */}
        {(attendanceData.context.isHoliday || attendanceData.context.isOnLeave) && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-700 flex items-center">
              <FiAlertCircle className="h-3 w-3 mr-1.5" />
              Alerts
            </h3>
            
            <div className="space-y-1.5">
              {attendanceData.context.isHoliday && (
                <div className="flex items-center p-2.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                  <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center mr-2">
                    <FiAlertCircle className="h-3 w-3 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-yellow-900">Holiday</div>
                    <div className="text-xs text-yellow-700">Public holiday</div>
                  </div>
                </div>
              )}
              
              {attendanceData.context.isOnLeave && (
                <div className="flex items-center p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center mr-2">
                    <FiAlertCircle className="h-3 w-3 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-purple-900">On Leave</div>
                    <div className="text-xs text-purple-700">
                      {attendanceData.context.leaveDetails?.LeaveTypeName || 'Approved leave'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-700 flex items-center">
            <FiCheckCircle className="h-3 w-3 mr-1.5" />
            Status
          </h3>
          
          {attendanceData.attendance.attendanceId ? (
            <div className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <FiCheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-green-900">Record Found</div>
                    <div className="text-xs text-green-700">
                      {attendanceData.attendance.attendanceStatus} • {attendanceData.attendance.workingHours || 0}h
                    </div>
                  </div>
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">
                  Exists
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                  <FiAlertCircle className="h-3 w-3 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs font-medium text-orange-900">No Record</div>
                  <div className="text-xs text-orange-700">Create new record</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-700 flex items-center">
              <FiClock className="h-3 w-3 mr-1.5" />
              Time Records
            </h3>
            
            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Check-in */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-700 block">
                  Check-in
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === 'checkIn' ? 'transform scale-[1.01]' : ''
                }`}>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                    <FiClock className="h-3 w-3 text-emerald-500" />
                  </div>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleFormChange('checkInTime', e.target.value)}
                    onFocus={() => setFocusedField('checkIn')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-7 pr-2 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-sm bg-white transition-all duration-200"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-700 block">
                  Check-out
                </label>
                <div className={`relative transition-all duration-200 ${
                  focusedField === 'checkOut' ? 'transform scale-[1.01]' : ''
                }`}>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                    <FiClock className="h-3 w-3 text-rose-500" />
                  </div>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleFormChange('checkOutTime', e.target.value)}
                    onFocus={() => setFocusedField('checkOut')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-7 pr-2 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500 text-gray-900 text-sm bg-white transition-all duration-200"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* Working Hours Display */}
            {workingHours > 0 && (
              <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <FiClock className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-900">Working Hours</div>
                      <div className="text-xs text-blue-700">Auto-calculated</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {workingHours}h
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Status - Horizontal scroll */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                {formData.attendanceStatus && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                    Set
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {ATTENDANCE_CONSTANTS.STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFormChange('attendanceStatus', option.value)}
                    className={`flex-shrink-0 p-2.5 rounded-lg border transition-all duration-200 active:scale-95 min-w-[70px] ${
                      formData.attendanceStatus === option.value
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm transform scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center space-y-1">
                      <div className="text-lg">{option.icon}</div>
                      <div className="text-xs font-medium text-gray-900">{option.label}</div>
                      {formData.attendanceStatus === option.value && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">
                Remarks
              </label>
              <div className={`relative transition-all duration-200 ${
                focusedField === 'remarks' ? 'transform scale-[1.005]' : ''
              }`}>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)}
                  onFocus={() => setFocusedField('remarks')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm bg-white transition-all duration-200 resize-none"
                  placeholder="Add notes..."
                  maxLength={500}
                  style={{ fontSize: '16px' }}
                />
                <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                  {formData.remarks.length}/500
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Main Action */}
            <button
              type="submit"
              disabled={saving || !formData.attendanceStatus || isPending}
              className={`w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm ${
                saving ? 'cursor-wait' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update' : 'Save'}
                </>
              )}
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              {/* Reset */}
              <button
                type="button"
                onClick={onReset}
                disabled={saving}
                className="min-h-[40px] bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 active:scale-[0.98] flex items-center justify-center transition-all duration-200 font-medium text-sm disabled:opacity-70"
              >
                <FiXCircle className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </button>
              
              {/* Delete */}
              {isEditMode && attendanceData?.attendance?.attendanceId && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={saving}
                  className="min-h-[40px] bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 active:scale-[0.98] flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium text-sm"
                >
                  <FiTrash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Compact Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiCheckCircle className="h-2.5 w-2.5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-medium text-green-900 mb-1">Tips</h4>
              <ul className="text-xs text-green-800 space-y-0.5">
                <li>• Both times recommended for accuracy</li>
                <li>• Hours calculated automatically</li>
                <li>• Add remarks for special cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-4 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Delete Record</h3>
                <p className="text-sm text-gray-600">
                  Delete this attendance record? This cannot be undone.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCancelDelete}
                  className="py-2.5 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAttendanceDetails;