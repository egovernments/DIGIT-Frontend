import apiClient from './api/client';
import { ApiUrls } from './api/urls';

/**
 * User Service for authentication and user management
 */
class UserService {
  /**
   * Authenticate user with username/password or OTP
   */
  async authenticate(details) {
    const data = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => data.append(key, value));
    data.append("scope", "read");
    data.append("grant_type", "password");
    
    try {
      const response = await apiClient.post(ApiUrls.AUTHENTICATE, data, {
        headers: {
          authorization: `Basic ${window?.globalConfigs?.getConfig?.("JWT_TOKEN") || "ZWdvdi11c2VyLWNsaWVudDo="}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const authResponse = response.data;
      
      // Check for invalid roles
      const invalidRoles = window?.globalConfigs?.getConfig?.("INVALIDROLES") || [];
      if (invalidRoles && invalidRoles.length > 0 && authResponse && authResponse?.UserRequest?.roles?.some((role) => invalidRoles.includes(role.code))) {
        throw new Error("ES_ERROR_USER_NOT_PERMITTED");
      }

      return authResponse;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Send OTP for user authentication
   */
  async sendOtp(details, stateCode) {
    try {
      const response = await apiClient.post(ApiUrls.OTP_SEND, details, {
        params: { tenantId: stateCode }
      });
      return response.data;
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async registerUser(details, stateCode) {
    try {
      const response = await apiClient.post(ApiUrls.REGISTER_USER, {
        User: details,
      }, {
        params: { tenantId: stateCode }
      });
      return response.data;
    } catch (error) {
      console.error('User registration failed:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(details, stateCode) {
    try {
      const response = await apiClient.put(ApiUrls.USER_UPDATE, {
        user: details,
      }, {
        params: { tenantId: stateCode },
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(details, stateCode) {
    const currentUser = this.getUser();
    const url = currentUser?.info ? ApiUrls.CHANGE_PASSWORD_LOGGED_IN : ApiUrls.CHANGE_PASSWORD;
    
    try {
      const response = await apiClient.post(url, details, {
        params: { tenantId: stateCode },
        headers: currentUser?.info ? {
          'Authorization': `Bearer ${this.getToken()}`
        } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  /**
   * Search for users
   */
  async userSearch(tenantId, data, filters = {}) {
    try {
      const requestData = data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" };
      
      const response = await apiClient.post(ApiUrls.USER_SEARCH, requestData, {
        params: { ...filters },
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('User search failed:', error);
      throw error;
    }
  }

  /**
   * Search for employees
   */
  async employeeSearch(tenantId, filters = {}) {
    try {
      const response = await apiClient.get(ApiUrls.EMPLOYEE_SEARCH, {
        params: { tenantId, ...filters },
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Employee search failed:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logoutUser() {
    const user = this.getUser();
    if (!user || !user.info || !user.access_token) return false;
    
    const { type } = user.info;
    const tenantId = type === "CITIZEN" ? this.getStateLevelTenant() : this.getCurrentTenant();
    
    try {
      const response = await apiClient.post(ApiUrls.USER_LOGOUT, {
        access_token: user?.access_token
      }, {
        params: { tenantId },
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Complete logout process
   */
  async logout() {
    const userType = this.getType();
    try {
      await this.logoutUser();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      if (userType === "citizen") {
        window.location.replace(`/${window?.contextPath}/citizen`);
      } else {
        window.location.replace(`/${window?.contextPath}/employee/user/language-selection`);
      }
    }
  }

  /**
   * Set user in session storage
   */
  setUser(data) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('User', JSON.stringify(data));
    }
  }

  /**
   * Get user from session storage
   */
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('User');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Get user type
   */
  getType() {
    return localStorage.getItem("userType") || "citizen";
  }

  /**
   * Set user type
   */
  setType(userType) {
    localStorage.setItem("userType", userType);
    localStorage.setItem("user_type", userType);
  }

  /**
   * Get authentication token
   */
  getToken() {
    const user = this.getUser();
    return user?.access_token;
  }

  /**
   * Check if user has access to specific roles
   */
  hasAccess(accessTo) {
    const user = this.getUser();
    if (!user || !user.info) return false;
    
    const { roles } = user.info;
    return roles && Array.isArray(roles) && roles.filter((role) => accessTo.includes(role.code)).length > 0;
  }

  /**
   * Set extra role details
   */
  setExtraRoleDetails(data) {
    const userDetails = this.getUser();
    this.setUser({ ...userDetails, extraRoleInfo: data });
  }

  /**
   * Get extra role details
   */
  getExtraRoleDetails() {
    return this.getUser()?.extraRoleInfo;
  }

  /**
   * Get current tenant
   */
  getCurrentTenant() {
    return localStorage.getItem("Employee.tenant-id") || localStorage.getItem("tenant-id");
  }

  /**
   * Get state level tenant
   */
  getStateLevelTenant() {
    return window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
  }
}

export default new UserService();