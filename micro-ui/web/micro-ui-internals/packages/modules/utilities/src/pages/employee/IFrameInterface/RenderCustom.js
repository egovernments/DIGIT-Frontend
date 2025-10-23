import { Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";


const NonIFrameInterface = (props) => {
  const { stateCode } = props;
  const localStorageKey = 'Employee.token';
  const { moduleName, pageName } = useParams();
  const [iframeLoaded, setIframeLoaded] = useState(false);



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
            setHtmlContent(xhr.responseText);
            setIframeLoaded({type:"info",label:"External Website getting loaded"})
            // Handle successful response here
          } else {
            console.error('Request failed with status:', xhr.status);
            setIframeLoaded({type:"error",label:'Request failed with status:'+ xhr.status})

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

  const renderExternalResources = () => {
    if (!htmlContent) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const externalResources = [];

    // Render <link> elements (stylesheets)
    doc.querySelectorAll('link').forEach(link => {
      if (link.rel === 'stylesheet') {
        externalResources.push(<link rel="stylesheet" href={link.href} key={link.href} />);
      }
    });

    // Render <img> elements (images)
    doc.querySelectorAll('img').forEach(img => {
      externalResources.push(<img src={img.src} alt={img.alt} key={img.src} />);
    });

    // Render <script> elements
    doc.querySelectorAll('script').forEach(script => {
      // Note: For security reasons, loading external scripts dynamically is not recommended in most cases
      // You should carefully review and sanitize the script source before using this approach
      externalResources.push(<script src={script.src} key={script.src} />);
    });

    return externalResources;
  };
  
  if (isLoading) {
    return  <Loader page={true} variant={"PageLoader"} />;
  }

  if (!url) {
    return <div>No Iframe To Load</div>;
  }
  return (
    <React.Fragment>
      <Header>{t(title)}</Header>
      <div className="app-iframe-wrapper">
        {/* Render external resources */}
        {renderExternalResources()}

       {/* Render HTML content */}
       <div style={{height:"100vh",width:"100vw"}} dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {iframeLoaded && <Toast type={iframeLoaded?.type} label={iframeLoaded?.label}></Toast>}
      </div>
    </React.Fragment>
  );
};

export default NonIFrameInterface;
