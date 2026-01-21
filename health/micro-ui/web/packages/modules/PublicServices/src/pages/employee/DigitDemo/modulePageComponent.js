import React from "react";
import { Card, LandingPageCard, Button, HeaderComponent, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { transformResponseforModulePage } from "../../../utils";

const ModulePageComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryStrings = Digit.Hooks.useQueryParams();

  // Clear all service-specific form data from localStorage
  // This ensures fresh start when user navigates to module page
  React.useEffect(() => {
    // Clear old format keys
    localStorage.removeItem("formData");
    localStorage.removeItem("currentStep");
    sessionStorage.removeItem("formData");

    // Clear all service-specific keys (pattern: {module}_{service}_formData and {module}_{service}_currentStep)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.endsWith("_formData") || key.endsWith("_currentStep") || key.endsWith("_path"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Also clear from sessionStorage
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.endsWith("_formData") || key.endsWith("_currentStep") || key.endsWith("_path"))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  }, []);

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  //To fetch the service configurations
  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        limit: 1000,
      },
    },
  };
  const { isLoading: moduleListLoading, data: serviceConfigs } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Get current user and their roles
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code) || [];
  
  // Admin roles that have access to all services
  const adminRoles = ["STUDIO_ADMIN", "LOC_ADMIN", "MDMS_ADMIN", "STUDIO_DESIGNER", "HRMS_ADMIN", "STUDIO_EMPLOYEE"];
  
  // Check if user has ONLY admin roles (no other roles)
  const hasOnlyAdminRoles = userRoles.length > 0 && userRoles.every(role => adminRoles.includes(role));
  
  // Check if user has any non-admin roles
  const hasNonAdminRoles = userRoles.some(role => !adminRoles.includes(role));

  //To fetch the service details configured for the tenant
  const request = {
    url : "/public-service-init/v1/service",
    params: { tenantId : tenantId},
    headers: {
      "X-Tenant-Id" : tenantId,
      "auth-token" : window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
    },
    method: "GET",
  }
  const {isLoading, data} = Digit.Hooks.useCustomAPIHook(request);

  //  util to transform raw data into UI-friendly structure
  let detailsConfig = data ? transformResponseforModulePage(data?.Services) : [];
  
  // Filter cards based on URL parameters if module and/or service are provided
  const urlModule = queryStrings?.module;
  const urlService = queryStrings?.service;
  
  if (urlModule || urlService) {
    detailsConfig = detailsConfig.filter(product => {
      // If both module and service are provided, filter by both
      if (urlModule && urlService) {
        return product.module?.toLowerCase() === urlModule.toLowerCase() && 
               product.businessServices?.some(bs => 
                 bs.businessService?.toLowerCase() === urlService.toLowerCase()
               );
      }
      // If only module is provided, filter by module
      else if (urlModule) {
        return product.module?.toLowerCase() === urlModule.toLowerCase();
      }
      // If only service is provided, filter by service
      else if (urlService) {
        return product.businessServices?.some(bs => 
          bs.businessService?.toLowerCase() === urlService.toLowerCase()
        );
      }
      return true;
    });
  }

  // Role-based filtering: Filter services based on user roles
  // Only apply filtering if user has non-admin roles
  if (hasNonAdminRoles && userRoles.length > 0) {
    detailsConfig = detailsConfig.filter(product => {
      // Check if any business service in this product matches user roles
      return product.businessServices?.some(bs => {
        const moduleName = product.module || '';
        const serviceName = bs.businessService || '';
        
        // Create prefix from module and service (e.g., "Aug test" + "Aug test" = "AUG_TEST_AUG_TEST_")
        const modulePrefix = moduleName.replace(/\s+/g, '_').toUpperCase();
        const servicePrefix = serviceName.replace(/\s+/g, '_').toUpperCase();
        const expectedPrefix = `${modulePrefix}_${servicePrefix}_`;
        
        // Check if any user role starts with this prefix
        return userRoles.some(role => role.startsWith(expectedPrefix));
      });
    });
  }

  // Function to get user's access level for a specific service
  const getUserAccessLevel = (moduleName, serviceName) => {
    // If user has only admin roles, give full access
    if (hasOnlyAdminRoles) {
      return { creator: true, editor: true, viewer: true };
    }

    // Find the service configuration for this module and service
    const serviceConfig = serviceConfigs?.mdms?.find(config => 
      config?.data?.module?.toLowerCase() === moduleName.toLowerCase() &&
      config?.data?.service?.toLowerCase() === serviceName.toLowerCase()
    );

    // If no service config found, check if user has non-admin roles that match the service
    if (!serviceConfig?.data?.access?.roles) {
      // Check if user has any role that starts with the expected prefix
      const modulePrefix = moduleName.replace(/\s+/g, '_').toUpperCase();
      const servicePrefix = serviceName.replace(/\s+/g, '_').toUpperCase();
      const expectedPrefix = `${modulePrefix}_${servicePrefix}_`;
      
      const matchingRole = userRoles.find(role => role.startsWith(expectedPrefix));
      
      if (matchingRole) {
        // Determine access level based on role suffix
        if (matchingRole.endsWith('_CREATOR')) {
          return { creator: true, editor: false, viewer: false };
        } else if (matchingRole.endsWith('_EDITOR')) {
          return { creator: false, editor: true, viewer: false };
        } else if (matchingRole.endsWith('_VIEWER')) {
          return { creator: false, editor: false, viewer: true };
        }
      }
      
      return { creator: false, editor: false, viewer: false };
    }

    const { roles } = serviceConfig?.data?.access;
    const userRoleCodes = userRoles;

    // Check which access levels the user has
    const hasCreatorAccess = roles.creator?.some(role => userRoleCodes.includes(role)) || false;
    const hasEditorAccess = roles.editor?.some(role => userRoleCodes.includes(role)) || false;
    const hasViewerAccess = roles.viewer?.some(role => userRoleCodes.includes(role)) || false;

    return {
      creator: hasCreatorAccess,
      editor: hasEditorAccess,
      viewer: hasViewerAccess
    };
  };

  // Function to filter links based on user access
  const getFilteredLinks = (product, accessLevel) => {
    const links = [];
    
    // Service name links (Apply/Create) - only for creators
    if (accessLevel.creator && queryStrings?.selectedPath === "Apply") {
      const serviceLinks = product?.businessServices.map((bs) => ({
        label: bs.businessService?.replaceAll("_"," "),
        link: urlModule && urlService || (product?.module && product?.businessServices?.[0]?.businessService) ? `/${window.contextPath}/employee/publicservices/${product.module}/${bs.businessService}/Apply?serviceCode=${bs?.serviceCode}&selectedModule=true&module=${product.module}&service=${bs.businessService}` : `/${window.contextPath}/employee/publicservices/${product.module}/${bs.businessService}/Apply?serviceCode=${bs?.serviceCode}`,
      }));
      links.push(...serviceLinks);
    }

    return links;
  };

  // Function to filter end children (buttons) based on user access
  const getFilteredEndChildren = (product, accessLevel) => {
    const endChildren = [];
    
    // Search button - for editors and viewers
    if (accessLevel.editor || accessLevel.viewer) {
      const firstBusinessService = product.businessServices?.[0];
      endChildren.push(
        <Button
          key="search"
          variation="teritiary"
          type="button"
          size={"medium"}
          onClick={() => {
            history.push({
              pathname: `/${window.contextPath}/employee/publicservices/${product.module}/search`,
              search: urlModule && urlService || (product?.module && product?.businessServices?.[0]?.businessService) ? `?selectedModule=true&module=${product.module}&service=${firstBusinessService?.businessService}` : '',
              state: {
                moduleData: data
              }
            });
          }}
          label={t(`${product?.module?.toUpperCase()}_SEARCH`)}
        />
      );
    }
    
    // Inbox button - for editors and viewers
    if (accessLevel.editor || accessLevel.viewer) {
      const firstBusinessService = product.businessServices?.[0];
      endChildren.push(
        <Button
          key="inbox"
          variation="teritiary"
          type="button"
          size={"medium"}
          onClick={() => {
            history.push({
              pathname: `/${window.contextPath}/employee/publicservices/${product.module}/inbox`,
              search: urlModule && urlService ? `?selectedModule=true&module=${product.module}&service=${firstBusinessService?.businessService}` : ''
            });
          }}
          label={t(`${product?.module?.toUpperCase()}_INBOX`)}
        />
      );
    }
    
    return endChildren;
  };
  
  const hasNoData = detailsConfig.length === 0 && !isLoading;

  if (isLoading || moduleListLoading) {
    return <Loader />;
  }

  // Show fallback UI when no data is available
  if (hasNoData) { 
    return ( 
    <div className="products-container"> 
    <HeaderComponent className="products-title">{t("DIGIT_STUDIO_HEADER")}</HeaderComponent> 
    <CardText>{t("NO_SERVICES_AVAILABLE")}</CardText> 
    </div> ); 
    }

  return (
    <div className="products-container">
      {/* Header Section */}
      {/* <HeaderComponent className="products-title">{t("DIGIT_STUDIO_HEADER")}</HeaderComponent>
      <CardText className="products-description">
        {t("DIGIT_STUDIO_HEADER_DESCRIPTION")}
      </CardText> */}

      {/* Product Cards Section */}
      <div className="products-list">
        {detailsConfig?.map((product, index) => {
          // Get user's access level for this product's first business service
          const firstBusinessService = product.businessServices?.[0];
          const accessLevel = getUserAccessLevel(product.module, firstBusinessService?.businessService);
          
          // Get filtered links and buttons based on access level
          const links = getFilteredLinks(product, accessLevel);
          const endChildren = getFilteredEndChildren(product, accessLevel);
          
          return (
            <LandingPageCard
              key={index}
              className={"module-page-card"}
              moduleName={t(product.heading)}
              links={links}
              centreChildren={[]}
              endChildren={endChildren}
              hideHeaderDivider={true}
              style={{}}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ModulePageComponent;
