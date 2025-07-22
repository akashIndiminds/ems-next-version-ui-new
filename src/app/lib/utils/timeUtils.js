/**
 * Fixed Time Utility Functions for Attendance Management
 * File: src/app/lib/utils/timeUtils.js
 *
 * This utility handles all time-related operations for the attendance system
 * including UTC formatting, local time conversions, and calculations.
 */

export const timeUtils = {
  /**
   * Format UTC datetime in 12-hour format (e.g., 01:45 PM UTC)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in 12-hour format (UTC)
   */
  formatTimeUTC: (utcDateTime) => {
    if (!utcDateTime) return 'N/A';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return 'Invalid Time';
      }

      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = (hours % 12 || 12).toString().padStart(2, '0');

      return `${hour12}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting UTC time:', error);
      return 'Invalid Time';
    }
  },

  /**
   * Convert UTC datetime to local time in 24-hour format (HH:MM)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in HH:MM format (local time)
   */
  formatTimeFromUTC: (utcDateTime) => {
    if (!utcDateTime) return '--:--';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return '--:--';
      }

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  },

  /**
   * Convert UTC datetime to local time in 24-hour format with seconds (HH:MM:SS)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in HH:MM:SS format (local time)
   */
  formatTimeFromUTCWithSeconds: (utcDateTime) => {
    if (!utcDateTime) return '--:--:--';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return '--:--:--';
      }

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting time with seconds:', error);
      return '--:--:--';
    }
  },

  /**
   * Convert UTC datetime to local time in 12-hour format (01:45 PM)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in 12-hour format (local time)
   */
  formatTime12Hour: (utcDateTime) => {
    if (!utcDateTime) return '--:-- --';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return '--:-- --';
      }

      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting 12-hour time:', error);
      return '--:-- --';
    }
  },

  /**
   * Format time using locale method with seconds
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in 12-hour format with seconds (local time)
   */
  formatTimeLocale: (utcDateTime) => {
    if (!utcDateTime) return 'N/A';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) return 'Invalid Time';

      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  },

  /**
   * Format time without seconds
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in 12-hour format without seconds (local time)
   */
  formatTimeLocaleShort: (utcDateTime) => {
    if (!utcDateTime) return 'N/A';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) return 'Invalid Time';

      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  },

  /**
   * Extract date from UTC datetime (YYYY-MM-DD format)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Date in YYYY-MM-DD format (local date)
   */
  formatDateFromUTC: (utcDateTime) => {
    if (!utcDateTime) return '';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return '';
      }

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  },

  /**
   * Convert UTC time to input format for HTML time inputs (24-hour local time)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Time in HH:MM format for input fields (local time)
   */
  formatTimeForInput: (utcDateTime) => {
    if (!utcDateTime) return '';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return '';
      }

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time for input:', error);
      return '';
    }
  },

  /**
   * Get current time in HH:MM format (local time)
   * @returns {string} Current time in HH:MM format
   */
  getCurrentTime: () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Get current date in YYYY-MM-DD format (local date)
   * @returns {string} Current date in YYYY-MM-DD format
   */
  getCurrentDate: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Format datetime for display (readable format)
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Formatted datetime string (local time)
   */
  formatDateTime: (utcDateTime) => {
    if (!utcDateTime) return 'Not available';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', utcDateTime);
        return 'Invalid date';
      }

      const dateStr = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const timeStr = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      return `${dateStr} at ${timeStr}`;
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Format date only
   * @param {string} utcDateTime - UTC datetime string (ISO format)
   * @returns {string} Formatted date string (local date)
   */
  formatDateLocale: (utcDateTime) => {
    if (!utcDateTime) return 'N/A';

    try {
      const date = new Date(utcDateTime);

      if (isNaN(date.getTime())) return 'Invalid Date';

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Calculate working hours between two UTC times
   * @param {string} checkInUTC - Check-in time in UTC
   * @param {string} checkOutUTC - Check-out time in UTC
   * @returns {number} Working hours (rounded to 2 decimal places)
   */
  calculateWorkingHours: (checkInUTC, checkOutUTC) => {
    if (!checkInUTC || !checkOutUTC) return 0;

    try {
      const checkInDate = new Date(checkInUTC);
      const checkOutDate = new Date(checkOutUTC);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return 0;
      }

      const diffInMs = checkOutDate - checkInDate;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return Math.max(0, Math.round(diffInHours * 100) / 100);
    } catch (error) {
      console.error('Error calculating working hours:', error);
      return 0;
    }
  },

  /**
   * Check if time string is valid (HH:MM format)
   * @param {string} timeString - Time string to validate
   * @returns {boolean} True if valid time format
   */
  isValidTime: (timeString) => {
    if (!timeString) return false;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },

  /**
   * Convert local time to UTC for API calls
   * @param {string} localDate - Date in YYYY-MM-DD format
   * @param {string} timeString - Time in HH:MM format (local time)
   * @returns {string|null} UTC datetime in ISO format
   */
  convertTimeToUTC: (localDate, timeString) => {
    if (!localDate || !timeString) return null;

    try {
      const [hours, minutes] = timeString.split(':');
      const localDateTime = `${localDate}T${timeString}:00`;
      const date = new Date(localDateTime);

      return date.toISOString();
    } catch (error) {
      console.error('Error converting time to UTC:', error);
      return null;
    }
  },

  /**
   * Format time difference in human readable format
   * @param {string} startTime - Start time in UTC
   * @param {string} endTime - End time in UTC
   * @returns {string} Human readable time difference
   */
  formatTimeDifference: (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid time';
      }

      const diffInMs = end - start;
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      console.error('Error formatting time difference:', error);
      return 'Error';
    }
  },
};

export default timeUtils;