import Axios from "axios";

/**
 * Custom Request and ServiceRequest to make all API calls
 * Adds Authorization Bearer token in headers dynamically
 */

// Axios interceptor to include Authorization Bearer token in all requests
Axios.interceptors.request.use(
  (config) => {
    const token = Digit.UserService.getUser()?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios interceptor to handle errors globally
Axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const isEmployee = window.location.pathname.split("/").includes("employee");
    if (err?.response?.data?.Errors) {
      for (const error of err.response.data.Errors) {
        if (error.message.includes("InvalidAccessTokenException")) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href =
            (isEmployee
              ? `/${window?.contextPath}/employee/user/login`
              : `/${window?.contextPath}/citizen/login`) +
            `?from=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`;
        } else if (
          error?.message?.toLowerCase()?.includes("internal server error") ||
          error?.message?.toLowerCase()?.includes("some error occurred")
        ) {
          window.location.href =
            (isEmployee
              ? `/${window?.contextPath}/employee/user/error`
              : `/${window?.contextPath}/citizen/error`) +
            `?type=maintenance&from=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`;
        } else if (error.message.includes("ZuulRuntimeException")) {
          window.location.href =
            (isEmployee
              ? `/${window?.contextPath}/employee/user/error`
              : `/${window?.contextPath}/citizen/error`) +
            `?type=notfound&from=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`;
        }
      }
    }
    throw err;
  }
);

const requestInfo = () => ({
  authToken: Digit.UserService.getUser()?.access_token || null,
});

const authHeaders = () => ({
  "auth-token": Digit.UserService.getUser()?.access_token || null,
  "Authorization": `Bearer ${Digit.UserService.getUser()?.access_token || ""}`,
});

const userServiceData = () => ({
  userInfo: Digit.UserService.getUser()?.info,
});

window.Digit = window.Digit || {};
window.Digit = { ...window.Digit, RequestCache: window.Digit.RequestCache || {} };

/**
 * Request function to send API requests
 */
export const Request = async ({
  method = "POST",
  url,
  data = {},
  headers = {},
  useCache = false,
  params = {},
  auth = true,
  urlParams = {},
  userService,
  locale = true,
  authHeader = false,
  setTimeParam = true,
  userDownload = false,
  noRequestInfo = false,
  multipartFormData = false,
  multipartData = {},
  reqTimestamp = false,
}) => {
  const ts = new Date().getTime();

  if (method.toUpperCase() === "POST") {
    data.RequestInfo = { apiId: "Rainmaker" };

    if (auth) {
      data.RequestInfo = { ...data.RequestInfo, ...requestInfo() };
    }
    if (userService) {
      data.RequestInfo = { ...data.RequestInfo, ...userServiceData() };
    }
    if (locale) {
      data.RequestInfo = {
        ...data.RequestInfo,
        msgId: `${ts}|${Digit.StoreData.getCurrentLanguage()}`,
      };
    }
    if (noRequestInfo) {
      delete data.RequestInfo;
    }

    const privacy = Digit.Utils.getPrivacyObject();
    if (privacy && !url.includes("/edcr/rest/dcr/")) {
      if (!noRequestInfo) {
        data.RequestInfo = {
          ...data.RequestInfo,
          plainAccessRequest: { ...privacy },
        };
      }
    }
  }

  const headers1 = {
    "Content-Type": "application/json",
    Accept: window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")
      ? "application/pdf,application/json"
      : "application/pdf",
  };

  if (authHeader) headers = { ...headers, ...authHeaders() };

  if (userDownload) headers = { ...headers, ...headers1 };

  let key = "";
  if (useCache) {
    key = `${method.toUpperCase()}.${url}.${btoa(
      escape(JSON.stringify(params, null, 0))
    )}.${btoa(escape(JSON.stringify(data, null, 0)))}`;
    const value = window.Digit.RequestCache[key];
    if (value) {
      return value;
    }
  } else if (setTimeParam) {
    params._ = Date.now();
  }

  if (reqTimestamp) {
    data.RequestInfo = { ...data.RequestInfo, ts: Number(ts) };
  }

  let _url = url
    .split("/")
    .map((path) => {
      let key = path.split(":")?.[1];
      return urlParams[key] ? urlParams[key] : path;
    })
    .join("/");

  if (multipartFormData) {
    const multipartFormDataRes = await Axios({
      method,
      url: _url,
      data: multipartData.data,
      params,
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeaders(),
      },
    });
    return multipartFormDataRes;
  }

  const tenantInfo =
    Digit.SessionStorage.get("userType") === "citizen"
      ? Digit.ULBService.getStateId()
      : Digit.ULBService.getCurrentTenantId() || Digit.ULBService.getStateId();
  if (!params["tenantId"] && window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
    params["tenantId"] = tenantInfo;
  }

  const res = userDownload
    ? await Axios({
        method,
        url: _url,
        data,
        params,
        headers,
        responseType: "arraybuffer",
      })
    : await Axios({ method, url: _url, data, params, headers });

  if (userDownload) return res;

  const returnData = res?.data || res?.response?.data || {};
  if (useCache && res?.data && Object.keys(returnData).length !== 0) {
    window.Digit.RequestCache[key] = returnData;
  }
  return returnData;
};

/**
 * ServiceRequest function to handle pre-hooks, post-hooks, and API requests
 */
export const ServiceRequest = async ({
  serviceName,
  method = "POST",
  url,
  data = {},
  headers = {},
  useCache = false,
  params = {},
  auth = true,
  reqTimestamp = false,
  userService = false,
}) => {
  const preHookName = `${serviceName}Pre`;
  const postHookName = `${serviceName}Post`;

  let reqParams = params;
  let reqData = data;
  if (window[preHookName] && typeof window[preHookName] === "function") {
    const preHookRes = await window[preHookName]({ params, data });
    reqParams = preHookRes.params;
    reqData = preHookRes.data;
  }
  const resData = await Request({
    method,
    url,
    data: reqData,
    headers,
    useCache,
    params: reqParams,
    auth,
    reqTimestamp,
    userService,
  });

  if (window[postHookName] && typeof window[postHookName] === "function") {
    return await window[postHookName](resData);
  }
  return resData;
};
