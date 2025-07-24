// src/app/(dashboard)/leaves/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaveAPI, dropdownAPI } from "@/app/lib/api/leaveAPI";
import {
  FiPlus,
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Link from "next/link";
import AlertDialog, { useAlertDialog } from "@/components/ui/AlertDialog";

export default function LeavesPage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Custom alert dialog hooks
  const {
    alertState,
    showAlert,
    hideAlert,
    setLoading: setAlertLoading,
    AlertComponent,
  } = useAlertDialog();
  const [cancelLeaveId, setCancelLeaveId] = useState(null);

  // Check if user can manage leaves (only admin and manager)
  const canManageLeaves = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    if (user?.employeeId) {
      fetchLeaveData();
      fetchLeaveTypes();
    }
  }, [user]);

  // Fetch leave types from dropdown API
  const fetchLeaveTypes = async () => {
    try {
      const response = await dropdownAPI.getLeaveTypes();
      if (response.data.success) {
        setLeaveTypes(response.data.data);
        if (response.data.data.length > 0 && !formData.leaveTypeId) {
          setFormData((prev) => ({
            ...prev,
            leaveTypeId: response.data.data[0].id.toString(),
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      toast.error("Failed to load leave types");
    }
  };

  const fetchLeaveData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (!user?.employeeId) {
        console.error("No employeeId found");
        return;
      }

      // Fetch employee's own leaves with pagination
      const leavesResponse = await leaveAPI.getEmployeeLeaves(user.employeeId, {
        page: 1,
        limit: 50, // Get more records for personal view
        sortBy: "AppliedDate",
        sortOrder: "DESC",
      });

      if (leavesResponse.data.success) {
        setLeaves(leavesResponse.data.data || []);
      } else {
        console.error("Failed to fetch leaves:", leavesResponse.data.message);
        setLeaves([]);
      }

      // Fetch leave balance
      const balanceResponse = await leaveAPI.getBalance(user.employeeId);
      if (balanceResponse.data.success) {
        setLeaveBalance(balanceResponse.data.data || []);
      } else {
        console.error("Failed to fetch balance:", balanceResponse.data.message);
        setLeaveBalance([]);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      toast.error("Failed to load leave data");
      setLeaves([]);
      setLeaveBalance([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchLeaveData(true);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    if (
      !formData.leaveTypeId ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate dates
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const today = new Date();

    // Set today to start of day for proper comparison
    today.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    // Allow current date and future dates
    if (fromDate < today) {
      toast.error("From date cannot be in the past");
      return;
    }

    if (toDate < fromDate) {
      toast.error("To date cannot be before from date");
      return;
    }

    // Calculate total days
    const totalDays =
      Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const selectedLeaveType = leaveBalance.find(
      (balance) => balance.LeaveTypeID == formData.leaveTypeId
    );

    if (selectedLeaveType && selectedLeaveType.BalanceDays < totalDays) {
      toast.error(
        `Insufficient leave balance. You have ${selectedLeaveType.BalanceDays} days available.`
      );
      return;
    }

    // Show confirmation dialog
    const selectedLeaveTypeName =
      leaveTypes.find((type) => type.id == formData.leaveTypeId)?.label ||
      "Unknown";

    showAlert({
      title: "Apply for Leave",
      description: `Are you sure you want to apply for ${totalDays} day(s) of ${selectedLeaveTypeName} from ${format(
        fromDate,
        "MMM d, yyyy"
      )} to ${format(toDate, "MMM d, yyyy")}?`,
      confirmText: "Apply Leave",
      cancelText: "Cancel",
      type: "info",
      onConfirm: async () => {
        setAlertLoading(true);
        try {
          // Use the enhanced API call
          const response = await leaveAPI.apply({
            employeeId: user.employeeId,
            leaveTypeId: parseInt(formData.leaveTypeId),
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            reason: formData.reason.trim(),
          });

          if (response.data.success) {
            hideAlert();
            toast.success(
              "🎉 Leave application submitted successfully! Your request is now pending approval."
            );
            setShowApplyModal(false);
            resetForm();
            fetchLeaveData(true); // Refresh data
          } else {
            hideAlert();
            toast.error(response.data.message || "Failed to apply for leave");
          }
        } catch (error) {
          console.error("Apply leave error:", error);
          hideAlert();
          toast.error(
            error.response?.data?.message || "Failed to apply for leave"
          );
        }
        setAlertLoading(false);
      },
    });
  };

  const handleCancelLeave = (leaveId, leaveDetails) => {
    setCancelLeaveId(leaveId);

    showAlert({
      title: "Cancel Leave Application",
      description: `Are you sure you want to cancel your ${
        leaveDetails.LeaveTypeName
      } leave application from ${format(
        new Date(leaveDetails.FromDate),
        "MMM d, yyyy"
      )} to ${format(
        new Date(leaveDetails.ToDate),
        "MMM d, yyyy"
      )}? This action cannot be undone.`,
      confirmText: "Yes, Cancel Leave",
      cancelText: "Keep Application",
      type: "warning",
      onConfirm: async () => {
        setAlertLoading(true);
        try {
          const response = await leaveAPI.cancel(leaveId);
          if (response.data.success) {
            hideAlert();
            toast.success("✅ Leave application cancelled successfully");
            fetchLeaveData(true); // Refresh data
          } else {
            hideAlert();
            toast.error(response.data.message || "Failed to cancel leave");
          }
        } catch (error) {
          console.error("Cancel leave error:", error);
          hideAlert();
          toast.error(
            error.response?.data?.message || "Failed to cancel leave"
          );
        }
        setAlertLoading(false);
        setCancelLeaveId(null);
      },
    });
  };

  const resetForm = () => {
    setFormData({
      leaveTypeId: leaveTypes.length > 0 ? leaveTypes[0].id.toString() : "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "Approved":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "Rejected":
        return "text-red-700 bg-red-100 border-red-200";
      case "Cancelled":
        return "text-gray-700 bg-gray-100 border-gray-200";
      case "Revoked":
        return "text-purple-700 bg-purple-100 border-purple-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getLeaveIcon = (leaveTypeName) => {
    const name = leaveTypeName.toLowerCase();
    if (name.includes("annual") || name.includes("vacation")) return "🏖️";
    if (name.includes("sick") || name.includes("medical")) return "🏥";
    if (name.includes("casual") || name.includes("personal")) return "😎";
    if (name.includes("maternity") || name.includes("paternity")) return "👶";
    if (name.includes("emergency")) return "🚨";
    return "📅";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show no user state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">
            Please log in to view leave information
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track your leave balance and apply for time off
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 font-medium disabled:opacity-50"
            >
              <FiRefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* Management Button - Only for admin and manager */}
            {canManageLeaves && (
              <Link
                href="/leaves/approved"
                className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 flex items-center justify-center transition-colors duration-200 shadow-lg font-medium"
              >
                <FiSettings className="mr-2" />
                Manage Leaves
              </Link>
            )}

            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors duration-200 shadow-lg font-medium"
            >
              <FiPlus className="mr-2" />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Leave Balance Section - Ultra Compact Modern Design */}
        {/* Leave Balance Section - Responsive Grid Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Leave Balance
            </h2>
            <FiChevronRight className="text-gray-400 h-4 w-4" />
          </div>

          {leaveBalance.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-yellow-800 text-sm">
                No leave balance found. Please contact HR.
              </p>
            </div>
          ) : (
            // Mobile: Horizontal scroll, Desktop: Responsive grid
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-4 sm:overflow-visible sm:pb-0">
              {leaveBalance.map((balance) => {
                const percentage =
                  (balance.AllocatedDays || balance.MaxDaysPerYear || 0) > 0
                    ? ((balance.UsedDays || 0) /
                        (balance.AllocatedDays ||
                          balance.MaxDaysPerYear ||
                          1)) *
                      100
                    : 0;

                return (
                  <div
                    key={balance.LeaveTypeID}
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02] min-w-[160px] flex-shrink-0 sm:min-w-0 sm:w-full"
                  >
                    {/* Icon and Type */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">
                        {getLeaveIcon(balance.LeaveTypeName)}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          percentage > 80
                            ? "bg-red-500"
                            : percentage > 60
                            ? "bg-orange-400"
                            : "bg-green-500"
                        }`}
                      ></div>
                    </div>

                    {/* Leave Type Name - Better text handling */}
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
                      <span
                        className="block truncate"
                        title={balance.LeaveTypeName}
                      >
                        {balance.LeaveTypeName}
                      </span>
                    </h3>

                    {/* Available Days - Large Display */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {balance.BalanceDays || 0}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          /
                          {balance.AllocatedDays || balance.MaxDaysPerYear || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">days left</p>
                    </div>

                    {/* Progress Bar - Minimal */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          percentage > 80
                            ? "bg-red-500"
                            : percentage > 60
                            ? "bg-orange-400"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    {/* Used Stats - Compact */}
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Used: {balance.UsedDays || 0}</span>
                      {(balance.CarryForwardDays || 0) > 0 && (
                        <span className="text-purple-600 font-medium">
                          +{balance.CarryForwardDays}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Leave History */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiUser className="mr-3 text-blue-600" />
              Recent Applications ({leaves.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.slice(0, 10).map((leave, index) => (
                  <tr
                    key={leave.LeaveApplicationID}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {getLeaveIcon(leave.LeaveTypeName)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {leave.LeaveTypeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div>{format(new Date(leave.FromDate), "MMM d")}</div>
                        <div className="text-xs text-gray-400">
                          to {format(new Date(leave.ToDate), "MMM d, yyyy")}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {leave.TotalDays}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          leave.ApplicationStatus
                        )}`}
                      >
                        {leave.ApplicationStatus}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {leave.ApplicationStatus === "Pending" ? (
                        <button
                          onClick={() =>
                            handleCancelLeave(leave.LeaveApplicationID, leave)
                          }
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="text-gray-400 mb-2">📝</div>
                      <div>No leave applications found</div>
                      <div className="text-sm text-gray-400">
                        Click "Apply Leave" to get started
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                onClick={() => setShowApplyModal(false)}
              ></div>

              <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Apply for Leave
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Submit your leave application
                  </p>
                </div>

                <form onSubmit={handleApplyLeave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Leave Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.leaveTypeId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaveTypeId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => {
                          const balance = leaveBalance.find(
                            (b) => b.LeaveTypeID == type.id
                          );
                          return (
                            <option key={type.id} value={type.id}>
                              {type.label}{" "}
                              {balance
                                ? `(${balance.BalanceDays || 0} days)`
                                : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.fromDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fromDate: e.target.value,
                            })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          To <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.toDate}
                          onChange={(e) =>
                            setFormData({ ...formData, toDate: e.target.value })
                          }
                          min={
                            formData.fromDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Show calculated days */}
                    {formData.fromDate && formData.toDate && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800">
                          <strong>Total Days:</strong>{" "}
                          {Math.ceil(
                            (new Date(formData.toDate) -
                              new Date(formData.fromDate)) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}{" "}
                          days
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows="3"
                        value={formData.reason}
                        onChange={(e) =>
                          setFormData({ ...formData, reason: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        placeholder="Please provide a reason..."
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {formData.reason.length}/500
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-100 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Leave
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Dialog */}
        <AlertComponent />
      </div>
    </div>
  );
}
