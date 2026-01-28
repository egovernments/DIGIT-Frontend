import {
  Card,
  HeaderComponent,
  PopUp,
  Button,
  Loader,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewWindow } from "@egovernments/digit-ui-svg-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { AppHelpContent } from "../../../components/HelpInfoCard";
import { CopyAll } from "../../../components/icons/CopyAll";
import { MobileLayout } from "../../../components/icons/MobileLayout";

const CampaignHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
    window.Digit.SessionStorage.del("SelectedFeaturesByModule");
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_UNIFIED_UPLOAD_DATA");
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

  const { data: CampaignRequirementsData, isLoading: CampaignRequirementsLoading, } = Digit.Hooks.useCustomMDMS(
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

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const reqCriteriaForm = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: "HCM-ADMIN-CONSOLE.campaignTypeTemplates",
        limit: "10000",
        isActive: true
      },
    },
    config: {
      enabled: true ,
    },
  };
  const { isLoading, data: templatesData } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);
  const templatesDataLength = templatesData?.mdms?.length;

  if (CampaignRequirementsLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <Card className="digit-campaign-home-card-wrapper">
      <HeaderComponent className="campaign-header-style">
        {t(`HCM_HOW_DO_YOU_WANT_TO_CREATE`)}
      </HeaderComponent>
      <p className="name-description">{t(`HCM_CREATE_CAMPAIGN_DESCRIPTION`)}</p>
      <div className={"containerStyle"}>
        <Card
          className="digit-campaign-home-card"
          tabIndex={0}
          onClick={() => {
            navigate(
              `/${window.contextPath}/employee/campaign/campaign-templates?from=home`
            );
          }}
        >
          <div className="digit-campaign-home-icon">
            <MobileLayout width="40" height="40" fill={"#C84C0E"} />
          </div>
          <div className="digit-campaign-home-text">
            <div className="digit-campaign-home-text-header">
              {t("HCM_START_WITH_CAMPAIGN_TEMPLATE")}
            </div>
            <div className="digit-campaign-home-text-description">
              {t("HCM_START_WITH_CAMPAIGN_TEMPLATE_DES")}
            </div>
          </div>
          <div className="digit-campaign-home-card-count">
            <MobileLayout width="20" height="20" fill={"#0B4B66"} />
            <div className="digit-campaign-home-card-count-text">{`${templatesDataLength} ${t("TEMPLATES_AVAILABLE")}`}</div>
          </div>
        </Card>
        <Card
          className="digit-campaign-home-card"
          tabIndex={1}
          onClick={() => {
            navigate(
              `/${window.contextPath}/employee/campaign/my-campaign-new?from=home`
            );
          }}
        >
          {" "}
          <div className="digit-campaign-home-icon">
            <CopyAll />
          </div>
          <div className="digit-campaign-home-text">
            <div className="digit-campaign-home-text-header">
              {t("HCM_IMPORT_EXISTING_CAMPAIGN")}
            </div>
            <div className="digit-campaign-home-text-description">
              {t("HCM_IMPORT_EXISTING_CAMPAIGN_DES")}
            </div>
          </div>
        </Card>
        <Card
          className="digit-campaign-home-card"
          tabIndex={2}
          onClick={() => {
            setShowPopUp(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowPopUp(true);
            }
          }}
        >
          {" "}
          <div className="digit-campaign-home-icon">
            <NewWindow />
          </div>
          <div className="digit-campaign-home-text">
            <div className="digit-campaign-home-text-header">
              {t("HCM_CREATE_NEW_CAMPAIGN_FROM_SCRATCH")}
            </div>
            <div className="digit-campaign-home-text-description">
              {t("HCM_CREATE_NEW_CAMPAIGN_FROM_SCRATCH_DES")}
            </div>
          </div>
        </Card>
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
          equalWidthButtons={true}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("HCM_CAMPAIGN_PROCEED")}
              title={t("HCM_CAMPAIGN_PROCEED")}
              onClick={() => {
                navigate(
                  `/${window.contextPath}/employee/campaign/create-campaign`
                );
              }}
            />,
          ]}
        >
          <AppHelpContent
            config={AppHelpConfig}
            groupTextBlocks={true}
          ></AppHelpContent>
        </PopUp>
      )}
    </Card>
  );
};

export default CampaignHome;
