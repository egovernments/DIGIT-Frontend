import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@digit-ui/digit-ui-react-components";
import searchConfig from "../../config/searchConfig";

const SearchAttendance = () => {
  const { t } = useTranslation();

  // const configs = searchConfig();
  const configModuleName = Digit.Utils.getConfigModuleName();
  const tenant = Digit.ULBService.getStateId();

  const { isLoading, data } = Digit.Hooks.useCustomMDMS(tenant, configModuleName, [
    {
      name: "SearchAttendanceWMSConfig",
    },
  ]);

  const configs = data?.[configModuleName].SearchAttendanceWMSConfig?.[0];

  const updatedConfig = useMemo(() => Digit.Utils.preProcessMDMSConfigInboxSearch(t, configs, "sections.search.uiConfig.fields", {
    updateDependent : [
      {
        key : "startDate",
        value : [new Date().toISOString().split("T")[0]]
      },
      {
        key : "endDate",
        value : [new Date().toISOString().split("T")[0]]
      }
    ]
  }), [
    configs,
    data,
  ]);

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(updatedConfig?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default SearchAttendance;