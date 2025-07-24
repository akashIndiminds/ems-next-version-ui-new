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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiTrendingUp className="mr-2 text-blue-600 h-5 w-5" />
          Weekly Overview
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Mini Stats - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="bg-emerald-50 rounded-xl p-3 min-w-[100px] flex-shrink-0 border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <FiUserCheck className="h-4 w-4 text-emerald-600" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-emerald-700">Present</div>
            <div className="text-lg font-bold text-emerald-900">87%</div>
          </div>

          <div className="bg-red-50 rounded-xl p-3 min-w-[100px] flex-shrink-0 border border-red-200">
            <div className="flex items-center justify-between mb-1">
              <FiUserX className="h-4 w-4 text-red-600" />
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-red-700">Absent</div>
            <div className="text-lg font-bold text-red-900">13%</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 min-w-[100px] flex-shrink-0 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <FiUsers className="h-4 w-4 text-blue-600" />
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-blue-700">Total</div>
            <div className="text-lg font-bold text-blue-900">124</div>
          </div>
        </div>

        {/* Compact Chart */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis hide />
                <Bar dataKey="present" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardChart;