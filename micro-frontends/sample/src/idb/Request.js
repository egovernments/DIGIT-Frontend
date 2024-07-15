import Axios from "axios";
import { getStoredValue } from "../state/stateConfigs";

/**
 * Custom Request to make all api calls
 *
 * @author jagankumar-egov
 *
 */

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
          error?.message?.toLowerCase()?.includes("some error occured")
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

const getToken = async () => {
  const data = getStoredValue("auth");
  return data?.data;
};
const getUser = () => {
  return getStoredValue("user").then((data) => data?.data);
};
const getLocale = () => {
  return getStoredValue("locale").then((data) => data?.data);
};

const requestInfo = (token) => ({
  authToken: token || null,
});

const authHeaders = (token) => ({
  "auth-token": token || null,
});

const userServiceData = () => ({ userInfo: getUser() });

// window.Digit = window.Digit || {};
// window.Digit = { ...window.Digit, RequestCache: window.Digit.RequestCache || {} };
export const Request = async ({
  method = "POST",
  url,
  data = {},
  headers = {},
  useCache = false,
  params = {},
  auth,
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
  console.log(url, data, useCache, "url,  data,useCache");
  const ts = new Date().getTime();
  const token = await getToken();
  if (method.toUpperCase() === "POST") {
    data.RequestInfo = {
      apiId: "Rainmaker",
    };
    if (auth || !!token) {
      data.RequestInfo = { ...data.RequestInfo, ...requestInfo(token) };
    }
    if (userService) {
      data.RequestInfo = { ...data.RequestInfo, ...userServiceData() };
    }
    if (locale) {
      data.RequestInfo = { ...data.RequestInfo, msgId: `${ts}|${getLocale()}` };
    }

    if (noRequestInfo) {
      delete data.RequestInfo;
    }

    // /*
    // Feature :: Privacy

    // Desc :: To send additional field in HTTP Requests inside RequestInfo Object as plainAccessRequest
    // */
    // const privacy = Digit.Utils.getPrivacyObject();
    // if (privacy && !url.includes("/edcr/rest/dcr/")) {
    //   if(!noRequestInfo){
    //   data.RequestInfo = { ...data.RequestInfo, plainAccessRequest: { ...privacy } };
    //   }
    // }
  }

  const headers1 = {
    "Content-Type": "application/json",
    // Accept: window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE") ? "application/pdf,application/json" : "application/pdf",
    Accept: "application/pdf",
  };

  if (authHeader) headers = { ...headers, ...authHeaders(token) };

  if (userDownload) headers = { ...headers, ...headers1 };

  let key = "";
  if (useCache) {
    /* The commented code block you provided is attempting to generate a unique key based on the HTTP
   method, URL, params, and data of a request. This key is then used to check if the response data
   for that specific request is already cached in `window.Digit.RequestCache`. */
    key = `${method.toUpperCase()}.${url}.${btoa(
      escape(JSON.stringify(params, null, 0))
    )}.${btoa(escape(JSON.stringify(data, null, 0)))}`;
    window.Digit = { ...window?.Digit };
    window.Digit.RequestCache = { ...window?.Digit?.RequestCache };
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
        "auth-token": getToken() || null,
      },
    });
    return multipartFormDataRes;
  }
  /* 
  Feature :: Single Instance

  Desc :: Fix for central instance to send tenantID in all query params
  */
  //   const tenantInfo =
  //   getUser()?.userType=== "citizen"
  //       ? getTenantInfo()?.rootTenantId
  //       : getTenantInfo()?.tenantId || getTenantInfo()?.rootTenantId;
  //   if (!params["tenantId"] && window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
  //     params["tenantId"] = tenantInfo;
  //   }

  const preHookName = `${serviceName}Pre`;
  const postHookName = `${serviceName}Post`;

  //   let reqParams = params;
  //   let reqData = data;
  /* The code block you provided is checking if a function named `preHookName` exists on the `window`
object and if it is a function. If the function exists and is indeed a function, it is then being
called with an object containing `params` and `data` as arguments. The result of this function call
is then used to update the `reqParams` and `reqData` variables. */
  if (window[preHookName] && typeof window[preHookName] === "function") {
    let preHookRes = await window[preHookName]({ params, data });
    reqParams = preHookRes.params;
    reqData = preHookRes.data;
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
    window.Digit = { ...window?.Digit };
    window.Digit.RequestCache = { ...window?.Digit?.RequestCache };
    window.Digit.RequestCache[key] = returnData;
  }
  if (window[postHookName] && typeof window[postHookName] === "function") {
    return await window[postHookName](resData);
  }
  return returnData;
};
