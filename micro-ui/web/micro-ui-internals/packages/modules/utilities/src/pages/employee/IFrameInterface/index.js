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
  
  
  useEffect(() => {
    const injectCustomHttpInterceptor = () => {
      try {
        if (!iframeWindow) {
          console.error('Failed to access iframe content window.');
          return;
        }
        
        const xhrObj = iframeWindow.XMLHttpRequest.prototype.open;

        iframeWindow.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
          // Intercepting here
          this.addEventListener('load', function() {
            console.log('load: ' + this.responseText);
          });

          xhrObj.apply(this, arguments);

          const oidcToken = window.localStorage.getItem(localStorageKey);
          if (!oidcToken) {
            console.error('OIDC token not found in local storage.');
            return;
          }
          
          const accessToken = oidcToken;
          this.setRequestHeader('Authorization', "Bearer " + accessToken); 
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
        iframeWindow.fetch = function (url, options) {
          // Intercepting here
          const oidcToken = window.localStorage.getItem(localStorageKey);
          if (!oidcToken) {
            console.error('OIDC token not found in local storage.');
            return originalFetch(url, options);
          }
  
          const accessToken = oidcToken;
          if (!options.headers) {
            options.headers = {};
          }
          options.headers['Authorization'] = `Bearer ${accessToken}`;
  
          return originalFetch(url, options)
            .then(response => {
              // You can handle response here if needed
              // console.log('Response:', response);
              return response;
            })
            .catch(error => {
              // You can handle errors here if needed
              console.error('Fetch error:', error);
              throw error;
            });
        };
      } catch (error) {
        console.error('Error injecting custom HTTP interceptor:', error);
      }
    };

    if (iframeRef.current) {
      injectCustomHttpInterceptor();
      injectCustomHttpInterceptorFetch();
    }
  }, [localStorageKey,iframeWindow]);

  useEffect(() => {
    const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {};
    const isOrign = pageObject?.["isOrigin"] || false;
    const domain = isOrign ? (process.env.NODE_ENV === "development" ? "https://unified-dev.digit.org" : document.location.origin) : pageObject?.["domain"];
    const contextPath = pageObject?.["routePath"] || "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    if(pageObject?.authToken&&pageObject?.authToken?.enable){
      const authKey = pageObject?.authToken?.key ||  "auth-token";
      if(pageObject?.authToken?.customFun&&Digit.Utils.createFunction(pageObject?.authToken?.customFun)){
        // Digit.Utils.createFunction(config?.mdmsConfig?.select)
       const customFun= Digit.Utils.createFunction(pageObject?.authToken?.customFun);
        url=customFun(url,Digit.UserService.getUser()?.access_token,pageObject?.authToken);
      }else{
        url=`${url}&${authKey}=${Digit.UserService.getUser()?.access_token||""}`;
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
        src={url} title={title} className="app-iframe"   onLoad={(e) => {
    setIframeLoaded(true);
  }} />
        {iframeLoaded && <Toast info={iframeLoaded} label={"Iframe Loaded"}></Toast>}
      </div>
    </React.Fragment>
  );
};

export default IFrameInterface;
