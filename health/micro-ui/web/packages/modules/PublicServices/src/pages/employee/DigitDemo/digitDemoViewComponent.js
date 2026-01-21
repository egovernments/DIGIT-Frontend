import { Header, Loader, ViewComposer, MultiLink } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { downloadStudioPDF, generateViewConfigFromResponse } from "../../../utils";
import WorkflowActions from "../../../components/WorkflowActions";
import ViewCheckListCards from "../CheckList/viewCheckListCards";
import { useWorkflowDetails, processBusinessServices } from "../../../utils";
import { useParams } from "react-router-dom";

// Helper function to get hierarchy config from service config's address fields
const getHierarchyConfigFromServiceConfig = (serviceConfig) => {
  if (!serviceConfig?.data?.fields) return null;

  const addressField = serviceConfig.data.fields.find(f => f.type === "address");
  if (!addressField || !addressField.properties) return null;

  const hierarchyField = addressField.properties.find(f => f.format === "hierarchyDropdown");
  if (!hierarchyField) return null;

  return {
    hierarchyType: hierarchyField.hierarchyType,
    highestHierarchy: hierarchyField.highestHierarchy,
    lowestHierarchy: hierarchyField.lowestHierarchy
  };
};

// Helper function to build path from root to target boundary code
const buildBoundaryPath = (nodes, targetCode, currentPath = []) => {
  if (!nodes || nodes.length === 0) return null;

  for (const node of nodes) {
    const newPath = [...currentPath, { code: node.code, boundaryType: node.boundaryType }];
    if (node.code === targetCode) {
      return newPath;
    }
    if (node.children && node.children.length > 0) {
      const result = buildBoundaryPath(node.children, targetCode, newPath);
      if (result) return result;
    }
  }
  return null;
};

// Helper function to resolve all boundary levels from highest to lowest
const resolveBoundaryHierarchy = (boundaryData, boundaryCode, hierarchyDef, highestLevel, lowestLevel) => {
  if (!boundaryData || !boundaryCode || !hierarchyDef) return null;

  const path = buildBoundaryPath(boundaryData, boundaryCode);
  if (!path) return null;

  const highestIndex = hierarchyDef.findIndex(item => item?.boundaryType === highestLevel);
  const lowestIndex = hierarchyDef.findIndex(item => item?.boundaryType === lowestLevel);

  if (highestIndex === -1 || lowestIndex === -1) return null;

  const displayLevels = hierarchyDef.slice(highestIndex, lowestIndex + 1);

  const result = {};
  for (const level of displayLevels) {
    const pathItem = path.find(p => p.boundaryType === level.boundaryType);
    if (pathItem) {
      result[level.boundaryType] = pathItem.code;
    }
  }

  return result;
};
const DigitDemoViewComponent = () => {
  const { t } = useTranslation();
  const queryStrings = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const userInfo = Digit.UserService.getUser();
  const { module, service } = useParams();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const [matchedBusinessServices, setMatchedBusinessServices] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const isMobile = window.Digit.Utils.browser.isMobile()

  // Direct API call to bypass caching issues
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);


  useEffect(() => {

    const fetchApplicationData = async () => {
      if (!queryStrings?.serviceCode || !queryStrings?.applicationNumber) {
        return;
      }

      setIsLoading(true);
      try {
        // Use native fetch with cache-busting
        const url = new URL(`${window.location.origin}/public-service/v1/application/${queryStrings?.serviceCode}`);
        url.searchParams.append('applicationNumber', queryStrings?.applicationNumber);
        url.searchParams.append('tenantId', tenantId);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "X-Tenant-Id": tenantId,
            "auth-token": window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
          cache: "no-store" // Force no caching
        });

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching application data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationData();
  }, [queryStrings?.applicationNumber, queryStrings?.serviceCode, queryStrings?.lastUpdatedTime, tenantId]);

  let response = data ? data?.Application?.[0] : {};
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  //To fetch the service config for the module and service
  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        filters:{
          module:module
        }
      },
    },
  };

  const { isLoading: ServiceConfigLoading, data: serviceConfigData } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const serviceConfig = serviceConfigData?.mdms?.find((item) =>
    item?.uniqueIdentifier.toLowerCase() === `${module}.${service}`.toLowerCase()
  );

  const hierarchyConfig = useMemo(() => {
    return getHierarchyConfigFromServiceConfig(serviceConfig);
  }, [serviceConfig]);

  const hierarchyType = response?.address?.hierarchyType || hierarchyConfig?.hierarchyType;

  const hierarchyDefReq = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `hierarchyDef_view_${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 10,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
    config: {
      enabled: !!hierarchyType && !!response?.address?.boundarycode,
      select: (data) => data?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [],
    },
  };

  const { isLoading: hierarchyDefLoading, data: hierarchyDef } = Digit.Hooks.useCustomAPIHook(hierarchyDefReq);

  // Fetch boundary relationships (actual boundary data with parent-child)
  const boundaryRelReq = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: `boundaryRel_view_${hierarchyType}`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchyType,
      includeChildren: true,
    },
    body: {},
    config: {
      enabled: !!hierarchyType && !!response?.address?.boundarycode,
      select: (data) => data?.TenantBoundary?.[0]?.boundary || [],
    },
  };

  const { isLoading: boundaryLoading, data: boundaryData } = Digit.Hooks.useCustomAPIHook(boundaryRelReq);

  // Resolve boundary hierarchy levels
  const resolvedBoundaryLevels = useMemo(() => {
    if (!boundaryData || !hierarchyDef || !response?.address?.boundarycode || !hierarchyConfig) {
      return null;
    }

    return resolveBoundaryHierarchy(
      boundaryData,
      response.address.boundarycode,
      hierarchyDef,
      hierarchyConfig.highestHierarchy,
      hierarchyConfig.lowestHierarchy
    );
  }, [boundaryData, hierarchyDef, response?.address?.boundarycode, hierarchyConfig]);

  //To fetch the workflow details for the application to handle parallel workflow
  let {data :workflowDetails, isLoading: workflowLoading} = useWorkflowDetails(
    {
      tenantId: tenantId,
      id: queryStrings?.applicationNumber,
      moduleCode: queryStrings?.businessService || serviceConfig?.data?.workflow?.businessService,
      //moduleCode: "NewTL",
      config: {
        enabled: response && serviceConfig ? true : false,
        cacheTime: 0
      }
    }
  );

  // Util method to generate view config for view composer
  let config = generateViewConfigFromResponse(response, t, queryStrings?.businessService || selectedBusinessService?.code, serviceConfig, resolvedBoundaryLevels);


useEffect(() => {
  // Guard clause to avoid calling with missing inputs
  if (!serviceConfig || !tenantId || !queryStrings?.applicationNumber || !workflowDetails) return;

  //To get the eligible business service for the current state of the application
  processBusinessServices(
    serviceConfig,
    tenantId,
    queryStrings?.applicationNumber,
    workflowDetails,
    userRoles,
    t
  ).then((matched) => {
    setMatchedBusinessServices(matched);
  });
}, [
  workflowDetails,
]);

// Auto select business service if there's only one match
useEffect(() => {
  if (matchedBusinessServices.length === 1 && !selectedBusinessService) {
    setSelectedBusinessService(matchedBusinessServices[0]);
  }
}, [matchedBusinessServices, selectedBusinessService]);

  // To get the checklist codes for the application
  let checklistObjects =  serviceConfig?.data?.checklist?.length > 0 && workflowDetails ? serviceConfig?.data?.checklist.filter((ob) => ob?.state === workflowDetails?.actionState?.state) : [];
  let checkListCodes = serviceConfig?.data?.checklist?.length > 0 && workflowDetails ? checklistObjects?.map((ob) => `${response?.businessService}.${workflowDetails?.processInstances?.[0].state?.state}.${ob?.name}`) : [];

  // Check if boundary data is still loading (only if hierarchy type exists)
  const isBoundaryLoading = hierarchyType && response?.address?.boundarycode && (hierarchyDefLoading || boundaryLoading);

  if (isLoading || workflowLoading || ServiceConfigLoading || isBoundaryLoading) {
    return <Loader />;
  }

  // Generate PDF download options
  const generateDownloadOptions = () => {
    return [{
      label: t("STUDIO_DOWNLOAD_PDF"),
      onClick: () => {
        setShowOptions(!showOptions);
        HandleDownloadPdf();
      }
    }];
  };

  const HandleDownloadPdf = () => {
      downloadStudioPDF('pdf/generatepdf',{applicationNumber:queryStrings?.applicationNumber,tenantId, serviceCode:queryStrings?.serviceCode},`Application-${queryStrings?.applicationNumber}.pdf`)
  }

  return (
    <React.Fragment>
      {
        <div className={"employee-application-details"} style={{ marginBottom: "24px",alignItems:"center" }}>
            <Header className="works-header-view" styles={{ marginLeft: "0px", paddingTop: "10px" }}>
              {t(`${response?.module.toUpperCase()}_${response?.businessService?.toUpperCase()}_APPLICATION_DETAILS`)}
            </Header>
            <MultiLink onHeadClick={() => setShowOptions(!showOptions)} className="multilink-block-wrapper divToBeHidden" label={t("CS_COMMON_DOWNLOAD")}  displayOptions={showOptions} options={generateDownloadOptions()}/>
        </div>
      }
      <ViewComposer data={config} isLoading={false} />
      <ViewCheckListCards applicationId={data?.Application?.[0]?.id} checkListCodes={checkListCodes} serviceConfigData={serviceConfigData}/>
        { <WorkflowActions
          forcedActionPrefix={`WF_${response?.businessService}_ACTION`}
          ActionBarStyle={isMobile ? {height:"4rem"} : {}}
          businessService={queryStrings?.businessService || selectedBusinessService?.code || matchedBusinessServices[0]?.code}
          applicationNo={response?.applicationNumber}
          tenantId={tenantId}
          applicationDetails={response}
          serviceConfig={serviceConfig}
          url={`/public-service/v1/application/${queryStrings?.serviceCode}`}
          isDisabled={!selectedBusinessService}
          moduleCode={response?.module}
          {...(matchedBusinessServices.length > 1 && {
            actionFields: [
              <Button
                t={t}
                type={"actionButton"}
                options={matchedBusinessServices}
                label={"Business Service"}
                variation={"primary"}
                optionsKey={"displayname"}
                isSearchable={false}
                onOptionSelect={(value) => setSelectedBusinessService(value)}
              />,
            ],
          })}
        />}
    </React.Fragment>
  );
};
export default DigitDemoViewComponent;