import React, { useState , Fragment, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader, Button } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { useProjectHierarchy } from "../contexts/ProjectHierarchyContext";
// import MapView from "./MapView";
import UserDetails from "./UserDetails";
// import MapWithShapefile from "./MapWithShapefile";
import BoundariesMapWrapper from "./BoundariesMapWrapper";
import { createTaskPopup } from "./MapPointsPopup";

const TaskComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const [showMapview, setShowMapview] = useState({ showMaps: false });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(props?.userId?1000:100);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  
  // // Use the project hierarchy context (optional - for caching only)
  // const { 
  //   getFromCache, 
  //   addToCache
  // } = useProjectHierarchy();

  // Date filter state
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to get start and end of selected date
  const getDateRange = (dateString) => {
    if (!dateString) return {};
    
    const date = new Date(dateString);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      createdFrom: startOfDay.getTime(),
      createdTo: endOfDay.getTime()
    };
  };

  const requestCriteria = {
    url: `${url}/task/v1/_search`,
    changeQueryName: `${props.projectId}-tasks-${page}-${pageSize}-${selectedDate || 'all'}`,
    params: {
      tenantId: tenantId,
      offset: page * pageSize,
      limit: pageSize,
    },

    body: {
      Task: {
        projectId: [props.projectId],
        createdBy: props?.userId,
        ...getDateRange(selectedDate),
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
          // resourcesCount: task?.resources?.length || "NA",
          locationAccuracy: task?.address?.locationAccuracy || "NA",
        }));
      }
    },
  };

  const { isLoading, data: projectTask } = Digit.Hooks.useCustomAPIHook(requestCriteria);
  
  // Cache task data when loaded (optional)
  useEffect(() => {
    if (projectTask && projectTask.length > 0) {
      // Cache the task data for 5 minutes
      // addToCache(`tasks-${props.projectId}-${page}-${pageSize}`, projectTask, 300000);
    }
  }, [projectTask, props.projectId, page, pageSize, addToCache]);


  const columns = [
    { label: t("HCM_ADMIN_CONSOLE_TASKCODE"), key: "id" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_QUANTITY"), key: "resourcesQuantity" },
    { label: t("HCM_ADMIN_CONSOLE_DELIVERYDATE"), key: "plannedStartDate" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_status"), key: "status" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LAT"), key: "latitude" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LONG"), key: "longitude" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_LOCATION_ACCURACY"), key: "locationAccuracy" },
    { label: t("HCM_ADMIN_CONSOLE_RESOURCE_CREATED_BY"), key: "createdBy" },
  ];

  const isNextDisabled = Array.isArray(projectTask) ? projectTask.length < pageSize : true;

  // Date filter handlers
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setPage(0);
  };

  // Enhanced popup content function using common MapPointsPopup component
  const getTaskPopupContent = (task, index) => {
    return createTaskPopup(task, index);
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
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* <Button
            variation="outline"
            label={showFilters ? t("HIDE_FILTERS") : t("SHOW_FILTERS")}
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          /> */}
          <Button
            variation="secondary"
            label={showMapview?.showMaps ? t("VIEW_TABLE") : t("VIEW_MAP")}
            onClick={() => {
              const updated = { showMaps: !showMapview.showMaps };
              setShowMapview({ ...updated });
            }}
          />
        </div>
      </div>

      {/* Date Filter Section */}
      {showFilters && (
        <div style={{ 
          padding: "16px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px", 
          marginBottom: "16px",
          border: "1px solid #e0e0e0"
        }}>
          <h4 style={{ marginBottom: "12px", color: "#333" }}>{t("FILTER_BY_DATE")}</h4>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div style={{ minWidth: "250px" }}>
              <label style={{ marginBottom: "8px", color: "#555", display: "block" }}>
                {t("SELECT_DATE")}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "200px"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <Button 
                variation="secondary"
                label={t("CLEAR_FILTER")}
                onClick={clearDateFilter}
                isDisabled={!selectedDate}
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
              />
              {selectedDate && (
                <span style={{ color: "#666", fontSize: "14px", alignSelf: "center" }}>
                  {t("FILTERING_BY")}: {new Date(selectedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
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
