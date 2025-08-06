import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import {  Loader} from "@egovernments/digit-ui-components";
import MapView from "./MapView";


const TaskComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [showMapview, setShowMapview] = useState({showMaps: false});
  const requestCriteria = {
    url: `${url}/task/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: "mz",
      offset: 0,
      limit: 10,
    },

    body: {
      Task: {
        projectId: [props.projectId],
        createdBy: props?.userId,
      },
    },
    config: {
      enabled: props.projectId ? true : false,
      select :(data)=>{
        return data?.Tasks?.map((task) => ({
          ...task,
          plannedStartDate: task.clientAuditDetails?.createdTime ? new Date(task.clientAuditDetails?.createdTime)?.toISOString() : "NA",
          resourcesQuantity: task?.resources?.reduce((acc,curr)=>curr?.quantity+acc,0) || "NA",
          latitude: task?.address?.latitude || "NA",
          longitude: task?.address?.longitude || "NA",
          createdBy: task?.clientAuditDetails?.createdBy || "NA",
          resourcesCount: task?.resources?.length || "NA",
          locationAccuracy: task?.address?.locationAccuracy || "NA",
        }));
      }
    },
  };

  const { isLoading, data: projectTask } = Digit.Hooks.useCustomAPIHook(requestCriteria);


  const columns = [
    { label: t("HCM_ADMIN_CONSOLE_TASKCODE"), key: "id" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_COUNT"), key: "resourcesCount" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_QUANTITY"), key: "resourcesQuantity" },
    { label: t("HCM_ADMIN_CONSOLE_DELIVERYDATE"), key: "plannedStartDate" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_status"), key: "status" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LAT"), key: "latitude" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LONG"), key: "longitude" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LOCATION_ACCURACY"), key: "locationAccuracy" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_CREATED_BY"), key: "createdBy" },

  ];

  if (isLoading) {
    return  <Loader page={true} variant={"PageLoader"}/>;
  }
  

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <Header className="works-header-view">{t("TASK")}</Header> <button className="primary-button" onClick={() => {
        const updated={showMaps:!showMapview.showMaps};
        setShowMapview({...updated})}}>{showMapview?.showMaps ? t("VIEW_TABLE") : t("VIEW_MAP")}</button>
      {projectTask?.length === 0 && (
        <h1>{t("NO_TASK")}</h1>
      )}
      {projectTask?.length > 0 &&  (showMapview?.showMaps==true?<MapView visits={ projectTask?.map(task => ({
        lat: task?.latitude || 0,
        lng: task?.longitude || 0,
        time: task?.plannedStartDate || "NA"
      }))} />:<table className="table reports-table sub-work-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectTask?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column.key] || "NA"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> )}
    </div>
  );
};

export default TaskComponent;
