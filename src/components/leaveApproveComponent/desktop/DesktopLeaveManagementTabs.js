// components/desktop/DesktopLeaveManagementTabs.js
"use client";
import React from 'react';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export function DesktopLeaveManagementTabs({ 
  activeTab, 
  onTabChange, 
  pendingCount = 0, 
  approvedCount = 0,
  isLoading 
}) {
  const tabs = [
    {
      id: 'pending',
      label: 'Pending Approvals',
      count: pendingCount,
      icon: FiClock,
      activeColor: 'border-amber-500 text-amber-600',
      hoverColor: 'hover:text-amber-600 hover:border-amber-300'
    },
    {
      id: 'approved',
      label: 'Approved Leaves',
      count: approvedCount,
      icon: FiCheckCircle,
      activeColor: 'border-green-500 text-green-600',
      hoverColor: 'hover:text-green-600 hover:border-green-300'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
      <nav className="flex px-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
              index > 0 ? 'ml-8' : ''
            } ${
              activeTab === tab.id
                ? tab.activeColor
                : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 ${tab.hoverColor}`
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            <span>{tab.label} ({tab.count})</span>
            {activeTab === tab.id && isLoading && (
              <div className="ml-2 animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent opacity-60"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}