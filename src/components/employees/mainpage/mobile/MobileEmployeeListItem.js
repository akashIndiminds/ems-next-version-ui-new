// src/components/employees/mobile/MobileEmployeeListItem.js
'use client';

import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MobileEmployeeListItem({ 
  employee, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const [showActions, setShowActions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  // Calculate dropdown position
  useEffect(() => {
    if (showActions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX
      });
    }
  }, [showActions]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    const handleScroll = () => {
      setShowActions(false);
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [showActions]);

  // Dropdown component
  const DropdownMenu = () => {
    if (!showActions) return null;

    return createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[100]"
          onClick={() => setShowActions(false)}
        />
        
        {/* Dropdown menu */}
        <div 
          className="fixed w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-[110] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <button
            onClick={() => {
              onView(employee.EmployeeID);
              setShowActions(false);
            }}
            className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <FiEye className="mr-2 h-3.5 w-3.5" />
            View
          </button>
          <button
            onClick={() => {
              onEdit(employee.EmployeeID);
              setShowActions(false);
            }}
            className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <FiEdit className="mr-2 h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(employee);
              setShowActions(false);
            }}
            className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <FiTrash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
      {/* Left side - Compact employee info */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
            {employee.FirstName?.[0]}{employee.LastName?.[0]}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white ${
            employee.IsActive ? 'bg-green-400' : 'bg-gray-400'
          }`} />
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {employee.FullName || `${employee.FirstName} ${employee.LastName}`}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-xs text-gray-500">
              {employee.EmployeeCode}
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className={`text-xs font-medium ${
              employee.DepartmentName === 'Unassigned' 
                ? 'text-gray-500' 
                : 'text-blue-600'
            }`}>
              {employee.DepartmentName}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 truncate mt-0.5">
            {employee.Email}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative ml-2">
        <button
          ref={buttonRef}
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <FiMoreVertical className="h-4 w-4 text-gray-400" />
        </button>
        
        <DropdownMenu />
      </div>
    </div>
  );
}