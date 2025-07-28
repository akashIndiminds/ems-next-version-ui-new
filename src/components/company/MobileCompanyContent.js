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
  // Track active tab
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <div className="pb-20">
      {/* Mobile Tabs Navigation */}
      <div className="bg-white sticky top-12 z-10 px-2 border-b border-gray-200">
        <div className="flex overflow-x-auto hide-scrollbar py-2">
          <TabButton 
            active={activeTab === "info"} 
            onClick={() => setActiveTab("info")}
            icon={<FiHome className="w-5 h-5" />}
            label="Info"
          />
          <TabButton 
            active={activeTab === "stats"} 
            onClick={() => setActiveTab("stats")}
            icon={<FiUsers className="w-5 h-5" />}
            label="Stats"
          />
          <TabButton 
            active={activeTab === "subscription"} 
            onClick={() => setActiveTab("subscription")}
            icon={<FiCreditCard className="w-5 h-5" />}
            label="Subscription"
          />
          <TabButton 
            active={activeTab === "payments"} 
            onClick={() => setActiveTab("payments")}
            icon={<FiCalendar className="w-5 h-5" />}
            label="Payments"
          />
        </div>
      </div>
      
      <div className="px-4 py-4">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-900">
                  Company Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-2 rounded-lg font-medium text-sm"
                  >
                    <FiEdit2 className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="text-emerald-600 flex items-center bg-emerald-50 px-3 py-2 rounded-lg text-sm"
                    >
                      <FiSave className="mr-1 h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(companyData);
                      }}
                      className="text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg text-sm"
                    >
                      <FiX className="mr-1 h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.CompanyName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, CompanyName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.CompanyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Code
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                    {companyData?.CompanyCode}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.Email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.Email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.ContactNumber || "N/A"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      rows="3"
                      value={formData.Address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.Address || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company Stats</h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {companyData?.TotalEmployees || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-600 rounded-xl">
                  <FiCalendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-emerald-700">
                    Departments
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {companyData?.TotalDepartments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <FiCreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">
                    Locations
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {companyData?.TotalLocations || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Subscription Details
              </h2>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
              >
                Upgrade
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border border-blue-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Trial Plan
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  You are currently on a 30-day free trial
                </p>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Trial ends on:{" "}
                  {format(
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    "MMMM d, yyyy"
                  )}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-3">₹0<span className="text-sm text-gray-600 font-medium">/month</span></p>
              </div>
            </div>
          </div>
        )}
        
        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Payment History</h2>
            
            {paymentHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center">
                <FiCreditCard className="h-12 w-12 text-gray-300 mb-4" />
                <p className="font-medium text-gray-600">
                  No payment history available
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Your transactions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.PaymentID}
                    className="bg-white rounded-xl shadow p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {format(new Date(payment.PaymentDate), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.PaymentStatus === "Success"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.PaymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{payment.PlanName}</span>
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
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-20">
        <NavButton 
          active={activeTab === "info"} 
          onClick={() => setActiveTab("info")}
          icon={<FiHome className="w-5 h-5" />}
          label="Info"
        />
        <NavButton 
          active={activeTab === "stats"} 
          onClick={() => setActiveTab("stats")}
          icon={<FiUsers className="w-5 h-5" />}
          label="Stats"
        />
        <NavButton 
          active={activeTab === "subscription"} 
          onClick={() => setActiveTab("subscription")}
          icon={<FiCreditCard className="w-5 h-5" />}
          label="Plan"
        />
        <NavButton 
          active={activeTab === "payments"} 
          onClick={() => setActiveTab("payments")}
          icon={<FiCalendar className="w-5 h-5" />}
          label="Payments"
        />
      </nav>
    </div>
  );
}

// Tab button for top navigation
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center whitespace-nowrap px-4 py-2 mr-2 rounded-full transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="ml-2 text-sm font-medium">{label}</span>
    </button>
  );
}

// Nav button for bottom navigation
function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
        active ? "text-blue-600" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}
