import { Card, HeaderComponent, Button ,Toggle} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState , useEffect } from "react";
import { useHistory ,useLocation } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
const AppFeatures = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const initialCode = searchParams.get("code");
  const [code, setCode] = useState(initialCode);

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }


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

  const selectedModule = modulesData?.find((module) => module.code === code);
  const selectedFeatures = selectedModule?.features || [];

  // Prepare toggle options from all modules
  const toggleOptions = modulesData?.map((module) => ({
    code: module.code,
    name: t(module.code), // or just module.code if you don't want translation
  })) || [];


  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_FEATURE_FOR_APP`)}</HeaderComponent>
        <Toggle
          name="toggleOptions"
          numberOfToggleItems={toggleOptions.length}
          onChange={function noRefCheck() {}}
          onSelect={(d) =>{
            updateUrlParams({ code: d });
            setCode(d);
          }}
          options={toggleOptions}
          optionsKey="code"
          selectedOption={code}
          type="toggle"
        />
      </div>
      <div className="modules-container">
        {selectedFeatures?.map((module, index) => (
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
                history.push(`/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=SimplifiedAppConfigOne&fieldType=AppFieldType&prefix=APPONE&localeModule=APPONE`)
              }}
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default AppFeatures;
