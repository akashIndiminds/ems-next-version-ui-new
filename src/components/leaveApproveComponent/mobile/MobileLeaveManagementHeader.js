// components/leaveapprovecomponent/MobileLeaveManagementHeader.js
"use client";

import React from "react";
import { FiArrowLeft, FiRefreshCw, FiDownload, FiMenu } from "react-icons/fi";
import Link from "next/link";

export function MobileLeaveManagementHeader({
  onRefresh,
  onExport,
  isLoading,
  activeTab,
  pendingCount,
  approvedCount,
}) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm md:hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/leaves"
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-xs text-gray-500">Manage leave requests</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onExport}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiDownload className="h-5 w-5" />
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pb-4">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 min-w-[140px]">
            <div className="text-2xl font-bold text-amber-700">
              {pendingCount}
            </div>
            <div className="text-xs text-amber-600 font-medium">Pending</div>
          </div>
          <div className="flex-shrink-0 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3 min-w-[140px]">
            <div className="text-2xl font-bold text-green-700">
              {approvedCount}
            </div>
            <div className="text-xs text-green-600 font-medium">Approved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
