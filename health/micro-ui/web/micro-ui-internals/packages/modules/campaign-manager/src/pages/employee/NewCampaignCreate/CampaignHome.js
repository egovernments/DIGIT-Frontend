import { Card, HeaderComponent, PopUp, Button , Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SVG } from "@egovernments/digit-ui-components";
import { NewWindow } from "@egovernments/digit-ui-svg-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
const CampaignHome = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
    window.Digit.SessionStorage.del("SelectedFeaturesByModule");
  }, []);

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
            // Add functionality for importing existing campaign
          }}
        >
          <SVG.SystemUpdateAlt width="40" height="40" />
          <div className={"descStyle"}>{t("HCM_IMPORT_EXISTING_CAMPAIGN")}</div>
        </div>

        <div
          className={"cardStyle"}
          onClick={() => {
            setShowPopUp(true);
          }}
        >
          <NewWindow />
          <div className={"descStyle"}>{t("HCM_CREATE_NEW_CAMPAIGN")}</div>
        </div>
      </div>
      {showPopUp && (
        <PopUp
          // className={"boundaries-pop-module"}
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
              label={t("HCM_BOUNDARY_CLOSE")}
              onClick={() => {
                history.push(`/${window.contextPath}/employee/campaign/create-campaign`);
              }}
            />,
          ]}
        >
          {
            <div>
              {/* Header */}
              <h2 style={{ marginBottom: "1rem" }}>{t(CampaignRequirementsData?.[0]?.header)}</h2>

              {/* Descriptions */}
              <ul style={{ paddingLeft: "1.2rem" }}>
                {CampaignRequirementsData?.[0]?.descriptions?.map((item, index) => (
                  <li key={index} style={{ marginBottom: "0.75rem" }}>
                    <strong>{t(item.head)}</strong> {t(item.text)}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div style={{ marginTop: "1.5rem" }}>{t(CampaignRequirementsData?.[0]?.footer)}</div>
            </div>
          }
        </PopUp>
      )}
    </Card>
  );
};

export default CampaignHome;
