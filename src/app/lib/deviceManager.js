// src/app/lib/deviceManager.js - FIXED VERSION
class DeviceManager {
  // Generate device fingerprint (enhanced to match backend exactly)
  static generateDeviceFingerprint() {
    try {
      const fingerprint = {
        userAgent: navigator.userAgent || '',
        acceptLanguage: navigator.language || '',
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform || '',
        browserName: this.getBrowserName(),
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: navigator.deviceMemory || 0,
        colorDepth: screen.colorDepth || 24,
        pixelDepth: screen.pixelDepth || 24
      };

      const deviceType = this.detectDeviceType(fingerprint.userAgent);

      // Create stable attributes for UUID (excluding IP and volatile data)
      const stableAttributes = {
        userAgent: fingerprint.userAgent,
        platform: fingerprint.platform,
        screenResolution: fingerprint.screenResolution,
        timezone: fingerprint.timezone,
        hardware: `${fingerprint.hardwareConcurrency}-${fingerprint.deviceMemory}`,
        browserName: fingerprint.browserName
      };

      // Generate consistent UUID
      const deviceUUID = this.generateConsistentUUID(stableAttributes);

      console.log('🔧 Generated device fingerprint:', {
        deviceUUID: deviceUUID.substring(0, 8) + '...',
        deviceType,
        browser: fingerprint.browserName,
        platform: fingerprint.platform
      });

      return {
        deviceUUID,
        fingerprint,
        deviceType,
        deviceInfo: {
          screenResolution: fingerprint.screenResolution,
          timezone: fingerprint.timezone,
          platform: fingerprint.platform,
          browserName: fingerprint.browserName,
          hardwareConcurrency: fingerprint.hardwareConcurrency,
          deviceMemory: fingerprint.deviceMemory
        }
      };
    } catch (error) {
      console.error('❌ Device fingerprint generation error:', error);
      return {
        deviceUUID: 'fallback-' + Date.now(),
        deviceType: 'Unknown',
        fingerprint: {},
        deviceInfo: {}
      };
    }
  }

  // Enhanced browser detection
  static getBrowserName() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Edg/')) return 'Edge';
    if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) return 'Chrome';
    if (userAgent.includes('Firefox/')) return 'Firefox';
    if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari';
    if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) return 'Opera';
    
    return 'Unknown';
  }

  // Enhanced device type detection (matching backend logic)
  static detectDeviceType(userAgent = navigator.userAgent) {
    if (/iPad/i.test(userAgent)) return 'Tablet';
    if (/iPhone|iPod/i.test(userAgent)) return 'Mobile';
    if (/Android/i.test(userAgent)) {
      return /Mobile/i.test(userAgent) ? 'Mobile' : 'Tablet';
    }
    const mobileRegex = /webOS|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent) ? 'Mobile' : 'Desktop';
  }

  // Generate consistent UUID using crypto API if available
  static generateConsistentUUID(stableAttributes) {
    const stableString = JSON.stringify(stableAttributes);
    return this.hashString(stableString);
  }

  // Simple hash function
  static hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'device-' + Math.abs(hash).toString(16);
  }

  // ✅ NEW: Get device info in the format expected by backend
  static getDeviceInfo() {
    let storedDevice = this.getStoredDeviceInfo();
    
    if (!storedDevice) {
      console.log('🆕 Generating new device fingerprint...');
      storedDevice = this.generateDeviceFingerprint();
      this.storeDeviceInfo(storedDevice);
    } else {
      console.log('✅ Using stored device info:', storedDevice.deviceUUID?.substring(0, 8) + '...');
    }
    
    // Return in the exact format expected by backend
    return {
      deviceUUID: storedDevice.deviceUUID,
      deviceType: storedDevice.deviceType,
      fingerprint: storedDevice.fingerprint || {}
    };
  }

  // Store device info in localStorage
  static storeDeviceInfo(deviceInfo) {
    try {
      const dataToStore = {
        ...deviceInfo,
        lastUpdated: Date.now(),
        version: '1.0'
      };
      localStorage.setItem('deviceInfo', JSON.stringify(dataToStore));
      console.log('✅ Device info stored successfully');
    } catch (error) {
      console.warn('❌ Failed to store device info:', error);
    }
  }

  // Get stored device info
  static getStoredDeviceInfo() {
    try {
      const stored = localStorage.getItem('deviceInfo');
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Check if stored info is too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (parsed.lastUpdated && (Date.now() - parsed.lastUpdated) > maxAge) {
        console.log('🔄 Stored device info expired, regenerating...');
        localStorage.removeItem('deviceInfo');
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('❌ Failed to get stored device info:', error);
      localStorage.removeItem('deviceInfo');
      return null;
    }
  }

  // ✅ NEW: Validate device info before sending to backend
  static validateDeviceInfo(deviceInfo) {
    const required = ['deviceUUID', 'deviceType', 'fingerprint'];
    const missing = required.filter(field => !deviceInfo[field]);
    
    if (missing.length > 0) {
      console.error('❌ Missing device info fields:', missing);
      return false;
    }

    // Check if fingerprint has minimum required fields
    if (typeof deviceInfo.fingerprint !== 'object' || Object.keys(deviceInfo.fingerprint).length === 0) {
      console.error('❌ Invalid fingerprint object');
      return false;
    }

    return true;
  }

  // Clear stored device info (for debugging)
  static clearDeviceInfo() {
    try {
      localStorage.removeItem('deviceInfo');
      console.log('🗑️ Device info cleared');
    } catch (error) {
      console.warn('❌ Failed to clear device info:', error);
    }
  }

  // Force refresh device fingerprint
  static refreshDeviceInfo() {
    try {
      this.clearDeviceInfo();
      const newDeviceInfo = this.generateDeviceFingerprint();
      this.storeDeviceInfo(newDeviceInfo);
      console.log('🔄 Device info refreshed successfully');
      return newDeviceInfo;
    } catch (error) {
      console.error('❌ Failed to refresh device info:', error);
      return null;
    }
  }
}

export default DeviceManager;