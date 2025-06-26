import { Card, HeaderComponent, PopUp, Button, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SVG } from "@egovernments/digit-ui-components";
import { NewWindow } from "@egovernments/digit-ui-svg-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { AppHelpContent } from "../../../components/HelpInfoCard";
const CampaignHome = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
    window.Digit.SessionStorage.del("SelectedFeaturesByModule");
    sessionStorage.removeItem("HCM_CAMPAIGN_NUMBER");

  }, []);

  //TODO @bhavya @jagan integrate with a master similar to   "commonUiConfig", "HelpInfo",

  const AppHelpConfig = {
    title: "CAMPAIGN_REQUIREMENTS_HEADING",
    sections: [
      {
        heading: {
          body: "CAMPAIGN_REQUIREMENTS_DESC",
        },
        content: [
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/location.png",
            alt: "icon",
            width: "100%",
          },
          {
            type: "text",
            text: "HCM_WHERE",
            style: ["bold"],
          },
          {
            type: "text",
            text: "HCM_WHERE_DESC",
          },
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/twopeople.png",
            alt: "icon",
            width: "100%",
          },
          {
            type: "text",
            text: "HCM_WHO",
            style: ["bold"],
          },
          {
            type: "text",
            text: "HCM_WHO_DESC",
          },
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/groupofpeople.png",
            alt: "icon",
            width: "100%",
          },
          {
            type: "text",
            text: "HCM_TEAM",
            style: ["bold"],
          },
          {
            type: "text",
            text: "HCM_TEAM_DESC",
          },
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/facility.png",
            alt: "icon",
            width: "100%",
          },
          {
            type: "text",
            text: "HCM_FACILITIES",
            style: ["bold"],
          },
          {
            type: "text",
            text: "HCM_FACILITIES_DESC",
          },
          {
            type: "image",
            src: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/bargraph.png",
            alt: "icon",
            width: "100%",
          },
          {
            type: "text",
            text: "HCM_TARGET",
            style: ["bold"],
          },
          {
            type: "text",
            text: "HCM_TARGET_DESC",
          }
        ],
      }
    ],
    pages: "apply-page",
    module: "application-module",
  };

  const { data: CampaignRequirementsData, isLoading: CampaignRequirementsLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "CampaignRequirements",
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.CampaignRequirements;
      },
    },
    { schemaCode: CONSOLE_MDMS_MODULENAME.CampaignRequirements }
  );

  if (CampaignRequirementsLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <Card>
      <HeaderComponent className="campaign-header-style">{t(`HCM_HOW_DO_YOU_WANT_TO_CREATE`)}</HeaderComponent>
      <p className="name-description">{t(`HCM_CREATE_CAMPAIGN_DESCRIPTION`)}</p>
      <div className={"containerStyle"}>
        <div
          className={"cardStyle"}
          onClick={() => {
            setShowPopUp(true);
          }}
        >
          <NewWindow />
          <div className={"descStyle "}>{t("HCM_CREATE_NEW_CAMPAIGN")}</div>
        </div>
        <div
          className={"cardStyle disabledCard"}
          onClick={() => {
            // Add functionality for importing existing campaign
          }}
        >
          <SVG.SystemUpdateAlt width="40" height="40" fill={"#c5c5c5"} />
          <div className={"descStyle disabledText"}>{t("HCM_IMPORT_EXISTING_CAMPAIGN")}</div>
        </div>
      </div>
      {showPopUp && (
        <PopUp
          className={"campaign-requirements-heading"}
          type={"default"}
          heading={t("CAMPAIGN_REQUIREMENTS_HEADING")}
          children={[]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("HCM_CAMPAIGN_PROCEED")}
              onClick={() => {
                history.push(`/${window.contextPath}/employee/campaign/create-campaign`);
              }}
            />,
          ]}
        >
          <AppHelpContent config={AppHelpConfig} groupTextBlocks={true}></AppHelpContent>
        </PopUp>
      )}
    </Card>
  );
};

export default CampaignHome;
