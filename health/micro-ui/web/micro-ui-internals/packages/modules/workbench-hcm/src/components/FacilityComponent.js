import React from "react";
import { useTranslation } from "react-i18next";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";


const FacilityComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  const requestCriteria = {
    url: `${url}/facility/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },

    body: {
      ProjectFacility: {
        projectId: [props.projectId],
      },
    },
    config: {
      enabled: props.projectId ? true : false,
    },
  };

  const { isLoading, data: projectFacility } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const facilityRequestCriteria = {
    url: "/facility/v1/_search",
    changeQueryName: projectFacility?.ProjectFacilities?.[0]?.facilityId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    body: {
      Facility: {
        id: projectFacility?.ProjectFacilities?.map((mapping) => mapping?.facilityId),
      },
    },
    config: {
      enabled: projectFacility?.ProjectFacilities?.[0]?.facilityId ? true : false,
    },
  };

  const { isLoadingFacilty, data: Facility } = Digit.Hooks.useCustomAPIHook(facilityRequestCriteria);

  const updatedProjectFacility = projectFacility?.ProjectFacilities.map((row) => {
    const facilityData = Facility?.Facilities?.find((facility) => facility.id === row.facilityId);
    return {
      ...row,
      storageCapacity: facilityData?.storageCapacity || "NA",
      name: facilityData?.name || "NA",
      usage: facilityData?.usage || "NA",
      address: facilityData?.address || "NA",
    };
  });

  const columns = [
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_CODE"), key: "facilityId" },
    { label: t("PROJECT_FACILITY_ID"), key: "id" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_CAPACITY"), key: "storageCapacity" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_NAME"), key: "name" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_TYPE"), key: "usage" },
  ];

  return (
    <ReusableTableWrapper
      title="FACILITY"
      data={updatedProjectFacility || []}
      columns={columns}
      isLoading={isLoading}
      noDataMessage="NO_FACILITY"
    />
  );
};

export default FacilityComponent;
