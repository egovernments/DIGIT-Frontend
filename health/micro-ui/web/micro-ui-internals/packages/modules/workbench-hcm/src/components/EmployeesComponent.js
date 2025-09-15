import React,{ useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader, Button, Modal, ModalHeader, ModalBody } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { elasticsearchWorkerString } from "../workers/elasticsearchWorkerString";
import { projectStaffConfig } from "../configs/elasticsearchConfigs";
import MapComponent from "./MapComponent";

const EmployeesComponent = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10000);
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
  const [availableStates, setAvailableStates] = useState([]);
  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableProjectTypes, setAvailableProjectTypes] = useState([]);
  
  // Map popup state
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const defaultData = [
    {
      id: "task-dist_user_01-1",
      plannedStartDate: new Date().toISOString(),
      resourcesQuantity: 150,
      latitude: 7.3722818,
      longitude: 5.2476953,
      createdBy: "Adebayo Olatunji",
      resourcesCount: 3,
      locationAccuracy: "High",
      productName: "ITN Nets",
      memberCount: 6,
      administrativeArea: "Ita-Ogbolu",
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
    
    setFilteredEmployeeData(filtered);
  }, [employeeData, stateFilter, lgaFilter, roleFilter, projectTypeFilter, statusFilter]);
  
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
              role: item.role || "NA",
              projectType: item.projectType || "NA",
              localityCode: item.localityCode || "NA",
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


  const fetchDataWithWorker = useCallback((projectName) => {
    if (!projectName || hasDataBeenFetched) return;
    
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
            projectName: props?.projectId, // Use projectId instead of projectName for staff index
            page,
            pageSize,
            origin: window.location.origin,
            batchSize: 1000,
            kibanaConfig,
            authKey: AUTH_KEY
          }
        });
      }, 1000);
    } else {
      workerRef.current?.postMessage({
        type: 'FETCH_ELASTICSEARCH_DATA',
        payload: {
          projectName: props?.projectId, // Use projectId instead of projectName for staff index
          page,
          pageSize,
          origin: window.location.origin,
          batchSize: 1000,
          kibanaConfig,
          authKey: AUTH_KEY
        }
      });
    }
  }, [hasDataBeenFetched, isAuthenticated, page, pageSize, props.projectId]);

  useEffect(() => {
    // For staff index, we use projectId directly instead of projectName
    if (props.projectId && !hasDataBeenFetched) {
      fetchDataWithWorker(props.projectId);
    }
  }, [props.projectId, fetchDataWithWorker, hasDataBeenFetched]);

  const clearFilters = () => {
    setStateFilter("");
    setLgaFilter("");
    setRoleFilter("");
    setProjectTypeFilter("");
    setStatusFilter("");
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

  const columns = [
    { label: t("EMPLOYEE_ID"), key: "employeeId" },
    { label: t("EMPLOYEE_NAME"), key: "employeeName" },
    { label: t("USER_NAME"), key: "userName" },
    { label: t("ROLE"), key: "role" },
    { label: t("PROJECT_TYPE"), key: "projectType" },
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
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
            gap: "16px",
            alignItems: "end"
          }}>
            <div>
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
            </div>
            
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
                {t("PROJECT_TYPE")}
              </label>
              <select
                value={projectTypeFilter}
                onChange={(e) => setProjectTypeFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_PROJECT_TYPES")}</option>
                {availableProjectTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
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
              <Button 
                variation="secondary"
                label={t("CLEAR_FILTERS")}
                onClick={clearFilters}
                isDisabled={!stateFilter && !lgaFilter && !roleFilter && !projectTypeFilter && !statusFilter}
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
              Loading employee data...
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
                <span>{loadingProgress.dataReceived} records loaded</span>
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
              variation="outline-primary"
              size="small"
              onButtonClick={() => handleViewMap(row)}
              style={{ 
                padding: "4px 8px", 
                fontSize: "12px",
                minWidth: "auto"
              }}
            />
          )
        }}
      />
      
      {/* Map Popup Modal */}
      {showMapPopup && selectedEmployee && (
        <Modal>
          <ModalHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h2 style={{ margin: 0 }}>
                {t("MAP_VIEW")} - {selectedEmployee.employeeName}
              </h2>
              <Button
                label={t("CLOSE")}
                variation="secondary"
                onButtonClick={handleCloseMapPopup}
                style={{ marginLeft: 'auto' }}
              />
            </div>
          </ModalHeader>
          <ModalBody>
            <div style={{ 
              padding: "1rem",
              minHeight: "500px",
              maxHeight: "80vh",
              overflow: "auto"
            }}>
              <div style={{ 
                marginBottom: "1rem", 
                padding: "1rem", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "8px",
                border: "1px solid #dee2e6"
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
                  <div><strong>{t("ROLE")}:</strong> {selectedEmployee.role}</div>
                  <div><strong>{t("PROJECT_TYPE")}:</strong> {selectedEmployee.projectType}</div>
                  <div><strong>{t("STATE")}:</strong> {selectedEmployee.state}</div>
                  <div><strong>{t("LGA")}:</strong> {selectedEmployee.lga}</div>
                  <div><strong>{t("WARD")}:</strong> {selectedEmployee.ward}</div>
                  <div><strong>{t("HEALTH_FACILITY")}:</strong> {selectedEmployee.healthFacility}</div>
                  <div><strong>{t("STATUS")}:</strong> {selectedEmployee.status}</div>
                </div>
              </div>
              
              <MapComponent projectId={props.projectId} userName={selectedEmployee.userName} />
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesComponent;