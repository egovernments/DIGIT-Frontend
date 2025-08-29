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
      if (isSelectOpen && !event.target.closest(".page-size-select")) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        moduleDetails: [
          {
            moduleName: "HCM-ADMIN-CONSOLE",
            masterDetails: [
              {
                name: "rolesForChecklist",
                filter: "[?(@.code)].code",
              },
            ],
          },
          {
            moduleName: "HCM",
            masterDetails: [
              {
                name: "CHECKLIST_TYPES",
                filter: "[?(@.type=='DEFAULT')].code",
              },
            ],
          },
        ],
      },
    },
  };
  const { data: roleData, isLoading: isRolesLoading, error: rolesError } = Digit.Hooks.useCustomAPIHook(reqRoles);

  // Generate service codes in name.type.role format based on roleData structure
  const serviceCodes = useMemo(() => {
    if (!roleData?.MdmsRes || !checklistCodesData?.mdms) {
      return [];
    }

    const codes = [];

    // Extract data from roleData structure: "HCM-ADMIN-CONSOLE" -> "rolesForChecklist" and "HCM" -> "CHECKLIST_TYPES"
    const rolesForChecklist = roleData?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.rolesForChecklist || [];
    const checklistTypes = roleData?.MdmsRes?.HCM?.CHECKLIST_TYPES || [];

    // Generate codes in name.type.role format
    checklistTypes.forEach((checklistType) => {
      rolesForChecklist.forEach((role) => {
        const checklistCode = checklistType?.code || checklistType;
        const roleCode = role?.code || role;

        if (campaignName && checklistCode && roleCode) {
          // Format: name.type.role
          const generatedCode = `${campaignName}.${checklistCode}.${roleCode}`;
          codes.push(generatedCode);
        }
      });
    });

    return codes;
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
      enabled: (() => {
        const hasServiceCodes = serviceCodes.length > 0;
        const hasCampaignName = !!campaignName;
        const hasRoleData = !!roleData?.MdmsRes;
        const hasChecklistData = !!checklistCodesData?.mdms?.length;

        const shouldFetch = hasServiceCodes && hasCampaignName && hasRoleData && hasChecklistData;

        return shouldFetch;
      })(),
    },
  };

  // Prepare request to fetch service definitions for cloning
  const { isLoading: isServiceDefsLoading, data: serviceDefinitionsData, error: serviceDefError } = Digit.Hooks.useCustomAPIHook(
    serviceDefinitionFetchReq
  );

  // Transform service definitions data for display
  const transformedData = useMemo(() => {
    if (!serviceDefinitionsData?.ServiceDefinitions) {
      console.log("⚠️ No service definitions to transform");
      return [];
    }

    const transformed = serviceDefinitionsData.ServiceDefinitions.map((serviceDef, index) => ({
      id: serviceDef.code || `service-${index}`,
      code: serviceDef.code || "NA",
      description: serviceDef.description || "NA",
      category: serviceDef?.code?.split?.(".")?.[1] || "NA",
      status: serviceDef.isActive ? "Active" : "Inactive",
      createdDate: serviceDef.auditDetails?.createdTime ? new Date(serviceDef.auditDetails.createdTime).toISOString() : "NA",
      createdBy: serviceDef.auditDetails?.createdBy || "NA",
      lastModified: serviceDef.auditDetails?.lastModifiedTime ? new Date(serviceDef.auditDetails.lastModifiedTime).toISOString() : "NA",
      lastModifiedBy: serviceDef.auditDetails?.lastModifiedBy || "NA",
    }));
    return transformed;
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
            color: "inherit",
          }}
          iconSize="14px"
          tooltipPosition="top"
        />
      );
    },
  };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("CHECKLIST")}</Header>
      </div>

      {transformedData?.length === 0 && !isLoading && (
        <div>
          <h1>{t("NO_CHECKLIST")}</h1>
          {serviceCodes.length > 0 && (
            <div style={{ padding: "16px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "6px", marginTop: "16px" }}>
              <p style={{ margin: 0, color: "#856404" }}>
                <strong>ℹ️ Generated {serviceCodes.length} service codes but no service definitions found.</strong>
                <br />
                Service codes: {serviceCodes.slice(0, 5).join(", ")}
                {serviceCodes.length > 5 ? "..." : ""}
              </p>
            </div>
          )}
        </div>
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
