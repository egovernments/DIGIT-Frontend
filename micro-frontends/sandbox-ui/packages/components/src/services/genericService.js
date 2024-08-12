import { Request } from "./Request";

/**
 * @function genericService
 * @description This is a generic service function used to make HTTP requests.
 * It utilizes the `Request` function to send requests to the specified `url`
 * with the provided parameters, body, and headers.
 *
 * @param {Object} options - The configuration object for the request.
 * @param {string} options.url - The URL to which the request is to be sent.
 * @param {Object} [options.params] - Query parameters to be included in the request URL.
 * @param {Object} [options.body] - The data payload to be sent in the request body.
 * @param {string} [options.type="POST"] - The HTTP method to be used (e.g., "GET", "POST", "PUT", "DELETE"). Defaults to "POST".
 * @param {Object} [options.headers={}] - Custom headers to be included in the request.
 * @param {Object} [options.options] - Additional options that might be required by the `Request` function.
 *
 * @returns {Promise} Returns a promise that resolves with the response of the HTTP request.
 *
 * @example
 * genericService({
 *   url: '/api/data',
 *   params: { id: 123 },
 *   body: { key: 'value' },
 *   type: 'POST',
 *   headers: { 'Content-Type': 'application/json' }
 * }).then(response => {
 *   console.log('Response:', response);
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 *
 * @author jagankumar-egov
 */

export const genericService = ({
  url,
  params,
  body,
  headers = {},
  options = {},
}) =>
  Request({
    url: url,
    data: body,
    method: options?.method,
    params: params,
    headers: headers,
    options,
  });
