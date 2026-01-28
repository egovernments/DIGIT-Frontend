import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { InboxSearchComposer, LinkLabel, Loader } from "@egovernments/digit-ui-components";
import axios from "axios";
import { getParallelWorkflow } from "../../utils";

const CitizenInbox = () => {
  const { t } = useTranslation();
  const { module,modulecode } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [limit, setLimit] = useState(10);

  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Citizen inbox config
  const configs = useMemo(() => {
    const prefix = `${module?.toUpperCase()}`;
    
    return {
      headerLabel: `${prefix}_MY_APPLICATION`,
      type: "inbox",
      apiDetails: {
        serviceName: `/public-service/v1/application/${modulecode}`,
        requestParam: {},
        requestBody: {
          SearchCriteria: {
            tenantId: tenantId,
            module: module,
            limit: limit,
            offset: 0          
          },
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CitizenInboxConfig",
        tableFormJsonPath: "requestBody.SearchCriteria",
        filterFormJsonPath: "requestBody.SearchCriteria.custom",
        searchFormJsonPath: "requestBody.SearchCriteria.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: {},
            formClassName: "custom-digit--search-field-wrapper-classname",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 1,
            defaultValues: {},
            fields: [
              {
                inline: true,
                label: `${prefix}_APPLICATION_NUMBER`,
                isMandatory: false,
                type: "text",
                disable: false,
                populators: { name: "applicationNumber", error: "Error!" },
              },
              // {
              //   label: `${prefix}_BUSINESS_SERVICE`,
              //   isMandatory: true,
              //   key: "businessService",
              //   type: "dropdown",
              //   disable: false,
              //   preProcess: {
              //     updateDependent: ["populators.options"]
              //   },
              //   populators: {
              //     name: "businessService",
              //     optionsKey: "name",
              //     options: []
              //   }
              // },
            ],
          },
          label: "",
          show: false,
        },
        links: {
          uiConfig: {
            links: [],
            label: "",
          },
          children: {},
          show: true,
        },
        filter: {
          uiConfig: {
            type: "filter",
            headerStyle: null,
            primaryLabel: t(`${prefix}_FILTER`),
            secondaryLabel: "",
            minReqFields: 1,
            defaultValues: {
              state: "",
              ward: [],
              locality: [],
            },
            fields: [
              {
                label: `${prefix}_COMMON_WARD`,
                type: "locationdropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "ward",
                  type: "ward",
                  optionsKey: "i18nKey",
                  allowMultiSelect: true
                }
              },
              {
                label: `${prefix}_COMMON_WORKFLOW_STATES`,
                type: "workflowstatesfilter",
                labelClassName: "checkbox-status-filter-label",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "state",
                  labelPrefix: `${prefix}_`,
                  businessService: "NEWTL",
                },
              },
            ],
          },
          label: `ES_COMMON_FILTERS`,
          show: false,
        },
        searchResult: {
          uiConfig: {
            columns: [
              {
                label: "STUDIO_APPLICATION_NUMBER",
                jsonPath: "applicationNumber",
                additionalCustomization: true,
              },
              {
                label: "STUDIO_DATE",
                jsonPath: "auditDetails.createdTime",
                additionalCustomization: true,
              },
              {
                label: "STUDIO_STATUS",
                jsonPath: "workflowStatus",
                additionalCustomization: true,
              },
            ],
            tableProps: {
              tableClassName: "custom-classname-resultsdatatable"
            },
            actionProps: {
              actions: [
                {
                  label: "View",
                  variation: "secondary",
                  icon: "Eye",
                },
                {
                  label: "Download",
                  variation: "primary",
                  icon: "Download",
                },
              ],
            },
            enableColumnSort: true,
            resultsJsonPath: "Application",
            defaultSortAsc: true,
          },
          children: {},
          show: true,
        },
      },
    };
  }, [module, tenantId, t, limit]);

  // Fetch all the services configured for the tenant
  useEffect(() => {
    const fetchBusinessServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/public-service-init/v1/service", {
          params: { tenantId: tenantId },
          headers: {
            "X-Tenant-Id": tenantId,
            "auth-token": window?.localStorage?.getItem("token"),
          },
        });

        const services = response?.data?.Services || [];
        setServicesData(services);
      } catch (error) {
        console.error("Error fetching business services:", error);
        setServicesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessServices();
  }, [tenantId]);

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // To fetch the service configurations of the services
  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        filters: {
          module: module,
        }
      },
    },
  };

  const { isLoading: moduleListLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Preprocess and inject dynamic values into config
  const updatedConfig = useMemo(() => {
    return Digit.Utils.preProcessMDMSConfigInboxSearch(
      t,
      configs,
      "sections.search.uiConfig.fields",
      {
        updateDependent: [
          {
            key: "businessService",
            value: servicesData.filter((ob) => ob?.module?.toLowerCase() === module?.toLowerCase()).map((ob) => ({
              code: ob?.businessService,
              name: ob?.businessService,
              parallelWorkflow: getParallelWorkflow(module, ob?.businessService, data?.mdms),
              workflowBusinessService: data?.mdms?.filter((mdms) => mdms?.uniqueIdentifier?.toLowerCase() === `${module}.${ob?.businessService}`.toLowerCase())?.[0]?.data?.workflow?.businessService,
            })),
          },
        ],
      }
    );
  }, [t, configs, servicesData, data]);

  const ViewMore = () => {
    setLimit(limit + 2);
  }

  if (isLoading || moduleListLoading) return <Loader />;

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig} />
        <div style={{ display: "flex", justifyContent: "center" }}>
        <LinkLabel onClick={() => ViewMore()}>
          {t("STUDIO_VIEW_MORE")}
        </LinkLabel>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CitizenInbox; 