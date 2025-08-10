import React, { useState , Fragment} from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader, Button } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";
import MapView from "./MapView";


const TaskComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [showMapview, setShowMapview] = useState({ showMaps: false });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const requestCriteria = {
    url: `${url}/task/v1/_search`,
    changeQueryName: `${props.projectId}-tasks-${page}-${pageSize}`,
    params: {
      tenantId: "mz",
      offset: page * pageSize,
      limit: pageSize,
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

  // DataTable expects columns with name, selector, and sortable properties
  const tableColumns = columns.map((c) => ({
    name: c.label,
    selector: (row) => row?.[c.key] ? row?.[c.key] : "NA",
    sortable: false,
  }));


  const isNextDisabled = Array.isArray(projectTask) ? projectTask.length < pageSize : true;

  
  if (isLoading) {
    return  <Loader page={true} variant={"PageLoader"}/>;
  }
  


  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("TASK")}</Header>
        <Button
          variation="secondary"
          label={showMapview?.showMaps ? t("VIEW_TABLE") : t("VIEW_MAP")}
          onClick={() => {
            const updated = { showMaps: !showMapview.showMaps };
            setShowMapview({ ...updated });
          }}
        />
      </div>
      {projectTask?.length === 0 && (
        <h1>{t("NO_TASK")}</h1>
      )}
      {projectTask?.length > 0 &&  (showMapview?.showMaps==true?<MapView visits={ projectTask?.map(task => ({
        lat: task?.latitude || 0,
        lng: task?.longitude || 0,
        time: task?.plannedStartDate || "NA"
      }))} />:(
        <DataTable
          columns={tableColumns}
          data={projectTask}
          pagination
          paginationServer
          paginationTotalRows={projectTask?.length || 0}
          paginationPerPage={pageSize}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          onChangePage={(newPage) => setPage(newPage - 1)}
          onChangeRowsPerPage={(newPerPage) => {
            setPageSize(newPerPage);
            setPage(0);
          }}
          customStyles={tableCustomStyle}
          progressPending={isLoading}
          progressComponent={<Loader />}
          noDataComponent={<h1>{t("NO_TASK")}</h1>}
        />
      )) }
    </div>
  );
};

export default TaskComponent;
