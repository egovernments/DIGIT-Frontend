import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-components";
import { CustomAccordion, CustomAccordionList } from "../../components/CustomAccordion";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

/**
 * ProjectRedirectPage - Redirects users based on their assigned projects
 * 
 * URL Format: /project-redirect?userId=UUID&tenantId=TENANT&redirectUrl=URL
 * 
 * Logic:
 * 1. Extract userId, tenantId, redirectUrl from URL params
 * 2. Search for projects assigned to the user
 * 3. If single project: Auto-redirect with projectId
 * 4. If multiple projects: Show accordion list for selection
 * 5. On selection: Redirect to redirectUrl with selected projectId
 */


const ProjectRedirectPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const url = getProjectServiceUrl();
  const history = useHistory();
  const defaultTenantId = Digit.ULBService.getCurrentTenantId();
  const defaultUserId = Digit?.UserService?.getUser()?.info?.uuid;
  const { redirectUrl: encodedRedirectUrl } = Digit.Hooks.useQueryParams();
   let { tenantId=defaultTenantId, userId=defaultUserId, } = Digit.Hooks.useQueryParams();
  // State management
  const [projects, setProjects] = useState([]);
  const [redirecting, setRedirecting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Decode the redirect URL
  const redirectUrl = encodedRedirectUrl ? decodeURIComponent(encodedRedirectUrl) : null;

  // Validate required parameters
  const hasValidParams = userId && tenantId && redirectUrl;

  // Memoized fetch function to avoid re-creation on each render
  const fetchUserProjects = React.useCallback(async () => {
    if (!hasValidParams) {
      setError(t("HCM_MISSING_PARAMETERS"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, fetch project staff data
      
      const staffResponse = await Digit.CustomService.getResponse({
        url: `${url}/staff/v1/_search?offset=0&tenantId=${tenantId}&limit=10`,
        body: {
          ProjectStaff: {
            staffId: [userId],
            tenantId: tenantId
          },
          apiOperation: "SEARCH"
        }
      });

      
      const projectStaffData = staffResponse?.ProjectStaff || [];
      
      if (projectStaffData.length === 0) {
        setError(t("HCM_NO_PROJECTS_FOUND"));
        setIsLoading(false);
        return;
      }

      // Extract unique project IDs
      const uniqueProjectIds = [...new Set(projectStaffData.map(staff => staff.projectId))];
      
      
      const projectResponse = await Digit.CustomService.getResponse({
        url: `${url}/v1/_search?offset=0&tenantId=${tenantId}&limit=100`,
        body: {
          Projects: uniqueProjectIds.map(projectId => ({
            tenantId,
            id: projectId,
          })),
          apiOperation: "SEARCH"
        }
      });

      
      const projectDetails = projectResponse?.Project || [];
      
      if (projectDetails.length === 0) {
        setError(t("HCM_NO_PROJECTS_FOUND"));
        setIsLoading(false);
        return;
      }

      // Auto-redirect if only one project
      if (projectDetails.length === 1 && !redirecting) {
        handleProjectSelection(projectDetails[0]);
      } else {
        setProjects(projectDetails);
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error fetching user projects:", error);
      setError(t("HCM_PROJECT_FETCH_ERROR"));
      setIsLoading(false);
    }
  }, [userId, tenantId, hasValidParams, redirecting, t, url]);

  // Fetch projects on component mount
  useEffect(() => {
    if (hasValidParams) {
      fetchUserProjects();
    }
  }, [hasValidParams, fetchUserProjects]); // Use the memoized function


  // Handle project selection and redirect
  const handleProjectSelection = (selectedProject) => {
    setRedirecting(true);
    setSelectedProjectId(selectedProject.id);
    
    try {
      // Add small delay for better UX
      setTimeout(() => {
        history.push({
          pathname: redirectUrl, // e.g. "/dashboard"
          search: `?projectId=${selectedProject.id}&tenantId=${tenantId}`,
        });
      }, 500);

    } catch (err) {
      console.error('Error constructing redirect URL:', err);
      setRedirecting(false);
    }
  };

  // Prepare accordion data for multiple projects
  const accordionData = projects.map(project => ({
    title: project.name || project.projectNumber || `${t("HCM_PROJECT")} ${project.id}`,
    content: (
      <div style={{ padding: '1rem 0' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>{t("HCM_PROJECT_ID")}:</strong> {project.projectNumber || project.id}
        </div>
        {project.description && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>{t("HCM_PROJECT_DESCRIPTION")}:</strong> {project.description}
          </div>
        )}
        {project.startDate && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>{t("HCM_START_DATE")}:</strong> {new Date(project.startDate).toLocaleDateString()}
          </div>
        )}
        {project.endDate && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>{t("HCM_END_DATE")}:</strong> {new Date(project.endDate).toLocaleDateString()}
          </div>
        )}
        <button
          onClick={() => handleProjectSelection(project)}
          disabled={redirecting || selectedProjectId === project.id}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: (redirecting || selectedProjectId === project.id) ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            opacity: (redirecting || selectedProjectId === project.id) ? 0.6 : 1
          }}
        >
          {selectedProjectId === project.id ? t("HCM_REDIRECTING") : t("HCM_SELECT_PROJECT")}
        </button>
      </div>
    )
  }));

  // Error conditions - only show error if there's actually an error message
  const hasError = error && !isLoading;
  
  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Loader />
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#666' }}>
          {t("HCM_LOADING_PROJECTS")}
        </p>
      </div>
    );
  }

  // Error state - but not if we have projects loaded successfully
  if (hasError && projects.length === 0) {
    const errorMessage = !hasValidParams 
      ? t("HCM_MISSING_PARAMETERS") 
      : error;

    return (
      <div style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        border: '1px solid #ffcdd2'
      }}>
        <Header style={{ color: '#c62828', marginBottom: '1rem' }}>
          {t("HCM_PROJECT_ACCESS_ERROR")}
        </Header>
        <p style={{ color: '#c62828', marginBottom: '1rem' }}>
          {errorMessage}
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          {t("HCM_GO_BACK")}
        </button>
      </div>
    );
  }

  // Redirecting state
  if (redirecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Loader />
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#666' }}>
          {t("HCM_REDIRECTING_TO_PROJECT")}
        </p>
      </div>
    );
  }

  // If no valid params and no projects, show error
  if (!hasValidParams && projects.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        border: '1px solid #ffcdd2'
      }}>
        <Header style={{ color: '#c62828', marginBottom: '1rem' }}>
          {t("HCM_PROJECT_ACCESS_ERROR")}
        </Header>
        <p style={{ color: '#c62828', marginBottom: '1rem' }}>
          {t("HCM_MISSING_PARAMETERS")}
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          {t("HCM_GO_BACK")}
        </button>
      </div>
    );
  }

  // Multiple projects selection
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <Header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {t("HCM_SELECT_YOUR_PROJECT")}
      </Header>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        color: '#666',
        fontSize: '1.1rem'
      }}>
        {t("HCM_MULTIPLE_PROJECTS_MESSAGE")}
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <CustomAccordionList className="project-selection-accordion">
          {accordionData.map((item, index) => (
            <CustomAccordion
              key={index}
              title={item.title}
              content={item.content}
              className="project-accordion-item"
            />
          ))}
        </CustomAccordionList>
      </div>
      
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #dee2e6'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
          {t("HCM_PROJECTS_FOUND_COUNT")} {projects.length}
        </p>
      </div>
    </div>
  );
};

export default ProjectRedirectPage;