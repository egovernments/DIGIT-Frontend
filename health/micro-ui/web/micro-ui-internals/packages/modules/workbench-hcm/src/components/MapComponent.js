import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import getProjectServiceUrl, { getKibanaDetails } from "../utils/getProjectServiceUrl";
import BoundariesMapWrapper from "./BoundariesMapWrapper";
import { createDeliveryPopup } from "./MapPointsPopup";

const MapComponent = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10000); // Large page size to fetch all data
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ progress: 0, batchesCompleted: 0, totalBatches: 0, dataReceived: 0 });
  const [projectName, setProjectName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);
  const componentRef = useRef(null);
  const workerRef = useRef(null);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [boundaryNameFilter, setBoundaryNameFilter] = useState("");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [availableBoundaries, setAvailableBoundaries] = useState([]);

  // Default sample data for testing and fallback - Nigerian locations
  const rawData = [
    "7.3722818,5.2476953,3,Adebayo Olatunji,6,Ita-Ogbolu,dist_user_01",
    "7.3719899,5.248334,2,Folasade Ogunleye,4,Ita-Ogbolu,dist_user_02",
    "7.3733355,5.2477185,3,Olumide Akinwale,7,Ita-Ogbolu,dist_user_03",
    "7.371291,5.2483847,2,Abiodun Adegoke,3,Ita-Ogbolu,dist_user_01",
    "7.3712591,5.2488249,3,Yetunde Ajayi,8,Ita-Ogbolu,dist_user_02",
    "7.3732285,5.2491957,3,Kehinde Fadeyi,5,Ita-Ogbolu,dist_user_03",
    "7.3724202,5.2491548,2,Samuel Omoregie,4,Ita-Ogbolu,dist_user_01",
    "7.3714463,5.24907,1,Modupe Alade,2,Ita-Ogbolu,dist_user_02"
  ];

  const defaultData = rawData.map((row, index) => {
    const [lat, lng, resourcesCount, createdBy, memberCount, administrativeArea, userId] = row.split(',');
    const baseDate = new Date();
    
    return {
      id: `task-${userId}-${index + 1}`,
      plannedStartDate: new Date(baseDate.getTime() - (index * 12 * 60 * 60 * 1000)).toISOString(), // Stagger by 12 hours
      resourcesQuantity: parseInt(resourcesCount) * 50, // Scale up resources
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      createdBy: createdBy,
      resourcesCount: parseInt(resourcesCount),
      locationAccuracy: parseInt(resourcesCount) >= 3 ? "High" : parseInt(resourcesCount) >= 2 ? "Medium" : "Low",
      productName: "ITN Nets",
      memberCount: parseInt(memberCount),
      administrativeArea: administrativeArea,
      quantity: parseInt(resourcesCount) * 50,
      userId: userId
    };
  });

  const [projectTask, setProjectTask] = useState(defaultData);
  const [filteredProjectTask, setFilteredProjectTask] = useState(defaultData);
  
  // Apply filters to project tasks
  useEffect(() => {
    let filtered = [...projectTask];
    
    // Filter by boundary name
    if (boundaryNameFilter) {
      filtered = filtered.filter(task => 
        task.administrativeArea && 
        task.administrativeArea.toLowerCase().includes(boundaryNameFilter.toLowerCase())
      );
    }
    
    // Filter by delivery date range
    if (deliveryDateFilter.startDate || deliveryDateFilter.endDate) {
      filtered = filtered.filter(task => {
        if (!task.plannedStartDate || task.plannedStartDate === "NA") return false;
        
        const taskDate = new Date(task.plannedStartDate);
        
        if (deliveryDateFilter.startDate) {
          const startDate = new Date(deliveryDateFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          if (taskDate < startDate) return false;
        }
        
        if (deliveryDateFilter.endDate) {
          const endDate = new Date(deliveryDateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (taskDate > endDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredProjectTask(filtered);
  }, [projectTask, boundaryNameFilter, deliveryDateFilter]);
  
  // Extract unique boundaries from tasks
  useEffect(() => {
    const boundaries = [...new Set(projectTask
      .map(task => task.administrativeArea)
      .filter(area => area && area !== "NA")
    )].sort();
    setAvailableBoundaries(boundaries);
  }, [projectTask]);

  // Intersection Observer for visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  // Initialize Web Worker
  useEffect(() => {
    // Import worker script
    const workerUrl = new URL('../workers/elasticsearchWorker.js', import.meta.url);
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
          // Retry authentication with Kibana config
          const kibanaConfig = {
            kibanaPath: getKibanaDetails('kibanaPath'),
            projectTaskIndex: getKibanaDetails('projectTaskIndex'),
            username: getKibanaDetails('username'),
            password: getKibanaDetails('password')
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
          setProjectTask(payload.data.length > 0 ? payload.data : defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          setLoadingProgress({ progress: 100, batchesCompleted: payload.batchesProcessed, totalBatches: payload.batchesProcessed, dataReceived: payload.data.length });
          console.log(`Data fetch completed: ${payload.data.length} records loaded`);
          break;
        case 'FETCH_ERROR':
          console.error('Elasticsearch fetch error:', error);
          setProjectTask(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        case 'ERROR':
        case 'WORKER_ERROR':
          console.error('Worker error:', error);
          setProjectTask(defaultData);
          setHasDataBeenFetched(true);
          setIsLoading(false);
          break;
        default:
          console.warn('Unknown worker message type:', type);
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      setProjectTask(defaultData);
      setHasDataBeenFetched(true);
      setIsLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // First get project details to extract project name
  const projectUrl = getProjectServiceUrl();
  const projectRequestCriteria = {
    url: `${projectUrl}/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId,
      offset: 0,
      limit: 100,
    },
    body: {
      Projects: [
        {
          tenantId,
          id: props.projectId,
        },
      ],
      apiOperation: "SEARCH",
    },
    config: {
      enabled: props.projectId ? true : false,
    },
  };

  const { data: project } = Digit.Hooks.useCustomAPIHook(projectRequestCriteria);

  // Fetch data using web worker when component is visible
  const fetchDataWithWorker = useCallback((projectName) => {
    if (!projectName || !isVisible || hasDataBeenFetched) return;
    
    // Prepare Kibana configuration
    const username = getKibanaDetails('BasicUsername');
    const password = getKibanaDetails('BasicPassword');
    const auth = btoa(`${username}:${password}`);
    const API_TOKEN = getKibanaDetails('token');
    const AUTH_KEY = getKibanaDetails('sendBasicAuthHeader') ? `Basic ${auth}` : `ApiKey ${API_TOKEN}`;
    
    const kibanaConfig = {
      kibanaPath: getKibanaDetails('kibanaPath'),
      projectTaskIndex: getKibanaDetails('projectTaskIndex'),
      username: getKibanaDetails('username'),
      password: getKibanaDetails('password')
    };
    
    // First authenticate if needed
    if (!isAuthenticated) {
      workerRef.current?.postMessage({
        type: 'AUTHENTICATE_KIBANA',
        payload: { 
          origin: window.location.origin,
          kibanaConfig
        }
      });
      
      // Wait a bit for authentication, then proceed
      setTimeout(() => {
        workerRef.current?.postMessage({
          type: 'FETCH_ELASTICSEARCH_DATA',
          payload: {
            projectName,
            page,
            pageSize,
            origin: window.location.origin,
            batchSize: 1000, // Process in smaller batches
            kibanaConfig,
            authKey: AUTH_KEY
          }
        });
      }, 1000);
    } else {
      // Directly fetch data if already authenticated
      workerRef.current?.postMessage({
        type: 'FETCH_ELASTICSEARCH_DATA',
        payload: {
          projectName,
          page,
          pageSize,
          origin: window.location.origin,
          batchSize: 1000, // Process in smaller batches
          kibanaConfig,
          authKey: AUTH_KEY
        }
      });
    }
  }, [isVisible, hasDataBeenFetched, isAuthenticated, page, pageSize]);

  // Extract project name from project data
  useEffect(() => {
    if (project?.Project?.[0]?.name) {
      setProjectName(project.Project[0]?.[getKibanaDetails('key')] || project.Project[0]?.name);
    }
  }, [project]);

  // Fetch elasticsearch data when component becomes visible and project name is available
  useEffect(() => {
    if (projectName && isVisible && !hasDataBeenFetched) {
      fetchDataWithWorker(projectName);
    }
  }, [projectName, isVisible, fetchDataWithWorker, hasDataBeenFetched]);

  const isNextDisabled = Array.isArray(filteredProjectTask) ? filteredProjectTask.length < pageSize : true;
  
  // Filter handlers
  const handleBoundaryFilterChange = (event) => {
    setBoundaryNameFilter(event.target.value);
  };
  
  const handleDateFilterChange = (field, value) => {
    setDeliveryDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearFilters = () => {
    setBoundaryNameFilter("");
    setDeliveryDateFilter({
      startDate: "",
      endDate: ""
    });
  };

  // Dark green marker style for MapComponent - no inner circle, smaller, darker
  const greenMarkerStyle = {
    fill: '#15803D',        // Green-700 - darker green
    stroke: '#FFFFFF',      // White border
    innerFill: null,        // No inner circle
    size: 18                // Even smaller for dense data
  };

  // Enhanced popup content function using common MapPointsPopup component
  const getMapPopupContent = (dataPoint, index) => {
    return createDeliveryPopup(dataPoint, index);
  };


  return (
    <div ref={componentRef} className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("MAP_VIEW")}</Header>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Button
            variation={showFilters ? "secondary" : "primary"}
            label={showFilters ? t("HIDE_FILTERS") : t("SHOW_FILTERS")}
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          />
                
          {filteredProjectTask?.length !== projectTask?.length && (
            <span style={{ 
              fontSize: "0.85rem", 
              color: "#666",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px"
            }}>
              {filteredProjectTask?.length} of {projectTask?.length} points
            </span>
          )}
        </div>
      </div>
      
      {/* Filter Section */}
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
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "16px",
            alignItems: "end"
          }}>
            {/* Boundary Name Filter */}
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("BOUNDARY_NAME")}
              </label>
              <select
                value={boundaryNameFilter}
                onChange={handleBoundaryFilterChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              >
                <option value="">{t("ALL_BOUNDARIES")}</option>
                {availableBoundaries.map(boundary => (
                  <option key={boundary} value={boundary}>
                    {boundary}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Start Date Filter */}
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("DELIVERY_START_DATE")}
              </label>
              <input
                type="date"
                value={deliveryDateFilter.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            {/* End Date Filter */}
            <div>
              <label style={{ 
                display: "block",
                marginBottom: "8px", 
                color: "#555",
                fontSize: "14px"
              }}>
                {t("DELIVERY_END_DATE")}
              </label>
              <input
                type="date"
                value={deliveryDateFilter.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                min={deliveryDateFilter.startDate}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
            
            {/* Clear Button */}
            <div>
              <Button 
                variation="secondary"
                label={t("CLEAR_FILTERS")}
                onClick={clearFilters}
                isDisabled={!boundaryNameFilter && !deliveryDateFilter.startDate && !deliveryDateFilter.endDate}
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              />
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(boundaryNameFilter || deliveryDateFilter.startDate || deliveryDateFilter.endDate) && (
            <div style={{ 
              marginTop: "12px", 
              padding: "8px",
              backgroundColor: "#e3f2fd",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#1976d2"
            }}>
              <strong>{t("ACTIVE_FILTERS")}:</strong>
              {boundaryNameFilter && (
                <span style={{ marginLeft: "8px" }}>
                  Boundary: {boundaryNameFilter}
                </span>
              )}
              {deliveryDateFilter.startDate && (
                <span style={{ marginLeft: "8px" }}>
                  From: {new Date(deliveryDateFilter.startDate).toLocaleDateString()}
                </span>
              )}
              {deliveryDateFilter.endDate && (
                <span style={{ marginLeft: "8px" }}>
                  To: {new Date(deliveryDateFilter.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Loading Progress Indicator */}
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
              Loading map data in background...
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
                <span>Batch {loadingProgress.batchesCompleted}/{loadingProgress.totalBatches}</span>
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
      
      {/* Visibility Status Indicator (for debugging) */}
      {!isVisible && !hasDataBeenFetched && (
        <div style={{
          padding: "12px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "6px",
          marginBottom: "12px",
          fontSize: "14px",
          color: "#856404"
        }}>
          ⏳ Map data will load when this component becomes visible
        </div>
      )}
      {filteredProjectTask?.length === 0 && (
        <h1>{t("NO_TASK")}</h1>
      )}
      {projectTask === defaultData && (
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
      {filteredProjectTask?.length > 0 && (
        <BoundariesMapWrapper
          visits={filteredProjectTask?.map(task => ({
            lat: task?.latitude || 0,
            lng: task?.longitude || 0,
            time: task?.plannedStartDate || "NA",
            quantity: task?.resourcesQuantity,
            id: task?.id,
            productName: task?.productName,
            memberCount: task?.memberCount,
            administrativeArea: task?.administrativeArea,
            createdBy: task?.createdBy,
            userId: task?.userId,
            resourcesCount: task?.resourcesCount,
            locationAccuracy: task?.locationAccuracy,
            resourcesQuantity: task?.resourcesQuantity
          }))}
          totalCount={filteredProjectTask?.length || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0);
          }}
          isNextDisabled={isNextDisabled}
          customPopupContent={getMapPopupContent}
          customMarkerStyle={greenMarkerStyle}
        />
      )}
    </div>
  );
};

export default MapComponent;