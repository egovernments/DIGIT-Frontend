import { Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-components";
import axios from "axios";
import { Loader } from "@egovernments/digit-ui-components";


// moduleName, pageName will be passed as props as defined in the uiCommonConstants to fetch URL.
const IFrameInterface = (props) => {
  const { stateCode, moduleName, pageName, filters, kibanaMapsDomain } = props;
  const location = useLocation();
  const iframeRef = useRef(null);
  const localStorageKey = 'Employee.token';
  const [isAxiosLoading,setIsAxiosLoading] = useState(true)
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
    // console.log("iframeInInterceptor",iframeWindow)
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
    const domain = isOrign ? (kibanaMapsDomain? kibanaMapsDomain: (process.env.NODE_ENV === "development") ? "https://unified-dev.digit.org" : document.location.origin) : pageObject?.["domain"];
    //checking if overwrite time is true then update the url as per filter time else return the url
    const contextPath = pageObject?.["routePath"] 
      ? (pageObject?.["overwriteTimeFilter"] && filters?.range?.startDate && filters?.range?.endDate 
        ? pageObject["routePath"].replace("from:now-15m", `from:'${new Date(filters?.range?.startDate).toISOString()}'`).replace("to:now", `to:'${new Date(filters?.range?.endDate).toISOString()}'`)
        : pageObject["routePath"]) 
      : "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    // add custom customatizations of url in UICustomizations
    url = Digit?.Customizations?.['commonUiConfig']?.["IframeInterfaceConfig"]?.addAdditionalFilters?Digit?.Customizations?.['commonUiConfig']?.["IframeInterfaceConfig"]?.addAdditionalFilters(url, filters?.filters):url;
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
  }, [data, moduleName, pageName, location, filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const basePath = data?.[moduleName]?.["iframe-routes"]?.[pageName]?.["base-kibana-path"] || "/kibana/"
        const response = await axios.post(`${window.location.origin}${basePath}internal/security/login`, {
          providerType: "anonymous",
          providerName: "anonymous1",
          currentURL: `${window.location.origin}${basePath}login`
        }, {
          headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'DNT': '1',
            'Origin': window.location.origin,
            'Pragma': 'no-cache',
            'Referer': `${window.location.origin}${basePath}login?next=%2Fkibana%2F`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'kbn-build-number': '68312',
            'kbn-version': '8.11.3',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'x-elastic-internal-origin': 'Kibana',
            'x-kbn-context': `{"type":"application","name":"security_login","url":"${basePath}login"}`
          }
        });

        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
          document.cookie = setCookie;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsAxiosLoading(false);
      }
    };
  
    fetchData();
  }, []);

  if (isLoading || isAxiosLoading) {
    return  <Loader page={true} variant={"PageLoader"} />;
  }

  if (!url) {
    return <div>No Iframe To Load</div>;
  }

  return (
    <React.Fragment key={location.pathname}>
      <Header>{t(title)}</Header>
      <div className={`app-iframe-wrapper ${props?.wrapperClassName ? props?.wrapperClassName : ""}`}>
        <iframe 
          ref={iframeRef}
          src={url} 
          title={title} 
          className={`app-iframe ${props?.className ? props?.className : ""}`}   
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
