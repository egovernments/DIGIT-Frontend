import React, { useState , Fragment} from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader, Button } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
// import MapView from "./MapView";
import UserDetails from "./UserDetails";
// import MapWithShapefile from "./MapWithShapefile";
import BoundariesMapWrapper from "./BoundariesMapWrapper";

const TaskComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [showMapview, setShowMapview] = useState({ showMaps: false });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(props?.userId?1000:100);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  const requestCriteria = {
    url: `${url}/task/v1/_search`,
    changeQueryName: `${props.projectId}-tasks-${page}-${pageSize}`,
    params: {
      tenantId: tenantId,
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

  const isNextDisabled = Array.isArray(projectTask) ? projectTask.length < pageSize : true;

  // Custom popup content function for map markers
  const getTaskPopupContent = (task, index) => {
    const taskNumber = index + 1;
    const time = task.time !== "NA" ? new Date(task.time).toLocaleDateString() : "N/A";
    const taskId = task.id || "N/A";
    const status = task.status || "N/A";
    const resourceCount = task.resourcesCount || "N/A";
    const resourceQuantity = task.resourcesQuantity || "N/A";
    
    return `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #2563eb; font-size: 14px;">
          <b>Task ${taskNumber}</b>
        </h4>
        <div style="font-size: 12px; line-height: 1.4;">
          <div style="margin-bottom: 4px;">
            <b>Task ID:</b> ${taskId}
          </div>
          <div style="margin-bottom: 4px;">
            <b>Status:</b> <span style="color: ${status === 'COMPLETED' ? '#16a34a' : status === 'IN_PROGRESS' ? '#ca8a04' : '#6b7280'};">${status}</span>
          </div>
          <div style="margin-bottom: 4px;">
            <b>Resources:</b> ${resourceCount} items (${resourceQuantity} total)
          </div>
          <div style="margin-bottom: 4px;">
            <b>Planned Date:</b> ${time}
          </div>
          <div style="margin-bottom: 4px;">
            <b>Location:</b> ${task.lat?.toFixed(6) || 'N/A'}, ${task.lng?.toFixed(6) || 'N/A'}
          </div>
        </div>
      </div>
    `;
  };

  // Custom cell renderer for the createdBy column
  const customCellRenderer = {
    createdBy: (row) => {
      const userId = row?.createdBy;
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
      {projectTask?.length > 0 && (
        showMapview?.showMaps ? (
          <BoundariesMapWrapper
            visits={projectTask?.map(task => ({
              lat: task?.latitude || 0,
              lng: task?.longitude || 0,
              time: task?.plannedStartDate || "NA",
              quantity: task?.resourcesQuantity,
              id: task?.id,
              status: task?.status,
              resourcesCount: task?.resourcesCount,
              resourcesQuantity: task?.resourcesQuantity
            }))} 
            totalCount={projectTask?.length || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(0);
            }}
            isNextDisabled={isNextDisabled}
            showConnectingLines={props?.userId ? true : false}
            customPopupContent={getTaskPopupContent}
          />
        ) : (
          <ReusableTableWrapper
            data={projectTask}
            columns={columns}
            isLoading={false}
            noDataMessage="NO_TASK"
            pagination={true}
            paginationServer={true}
            paginationTotalRows={projectTask?.length || 0}
            paginationPerPage={pageSize}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            onChangePage={(newPage) => setPage(newPage - 1)}
            onChangeRowsPerPage={(newPerPage) => {
              setPageSize(newPerPage);
              setPage(0);
            }}
            className=""
                        customCellRenderer={customCellRenderer}
            headerClassName=""
          />
        )
      )}
    </div>
  );
};

export default TaskComponent;
