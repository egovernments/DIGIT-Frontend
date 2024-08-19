import React from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import { moduleMasterConfig } from "./config/moduleMasterConfig";

const ModuleMasterTable = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const module = searchParams.get("module");
  const config = moduleMasterConfig(module);

  const onClickRow = ({ original: row }) => {
    const value = row?.code;
    history.push(
      `/${window.contextPath}/employee/workbench/mdms-search-v2?moduleName=${value?.split(".")?.[0]}&masterName=${value?.split(".")?.[1]}`
    );
  };
  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(config?.moduleMasterConfig?.[0]?.label || "N/A")}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config?.moduleMasterConfig?.[0]}
          additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}
        ></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default ModuleMasterTable;
