// src/app/(dashboard)/company/components/UpgradePlanModal.js
import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function UpgradePlanModal({ subscriptionPlans, setShowUpgradeModal, isMobile }) {
  const modalRef = useRef(null);
  
  // Handle click outside to close (for desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowUpgradeModal(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowUpgradeModal]);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowUpgradeModal(false)}
        ></div>

        <div 
          ref={modalRef}
          className={`relative bg-white rounded-2xl w-full shadow-2xl transition-all duration-300 ${
            isMobile 
              ? "max-w-full min-h-[85vh] mt-16" 
              : "max-w-6xl max-h-[90vh] overflow-y-auto p-8"
          }`}
        >
          {/* Mobile Modal Header */}
          {isMobile && (
            <div className="sticky top-0 z-10 bg-white px-4 py-4 border-b border-gray-100 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Choose Your Plan
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-full p-2 bg-gray-100 text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className={`${isMobile ? 'p-4' : ''}`}>
            {/* Desktop Modal Header */}
            {!isMobile && (
              <div className="mb-8 flex justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Choose Your Plan
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Select the perfect plan for your organization's needs
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            )}

            {isMobile ? (
              // Mobile Plan Cards (Vertical Stack)
              <div className="space-y-4 mb-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 active:bg-blue-50 transition-all duration-200"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h4>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-500 font-medium">
                            /month
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg font-medium">
                            {plan.maxEmployees} employees
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-3 text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium"
                      onClick={() => {
                        toast.success("Redirecting to payment...");
                        setShowUpgradeModal(false);
                      }}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Plan Cards (Grid)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h4>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-500 font-medium">
                          /month
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg font-medium">
                          Up to {plan.maxEmployees} employees
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-3 text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={() => {
                        toast.success("Redirecting to payment...");
                        setShowUpgradeModal(false);
                      }}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className={`${isMobile ? 'sticky bottom-0 bg-white py-4 border-t border-gray-100' : 'mt-8 flex justify-end'}`}>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className={`${
                  isMobile
                    ? 'text-gray-500 w-full py-3 rounded-lg bg-gray-100 font-medium'
                    : 'text-gray-500 hover:text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
