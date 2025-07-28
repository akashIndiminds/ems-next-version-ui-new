// src/app/(dashboard)/company/components/DesktopCompanyContent.js
import { FiEdit2, FiSave, FiX, FiCreditCard, FiUsers, FiCalendar, FiHome } from "react-icons/fi";
import { format } from "date-fns";

export default function DesktopCompanyContent({
  companyData,
  formData,
  setFormData,
  editing,
  setEditing,
  handleUpdate,
  paymentHistory,
  setShowUpgradeModal
}) {
  return (
    <div className="w-full p-6 mx-auto px-6 py-8">
      <div className="grid p-6 grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-8">
          {/* Company Details */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiHome className="mr-3 text-blue-600" />
                  Company Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdate}
                      className="text-emerald-600 hover:text-emerald-800 flex items-center bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors duration-200 font-medium"
                    >
                      <FiSave className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(companyData);
                      }}
                      className="text-red-600 hover:text-red-800 flex items-center bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.CompanyName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, CompanyName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.CompanyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Code
                  </label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                    {companyData?.CompanyCode}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.Email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.Email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.ContactNumber || "N/A"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      rows="3"
                      value={formData.Address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border">
                      {companyData?.Address || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
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

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
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

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
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
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiCalendar className="mr-3 text-blue-600" />
                Payment History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FiCreditCard className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="font-medium">
                            No payment history available
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Your transactions will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paymentHistory.map((payment, index) => (
                      <tr
                        key={payment.PaymentID}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {format(new Date(payment.PaymentDate), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.PlanName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ₹{payment.Amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                              payment.PaymentStatus === "Success"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {payment.PaymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="col-span-4">
          {/* Subscription Details */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden sticky top-6">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiCreditCard className="mr-3 text-blue-600" />
                  Subscription Details
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
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
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">₹0</p>
                    <p className="text-sm text-gray-600 font-medium">/month</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
