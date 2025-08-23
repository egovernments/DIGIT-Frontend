import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Loader } from "@egovernments/digit-ui-components";
import BoundariesMapWrapper from "./BoundariesMapWrapper";

const MapComponent = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [projectTask, setProjectTask] = useState([]);
  const [projectName, setProjectName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

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
          'origin': 'https://health-demo.digit.org',
          'pragma': 'no-cache',
          'priority': 'u=1, i',
          'referer': 'https://health-demo.digit.org/digit-ui/employee/dss/dashboard/provincial-health-dashboard-llin?province=Cabo%20Delgado%20Bloco1&projectTypeId=dbd45c31-de9e-4e62-a9b6-abb818928fd1',
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
          "currentURL": "https://health-demo.digit.org/kibana/login"
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
          'Authorization': 'ApiKey VVRaZjE1Z0J0UjN1MDZQak9jNC06V25NZUEybWxUOTZ4QzM5dnItNDJsdw==',
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
              'Authorization': 'ApiKey VVRaZjE1Z0J0UjN1MDZQak9jNC06V25NZUEybWxUOTZ4QzM5dnItNDJsdw==',
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
            latitude: geoPoint?.[0] || "NA",
            longitude: geoPoint?.[1] || "NA",
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
      setProjectTask([]);
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