// Enhanced Help Text Section with Responsive Design
import { FiAlertCircle, FiUsers, FiCalendar, FiEye, FiSave, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const ResponsiveHelpText = ({ canManageAttendance, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const helpSteps = [
    {
      icon: FiUsers,
      title: "Select Employee",
      description: "Choose the employee from the dropdown list",
      details: "Use the search feature to quickly find employees. Only employees from your company will be shown.",
      color: "blue"
    },
    {
      icon: FiCalendar,
      title: "Choose Date",
      description: "Select the attendance date (cannot be future date)",
      details: "You can only set attendance for today or past dates. Future dates are disabled for data integrity.",
      color: "green"
    },
    {
      icon: FiEye,
      title: "View Data",
      description: "Click 'View Attendance' to load existing data",
      details: "This will show existing attendance records, leave status, and working hours for the selected date.",
      color: "purple"
    },
    {
      icon: FiSave,
      title: "Set/Update",
      description: "Fill in the times and status, then save",
      details: "Set check-in/out times, attendance status, and add remarks. The system will calculate working hours automatically.",
      color: "emerald"
    },
    ...(userRole === 'admin' ? [{
      icon: FiTrash2,
      title: "Delete",
      description: "Remove attendance records if needed (admin only)",
      details: "Only administrators can delete attendance records. This action cannot be undone.",
      color: "red"
    }] : [])
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: "text-blue-600",
        title: "text-blue-900"
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200", 
        text: "text-green-800",
        icon: "text-green-600",
        title: "text-green-900"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800", 
        icon: "text-purple-600",
        title: "text-purple-900"
      },
      emerald: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        icon: "text-emerald-600", 
        title: "text-emerald-900"
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: "text-red-600",
        title: "text-red-900"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      {/* Mobile Compact Version */}
      <div className="block md:hidden bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FiAlertCircle className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-blue-900">Quick Guide</h3>
              <p className="text-xs text-blue-700 mt-0.5">Tap to {isExpanded ? 'hide' : 'view'} steps</p>
            </div>
          </div>
          <FiChevronDown className={`h-5 w-5 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-4 space-y-3">
            {helpSteps.map((step, index) => {
              const colors = getColorClasses(step.color);
              return (
                <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 ${colors.icon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold ${colors.title} mb-1`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs ${colors.text} leading-relaxed`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                <FiAlertCircle className="h-3 w-3 mr-1" />
                Quick Tips
              </h4>
              <div className="space-y-1 text-xs text-amber-800">
                <p>• Times are automatically formatted (24-hour format)</p>
                <p>• Working hours are calculated automatically</p>
                <p>• Leave status is auto-detected from leave requests</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Full Version */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <FiAlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Attendance Management Guide
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Step-by-step instructions for managing employee attendance
                </p>
              </div>
            </div>
            <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {userRole === 'admin' ? 'Admin Access' : 'Manager Access'}
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {helpSteps.map((step, index) => {
              const colors = getColorClasses(step.color);
              return (
                <div key={index} className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:shadow-md transition-shadow duration-200`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 mr-2">STEP {index + 1}</span>
                        <h4 className={`text-base font-semibold ${colors.title}`}>
                          {step.title}
                        </h4>
                      </div>
                      <p className={`text-sm ${colors.text} mb-2 leading-relaxed`}>
                        {step.description}
                      </p>
                      <p className={`text-xs ${colors.text} opacity-80 leading-relaxed`}>
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Features */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h4 className="text-base font-semibold text-emerald-900 mb-3 flex items-center">
                <FiSave className="h-4 w-4 mr-2" />
                Key Features
              </h4>
              <div className="space-y-2 text-sm text-emerald-800">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Automatic working hours calculation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Real-time validation and error checking</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Integration with leave management system</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Audit trail for all attendance changes</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-base font-semibold text-amber-900 mb-3 flex items-center">
                <FiAlertCircle className="h-4 w-4 mr-2" />
                Important Notes
              </h4>
              <div className="space-y-2 text-sm text-amber-800">
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Future dates are disabled to maintain data integrity</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>All times are stored in 24-hour format</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>Changes are logged for compliance purposes</span>
                </div>
                {userRole === 'admin' && (
                  <div className="flex items-start">
                    <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>Delete operations cannot be undone</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveHelpText;