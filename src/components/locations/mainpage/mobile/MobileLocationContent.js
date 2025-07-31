// components/locations/mainpage/mobile/MobileLocationContent.js
"use client";

import { useState, useTransition } from "react";
import { FiMapPin, FiEdit, FiTrash2, FiTarget, FiMoreVertical, FiCheckCircle, FiXCircle, FiPlus, FiChevronRight } from "react-icons/fi";

export default function MobileLocationContent({ 
  locations, 
  onEdit, 
  onDelete, 
  onTest, 
  onAddLocation 
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isPending, startTransition] = useTransition();

  const toggleDropdown = (locationId, event) => {
    startTransition(() => {
      if (activeDropdown === locationId) {
        setActiveDropdown(null);
      } else {
        // Get button position for proper dropdown placement
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
        setActiveDropdown(locationId);
      }
    });
  };

  const handleAction = (actionFn, ...args) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    startTransition(() => {
      actionFn(...args);
      setActiveDropdown(null);
    });
  };

  // Empty state - compact version
  if (locations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
        <div className="text-center max-w-xs mx-auto">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="h-8 w-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Locations
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Add office locations to track attendance
          </p>
          
          <button
            onClick={onAddLocation}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 active:scale-95"
          >
            Add Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      {/* Header with count */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Locations ({locations.length})
          </h2>
          {/* <button
            onClick={onAddLocation}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiPlus className="h-5 w-5" />
          </button> */}
        </div>
      </div>

      {/* Compact location list */}
      <div className="px-4 py-2">
        <div className="space-y-1">
          {locations.map((location) => (
            <div
              key={location.LocationID}
              className="bg-white rounded-lg border border-gray-200 overflow-visible relative"
            >
              {/* Main row - all info in one line */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  {/* Left side - location info */}
                  <div className="flex items-center flex-1 min-w-0 mr-3">
                    {/* Status dot */}
                    <div className={`h-3 w-3 rounded-full mr-3 flex-shrink-0 ${
                      location.IsActive ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    
                    {/* Location details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {location.LocationName}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {location.LocationCode}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600 truncate">
                          {location.Address?.split(',')[0] || 'No address'}
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          {location.AllowedRadius}m radius
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {/* Quick test button */}
                    <button
                      onClick={() => handleAction(onTest, location)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Test Location"
                    >
                      <FiTarget className="h-4 w-4" />
                    </button>
                    
                    {/* More actions menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(location.LocationID, e)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More actions"
                      >
                        <FiMoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global dropdown overlay - positioned dynamically */}
        {activeDropdown && (
          <>
            {/* Full screen backdrop */}
            <div 
              className="fixed inset-0 z-[100] bg-transparent"
              onClick={() => setActiveDropdown(null)}
            />
            
            {/* Dropdown menu positioned dynamically */}
            <div 
              className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[140px] z-[101]"
              style={{ 
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`
              }}
            >
              <button
                onClick={() => handleAction(onTest, locations.find(l => l.LocationID === activeDropdown))}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FiTarget className="h-4 w-4 mr-2 text-green-600" />
                Test
              </button>
              <button
                onClick={() => handleAction(onEdit, activeDropdown)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FiEdit className="h-4 w-4 mr-2 text-blue-600" />
                Edit
              </button>
              <button
                onClick={() => handleAction(onDelete, activeDropdown)}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <FiTrash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}