import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-components";

const NonIFrameInterface = (props) => {
  const { stateCode } = props;
  const iframeRef = useRef(null);
  const localStorageKey = 'Employee.token';
  const { moduleName, pageName } = useParams();
  const [iframeLoaded, setIframeLoaded] = useState(false);

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

    if (iframeRef.current) {
      injectCustomHttpInterceptor();
    }
  }, [localStorageKey,iframeWindow]);
  const handleIframeLoad = (e) => {
    setIframeLoaded(true);
    console.log(e, "iframeloaded");
    // Additional logic you want to execute when iframe loads
  };

  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState('');

  const { data, isLoading } = Digit.Hooks.dss.useMDMS(stateCode, "common-masters", ["uiCommonConstants"], {
    select: (data) => {
      let formattedResponse = data?.["common-masters"]?.["uiCommonConstants"]?.[0] || {};
      return formattedResponse;
    },
    enabled: true,
  });

  useEffect(() => {
    const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {};
    const isOrign = pageObject?.["isOrigin"] || false;
    const domain = isOrign
      ? process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
        // ? "https://unified-dev.digit.org"
        : document.location.origin
      : pageObject?.["domain"];
    const contextPath = pageObject?.["routePath"] || "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    if (pageObject?.authToken && pageObject?.authToken?.enable) {
      const authKey = pageObject?.authToken?.key || "auth-token";
      if (pageObject?.authToken?.customFun && Digit.Utils.createFunction(pageObject?.authToken?.customFun)) {
        // Digit.Utils.createFunction(config?.mdmsConfig?.select)
        const customFun = Digit.Utils.createFunction(pageObject?.authToken?.customFun);
        url = customFun(url, Digit.UserService.getUser()?.access_token, pageObject?.authToken);
      } else {
        url = `${url}&${authKey}=${Digit.UserService.getUser()?.access_token || ""}`;
      }
    }
    setUrl(url);
    setTitle(title);
  }, [data, moduleName, pageName]);
  useEffect(() => {
    const fetchData = () => {
      const xhr = new XMLHttpRequest();
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            console.log(xhr.responseText);
            setHtmlContent(xhr.responseText);
            // Handle successful response here
          } else {
            console.error('Request failed with status:', xhr.status);
            // Handle error here
          }
        }
      };
      xhr.open('GET', url, true);
      const oidcToken = window.localStorage.getItem(localStorageKey);

      xhr.setRequestHeader('Authorization', `Bearer ${oidcToken}`);
      // xhr.setRequestHeader('Origin', 'https://unified-dev.digit.org'); // Set your website's origin

      xhr.send();
    };

    fetchData();
  }, [url]);
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
        {/* <iframe src={url} title={title}         ref={iframeRef}
 className="app-iframe"
  // onLoad={handleIframeLoad} 
          // style={{ display: 'none' }} // Assuming you want to hide the iframe initially
 /> */}
       {/* Render HTML content */}
       <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {iframeLoaded && <Toast info={iframeLoaded} label={"Iframe Loaded"}></Toast>}
      </div>
    </React.Fragment>
  );
};

export default NonIFrameInterface;
