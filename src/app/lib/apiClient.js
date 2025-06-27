// src/app/lib/apiClient.js
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get token from cookies (where AuthContext stores it)
  getToken() {
    if (typeof window !== 'undefined') {
      return Cookies.get('token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token from cookies
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/login';
        }
        throw new Error('Authentication required. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: config.method || 'GET',
        error: error.message
      });
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Upload file method (for future use)
  async upload(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type for FormData, let browser set it
    };

    // Add auth token
    const token = this.getToken();
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/login';
        }
        throw new Error('Authentication required. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;