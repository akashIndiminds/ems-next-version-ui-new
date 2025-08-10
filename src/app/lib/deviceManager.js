// src/lib/utils/deviceManager.js
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
    
    // Use crypto.subtle if available (modern browsers)
    if (window.crypto && window.crypto.subtle) {
      return this.hashWithCrypto(stableString);
    }
    
    // Fallback to simple hash
    return this.hashString(stableString);
  }

  // Crypto-based hash (for better consistency)
  static async hashWithCrypto(str) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
    } catch (error) {
      console.warn('Crypto hash failed, using fallback:', error);
      return this.hashString(str);
    }
  }

  // Simple hash function (fallback)
  static hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'device-' + Math.abs(hash).toString(16);
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
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (parsed.lastUpdated && (Date.now() - parsed.lastUpdated) > maxAge) {
        console.log('🔄 Stored device info expired, regenerating...');
        localStorage.removeItem('deviceInfo');
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('❌ Failed to get stored device info:', error);
      localStorage.removeItem('deviceInfo'); // Clear corrupted data
      return null;
    }
  }

  // Get or generate device info
  static getDeviceInfo() {
    let deviceInfo = this.getStoredDeviceInfo();
    
    if (!deviceInfo) {
      console.log('🆕 Generating new device fingerprint...');
      deviceInfo = this.generateDeviceFingerprint();
      this.storeDeviceInfo(deviceInfo);
    } else {
      console.log('✅ Using stored device info:', deviceInfo.deviceUUID?.substring(0, 8) + '...');
    }
    
    return deviceInfo;
  }

  // Validate device info before sending to backend
  static validateDeviceInfo(deviceInfo) {
    const required = ['deviceUUID', 'deviceType', 'deviceInfo'];
    const missing = required.filter(field => !deviceInfo[field]);
    
    if (missing.length > 0) {
      console.error('❌ Missing device info fields:', missing);
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

  // Get device statistics for admin dashboard
  static getDeviceStatistics() {
    try {
      const deviceInfo = this.getStoredDeviceInfo();
      if (!deviceInfo) return null;

      return {
        deviceUUID: deviceInfo.deviceUUID,
        deviceType: deviceInfo.deviceType,
        browserName: deviceInfo.deviceInfo?.browserName,
        platform: deviceInfo.deviceInfo?.platform,
        screenResolution: deviceInfo.deviceInfo?.screenResolution,
        timezone: deviceInfo.deviceInfo?.timezone,
        registeredDate: deviceInfo.lastUpdated ? new Date(deviceInfo.lastUpdated).toISOString() : null,
        lastUsed: deviceInfo.lastUsed ? new Date(deviceInfo.lastUsed).toISOString() : null
      };
    } catch (error) {
      console.error('❌ Failed to get device statistics:', error);
      return null;
    }
  }

  // Check if device capabilities are available
  static checkDeviceCapabilities() {
    const capabilities = {
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      localStorage: typeof(Storage) !== 'undefined',
      crypto: 'crypto' in window && 'subtle' in window.crypto,
      webWorker: typeof(Worker) !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator
    };

    console.log('📋 Device capabilities:', capabilities);
    return capabilities;
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