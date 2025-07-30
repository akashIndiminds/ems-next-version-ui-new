// src/components/dashboard/MobileDashboardChart.js
import { FiTrendingUp, FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const MobileDashboardChart = ({ chartData, userRole }) => {
  // Only show chart for admin/manager
  if (userRole !== 'admin' && userRole !== 'manager') {
    return null;
  }

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-sm font-medium text-gray-900 flex items-center">
          <FiTrendingUp className="mr-2 text-blue-600 h-4 w-4" />
          Weekly Overview
        </h2>
      </div>

      <div className="p-3 space-y-3">
        {/* Mini Stats - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="bg-emerald-50 rounded-lg p-2.5 min-w-[80px] flex-shrink-0 border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <FiUserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-xs text-emerald-700">Present</div>
            <div className="text-lg font-bold text-emerald-900">87%</div>
          </div>

          <div className="bg-red-50 rounded-lg p-2.5 min-w-[80px] flex-shrink-0 border border-red-200">
            <div className="flex items-center justify-between mb-1">
              <FiUserX className="h-3.5 w-3.5 text-red-600" />
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-xs text-red-700">Absent</div>
            <div className="text-lg font-bold text-red-900">13%</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2.5 min-w-[80px] flex-shrink-0 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <FiUsers className="h-3.5 w-3.5 text-blue-600" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-xs text-blue-700">Total</div>
            <div className="text-lg font-bold text-blue-900">124</div>
          </div>
        </div>

        {/* Compact Chart */}
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis hide />
                <Bar dataKey="present" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Compact Legend */}
          <div className="flex justify-center gap-3 mt-1.5">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-600">Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardChart;