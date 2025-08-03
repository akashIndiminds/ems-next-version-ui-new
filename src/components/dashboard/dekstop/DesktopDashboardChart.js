// components/dashboard/desktop/DesktopDashboardChart.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DesktopDashboardChart = ({ chartData, userRole }) => {
  // Only show chart for admin/manager
  if (userRole !== 'admin' && userRole !== 'manager') {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Weekly Attendance</h2>
        <p className="text-sm text-gray-600">Daily attendance patterns across the week</p>
      </div>

      <div className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={11}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={11}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '12px',
                  fontSize: '11px'
                }}
              />
              <Bar 
                dataKey="present" 
                fill="#10b981" 
                name="Present" 
                radius={[3, 3, 0, 0]}
              />
              <Bar 
                dataKey="absent" 
                fill="#ef4444" 
                name="Absent" 
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compact Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-200">
          <div className="text-center p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="text-lg font-semibold text-emerald-900">88.4%</div>
            <div className="text-xs font-medium text-emerald-700">Avg Present</div>
          </div>
          <div className="text-center p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-lg font-semibold text-blue-900">442</div>
            <div className="text-xs font-medium text-blue-700">Total Sessions</div>
          </div>
          <div className="text-center p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-lg font-semibold text-purple-900">+5.2%</div>
            <div className="text-xs font-medium text-purple-700">vs Last Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboardChart;