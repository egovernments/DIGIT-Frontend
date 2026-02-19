import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import appConfigStore from "./redux/store";
import { getFieldMaster } from "./redux/fieldMasterSlice";
import AppConfigurationStore from "./AppConfigurationStore";
import { Loader, Button, Toast, Tag, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { checkValidationErrorsAndShowToast } from "./utils/configUtils";
import { SVG ,CustomSVG} from "@egovernments/digit-ui-components";
import { ConversionPath, Earbuds } from "./svg/Flows";
import { deselectField } from "./redux/remoteConfigSlice";
import { FlowFilled } from "../../../components/icons/FlowFilled";
import { FlowUnfilled } from "../../../components/icons/FlowUnfilled";
import AppHelpTutorial from "../../../components/AppHelpTutorial";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

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
  const viewMode = searchParams.get("viewMode") === "true";

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
  const [flowSearchQuery, setFlowSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [formElementSearch, setFormElementSearch] = useState("");
  const [fieldTypeMaster, setFieldTypeMaster] = useState(appConfigStore.getState().fieldTypeMaster?.byName);

  useEffect(() => {
    const mdmsCtx = window?.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") || "egov-mdms-service";
    appConfigStore.dispatch(
      getFieldMaster({ tenantId, moduleName: "HCM-ADMIN-CONSOLE", name: "FieldTypeMappingConfig", mdmsContext: mdmsCtx, limit: 10000 })
    );
    const unsubscribe = appConfigStore.subscribe(() => {
      setFieldTypeMaster(appConfigStore.getState().fieldTypeMaster?.byName);
    });
    return unsubscribe;
  }, [tenantId]);

  const sidePanelRef = useRef(null);
  const sidebarRef = useRef(null);

  // Expose side panel controls to child components via window object
  useEffect(() => {
    window.__appConfig_closeSidePanel = () => {
      setIsClosing(true);
      setTimeout(() => {
        setActiveSidePanel(null);
        setIsClosing(false);
      }, 300);
    };
    window.__appConfig_openSidePanel = (panel = "flows") => {
      setActiveSidePanel(panel);
    };
    return () => {
      delete window.__appConfig_closeSidePanel;
      delete window.__appConfig_openSidePanel;
    };
  }, []);

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
            console.log("Config App Flow: ", configData);
            //OUTPUT:
            /*[
    {
        "id": "searchBeneficiary",
        "name": "searchBeneficiary",
        "type": "template",
        "order": 1,
        "pages": [
            {
                "name": "searchBeneficiary",
                "order": 1,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REGISTRATION",
        "indexRoute": "searchBeneficiary"
    },
    {
        "id": "HOUSEHOLD",
        "name": "HOUSEHOLD",
        "type": "form",
        "order": 2,
        "pages": [
            {
                "name": "HOUSEHOLD.beneficiaryLocation",
                "order": 1,
                "nextRoute": "HOUSEHOLD.householdDetails",
                "previousRoute": null
            },
            {
                "name": "HOUSEHOLD.householdDetails",
                "order": 3,
                "nextRoute": "HOUSEHOLD.beneficiaryDetails",
                "previousRoute": "HOUSEHOLD.beneficiaryLocation"
            },
            {
                "name": "HOUSEHOLD.beneficiaryDetails",
                "order": 4,
                "nextRoute": null,
                "previousRoute": "HOUSEHOLD.householdDetails"
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REGISTRATION",
        "indexRoute": "HOUSEHOLD.beneficiaryLocation"
    },
    {
        "id": "householdOverview",
        "name": "householdOverview",
        "type": "template",
        "order": 3,
        "pages": [
            {
                "name": "householdOverview",
                "order": 3,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REGISTRATION",
        "indexRoute": "householdOverview"
    },
    {
        "id": "ADD_MEMBER",
        "name": "ADD_MEMBER",
        "type": "form",
        "order": 4,
        "pages": [
            {
                "name": "ADD_MEMBER.beneficiaryDetails",
                "order": 4,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REGISTRATION",
        "indexRoute": "ADD_MEMBER.beneficiaryDetails"
    },
    {
        "id": "CHECKLIST",
        "name": "CHECKLIST",
        "type": "form",
        "order": 5,
        "pages": [
            {
                "name": "CHECKLIST.eligibilityChecklist",
                "order": 1,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "DELIVERY",
        "indexRoute": "CHECKLIST.eligibilityChecklist"
    },
    {
        "id": "REFER_BENEFICIARY",
        "name": "REFER_BENEFICIARY",
        "type": "form",
        "order": 6,
        "pages": [
            {
                "name": "REFER_BENEFICIARY.referBeneficiary",
                "order": 1,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REFERRAL",
        "indexRoute": "REFER_BENEFICIARY.referBeneficiary"
    },
    {
        "id": "referralSuccess",
        "name": "referralSuccess",
        "type": "template",
        "order": 7,
        "pages": [
            {
                "name": "referralSuccess",
                "order": 7,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "REFERRAL",
        "indexRoute": "referralSuccess"
    },
    {
        "id": "beneficiaryDetails",
        "name": "beneficiaryDetails",
        "type": "template",
        "order": 8,
        "pages": [
            {
                "name": "beneficiaryDetails",
                "order": 8,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "DELIVERY",
        "indexRoute": "beneficiaryDetails"
    },
    {
        "id": "DELIVERY",
        "name": "DELIVERY",
        "type": "form",
        "order": 9,
        "pages": [
            {
                "name": "DELIVERY.DeliveryDetails",
                "order": 1,
                "nextRoute": "DELIVERY.DeliveryChecklist",
                "previousRoute": null
            },
            {
                "name": "DELIVERY.DeliveryChecklist",
                "order": 2,
                "nextRoute": null,
                "previousRoute": "DELIVERY.DeliveryDetails"
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "DELIVERY",
        "indexRoute": "DELIVERY.DeliveryDetails"
    },
    {
        "id": "deliverySuccess",
        "name": "deliverySuccess",
        "type": "template",
        "order": 10,
        "pages": [
            {
                "name": "deliverySuccess",
                "order": 10,
                "nextRoute": null,
                "previousRoute": null
            }
        ],
        "roles": [],
        "project": "CMP-2026-02-19-007480",
        "category": "DELIVERY",
        "indexRoute": "deliverySuccess"
    }
]*/ 
          if (configData.flows && configData.flows.length > 0) {
            const firstFlow = configData.flows[0];
            setSelectedFlow(firstFlow.id);
            setSelectedPageName(firstFlow.indexRoute || firstFlow.pages?.[0]?.name);
          }
        } else {
          setError(t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_NO_FLOW_CONFIG_FOUND));
        }
      } catch (err) {
        console.error("Error fetching flow config:", err);
        setError(t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FAILED_TO_FETCH_FLOW_CONFIG));
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
    if (!viewMode) {
      // Check for validation errors before switching
      if (checkValidationErrorsAndShowToast(setShowToast, t)) {
        return;
      }

      // Call MDMS update for current screen before switching
      if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
        await window.__appConfig_onNext();
      }
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
    if (!viewMode) {
      // Check for validation errors before switching
      if (checkValidationErrorsAndShowToast(setShowToast, t)) {
        return;
      }

      // Call MDMS update for current screen before switching page
      if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
        await window.__appConfig_onNext();
      }
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

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Initialize collapsed state: only the first category expanded
  useEffect(() => {
    if (!flowConfig?.flows) return;

    const sorted = flowConfig.flows.slice().sort((a, b) => (a?.order ?? Infinity) - (b?.order ?? Infinity));
    const seen = new Set();
    const cats = [];
    sorted.forEach((flow) => {
      const cat = flow.category || "UNCATEGORIZED";
      if (!seen.has(cat)) {
        seen.add(cat);
        cats.push(cat);
      }
    });

    const collapsed = {};
    cats.forEach((cat, i) => {
      if (i > 0) collapsed[cat] = true;
    });
    setCollapsedCategories(collapsed);
  }, [flowConfig]);

  const groupedFlows = useMemo(() => {
    if (!flowConfig?.flows) return [];

    const sorted = flowConfig.flows.slice().sort((a, b) => {
      const orderA = a?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b?.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    const query = flowSearchQuery.trim().toLowerCase();
    const filtered = query
      ? sorted.filter((flow) => {
          const flowLabel = t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flow.name}`));
          return flowLabel.toLowerCase().includes(query);
        })
      : sorted;

    const categoryOrder = [];
    const categoryMap = {};

    filtered.forEach((flow) => {
      const cat = flow.category || "UNCATEGORIZED";
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
        categoryOrder.push(cat);
      }
      categoryMap[cat].push(flow);
    });

    return categoryOrder.map((cat) => ({
      category: cat,
      flows: categoryMap[cat],
    }));
  }, [flowConfig, flowSearchQuery, t]);

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
        <h2>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ERROR)}</h2>
        <p>{error || t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FAILED_TO_LOAD_FLOW_CONFIG)}</p>
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
          label={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
          title={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
          className="full-config-wrapper__back-button"
          onClick={() => {
            navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}${viewMode ? "&viewMode=true" : ""}`);
          }}
          size={"medium"}
        />
        <div className="full-config-wrapper__flow-name-header">
          {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flowModule}`))}
          <span style={{fontSize: "0.75rem", marginTop: "0.375rem"}}> ({`${t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_VERSION)} - ${version}`})</span>
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
              activeSidePanel === "flows" ? "full-config-wrapper__sidebar-menu-item--active" : ""
            }`}
            onClick={() => handleToggleSidePanel("flows")}
          >
            {/* <Earbuds fill="#0B4B66" /> */}
            {activeSidePanel === "flows" ? <FlowFilled/> : <FlowUnfilled/>}
            <span>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FLOWS)}</span>
          </div>
          <div
            className={`full-config-wrapper__sidebar-menu-item ${currentPageType === "template" ? "roles-disabled" : ""} ${
              activeSidePanel === "formelements" ? "full-config-wrapper__sidebar-menu-item--active" : ""
            }`}
            onClick={() => handleToggleSidePanel("formelements")}
          >
            {activeSidePanel === "formelements" ? <FlowFilled/> : <FlowUnfilled fill={currentPageType === "template" ? "#B1B4B6" : undefined}/>}
            <span>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FORMELEMENTS)}</span>
          </div>
          <div
            className={`full-config-wrapper__sidebar-menu-item roles-disabled${
              activeSidePanel === "roles" ? "full-config-wrapper__sidebar-menu-item--active" : ""
            }`}
            onClick={() => handleToggleSidePanel("roles")}
          >
            {activeSidePanel === "roles" ? <SVG.Person fill="#B1B4B6" /> : <SVG.PersonOutline fill="#B1B4B6" />}

            <span>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ROLES)}</span>
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
                <div className="full-config-wrapper__slide-panel-title disabled">{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ROLES)}</div>
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
                  <div className="full-config-wrapper__no-roles">{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_NO_ROLES_ASSIGNED)}</div>
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
                <div className="full-config-wrapper__slide-panel-title">{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FLOWS)}</div>
                <button className="full-config-wrapper__close-button" onClick={handleCloseSidePanel}>
                  <SVG.Close fill="#787878" />
                </button>
              </div>
              <div className="full-config-wrapper__slide-panel-items-wrapper">
                <div className="full-config-wrapper__flow-search">
                  <div className="full-config-wrapper__flow-search-container">
                    <SVG.Search fill="#787878" />
                    <input
                      className="full-config-wrapper__flow-search-input"
                      placeholder={t("SEARCH_FLOW")}
                      value={flowSearchQuery}
                      onChange={(e) => setFlowSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {groupedFlows.map((group) => {
                  const isExpanded = flowSearchQuery ? true : !collapsedCategories[group.category];
                  const isSingleFlow = group.flows.length === 1;

                  // Single-flow category: render as flat flow item without category header
                  if (isSingleFlow) {
                    const flow = group.flows[0];
                    return (
                      <div key={group.category} className="full-config-wrapper__category-group">
                        <div
                          className={`full-config-wrapper__flow-item ${
                            selectedFlow === flow.id ? "full-config-wrapper__flow-item--active" : "full-config-wrapper__flow-item--inactive"
                          }`}
                          onClick={() => handleFlowClick(flow)}
                        >
                          {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flow.name}`))}
                        </div>
                      </div>
                    );
                  }

                  // Multi-flow category: render with collapsible header
                  return (
                    <div key={group.category} className="full-config-wrapper__category-group">
                      <div
                        className="full-config-wrapper__category-header"
                        onClick={() => !flowSearchQuery && toggleCategory(group.category)}
                      >
                        <span className="full-config-wrapper__category-title">
                          {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_CATEGORY_${group.category}`))}
                        </span>
                        <span
                          className={`full-config-wrapper__category-chevron ${
                            !isExpanded ? "full-config-wrapper__category-chevron--collapsed" : ""
                          }`}
                        >
                          <SVG.ArrowDropDown fill="#0B4B66" width="20" height="20" />
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="full-config-wrapper__category-flows">
                          {group.flows.map((flow) => (
                            <div
                              key={flow.id}
                              className={`full-config-wrapper__flow-item ${
                                selectedFlow === flow.id ? "full-config-wrapper__flow-item--active" : "full-config-wrapper__flow-item--inactive"
                              }`}
                              onClick={() => handleFlowClick(flow)}
                            >
                              {t(Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_FLOW_${flow.name}`))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Panel for FormElements */}
        {activeSidePanel === "formelements" && (
          <div
            ref={sidePanelRef}
            className={`full-config-wrapper__side-panel-wrapper ${
              activeSidePanel === "formelements" && !isClosing ? "full-config-wrapper__side-panel-wrapper--open" : ""
            }`}
          >
            <div
              className={`full-config-wrapper__side-panel-slide ${
                isClosing ? "full-config-wrapper__side-panel-slide--slide-out" : "full-config-wrapper__side-panel-slide--slide-in"
              }`}
            >
              <div className="full-config-wrapper__slide-panel-header">
                <div className="full-config-wrapper__slide-panel-title">{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_FORMELEMENTS)}</div>
                <button className="full-config-wrapper__close-button" onClick={handleCloseSidePanel}>
                  <SVG.Close fill="#787878" />
                </button>
              </div>
              <div className="full-config-wrapper__slide-panel-items-wrapper">
                {/* Search box */}
                <div className="form-elements__search-wrapper">
                  <div className="form-elements__search-input-container">
                    <SVG.Search fill="#787878" />
                    <input
                      className="form-elements__search-input"
                      placeholder={t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_SEARCH_FORM_FIELDS)}
                      value={formElementSearch}
                      onChange={(e) => setFormElementSearch(e.target.value)}
                    />
                  </div>
                </div>
                {/* Field type groups from master data */}
                {(() => {
                  const FIELD_TYPE_ICON_MAP = {
                    // Basic
                    checkbox: "CheckboxSVG",
                    date: "Calendar",
                    dob: "Calendar",
                    dropdown: "EventList",
                    mobileNumber: "Call",
                    number: "Numeric123",
                    numeric: "Numeric123",
                    radio: "RadioButtonChecked",
                    text: "FontDownload",
                    textarea: "TextAd",
                    // Advanced
                    idPopulator: "Badge",
                    latLng: "GpsFixed",
                    locality: "LocationCity",
                    qrScanner: "QrCodeScanner",
                    selectionTag: "Dashboard",
                  };

                  // Same filter as the "Add Field" popup in AppConfigurationWrapper
                  const allItems = (fieldTypeMaster?.fieldTypeMappingConfig || []).filter((item) => {
                    if (item?.metadata?.type === "dynamic") return false;
                    if (currentPageType === "object" && item?.metadata?.type === "template") return false;
                    return true;
                  });
                  const searchLower = formElementSearch.toLowerCase();
                  const filtered = formElementSearch
                    ? allItems.filter(
                        (item) =>
                          item.type?.toLowerCase().includes(searchLower) ||
                          t(`${item.category}.${item.type}`)?.toLowerCase().includes(searchLower)
                      )
                    : allItems;
                  const categoryOrder = ["basic", "advanced"];
                  const categories = [...new Set(filtered.map((item) => item.category))].sort((a, b) => {
                    const oa = categoryOrder.indexOf(a);
                    const ob = categoryOrder.indexOf(b);
                    return (oa === -1 ? 999 : oa) - (ob === -1 ? 999 : ob);
                  });
                  const groups = categories
                    .map((cat) => ({
                      code: cat,
                      name:
                        cat === "basic"
                          ? t(I18N_KEYS.APP_CONFIGURATION.FIELD_CATEGORY_BASIC)
                          : cat === "advanced"
                          ? t(I18N_KEYS.APP_CONFIGURATION.FIELD_CATEGORY_ADVANCED)
                          : t(cat),
                      options: filtered.filter((item) => item.category === cat),
                    }))
                    .filter((g) => g.options.length > 0);

                  if (groups.length === 0) {
                    return (
                      <div className="form-elements__no-results">
                        {t("NO_RESULTS_FOUND")}
                      </div>
                    );
                  }

                  return groups.map((group) => (
                    <div key={group.code} className="form-elements__category-section">
                      <div className="form-elements__category-title app-config-group-heading">
                        {group.name}
                      </div>
                      <div className="form-elements__items-grid">
                        {group.options.map((item) => {
                          const iconName = FIELD_TYPE_ICON_MAP[item.type];
                          const IconComponent = iconName ? (SVG[iconName] || CustomSVG[iconName]) : null;
                          return (
                            <div key={item.type} className="form-elements__type-card" onClick={() => window.__appConfig_openAddFieldPopup?.(item)}>
                              <div className="form-elements__type-card-icon">
                                {IconComponent ? (
                                  <IconComponent fill="#0B4B66" />
                                ) : (
                                  <span className="form-elements__type-card-fallback">
                                    {item.type?.[0]?.toUpperCase() || "?"}
                                  </span>
                                )}
                              </div>
                              <span className="form-elements__type-card-label">
                                {t(`${item.category}.${item.type}`)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <hr style={{border: "1px solid #DBE7EC",width:"100%",marginBottom:"1rem"}}></hr>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Center Content - Page Tabs and Preview */}
        <div className="full-config-wrapper__center-content">
          {/* Page Tabs */}
          <div className={`full-config-wrapper__page-tabs-${activeSidePanel === "flows" || activeSidePanel === "roles" ? "opened" : "closed"}`}>
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
                viewMode={viewMode}
              />
            </div>

            {/* Right Arrow */}
            <div
              className={`full-config-wrapper__nav-arrow ${
                !nextRoute ? "full-config-wrapper__nav-arrow--disabled" : "full-config-wrapper__nav-arrow--enabled"
              }`}
              onClick={async () => {
                if (nextRoute) {
                  if (!viewMode) {
                    // Check for validation errors before navigating
                    if (checkValidationErrorsAndShowToast(setShowToast, t)) {
                      return;
                    }

                    // Call MDMS update if available
                    if (window.__appConfig_onNext && typeof window.__appConfig_onNext === "function") {
                      await window.__appConfig_onNext();
                    }
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
        <Footer
          actionFields={[
            viewMode ? (
              <Button
                variation="secondary"
                icon="ArrowBack"
                label={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
                title={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
                onClick={() => {
                  navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}&viewMode=true`);
                }}
              />
            ) : (
              <Button
                variation="primary"
                label={t(I18N_KEYS.APP_CONFIGURATION.PROCEED_TO_PREVIEW)}
                title={t(I18N_KEYS.APP_CONFIGURATION.PROCEED_TO_PREVIEW)}
                icon="CheckCircle"
                isSuffix={false}
                onClick={() => {
                  saveToAppConfig();
                }}
              />
            ),
          ]}
          setactionFieldsToRight={true}
        />
        {/* Toast Notification */}
        {showToast && (
          <Toast type={showToast?.key === "error" ? "error" : "success"} label={t(showToast?.label)} onClose={() => setShowToast(null)} />
        )}
      </div>
    </React.Fragment>
  );
};

export default FullConfigWrapper;
