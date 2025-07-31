// src/app/(dashboard)/company/components/UpgradePlanModal.js
import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function UpgradePlanModal({ subscriptionPlans, setShowUpgradeModal, isMobile }) {
  const modalRef = useRef(null);
  
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
      <div className="flex items-end sm:items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowUpgradeModal(false)}
        ></div>

        <div 
          ref={modalRef}
          className={`relative bg-white w-full shadow-2xl transition-all duration-300 ${
            isMobile 
              ? "rounded-t-2xl max-h-[90vh] overflow-y-auto" 
              : "rounded-2xl max-w-4xl max-h-[85vh] overflow-y-auto m-4"
          }`}
        >
          {/* Compact Modal Header */}
          <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Choose Your Plan
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-full p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {isMobile ? (
              // Mobile Plan Cards - Compact
              <div className="space-y-3 mb-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 active:bg-blue-50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {plan.name}
                        </h4>
                        <div className="flex items-baseline mt-1">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{plan.price}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /month
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded font-medium">
                        {plan.maxEmployees} emp
                      </div>
                    </div>

                    <ul className="space-y-1 mb-3">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-xs text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-xs text-gray-500 ml-5">
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>

                    <button
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
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
              // Desktop Plan Cards - Optimized
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 hover:border-blue-300 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {plan.name}
                      </h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-500 font-medium">
                          /month
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-lg font-medium">
                          Up to {plan.maxEmployees} employees
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-xs text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
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

            {/* Compact Footer */}
            <div className={`${isMobile ? 'sticky bottom-0 bg-white py-3 border-t border-gray-100' : 'mt-4 text-center'}`}>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className={`${
                  isMobile
                    ? 'text-gray-600 w-full py-2 rounded-lg bg-gray-100 font-medium text-sm'
                    : 'text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm'
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