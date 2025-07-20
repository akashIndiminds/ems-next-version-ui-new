// src/components/locations/ApiUsageTracker.js
import { FiInfo } from "react-icons/fi";

const ApiUsageTracker = ({ apiCalls, dailyLimit = 1000 }) => {
  const totalUsage = apiCalls.places + apiCalls.geocoding;
  const usagePercentage = (totalUsage / dailyLimit) * 100;
  const estimatedCost = (apiCalls.places * 0.00283) + (apiCalls.geocoding * 0.005);
  
  return (
    <div className={`border rounded-xl p-4 mb-4 ${
      usagePercentage > 80 ? 'bg-red-50 border-red-200' : 
      usagePercentage > 60 ? 'bg-yellow-50 border-yellow-200' : 
      'bg-blue-50 border-blue-200'
    }`}>
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiInfo className="h-5 w-5 mr-2 text-red" />
          <span className="text-sm text-black font-medium">API Usage Today</span>
        </div>
        <div className="text-sm text-right">
          <div>
            <span className="font-semibold text-black">{apiCalls.places}</span> Places • 
            <span className="font-semibold ml-2 text-black">{apiCalls.geocoding}</span> Geocoding
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Est. Cost: ${estimatedCost.toFixed(4)} USD
          </div>
        </div>
      </div> */}
      
      {/* Usage progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Usage: {totalUsage}/{dailyLimit}</span>
          <span>{usagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercentage > 80 ? 'bg-red-500' : 
              usagePercentage > 60 ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {usagePercentage > 80 && (
        <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
          ⚠️ High API usage! Consider implementing caching or rate limiting.
        </div>
      )}
    </div>
  );
};

export default ApiUsageTracker;