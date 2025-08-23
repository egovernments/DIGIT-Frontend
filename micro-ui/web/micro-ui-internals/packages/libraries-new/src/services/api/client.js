import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: window?.contextPath ? `/${window.contextPath}` : '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const user = this.getUserData();
        if (user?.access_token) {
          config.headers['auth-token'] = user.access_token;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  getUserData() {
    try {
      // Try to get user data from various sources
      return window.Digit?.UserService?.getUser?.() || 
             JSON.parse(localStorage.getItem('Digit.user')) ||
             JSON.parse(sessionStorage.getItem('Digit.user')) ||
             null;
    } catch {
      return null;
    }
  }

  handleApiError(error) {
    const isEmployee = window.location.pathname.split("/").includes("employee");
    const contextPath = window?.contextPath || '';
    
    if (error?.response?.data?.Errors) {
      for (const err of error.response.data.Errors) {
        if (err.message.includes("InvalidAccessTokenException")) {
          localStorage.clear();
          sessionStorage.clear();
          const redirectPath = isEmployee 
            ? `/${contextPath}/employee/user/login` 
            : `/${contextPath}/citizen/login`;
          window.location.href = `${redirectPath}?from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        } else if (
          err?.message?.toLowerCase()?.includes("internal server error") ||
          err?.message?.toLowerCase()?.includes("some error occured")
        ) {
          const redirectPath = isEmployee 
            ? `/${contextPath}/employee/user/error` 
            : `/${contextPath}/citizen/error`;
          window.location.href = `${redirectPath}?type=maintenance&from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        } else if (err.message.includes("ZuulRuntimeException")) {
          const redirectPath = isEmployee 
            ? `/${contextPath}/employee/user/error` 
            : `/${contextPath}/citizen/error`;
          window.location.href = `${redirectPath}?type=notfound&from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }
    }
  }

  getRequestInfo() {
    return {
      authToken: this.getUserData()?.access_token || null,
    };
  }

  getUserInfo() {
    return { userInfo: this.getUserData()?.info };
  }

  async request(config) {
    return this.client.request(config);
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    // Add RequestInfo to POST requests by default
    const requestData = {
      RequestInfo: this.getRequestInfo(),
      ...data,
    };
    
    return this.client.post(url, requestData, config);
  }

  async put(url, data = {}, config = {}) {
    const requestData = {
      RequestInfo: this.getRequestInfo(),
      ...data,
    };
    
    return this.client.put(url, requestData, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;