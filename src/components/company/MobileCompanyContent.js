
// src/app/(dashboard)/company/components/MobileCompanyContent.js
import { useState } from "react";
import { FiEdit2, FiSave, FiX, FiCreditCard, FiUsers, FiCalendar, FiHome } from "react-icons/fi";
import { format } from "date-fns";

export default function MobileCompanyContent({
  companyData,
  formData,
  setFormData,
  editing,
  setEditing,
  handleUpdate,
  paymentHistory,
  setShowUpgradeModal
}) {
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <div className="pb-16">
      {/* Compact Mobile Tabs */}
      <div className="bg-white sticky top-11 z-10 px-2 border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar">
          <TabButton 
            active={activeTab === "info"} 
            onClick={() => setActiveTab("info")}
            icon={<FiHome className="w-4 h-4" />}
            label="Info"
          />
          <TabButton 
            active={activeTab === "stats"} 
            onClick={() => setActiveTab("stats")}
            icon={<FiUsers className="w-4 h-4" />}
            label="Stats"
          />
          <TabButton 
            active={activeTab === "subscription"} 
            onClick={() => setActiveTab("subscription")}
            icon={<FiCreditCard className="w-4 h-4" />}
            label="Subscription"
          />
          <TabButton 
            active={activeTab === "payments"} 
            onClick={() => setActiveTab("payments")}
            icon={<FiCalendar className="w-4 h-4" />}
            label="History"
          />
        </div>
      </div>
      
      <div className="px-3 py-3">
        {/* Info Tab - Optimized */}
        {activeTab === "info" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-blue-50/50">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-900">
                  Company Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center bg-white px-2.5 py-1.5 rounded-md font-medium text-xs border border-blue-200"
                  >
                    <FiEdit2 className="mr-1 h-3 w-3" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handleUpdate}
                      className="text-emerald-600 flex items-center bg-white px-2.5 py-1.5 rounded-md text-xs border border-emerald-200"
                    >
                      <FiSave className="mr-1 h-3 w-3" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(companyData);
                      }}
                      className="text-red-600 flex items-center bg-white px-2.5 py-1.5 rounded-md text-xs border border-red-200"
                    >
                      <FiX className="mr-1 h-3 w-3" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.CompanyName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, CompanyName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      {companyData?.CompanyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Code
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {companyData?.CompanyCode}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.Email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      {companyData?.Email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.ContactNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ContactNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      {companyData?.ContactNumber || "N/A"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      rows="2"
                      value={formData.Address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      {companyData?.Address || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Tab - Compact */}
        {activeTab === "stats" && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-900">Company Stats</h2>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FiUsers className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-blue-700">
                      Total Employees
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {companyData?.TotalEmployees || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <FiCalendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-emerald-700">
                      Departments
                    </p>
                    <p className="text-lg font-bold text-emerald-900">
                      {companyData?.TotalDepartments || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <FiCreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-purple-700">
                      Locations
                    </p>
                    <p className="text-lg font-bold text-purple-900">
                      {companyData?.TotalLocations || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subscription Tab - Compact */}
        {activeTab === "subscription" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-900">
                Subscription
              </h2>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                Upgrade
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Trial Plan
                </h3>
                <p className="text-xs text-gray-700 mt-1">
                  30-day free trial
                </p>
                <p className="text-xs text-gray-700 mt-1 font-medium">
                  Ends: {format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹0<span className="text-xs text-gray-600 font-medium">/month</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Payments Tab - Compact */}
        {activeTab === "payments" && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-900">Payment History</h2>
            
            {paymentHistory.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <FiCreditCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  No payments yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Transactions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.PaymentID}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-900">
                        {format(new Date(payment.PaymentDate), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          payment.PaymentStatus === "Success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.PaymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{payment.PlanName}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{payment.Amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Compact Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex justify-around items-center py-2">
          <NavButton 
            active={activeTab === "info"} 
            onClick={() => setActiveTab("info")}
            icon={<FiHome className="w-4 h-4" />}
            label="Info"
          />
          <NavButton 
            active={activeTab === "stats"} 
            onClick={() => setActiveTab("stats")}
            icon={<FiUsers className="w-4 h-4" />}
            label="Stats"
          />
          <NavButton 
            active={activeTab === "subscription"} 
            onClick={() => setActiveTab("subscription")}
            icon={<FiCreditCard className="w-4 h-4" />}
            label="Plan"
          />
          <NavButton 
            active={activeTab === "payments"} 
            onClick={() => setActiveTab("payments")}
            icon={<FiCalendar className="w-4 h-4" />}
            label="History"
          />
        </div>
      </nav>
    </div>
  );
}

// Optimized Tab Button
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center whitespace-nowrap px-3 py-2 mr-1 rounded-lg transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="ml-1.5 text-xs font-medium">{label}</span>
    </button>
  );
}

// Optimized Bottom Nav Button
function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[60px] py-2 transition-colors ${
        active ? "text-blue-600" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-0.5 font-medium">{label}</span>
    </button>
  );
}