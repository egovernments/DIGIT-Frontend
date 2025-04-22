import { Button, Card, HeaderComponent, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { values } from "lodash";
import { CustomSVG } from "@egovernments/digit-ui-components";

const CampaignDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const data = {
    cards: [
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_BOUNDARY_SELECT_HEADING"),
              desc: t("HCM_SELECT_BOUNDARY_DESC"),
              buttonLabel: t("HCM_SELECT_BOUNDARY_BUTTON"),
              navLink: "setup-campaign?key=5&summary=false&submit=true",
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_DELIVERY_HEADING"),
              desc: t("HCM_DELIVERY_DESC"),
              buttonLabel: t("HCM_DELIVERY_BUTTON"),
              navLink: "setup-campaign?key=7&summary=false&submit=true",
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_MOBILE_APP_HEADING"),
              desc: t("HCM_MOBILE_APP_DESC"),
              buttonLabel: t("HCM_MOBILE_APP_BUTTON"),
              navLink: "setup-campaign?key=7&summary=false&submit=true",
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_UPLOAD_DATA_HEADING"),
              desc: t("HCM_UPLOAD_DATA_DESC"),
              buttonLabel: t("HCM_UPLOAD_DATA_BUTTON"),
              navLink: "setup-campaign?key=10&summary=false&submit=true",
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_CHECKLIST_HEADING"),
              desc: t("HCM_CHECKLIST_DESC"),
              buttonLabel: t("HCM_CHECKLIST_BUTTON"),
              navLink: "setup-campaign?key=7&summary=false&submit=true",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <div>
        <HeaderComponent className={"date-header"}>{t("ES_CAMPAIGN_NAME")}</HeaderComponent>
        <span>{"date"}</span>
        <div className="detail-desc">{t("HCM_VIEW_DETAILS_DESCRIPTION")}</div>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
      <Footer
        actionFields={[
          <Button
            icon="CheckCircleOutline"
            label={t("HCM_CREATE_CAMPAIGN")}
            onClick={() =>{}}
            isDisabled={true}
            type="button"
            variation="primary"
            className={"create-campaign-disable"}
          />
        ]}
        maxActionFieldsAllowed={5}
        setactionFieldsToRight = {true}
      />
    </>
  );
};

export default CampaignDetails;
