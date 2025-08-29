import React, { useState, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader, Button } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";
const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";
const ChecklistComponent = (props) => {
  
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSelectOpen && !event.target.closest('.page-size-select')) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectOpen]);
  // Use projectName from props
  const campaignName = props.projectName;

  // Fetch checklist codes from MDMS
  const checklistCodesRequest = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: `HCM.CHECKLIST_TYPES`,
        isActive: true,
      },
    },
    config: {
      enabled: !!tenantId,
    },
  };

  const { data: checklistCodesData, isLoading: isChecklistCodesLoading } = Digit.Hooks.useCustomAPIHook(checklistCodesRequest);

  // Fetch roles from MDMS
  const reqRoles = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v1/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.ChecklistTemplates`,
        isActive: true,
      },
    },
  };

  const { data: roleData, isLoading: isRolesLoading, error: rolesError } = Digit.Hooks.useCustomAPIHook(reqRoles);

  // Generate service codes based on campaign, checklist, and role data
  const serviceCodes = useMemo(() => {
    return checklistCodesData?.mdms?.flatMap(checklist =>
      roleData?.mdms?.map(role => `${campaignName}.${checklist?.data?.code}.${role?.data?.code}`)
    ).filter(Boolean) || [];
  }, [checklistCodesData, roleData, campaignName]);

  // Fetch service definitions based on generated service codes
  const serviceDefinitionFetchReq = {
    url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_search`,
    body: {
      ServiceDefinitionCriteria: {
        tenantId,
        code: serviceCodes,
      },
      includeDeleted: true,
    },
    config: {
      enabled: !!serviceCodes.length && !!campaignName && !!checklistCodesData?.mdms?.length && !!roleData?.mdms?.length,
    },
  };

  // Prepare request to fetch service definitions for cloning
  const { isLoading: isServiceDefsLoading, data: serviceDefinitionsData } = Digit.Hooks.useCustomAPIHook(serviceDefinitionFetchReq);

  // Transform service definitions data for display
  const transformedData = useMemo(() => {
    if (!serviceDefinitionsData?.ServiceDefinitions) return [];
    
    return serviceDefinitionsData.ServiceDefinitions.map((serviceDef, index) => ({
      id: serviceDef.code || `service-${index}`,
      code: serviceDef.code || "NA",
      description: serviceDef.description || "NA",
      category: serviceDef?.code?.split?.(".")?.[1] || "NA",
      status: serviceDef.isActive ? "Active" : "Inactive",
      createdDate: serviceDef.auditDetails?.createdTime ? new Date(serviceDef.auditDetails.createdTime).toISOString() : "NA",
      createdBy: serviceDef.auditDetails?.createdBy || "NA",
      lastModified: serviceDef.auditDetails?.lastModifiedTime ? new Date(serviceDef.auditDetails.lastModifiedTime).toISOString() : "NA",
      latitude: "NA", // Service definitions don't have location data
      longitude: "NA",
      locationAccuracy: "NA",
    }));
  }, [serviceDefinitionsData]);

  const isLoading = isChecklistCodesLoading || isRolesLoading || isServiceDefsLoading;


  const columns = [
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_CODE"), key: "code" },
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_CATEGORY"), key: "category" },
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_STATUS"), key: "status" },
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_CREATED_DATE"), key: "createdDate" },
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_CREATED_BY"), key: "createdBy" },
    { label: t("HCM_ADMIN_CONSOLE_SERVICE_LAST_MODIFIED"), key: "lastModified" },
  ];

  // Custom cell renderer for the createdBy column
  const customCellRenderer = {
    createdBy: (row) => {
      const userId = row.createdBy;
      if (!userId || userId === "NA") {
        return "NA";
      }
      return (
        <UserDetails 
          uuid={userId}
          style={{ 
            fontSize: "inherit",
            color: "inherit"
          }}
          iconSize="14px"
          tooltipPosition="top"
        />
      );
    },
  };


  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("CHECKLIST")}</Header>

      </div>
      {transformedData?.length === 0 && (
        <h1>{t("NO_CHECKLIST")}</h1>
      )}
      {transformedData?.length > 0 && (
        
          <ReusableTableWrapper
            data={transformedData}
            columns={columns}
            isLoading={false}
            noDataMessage="NO_CHECKLIST"
            pagination={true}
            paginationServer={true}
            paginationTotalRows={transformedData?.length || 0}
            paginationPerPage={pageSize}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            onChangePage={(newPage) => setPage(newPage - 1)}
            onChangeRowsPerPage={(newPerPage) => {
              setPageSize(newPerPage);
              setPage(0);
            }}
            className=""
            headerClassName=""
            customCellRenderer={customCellRenderer}
          />
        
      )}
    </div>
  );
};

export default ChecklistComponent;
