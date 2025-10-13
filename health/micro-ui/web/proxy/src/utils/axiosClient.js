/**
 * Axios Client Configuration Utility
 * Creates configured axios instances for different services
 */

const axios = require('axios');

/**
 * Create an axios instance with common configuration
 * @param {string} baseURL - Base URL for the service
 * @param {Object} headers - Additional headers
 * @returns {Object} Configured axios instance
 */
const createAxiosInstance = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    timeout: 60000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    // Handle SSL certificate issues in development/internal networks
    httpsAgent: baseURL.startsWith('https') ? new (require('https').Agent)({
      rejectUnauthorized: false
    }) : undefined
  });
};

module.exports = {
  createAxiosInstance
};