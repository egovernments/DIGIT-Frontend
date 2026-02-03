import React, { useMemo, useState, useEffect } from "react";
import { InboxSearchComposer, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import PGRSearchInboxConfig from "../../configs/PGRSearchInboxConfig";
import { useLocation } from "react-router-dom";

/**
 * PGRSearchInbox - Complaint Search Inbox Screen
 *
 * Purpose:
 * This screen renders a search interface to view and filter PGR (Public Grievance Redressal) complaints.
 *
 * Functional Areas:
 * - Initial Data Load: On screen load, the system fetches a list of complaint filters and configurations (from MDMS or fallback).
 * - Filter Section: Allows filtering by complaint type, assignee, status, and boundary.
 * - Search Section: Enables searching by complaint number, date, and phone.
 * - Link Section: Provides a way to navigate to complaint creation.
 *
 * Components Used:
 * - InboxSearchComposer: A reusable inbox search builder UI.
 * - Loader: Shows a loader until configs and metadata are loaded.
 * - HeaderComponent: Displays the heading.
 *
 * Data Dependencies:
 * - MDMS (RAINMAKER-PGR.SearchInboxConfig)
 * - Service Definitions from PGR module
 */

const PGRSearchInbox = () => {
  const { t } = useTranslation();

  // Detect if the user is on a mobile device
  const isMobile = window.Digit.Utils.browser.isMobile();

  // Get current ULB tenant ID
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Get state tenant ID for localization
  const stateTenantId = Digit.ULBService.getStateId();

  // Get current language for localization
  const language = Digit.StoreData.getCurrentLanguage();

  // Local state to hold the inbox page configuration (filter/search UI structure)
  const [pageConfig, setPageConfig] = useState(null);

  // Used to detect route/location changes to trigger config reset
  const location = useLocation();

  // Get selected hierarchy from session storage
  // Get selected hierarchy from session storage
  const [selectedHierarchy, setSelectedHierarchy] = useState(Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED") || null);

  // Construct module code for localization fetch
  const moduleCode = selectedHierarchy ? [`boundary-${selectedHierarchy?.hierarchyType?.toLowerCase()}`] : [];

  // Fetch localization data for the selected hierarchy
  // This loads boundary localizations from the module: hcm-boundary-{hierarchyType}
  const { isLoading: isLocalizationLoading } = Digit.Services.useStore({
    stateCode: stateTenantId,
    moduleCode,
    language,
    modulePrefix: "hcm",
    config: { enabled: !!selectedHierarchy && moduleCode.length > 0 },
  });

  // Fetch MDMS config for inbox screen (RAINMAKER-PGR.SearchInboxConfig)
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "RAINMAKER-PGR", ["SearchInboxConfig"], {
    select: (data) => {
      return data?.["RAINMAKER-PGR"]?.SearchInboxConfig?.[0];
    },
    retry: false,
    enable: false, // Disabled fetch by default, fallback to static config
  });

  // Fallback to static config if MDMS is not available
  const configs = PGRSearchInboxConfig();

  // Fetch the list of service definitions (e.g., complaint types) for current tenant
  const serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");

  /**
   * Preprocess config using translation and inject complaint types into the serviceCode dropdown
   */
  const updatedConfig = useMemo(
    () =>
      Digit.Utils.preProcessMDMSConfigInboxSearch(t, pageConfig, "sections.filter.uiConfig.fields", {
        updateDependent: [
          {
            key: "serviceCode",
            value: serviceDefs ? [...serviceDefs] : [],
          },
        ],
      }),
    [pageConfig, serviceDefs]
  );

  /**
   * Reset or refresh config when the route changes
   */
  useEffect(() => {
    setPageConfig(_.cloneDeep(configs));
  }, [location]);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "pgr-filter-header-force-show";

    style.innerHTML = `
    /* FORCE RENDER FILTER HEADER */
    .digit-inbox-search-wrapper .filter-header {
      display: flex !important;
      align-items: center !important;
      visibility: visible !important;
      height: auto !important;
      opacity: 1 !important;
      padding: 12px 16px !important;
      border-radius: 8px 8px 0 0 !important;
    }

    .digit-inbox-search-wrapper .filter-header .title-container {
      display: flex !important;
      align-items: center !important;
      gap: 8px;
    }

    .digit-inbox-search-wrapper .filter-header .filter-title {
      font-weight: 600;
      font-size: 20px;
    }
  `;

    document.head.appendChild(style);

    return () => {
      document.getElementById("pgr-filter-header-force-show")?.remove();
    };
  }, []);

  /**
   * Show loader until necessary data is available
   */
  if (isLoading || isLocalizationLoading || !pageConfig || serviceDefs?.length === 0) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        {
          <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem", position: "relative", right: "0.5rem" }}>
            {t("PGR_SEARCH_RESULTS_HEADING")}
          </HeaderComponent>
        }
      </div>

      {/* Complaint search and filter interface */}
      <div className="digit-inbox-search-wrapper pgr-inbox-wrapper">
        <InboxSearchComposer configs={updatedConfig} />
      </div>
    </div>
  );
};

export default PGRSearchInbox;
