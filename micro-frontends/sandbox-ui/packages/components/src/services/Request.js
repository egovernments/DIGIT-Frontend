import Axios from "axios";
import { getStoredValue } from "../states/stateConfigs";

/**
 * Custom Request function for making API calls.
 * Handles interceptors, authentication, headers, caching, and hooks.
 *
 * Author: jagankumar-egov
 */

// Axios response interceptor for error handling
Axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const isEmployee = window.location.pathname.split("/").includes("employee");
    if (err?.response?.data?.Errors) {
      for (const error of err.response.data.Errors) {
        // Handling specific error cases
        if (error.message.includes("InvalidAccessTokenException")) {
          // Clearing storage and redirecting to login
          clearStorageAndRedirect(isEmployee);
        } else if (
          error?.message?.toLowerCase()?.includes("internal server error") ||
          error?.message?.toLowerCase()?.includes("some error occured")
        ) {
          // Redirecting to error page for maintenance or server errors
          redirectWithError(isEmployee, "maintenance");
        } else if (error.message.includes("ZuulRuntimeException")) {
          // Redirecting to error page for not found errors
          redirectWithError(isEmployee, "notfound");
        }
      }
    }
    throw err;
  }
);

// Function to clear storage and redirect to login page
const clearStorageAndRedirect = (isEmployee) => {
  localStorage.clear();
  sessionStorage.clear();
  const loginPath = isEmployee
    ? `/${window?.contextPath}/employee/user/login`
    : `/${window?.contextPath}/citizen/login`;
  redirectToPath(loginPath);
};

// Function to redirect with error type
const redirectWithError = (isEmployee, errorType) => {
  const errorPath = isEmployee
    ? `/${window?.contextPath}/employee/user/error`
    : `/${window?.contextPath}/citizen/error`;
  const queryParams = `?type=${errorType}&from=${encodeURIComponent(
    window.location.pathname + window.location.search
  )}`;
  redirectToPath(errorPath + queryParams);
};

// Function to redirect to a specific path
const redirectToPath = (path) => {
  window.location.href = path;
};

// Function to get authentication token
const getToken = async () => {
  const data = await getStoredValue("auth");
  return data?.data?.token;
};

// Function to get user information
const getUser = async () => {
  const data = await getStoredValue("user");
  return data?.data;
};

// Function to get locale information
const getLocale = async () => {
  const data = await getStoredValue("locale");
  return data?.data?.locale;
};

// Function to prepare request information object
const requestInfo = async (token) => ({
  authToken: token || null,
});

// Function to prepare authentication headers
const authHeaders = (token) => ({
  "auth-token": token || null,
});

// Function to fetch user service data
const userServiceData = async () => ({ userInfo: await getUser() });

/**
 * Custom Request to make all API calls.
 * Handles request preparation, headers, caching, and response processing.
 *
 * @author jagankumar-egov
 *
 * @param {Object} options - The options object.
 * @param {string} [options.method='POST'] - The HTTP method to use for the request.
 * @param {string} options.url - The URL to send the request to.
 * @param {Object} [options.data={}] - The data to send with the request.
 * @param {Object} [options.headers={}] - The headers to send with the request.
 * @param {boolean} [options.useCache=false] - Whether to use caching for the request.
 * @param {Object} [options.params={}] - The URL parameters to send with the request.
 * @param {boolean} [options.auth=false] - Whether to include authentication token.
 * @param {Object} [options.urlParams={}] - The URL parameters to replace in the URL.
 * @param {boolean} [options.userService=false] - Whether to include user service data.
 * @param {boolean} [options.locale=true] - Whether to include locale information.
 * @param {boolean} [options.authHeader=false] - Whether to include authentication headers.
 * @param {boolean} [options.setTimeParam=true] - Whether to include a timestamp parameter to avoid caching.
 * @param {boolean} [options.userDownload=false] - Whether the request is for downloading a file.
 * @param {boolean} [options.noRequestInfo=false] - Whether to exclude request info from the payload.
 * @param {boolean} [options.multipartFormData=false] - Whether to send the request as multipart/form-data.
 * @param {Object} [options.multipartData={}] - The multipart data to send with the request.
 * @param {boolean} [options.reqTimestamp=false] - Whether to include a timestamp in the request info.
 *
 * @returns {Promise<Object>} - The response data.
 */

export const Request = async ({
  method = "POST",
  url,
  data = {},
  headers = {},
  params = {},
  options = {},
}) => {
  const {
    plainAccessRequest = {},
    locale = true,
    auth = true,
    multipartFormData = false,
    multipartData = {},
    reqTimestamp = false,
    authHeader = false,
    noRequestInfo = false,
    urlParams = {},
    useCache = true,
    userService = true,
    setTimeParam = true,
    userDownload = false,
  } = options;

  // Step 1: Prepare request data
  const token = await getToken();
  const preparedData = await prepareRequestData(
    data,
    method,
    auth,
    token,
    userService,
    locale,
    noRequestInfo,
    reqTimestamp,
    headers
  );

  // Step 2: Set headers based on request type
  const preparedHeaders = await setRequestHeaders(
    headers,
    authHeader,
    token,
    userDownload
  );

  // Step 3: Handle caching or timestamp parameters
  const finalURL = handleCacheOrTimestamp(
    useCache,
    params,
    setTimeParam,
    method,
    url,
    data,
    urlParams
  );

  // Step 4: Perform the actual HTTP request
  const responseData = await executeHttpRequest(
    method,
    finalURL,
    preparedData,
    params,
    preparedHeaders,
    userDownload,
    multipartFormData,
    multipartData
  );
  // Step 5: Cache response if needed and execute post-processing hooks
  const updatedResponse = await handleResponse(
    responseData,
    useCache,
    method,
    finalURL,
    data,
    params,
    userDownload
  );
  return updatedResponse;
};

// Function to prepare request data
const prepareRequestData = async (
  data,
  method,
  auth,
  token,
  userService,
  locale,
  noRequestInfo,
  reqTimestamp,
  headers
) => {
  const ts = new Date().getTime();
  const preparedData = { ...data };
  if (method.toUpperCase() === "POST") {
    preparedData.RequestInfo = { apiId: "Rainmaker" };

    if (auth || !!token) {
      preparedData.RequestInfo = {
        ...preparedData.RequestInfo,
        ...(await requestInfo(token)),
      };
    }
    if (userService) {
      preparedData.RequestInfo = {
        ...preparedData.RequestInfo,
        ...(await userServiceData()),
      };
    }
    if (locale) {
      preparedData.RequestInfo = {
        ...preparedData.RequestInfo,
        msgId: `${ts}|${await getLocale()}`,
      };
    }
    if (noRequestInfo) {
      delete preparedData.RequestInfo;
    }
    if (reqTimestamp) {
      preparedData.RequestInfo = {
        ...preparedData.RequestInfo,
        ts: Number(ts),
      };
    }
    if (headers?.["Content-Type"] == "application/x-www-form-urlencoded") {
      const urlEncodedData = new URLSearchParams();
      const keys = Object.keys(data);
      keys?.length > 0 &&
        keys.map((key) => urlEncodedData.append(key, data?.[key]));
      return urlEncodedData;
    }
  }
  return preparedData;
};
// "Content-Type", "application/x-www-form-urlencoded" || application/json", || application/pdf",
// Function to set request headers
const setRequestHeaders = async (headers, authHeader, token, userDownload) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const updatedHeader = { ...defaultHeaders, ...headers };

  if (authHeader) {
    updatedHeader = { ...updatedHeader, ...(await authHeaders(token)) };
  }

  if (userDownload) {
    updatedHeader = { ...updatedHeader, Accept: "application/pdf" };
  }

  return updatedHeader;
};

// Function to handle caching or timestamp parameters
const handleCacheOrTimestamp = (
  useCache,
  params,
  setTimeParam,
  method,
  url,
  data,
  urlParams
) => {
  let finalParams = { ...params };
  if (useCache) {
    /* Window level cache has been implemented we can also have session or localstorage level cache if needed */
    const key = `${method.toUpperCase()}.${url}.${btoa(
      escape(JSON.stringify(params, null, 0))
    )}.${btoa(escape(JSON.stringify(data, null, 0)))}`;
    // key = `${method.toUpperCase()}.${url}.${btoa(escape(JSON.stringify(params, null, 0)))}.${btoa(escape(JSON.stringify(data, null, 0)))}`;

    window.Digit = { ...window?.Digit };
    window.Digit.RequestCache = { ...window?.Digit?.RequestCache };
    const cachedValue = window.Digit.RequestCache[key];
    if (cachedValue) {
      return cachedValue;
    }
  } else if (setTimeParam) {
    finalParams._ = Date.now();
  }

  finalParams = url
    .split("/")
    .map((path) => {
      const key = path.split(":")?.[1];
      return urlParams[key] ? urlParams[key] : path;
    })
    .join("/");

  return finalParams;
};

// Function to execute HTTP request
const executeHttpRequest = async (
  method,
  url,
  data,
  params,
  headers,
  userDownload = false,
  multipartFormData,
  multipartData
) => {
  const serviceName = url.split("/")[1];

  const preHookName = `${serviceName}Pre`;

  if (window[preHookName] && typeof window[preHookName] === "function") {
    let preHookRes = await window[preHookName]({ params, data });
    params = preHookRes.params;
    data = preHookRes.data;
  }

  if (multipartFormData) {
    return await Axios({
      method,
      url,
      data: multipartData.data,
      params,
      headers: {
        "Content-Type": "multipart/form-data",
        "auth-token": getToken() || null,
      },
    });
  }

  const response = userDownload
    ? await Axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: "arraybuffer",
      })
    : await Axios({
        method,
        url,
        data,
        params,
        headers,
      });
  return response;
};

// Function to handle response, caching, and post-processing hooks
const handleResponse = async (
  response,
  useCache,
  method,
  url,
  data,
  params,
  userDownload
) => {
  const responseData = response?.data || response?.response?.data || {};
  if (useCache && response?.data && Object.keys(responseData).length !== 0) {
    const key = `${method.toUpperCase()}.${url}.${btoa(
      escape(JSON.stringify(params, null, 0))
    )}.${btoa(escape(JSON.stringify(data, null, 0)))}`;
    window.Digit = { ...window?.Digit };
    window.Digit.RequestCache = { ...window?.Digit?.RequestCache };
    window.Digit.RequestCache[key] = responseData;
  }
  const serviceName = url.split("/")[1];
  const postHookName = `${serviceName}Post`;
  if (window[postHookName] && typeof window[postHookName] === "function") {
    return await window[postHookName](responseData);
  }

  return responseData;
};
