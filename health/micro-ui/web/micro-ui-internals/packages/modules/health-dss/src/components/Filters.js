import { CloseSvg, FilterIcon, MultiSelectDropdown, RefreshIcon, Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DateRange from "./DateRange";
import FilterContext from "./FilterContext";
import Switch from "./Switch";
import { format } from "date-fns";
import FilterByCycleDropdown from "./FilterByCycle";
import { Toggle, Chip } from "@egovernments/digit-ui-components";
import { getDuration } from "../utils/getDuration";

const Filters = ({
  t,
  ulbTenants,
  services,
  isOpen,
  closeFilters,
  showDateRange = true,
  showDDR = true,
  showUlb = true,
  showDenomination = true,
  showModuleFilter = true,
  isNational = false,
  showFilterByCycle = false,
}) => {
  const { value, setValue } = useContext(FilterContext);

  const denominations = ["Cr", "Lac", "Unit"];
  const dateRangesAvailable = ["DSS_CUSTOM_DATE_RANGE", "DSS_TODAY", "DSS_CUMULATIVE"];

  const [selected, setSelected] = useState(() =>
    ulbTenants?.ulb.filter((tenant) => value?.filters?.tenantId?.find((selectedTenant) => selectedTenant === tenant?.code))
  );

  useEffect(() => {
    if (value.dateFilterSelected === "DSS_TODAY") {
      handleFilterChange(handleDateRangeFilterSelection(value.dateFilterSelected));
    }
  }, [value.dateFilterSelected]);

  useEffect(() => {
    setSelected(ulbTenants?.ulb?.filter((tenant) => value?.filters?.tenantId?.find((selectedTenant) => selectedTenant === tenant?.code)));
  }, [value?.filters?.tenantId]);

  const [selectService, setSelectedService] = useState(() => services?.filter((module) => value?.moduleLevel === module?.code));

  useEffect(() => {
    setSelectedService(services?.filter((module) => value?.moduleLevel === module?.code));
  }, [value?.moduleLevel]);

  const handleFilterChange = (data) => {
    setValue({ ...value, ...data });
  };

  const handleCycleFilter = (data) => {
    setValue({ ...value, filters: { ...value?.filters, cycle: data.cycle } });
  };

  const clearCycleFilter = () => {
    const prevFilters = value?.filters;
    delete prevFilters.cycle;

    setValue({ ...value, filters: { ...prevFilters } });
  };

  const selectFilters = (e, data) => {
    setValue({ ...value, filters: { tenantId: e.map((allPropsData) => allPropsData?.[1]?.code) } });
  };

  const selectServicesFilters = (e, data) => {
    setValue({ ...value, moduleLevel: e?.code });
  };

  const selectDDR = (e, data) => {
    const DDRsSelectedByUser = ulbTenants.ulb.filter((ulb) => {
      return !!e.find((tenant) => {
        return ulb.ddrKey === tenant?.[1].ddrKey;
      });
    });
    setValue({ ...value, filters: { tenantId: DDRsSelectedByUser.map((allPropsData) => allPropsData?.code) } });
  };

  const selectedDDRs = useMemo(
    () =>
      selected
        .map((ulb) => ulbTenants.ulb.filter((e) => e.code === ulb.code)[0])
        .filter((item, i, arr) => i === arr.findIndex((t) => t.ddrKey === item.ddrKey)),
    [selected, ulbTenants]
  );

  const setDateAndInterval = (startDate, endDate, label) => {
    const interval = getDuration(startDate, endDate);
    const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
    return {
      range: { startDate, endDate, interval, title },
      requestDate: { startDate, endDate, interval, title },
      dateFilterSelected: label,
    };
  };

  const handleDenominationFilterSelection = (label) => {
    return {
      denomination: label,
    };
  };

  // method will handle the range to be set for startDate and endDate
  const handleDateRangeFilterSelection = (label) => {
    let campaignStartDate = JSON.parse(window.sessionStorage.getItem("Digit.DSS_FILTERS"))?.value?.filters?.campaignStartDate;
    switch (label) {
      case "DSS_TODAY": {
        const date = new Date();
        const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 0);
        return setDateAndInterval(startDate, endDate, label);
      }
      case "DSS_CUMULATIVE": {
        // set entire duration of campaign startDate of campaign
        let startDate = new Date(new Date(Number(campaignStartDate)));
        let endDate = new Date();
        return setDateAndInterval(startDate, endDate, label);
      }
      case "DSS_CUSTOM_DATE_RANGE": {
        let startDate = new Date(new Date(Number(campaignStartDate)));
        let endDate = new Date();
        return setDateAndInterval(startDate, endDate, label);
      }
    }
  };

  const handleClear = () => {
    setValue({
      denomination: "Unit",
      dateFilterSelected: "Custom Date Range",
      range: Digit.Utils.dss.getInitialRange(),
    });
  };
  return (
    <div className={`digit-filters-wrapper ${isOpen ? "filters-modal" : ""}`}>
      <span className="filter-close" onClick={() => closeFilters()}>
        <CloseSvg />
      </span>
      {isOpen && (
        <div className="filter-header">
          <FilterIcon />
          <p>{t(`DSS_FILTERS`)}</p>
          <span onClick={handleClear}>
            <RefreshIcon />
          </span>
        </div>
      )}
      {showDateRange && (
        <div className="digit-filters-input">
          <DateRange onFilterChange={handleFilterChange} values={value?.range} t={t} />
        </div>
      )}
      {showDateRange && (
        <div className="digit-filters-input tabs">
          <Toggle
            name="toggleOptions"
            numberOfToggleItems={3}
            onSelect={(code) => handleFilterChange(handleDateRangeFilterSelection(code))}
            options={[
              {
                code: "DSS_CUSTOM_DATE_RANGE",
                name: "DSS_CUSTOM_DATE_RANGE",
              },
              {
                code: "DSS_TODAY",
                name: "DSS_TODAY",
              },
              {
                code: "DSS_CUMULATIVE",
                name: "DSS_CUMULATIVE",
              },
            ]}
            optionsKey="name"
            value={value?.dateFilterSelected}
            selectedOption={value?.dateFilterSelected}
            type="toggle"
            t={t}
          />
        </div>
      )}
      {showFilterByCycle && (
        <div className={"digit-filter-by-cycle-wrapper"}>
          {value?.filters?.cycle && (
            <div className="digit-tag-container">
              <Chip text={`${t(`CYCLE`)} ${value?.filters?.cycle}`} onClick={(e) => clearCycleFilter(e)} hideClose={false} />
            </div>
          )}
          <FilterByCycleDropdown
            handleItemClick={(cycle) =>
              handleCycleFilter({
                cycle: cycle.code,
              })
            }
          />
        </div>
      )}
      {showDDR && (
        <div className="filters-input">
          <div className="mbsm">{t(isNational ? "ES_DSS_STATE" : "ES_DSS_DDR")}</div>
          <MultiSelectDropdown
            options={ulbTenants?.ddr && ulbTenants.ddr?.sort((x, y) => x?.ddrKey?.localeCompare(y?.ddrKey))}
            optionsKey="ddrKey"
            onSelect={selectDDR}
            selected={selectedDDRs}
            defaultLabel={t(isNational ? "ES_DSS_ALL_STATE_SELECTED" : "ES_DSS_ALL_DDR_SELECTED")}
            defaultUnit={t(isNational ? "ES_DSS_STATE_SELECTED" : "ES_DSS_DDR_SELECTED")}
          />
        </div>
      )}
      {showUlb && (
        <div className="filters-input">
          <div className="mbsm">{t("ES_DSS_ULB")}</div>
          <MultiSelectDropdown
            options={
              ulbTenants?.ulb?.sort((x, y) => x?.ulbKey?.localeCompare(y?.ulbKey))
              /*    Removed filter for selected ddr/state rain-5426
              ulbTenants?.ulb && ulbTenants.ulb.filter((e) => Digit.Utils.dss.checkSelected(e, selectedDDRs))?.sort((x, y) => x?.ulbKey?.localeCompare(y?.ulbKey))
             */
            }
            optionsKey="ulbKey"
            onSelect={selectFilters}
            selected={selected}
            defaultLabel={t("ES_DSS_ALL_ULB_SELECTED")}
            defaultUnit={t("ES_DSS_DDR_SELECTED")}
          />
        </div>
      )}
      {!isNational && showModuleFilter && (
        <div className="filters-input">
          <div className="mbsm">{t("ES_DSS_SERVICES")}</div>
          <Dropdown
            option={services}
            optionKey="name"
            select={selectServicesFilters}
            selected={selectService}
            placeholder={t("ES_DSS_ALL_SERVICES_SELECTED")}
          />
        </div>
      )}
      {showDenomination && (
        <div className="filters-input" style={{ flexBasis: "16%" }}>
          <Switch
            filterOptions={denominations}
            nameOfFilter={`ES_DSS_DENOMINATION`}
            onSelect={handleFilterChange}
            t={t}
            selectedFilterOption={value?.denomination}
            changeFilterHandler={handleDenominationFilterSelection}
          />
        </div>
      )}
    </div>
  );
};

export default Filters;