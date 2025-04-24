import { Card, HeaderComponent ,Button} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
const AppModule = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();


  const { isLoading: productTypeLoading, data: modulesData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "AppModuleSchema" }],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.AppModuleSchema;
      },
    }
  );


  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_MODULE`)}</HeaderComponent>
      </div>
      <div className="modules-container">
        {modulesData?.map((module, index) => (
          <Card className={"module-card"}>
            <HeaderComponent className={"detail-header"}>{module.code}</HeaderComponent>
            <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
            <p>{module.description}</p>
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_SELECT")}
              onClick={() => {
                history.push(`/${window.contextPath}/employee/campaign/app-features?code=${module?.code}`)
              }}
            />
            {/* {module?.features.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                {module.features.map((feature, idx) => (
                  <div key={idx}>
                    <strong>{feature.code}</strong> - {feature.description}
                  </div>
                ))}
              </div>
            )} */}
          </Card>
        ))}
      </div>
    </>
  );
};

export default AppModule;
