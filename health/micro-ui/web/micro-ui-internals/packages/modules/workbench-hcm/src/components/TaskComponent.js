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

  const pageSizeOptions = [
    { name: "10", code: 10 },
    { name: "20", code: 20 },
    { name: "50", code: 50 },
    { name: "100", code: 100 },
  ];

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
          <>
            <BoundariesMapWrapper
              visits={projectTask?.map(task => ({
                lat: task?.latitude || 0,
                lng: task?.longitude || 0,
                time: task?.plannedStartDate || "NA",
                quantity: task?.resourcesQuantity
              }))} 
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div className="typography caption-l">{t("PAGE")}: {page + 1}</div>
                <div className="page-size-select" style={{ position: "relative", display: "inline-block" }}>
                  <div
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      minWidth: "80px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px"
                    }}
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    <span>{pageSize}</span>
                    <span style={{ marginLeft: "8px" }}>▼</span>
                  </div>
                  {isSelectOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto"
                      }}
                    >
                      {pageSizeOptions.map((option) => (
                        <div
                          key={option.code}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "14px",
                            backgroundColor: pageSize === option.code ? "#f0f8ff" : "white",
                            color: pageSize === option.code ? "#0066cc" : "inherit"
                          }}
                          onClick={() => {
                            setPageSize(option.code);
                            setPage(0);
                            setIsSelectOpen(false);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = pageSize === option.code ? "#f0f8ff" : "#f5f5f5";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = pageSize === option.code ? "#f0f8ff" : "white";
                          }}
                        >
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variation="secondary"
                  label={t("PREVIOUS")}
                  isDisabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                />
                <Button
                  variation="secondary"
                  label={t("NEXT")}
                  isDisabled={isNextDisabled}
                  onClick={() => setPage((p) => p + 1)}
                />
              </div>
            </div>
          </>
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
