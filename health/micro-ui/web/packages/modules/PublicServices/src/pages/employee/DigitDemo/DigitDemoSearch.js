import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSearchGenericConfig } from "../../../configs/searchGenericConfig";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { useParams } from "react-router-dom";

const DigitDemoSearch = () => {
  const { t } = useTranslation();
  const { module } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //To fetch the dynamic search config
  const configs = useSearchGenericConfig(setIsLoading); 

  // Fetch service data from API when component mounts or tenantId changes
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get("/public-service-init/v1/service", {
          params: { tenantId : tenantId },
          headers: {
            "X-Tenant-Id": tenantId,
            "auth-token" : window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [tenantId]);

  // Preprocess and inject dynamic values into config
  const updatedConfig = useMemo(() => {
    if (!configs || !data) return null;
    const services = data?.Services || [];

    // Filter services by module, same as inbox
    const filteredServices = services.filter((ob) => ob?.module?.toLowerCase() === module?.toLowerCase());

    const processedConfig = Digit.Utils.preProcessMDMSConfigInboxSearch(
      t,
      configs,
      "sections.search.uiConfig.fields",
      {
        updateDependent: [
          {
            key: "businessService",
            value: filteredServices.map((s) => ({
              code: s.businessService,
              name: s.businessService,
              serviceCode: s.serviceCode,
            })),
          },
        ],
      }
    );

    // Set the first business service as the default selection
    if (filteredServices.length > 0) {
      processedConfig.sections.search.uiConfig.defaultValues.businessService = {
        code: filteredServices[0].businessService,
        name: filteredServices[0].businessService,
        serviceCode: filteredServices[0].serviceCode,
      };
    }

    return processedConfig;
  }, [t, configs, data, module]
  );

  if (!updatedConfig || isLoading) {
    return <Loader />;
  }

  return (
    <div className="digit-inbox-search-wrapper">
      <InboxSearchComposer configs={updatedConfig} />     
    </div>
  );
};

export default DigitDemoSearch;
