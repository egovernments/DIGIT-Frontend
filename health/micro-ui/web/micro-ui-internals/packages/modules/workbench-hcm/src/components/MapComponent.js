import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
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
    // Create worker inline using Blob to avoid import.meta.url issues
    const workerScript = `
      // Web Worker for Elasticsearch data fetching
      const API_KEY = "VVRaZjE1Z0J0UjN1MDZQak9jNC06V25NZUEybWxUOTZ4QzM5dnItNDJsdw==";

      // Worker message handler
      self.onmessage = async function(e) {
        const { type, payload } = e.data;

        try {
          switch (type) {
            case 'AUTHENTICATE_KIBANA':
              await authenticateKibana(payload);
              break;
            case 'FETCH_ELASTICSEARCH_DATA':
              await fetchElasticsearchData(payload);
              break;
            default:
              postMessage({
                type: 'ERROR',
                error: 'Unknown message type: ' + type
              });
          }
        } catch (error) {
          postMessage({
            type: 'ERROR',
            error: error.message,
            stack: error.stack
          });
        }
      };

      // Authenticate with Kibana
      async function authenticateKibana({ origin }) {
        try {
          postMessage({
            type: 'AUTHENTICATION_START'
          });

          const loginResponse = await fetch(origin + '/kibana/internal/security/login', {
            method: 'POST',
            headers: {
              'accept': '*/*',
              'accept-language': 'en-US,en;q=0.9',
              'cache-control': 'no-cache',
              'content-type': 'application/json',
              'kbn-build-number': '68312',
              'kbn-version': '8.11.3',
              'origin': origin,
              'pragma': 'no-cache',
              'priority': 'u=1, i',
              'referer': origin + '/digit-ui/employee/dss/dashboard/provincial-health-dashboard-llin?province=Cabo%20Delgado%20Bloco1&projectTypeId=dbd45c31-de9e-4e62-a9b6-abb818928fd1',
              'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
              'x-elastic-internal-origin': 'Kibana',
              'x-kbn-context': '{"type":"application","name":"security_login","url":"/kibana/login"}'
            },
            credentials: 'include',
            body: JSON.stringify({
              "providerType": "anonymous",
              "providerName": "anonymous1",
              "currentURL": origin + "kibana/login"
            })
          });

          if (loginResponse.ok) {
            postMessage({
              type: 'AUTHENTICATION_SUCCESS'
            });
          } else {
            throw new Error('Kibana authentication failed: ' + loginResponse.statusText);
          }
        } catch (error) {
          postMessage({
            type: 'AUTHENTICATION_ERROR',
            error: error.message
          });
        }
      }

      // Fetch data from Elasticsearch with progressive loading
      async function fetchElasticsearchData({ projectName, page, pageSize, origin, batchSize }) {
        batchSize = batchSize || 1000;
        
        try {
          postMessage({
            type: 'FETCH_START',
            payload: { projectName: projectName, page: page, pageSize: pageSize }
          });

          // Calculate batches for large requests
          const totalBatches = Math.ceil(pageSize / batchSize);
          let allData = [];
          let processedBatches = 0;

          for (let batch = 0; batch < totalBatches; batch++) {
            const batchOffset = page * pageSize + (batch * batchSize);
            const currentBatchSize = Math.min(batchSize, pageSize - (batch * batchSize));

            if (currentBatchSize <= 0) break;

            const elasticsearchQuery = {
              "_source": [
                "Data.geoPoint",
                "Data.@timestamp", 
                "Data.productName",
                "Data.memberCount",
                "Data.administrativeArea",
                "Data.quantity",
                "Data.userName"
              ],
              "query": {
                "term": {
                  "Data.projectName.keyword": projectName
                }
              },
              "from": batchOffset,
              "size": currentBatchSize
            };

            const response = await fetch(origin + '/kibana/api/console/proxy?path=%2Fproject-task-index-v1%2F_search&method=POST', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'ApiKey ' + API_KEY,
                'kbn-xsrf': 'true'
              },
              credentials: 'include',
              body: JSON.stringify(elasticsearchQuery)
            });

            if (response.status === 401 || response.status === 403) {
              postMessage({
                type: 'AUTHENTICATION_REQUIRED'
              });
              return;
            }

            const data = await response.json();
            
            if (data && data.hits && data.hits.hits) {
              const batchData = data.hits.hits.map(function(hit, index) {
                const source = hit._source && hit._source.Data ? hit._source.Data : {};
                const geoPoint = source.geoPoint || {};
                
                return {
                  id: hit._id || ('task-' + (batchOffset + index)),
                  plannedStartDate: source['@timestamp'] ? new Date(source['@timestamp']).toISOString() : "NA",
                  resourcesQuantity: source.quantity || "NA",
                  latitude: geoPoint[1] || geoPoint.lat || "NA",
                  longitude: geoPoint[0] || geoPoint.lon || "NA",
                  createdBy: source.userName || "NA",
                  resourcesCount: 1,
                  locationAccuracy: "NA",
                  productName: source.productName || "NA",
                  memberCount: source.memberCount || "NA",
                  administrativeArea: source.administrativeArea || "NA",
                  quantity: source.quantity || "NA"
                };
              });

              allData = allData.concat(batchData);
              processedBatches++;

              // Send progress update
              postMessage({
                type: 'FETCH_PROGRESS',
                payload: {
                  batchesCompleted: processedBatches,
                  totalBatches: totalBatches,
                  dataReceived: allData.length,
                  progress: (processedBatches / totalBatches) * 100
                }
              });

              // Small delay to prevent overwhelming the main thread
              if (batch < totalBatches - 1) {
                await new Promise(function(resolve) { setTimeout(resolve, 50); });
              }
            }
          }

          postMessage({
            type: 'FETCH_SUCCESS',
            payload: {
              data: allData,
              totalRecords: allData.length,
              batchesProcessed: processedBatches
            }
          });

        } catch (error) {
          postMessage({
            type: 'FETCH_ERROR',
            error: error.message,
            stack: error.stack
          });
        }
      }

      // Handle worker errors
      self.onerror = function(error) {
        postMessage({
          type: 'WORKER_ERROR',
          error: error.message,
          filename: error.filename,
          lineno: error.lineno
        });
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
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
          // Retry authentication
          workerRef.current?.postMessage({
            type: 'AUTHENTICATE_KIBANA',
            payload: { origin: window.location.origin }
          });
          break;
        case 'FETCH_START':
          setIsLoading(true);
          setLoadingProgress({ progress: 0, batchesCompleted: 0, totalBatches: 0, dataReceived: 0 });
          console.log('Starting data fetch for:', payload.projectName);
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
      URL.revokeObjectURL(workerUrl);
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
    
    console.log('Fetching data for visible component:', projectName);
    
    // First authenticate if needed
    if (!isAuthenticated) {
      workerRef.current?.postMessage({
        type: 'AUTHENTICATE_KIBANA',
        payload: { origin: window.location.origin }
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
            batchSize: 1000 // Process in smaller batches
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
          batchSize: 1000 // Process in smaller batches
        }
      });
    }
  }, [isVisible, hasDataBeenFetched, isAuthenticated, page, pageSize]);

  // Extract project name from project data
  useEffect(() => {
    if (project?.Project?.[0]?.name) {
      setProjectName(project.Project[0].name);
    }
  }, [project]);

  // Fetch elasticsearch data when component becomes visible and project name is available
  useEffect(() => {
    if (projectName && isVisible && !hasDataBeenFetched) {
      fetchDataWithWorker(projectName);
    }
  }, [projectName, isVisible, fetchDataWithWorker, hasDataBeenFetched]);

  const isNextDisabled = Array.isArray(projectTask) ? projectTask.length < pageSize : true;

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
      </div>
      
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
      {projectTask?.length === 0 && (
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
      {projectTask?.length > 0 && (
        <BoundariesMapWrapper
          visits={projectTask?.map(task => ({
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
          totalCount={projectTask?.length || 0}
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