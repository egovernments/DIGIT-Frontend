import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FilterCard, Dropdown, LabelFieldPair, RadioButtons, TextBlock, Loader,MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";



const InboxFilterWrapper = (props) => {
  const { state } = useMyContext();
  const { t } = useTranslation();
  const {microplanId,...rest} = Digit.Hooks.useQueryParams()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [filterValues, setFilterValues] = useState(
    { status: null, onRoadCondition: null, terrain: null, securityQ1: null, securityQ2: null, facilityId:null }
  );
  
  // Default selected option
  let defaultSelectedOptions = props.defaultValue
  ? Object.entries(props.defaultValue).reduce((acc, [key, value]) => {
      if (key === "facilityId") {
        acc[key] = value.map(item => ({ code: item?.code, id: item?.id, name: item?.name }));
      } else if (value !== null) {
        acc[key] = { code: value, name: `${t(key)} (${value})` };
      } else {
        acc[key] = null;
      }
      return acc;
    }, {})
  : null;


  // Initialize state with the default selected option
  useEffect(() => {
    if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
      const newDefault = Object.entries(props.defaultValue)?.reduce((acc, [key, value]) => {
        acc[key] = value !== null
          ? key === 'facilityId'
            ? value.map(item => ({ code: item?.code, id: item?.id, name: item?.name }))
            : { code: value, name: `${t(key)} (${value})` }
          : null;
        return acc;
      }, {});
      setFilterValues(newDefault);
    }
  }, [props.defaultValue, t]);
  



  const createArrayFromObject = (obj, t) => {
    if (!obj || typeof obj !== "object" || Object.keys(obj).length === 0 || typeof t !== "function") {
      return []; // Return an empty array if options object is empty or null
    }
    return Object.entries(obj).map(([key, value]) => ({
      code: key,
      name: `${t(key)} (${value})`,
    }));
  };
  

  // Generate options from props.options
  const resultArray = createArrayFromObject(props?.options, t);

  // Handle selection of radio button
  const handleSelect = (option) => {
    setSelectedValue(option); // Update selected value
  };

  // Apply filters when the user presses the primary action button
  const handleApplyFilters = () => {
    if (props.onApplyFilters) {
      const filtersToApply = {};
      for (let key in filterValues) {
        if(filterValues[key] && typeof filterValues[key] === 'object' && String(key)==='facilityId' && filterValues[key].hasOwnProperty('code') ){
          filtersToApply[key] = filterValues[key]
        }
        else if (filterValues[key] && typeof filterValues[key] === 'object' && filterValues[key].hasOwnProperty('code')) {
          filtersToApply[key] = filterValues[key].code; // Extract 'name' if it exists
        } else {
          filtersToApply[key] = filterValues[key]; // Keep the value as is (including null)
        }
      }
      props.onApplyFilters(filtersToApply); // Pass the new array to onApplyFilters
    }
  };

  // Clear filters when the user presses the secondary action button
  const clearFilters = () => {
    // setSelectedValue(selectedValue); // Clear the selection
    setFilterValues({ status: null, onRoadCondition: null, terrain: null, securityQ1: null, securityQ2: null });
    defaultSelectedOptions = {};
    if (props.clearFilters) {
      props.clearFilters();
    }
  };

  const handleDropdownChange = (key, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelectDropdownChange = (key, value) => {
    const transformedValue = Array.isArray(value)
      ? value.map((item) => ({
          code: item?.[1]?.code,
          id: item?.[1]?.id,
          name: item?.[1]?.name
        }))
      : [];
    setFilterValues((prev) => ({
      ...prev,
      [key]: transformedValue,
    }));
  };
  

  const planFacilitySearchConfig = {
    url: "/plan-service/plan/facility/_search",
    body: {
      PlanFacilitySearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: microplanId,
        limit:100
      }
    },
    config: {
      enabled: props?.isPlanInbox ? props?.isPlanInbox: false,
      select: (data) => {
        if (!data?.PlanFacility || !Array.isArray(data.PlanFacility)) return [];
    
        // Extract facilityName and facilityId for each object
        const facilityOptions = data.PlanFacility.map((facility) => ({
          name: facility.facilityName,
          code: facility.facilityId,
          id: facility.facilityId
        }));
    
        return facilityOptions;
      },
      cacheTime:Infinity
    }  
  };

  const { isLoading: isPlanFacilityLoading, error: planFacilityError, data: planFacility } = Digit.Hooks.useCustomAPIHook(planFacilitySearchConfig);



  if(isPlanFacilityLoading){
    return <Loader/>
  }


  return (

    <FilterCard
      style={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "22vw",height:`${Math.max(props.tableHeight,33)}rem`}}
      layoutType={"vertical"}
      onClose={props?.onClose}
      onPrimaryPressed={handleApplyFilters} // Apply filters
      onSecondaryPressed={clearFilters} // Clear filters
      primaryActionLabel={resultArray.length > 0 && t(props?.primaryActionLabel)}
      secondaryActionLabel={resultArray.length > 0 && t(props?.secondaryActionLabel)}
      title={t(props?.title)}
      className={props?.isPlanInbox ? "plan-inbox-filtercard" : ""}
    >
      <div className="gap-between-dropdowns">
        {/* Only render LabelFieldPair if resultArray has items */}
        {resultArray.length > 0 && (
          <LabelFieldPair vertical style={{ marginBottom: "1rem" }} >
            <RadioButtons
              options={resultArray}
              optionsKey={"name"} // Use "name" key for display
              selectedOption={filterValues["status"]?.code || defaultSelectedOptions?.status?.code} // Pass current selected option's code for comparison
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem", // Adds space between options
              }}
              onSelect={(value) => handleDropdownChange("status", value)} // Function to handle selection
            />
          </LabelFieldPair>
        )}
        {props.isPlanInbox &&
        <Fragment>
        <LabelFieldPair vertical>
        <div className="custom-filter-names">{t("MP_VILLAGE_ROAD_CONDITION")}</div> 
          <Dropdown
            option={state.villageRoadCondition}
            optionKey={"code"}
            selected={filterValues["onRoadCondition"] || defaultSelectedOptions?.onRoadCondition}
            select={(value) => handleDropdownChange("onRoadCondition", value)}
            t={t}
            disabled={false}
            showToolTip={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical>
        <div className="custom-filter-names">{t("MP_VILLAGE_TERRAIN")}</div>           
        <Dropdown
            option={state.villageTerrain}
            optionKey={"code"}
            selected={filterValues["terrain"] || defaultSelectedOptions?.terrain}
            select={(value) => handleDropdownChange("terrain", value)}
            t={t}
            disabled={false}
            showToolTip={true}
          />
        </LabelFieldPair>
    
        <LabelFieldPair vertical>
        <div className="custom-filter-names">{t("MP_FILTER_FACILITY")}</div>           
          <div style={{width:"100%"}}>
          <MultiSelectDropdown
            options={planFacility}
            selected={filterValues["facilityId"] || defaultSelectedOptions?.facilityId || []}
            optionsKey={"name"}
            onSelect={(value) => handleMultiSelectDropdownChange("facilityId", value)}
            t={t}
          />
          </div>
        </LabelFieldPair>   


        {state.securityQuestions.map((item, index) => {
          // Transform item.values into an array of objects
          const options = item.values.map((value) => ({
            code: value,
            name: value,
            active: true,
          }));

          const isLastElement = index === state.securityQuestions.length - 1;
          const questionNumber = parseInt(item.id, 10); 

          return (
            <LabelFieldPair
              vertical
              style={{ paddingBottom: isLastElement ? "1rem" : "0" }} 
            >
              <div className="custom-filter-names">{t(`MP_SECURITY_QUESTION ${index + 1}`)}</div>             
              <Dropdown
                option={options}
                optionKey={"code"}
                selected={filterValues[`securityQ${questionNumber}`]} 
                select={(value) => handleDropdownChange(`securityQ${questionNumber}`, value)}
                t={t}
                disabled={false}
                showToolTip={true}
              />
            </LabelFieldPair>
          );
        })}
      </Fragment>
      }


      </div>
    </FilterCard>
  );
};

InboxFilterWrapper.defaultProps = {
  primaryActionLabel: "ES_COMMON_APPLY_FILTERS",
  secondaryActionLabel: "ES_COMMON_CLEAR_SEARCH",
  title: "FILTERS",
  optionsKey: "name",
};

export default InboxFilterWrapper;