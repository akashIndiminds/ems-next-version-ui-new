// src/app/(dashboard)/reports/components/EmptyState.js
'use client';

import { FiPieChart, FiBarChart, FiDownload, FiTrendingUp } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-12">
        <div className="text-center">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiPieChart className="h-10 w-10 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Generate Reports
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Configure your report parameters above and click "Generate Report" to view comprehensive analytics and insights for your organization.
          </p>
          
          {/* Features showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <FiBarChart className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Interactive Charts</h4>
              <p className="text-sm text-gray-600 text-center">
                Visualize your data with beautiful, interactive charts and graphs
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <FiDownload className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Export Options</h4>
              <p className="text-sm text-gray-600 text-center">
                Export reports in PDF, Excel, and CSV formats for sharing
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Analytics Insights</h4>
              <p className="text-sm text-gray-600 text-center">
                Get actionable insights from your attendance and employee data
              </p>
            </div>
          </div>
          
          {/* Available report types */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Available Report Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { icon: '📊', name: 'Attendance Report', desc: 'Daily, weekly, monthly attendance tracking' },
                { icon: '🏖️', name: 'Leave Report', desc: 'Leave applications and balance summary' },
                { icon: '👥', name: 'Employee Report', desc: 'Employee details and performance metrics' },
                { icon: '🏢', name: 'Department Report', desc: 'Department-wise analytics and insights' },
                { icon: '📅', name: 'Monthly Summary', desc: 'Comprehensive monthly performance report' }
              ].map((report, index) => (
                <div key={index} className="text-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{report.icon}</div>
                  <h5 className="text-xs font-medium text-gray-900 mb-1">{report.name}</h5>
                  <p className="text-xs text-gray-500">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-8 bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
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