
// src/components/company/DesktopCompanyHeader.js
"use client";

import { FiCreditCard } from "react-icons/fi";

export default function DesktopCompanyHeader({ 
  companyData, 
  onUpgradeClick 
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Company Settings
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your company details and subscription
          </p>
        </div>
        
        <button
          onClick={onUpgradeClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow flex items-center"
        >
          <FiCreditCard className="w-4 h-4 mr-2" />
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}