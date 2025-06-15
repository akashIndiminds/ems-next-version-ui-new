// src/lib/utils.js
import { clsx } from 'clsx';

// Classname utility
export function cn(...inputs) {
  return clsx(inputs);
}

// Format date
export function formatDate(date, format = 'MMM d, yyyy') {
  if (!date) return '';
  
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  switch (format) {
    case 'MMM d, yyyy':
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0];
    case 'time':
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    default:
      return d.toLocaleDateString();
  }
}

// Format currency
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format number
export function formatNumber(number) {
  return new Intl.NumberFormat('en-IN').format(number);
}

// Calculate working hours
export function calculateWorkingHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return '0:00';
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Get initials from name
export function getInitials(name) {
  if (!name) return '';
  
  const parts = name.split(' ');
  const initials = parts.map(part => part[0]?.toUpperCase()).join('');
  
  return initials.slice(0, 2);
}

// Status color mapping
export function getStatusColor(status, type = 'default') {
  const statusColors = {
    attendance: {
      Present: 'text-green-600 bg-green-100',
      Absent: 'text-red-600 bg-red-100',
      Late: 'text-yellow-600 bg-yellow-100',
      OnLeave: 'text-blue-600 bg-blue-100',
      Holiday: 'text-purple-600 bg-purple-100'
    },
    leave: {
      Pending: 'text-yellow-600 bg-yellow-100',
      Approved: 'text-green-600 bg-green-100',
      Rejected: 'text-red-600 bg-red-100',
      Cancelled: 'text-gray-600 bg-gray-100'
    },
    employee: {
      Active: 'text-green-600 bg-green-100',
      Inactive: 'text-red-600 bg-red-100',
      OnLeave: 'text-yellow-600 bg-yellow-100'
    },
    default: {
      success: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    }
  };

  return statusColors[type]?.[status] || statusColors.default.info;
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(phone);
}

// Generate employee code
export function generateEmployeeCode(companyCode, sequence) {
  return `${companyCode}EMP${sequence.toString().padStart(3, '0')}`;
}

// Calculate leave days
export function calculateLeaveDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0;
  
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return diffDays;
}

// Check if date is weekend
export function isWeekend(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
}

// Get greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Download CSV
export function downloadCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Convert JSON to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvData = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',');
  }).join('\n');
  
  return `${csvHeaders}\n${csvData}`;
}

// Get random color for avatar
export function getAvatarColor(name) {
  const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500'
  ];
  
  const index = name?.charCodeAt(0) % colors.length || 0;
  return colors[index];
}

// Truncate text
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}