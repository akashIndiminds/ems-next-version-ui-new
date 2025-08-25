import { Calendar, Gift, Clock, ChevronRight } from 'lucide-react';

const DesktopHolidayList = ({ holidays }) => {
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
    if (daysUntil <= 7) return 'from-red-50 to-pink-50 border-red-200';
    if (daysUntil <= 30) return 'from-orange-50 to-amber-50 border-orange-200';
    return 'from-blue-50 to-indigo-50 border-blue-200';
  };

  const getIconColor = (daysUntil) => {
    if (daysUntil <= 7) return 'text-red-600 bg-red-100';
    if (daysUntil <= 30) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getBadgeColor = (daysUntil) => {
    if (daysUntil <= 7) return 'bg-red-100 text-red-700';
    if (daysUntil <= 30) return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  // Sample data for demo if no holidays provided
  const sampleHolidays = holidays || [
    { id: 1, name: 'Christmas Day', date: '2025-12-25', type: 'National Holiday' },
    { id: 2, name: 'New Year\'s Day', date: '2026-01-01', type: 'National Holiday' },
    { id: 3, name: 'Martin Luther King Jr. Day', date: '2026-01-19', type: 'Federal Holiday' },
    { id: 4, name: 'Presidents Day', date: '2026-02-16', type: 'Federal Holiday' },
    { id: 5, name: 'Memorial Day', date: '2026-05-25', type: 'Federal Holiday' },
    { id: 6, name: 'Independence Day', date: '2026-07-04', type: 'National Holiday' }
  ];

  if (!sampleHolidays || sampleHolidays.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="mr-3 text-purple-600 h-6 w-6" />
            Upcoming Holidays
          </h2>
          <p className="text-sm text-gray-600 mt-1">Company and national holidays</p>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming holidays</h3>
          <p className="text-gray-500">Check back later for holiday updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-3 text-purple-600 h-6 w-6" />
              Upcoming Holidays
            </h2>
            <p className="text-sm text-gray-600 mt-1">Company and national holidays</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-purple-600">
              {sampleHolidays.length} upcoming
            </div>
            <div className="text-xs text-gray-500">
              Next: {getDaysUntil(sampleHolidays[0]?.date)} days
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Holiday Cards */}
      <div className="p-3">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {sampleHolidays.map((holiday, index) => {
            const daysUntil = getDaysUntil(holiday.date);
            return (
              <div
                key={holiday.id}
                className={`bg-gradient-to-br ${getHolidayColor(daysUntil)} rounded-lg p-3 border-2 transition-all duration-200 hover:shadow-lg flex-shrink-0 w-56 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${getIconColor(daysUntil)}`}>
                    <Gift className="h-4 w-4" />
                  </div>
                  <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-md ${getBadgeColor(daysUntil)}`}>
                    {daysUntil === 0 
                      ? 'Today' 
                      : daysUntil === 1 
                        ? 'Tomorrow' 
                        : `${daysUntil} days`
                    }
                  </span>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1.5">
                    {holiday.name}
                  </h3>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {formatDate(holiday.date)}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {holiday.type || 'National Holiday'}
                  </div>
                </div>

                {daysUntil <= 7 && (
                  <div className="flex items-center text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-gray-200 border-opacity-50">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysUntil <= 1 ? 'Enjoy your holiday!' : 'Coming soon'}
                  </div>
                )}
              </div>
            );
          })}

          {/* View More Card */}
          {sampleHolidays.length > 6 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 border-dashed rounded-lg p-3 flex-shrink-0 w-56 flex items-center justify-center cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-all duration-200">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-xs font-medium text-gray-700 mb-1">View More</p>
                <p className="text-xs text-gray-500">See all upcoming holidays</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-base font-bold text-red-900">
              {sampleHolidays.filter(h => getDaysUntil(h.date) <= 7).length}
            </div>
            <div className="text-xs font-medium text-red-700">This Week</div>
          </div>
          <div className="text-center p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-base font-bold text-orange-900">
              {sampleHolidays.filter(h => getDaysUntil(h.date) <= 30).length}
            </div>
            <div className="text-xs font-medium text-orange-700">This Month</div>
          </div>
          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-base font-bold text-blue-900">{sampleHolidays.length}</div>
            <div className="text-xs font-medium text-blue-700">Total Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHolidayList;