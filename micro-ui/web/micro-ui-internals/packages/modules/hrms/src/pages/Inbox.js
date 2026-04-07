import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "../components/inbox/DesktopInbox";
import MobileInbox from "../components/inbox/MobileInbox";

const Inbox = ({ parentRoute, businessService = "HRMS", initialStates = {}, filterComponent, isInbox }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading: isLoading, Errors, data: res } = Digit.Hooks.hrms.useHRMSCount(tenantId);

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  const [totalRecords, setTotalReacords] = useState(undefined);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch(
    searchParams,
    tenantId,
    paginationParams,
    isupdate
  );

  useEffect(() => {
    // setTotalReacords(res?.EmployeCount?.totalEmployee);
  }, [res]);


  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handleFilterChange = (filterParam) => {
    let keys_to_delete = filterParam.delete;
    let _new = { ...searchParams, ...filterParam };

    // Inject countryCode safely when phone is searched
    // Remove the "+" so it isn't encoded to %2B over the query parameters
    if (_new.phone) {
      const prefixStr = selectedMobileConfig?.prefix || "+91";
      _new.countryCode = prefixStr.replace("+", "");
    } else {
      delete _new.countryCode;
    }

    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    filterParam.delete;
    delete _new.delete;
    setSearchParams({ ..._new });
  };

  const handleSort = useCallback((args) => {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  // Fetch mobile validation config from MDMS
  const stateId = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit?.Utils?.getConfigModuleName?.() || "commonUiConfig";
  const { data: validationConfig } = Digit.Hooks.useCustomMDMS(
    stateId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const allItems = data?.[moduleName]?.UserValidation || [];
        const mobileConfigs = allItems.filter((x) => x.fieldType === "mobile").map(item => ({
          prefix: item?.attributes?.prefix,
          pattern: item?.rules?.pattern,
          maxLength: item?.rules?.maxLength,
          minLength: item?.rules?.minLength,
          errorMessage: item?.rules?.errorMessage,
          isDefault: item?.default === true,
        }));
        
        const defaultItem = mobileConfigs.find((x) => x.isDefault) || mobileConfigs[0];
        return {
          mobileConfigs,
          defaultConfig: defaultItem,
          prefix: defaultItem?.prefix || "+91",
          pattern: defaultItem?.pattern || "^[6-9][0-9]{9}$",
          maxLength: defaultItem?.maxLength || 10,
          minLength: defaultItem?.minLength || 10,
          errorMessage: defaultItem?.errorMessage || "ES_SEARCH_APPLICATION_MOBILE_INVALID",
        };
      },
      staleTime: 300000,
      enabled: !!stateId,
    }
  );

  const [selectedMobileConfig, setSelectedMobileConfig] = useState(null);

  useEffect(() => {
    if (validationConfig?.defaultConfig && !selectedMobileConfig) {
      setSelectedMobileConfig(validationConfig.defaultConfig);
    }
  }, [validationConfig]);

  const handlePrefixChange = (e) => {
    const chosen = validationConfig?.mobileConfigs?.find((c) => c.prefix === e.target.value);
    if (chosen) setSelectedMobileConfig(chosen);
  };

  const getSearchFields = () => {
    return [
      {
        label: t("HR_NAME_LABEL"),
        name: "names",
      },
      {
        label: t("HR_MOB_NO_LABEL"),
        name: "phone",
        maxlength: selectedMobileConfig?.maxLength || 10,
        pattern: selectedMobileConfig?.pattern || ".[0-9]{9}",
        title: t(selectedMobileConfig?.errorMessage || "ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: validationConfig?.mobileConfigs && validationConfig?.mobileConfigs?.length > 1 ? (
          <select
            value={selectedMobileConfig?.prefix || "+91"}
            onChange={handlePrefixChange}
            style={{
              border: "none",
              padding: "0 8px",
              fontSize: "16px",
              backgroundColor: "transparent",
              cursor: "pointer",
              outline: "none",
              color: "#0B0C0C",
              fontWeight: "500",
              appearance: "auto"
            }}
          >
            {validationConfig?.mobileConfigs?.map((c) => (
              <option key={c.prefix} value={c.prefix}>
                {c.prefix}
              </option>
            ))}
          </select>
        ) : (
          selectedMobileConfig?.prefix || "+91"
        ),
      },
      {
        label: t("HR_EMPLOYEE_ID_LABEL"),
        name: "codes",
      },
    ];
  };

  if (isLoading) {
    return <Loader />;
  }

  if (data?.length !== null) {
    if (isMobile) {
      return (
        <MobileInbox
          businessService={businessService}
          data={data}
          isLoading={hookLoading}
          defaultSearchParams={initialStates.searchParams}
          isSearch={!isInbox}
          onFilterChange={handleFilterChange}
          searchFields={getSearchFields()}
          onSearch={handleFilterChange}
          onSort={handleSort}
          onNextPage={fetchNextPage}
          tableConfig={rest?.tableConfig}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          disableSort={false}
          onPageSizeChange={handlePageSizeChange}
          parentRoute={parentRoute}
          searchParams={searchParams}
          sortParams={sortParams}
          totalRecords={totalRecords}
          linkPrefix={`/${window?.contextPath}/employee/hrms/details/`}
          filterComponent={filterComponent}
        />
        // <div></div>
      );
    } else {
      return (
        <div>
          {isInbox && <Header>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Header>}
          <DesktopInbox
            businessService={businessService}
            data={data}
            isLoading={hookLoading}
            defaultSearchParams={initialStates.searchParams}
            isSearch={!isInbox}
            onFilterChange={handleFilterChange}
            searchFields={getSearchFields()}
            onSearch={handleFilterChange}
            onSort={handleSort}
            onNextPage={fetchNextPage}
            onPrevPage={fetchPrevPage}
            currentPage={Math.floor(pageOffset / pageSize)}
            pageSizeLimit={pageSize}
            disableSort={false}
            onPageSizeChange={handlePageSizeChange}
            parentRoute={parentRoute}
            searchParams={searchParams}
            sortParams={sortParams}
            totalRecords={totalRecords}
            filterComponent={filterComponent}
          />
        </div>
      );
    }
  }
};

export default Inbox;
