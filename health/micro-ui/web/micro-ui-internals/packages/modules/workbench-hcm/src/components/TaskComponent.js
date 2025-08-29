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

  // Enhanced popup content function for task markers with professional UX
  const getTaskPopupContent = (task, index) => {
    // Debug logging to understand the data structure    
    const taskNumber = index + 1;
    
    // Get basic information with robust fallbacks
    const taskId = task.id || "N/A";
    const status = task.status || "UNKNOWN";
    const resourceQuantity = task.resourcesQuantity || task.quantity || 0;
    
    // Format time properly
    let deliveryTime = "N/A";
    if (task.time && task.time !== "NA") {
      try {
        deliveryTime = new Date(task.time).toLocaleDateString() + ' ' + new Date(task.time).toLocaleTimeString();
      } catch (e) {
        deliveryTime = new Date(task.time).toLocaleDateString();
      }
    }
    
    // Get coordinates
    const lat = task.lat || task.latitude || 0;
    const lng = task.lng || task.longitude || 0;
    const coords = `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
    
    // Determine status styling and info
    const getStatusInfo = (status) => {
      switch (status.toUpperCase()) {
        case 'COMPLETED':
        case 'ADMINISTRATION_SUCCESS':
          return { color: "#10b981", text: "COMPLETED", icon: "✅", bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" };
        case 'IN_PROGRESS':
        case 'INPROGRESS':
          return { color: "#f59e0b", text: "IN PROGRESS", icon: "🔄", bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" };
        case 'PENDING':
          return { color: "#ef4444", text: "PENDING", icon: "⏳", bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" };
        case 'FAILED':
        case 'ADMINISTRATION_FAILED':
          return { color: "#dc2626", text: "FAILED", icon: "❌", bgGradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" };
        default:
          return { color: "#6b7280", text: status.toUpperCase(), icon: "❓", bgGradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" };
      }
    };
    
    const statusInfo = getStatusInfo(status);
    const isCompleted = status.toUpperCase().includes('SUCCESS') || status.toUpperCase() === 'COMPLETED';
    
    // Build enhanced popup HTML
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; max-width: 400px;">
        
        <!-- Header -->
        <div style="background: ${statusInfo.bgGradient}; color: white; padding: 18px; margin: -9px -9px 18px -9px; border-radius: 8px 8px 0 0; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${statusInfo.icon}</span>
                Task #${taskNumber}
              </h3>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; font-family: monospace; letter-spacing: 0.5px;">
                ID: ${taskId}
              </p>
            </div>
            <div style="background: rgba(255,255,255,0.25); padding: 8px 14px; border-radius: 25px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; text-align: center;">
              ${statusInfo.text}
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 0 14px;">
          
          <!-- Resource Stats -->
          ${resourceQuantity > 0 ? `
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 10px; padding: 18px; margin-bottom: 18px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">📊 Resource Summary</h4>
              <div style="text-align: center;">
                <div style="font-size: 32px; font-weight: 900; color: #7c3aed; margin-bottom: 8px; line-height: 1;">
                  ${resourceQuantity.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                  Total Quantity
                </div>
              </div>
            </div>
          ` : `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 18px; text-align: center;">
              <div style="color: #dc2626; font-weight: 600; font-size: 14px;">
                ⚠️ No resource information available
              </div>
            </div>
          `}

          <!-- Task Information -->
          <div style="margin-bottom: 18px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 3px solid ${statusInfo.color}; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              📋 Task Details
            </h4>
            <div style="background: #fefefe; border: 1px solid #f3f4f6; border-radius: 8px; padding: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
                <span style="font-weight: 600; color: #6b7280; font-size: 13px;">Task ID:</span>
                <span style="color: #374151; font-weight: 600; font-family: monospace; font-size: 12px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${taskId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
                <span style="font-weight: 600; color: #6b7280; font-size: 13px;">Status:</span>
                <span style="color: ${statusInfo.color}; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 4px;">
                  ${statusInfo.icon} ${statusInfo.text}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
                <span style="font-weight: 600; color: #6b7280; font-size: 13px;">Resource Quantity:</span>
                <span style="color: #374151; font-weight: 600; font-size: 13px;">${resourceQuantity} total</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="font-weight: 600; color: #6b7280; font-size: 13px;">Planned Date:</span>
                <span style="color: #374151; font-weight: 500; font-size: 12px;">${deliveryTime}</span>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 3px solid #7c3aed; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              📍 Location Details
            </h4>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px;">
              <div style="font-size: 13px; color: #6b46c1; font-weight: 600; margin-bottom: 6px;">
                📍 Coordinates:
              </div>
              <div style="font-size: 13px; color: #4b5563; font-family: monospace; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb;">
                ${coords}
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 10px 16px; margin: 14px -9px -9px -9px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
            <span style="display: flex; align-items: center; gap: 4px;">
              📅 ${new Date().toLocaleDateString()}
            </span>
            <span style="font-weight: 600; background: ${statusInfo.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">
              Point #${taskNumber}
            </span>
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
