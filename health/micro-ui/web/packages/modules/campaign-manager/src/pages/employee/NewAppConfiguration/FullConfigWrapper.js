import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppConfigurationStore from "./AppConfigurationStore";
import { Loader, Button, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import transformMdmsToAppConfig from "./transformers/mdmsToAppConfig";
import { checkValidationErrorsAndShowToast } from "./utils/configUtils";

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
  const [showToast, setShowToast] = useState(null);
  const [activeSidePanel, setActiveSidePanel] = useState(null); // 'roles' or 'flows' or null
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseSidePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveSidePanel(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleToggleSidePanel = (panel) => {
    if (activeSidePanel === panel) {
      handleCloseSidePanel();
    } else {
      if (activeSidePanel !== null) {
        // If switching between panels, close the current one first
        setIsClosing(true);
        setTimeout(() => {
          setIsClosing(false);
          setActiveSidePanel(panel);
        }, 300);
      } else {
        setActiveSidePanel(panel);
      }
    }
  };

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
          setError(t("APP_CONFIG_NO_FLOW_CONFIG_FOUND"));
        }
      } catch (err) {
        console.error("Error fetching flow config:", err);
        setError(t("APP_CONFIG_FAILED_TO_FETCH_FLOW_CONFIG"));
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
    // Check for validation errors before switching
    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
      return;
    }

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
    // Check for validation errors before switching
    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
      return;
    }

    // Call MDMS update for current screen before switching page
    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
      await window.__appConfig_onNext();
    }

    setSelectedPageName(page.name);
  };

  const saveToAppConfig = async () => {
    // Check for validation errors before saving
    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
      return;
    }

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

        // Show success toast
        setShowToast({ key: "success", label: "APP_CONFIG_SAVED_SUCCESSFULLY_REDIRECTING_TO_MODULE_SCREEN" });

        // Navigate after 5 seconds
        setTimeout(() => {
          navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
        }, 5000);
      } else {
        console.error("No existing NewApkConfig found for campaignNumber and flow");
        setShowToast({ key: "error", label: "APP_CONFIG_UPDATE_FAILED" });
      }
    } catch (error) {
      console.error("Error in saveToAppConfig:", error);
      setShowToast({ key: "error", label: "APP_CONFIG_UPDATE_FAILED" });
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
        <h2 style={{ color: "#d32f2f" }}>{t("APP_CONFIG_ERROR")}</h2>
        <p>{error || t("APP_CONFIG_FAILED_TO_LOAD_FLOW_CONFIG")}</p>
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
      marginLeft: "-1.5rem",
      display: "flex",
      height: "calc(100vh - 136px)", // Subtract header bar (64px) and bottom nav height (72px)
      overflow: "hidden",
      position: "relative",
      transition: "all 0.3s ease-out",
    },
    leftSidebar: {
      width: "220px",
      minWidth: "220px",
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #D6D5D5",
      borderRadius: "0 1rem 0 0",
      overflow: "hidden",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      boxShadow: "1px 2px 8.8px 0px rgba(0, 0, 0, 0.09)",
      zIndex: 100,
      position: "relative",
    },
    sidebarSection: {
      display: "flex",
      flexDirection: "column",
    },
    sidebarMenuItem: {
      padding: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      borderBottom: "1px solid #D6D5D5",
      transition: "background-color 0.2s",
      backgroundColor: "transparent",
    },
    sidebarMenuItemActive: {
      backgroundColor: "#E6EDF0",
      borderRadius: "0.5rem",
    },
    sidebarMenuIcon: {
      width: "24px",
      height: "24px",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#0B4B66",
      marginBottom: "8px",
    },
    sidePanelSlide: {
      width: "280px",
      minWidth: "280px",
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #D6D5D5",
      borderRadius: "0 1rem 0 0",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 10,
      boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    sidePanelSlideIn: {
      animation: "slideInFromBehind 0.3s ease-out forwards",
    },
    sidePanelSlideOut: {
      animation: "slideOutBehind 0.3s ease-out forwards",
    },
    sidePanelWrapper: {
      width: "0px",
      minWidth: "0px",
      height: "100%",
      overflow: "hidden",
      transition: "width 0.3s ease-out, min-width 0.3s ease-out",
      position: "relative",
    },
    sidePanelWrapperOpen: {
      width: "280px",
      minWidth: "280px",
    },
    slidePanelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    slidePanelTitle: {
      fontSize: "1rem",
      fontWeight: "700",
      color: "#787878",
    },
    closeButton: {
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "4px",
      transition: "background-color 0.2s",
    },
    flowItem: {
      padding: "1rem",
      margin: "0 -1rem",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "14px",
      fontWeight: "400",
      backgroundColor: "transparent",
      position: "relative",
    },
    flowItemBorder: {
      position: "absolute",
      bottom: 0,
      left: "1rem",
      right: "1rem",
      height: "1px",
      backgroundColor: "#D6D4D5",
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
      transition: "all 0.3s ease-out",
    },
    flowTag: {
      position: "absolute",
      top: "1rem",
      left: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "4px",
      backgroundColor: "#DEEFFF",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "400",
      color: "#0057BD",
      width: "fit-content",
      marginTop: "1rem",
      marginLeft: "1rem",
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
      borderColor: "#C84C0E",
      borderBottom: "3px solid #C84C0E",
      color: "#C84C0E",
      fontWeight: "600",
      backgroundColor: "#FFFFFF",
      position: "relative",
      zIndex: 1,
    },
    previewArea: {
      position: "relative",
      backgroundColor: "#FFFFFF",
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
    headerBar: {
      marginTop: "-1.5rem",
      marginLeft: "-1.5rem",
      marginRight: "-1.5rem",
      backgroundColor: "#929292",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    backButton: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
    },
    flowNameHeader: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: "1.5rem",
    },
  };

  return (
    <React.Fragment>
      <style>
        {`
          @keyframes slideInFromBehind {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOutBehind {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-100%);
              opacity: 0;
            }
          }

          .close-button:hover {
            background-color: #F5F5F5 !important;
          }
        `}
      </style>
      {/* Header Bar with Back Button and Flow Name */}
      <div style={styles.headerBar}>
        <Button
          variation="secondary"
          icon="ArrowBack"
          label={t("BACK_TO_MODULES")}
          style={{ borderRadius: "6px" }}
          onClick={() => {
            navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
          }}
        />
        <div style={styles.flowNameHeader}>{t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flowModule}`))}</div>
      </div>
      <div style={styles.container}>
        {/* Left Sidebar - Menu Items */}
        <div style={styles.leftSidebar}>
          <div
            style={{
              ...styles.sidebarMenuItem,
              ...(activeSidePanel === "roles" ? styles.sidebarMenuItemActive : {}),
            }}
            onClick={() => handleToggleSidePanel("roles")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="#0B4B66"
              />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#0B4B66" }}>{t("APP_CONFIG_ROLES")}</span>
          </div>

          <div
            style={{
              ...styles.sidebarMenuItem,
              ...(activeSidePanel === "flows" ? styles.sidebarMenuItemActive : {}),
            }}
            onClick={() => handleToggleSidePanel("flows")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-2.18557e-07 5C-1.5809e-07 3.61667 0.487499 2.4375 1.4625 1.4625C2.4375 0.487499 3.61667 -6.28715e-07 5 -5.68248e-07L14.8 -1.39876e-07C15.7 -1.00536e-07 16.4583 0.275 17.075 0.825C17.6917 1.375 18 2.1 18 3C18 3.9 17.725 4.625 17.175 5.175C16.625 5.725 15.9 6 15 6C14.15 6 13.4375 5.7125 12.8625 5.1375C12.2875 4.5625 12 3.85 12 3L12 2L5 2C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8L13 8C14.3833 8 15.5625 8.4875 16.5375 9.4625C17.5125 10.4375 18 11.6167 18 13C18 14.3833 17.5125 15.5625 16.5375 16.5375C15.5625 17.5125 14.3833 18 13 18L3 18C2.15 18 1.4375 17.6792 0.862498 17.0375C0.287498 16.3958 -6.84083e-07 15.65 -6.46929e-07 14.8C-6.09774e-07 13.95 0.287498 13.2708 0.862499 12.7625C1.4375 12.2542 2.15 12 3 12C3.85 12 4.5625 12.2875 5.1375 12.8625C5.7125 13.4375 6 14.15 6 15L6 16L13 16C13.8333 16 14.5417 15.7083 15.125 15.125C15.7083 14.5417 16 13.8333 16 13C16 12.1667 15.7083 11.4583 15.125 10.875C14.5417 10.2917 13.8333 10 13 10L5 10C3.61667 10 2.4375 9.5125 1.4625 8.5375C0.487499 7.5625 -2.79024e-07 6.38333 -2.18557e-07 5Z" fill="#0B4B66"/>
            </svg>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#0B4B66" }}>{t("APP_CONFIG_FLOWS")}</span>
          </div>
        </div>

        {/* Slide-out Panel for Roles */}
        {activeSidePanel === "roles" && (
          <div
            style={{
              ...styles.sidePanelWrapper,
              ...(activeSidePanel === "roles" && !isClosing ? styles.sidePanelWrapperOpen : {}),
            }}
          >
            <div
              style={{
                ...styles.sidePanelSlide,
                ...(isClosing ? styles.sidePanelSlideOut : styles.sidePanelSlideIn),
              }}
            >
              <div style={styles.slidePanelHeader}>
                <div style={styles.slidePanelTitle}>{t("APP_CONFIG_ROLES")}</div>
                <button className="close-button" style={styles.closeButton} onClick={handleCloseSidePanel}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#505A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {currentPageRoles.length > 0 ? (
                currentPageRoles.map((role, index) => (
                  <div key={index} style={styles.roleItem}>
                    {t(role)}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "13px", color: "#999", padding: "8px 0" }}>{t("APP_CONFIG_NO_ROLES_ASSIGNED")}</div>
              )}
            </div>
          </div>
        )}

        {/* Slide-out Panel for Flows */}
        {activeSidePanel === "flows" && (
          <div
            style={{
              ...styles.sidePanelWrapper,
              ...(activeSidePanel === "flows" && !isClosing ? styles.sidePanelWrapperOpen : {}),
            }}
          >
            <div
              style={{
                ...styles.sidePanelSlide,
                ...(isClosing ? styles.sidePanelSlideOut : styles.sidePanelSlideIn),
              }}
            >
              <div style={styles.slidePanelHeader}>
                <div style={styles.slidePanelTitle}>{t("APP_CONFIG_FLOWS")}</div>
                <button className="close-button" style={styles.closeButton} onClick={handleCloseSidePanel}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#505A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {flowConfig.flows?.map((flow, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.flowItem,
                    backgroundColor: selectedFlow === flow.id ? "#C84C0E08" : "transparent",
                    color: selectedFlow === flow.id ? "#0B4B66" : "#505A5F",
                    fontWeight: selectedFlow === flow.id ? "700" : "400",
                  }}
                  onClick={() => handleFlowClick(flow)}
                >
                  {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flow.name}`))}
                  <div style={styles.flowItemBorder} />
                </div>
              ))}
            </div>
          </div>
        )}

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
                {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_PAGE_${page.name}`))}
              </div>
            ))}
          </div>

          {/* Preview Area with Navigation Arrows */}
          <div style={styles.previewArea}>
            {/* Flow Tag */}
            <div style={styles.flowTag}>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.3333 12C10.9 12 10.5111 11.875 10.1667 11.625C9.82222 11.375 9.58333 11.0556 9.45 10.6667H6C5.26667 10.6667 4.63889 10.4056 4.11667 9.88333C3.59444 9.36111 3.33333 8.73333 3.33333 8C3.33333 7.26667 3.59444 6.63889 4.11667 6.11667C4.63889 5.59444 5.26667 5.33333 6 5.33333H7.33333C7.7 5.33333 8.01389 5.20278 8.275 4.94167C8.53611 4.68056 8.66667 4.36667 8.66667 4C8.66667 3.63333 8.53611 3.31944 8.275 3.05833C8.01389 2.79722 7.7 2.66667 7.33333 2.66667H3.88333C3.73889 3.05556 3.49722 3.375 3.15833 3.625C2.81944 3.875 2.43333 4 2 4C1.44444 4 0.972222 3.80556 0.583333 3.41667C0.194444 3.02778 0 2.55556 0 2C0 1.44444 0.194444 0.972222 0.583333 0.583333C0.972222 0.194444 1.44444 0 2 0C2.43333 0 2.81944 0.125 3.15833 0.375C3.49722 0.625 3.73889 0.944444 3.88333 1.33333H7.33333C8.06667 1.33333 8.69444 1.59444 9.21667 2.11667C9.73889 2.63889 10 3.26667 10 4C10 4.73333 9.73889 5.36111 9.21667 5.88333C8.69444 6.40556 8.06667 6.66667 7.33333 6.66667H6C5.63333 6.66667 5.31944 6.79722 5.05833 7.05833C4.79722 7.31945 4.66667 7.63333 4.66667 8C4.66667 8.36667 4.79722 8.68056 5.05833 8.94167C5.31944 9.20278 5.63333 9.33333 6 9.33333H9.45C9.59444 8.94444 9.83611 8.625 10.175 8.375C10.5139 8.125 10.9 8 11.3333 8C11.8889 8 12.3611 8.19444 12.75 8.58333C13.1389 8.97222 13.3333 9.44444 13.3333 10C13.3333 10.5556 13.1389 11.0278 12.75 11.4167C12.3611 11.8056 11.8889 12 11.3333 12ZM2 2.66667C2.18889 2.66667 2.34722 2.60278 2.475 2.475C2.60278 2.34722 2.66667 2.18889 2.66667 2C2.66667 1.81111 2.60278 1.65278 2.475 1.525C2.34722 1.39722 2.18889 1.33333 2 1.33333C1.81111 1.33333 1.65278 1.39722 1.525 1.525C1.39722 1.65278 1.33333 1.81111 1.33333 2C1.33333 2.18889 1.39722 2.34722 1.525 2.475C1.65278 2.60278 1.81111 2.66667 2 2.66667Z"
                  fill="#0057BD"
                />
              </svg>
              <span>{t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${activeFlow?.name}`))}</span>
            </div>

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
                  // Check for validation errors before navigating
                  if (checkValidationErrorsAndShowToast(setShowToast, t)) {
                    return;
                  }

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
              navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
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

        {/* Toast Notification */}
        {showToast && (
          <Toast type={showToast?.key === "error" ? "error" : "success"} label={t(showToast?.label)} onClose={() => setShowToast(null)} />
        )}
      </div>
    </React.Fragment>
  );
};

export default FullConfigWrapper;
