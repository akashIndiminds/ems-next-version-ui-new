// src/services/DeviceManager.js - FIXED VERSION
const Database = require("../config/database");
const crypto = require("crypto");

class DeviceManager {
  // Risk-based configuration
  static RISK_CONFIG = {
    AUTO_APPROVE: {
      SAME_LOCATION: true,
      WORKING_HOURS: true,
      KNOWN_NETWORK: true,
      MAX_DEVICES: 3,
      TRUSTED_DEVICE_TYPES: ["Desktop", "Tablet"],
    },
    RISK_SCORES: {
      LOW: 0,
      MEDIUM: 30,
      HIGH: 60,
      CRITICAL: 80,
    },
    MONITORING: {
      ALERT_AFTER_DEVICES: 2,
      SUSPICIOUS_LOGIN_HOURS: [0, 5],
      LOCATION_RADIUS_KM: 50,
      RAPID_DEVICE_SWITCH_MINS: 15,
    },
  };

  /**
   * MAIN METHOD: Generate device fingerprint from request
   */
  static generateDeviceFingerprint(req) {
    const userAgent = req.get('User-Agent') || 'Unknown';
    const acceptLanguage = req.get('Accept-Language') || 'en-US';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    // Extract device info from user agent
    const deviceInfo = this.parseUserAgent(userAgent);
    
    // Create unique fingerprint
    const fingerprintData = {
      userAgent,
      ip,
      acceptLanguage,
      acceptEncoding,
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      browserVersion: deviceInfo.browserVersion,
      timestamp: Date.now()
    };
    
    // Generate unique device UUID based on stable characteristics
    const stableFingerprint = `${deviceInfo.platform}-${deviceInfo.browser}-${ip}-${acceptLanguage}`;
    const deviceUUID = crypto.createHash('md5').update(stableFingerprint).digest('hex');
    
    return {
      deviceUUID,
      fingerprint: fingerprintData,
      deviceType: deviceInfo.deviceType,
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      browserVersion: deviceInfo.browserVersion
    };
  }

  /**
   * MAIN METHOD: Register or update device with smart approval
   */
  static async registerOrUpdateDevice(employeeId, deviceFingerprint, locationData, context = {}) {
    try {
      const { deviceUUID, fingerprint, deviceType, platform, browser } = deviceFingerprint;
      
      console.log(`🤖 Smart device registration for Employee ${employeeId}`);
      console.log(`Device UUID: ${deviceUUID}`);
      console.log(`Device Type: ${deviceType}`);

      // Step 1: Check if device already exists
      const existingDevice = await this.checkExistingDevice(deviceUUID, employeeId);

      if (existingDevice.exists) {
        // Update existing device
        await this.updateDeviceUsage(existingDevice.deviceId, locationData);
        
        console.log(`✅ Existing device updated: ${existingDevice.deviceId}`);
        return {
          success: true,
          deviceId: existingDevice.deviceId,
          isNewDevice: false,
          deviceType: existingDevice.deviceType,
          deviceName: existingDevice.deviceName,
          message: "Known device updated"
        };
      }

      // Step 2: Check for device conflicts (same device, different employee)
      const deviceConflict = await this.checkDeviceConflict(deviceUUID, employeeId);
      if (deviceConflict.hasConflict) {
        console.log(`⚠️ Device conflict detected for ${deviceUUID}`);
        return {
          success: false,
          reason: 'DEVICE_CONFLICT',
          message: 'This device is already registered with another employee',
          conflictInfo: deviceConflict.conflictInfo
        };
      }

      // Step 3: Calculate risk score
      const riskAssessment = await this.assessDeviceRisk(employeeId, deviceFingerprint, {
        location: locationData,
        timestamp: new Date(),
        ip: locationData.ip,
        ...context
      });

      console.log(`📊 Risk Score: ${riskAssessment.score} (${riskAssessment.level})`);

      // Step 4: Auto-approval decision
      let autoApproved = false;
      let approvalReason = "";

      if (riskAssessment.score <= this.RISK_CONFIG.RISK_SCORES.LOW) {
        autoApproved = true;
        approvalReason = "Low risk - Auto-approved";
      } else if (riskAssessment.score <= this.RISK_CONFIG.RISK_SCORES.MEDIUM) {
        autoApproved = true;
        approvalReason = "Medium risk - Approved with monitoring";
        await this.logDeviceMonitoring(employeeId, deviceUUID, riskAssessment);
      } else if (riskAssessment.score <= this.RISK_CONFIG.RISK_SCORES.HIGH) {
        autoApproved = true;
        approvalReason = "High risk - Temporary approval";
        this.alertManagerAsync(employeeId, deviceUUID, riskAssessment);
      } else {
        autoApproved = false;
        approvalReason = "Critical risk - Blocked";
        await this.logSecurityIncident(employeeId, deviceUUID, riskAssessment);
        
        return {
          success: false,
          reason: "HIGH_RISK_DEVICE",
          message: "Device blocked due to security concerns. Please contact IT support.",
          riskDetails: riskAssessment.flags
        };
      }

      // Step 5: Register the device
      const deviceName = this.generateSmartDeviceName(deviceType, fingerprint);

      const insertQuery = `
        INSERT INTO EmployeeDevices (
          EmployeeID, DeviceUUID, DeviceName, DeviceType, DeviceOS,
          DeviceFingerprint, IPAddress, LastLocationLat, LastLocationLng,
          IsApproved, IsActive, RegisteredDate, LastUsedDate,
          TrustLevel, RiskScore, ApprovalReason
        )
        OUTPUT INSERTED.*
        VALUES (
          @employeeId, @deviceUUID, @deviceName, @deviceType, @deviceOS,
          @fingerprint, @ipAddress, @latitude, @longitude,
          @isApproved, 1, GETDATE(), GETDATE(),
          @trustLevel, @riskScore, @approvalReason
        )
      `;

      const insertResult = await Database.query(insertQuery, {
        employeeId,
        deviceUUID,
        deviceName,
        deviceType,
        deviceOS: platform || "Unknown",
        fingerprint: JSON.stringify(fingerprint),
        ipAddress: locationData.ip || null,
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
        isApproved: autoApproved ? 1 : 0,
        trustLevel: riskAssessment.trustLevel,
        riskScore: riskAssessment.score,
        approvalReason
      });

      const newDevice = insertResult.recordset[0];

      // Step 6: Apply smart policies
      await this.applySmartPolicies(employeeId, newDevice.DeviceID);

      console.log(`✅ Device ${newDevice.DeviceID} registered with ${approvalReason}`);

      return {
        success: true,
        deviceId: newDevice.DeviceID,
        isNewDevice: true,
        deviceType: newDevice.DeviceType,
        deviceName: newDevice.DeviceName,
        approved: autoApproved,
        trustLevel: riskAssessment.trustLevel,
        message: approvalReason,
        requiresOTP: riskAssessment.score > this.RISK_CONFIG.RISK_SCORES.MEDIUM
      };

    } catch (error) {
      console.error("❌ Device registration error:", error);
      return {
        success: false,
        message: "Device registration failed",
        error: error.message
      };
    }
  }

  /**
   * HELPER: Parse user agent to extract device info
   */
  static parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    
    let deviceType = 'Desktop';
    let platform = 'Unknown';
    let browser = 'Unknown';
    let browserVersion = '';

    // Detect mobile devices
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      deviceType = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'Tablet';
    }

    // Detect platform
    if (ua.includes('windows')) platform = 'Windows';
    else if (ua.includes('mac')) platform = 'macOS';
    else if (ua.includes('linux')) platform = 'Linux';
    else if (ua.includes('android')) platform = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) platform = 'iOS';

    // Detect browser
    if (ua.includes('chrome') && !ua.includes('edg')) {
      browser = 'Chrome';
      const match = ua.match(/chrome\/(\d+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
      const match = ua.match(/firefox\/(\d+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser = 'Safari';
    } else if (ua.includes('edg')) {
      browser = 'Edge';
    }

    return { deviceType, platform, browser, browserVersion };
  }

  /**
   * HELPER: Check if device already exists for this employee
   */
  static async checkExistingDevice(deviceUUID, employeeId) {
    try {
      const query = `
        SELECT DeviceID, DeviceType, DeviceName
        FROM EmployeeDevices 
        WHERE DeviceUUID = @deviceUUID 
        AND EmployeeID = @employeeId 
        AND IsActive = 1
      `;

      const result = await Database.query(query, { deviceUUID, employeeId });

      return {
        exists: result.recordset.length > 0,
        deviceId: result.recordset[0]?.DeviceID,
        deviceType: result.recordset[0]?.DeviceType,
        deviceName: result.recordset[0]?.DeviceName
      };
    } catch (error) {
      console.error('Error checking existing device:', error);
      return { exists: false };
    }
  }

  /**
   * HELPER: Check for device conflicts
   */
  static async checkDeviceConflict(deviceUUID, employeeId) {
    try {
      const query = `
        SELECT ed.EmployeeID, e.FullName, e.EmployeeCode
        FROM EmployeeDevices ed
        JOIN Employees e ON ed.EmployeeID = e.EmployeeID
        WHERE ed.DeviceUUID = @deviceUUID 
        AND ed.EmployeeID != @employeeId 
        AND ed.IsActive = 1
        AND e.IsActive = 1
      `;

      const result = await Database.query(query, { deviceUUID, employeeId });

      return {
        hasConflict: result.recordset.length > 0,
        conflictInfo: result.recordset[0] || null
      };
    } catch (error) {
      console.error('Error checking device conflict:', error);
      return { hasConflict: false };
    }
  }

  /**
   * HELPER: Log device usage
   */
  static async logDeviceUsage(deviceId, employeeId, locationData, action = 'General') {
    try {
      await Database.query(`
        INSERT INTO DeviceUsageLogs (
          DeviceID, EmployeeID, UsageDate, IPAddress, 
          LocationLat, LocationLng, AttendanceAction
        )
        VALUES (
          @deviceId, @employeeId, GETDATE(), @ipAddress,
          @latitude, @longitude, @action
        )
      `, {
        deviceId,
        employeeId,
        ipAddress: locationData.ip,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        action
      });
    } catch (error) {
      console.error('Error logging device usage:', error);
    }
  }

  // ... REST OF THE HELPER METHODS (keeping existing logic)
  
  static async assessDeviceRisk(employeeId, deviceInfo, context) {
    let riskScore = 0;
    const riskFlags = [];

    try {
      // 1. Check device count
      const deviceCount = await this.getEmployeeDeviceCount(employeeId);
      if (deviceCount >= 3) {
        riskScore += 20;
        riskFlags.push("Too many devices");
      }

      // 2. Check time of registration
      const hour = new Date().getHours();
      if (hour >= 0 && hour <= 5) {
        riskScore += 25;
        riskFlags.push("Unusual hours");
      }

      // 3. Check location
      if (context.location) {
        const locationCheck = await this.checkLocationAnomaly(employeeId, context.location);
        if (locationCheck.isAnomaly) {
          riskScore += locationCheck.severity * 15;
          riskFlags.push(`Location anomaly: ${locationCheck.reason}`);
        }
      }

      // Determine risk level
      let level = "LOW";
      let trustLevel = 3;

      if (riskScore > this.RISK_CONFIG.RISK_SCORES.CRITICAL) {
        level = "CRITICAL";
        trustLevel = 0;
      } else if (riskScore > this.RISK_CONFIG.RISK_SCORES.HIGH) {
        level = "HIGH";
        trustLevel = 1;
      } else if (riskScore > this.RISK_CONFIG.RISK_SCORES.MEDIUM) {
        level = "MEDIUM";
        trustLevel = 2;
      }

      return { score: riskScore, level, trustLevel, flags: riskFlags };

    } catch (error) {
      console.error("Risk assessment error:", error);
      return { score: 40, level: "MEDIUM", trustLevel: 2, flags: ["Assessment error"] };
    }
  }

  static async getEmployeeDeviceCount(employeeId) {
    const result = await Database.query(`
      SELECT COUNT(*) as count 
      FROM EmployeeDevices 
      WHERE EmployeeID = @employeeId AND IsActive = 1
    `, { employeeId });
    return result.recordset[0].count;
  }

  static async checkLocationAnomaly(employeeId, location) {
    if (!location || !location.latitude) return { isAnomaly: false };

    const query = `
      SELECT TOP 5 LastLocationLat, LastLocationLng 
      FROM EmployeeDevices 
      WHERE EmployeeID = @employeeId 
      AND LastLocationLat IS NOT NULL
      ORDER BY LastUsedDate DESC
    `;

    const result = await Database.query(query, { employeeId });
    if (result.recordset.length === 0) return { isAnomaly: false };

    // Simple distance check
    let maxDistance = 0;
    for (const record of result.recordset) {
      const distance = this.calculateDistance(
        location.latitude, location.longitude,
        record.LastLocationLat, record.LastLocationLng
      );
      maxDistance = Math.max(maxDistance, distance);
    }

    const kmDistance = maxDistance / 1000;
    if (kmDistance > this.RISK_CONFIG.MONITORING.LOCATION_RADIUS_KM) {
      return {
        isAnomaly: true,
        severity: kmDistance > 100 ? 3 : 2,
        reason: `${Math.round(kmDistance)}km from usual location`
      };
    }

    return { isAnomaly: false };
  }

  static async updateDeviceUsage(deviceId, location) {
    await Database.query(`
      UPDATE EmployeeDevices
      SET LastUsedDate = GETDATE(),
          LastLocationLat = @lat,
          LastLocationLng = @lng
      WHERE DeviceID = @deviceId
    `, {
      deviceId,
      lat: location?.latitude,
      lng: location?.longitude
    });
  }

  static generateSmartDeviceName(deviceType, fingerprint) {
    const browser = fingerprint.browser || "Unknown";
    const platform = fingerprint.platform || "Unknown";
    const date = new Date().toLocaleDateString("en-US", {
      month: "short", day: "numeric"
    });
    return `${deviceType} - ${browser} on ${platform} (${date})`;
  }

  static async applySmartPolicies(employeeId, newDeviceId) {
    try {
      const deviceCount = await this.getEmployeeDeviceCount(employeeId);

      if (deviceCount > this.RISK_CONFIG.AUTO_APPROVE.MAX_DEVICES) {
        await Database.query(`
          UPDATE EmployeeDevices 
          SET IsActive = 0, 
              ModifiedReason = 'Auto-deactivated: Device limit exceeded'
          WHERE DeviceID = (
            SELECT TOP 1 DeviceID 
            FROM EmployeeDevices 
            WHERE EmployeeID = @employeeId 
            AND IsActive = 1 
            AND DeviceID != @newDeviceId
            ORDER BY LastUsedDate ASC
          )
        `, { employeeId, newDeviceId });
      }
    } catch (error) {
      console.error("Policy application error:", error);
    }
  }

  static async logDeviceMonitoring(employeeId, deviceUUID, riskAssessment) {
    await Database.query(`
      INSERT INTO DeviceMonitoringLog 
      (EmployeeID, DeviceUUID, RiskScore, RiskLevel, RiskFlags, LogDate)
      VALUES (@employeeId, @deviceUUID, @riskScore, @riskLevel, @riskFlags, GETDATE())
    `, {
      employeeId,
      deviceUUID,
      riskScore: riskAssessment.score,
      riskLevel: riskAssessment.level,
      riskFlags: JSON.stringify(riskAssessment.flags)
    });
  }

  static async alertManagerAsync(employeeId, deviceUUID, riskAssessment) {
    setTimeout(async () => {
      try {
        const query = `
          SELECT m.Email, m.FullName, e.FullName as EmployeeName
          FROM Employees e
          JOIN Departments d ON e.DepartmentID = d.DepartmentID
          JOIN Employees m ON d.ManagerEmployeeID = m.EmployeeID
          WHERE e.EmployeeID = @employeeId
        `;
        const result = await Database.query(query, { employeeId });
        if (result.recordset.length > 0) {
          const data = result.recordset[0];
          console.log(`📧 Alert queued for manager: ${data.FullName}`);
        }
      } catch (error) {
        console.error("Manager alert error:", error);
      }
    }, 1000);
  }

  static async logSecurityIncident(employeeId, deviceUUID, riskAssessment) {
    await Database.query(`
      INSERT INTO SecurityIncidents 
      (EmployeeID, IncidentType, Description, Severity, Status, DeviceInfo, CreatedDate)
      VALUES (@employeeId, 'HIGH_RISK_DEVICE', @description, 'Critical', 'Open', @deviceInfo, GETDATE())
    `, {
      employeeId,
      description: `High risk device blocked: ${riskAssessment.flags.join(", ")}`,
      deviceInfo: deviceUUID.substring(0, 8) + "..."
    });
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

module.exports = DeviceManager;