import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const IFrameInterface = (props) => {
  const { stateCode } = props;
  const { moduleName, pageName } = useParams();
  const queryParams = Digit.Hooks.useQueryParams()

  const exampleParamObject = {
    "key" : "value",
    "key2" : "value2"
  }

  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

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
    const domain = isOrign ? (process.env.NODE_ENV === "development" ? "https://qa.digit.org" : document.location.origin) : pageObject?.["domain"];
    const contextPath = pageObject?.["routePath"] || "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    if (queryParams.hasOwnProperty('query') && queryParams.query === 'true') {
      addQueryParamsToUrl(url,exampleParamObject)
    }
    else {
      setUrl(url);
    }
    setTitle(title);
  }, [data, moduleName, pageName]);

  function addQueryParamsToUrl(url, paramsObject) {

    const hasQuestionMark = url.includes('?');
  
    const queryString = Object.entries(paramsObject)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  
    const updatedUrl = hasQuestionMark ? `${url}&${queryString}` : `${url}?${queryString}`;
    setUrl(updatedUrl)
  }

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
        <iframe src={url} title={title} className="app-iframe" />
      </div>
    </React.Fragment>
  );
};

export default IFrameInterface;
