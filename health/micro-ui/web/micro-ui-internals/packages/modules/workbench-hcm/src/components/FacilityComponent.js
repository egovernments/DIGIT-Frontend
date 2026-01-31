import React from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import {  Loader} from "@egovernments/digit-ui-components";


const FacilityComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const requestCriteria = {
    url: `${url}/facility/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: "mz",
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
      tenantId: "mz",
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

  if (isLoading) {
    return  <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("FACILITY")}</Header>
      {updatedProjectFacility?.length === 0 ? (
        <h1>{t("NO_FACILITY")}</h1>
      ) : (
        <table className="table reports-table sub-work-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {updatedProjectFacility?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key] || "NA"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FacilityComponent;
