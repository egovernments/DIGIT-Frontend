import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InboxConfig } from "../../../configs/inboxGenericConfig";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getParallelWorkflow } from "../../../utils";

const InboxService = () => {
  const { t } = useTranslation();
  const { module } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryStrings = Digit.Hooks.useQueryParams();
  const urlService = queryStrings?.service; // Get service from URL params if available

  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter services for the current module
  const filteredServices = useMemo(() => {
    return servicesData.filter((ob) => ob?.module?.toLowerCase() === module?.toLowerCase());
  }, [servicesData, module]);

  // To fetch the generic inbox config for inboxSearchComposer
  const configs = useMemo(() => ({
    ...InboxConfig(t, filteredServices),
    additionalDetails: { module }
  }), [t, module, filteredServices]);

  //fetch all the services configured for the tenant
  useEffect(() => {
    const fetchBusinessServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/public-service-init/v1/service", {
          params: { tenantId: tenantId },
          headers: {
            "X-Tenant-Id": tenantId,
            "auth-token" : window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
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

  //To fetch the service configurations of the services
  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        filters:{
          module: module,
        }
      },
    },
  };

  const { isLoading: moduleListLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Preprocess and inject dynamic values into config
  const updatedConfig = useMemo(() => {
    if (!data?.mdms) return configs;

    // Build business service options
    const businessServiceOptions = servicesData
      .filter((ob) => ob?.module?.toLowerCase() === module?.toLowerCase())
      .map((ob) => ({
        code: ob?.businessService,
        name: ob?.businessService,
        serviceCode: ob?.serviceCode,
        parallelWorkflow: getParallelWorkflow(module, ob?.businessService, data?.mdms),
        workflowBusinessService: data?.mdms?.filter(
          (mdms) => mdms?.uniqueIdentifier?.toLowerCase() === `${module}.${ob?.businessService}`.toLowerCase()
        )?.[0]?.data?.workflow?.businessService,
      }));

    // Get default business service - from URL param or first in list
    const defaultBusinessService = urlService
      ? businessServiceOptions.find((bs) => bs.code?.toLowerCase() === urlService?.toLowerCase())
      : businessServiceOptions[0];

    const processedConfig = Digit.Utils.preProcessMDMSConfigInboxSearch(
      t,
      configs,
      "sections.search.uiConfig.fields",
      {
        updateDependent: [
          {
            key: "businessService",
            value: businessServiceOptions,
          },
        ],
      }
    );

    // Set the default value for businessService in the config
    if (defaultBusinessService && processedConfig?.sections?.search?.uiConfig?.defaultValues) {
      processedConfig.sections.search.uiConfig.defaultValues.businessService = defaultBusinessService;
    }

    return processedConfig;
  }, [t, configs, servicesData, module, data?.mdms, urlService]);

  if (isLoading || moduleListLoading) return <Loader />;

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig} />
      </div>
    </React.Fragment>
  );
};

export default InboxService;
