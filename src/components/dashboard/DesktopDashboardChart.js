// src/components/dashboard/DesktopDashboardChart.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DesktopDashboardChart = ({ chartData, userRole }) => {
  // Only show chart for admin/manager
  if (userRole !== 'admin' && userRole !== 'manager') {
    return null;
  }

  return (
    <div className="hidden md:block bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Attendance Overview</h2>
        <p className="text-sm text-gray-600 mt-1">Track daily attendance patterns across the week</p>
      </div>

      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="present" 
                fill="#10b981" 
                name="Present" 
                radius={[6, 6, 0, 0]}
                stroke="#059669"
                strokeWidth={1}
              />
              <Bar 
                dataKey="absent" 
                fill="#ef4444" 
                name="Absent" 
                radius={[6, 6, 0, 0]}
                stroke="#dc2626"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-900 mb-1">88.4%</div>
            <div className="text-sm font-medium text-emerald-700">Average Present</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-900 mb-1">442</div>
            <div className="text-sm font-medium text-blue-700">Total Sessions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-2xl font-bold text-purple-900 mb-1">+5.2%</div>
            <div className="text-sm font-medium text-purple-700">vs Last Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboardChart;