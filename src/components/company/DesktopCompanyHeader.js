// src/components/company/DesktopCompanyHeader.js
"use client";

import { FiCreditCard } from "react-icons/fi";

export default function DesktopCompanyHeader({ 
  companyData, 
  onUpgradeClick 
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Company Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your company details and subscription
          </p>
        </div>
        
        <button
          onClick={onUpgradeClick}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <FiCreditCard className="w-4 h-4 mr-2" />
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}