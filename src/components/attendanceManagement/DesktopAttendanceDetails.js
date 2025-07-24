// src/components/attendanceManagement/DesktopAttendanceDetails.js
import { FiUser, FiClock, FiSave, FiTrash2, FiXCircle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const DesktopAttendanceDetails = ({
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
    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiUser className="mr-3 text-purple-600 h-6 w-6" />
          Attendance Details
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Employee</div>
            <div className="text-lg font-semibold text-gray-900">
              {attendanceData.employee.employeeName}
            </div>
            <div className="text-sm text-gray-500">
              {attendanceData.employee.employeeCode}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Department</div>
            <div className="text-lg font-semibold text-gray-900">
              {attendanceData.employee.departmentName}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Date</div>
            <div className="text-lg font-semibold text-gray-900">
              {attendanceManagementUtils.formatDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Context Information */}
        {(attendanceData.context.isHoliday || attendanceData.context.isOnLeave) && (
          <div className="space-y-3">
            {attendanceData.context.isHoliday && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div className="text-sm text-yellow-800">
                  This date is marked as a holiday
                </div>
              </div>
            )}
            
            {attendanceData.context.isOnLeave && (
              <div className="flex items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <FiAlertCircle className="h-5 w-5 text-purple-600 mr-3" />
                <div className="text-sm text-purple-800">
                  Employee is on {attendanceData.context.leaveDetails?.LeaveTypeName || 'leave'} for this date
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Attendance Status */}
        {attendanceData.attendance.attendanceId ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="text-sm font-medium text-green-800">
                    Attendance Record Exists
                  </div>
                  <div className="text-xs text-green-600">
                    Status: {attendanceData.attendance.attendanceStatus} • 
                    Working Hours: {attendanceData.attendance.workingHours || 0}h
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                attendanceManagementUtils.getAttendanceStatusColor(attendanceData.attendance.attendanceStatus)
              }`}>
                {attendanceManagementUtils.getAttendanceStatusIcon(attendanceData.attendance.attendanceStatus)} 
                {attendanceData.attendance.attendanceStatus}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-orange-600 mr-3" />
              <div className="text-sm font-medium text-orange-800">
                No attendance record found for this date
              </div>
            </div>
          </div>
        )}

        {/* Attendance Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-in Time
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>

            {/* Check-out Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Check-out Time
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Working Hours Display */}
          {workingHours > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Calculated Working Hours:</strong> {workingHours} hours
              </div>
            </div>
          )}

          {/* Attendance Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attendance Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ATTENDANCE_CONSTANTS.STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({...formData, attendanceStatus: option.value})}
                  className={`p-3 rounded-xl border-2 transition-colors duration-200 hover:shadow-md ${
                    formData.attendanceStatus === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              rows="3"
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Optional remarks about this attendance record..."
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.remarks.length}/500 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              {isEditMode && attendanceData?.attendance?.attendanceId && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={saving}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 flex items-center transition-colors duration-200 shadow-lg font-medium disabled:opacity-50"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete Record
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onReset}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 flex items-center transition-colors duration-200 font-medium"
              >
                <FiXCircle className="mr-2 h-4 w-4" />
                Reset
              </button>
              
              <button
                type="submit"
                disabled={saving || !formData.attendanceStatus}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 font-medium text-lg"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : isEditMode ? 'Update Attendance' : 'Set Attendance'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesktopAttendanceDetails;