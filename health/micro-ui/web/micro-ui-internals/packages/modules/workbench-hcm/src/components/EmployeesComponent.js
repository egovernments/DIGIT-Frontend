import React,{ useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader, Modal, Card, Close, CloseSvg } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { elasticsearchWorkerString } from "../workers/elasticsearchWorkerString";
import { projectStaffConfig } from "../configs/elasticsearchConfigs";
import MapComponentWrapper from "./MapComponentWrapper";
import { Button } from "@egovernments/digit-ui-components";

// Function to convert boundary type to camelCase
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

const EmployeesComponent = ({ projectId, boundaryType = "state", boundaryCode = "OD_01_ONDO", ...props }) => {
  console.log("EmployeesComponent props:",  props ,boundaryType,boundaryCode  );
  
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4000); // Maximum 4000 records
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ progress: 0, batchesCompleted: 0, totalBatches: 0, dataReceived: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const workerRef = useRef(null);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  
  const [showFilters, setShowFilters] = useState(false);
  const [stateFilter, setStateFilter] = useState("");
  const [lgaFilter, setLgaFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [boundaryFilter, setBoundaryFilter] = useState("");
  const [availableStates, setAvailableStates] = useState([]);
  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableProjectTypes, setAvailableProjectTypes] = useState([]);
  const [availableBoundaries, setAvailableBoundaries] = useState([]);
  
  // Map popup state
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const defaultData = [
    {
      id: "task-dist_user_01-1",
      plannedStartDate: new Date().toISOString(),
      resourcesQuantity: 150,
      latitude: 7.0896,  // Akure, Ondo State capital
      longitude: 5.1211,
      createdBy: "Adebayo Olatunji",
      resourcesCount: 3,
      locationAccuracy: "High",
      productName: "ITN Nets",
      memberCount: 6,
      administrativeArea: "Akure",
      quantity: 150,
      userId: "dist_user_01"
    }
  ];

  const [employeeData, setEmployeeData] = useState(defaultData);
  const [filteredEmployeeData, setFilteredEmployeeData] = useState(defaultData);
  
  useEffect(() => {
    let filtered = [...employeeData];
    
    if (stateFilter) {
      filtered = filtered.filter(emp => 
        emp.state && 
        emp.state.toLowerCase().includes(stateFilter.toLowerCase())
      );
    }
    
    if (lgaFilter) {
      filtered = filtered.filter(emp => 
        emp.lga && 
        emp.lga.toLowerCase().includes(lgaFilter.toLowerCase())
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(emp => 
        emp.role && 
        emp.role === roleFilter
      );
    }
    
    if (projectTypeFilter) {
      filtered = filtered.filter(emp => 
        emp.projectType && 
        emp.projectType === projectTypeFilter
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(emp => 
        emp.status === statusFilter
      );
    }
    
    if (nameFilter) {
      filtered = filtered.filter(emp => 
        (emp.employeeName && 
         emp.employeeName.toLowerCase().includes(nameFilter.toLowerCase())) ||
        (emp.userName && 
         emp.userName.toLowerCase().includes(nameFilter.toLowerCase()))
      );
    }
    
    if (boundaryFilter) {
      filtered = filtered.filter(emp => 
        (emp.ward && emp.ward.toLowerCase().includes(boundaryFilter.toLowerCase())) ||
        (emp.lga && emp.lga.toLowerCase().includes(boundaryFilter.toLowerCase())) ||
        (emp.state && emp.state.toLowerCase().includes(boundaryFilter.toLowerCase())) ||
        (emp.healthFacility && emp.healthFacility.toLowerCase().includes(boundaryFilter.toLowerCase())) ||
        (emp.localityCode && emp.localityCode.toLowerCase().includes(boundaryFilter.toLowerCase()))
      );
    }
    
    setFilteredEmployeeData(filtered);
  }, [employeeData, stateFilter, lgaFilter, roleFilter, projectTypeFilter, statusFilter, nameFilter, boundaryFilter]);
  
  useEffect(() => {
    const states = [...new Set(employeeData
      .map(emp => emp.state)
      .filter(state => state && state !== "NA")
    )].sort();
    setAvailableStates(states);
    
    const lgas = [...new Set(employeeData
      .map(emp => emp.lga)
      .filter(lga => lga && lga !== "NA")
    )].sort();
    setAvailableLGAs(lgas);
    
    const roles = [...new Set(employeeData
      .map(emp => emp.role)
      .filter(role => role && role !== "NA")
    )].sort();
    setAvailableRoles(roles);
    
    const projectTypes = [...new Set(employeeData
      .map(emp => emp.projectType)
      .filter(type => type && type !== "NA")
    )].sort();
    setAvailableProjectTypes(projectTypes);
    
    // Extract unique boundary values (ward, lga, state, health facility, locality)
    const boundaries = [...new Set([
      ...employeeData.map(emp => emp.ward).filter(val => val && val !== "NA"),
      ...employeeData.map(emp => emp.lga).filter(val => val && val !== "NA"),
      ...employeeData.map(emp => emp.state).filter(val => val && val !== "NA"),
      ...employeeData.map(emp => emp.healthFacility).filter(val => val && val !== "NA"),
      ...employeeData.map(emp => emp.localityCode).filter(val => val && val !== "NA")
    ])].sort();
    setAvailableBoundaries(boundaries);
  }, [employeeData]);

  useEffect(() => {
    const blob = new Blob([elasticsearchWorkerString], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (e) => {
      const { type, payload, error } = e.data;
      
      switch (type) {
        case 'AUTHENTICATION_START':
          console.log('Authenticating with Kibana...');
          break;
        case 'AUTHENTICATION_SUCCESS':
          setIsAuthenticated(true);
          console.log('Kibana authentication successful');
          break;
        case 'AUTHENTICATION_ERROR':
          console.error('Kibana authentication failed:', error);
          setIsAuthenticated(false);
          break;
        case 'AUTHENTICATION_REQUIRED':
          setIsAuthenticated(false);
          const kibanaConfig = {
            kibanaPath: getKibanaDetails('kibanaPath'),
            projectTaskIndex: projectStaffConfig.index,
            username: getKibanaDetails('username'),
            password: getKibanaDetails('password'),
            ...projectStaffConfig
          };
          workerRef.current?.postMessage({
            type: 'AUTHENTICATE_KIBANA',
            payload: { 
              origin: window.location.origin,
              kibanaConfig
            }
          });
          break;
        case 'FETCH_START':
          setIsLoading(true);
          setLoadingProgress({ progress: 0, batchesCompleted: 0, totalBatches: 0, dataReceived: 0 });
          break;
        case 'FETCH_PROGRESS':
          setLoadingProgress(payload);
          console.log(`Progress: ${payload.progress.toFixed(1)}% - ${payload.dataReceived} records loaded`);
          break;
        case 'FETCH_SUCCESS':
          const processedData = payload.data.map((item, index) => {
            // Handle Data prefix - the worker automatically maps fields using fieldMappings
            return {
              ...item,
              employeeId: item.employeeId || item.id || `EMP-${index + 1}`,
              employeeName: item.employeeName || item.nameOfUser || "NA",
              userName: item.userName || "NA",
              userId: item.userId || "NA",
              role:  (item?.role&&t(item.role))|| "NA",
              projectType: item.projectType || "NA",
              localityCode: (item?.localityCode&&t(item.localityCode)) || "NA",
              status: (item.status !== undefined ? item.status : item.isDeleted) === false ? "ACTIVE" : "INACTIVE",
              country: item.country || item.boundaryHierarchy?.country || "NA",
              state: item.state || item.boundaryHierarchy?.state || "NA",
              lga: item.lga || item.boundaryHierarchy?.lga || "NA",
              ward: item.ward || item.boundaryHierarchy?.ward || "NA",
              healthFacility: item.healthFacility || item.boundaryHierarchy?.healthFacility || "NA",
              createdTime: item.createdTime ? (typeof item.createdTime === 'number' ? Digit.DateUtils.ConvertEpochToDate(item.createdTime) : item.createdTime) : "NA",
              createdBy: item.createdBy || "NA"
            };
          });
          setEmployeeData(processedData.length > 0 ? processedData : defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          setLoadingProgress({ progress: 100, batchesCompleted: payload.batchesProcessed, totalBatches: payload.batchesProcessed, dataReceived: payload.data.length });
          console.log(`Data fetch completed: ${payload.data.length} records loaded`);
          break;
        case 'FETCH_ERROR':
          console.error('Elasticsearch fetch error:', error);
          setEmployeeData(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        case 'ERROR':
        case 'WORKER_ERROR':
          console.error('Worker error:', error);
          setEmployeeData(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        default:
          console.warn('Unknown worker message type:', type);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      setEmployeeData(defaultData);
      setHasDataBeenFetched(true);
      setIsLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);


  const fetchDataWithWorker = useCallback(() => {
    if (hasDataBeenFetched) return;
    
    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;
    
    // Use the dynamic configuration for project staff
    const kibanaConfig = {
      kibanaPath: getKibanaDetails('kibanaPath'),
      projectTaskIndex: projectStaffConfig.index,
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password'),
      ...projectStaffConfig
    };

    // Build query parameters - boundary-based filtering with flat structure
    // Use toCamelCase to properly sanitize boundary type
    const sanitizedBoundaryType = toCamelCase(boundaryType);
    const boundaryField = `boundaryHierarchyCode.${sanitizedBoundaryType}`;
    const queryParams = {};
    queryParams[boundaryField] = boundaryCode;
    
    if (!isAuthenticated) {
      workerRef.current?.postMessage({
        type: 'AUTHENTICATE_KIBANA',
        payload: { 
          origin: window.location.origin,
          kibanaConfig
        }
      });
      
      setTimeout(() => {
        workerRef.current?.postMessage({
          type: 'FETCH_ELASTICSEARCH_DATA',
          payload: {
            boundaryType,
            boundaryCode,
            queryParams,
            page,
            pageSize,
            origin: window.location.origin,
            batchSize: 500, // Batch size of 500
            kibanaConfig,
            authKey: AUTH_KEY
          }
        });
      }, 1000);
    } else {
      workerRef.current?.postMessage({
        type: 'FETCH_ELASTICSEARCH_DATA',
        payload: {
          boundaryType,
          boundaryCode,
          queryParams,
          page,
          pageSize,
          origin: window.location.origin,
          batchSize: 500, // Batch size of 500
          kibanaConfig,
          authKey: AUTH_KEY
        }
      });
    }
  }, [hasDataBeenFetched, isAuthenticated, page, pageSize, boundaryType, boundaryCode]);

  useEffect(() => {
    // Use boundary-based filtering for staff data
    if (!hasDataBeenFetched) {
      fetchDataWithWorker();
    }
  }, [fetchDataWithWorker, hasDataBeenFetched]);

  const clearFilters = () => {
    setStateFilter("");
    setLgaFilter("");
    setRoleFilter("");
    setProjectTypeFilter("");
    setStatusFilter("");
    setNameFilter("");
    setBoundaryFilter("");
  };

  // Handler for opening map popup
  const handleViewMap = (employee) => {
    setSelectedEmployee(employee);
    setShowMapPopup(true);
  };

  // Handler for closing map popup
  const handleCloseMapPopup = () => {
    setShowMapPopup(false);
    setSelectedEmployee(null);
  };

  // Helper components for Modal (following ProjectStaffModal pattern)
  const CloseBtn = (props) => {
    return (
      <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
        {props?.isMobileView ? (
          <CloseSvg />
        ) : (
          <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
            <Close />
          </div>
        )}
      </div>
    );
  };

  const Heading = (props) => {
    return <h1 className="heading-m">{props.heading}</h1>;
  };

  const columns = [
    { label: t("EMPLOYEE_ID"), key: "employeeId" },
    { label: t("EMPLOYEE_NAME"), key: "employeeName" },
    { label: t("USER_NAME"), key: "userName" },
    { label: t("ROLE"), key: "role" },
    // { label: t("PROJECT_TYPE"), key: "projectType" },
    // { label: t("STATE"), key: "state" },
    // { label: t("LGA"), key: "lga" },
    // { label: t("WARD"), key: "ward" },
    // { label: t("HEALTH_FACILITY"), key: "healthFacility" },
    { label: t("LOCALITY_CODE"), key: "localityCode" },
    { label: t("CREATED_TIME"), key: "createdTime" },
    { label: t("STATUS"), key: "status" },
    { label: t("VIEW_MAP"), key: "viewMap" },
  ];

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("EMPLOYEES")}</Header>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Button
            variation={showFilters ? "secondary" : "primary"}
            label={showFilters ? t("HIDE_FILTERS") : t("SHOW_FILTERS")}
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          />
          
          {filteredEmployeeData?.length !== employeeData?.length && (
            <span style={{ 
              fontSize: "0.85rem", 
              color: "#666",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px"
            }}>
              {filteredEmployeeData?.length} of {employeeData?.length} employees
            </span>
          )}
          
          {hasDataBeenFetched && employeeData?.length >= 4000 && (
            <span style={{ 
              fontSize: "0.75rem", 
              color: "#ff6b35",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#fff3e0",
              borderRadius: "4px",
              border: "1px solid #ffcc80"
            }}>
              Max limit reached (4000)
            </span>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div style={{ 
          padding: "16px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "8px", 
          marginBottom: "16px",
          border: "1px solid #e0e0e0"
        }}>
          <h4 style={{ marginBottom: "12px", color: "#333" }}>{t("FILTER_OPTIONS")}</h4>
          
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) auto",
            gap: "16px",
            alignItems: "end"
          }}>
            {/* <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("STATE")}
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_STATES")}</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div> */}
            
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("LGA")}
              </label>
              <select
                value={lgaFilter}
                onChange={(e) => setLgaFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_LGAS")}</option>
                {availableLGAs.map(lga => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("ROLE")}
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_ROLES")}</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
   
            
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("STATUS")}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_STATUS")}</option>
                <option value="ACTIVE">{t("ACTIVE")}</option>
                <option value="INACTIVE">{t("INACTIVE")}</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("NAME")}
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder={t("SEARCH_BY_NAME")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              />
            </div>
            
  
            
            <div>
              <Button 
                variation="secondary"
                label={t("CLEAR_FILTERS")}
                onClick={clearFilters}
                isDisabled={!stateFilter && !lgaFilter && !roleFilter && !projectTypeFilter && !statusFilter && !nameFilter && !boundaryFilter}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              />
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div style={{
          padding: "16px",
          backgroundColor: "#f0f8ff",
          border: "1px solid #d1ecf1",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "20px",
              height: "20px",
              border: "2px solid #e3f2fd",
              borderTop: "2px solid #2196f3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <span style={{ fontWeight: "600", color: "#1976d2" }}>
              Loading employee data (max 4000 records)...
            </span>
          </div>
          
          {loadingProgress.progress > 0 && (
            <div>
              <div style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "8px"
              }}>
                <div style={{
                  height: "100%",
                  backgroundColor: "#2196f3",
                  width: `${loadingProgress.progress}%`,
                  transition: "width 0.3s ease",
                  borderRadius: "4px"
                }}></div>
              </div>
              <div style={{ fontSize: "12px", color: "#666", display: "flex", justifyContent: "space-between" }}>
                <span>{loadingProgress.progress.toFixed(1)}% complete</span>
                <span>{loadingProgress.dataReceived} of max 4000 records (batch size: 500)</span>
              </div>
            </div>
          )}
          
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      
      {showToast && (
        <Toast 
          label={showToast.label} 
          type={showToast?.isError ? "error" : "success"}  
          onClose={() => setShowToast(null)} 
        />
      )}
      
      {employeeData === defaultData && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#f0f8ff", 
          border: "1px solid #d1ecf1", 
          borderRadius: "4px", 
          marginBottom: "10px",
          fontSize: "14px",
          color: "#0c5460"
        }}>
          <strong>Note:</strong> Showing sample data. Real data will be loaded once project is configured.
        </div>
      )}
      
      <ReusableTableWrapper
        data={filteredEmployeeData || []}
        columns={columns}
        isLoading={isLoading}
        noDataMessage="NO_EMPLOYEES_FOUND"
        customCellRenderer={{
          status: (row) => (
            <span style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: row.status === "ACTIVE" ? "#d4edda" : "#f8d7da",
              color: row.status === "ACTIVE" ? "#155724" : "#721c24"
            }}>
              {row.status}
            </span>
          ),
          deliveryCount: (row) => (
            <span style={{
              fontWeight: row.deliveryCount >= 3 ? "bold" : "normal",
              color: row.deliveryCount >= 3 ? "#28a745" : row.deliveryCount >= 2 ? "#ffc107" : "#dc3545"
            }}>
              {row.deliveryCount}
            </span>
          ),
          viewMap: (row) => (
            <Button
              label={t("VIEW_MAP")}
              type="button"
              variation="primary"
              size="small"
              onClick={() => handleViewMap(row)}
              style={{ 
                padding: "4px 8px", 
                fontSize: "12px",
                minWidth: "auto"
              }}
            />
          )
        }}
      />
      
      {/* Map Popup Modal - Following ProjectStaffModal pattern */}
      {showMapPopup && selectedEmployee && (
        <Modal
          className="employee-map-modal"
          popupStyles={{ maxWidth: "90%", width: "90%", height: "85vh" }}
          formId="modal-action"
          headerBarMain={<Heading t={t} heading={`${t("MAP_VIEW")} - ${selectedEmployee.employeeName}`} />}
          headerBarEnd={<CloseBtn onClick={handleCloseMapPopup} />}
          actionSaveLabel={null}
          actionCancelLabel={t("CORE_COMMON_CLOSE")}
          actionCancelOnSubmit={handleCloseMapPopup}
          hideSubmit={true}
        >
          <Card style={{ boxShadow: "none", height: "100%" }}>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 2rem)",
              overflow: "visible"
            }}>
              <div style={{ 
                marginBottom: "1rem", 
                padding: "1rem", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                flexShrink: 0
              }}>
                <h4 style={{ marginBottom: "0.5rem", color: "#495057" }}>
                  {t("EMPLOYEE_DETAILS")}
                </h4>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: "0.5rem",
                  fontSize: "14px"
                }}>
                  <div><strong>{t("NAME")}:</strong> {selectedEmployee.employeeName}</div>
                  <div><strong>{t("USER_NAME")}:</strong> {selectedEmployee.userName}</div>
                  <div><strong>{t("ROLE")}:</strong> {t(selectedEmployee.role)}</div>
                  <div><strong>{t("PROJECT_TYPE")}:</strong> {selectedEmployee.projectType}</div>
                  <div><strong>{t("STATUS")}:</strong> {selectedEmployee.status}</div>
                </div>
              </div>
              
              <div style={{ flex: 1, overflow: "visible", position: "relative", minHeight: "400px" }}>
                <MapComponentWrapper 
                  projectId={projectId} 
                  userName={selectedEmployee.userName}
                  key={`map-${selectedEmployee.employeeId}`}
                  hideHeader={true}
                  boundaryType={boundaryType}
                  boundaryCode={boundaryCode}
                />
              </div>
            </div>
          </Card>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesComponent;