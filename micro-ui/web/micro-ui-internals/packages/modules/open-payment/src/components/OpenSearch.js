import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { OpenSearchConfig } from "../configs/OpenSearchConfig";

const OpenSearch = () => {
  const { t } = useTranslation();
  const queryParams = Digit.Hooks.useQueryParams();

  //An effect to update configs 
  useEffect(() => {
    if (!queryParams.tenantId) {
      // Update configs
      OpenSearchConfig.minParametersForSearchForm += 1;
      OpenSearchConfig.sections.search.uiConfig.minReqFields += 1;
      OpenSearchConfig.sections.search.uiConfig.defaultValues = {
        ...OpenSearchConfig.sections.search.uiConfig.defaultValues,
        tenantId: ""
      };
      OpenSearchConfig.sections.search.uiConfig.fields = [
        ...OpenSearchConfig.sections.search.uiConfig.fields,
        {
          label: "SELECT_TENANT",
          type: "dropdown",
          isMandatory: false,
          disable: false,
          populators: {
            name: "tenantId",
            optionsKey: "name",
            optionsCustomStyle: { top: "2.3rem" },
            mdmsConfig: {
              masterName: "tenants",
              moduleName: "tenant",
              localePrefix: "TENANT",
            },
          },
        },
      ];
    }

    if (!queryParams.businessService) {
      // Update configs
      OpenSearchConfig.minParametersForSearchForm += 1;
      OpenSearchConfig.sections.search.uiConfig.minReqFields += 1;
      OpenSearchConfig.sections.search.uiConfig.defaultValues = {
        ...OpenSearchConfig.sections.search.uiConfig.defaultValues,
        businessService: ""
      };
      OpenSearchConfig.sections.search.uiConfig.fields = [
        ...OpenSearchConfig.sections.search.uiConfig.fields,
        {
          label: "SELECT_BS",
          type: "dropdown",
          isMandatory: false,
          disable: false,
          populators: {
            name: "businessService",
            optionsKey: "name",
            optionsCustomStyle: { top: "2.3rem" },
            mdmsConfig: {
              masterName: "BusinessService",
              moduleName: "BillingService",
              localePrefix: "BUSINESS_SERV",
            },
          },
        },
      ];
    }
  }, []); 

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(OpenSearchConfig?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={{ ...OpenSearchConfig, additionalDetails: { queryParams } }}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default OpenSearch;
