import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-components";

const IFrameInterface = (props) => {
  const { stateCode } = props;
  const { moduleName, pageName } = useParams();
  const location = useLocation();
  const iframeRef = useRef(null);
  const localStorageKey = 'Employee.token';

  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [sendAuth, setSendAuth] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { data, isLoading } = Digit.Hooks.dss.useMDMS(stateCode, "common-masters", ["uiCommonConstants"], {
    select: (data) => {
      let formattedResponse = data?.["common-masters"]?.["uiCommonConstants"]?.[0] || {};
      return formattedResponse;
    },
    enabled: true,
  });

  const injectCustomHttpInterceptors = (iframeWindow) => {
    console.log("iframeInInterceptor",iframeWindow)
    const injectCustomHttpInterceptor = () => {
      try {
        if (!iframeWindow) {
          console.error('Failed to access iframe content window.');
          return;
        }

        const xhrOpen = iframeWindow.XMLHttpRequest.prototype.open;
        iframeWindow.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
          // Intercepting here
          this.addEventListener('readystatechange', function() {
            if (this.readyState === XMLHttpRequest.OPENED) {
              const oidcToken = window.localStorage.getItem(localStorageKey);
              if (oidcToken) {
                const accessToken = oidcToken;
                
                if (sendAuth === "invalid") {
                  this.setRequestHeader('Authorization', "Bearer " + "authToken");
                } else {
                  this.setRequestHeader('Authorization', accessToken);
                }
              }
              this.setRequestHeader('type-req', 'xhr');
            }
          });
          xhrOpen.apply(this, arguments);
        };
      } catch (error) {
        console.error('Error injecting custom HTTP interceptor:', error);
      }
    };

    const injectCustomHttpInterceptorFetch = () => {
      try {
        if (!iframeWindow) {
          console.error('Failed to access iframe content window.');
          return;
        }

        const originalFetch = iframeWindow.fetch;
        iframeWindow.fetch = function (url, options = {}) {
          options.headers = options.headers || {};
          const oidcToken = window.localStorage.getItem(localStorageKey);
          if (oidcToken) {
            const accessToken = oidcToken;
            
            if (sendAuth === "invalid") {
              options.headers['Authorization'] = `Bearer authToken`;
            } else {
              console.log("url here",url)
              console.log("typof url", typeof url);
              if (typeof url === "string" && (url?.includes("vector.maps.elastic.co") ||url?.includes("tiles.maps.elastic.co") )) {
                const oldUrl = url;
                const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {}
                console.log("interceptor fetch",pageObject);
                const routePath = pageObject?.["routePath"] || ""
                console.log("interceptor fetch",routePath);

                // Parse the URL
                // const urlObject = new URL(url);
                // Replace the hostname
                const newUrl = `${document.location.origin}${routePath}`;  // Replace with your new hostname
                console.log("interceptor fetch",newUrl);
                // Convert the URL object back to a string
                url = newUrl;
                
                // Set additional headers if needed
                options.headers['mode'] = 'no-cors';
                options.headers['replace-url'] = oldUrl;
              }
              if (typeof url === "object" && (url?.url?.includes("vector.maps.elastic.co") ||url?.url?.includes("tiles.maps.elastic.co") )) {
                const oldUrl = url?.url;
                const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {}
                console.log("object interceptor fetch",pageObject);
                const routePath = pageObject?.["routePath"] || ""
                console.log("object interceptor fetch",routePath);

                // Parse the URL
                // const urlObject = new URL(url);
                // Replace the hostname
                const newUrl = `${document.location.origin}${routePath}`;  // Replace with your new hostname
                console.log("object interceptor fetch",newUrl);
                // Convert the URL object back to a string
                url.url = newUrl;
                
                // Set additional headers if needed
                options.headers['mode'] = 'no-cors';
                options.headers['replace-url'] = oldUrl;
              }
              options.headers['Authorization'] = `${accessToken}`;
            }
          }
          options.headers['type-req'] = 'fetch';
          return originalFetch(url, options)
            .then(response => {
              return response;
            })
            .catch(error => {
              console.error('Fetch error:', error);
              throw error;
            });
        };
      } catch (error) {
        console.error('Error injecting custom HTTP interceptor:', error);
      }
    };

    const injectCustomHttpInterceptorDocumentApi = () => {
      try {
        if (!iframeWindow) {
          console.error('Failed to access iframe content window.');
          return;
        }

        if (typeof iframeWindow.document.api !== 'function') {
          console.error('document.api is not a function.');
          return;
        }

        const originalDocumentApi = iframeWindow.document.api;
        iframeWindow.document.api = function (url, options = {}) {
          options.headers = options.headers || {};
          const oidcToken = window.localStorage.getItem(localStorageKey);
          if (oidcToken) {
            const accessToken = oidcToken;
            
            if (sendAuth === "invalid") {
              options.headers['Authorization'] = `Bearer authToken`;
            } else {
              options.headers['Authorization'] = `${accessToken}`;
            }
          }
          options.headers['type-req'] = 'document';
          return originalDocumentApi(url, options)
            .then(response => {
              return response;
            })
            .catch(error => {
              console.error('Document API error:', error);
              throw error;
            });
        };
      } catch (error) {
        console.error('Error injecting custom HTTP interceptor for document.api:', error);
      }
    };

    if (sendAuth) {
      injectCustomHttpInterceptor();
      injectCustomHttpInterceptorFetch();
      injectCustomHttpInterceptorDocumentApi();
    }
  };

  useEffect(() => {
    const iframeWindow = iframeRef?.current?.contentWindow || iframeRef?.current?.contentDocument;
    console.log("myIframe window",iframeWindow);
    console.log("sendAuth in effect",sendAuth);
    if (iframeRef.current) {
      injectCustomHttpInterceptors(iframeWindow);
    }
  }, [localStorageKey, sendAuth, location]);

  useEffect(() => {
    const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {};

    if (pageObject?.Authorization) {
      if (pageObject?.SendInvalidAuthorization) {
        setSendAuth("invalid");
      } else {
        setSendAuth(true);
      }  
    } else {
      setSendAuth(false);
    }

    const isOrign = pageObject?.["isOrigin"] || false;
    const domain = isOrign ? (process.env.NODE_ENV === "development" ? "https://unified-dev.digit.org" : document.location.origin) : pageObject?.["domain"];
    const contextPath = pageObject?.["routePath"] || "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    if (pageObject?.authToken && pageObject?.authToken?.enable) {
      const authKey = pageObject?.authToken?.key || "auth-token";
      if (pageObject?.authToken?.customFun && Digit.Utils.createFunction(pageObject?.authToken?.customFun)) {
        const customFun = Digit.Utils.createFunction(pageObject?.authToken?.customFun);
        url = customFun(url, Digit.UserService.getUser()?.access_token, pageObject?.authToken);
      } else {
        url = `${url}&${authKey}=${Digit.UserService.getUser()?.access_token || ""}`;
      }
    }
    setUrl(url);
    setTitle(title);
  }, [data, moduleName, pageName, location]);

  if (isLoading) {
    return <Loader />;
  }

  if (!url) {
    return <div>No Iframe To Load</div>;
  }

  return (
    <React.Fragment key={location.pathname}>
      <Header>{t(title)}</Header>
      <div className="app-iframe-wrapper">
        <iframe 
          ref={iframeRef}
          src={url} 
          title={title} 
          className="app-iframe"   
          onLoad={(e) => {
            setIframeLoaded(true);
          }} 
        />
        {iframeLoaded && <Toast type={iframeLoaded ? "info" : ""} label={"Iframe Loaded"}></Toast>}
      </div>
    </React.Fragment>
  );
};

export default IFrameInterface;
