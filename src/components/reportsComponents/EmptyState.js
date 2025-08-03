// src/app/(dashboard)/reports/components/EmptyState.js
'use client';

import { FiPieChart, FiBarChart, FiDownload, FiTrendingUp } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-8">
        <div className="text-center">
          <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FiPieChart className="h-8 w-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Generate Reports
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
            Configure your report parameters above and click "Generate Report" to view comprehensive analytics and insights for your organization.
          </p>
          
          {/* Features showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <FiBarChart className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Interactive Charts</h4>
              <p className="text-xs text-gray-600 text-center">
                Visualize your data with beautiful, interactive charts and graphs
              </p>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                <FiDownload className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Export Options</h4>
              <p className="text-xs text-gray-600 text-center">
                Export reports in PDF, Excel, and CSV formats for sharing
              </p>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <FiTrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Analytics Insights</h4>
              <p className="text-xs text-gray-600 text-center">
                Get actionable insights from your attendance and employee data
              </p>
            </div>
          </div>
          
          {/* Available report types */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Available Report Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { icon: '📊', name: 'Attendance Report', desc: 'Daily, weekly, monthly attendance tracking' },
                { icon: '🏖️', name: 'Leave Report', desc: 'Leave applications and balance summary' },
                { icon: '👥', name: 'Employee Report', desc: 'Employee details and performance metrics' },
                { icon: '🏢', name: 'Department Report', desc: 'Department-wise analytics and insights' },
                { icon: '📅', name: 'Monthly Summary', desc: 'Comprehensive monthly performance report' }
              ].map((report, index) => (
                <div key={index} className="text-center p-2 bg-white rounded hover:shadow-sm transition-shadow">
                  <div className="text-xl mb-1">{report.icon}</div>
                  <h5 className="text-xs font-medium text-gray-900 mb-0.5">{report.name}</h5>
                  <p className="text-xs text-gray-500">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-6 bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-xs text-blue-700 space-y-0.5 text-left">
              <li>• Use date ranges to analyze specific time periods</li>
              <li>• Filter by department or employee for focused insights</li>
              <li>• Export reports for offline analysis and sharing</li>
              <li>• Check the summary cards for quick overview metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

