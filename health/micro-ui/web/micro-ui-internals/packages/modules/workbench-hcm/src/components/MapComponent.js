import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader } from "@egovernments/digit-ui-components";
import BoundariesMapWrapper from "./BoundariesMapWrapper";
const  API_KEY="VVRaZjE1Z0J0UjN1MDZQak9jNC06V25NZUEybWxUOTZ4QzM5dnItNDJsdw==";
const MapComponent = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10000); // Large page size to fetch all data
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Authenticate with Kibana
  const authenticateKibana = async () => {
    try {
      const loginResponse = await fetch('/kibana/internal/security/login', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'kbn-build-number': '68312',
          'kbn-version': '8.11.3',
          'origin': window.location.origin,
          'pragma': 'no-cache',
          'priority': 'u=1, i',
          'referer': `${window.location.origin}/digit-ui/employee/dss/dashboard/provincial-health-dashboard-llin?province=Cabo%20Delgado%20Bloco1&projectTypeId=dbd45c31-de9e-4e62-a9b6-abb818928fd1`,
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
          "currentURL": `${window.location.origin}kibana/login`
        })
      });

      if (loginResponse.ok) {
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Kibana authentication failed:', loginResponse.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error authenticating with Kibana:', error);
      return false;
    }
  };

  // Fetch data from Kibana Elasticsearch API
  const fetchElasticsearchData = async (projectName) => {
    if (!projectName) return;
    
    setIsLoading(true);
    
    try {
      // Authenticate first if not already authenticated
      if (!isAuthenticated) {
        const authSuccess = await authenticateKibana();
        if (!authSuccess) {
          console.error('Failed to authenticate with Kibana');
          setProjectTask([]);
          return;
        }
      }
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
        "from": page * pageSize,
        "size": pageSize
      };

      const response = await fetch('/kibana/api/console/proxy?path=%2Fproject-task-index-v1%2F_search&method=POST', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'ApiKey ',
          'kbn-xsrf': 'true'
        },
        credentials: 'include',
        body: JSON.stringify(elasticsearchQuery)
      });

      const data = await response.json();
      
      // If unauthorized, try to re-authenticate once
      if (response.status === 401 || response.status === 403) {
        console.log('Session expired, re-authenticating...');
        setIsAuthenticated(false);
        const authSuccess = await authenticateKibana();
        if (authSuccess) {
          // Retry the request with new authentication
          const retryResponse = await fetch('/kibana/api/console/proxy?path=%2Fproject-task-index-v1%2F_search&method=POST', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `ApiKey ${API_KEY}`,
              'kbn-xsrf': 'true'
            },
            credentials: 'include',
            body: JSON.stringify(elasticsearchQuery)
          });
          const retryData = await retryResponse.json();
          
          if (retryData?.hits?.hits) {
            const mappedData = retryData.hits.hits.map((hit, index) => {
              const source = hit._source?.Data || {};
              const geoPoint = source.geoPoint || {};
              
              return {
                id: hit._id || `task-${index}`,
                plannedStartDate: source['@timestamp'] ? new Date(source['@timestamp']).toISOString() : "NA",
                resourcesQuantity: source.quantity || "NA",
                latitude: geoPoint.lat || "NA",
                longitude: geoPoint.lon || "NA",
                createdBy: source.userName || "NA",
                resourcesCount: 1, // Default to 1 per hit
                locationAccuracy: "NA",
                productName: source.productName || "NA",
                memberCount: source.memberCount || "NA",
                administrativeArea: source.administrativeArea || "NA",
                quantity: source.quantity || "NA"
              };
            });
            
            setProjectTask(mappedData);
          } else {
            setProjectTask([]);
          }
        } else {
          console.error('Re-authentication failed');
          setProjectTask([]);
        }
        return;
      }
      
      if (data?.hits?.hits) {
        const mappedData = data.hits.hits.map((hit, index) => {
          const source = hit._source?.Data || {};
          const geoPoint = source.geoPoint || {};
          
          return {
            id: hit._id || `task-${index}`,
            plannedStartDate: source['@timestamp'] ? new Date(source['@timestamp']).toISOString() : "NA",
            resourcesQuantity: source.quantity || "NA",
            latitude: geoPoint?.[1] || "NA",
            longitude: geoPoint?.[0] || "NA",
            createdBy: source.userName || "NA",
            resourcesCount: 1, // Default to 1 per hit
            locationAccuracy: "NA",
            productName: source.productName || "NA",
            memberCount: source.memberCount || "NA",
            administrativeArea: source.administrativeArea || "NA",
            quantity: source.quantity || "NA"
          };
        });
        
        setProjectTask(mappedData);
      } else {
        setProjectTask([]);
      }
    } catch (error) {
      console.error('Error fetching Elasticsearch data:', error);
      console.log('Using default sample data as fallback');
      setProjectTask(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract project name from project data
  useEffect(() => {
    if (project?.Project?.[0]?.name) {
      setProjectName(project.Project[0].name);
    }
  }, [project]);

  // Fetch elasticsearch data when project name, page, or pageSize changes
  useEffect(() => {
    if (projectName) {
      fetchElasticsearchData(projectName);
    }
  }, [projectName, page, pageSize]);

  const isNextDisabled = Array.isArray(projectTask) ? projectTask.length < pageSize : true;

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card" style={{ overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <Header className="works-header-view">{t("MAP_VIEW")}</Header>
      </div>
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
            quantity: task?.resourcesQuantity
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
        />
      )}
    </div>
  );
};

export default MapComponent;