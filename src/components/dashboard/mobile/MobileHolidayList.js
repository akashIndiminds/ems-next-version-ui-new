// src/components/dashboard/mobile/MobileHolidayList.js
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Calendar, Gift, Clock, ChevronRight } from 'lucide-react';

const MobileHolidayList = ({ holidays }) => {
  // Calculate days until holiday
  const getDaysUntil = (date) => {
    const today = new Date();
    const holidayDate = new Date(date);
    const timeDiff = holidayDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getHolidayColor = (daysUntil) => {
    if (daysUntil === 0) return 'from-red-500 to-red-600 text-white';
    if (daysUntil <= 7) return 'from-red-50 to-pink-50 border-red-200';
    if (daysUntil <= 30) return 'from-orange-50 to-amber-50 border-orange-200';
    return 'from-blue-50 to-indigo-50 border-blue-200';
  };

  const getIconColor = (daysUntil) => {
    if (daysUntil === 0) return 'text-white bg-white/20';
    if (daysUntil <= 7) return 'text-red-600 bg-red-100';
    if (daysUntil <= 30) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getBadgeColor = (daysUntil) => {
    if (daysUntil === 0) return 'bg-white/20 text-white';
    if (daysUntil <= 7) return 'bg-red-100 text-red-700';
    if (daysUntil <= 30) return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getDaysText = (daysUntil) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days`;
  };

  if (!holidays || holidays.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <FiCalendar className="mr-2 text-purple-600 h-4 w-4" />
            Holidays
          </h2>
        </div>
        <div className="p-4 text-center py-6">
          <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Gift className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No upcoming holidays</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:hidden">
      {/* Header with stats like desktop */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center">
              <FiCalendar className="mr-2 text-purple-600 h-4 w-4" />
              Holidays
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Company and national holidays</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-purple-600">
              {holidays.length} upcoming
            </div>
            <div className="text-xs text-gray-500">
              Next: {getDaysUntil(holidays[0]?.date)} days
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Holiday Cards */}
      <div className="p-3">
        <div 
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {holidays.map((holiday, index) => {
            const daysUntil = getDaysUntil(holiday.date);
            const isToday = daysUntil === 0;
            
            return (
              <div
                key={holiday.id}
                className={`bg-gradient-to-br ${getHolidayColor(daysUntil)} rounded-xl p-3 border-2 transition-all duration-200 hover:shadow-lg flex-shrink-0 w-44 cursor-pointer ${
                  isToday ? 'shadow-lg ring-2 ring-red-200' : ''
                }`}
              >
                {/* Top section: Icon and Days badge */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${getIconColor(daysUntil)}`}>
                    <Gift className="h-4 w-4" />
                  </div>
                  <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-md ${getBadgeColor(daysUntil)}`}>
                    {getDaysText(daysUntil)}
                  </span>
                </div>
                
                {/* Holiday info */}
                <div className="mb-2">
                  <h3 className={`text-sm font-semibold leading-tight mb-1.5 ${
                    isToday ? 'text-white' : 'text-gray-900'
                  }`}>
                    {holiday.name}
                  </h3>
                  
                  <div className={`flex items-center text-xs mb-1 ${
                    isToday ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {formatDate(holiday.date)}
                  </div>
                  
                  <div className={`text-xs ${
                    isToday ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {holiday.type || 'National Holiday'}
                  </div>
                </div>

                {/* Coming soon indicator for nearby holidays */}
                {daysUntil <= 7 && (
                  <div className={`flex items-center text-xs mt-1.5 pt-1.5 border-t border-opacity-50 ${
                    isToday 
                      ? 'text-white/90 border-white/30' 
                      : 'text-gray-500 border-gray-200'
                  }`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {daysUntil <= 1 ? 'Enjoy your holiday!' : 'Coming soon'}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* View More Card */}
          {holidays.length > 3 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 border-dashed rounded-xl p-3 flex-shrink-0 w-32 flex items-center justify-center cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-all duration-200">
              <div className="text-center">
                <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                </div>
                <p className="text-xs font-medium text-gray-700 mb-1">View More</p>
                <p className="text-xs text-gray-500">See all</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats like desktop */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm font-bold text-red-900">
              {holidays.filter(h => getDaysUntil(h.date) <= 7).length}
            </div>
            <div className="text-xs font-medium text-red-700">This Week</div>
          </div>
          <div className="text-center p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm font-bold text-orange-900">
              {holidays.filter(h => getDaysUntil(h.date) <= 30).length}
            </div>
            <div className="text-xs font-medium text-orange-700">This Month</div>
          </div>
          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-bold text-blue-900">{holidays.length}</div>
            <div className="text-xs font-medium text-blue-700">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHolidayList;