import { DownloadIcon, FilterIcon, MultiLink, ShareIcon } from "@egovernments/digit-ui-react-components";
import { format, differenceInDays } from "date-fns";
import React, { useEffect, Fragment, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import FilterContext from "../../components/FilterContext";
import Filters from "../../components/Filters";
import FiltersNational from "../../components/FiltersNational";
import Layout from "../../components/Layout";
import ProgressBar from "../../components/ProgressBar";
import { getTitleHeading } from "../../utils/locale";
import { Loader, Chip, Button } from "@egovernments/digit-ui-components";
import { HeaderComponent } from "@egovernments/digit-ui-components";
import { getDuration } from "../../utils/getDuration";
import { PDFDownload } from "../../utils/PDFDownload";

const nationalScreenURLs = {
  overview: { key: "national-overview", stateKey: "overview", label: "NURT_OVERVIEW", active: true, nActive: true },
  propertytax: { key: "national-propertytax", stateKey: "propertytax", label: "NURT_PROPERTY_TAX", active: true, nActive: true },
  tradelicense: { key: "national-tradelicense", stateKey: "tradelicense", label: "NURT_TRADE_LICENCE", active: true, nActive: true },
  pgr: { key: "national-pgr", stateKey: "pgr", label: "NURT_COMPLAINS", active: true, nActive: true },
  fsm: { key: "fsm", stateKey: "fsm", label: "CS_HOME_FSM_SERVICES", active: true, nActive: false },
  mCollect: { key: "national-mcollect", stateKey: "mCollect", label: "NURT_MCOLLECT", active: true, nActive: true },
  ws: { key: "national-ws", stateKey: "ws", label: "NURT_WATER_SEWERAGE", active: true, nActive: true },
  obps: { key: "nss-obps", stateKey: "obps", label: "DSS_BUILDING_PERMISSION", active: true, nActive: true },
  noc: { key: "national-firenoc", stateKey: "noc", label: "NURT_FIRENOC", active: true, nActive: true },
  bnd: { key: "nss-birth-death", stateKey: "birth-death", label: "BIRTH_AND_DEATH", active: true, nActive: true },
  faqs: { key: "national-faqs", stateKey: "national-faqs", label: "DSS_FAQS", active: false, nActive: true, others: true },
  finance: { key: "national-finance", stateKey: "finance", label: "DSS_FINANCE", active: true, nActive: false },
  about: { key: "national-about", stateKey: "national-about", label: "DSS_ABOUT_DASHBOARD", active: false, nActive: true, others: true },
};

const checkCurrentScreen = () => {
  const moduleName = Digit.Utils.dss.getCurrentModuleName();
  const nationalURLS = Object.keys(nationalScreenURLs).map((key) => nationalScreenURLs[key].key);
  return nationalURLS.filter((ele) => ele !== "fsm").some((e) => moduleName?.includes(e));
};

const key = "DSS_FILTERS";

const getInitialRange = () => {
  const location = useLocation();
  const campaignData = Digit.SessionStorage.get("campaignSelected");
  const projectData = Digit.SessionStorage.get("projectSelected");
  const projectType = getProjectTypeFromSession();
  const boundaryType = new URLSearchParams(location.search).get("boundaryType");
  const boundaryValue = new URLSearchParams(location.search).get("boundaryValue");
  if (!Digit.SessionStorage.get(key)) {
    Digit.SessionStorage.set(key, {});
  }
  overrideDescendantDateRange(boundaryValue);
  let data = Digit.SessionStorage.get(key);
  let filteredInfo = null;
  let startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  let endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  if (filteredInfo && filteredInfo?.length !== 0) {
    startDate = new Date(filteredInfo?.[0]["startDate"]);
    endDate = new Date(filteredInfo?.[0]["endDate"]);
  }
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const interval = getDuration(startDate, endDate);
  const denomination = data?.denomination || "Lac";
  const dateFilterSelected = "DSS_TODAY";
  const tenantId = data?.filters?.tenantId || [];
  const moduleLevel = data?.moduleLevel || "";
  const cycle= projectData?.project?.additionalDetails?.projectType?.cycles || null;

  let boundaries;
  if (campaignData && projectType) {
    let data = campaignData[projectType];
    if (data) {
      let descendantDateRange = Digit.SessionStorage.get("descendantDateRange");
      startDate = data?.[0].startDate ? new Date(data?.[0].startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
      endDate = data?.[0].endDate ? new Date(data?.[0].endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
      boundaries = data?.[0].boundaries;
      if (descendantDateRange?.[boundaryValue]) {
        startDate = new Date(descendantDateRange[boundaryValue]?.startDate);
        endDate = new Date(descendantDateRange[boundaryValue]?.endDate);
      }
      if (filteredInfo !== null && filteredInfo?.length !== 0) {
        startDate = new Date(filteredInfo[0]["startDate"]);
        endDate = new Date(filteredInfo[0]["endDate"]);
      }
      return { startDate, endDate, title, interval, denomination, dateFilterSelected, tenantId, moduleLevel, boundaries };
    }
  }
  return { startDate, endDate, title, interval, denomination, dateFilterSelected, tenantId, moduleLevel };
};

const overrideDescendantDateRange = (boundaryValue) => {
  let dssFilters = {};
  Object.assign(dssFilters, Digit.SessionStorage.get(key));
  let descendantDateRange = Digit.SessionStorage.get("descendantDateRange");
if (
  dssFilters?.filters &&
  dssFilters?.range &&
  descendantDateRange?.[boundaryValue]
) {
  const startRaw = descendantDateRange[boundaryValue]?.startDate;
  const endRaw = descendantDateRange[boundaryValue]?.endDate;
  const startDate = new Date(startRaw);
  const endDate = new Date(endRaw);
  const isStartValid = startDate instanceof Date && !isNaN(startDate);
  const isEndValid = endDate instanceof Date && !isNaN(endDate);
  if (isStartValid && isEndValid) {
    dssFilters["filters"]["campaignStartDate"] = startRaw?.toString();
    dssFilters["filters"]["campaignEndDate"] = endRaw?.toString();
    dssFilters["range"]["startDate"] = startDate.toISOString();
    dssFilters["range"]["endDate"] = endDate.toISOString();
    Digit.SessionStorage.set(key, dssFilters);
  } else {
    console.warn("Invalid date range found in descendantDateRange", {
      startRaw,
      endRaw,
    });
  }
}
};

function getProjectTypeIDFromURL() {
  const url = window.location.pathname;
  const projectTypes = Digit.SessionStorage.get("projectTypes");
  const matchingProject = projectTypes?.find(
    (item) => item?.dashboardUrls && Object.values(item?.dashboardUrls)?.some((dashboardUrl) => url === dashboardUrl)
  );

  // Return the id of the matching object or null if not found
  const projectTypeId = matchingProject ? matchingProject.id : null;
  return projectTypeId;
}

function getProjectTypeFromSession() {
  const projectTypeSession = Digit.SessionStorage.get("projectSelected")?.project?.projectType;
  // Return the id of the matching object or null if not found
  const projectTypeCode = projectTypeSession ? projectTypeSession : null;
  return projectTypeCode;
}
const L2Main = ({}) => {
  const location = useLocation();
  const stateCode = Digit?.ULBService?.getStateId();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { t } = useTranslation();
  const projectTypeId = getProjectTypeIDFromURL();
  const boundaryType = new URLSearchParams(location.search).get("boundaryType");
  const boundaryValue = new URLSearchParams(location.search).get("boundaryValue");  
  const campaignData = Digit.SessionStorage.get("campaignSelected");
  const projectData= Digit.SessionStorage.get("projectSelected");
  const campaignNumber = new URLSearchParams(location.search).get("campaignNumber");
  const [filters, setFilters] = useState(() => {
    const {
      startDate,
      endDate,
      title,
      interval,
      denomination,
      dateFilterSelected,
      tenantId,
      moduleLevel,
      boundaries,
    } = getInitialRange();
    const dynamicBoundaryFilter = boundaryType && boundaryValue ? { [boundaryType]: boundaryValue || null, "boundaryType" : boundaryType} : {};
    return {
      denomination,
      dateFilterSelected,
      range: { startDate, endDate: new Date(), title, interval },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: Digit.Utils.dss.getDefaultFinacialYear().endDate.getTime(),
        interval: interval,
        title: title,
      },
      filters: {
        tenantId,
        campaignStartDate: startDate?.getTime()?.toString(),
        campaignEndDate: endDate?.getTime()?.toString(),
        projectTypeId: projectTypeId,
        campaignNumber : campaignNumber,
        ...dynamicBoundaryFilter,
   
      },
      moduleLevel: moduleLevel,
    };
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isNational = checkCurrentScreen();
  const { moduleCode } = useParams();

  const language = Digit.StoreData.getCurrentLanguage();

  // const { isLoading: localizationLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const { data: screenConfig, isLoading: isServicesLoading } = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard", {
    select: (data) => {
      let screenConfig = data?.["dss-dashboard"]["dashboard-config"][0].MODULE_LEVEL;
      let reduced_array = [];
      for (let i = 0; i < screenConfig?.length; i++) {
        if (screenConfig?.[i]?.dashboard !== null) {
          reduced_array.push(screenConfig?.[i]);
        }
      }

      const serviceJS = reduced_array.map((obj, idx) => {
        return {
          code: obj[Object.keys(obj)[0]].filterKey,
          name: Digit.Utils.locale.getTransformedLocale(`DSS_${obj[Object.keys(obj)[0]].services_name}`),
        };
      });
      return serviceJS;
    },
  });
  const { data: nationalInfo, isLoadingNAT } = Digit.Hooks.dss.useMDMS(stateCode, "tenant", ["nationalInfo"], {
    select: (data) => {
      let nationalInfo = data?.tenant?.nationalInfo || [];
      let combinedResult = nationalInfo.reduce((acc, curr) => {
        if (acc[curr.stateCode]) {
          acc[curr.stateCode].push(curr);
        } else {
          acc[curr.stateCode] = [curr];
        }
        return { ...acc };
      }, {});
      let formattedResponse = { ddr: [], ulb: [] };
      Object.keys(combinedResult).map((key) => {
        let stateName = combinedResult[key]?.[0].stateName;
        formattedResponse.ddr.push({ code: key, ddrKey: stateName, ulbKey: stateName });
        formattedResponse.ulb.push(...combinedResult[key].map((e) => ({ code: e.code, ulbKey: e.name, ddrKey: e.stateName })));
      });
      return formattedResponse;
    },
    enabled: isNational,
  });

  const reqCriteria = {
    url: `/dashboard-analytics/dashboard/getDashboardConfig/${moduleCode}`,
    changeQueryName: moduleCode,
    body: {},
    params: {
      tenantId,
    },
    headers: {
      "auth-token": Digit.UserService.getUser()?.access_token || null,
    },
    method: "GET",
    config: {
      enabled: !!moduleCode,
      select: (data) => {
        return data;
      },
    },
  };
  const { data: response, isLoading } = Digit.Hooks.DSS.useAPIHook(reqCriteria);
  const { data: ulbTenants, isLoading: isUlbLoading } = Digit.Hooks.useModuleTenants("DSS");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [tabState, setTabState] = useState("");
  const { search } = useLocation();
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [pageZoom, setPageZoom] = useState(false);

  useEffect(() => {
    if (showDownloadOptions === false) {
      setPageZoom(true);
      const timeoutId = setTimeout(() => {
        setPageZoom(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showDownloadOptions]);

  const [progressDuration, setProgressDuration] = useState({ campaignDuration: 0, daysElapsed: 0 });
  const campaignInfo = Digit.SessionStorage.get("campaigns-info");
  const projectType = getProjectTypeFromSession();

  const handleFilters = (data) => {
    const userInfo = Digit.UserService.getUser()?.info;
    const boundaryType = new URLSearchParams(location.search).get("boundaryType");
    const boundaryValue = new URLSearchParams(location.search).get("boundaryValue");
    const eligibleRolesForFilter = {
      NATIONAL_SUPERVISOR: true,
      PROVINCIAL_SUPERVISOR: true,
    };

    const userRoles = userInfo?.roles?.filter((role) => eligibleRolesForFilter[role.code]);
    let updatedData = data;
    if (userRoles?.length) {
      let updatedFilters = {
        ...data.filters,
      };

      if (boundaryValue && campaignInfo?.[projectType]?.boundaries?.[boundaryType]?.includes(boundaryValue)) {
        updatedFilters = {
          ...updatedFilters,
          boundaryValue,
        };
      }

      updatedData = {
        ...data,
        filters: updatedFilters,
      };
    }
    let descendantDateRange = Digit.SessionStorage.get("descendantDateRange");
    if (updatedData?.filters && descendantDateRange?.[boundaryValue]) {
      updatedData["filters"]["campaignStartDate"] = descendantDateRange?.[boundaryValue]?.startDate?.toString();
      updatedData["filters"]["campaignEndDate"] = descendantDateRange?.[boundaryValue]?.endDate?.toString();
    }
    Digit.SessionStorage.set(key, updatedData);
    setFilters(updatedData);
    const sessionCampaignDates = JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value?.filters;
    if (sessionCampaignDates?.campaignStartDate && sessionCampaignDates?.campaignEndDate) {
      setShowProgressBar(true);
      setProgressDuration(getValuesForProgressBar);
    }
  };
  const fullPageRef = useRef();
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
      ulbTenants: isNational ? nationalInfo : ulbTenants,
      screenConfig: screenConfig,
    }),
    [filters, isUlbLoading, isServicesLoading]
  );

  const mobileView = window.Digit.Utils.browser.isMobile();

  const handlePrint = () => Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));

  const removeULB = (id) => {
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, tenantId: [...filters?.filters?.tenantId].filter((tenant, index) => index !== id) },
    });
  };
  const removeST = (id) => {
    let newStates = [...filters?.filters?.state].filter((tenant, index) => index !== id);
    let newUlbs = filters?.filters?.ulb || [];
    if (newStates?.length == 0) {
      newUlbs = [];
    } else {
      let filteredUlbs = nationalInfo?.ulb?.filter((e) => Digit.Utils.dss.getCitiesAvailable(e, newStates))?.map((ulbs) => ulbs?.code);
      newUlbs = newUlbs.filter((ulb) => filteredUlbs.includes(ulb));
    }
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, state: newStates, ulb: newUlbs },
    });
  };

  const removeService = () => {
    handleFilters({
      ...filters,
      moduleLevel: "",
    });
  };

  const removeTenant = (id) => {
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, ulb: [...filters?.filters?.ulb].filter((tenant, index) => index !== id) },
    });
  };

  const handleClear = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, tenantId: [] } });
  };

  const clearAllTn = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, ulb: [] } });
  };
  const clearAllSt = () => {
    handleFilters({ ...filters, filters: { ...filters?.filters, state: [], ulb: [] } });
  };
  const clearAllServices = () => {
    handleFilters({ ...filters, moduleLevel: "" });
  };

  const dashboardConfig = response?.responseData;
  const hideFilterFields = dashboardConfig?.[0]?.hideFilterFields || [];
  let tabArrayObj =
    dashboardConfig?.[0]?.visualizations?.reduce((curr, acc) => {
      curr[acc.name] = 0;
      return { ...curr };
    }, {}) || {};
  let tabArray = Object.keys(tabArrayObj).map((key) => key);

  useEffect(() => {
    if (tabArray?.length > 0 && tabState == "") {
      setTabState(tabArray[0]);
    }
  }, [tabArray]);

  const getValuesForProgressBar = () => {
    const campaignStartDate = new Date(Number(JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value?.filters?.campaignStartDate));
    const campaignEndDate = new Date(Number(JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value?.filters?.campaignEndDate));
    const campaignDuration = differenceInDays(campaignEndDate, campaignStartDate);
    const daysElapsed = differenceInDays(new Date().getTime() <= campaignEndDate.getTime() ? new Date() : campaignEndDate, campaignStartDate);
    return { campaignDuration: campaignDuration, daysElapsed: daysElapsed };
  };

  const shareOptions = navigator.share
    ? [
        {
          code: "ES_DSS_SHARE_PDF",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          code: "ES_DSS_SHARE_IMAGE",
          label: t("ES_DSS_SHARE_IMAGE"),
        },
      ]
    : [
        {
          icon: "EmailIcon",
          code: "ES_DSS_SHARE_PDF_EMAIL",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "WhatsappIcon",
          code: "ES_DSS_SHARE_PDF_WHATSAPP",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "EmailIcon",
          label: t("ES_DSS_SHARE_IMAGE"),
          code: "ES_DSS_SHARE_IMAGE_EMAIL",
        },
        {
          icon: "WhatsappIcon",
          label: t("ES_DSS_SHARE_IMAGE"),
          code: "ES_DSS_SHARE_IMAGE_WHATSAPP",
        },
      ];

  const downloadOptions = [
    {
      icon: "ImageIcon",
      code: "ES_DSS_DOWNLOAD_IMAGE",
      label: t("ES_DSS_DOWNLOAD_IMAGE"),
    },
    {
      icon: "PDFSvg",
      label: t("ES_DSS_DOWNLOAD_PDF"),
      code: "ES_DSS_DOWNLOAD_PDF",
    },
  ];

  const onActionSelect = (item) => {
    switch (item?.code) {
      case "ES_DSS_DOWNLOAD_IMAGE":
        setTimeout(() => {
          return Digit.Download.Image(fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_DOWNLOAD_PDF":
        setTimeout(() => {
          return PDFDownload(fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF_EMAIL":
        setTimeout(() => {
          return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF_WHATSAPP":
        setTimeout(() => {
          return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE_EMAIL":
        setTimeout(() => {
          return Digit.ShareFiles.DownloadImage(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE_WHATSAPP":
        setTimeout(() => {
          return Digit.ShareFiles.DownloadImage(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF":
        setTimeout(() => {
          return Digit.ShareFiles.DownloadImage(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE":
        setTimeout(() => {
          return Digit.ShareFiles.DownloadImage(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
    }
  };

  if (isLoading || isUlbLoading || isLoadingNAT || isServicesLoading) {
    return <Loader className={"digit-center-loader"} />;
  }

  const boundaryName = boundaryValue

  return (
    <FilterContext.Provider value={provided}>
      <div ref={fullPageRef} id="divToPrint">
        <div className="digit-dss-options-header-wrapper">
          <HeaderComponent className={"digit-dss-options-header-text level-two"}>
            {t(dashboardConfig?.[0]?.name)}
            {boundaryName && <span className="digit-dss-options-header-boundary">({t(getTitleHeading(boundaryName))})</span>}
          </HeaderComponent>
          {mobileView ? null : (
            <div className="digit-dss-options-header-options">
              <Button
                type="actionButton"
                variation="teritiary"
                label={t(`ES_DSS_SHARE`)}
                options={shareOptions}
                optionsKey="label"
                showBottom={true}
                size={"medium"}
                className={"digit-dss-options-header-option-button"}
                isSearchable={false}
                wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
                onOptionSelect={onActionSelect}
                icon={"Share"}
                iconFill={"#505a5f"}
              />
              <Button
                type="actionButton"
                className={"digit-dss-options-header-option-button"}
                variation="teritiary"
                wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
                label={t(`ES_DSS_DOWNLOAD`)}
                options={downloadOptions}
                optionsKey="label"
                size={"medium"}
                showBottom={true}
                isSearchable={false}
                icon={"FileDownload"}
                onOptionSelect={onActionSelect}
                iconFill={"#505a5f"}
              />
            </div>
          )}
        </div>
        {isNational ? (
          <FiltersNational
            t={t}
            ulbTenants={nationalInfo}
            isOpen={isFilterModalOpen}
            closeFilters={() => setIsFilterModalOpen(false)}
            isNational={isNational}
          />
        ) : (
          <Filters
            t={t}
            showModuleFilter={
              (!isNational && dashboardConfig?.[0]?.name.includes("OVERVIEW") ? true : false) && !hideFilterFields.includes("ModuleFilter")
            }
            services={screenConfig}
            ulbTenants={isNational ? nationalInfo : ulbTenants}
            isOpen={isFilterModalOpen}
            closeFilters={() => setIsFilterModalOpen(false)}
            isNational={isNational}
            showDateRange={(dashboardConfig?.[0]?.name.includes("DSS_FINANCE_DASHBOARD") ? false : true) && !hideFilterFields.includes("DateRange")}
            showDDR={!hideFilterFields.includes("DDR")}
            showUlb={!hideFilterFields.includes("Ulb")}
            showDenomination={!hideFilterFields.includes("Denomination")}
            showFilterByCycle={projectData && projectData?.project?.additionalDetails?.projectType?.cycles?.length>1 
              && projectData?.project?.additionalDetails?.projectType?.beneficiaryType === "INDIVIDUAL"}
          />
        )}
        {filters?.filters?.tenantId?.length > 0 && (
          <div className="digit-tag-container">
            {!showFilters &&
              filters?.filters?.tenantId &&
              filters.filters.tenantId
                .slice(0, 5)
                .map((filter, id) => (
                  <Chip key={id} text={`${t(`DSS_HEADER_ULB`)}: ${t(filter)}`} onClick={(e, id) => removeULB(id)} hideClose={false} />
                ))}
            {filters?.filters?.tenantId?.length > 6 && (
              <>
                {showFilters &&
                  filters.filters.tenantId.map((filter, id) => (
                    <Chip key={id} text={`${t(`DSS_HEADER_ULB`)}: ${t(filter)}`} onClick={(e, id) => removeULB(id)} hideClose={false} />
                  ))}
                {!showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                    {t(`DSS_FILTER_SHOWALL`)}
                  </p>
                )}
                {showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                    {t(`DSS_FILTER_SHOWLESS`)}
                  </p>
                )}
              </>
            )}
            <p className="clearText cursorPointer" onClick={handleClear}>
              {t(`DSS_FILTER_CLEAR`)}
            </p>
          </div>
        )}
        {filters?.filters?.state?.length > 0 && (
          <div className="digit-tag-container">
            {!showFilters &&
              filters?.filters?.state &&
              filters.filters.state
                .slice(0, 5)
                .map((filter, id) => (
                  <Chip
                    key={id}
                    text={`${t(`DSS_HEADER_STATE`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                    onClick={(e, id) => removeST(id)}
                    hideClose={false}
                  />
                ))}
            {filters?.filters?.state?.length > 6 && (
              <>
                {showFilters &&
                  filters.filters.state.map((filter, id) => (
                    <Chip
                      key={id}
                      text={`${t(`DSS_HEADER_STATE`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                      onClick={(e, id) => removeST(id)}
                      hideClose={false}
                    />
                  ))}
                {!showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                    {t(`DSS_FILTER_SHOWALL`)}
                  </p>
                )}
                {showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                    {t(`DSS_FILTER_SHOWLESS`)}
                  </p>
                )}
              </>
            )}
            <p className="clearText cursorPointer" onClick={clearAllSt}>
              {t(`DSS_FILTER_CLEAR_ST`)}
            </p>
          </div>
        )}
        {filters?.filters?.ulb?.length > 0 && (
          <div className="digit-tag-container">
            {!showFilters &&
              filters?.filters?.ulb &&
              filters.filters.ulb
                .slice(0, 5)
                .map((filter, id) => (
                  <Chip
                    key={id}
                    text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                    onClick={(e, id) => removeTenant(id)}
                    hideClose={false}
                  />
                ))}
            {filters?.filters?.ulb?.length > 6 && (
              <>
                {showFilters &&
                  filters.filters.ulb.map((filter, id) => (
                    <Chip
                      key={id}
                      text={`${t(`DSS_HEADER_ULB`)}: ${t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(filter)}`)}`}
                      onClick={(e, id) => removeTenant(id)}
                      hideClose={false}
                    />
                  ))}
                {!showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(true)}>
                    {t(`DSS_FILTER_SHOWALL`)}
                  </p>
                )}
                {showFilters && (
                  <p className="clearText cursorPointer" onClick={() => setShowFilters(false)}>
                    {t(`DSS_FILTER_SHOWLESS`)}
                  </p>
                )}
              </>
            )}
            <p className="clearText cursorPointer" onClick={clearAllTn}>
              {t(`DSS_FILTER_CLEAR_TN`)}
            </p>
          </div>
        )}
        {filters?.moduleLevel?.length > 0 && (
          <div className="digit-tag-container">
            {!showFilters && filters?.moduleLevel && (
              <Chip
                key={filters?.moduleLevel}
                text={`${t(`DSS_HEADER_SERVICE`)}: ${t(filters?.moduleLevel)}`}
                onClick={() => removeService()}
                hideClose={false}
              />
            )}
            <p className="clearText cursorPointer" onClick={clearAllServices}>
              {t(`DSS_FILTER_CLEAR`)}
            </p>
          </div>
        )}

        {mobileView ? (
          <div className="options-m">
            <div>
              <FilterIcon onClick={() => setIsFilterModalOpen(!isFilterModalOpen)} style />
            </div>
            <div className="divToBeHidden">
              <MultiLink
                className="multilink-block-wrapper"
                label={t(`ES_DSS_SHARE`)}
                icon={<ShareIcon className="mrsm" />}
                showOptions={(e) => setShowShareOptions(e)}
                onHeadClick={(e) => {
                  setShowShareOptions(e !== undefined ? e : !showShareOptions);
                }}
                displayOptions={showShareOptions}
                options={shareOptions}
              />
            </div>
            <div onClick={handlePrint} className="divToBeHidden">
              <DownloadIcon />
              {t(`ES_DSS_DOWNLOAD`)}
            </div>
          </div>
        ) : null}
        <div>
          {tabArray && tabArray?.length > 1 && (
            <div className="digit-dss-switch-tabs">
              <div className="digit-dss-switch-tab-wrapper">
                {tabArray?.map((key) => (
                  <div className={tabState === key ? "digit-dss-switch-tab-selected" : "digit-dss-switch-tab-unselected"} onClick={() => setTabState(key)}>
                    {t(key)}
                  </div>
                ))}
              </div>
              {showProgressBar && (
                <ProgressBar
                  className="digit-dss-switch-tab-wrapper"
                  bgcolor="#00703C"
                  total={progressDuration?.campaignDuration}
                  completed={progressDuration?.daysElapsed}
                />
              )}
            </div>
          )}
        </div>
        {dashboardConfig?.[0]?.visualizations
          .filter((row) => row.name === tabState)
          .map((row, key) => {
            return <Layout rowData={row} key={key} pageZoom={pageZoom} />;
          })}
      </div>
    </FilterContext.Provider>
  );
};

export default L2Main;