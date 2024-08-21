import { Header, Loader } from "@egovernments/digit-ui-components";
import React, { Fragment } from "react";
import ModuleCard from "../../../components/ModuleCard";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ApplicationHome = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const { t } = useTranslation();
  const { isLoading: moduleMasterLoading, data: moduleMasterData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "sandbox-ui",
    [{ name: "ModuleMasterConfig" }],
    {
      select: (data) => {
        return data?.["sandbox-ui"]?.ModuleMasterConfig;
      },
      enabled: true,
    }
  );

  if (moduleMasterLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header className="sandbox-header">Application Home</Header>
      <div className="sandbox-module-container">
        {moduleMasterData?.map((item) => (
          <ModuleCard
            className="sandbox-module-card"
            label={item?.module}
            buttonLabel={t(`SANDBOX_VIEW`)}
            onButtonClick={() => history.push(`/${window?.contextPath}/employee/sandbox/application-management/module?module=${item?.module}`)}
          />
        ))}
      </div>
    </>
  );
};

export default ApplicationHome;
