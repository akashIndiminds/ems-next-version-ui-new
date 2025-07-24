// src/components/attendanceManagement/MobileAttendanceDetails.js
import { FiUser, FiClock, FiSave, FiTrash2, FiXCircle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiUser className="mr-2 text-purple-600 h-5 w-5" />
          Details
        </h2>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Employee Info - Horizontal Scroll Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {/* Employee Card */}
          <div className="bg-gray-50 rounded-xl p-3 min-w-[140px] flex-shrink-0">
            <div className="text-xs font-medium text-gray-600 mb-1">Employee</div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              {attendanceData.employee.employeeName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {attendanceData.employee.employeeCode}
            </div>
          </div>

          {/* Department Card */}
          <div className="bg-gray-50 rounded-xl p-3 min-w-[120px] flex-shrink-0">
            <div className="text-xs font-medium text-gray-600 mb-1">Department</div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              {attendanceData.employee.departmentName}
            </div>
          </div>

          {/* Date Card */}  
          <div className="bg-gray-50 rounded-xl p-3 min-w-[100px] flex-shrink-0">
            <div className="text-xs font-medium text-gray-600 mb-1">Date</div>
            <div className="text-sm font-semibold text-gray-900">
              {attendanceManagementUtils.formatDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Context Alerts */}
        {(attendanceData.context.isHoliday || attendanceData.context.isOnLeave) && (
          <div className="space-y-2">
            {attendanceData.context.isHoliday && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <FiAlertCircle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                <div className="text-xs text-yellow-800">Holiday</div>
              </div>
            )}
            
            {attendanceData.context.isOnLeave && (
              <div className="flex items-center p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <FiAlertCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                <div className="text-xs text-purple-800">
                  On {attendanceData.context.leaveDetails?.LeaveTypeName || 'leave'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance Status */}
        {attendanceData.attendance.attendanceId ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <div className="text-xs font-medium text-green-800">Record Exists</div>
                  <div className="text-xs text-green-600">
                    {attendanceData.attendance.attendanceStatus} • {attendanceData.attendance.workingHours || 0}h
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center">
              <FiAlertCircle className="h-4 w-4 text-orange-600 mr-2" />
              <div className="text-xs font-medium text-orange-800">No record found</div>
            </div>
          </div>
        )}

        {/* Attendance Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {/* Check-in Time */}
            <div className="bg-gray-50 rounded-xl p-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Check-in
              </label>
              <div className="relative">
                <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                  className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Check-out Time */}
            <div className="bg-gray-50 rounded-xl p-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Check-out
              </label>
              <div className="relative">
                <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                  className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Working Hours Display */}
          {workingHours > 0 && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-800 text-center">
                <strong>Working Hours:</strong> {workingHours}h
              </div>
            </div>
          )}

          {/* Attendance Status - Horizontal Scroll */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {ATTENDANCE_CONSTANTS.STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({...formData, attendanceStatus: option.value})}
                  className={`flex-shrink-0 p-2 rounded-xl border-2 transition-colors duration-200 min-w-[60px] ${
                    formData.attendanceStatus === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm mb-1">{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
              placeholder="Optional remarks..."
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.remarks.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {/* Main Action */}
            <button
              type="submit"
              disabled={saving || !formData.attendanceStatus}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : isEditMode ? 'Update' : 'Set Attendance'}
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 font-medium"
              >
                <FiXCircle className="mr-1 h-4 w-4" />
                Reset
              </button>
              
              {isEditMode && attendanceData?.attendance?.attendanceId && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={saving}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-70 font-medium"
                >
                  <FiTrash2 className="mr-1 h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileAttendanceDetails;