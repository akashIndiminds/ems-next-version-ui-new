// src/components/ui/AlertDialog.js
'use client';

import { useEffect, useState } from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

export default function AlertDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'success', 'info'
  loading = false,
  size = 'default' // 'small', 'default', 'large'
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: FiAlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      borderColor: 'border-amber-200'
    },
    danger: {
      icon: FiAlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      borderColor: 'border-red-200'
    },
    success: {
      icon: FiCheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      confirmBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      borderColor: 'border-green-200'
    },
    info: {
      icon: FiInfo,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      borderColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type] || typeConfig.warning;
  const IconComponent = config.icon;

  const sizeConfig = {
    small: 'max-w-sm',
    default: 'max-w-md',
    large: 'max-w-lg'
  };

  const dialogSize = sizeConfig[size] || sizeConfig.default;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={`
            relative bg-white rounded-2xl shadow-2xl w-full ${dialogSize}
            transform transition-all duration-300 ease-out
            ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          `}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className={`
                w-16 h-16 rounded-full ${config.iconBg} 
                flex items-center justify-center
                ring-8 ring-gray-50
              `}>
                <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleClose}
                disabled={loading}
                className="
                  w-full sm:w-auto px-6 py-3 
                  border border-gray-300 
                  bg-white text-gray-700 
                  rounded-xl font-medium
                  hover:bg-gray-50 hover:border-gray-400
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  order-2 sm:order-1
                "
              >
                {cancelText}
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                  w-full sm:w-auto px-6 py-3 
                  border border-transparent 
                  ${config.confirmBg}
                  text-white rounded-xl font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmBg.includes('focus:ring-') ? '' : 'focus:ring-gray-500'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 
                  shadow-lg hover:shadow-xl
                  order-1 sm:order-2
                  flex items-center justify-center
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific Alert Types for common use cases
export function DeleteAlert({ isOpen, onClose, onConfirm, itemName = 'item', loading = false }) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Confirmation"
      description={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
      loading={loading}
    />
  );
}

export function LogoutAlert({ isOpen, onClose, onConfirm, loading = false }) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out"
      description="Are you sure you want to sign out? You'll need to sign in again to access your account."
      confirmText="Sign Out"
      cancelText="Stay Signed In"
      type="warning"
      loading={loading}
    />
  );
}

export function SaveAlert({ isOpen, onClose, onConfirm, hasUnsavedChanges = true, loading = false }) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={hasUnsavedChanges ? "Unsaved Changes" : "Save Changes"}
      description={
        hasUnsavedChanges 
          ? "You have unsaved changes. Do you want to save them before leaving?"
          : "Do you want to save your changes?"
      }
      confirmText="Save Changes"
      cancelText={hasUnsavedChanges ? "Discard" : "Cancel"}
      type="info"
      loading={loading}
    />
  );
}

// Hook for easy alert management
export function useAlertDialog() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    type: 'warning',
    loading: false
  });

  const showAlert = (config) => {
    setAlertState({
      isOpen: true,
      ...config
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading) => {
    setAlertState(prev => ({ ...prev, loading }));
  };

  return {
    alertState,
    showAlert,
    hideAlert,
    setLoading,
    AlertComponent: () => (
      <AlertDialog
        {...alertState}
        onClose={hideAlert}
      />
    )
  };
}