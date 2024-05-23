import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-components";

const IFrameInterface = (props) => {
  const { stateCode } = props;
  const { moduleName, pageName } = useParams();
  const iframeRef = useRef(null);
  const localStorageKey = 'Employee.token';

  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { data, isLoading } = Digit.Hooks.dss.useMDMS(stateCode, "common-masters", ["uiCommonConstants"], {
    select: (data) => {
      let formattedResponse = data?.["common-masters"]?.["uiCommonConstants"]?.[0] || {};
      return formattedResponse;
    },
    enabled: true,
  });

  const iframeWindow = iframeRef?.current?.contentWindow || iframeRef?.current?.contentDocument;
  console.log(iframeWindow);
  useEffect(() => {
    const injectCustomHttpInterceptor = () => {
      try {
        if (!iframeWindow) {
          console.error('Failed to access iframe content window.');
          return;
        }

        const xhrOpen = iframeWindow.XMLHttpRequest.prototype.open;
        iframeWindow.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
          //intercepting here
          this.addEventListener('readystatechange', function() {
            if (this.readyState === XMLHttpRequest.OPENED) {
              const oidcToken = window.localStorage.getItem(localStorageKey);
              if (oidcToken) {
                const accessToken = oidcToken;
                this.setRequestHeader('Authorization', "Bearer " + accessToken);
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
            options.headers['Authorization'] = `Bearer ${accessToken}`;
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

        const originalDocumentApi = iframeWindow.document.api;
        iframeWindow.document.api = function (url, options = {}) {
          options.headers = options.headers || {};
          const oidcToken = window.localStorage.getItem(localStorageKey);
          if (oidcToken) {
            const accessToken = oidcToken;
            options.headers['Authorization'] = `Bearer ${accessToken}`;
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

    if (iframeRef.current) {
      injectCustomHttpInterceptor();
      injectCustomHttpInterceptorFetch();
      injectCustomHttpInterceptorDocumentApi();
    }
  }, [localStorageKey, iframeWindow]);

  useEffect(() => {
    const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {};
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
  }, [data, moduleName, pageName]);

  if (isLoading) {
    return <Loader />;
  }

  if (!url) {
    return <div>No Iframe To Load</div>;
  }

  return (
    <React.Fragment>
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
