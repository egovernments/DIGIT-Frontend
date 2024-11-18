import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {} from "@egovernments/digit-ui-react-components";
import { PanelCard, ActionBar, Button } from "@egovernments/digit-ui-components";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [complaintId, setComplaintId] = useState(queryStrings?.complaintId);
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();

  const children = [
    <div style={{ display: "flex" }} key="response-text">
      {state?.boldText ? (
        <p style={{ margin: "0rem" }}>
          {t(state?.preText)}
          <b> {t(state?.boldText)} </b>
          {t(state?.postText)}
        </p>
      ) : (
        t(state?.text, { CAMPAIGN_ID: campaignId })
      )}
    </div>,
  ];

  return (
    <>
      <PanelCard
        type={isResponseSuccess ? "success" : "error"}
        message={t("Cmplaint Submitted")}
        response={complaintId}
        info={"Complaint Number"}
        footerChildren={[]}
        children={children}
        description={"The notification along with your complaint number is sent to your complainant’s mobile number. Complainant can track the complaint status using mobile or web app."}
      />
      <ActionBar
        actionFields={[
          <Button
            label={"Go Back To Home"}
            onClick={() => history.push(`/${window.contextPath}/employee`)}
            type="button"
          />,
        ]}
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
    </>
  );
};

export default Response;
