import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar, ArrowRightInbox } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom";
import { downloadStudioPDF, getPdfKeyForState } from "../../utils";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const {module, service} = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();

  const navigate = (page) => {
    switch (page) {
      case "home": {
        history.push(`/${window.contextPath}/employee`);
      }
      case "view": {
        history.push(state.redirectionUrl);
      }
    }
  };

  const HandleDownloadPdf = () => {
    downloadStudioPDF('pdf/generatepdf',{applicationNumber:state?.applicationNumber,tenantId, serviceCode:queryStrings?.serviceCode, pdfKey:getPdfKeyForState(state?.config?.data?.pdf,state?.workflowStatus)},`Application-${queryStrings?.applicationNumber}.pdf`)
}

  return (
    <Card>
      <Banner
        successful={isResponseSuccess}
        message={t(state?.message || "SUCCESS")}
        info={`${state?.showID ? t("COMMON_APPLICATION_ID") : ""}`}
        whichSvg={`${isResponseSuccess ? "tick" : null}`}
        applicationNumber={state?.applicationNumber}
      />
      <div style={{ display: "flex" }}>
        {isResponseSuccess && <LinkLabel style={{ display: "flex", marginRight: "3rem" }} onClick={() => navigate("view")}>
          <ArrowRightInbox fill="#F47738" style={{ marginRight: "8px", marginTop: "3px" }} />
          {t(`${module.toUpperCase()}_${service.toUpperCase()}_VIEW_APPLICATION`)}
        </LinkLabel>}
        {isResponseSuccess && <LinkLabel style={{ display: "flex", marginRight: "3rem" }} onClick={() => HandleDownloadPdf()}>
          <ArrowRightInbox fill="#F47738" style={{ marginRight: "8px", marginTop: "3px" }} />
          {t(`${module.toUpperCase()}_${service.toUpperCase()}_DOWNLOAD`)}
        </LinkLabel>}
      </div>
      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t(`${module.toUpperCase()}_${service.toUpperCase()}_GO_TO_HOME`)} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default Response;
