import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PanelCard, Button } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const NewAppFeatureSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { campaignNumber, projectType, tenantId, moduleName } = Digit.Hooks.useQueryParams();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <PanelCard
        type="success"
        message={t("GREAT_YOU_ARE_ALL_SET")}
        info=""
        response=""
        children={[
          <div key="desc" style={{ margin: 0 }}>
            <p style={{ margin: 0, color: "#505A5F", fontSize: "0.875rem", lineHeight: "137%" }}>
              {t("FEATURE_CONFIG_SUCCESS_DESCRIPTION")}
            </p>
          </div>,
        ]}
        footerChildren={[
          <Button
            key="continue"
            label={t("CONTINUE_TO_APP_CONFIGURATION")}
            title={t("CONTINUE_TO_APP_CONFIGURATION")}
            variation="primary"
            onClick={() => {
              navigate(
                `/${window.contextPath}/employee/campaign/app-config-init?campaignNumber=${campaignNumber}&flow=${moduleName}&version=1`
              );
            }}
            style={{ width: "100%" }}
          />,
        ]}
        showAsSvg={true}
      />
    </div>
  );
};

export default NewAppFeatureSuccess;