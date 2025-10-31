import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppConfigurationStore from "./AppConfigurationStore";
import { Loader, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import transformMdmsToAppConfig from "./transformers/mdmsToAppConfig";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const FullConfigWrapper = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber") || "CMP-2025-08-04-004846";
  const flowModule = searchParams.get("flow");
  const tenantId = searchParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();

  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedPageName, setSelectedPageName] = useState(null);
  const [currentPageRoles, setCurrentPageRoles] = useState([]);
  const [flowConfig, setFlowConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flow configuration from MDMS
  useEffect(() => {
    const fetchFlowConfig = async () => {
      try {
        setIsLoading(true);
        const response = await Digit.CustomService.getResponse({
          url: `/${mdmsContext}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: "mz",
              schemaCode: "HCM-ADMIN-CONSOLE.AppFlowConfig",
              filters: {
                project: campaignNumber,
                name: flowModule,
              },
              isActive: true,
            },
          },
        });

        if (response?.mdms && response.mdms.length > 0) {
          const configData = response.mdms[0].data;
          setFlowConfig(configData);

          // Set initial flow and page
          if (configData.flows && configData.flows.length > 0) {
            const firstFlow = configData.flows[0];
            setSelectedFlow(firstFlow.id);
            setSelectedPageName(firstFlow.indexRoute || firstFlow.pages?.[0]?.name);
          }
        } else {
          setError("No flow configuration found");
        }
      } catch (err) {
        console.error("Error fetching flow config:", err);
        setError("Failed to fetch flow configuration");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlowConfig();
  }, [campaignNumber]);

  // Update currentPageRoles when page changes
  useEffect(() => {
    if (!flowConfig) return;

    const flow = flowConfig.flows?.find((f) => f.id === selectedFlow);
    const page = flow?.pages?.find((p) => p.name === selectedPageName);

    // Use page roles if available, otherwise fall back to flow roles
    setCurrentPageRoles(page?.roles || flow?.roles || []);
  }, [flowConfig, selectedFlow, selectedPageName]);

  const handleFlowClick = async (flow) => {
    // Call MDMS update for current screen before switching
    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
      await window.__appConfig_onNext();
    }

    setSelectedFlow(flow.id);
    // Set index route or first page as default when flow is clicked
    const defaultPage = flow.indexRoute || (flow.pages && flow.pages.length > 0 ? flow.pages[0].name : null);
    if (defaultPage) {
      setSelectedPageName(defaultPage);
    }
  };

  const handlePageClick = async (page) => {
    // Call MDMS update for current screen before switching page
    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
      await window.__appConfig_onNext();
    }

    setSelectedPageName(page.name);
  };

  const saveToAppConfig = async () => {
    try {
      // Step 1: Fetch NewFormConfig data and transform it
      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "HCM-ADMIN-CONSOLE.NewFormConfig",
            filters: {
              project: campaignNumber,
            },
            isActive: true,
          },
        },
      });

      const fullData = response?.mdms && response?.mdms?.map((item) => item.data);
      const transformedData = transformMdmsToAppConfig(fullData);

      // Step 2: Search for existing NewApkConfig with campaignNumber and flow
      const appConfigResponse = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "HCM-ADMIN-CONSOLE.NewApkConfig",
            filters: {
              project: campaignNumber,
              name: flowModule,
            },
            isActive: true,
          },
        },
      });
      // Step 3: Update the existing config's mdms property with transformedData
      if (appConfigResponse?.mdms && appConfigResponse.mdms.length > 0) {
        const existingConfig = appConfigResponse.mdms?.[0].data;

        // Update the mdms property with transformed data
        const updatedConfig = {
          ...existingConfig,
          flows: transformedData,
        };

        // Update the MDMS record
        const updatePayload = {
          Mdms: {
            ...appConfigResponse.mdms?.[0],
            data: updatedConfig,
          },
        };

        await Digit.CustomService.getResponse({
          url: `/${mdmsContext}/v2/_update/HCM-ADMIN-CONSOLE.FormConfig`,
          body: updatePayload,
        });
      } else {
        console.error("No existing NewApkConfig found for campaignNumber and flow");
      }

      // Navigate to new-app-modules after successful API calls
      navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
    } catch (error) {
      console.error("Error in saveToAppConfig:", error);
    }
  };
  // Show loader while fetching data
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  // Show error message if fetch failed
  if (error || !flowConfig) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <h2 style={{ color: "#d32f2f" }}>Error</h2>
        <p>{error || "Failed to load flow configuration"}</p>
      </div>
    );
  }

  const activeFlow = flowConfig.flows?.find((flow) => flow.id === selectedFlow);

  // Get current page's route information
  const currentPage = activeFlow?.pages?.find((p) => p.name === selectedPageName);
  const nextRoute = currentPage?.nextRoute || null;
  const previousRoute = currentPage?.previousRoute || null;

  const styles = {
    container: {
      marginTop: "-1.5rem",
      marginLeft: "-1.5rem",
      display: "flex",
      height: "calc(100vh - 80px)", // Subtract bottom nav height
      overflow: "hidden",
      position: "relative",
    },
    leftSidebar: {
      width: "220px",
      height: "100%",
      backgroundColor: "#FAFAFA",
      borderRight: "1px solid #D6D5D5",
      overflowY: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    sidebarSection: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#0B4B66",
      marginBottom: "8px",
    },
    flowItem: {
      padding: "10px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "14px",
      fontWeight: "400",
      backgroundColor: "transparent",
    },
    roleItem: {
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "#EEEEEE",
      color: "#505A5F",
      fontWeight: "400",
    },
    centerContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      maxWidth: "75rem",
    },
    pageTabs: {
      marginTop: "1rem",
      display: "flex",
      alignItems: "flex-end",
      overflowX: "auto",
      borderBottom: "1px solid #D6D5D5",
    },
    pageTab: {
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "400",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
      border: "1px solid #D6D5D5",
      borderBottom: "none",
      borderRadius: "8px 8px 0 0",
      backgroundColor: "#FFFFFF",
      color: "#505A5F",
      marginRight: "-1px", // Overlap borders
    },
    pageTabActive: {
      padding: "16px 20px",
      borderColor: "#F47738",
      borderBottom: "3px solid #F47738",
      color: "#F47738",
      fontWeight: "600",
      backgroundColor: "#FFFFFF",
      position: "relative",
      zIndex: 1,
    },
    previewArea: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      padding: "24px",
      overflow: "auto",
    },
    navArrow: {
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "72px",
      backgroundColor: "#FAFAFA",
      borderTop: "1px solid #D6D5D5",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      zIndex: 1000,
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar - Roles and Flows */}
      <div style={styles.leftSidebar}>
        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>Roles</div>
          {currentPageRoles.length > 0 ? (
            currentPageRoles.map((role, index) => (
              <div key={index} style={styles.roleItem}>
                {role}
              </div>
            ))
          ) : (
            <div style={{ fontSize: "13px", color: "#999", padding: "8px 0" }}>No roles assigned</div>
          )}
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>Flows</div>
          {flowConfig.flows?.map((flow, index) => (
            <div
              key={index}
              style={{
                ...styles.flowItem,
                backgroundColor: selectedFlow === flow.id ? "#F47738" : "transparent",
                color: selectedFlow === flow.id ? "#FFFFFF" : "#505A5F",
                fontWeight: selectedFlow === flow.id ? "700" : "400",
              }}
              onClick={() => handleFlowClick(flow)}
            >
              {flow.name}
            </div>
          ))}
        </div>
      </div>

      {/* Center Content - Page Tabs and Preview */}
      <div style={styles.centerContent}>
        {/* Page Tabs */}
        <div style={styles.pageTabs}>
          {activeFlow?.pages?.map((page, index) => (
            <div
              key={index}
              style={{
                ...styles.pageTab,
                ...(selectedPageName === page.name ? styles.pageTabActive : {}),
              }}
              onClick={() => handlePageClick(page)}
            >
              {page.name}
            </div>
          ))}
        </div>

        {/* Preview Area with Navigation Arrows */}
        <div style={styles.previewArea}>
          {/* Left Arrow */}
          <div
            style={{
              ...styles.navArrow,
              opacity: !previousRoute ? 0.3 : 1,
              cursor: !previousRoute ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (previousRoute) {
                setSelectedPageName(previousRoute);
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#505A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* App Preview */}
          <AppConfigurationStore
            flow={selectedFlow}
            flowName={activeFlow?.name}
            pageName={selectedPageName}
            campaignNumber={flowConfig?.project}
            onPageChange={setSelectedPageName}
            nextRoute={nextRoute}
            previousRoute={previousRoute}
          />

          {/* Right Arrow */}
          <div
            style={{
              ...styles.navArrow,
              opacity: !nextRoute ? 0.3 : 1,
              cursor: !nextRoute ? "not-allowed" : "pointer",
            }}
            onClick={async () => {
              if (nextRoute) {
                // Call MDMS update if available
                if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
                  await window.__appConfig_onNext();
                }
                // Navigate to next page
                setSelectedPageName(nextRoute);
              }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#505A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <Button
          variation="secondary"
          label={t("BACK")}
          icon="ArrowBack"
          onClick={() => {
            // Handle back navigation - could go to module selection or previous screen
            window.history.back();
          }}
        />
        <Button
          variation="primary"
          label={t("PROCEED_TO_PREVIEW")}
          icon="ArrowForward"
          isSuffix={true}
          onClick={() => {
            // Handle proceed to preview
            saveToAppConfig();
          }}
        />
      </div>
    </div>
  );
};

export default FullConfigWrapper;
