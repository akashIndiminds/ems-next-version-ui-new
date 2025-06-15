// src/app/(dashboard)/company/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { companyAPI, paymentAPI } from '@/app/lib/api';
import { FiEdit2, FiSave, FiX, FiCreditCard, FiUsers, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function CompanyPage() {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchCompanyData();
    fetchPaymentHistory();
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getById(user.company.companyId);
      if (response.data.success) {
        setCompanyData(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentAPI.getHistory();
      if (response.data.success) {
        setPaymentHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await companyAPI.update(user.company.companyId, {
        CompanyName: formData.CompanyName,
        Address: formData.Address,
        ContactNumber: formData.ContactNumber,
        Email: formData.Email
      });
      if (response.data.success) {
        toast.success('Company details updated successfully');
        setEditing(false);
        fetchCompanyData();
      }
    } catch (error) {
      toast.error('Failed to update company details');
    }
  };

  const subscriptionPlans = [
    {
      id: 1,
      name: 'Starter',
      price: 999,
      maxEmployees: 50,
      features: ['Basic Attendance', 'Leave Management', 'Email Support']
    },
    {
      id: 2,
      name: 'Professional',
      price: 2999,
      maxEmployees: 200,
      features: ['Everything in Starter', 'Advanced Reports', 'API Access', 'Priority Support']
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 9999,
      maxEmployees: 'Unlimited',
      features: ['Everything in Professional', 'Custom Features', 'Dedicated Support', 'SLA']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your company details and subscription
        </p>
      </div>

      {/* Company Details */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <FiEdit2 className="mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="text-green-600 hover:text-green-700 flex items-center"
              >
                <FiSave className="mr-1" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(companyData);
                }}
                className="text-red-600 hover:text-red-700 flex items-center"
              >
                <FiX className="mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.CompanyName}
                  onChange={(e) => setFormData({...formData, CompanyName: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{companyData?.CompanyName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Code</label>
              <p className="mt-1 text-sm text-gray-900">{companyData?.CompanyCode}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{companyData?.Email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.ContactNumber}
                  onChange={(e) => setFormData({...formData, ContactNumber: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{companyData?.ContactNumber || 'N/A'}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {editing ? (
                <textarea
                  rows="2"
                  value={formData.Address}
                  onChange={(e) => setFormData({...formData, Address: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{companyData?.Address || 'N/A'}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiUsers className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                  <p className="text-lg font-semibold text-gray-900">{companyData?.TotalEmployees || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiCalendar className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Departments</p>
                  <p className="text-lg font-semibold text-gray-900">{companyData?.TotalDepartments || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiCreditCard className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Locations</p>
                  <p className="text-lg font-semibold text-gray-900">{companyData?.TotalLocations || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Subscription Details</h2>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            Upgrade Plan
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Trial Plan</h3>
                <p className="text-sm text-gray-600 mt-1">You are currently on a 30-day free trial</p>
                <p className="text-sm text-gray-600 mt-2">
                  Trial ends on: {format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">₹0</p>
                <p className="text-sm text-gray-600">/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payment history available
                  </td>
                </tr>
              ) : (
                paymentHistory.map((payment) => (
                  <tr key={payment.PaymentID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.PaymentDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.PlanName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{payment.Amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.PaymentStatus === 'Success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUpgradeModal(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Up to {plan.maxEmployees} employees
                      </p>
                    </div>
                    <ul className="mt-6 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      onClick={() => {
                        toast.success('Redirecting to payment...');
                        setShowUpgradeModal(false);
                      }}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}