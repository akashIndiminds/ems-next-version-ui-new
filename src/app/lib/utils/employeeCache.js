// src/utils/employeeCache.js
// Simple localStorage-based employee cache

const CACHE_KEY = 'employee_ids_cache';
const CACHE_EXPIRY_KEY = 'employee_ids_cache_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const employeeCache = {
  // Set employee IDs in localStorage
  setEmployeeIds: (employees, companyId) => {
    try {
      if (typeof window !== 'undefined' && employees && Array.isArray(employees)) {
        const ids = employees.map(emp => emp.EmployeeID?.toString()).filter(Boolean);
        const expiryTime = Date.now() + CACHE_DURATION;
        
        const cacheData = {
          ids,
          companyId,
          timestamp: Date.now()
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
        
        console.log(`📦 Cached ${ids.length} employee IDs for company ${companyId}`);
      }
    } catch (error) {
      console.warn('Failed to cache employee IDs:', error);
    }
  },

  // Get employee IDs from localStorage
  getEmployeeIds: (companyId) => {
    try {
      if (typeof window !== 'undefined') {
        const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
        
        // Check if cache is expired
        if (expiryTime && Date.now() > parseInt(expiryTime)) {
          employeeCache.clearCache();
          return null;
        }
        
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          
          // Check if cache is for the same company
          if (parsed.companyId === companyId) {
            return parsed.ids;
          } else {
            // Different company, clear cache
            employeeCache.clearCache();
            return null;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cached employee IDs:', error);
      employeeCache.clearCache();
    }
    return null;
  },

  // Clear cache
  clearCache: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear employee cache:', error);
    }
  },

  // Check if employee ID exists in cache
  isValidEmployeeId: (id, companyId) => {
    const cachedIds = employeeCache.getEmployeeIds(companyId);
    if (!cachedIds) return true; // If no cache, assume valid (will be validated by API)
    return cachedIds.includes(id.toString());
  }
};

// Simple hook for localStorage cache
export const useEmployeeCache = () => {
  const updateCache = (employees, companyId) => {
    employeeCache.setEmployeeIds(employees, companyId);
  };

  return {
    updateCache,
    getEmployeeIds: employeeCache.getEmployeeIds,
    isValidEmployeeId: employeeCache.isValidEmployeeId,
    clearCache: employeeCache.clearCache
  };
};