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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      // Prevent background scroll on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
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

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
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
      {/* Backdrop with enhanced mobile optimization */}
      <div 
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 ease-out
          ${isVisible ? 'bg-opacity-60' : 'bg-opacity-0'}
          ${isMobile ? 'bg-opacity-75' : ''}
        `}
        onClick={handleBackdropClick}
      />
      
      {/* Dialog Container - Mobile First Approach */}
      <div 
        className={`
          flex items-center justify-center min-h-screen
          ${isMobile ? 'items-end sm:items-center p-0 sm:p-4' : 'p-4'}
        `}
        onClick={handleBackdropClick}
      >
        <div 
          className={`
            relative bg-white shadow-2xl w-full
            transform transition-all duration-300 ease-out
            ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
            ${isMobile 
              ? 'rounded-t-3xl rounded-b-none max-w-none min-h-[40vh] sm:rounded-2xl sm:max-w-md sm:min-h-0' 
              : `rounded-2xl ${dialogSize}`
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Handle Bar - iOS Style */}
          {isMobile && (
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          )}

          {/* Close Button - Adaptive positioning */}
          <button
            onClick={handleClose}
            className={`
              absolute z-10 p-2.5 text-gray-400 hover:text-gray-600 
              hover:bg-gray-100 rounded-full transition-all duration-200
              ${isMobile 
                ? 'top-4 right-4 sm:top-4 sm:right-4' 
                : 'top-4 right-4'
              }
            `}
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Content Container */}
          <div className={`
            ${isMobile 
              ? 'px-6 pt-8 pb-8 sm:p-6' 
              : 'p-6'
            }
          `}>
            {/* Icon - Responsive sizing */}
            <div className="flex items-center justify-center mb-6">
              <div className={`
                rounded-full ${config.iconBg} 
                flex items-center justify-center
                ring-8 ring-gray-50
                ${isMobile ? 'w-20 h-20 sm:w-16 sm:h-16' : 'w-16 h-16'}
              `}>
                <IconComponent className={`
                  ${config.iconColor}
                  ${isMobile ? 'h-10 w-10 sm:h-8 sm:w-8' : 'h-8 w-8'}
                `} />
              </div>
            </div>

            {/* Title - Mobile optimized typography */}
            <h3 className={`
              font-bold text-gray-900 text-center mb-3
              ${isMobile ? 'text-2xl sm:text-xl leading-tight' : 'text-xl'}
            `}>
              {title}
            </h3>

            {/* Description - Enhanced readability */}
            <p className={`
              text-gray-600 text-center leading-relaxed
              ${isMobile 
                ? 'text-base sm:text-sm mb-8 sm:mb-6 px-2 sm:px-0' 
                : 'text-sm mb-6'
              }
            `}>
              {description}
            </p>

            {/* Actions - Mobile First Button Layout */}
            <div className={`
              flex gap-3
              ${isMobile 
                ? 'flex-col sm:flex-row' 
                : 'flex-col sm:flex-row'
              }
            `}>
              {/* Cancel Button */}
              <button
                onClick={handleClose}
                disabled={loading}
                className={`
                  border border-gray-300 bg-white text-gray-700 
                  rounded-xl font-semibold
                  hover:bg-gray-50 hover:border-gray-400
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  ${isMobile 
                    ? 'w-full py-4 px-6 text-base sm:w-auto sm:py-3 sm:px-6 sm:text-sm order-2 sm:order-1' 
                    : 'w-full sm:w-auto px-6 py-3 order-2 sm:order-1'
                  }
                `}
              >
                {cancelText}
              </button>
              
              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                  border border-transparent text-white rounded-xl font-semibold
                  ${config.confirmBg}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  flex items-center justify-center
                  ${isMobile 
                    ? 'w-full py-4 px-6 text-base sm:w-auto sm:py-3 sm:px-6 sm:text-sm order-1 sm:order-2' 
                    : 'w-full sm:w-auto px-6 py-3 order-1 sm:order-2'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span className={isMobile ? 'text-base sm:text-sm' : 'text-sm'}>
                      Processing...
                    </span>
                  </>
                ) : (
                  <span className={isMobile ? 'text-base sm:text-sm' : 'text-sm'}>
                    {confirmText}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Mobile-Specific Alert Types
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

// Enhanced Hook with Mobile Support
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