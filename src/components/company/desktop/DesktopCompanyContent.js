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
    <div className="w-full mx-auto py-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8">
          {/* Company Details */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiHome className="mr-2 text-blue-600 h-4 w-4" />
                  Company Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center bg-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <FiEdit2 className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors duration-200 text-sm font-medium"
                    >
                      <FiSave className="mr-1 h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(companyData);
                      }}
                      className="text-red-600 hover:text-red-700 flex items-center bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                    >
                      <FiX className="mr-1 h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border">
                      {companyData?.CompanyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Code
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border">
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border">
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border">
                      {companyData?.ContactNumber || "N/A"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      rows="2"
                      value={formData.Address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, Address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border">
                      {companyData?.Address || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FiUsers className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-blue-700">
                        Total Employees
                      </p>
                      <p className="text-xl font-bold text-blue-900">
                        {companyData?.TotalEmployees || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <FiCalendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-emerald-700">
                        Departments
                      </p>
                      <p className="text-xl font-bold text-emerald-900">
                        {companyData?.TotalDepartments || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <FiCreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-purple-700">
                        Locations
                      </p>
                      <p className="text-xl font-bold text-purple-900">
                        {companyData?.TotalLocations || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiCalendar className="mr-2 text-blue-600 h-4 w-4" />
                Payment History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FiCreditCard className="h-10 w-10 text-gray-300 mb-2" />
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
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {format(new Date(payment.PaymentDate), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {payment.PlanName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ₹{payment.Amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${
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
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiCreditCard className="mr-2 text-blue-600 h-4 w-4" />
                  Subscription Details
                </h2>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Trial Plan
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">
                      You are currently on a 30-day free trial
                    </p>
                    <p className="text-sm text-gray-700 mt-1 font-medium">
                      Trial ends on:{" "}
                      {format(
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹0</p>
                    <p className="text-sm text-gray-600 font-medium">/month</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full mt-4 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow"
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

