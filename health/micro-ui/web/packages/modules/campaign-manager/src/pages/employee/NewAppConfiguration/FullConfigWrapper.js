import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppConfigurationStore from "./AppConfigurationStore";
import { Loader, Button, Toast, Tag } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { checkValidationErrorsAndShowToast } from "./utils/configUtils";
import { SVG } from "@egovernments/digit-ui-components";
import { ConversionPath, Earbuds } from "./svg/Flows";
import { deselectField } from "./redux/remoteConfigSlice";
import { FlowFilled } from "../../../components/icons/FlowFilled";
import { FlowUnfilled } from "../../../components/icons/FlowUnfilled";
import AppHelpTutorial from "../../../components/AppHelpTutorial";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const FullConfigWrapper = ({ path, location: propsLocation }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const version = searchParams.get("version");
  const flowModule = searchParams.get("flow");
  const tenantId = searchParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();

  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedPageName, setSelectedPageName] = useState(null);
  const [currentPageRoles, setCurrentPageRoles] = useState([]);
  const [flowConfig, setFlowConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [activeSidePanel, setActiveSidePanel] = useState("flows"); // 'roles' or 'flows' or null - defaults to 'flows' to keep flow panel open
  const [isClosing, setIsClosing] = useState(false);
  const [currentPageType, setCurrentPageType] = useState(null);

  const sidePanelRef = useRef(null);
  const sidebarRef = useRef(null);

  // Click outside to close panel
  useEffect(() => {
    if (!activeSidePanel) return;

    const handleClickOutside = (e) => {
      // Check if click is outside both the panel and the sidebar menu
      const isOutsidePanel = sidePanelRef.current && !sidePanelRef.current.contains(e.target);
      const isOutsideSidebar = sidebarRef.current && !sidebarRef.current.contains(e.target);

      if (isOutsidePanel && isOutsideSidebar) {
        handleCloseSidePanel();
      }
    };

    // Add listener on next tick to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSidePanel]);

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
              tenantId: tenantId,
              schemaCode: "HCM-ADMIN-CONSOLE.AppFlowConfig",
              filters: {
                project: campaignNumber,
                name: flowModule,
              },
              limit: 1000,
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

  // Monitor pageType from AppConfiguration via window object
  useEffect(() => {
    const checkPageType = () => {
      if (window.__appConfig_pageType) {
        setCurrentPageType(window.__appConfig_pageType);
      }
    };

    // Check immediately
    checkPageType();

    // Set up interval to check for updates
    const interval = setInterval(checkPageType, 100);

    return () => clearInterval(interval);
  }, [selectedPageName]);

  const handleFlowClick = async (flow) => {
    // Check for validation errors before switching
    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
      return;
    }

    // Call MDMS update for current screen before switching
    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
      await window.__appConfig_onNext();
    }

    // Reset selected field when switching flows
    dispatch(deselectField());

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

    // Reset selected field when switching pages
    dispatch(deselectField());

    setSelectedPageName(page.name);
  };

  const saveToAppConfig = async () => {
    // Check for validation errors before saving
    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
      return;
    }

    // Call MDMS update for current screen before navigating
    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
      await window.__appConfig_onNext();
    }

    // Navigate to the save loader screen
    navigate(
      `/${window?.contextPath}/employee/campaign/app-config-save?campaignNumber=${campaignNumber}&flow=${flowModule}&tenantId=${tenantId}`
    );
  };
  // Show loader while fetching data
  if (isLoading) {
    return (
      <div className="full-config-wrapper__loader-container">
        <Loader />
      </div>
    );
  }

  // Show error message if fetch failed
  if (error || !flowConfig) {
    return (
      <div className="full-config-wrapper__error-container">
        <h2>{t("APP_CONFIG_ERROR")}</h2>
        <p>{error || t("APP_CONFIG_FAILED_TO_LOAD_FLOW_CONFIG")}</p>
      </div>
    );
  }

  const activeFlow = flowConfig.flows?.find((flow) => flow.id === selectedFlow);

  // Get current page's route information
  const currentPage = activeFlow?.pages?.find((p) => p.name === selectedPageName);
  const nextRoute = currentPage?.nextRoute || null;
  const previousRoute = currentPage?.previousRoute || null;

  return (
    <React.Fragment>
      {/* Header Bar with Back Button and Flow Name */}
      <div className="full-config-wrapper__header-bar">
        <Button
          variation="secondary"
          icon="ArrowBack"
          label={t("BACK_TO_MODULES")}
          className="full-config-wrapper__back-button"
          onClick={() => {
            navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
          }}
          size={"medium"}
        />
        <div className="full-config-wrapper__flow-name-header">
          {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flowModule}`))}
          <span style={{fontSize: "0.75rem", marginBottom: "0.375rem",marginTop: "0.375rem"}}> ({`${t("APPCONFIG_VERSION")} - ${version}`})</span>
        </div>
        <AppHelpTutorial appPath={path} location={propsLocation} buttonLabel="CAMP_HELP_TEXT" />
      </div>
      <div
        className={`full-config-wrapper__container ${activeSidePanel && !isClosing ? "full-config-wrapper__container--panel-open" : ""}`}
      >
        {/* Left Sidebar - Menu Items */}
        <div ref={sidebarRef} className="full-config-wrapper__left-sidebar">
          <div
            className={`full-config-wrapper__sidebar-menu-item ${
              activeSidePanel === "roles" ? "full-config-wrapper__sidebar-menu-item--active" : ""
            }`}
            onClick={() => handleToggleSidePanel("roles")}
          >
            {activeSidePanel === "roles" ? <SVG.Person fill="#0B4B66" /> : <SVG.PersonOutline fill="#0B4B66" />}

            <span>{t("APP_CONFIG_ROLES")}</span>
          </div>

          <div
            className={`full-config-wrapper__sidebar-menu-item ${
              activeSidePanel === "flows" ? "full-config-wrapper__sidebar-menu-item--active" : ""
            }`}
            onClick={() => handleToggleSidePanel("flows")}
          >
            {/* <Earbuds fill="#0B4B66" /> */}
            {activeSidePanel === "flows" ? <FlowFilled/> : <FlowUnfilled/>}
            <span>{t("APP_CONFIG_FLOWS")}</span>
          </div>
        </div>

        {/* Slide-out Panel for Roles */}
        {activeSidePanel === "roles" && (
          <div
            ref={sidePanelRef}
            className={`full-config-wrapper__side-panel-wrapper ${
              activeSidePanel === "roles" && !isClosing ? "full-config-wrapper__side-panel-wrapper--open" : ""
            }`}
          >
            <div
              className={`full-config-wrapper__side-panel-slide ${
                isClosing ? "full-config-wrapper__side-panel-slide--slide-out" : "full-config-wrapper__side-panel-slide--slide-in"
              }`}
            >
              <div className="full-config-wrapper__slide-panel-header">
                <div className="full-config-wrapper__slide-panel-title">{t("APP_CONFIG_ROLES")}</div>
                <button className="full-config-wrapper__close-button" onClick={handleCloseSidePanel}>
                  <SVG.Close fill="#787878" />
                </button>
              </div>
              <div className="full-config-wrapper__slide-panel-items-wrapper">
                {currentPageRoles.length > 0 ? (
                  currentPageRoles.map((role, index) => (
                    <div key={index} className="full-config-wrapper__role-item">
                      {t(role)}
                    </div>
                  ))
                ) : (
                  <div className="full-config-wrapper__no-roles">{t("APP_CONFIG_NO_ROLES_ASSIGNED")}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Panel for Flows */}
        {activeSidePanel === "flows" && (
          <div
            ref={sidePanelRef}
            className={`full-config-wrapper__side-panel-wrapper ${
              activeSidePanel === "flows" && !isClosing ? "full-config-wrapper__side-panel-wrapper--open" : ""
            }`}
          >
            <div
              className={`full-config-wrapper__side-panel-slide ${
                isClosing ? "full-config-wrapper__side-panel-slide--slide-out" : "full-config-wrapper__side-panel-slide--slide-in"
              }`}
            >
              <div className="full-config-wrapper__slide-panel-header">
                <div className="full-config-wrapper__slide-panel-title">{t("APP_CONFIG_FLOWS")}</div>
                <button className="full-config-wrapper__close-button" onClick={handleCloseSidePanel}>
                  <SVG.Close fill="#787878" />
                </button>
              </div>
              <div className="full-config-wrapper__slide-panel-items-wrapper">
                {flowConfig.flows
                  ?.slice()
                  .sort((a, b) => {
                    const orderA = a?.order ?? Number.MAX_SAFE_INTEGER;
                    const orderB = b?.order ?? Number.MAX_SAFE_INTEGER;
                    return orderA - orderB;
                  })
                  ?.map((flow, index) => (
                    <div
                      key={index}
                      className={`full-config-wrapper__flow-item ${selectedFlow === flow.id ? "full-config-wrapper__flow-item--active" : "full-config-wrapper__flow-item--inactive"
                        }`}
                      onClick={() => handleFlowClick(flow)}
                    >
                      {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flow.name}`))}
                      <div className="full-config-wrapper__flow-item-border" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Center Content - Page Tabs and Preview */}
        <div className="full-config-wrapper__center-content">
          {/* Page Tabs */}
          <div className="full-config-wrapper__page-tabs">
            {activeFlow?.pages?.map((page, index) => (
              <div
                key={index}
                className={`full-config-wrapper__page-tab ${selectedPageName === page.name ? "full-config-wrapper__page-tab--active" : ""}`}
                onClick={() => handlePageClick(page)}
              >
                {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_PAGE_${page.name}`))}
              </div>
            ))}
          </div>

          {/* Preview Area with Navigation Arrows */}
          <div className={`full-config-wrapper__preview-area ${activeSidePanel === "flows" || activeSidePanel === "roles" ? "opened" : ""}`}>
            {/* Flow Tag */}
            <div className="full-config-wrapper__flow-tag">
              {/* <ConversionPath fill="#0057BD" /> */}
              <FlowUnfilled fill="#0057BD" />
              <span>{t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${activeFlow?.name}`))}</span>
            </div>

            {/* Left Arrow */}
            <div
              className={`full-config-wrapper__nav-arrow ${
                !previousRoute ? "full-config-wrapper__nav-arrow--disabled" : "full-config-wrapper__nav-arrow--enabled"
              }`}
              onClick={() => {
                if (previousRoute) {
                  // Reset selected field when navigating backwards
                  dispatch(deselectField());
                  setSelectedPageName(previousRoute);
                }
              }}
            >
              <SVG.ArrowBack />
            </div>

            {/* App Preview with Page Type Tag */}
            <div className="full-config-wrapper__preview-with-tag">
              {/* Page Type Tag */}
              {/* commenting the tag component in app preview screen */}
              {/* {currentPageType && (
                <Tag
                  label={
                    <span style={{ display: "flex", gap: "4px" }}>
                      <span>{currentPageType === "template" ? t("TEMPLATE_SCREEN") : t("FORM_SCREEN")}</span>
                      <span
                        style={
                          currentPageType === "template"
                            ? {
                                fontWeight: 400,
                              }
                            : {
                                fontWeight: 400,
                              }
                        }
                      >
                        {currentPageType === "template" ? t("PARTIALLY_CONFIGURABLE_PARENTHESES") : t("FULLY_CONFIGURABLE_PARENTHESES")}
                      </span>
                    </span>
                  }
                  showIcon={true}
                  type={currentPageType === "template" ? "warning" : "default"}
                  stroke={false}
                  iconColor={currentPageType === "template" ? "#8A4E09" : ""}
                  icon={"DataSet"}
                  labelStyle={
                    currentPageType === "template"
                      ? {
                          color: "#8A4E09",
                          fontFamily: "Roboto",
                          fontWeight: 600,
                          fontStyle: "SemiBold",
                          fontSize: "12px",
                          textAlign: "right",
                        }
                      : {
                          color: "#1C00BD",
                          fontFamily: "Roboto",
                          fontWeight: 600,
                          fontStyle: "SemiBold",
                          fontSize: "12px",
                          textAlign: "right",
                        }
                  }
                  style={
                    currentPageType === "template"
                      ? { backgroundColor: "#FFFCC0", borderRadius: "6px", top: "6px", position: "absolute" }
                      : { backgroundColor: "#EBECFE", borderRadius: "6px", top: "6px", position: "absolute" }
                  }
                />
              )}
 */}
              <AppConfigurationStore
                flow={selectedFlow}
                flowName={activeFlow?.name}
                pageName={selectedPageName}
                campaignNumber={flowConfig?.project}
                onPageChange={setSelectedPageName}
                nextRoute={nextRoute}
                previousRoute={previousRoute}
              />
            </div>

            {/* Right Arrow */}
            <div
              className={`full-config-wrapper__nav-arrow ${
                !nextRoute ? "full-config-wrapper__nav-arrow--disabled" : "full-config-wrapper__nav-arrow--enabled"
              }`}
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

                  // Reset selected field when navigating forward
                  dispatch(deselectField());

                  // Navigate to next page
                  setSelectedPageName(nextRoute);
                }
              }}
            >
              <SVG.ArrowForward />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="full-config-wrapper__bottom-nav">
          {/* <Button
            variation="secondary"
            label={t("BACK")}
            icon="ArrowBack"
            isSuffix={false}
            onClick={() => {
              // Handle back navigation - could go to module selection or previous screen
              navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
            }}
          /> */}
          <Button
            variation="primary"
            label={t("PROCEED_TO_PREVIEW")}
            icon="CheckCircle"
            isSuffix={false}
            onClick={() => {
              // Handle proceed to preview
              saveToAppConfig();
            }}
            style={{marginLeft:"auto"}}
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
