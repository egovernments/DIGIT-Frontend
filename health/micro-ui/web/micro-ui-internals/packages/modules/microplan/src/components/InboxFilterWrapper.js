import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FilterCard, Dropdown, LabelFieldPair, RadioButtons, TextBlock } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";


const InboxFilterWrapper = (props) => {
  const { state } = useMyContext();
  const { t } = useTranslation();
  const [dropdown1Value, setDropdown1Value] = useState(null);
  const [dropdown2Value, setDropdown2Value] = useState(null);
  const [filterValues, setFilterValues] = useState(
    {status:null,onRoadCondition:null, terrain:null, securityQ1:null,securityQ2:null}
  );
  const [onRoadCondition,setonRoadCOndition]=useState(null);


  // Default selected option
  const defaultSelectedOption = props.defaultValue
    ? { code: Object.keys(props.defaultValue)[0], name: `${t(Object.keys(props.defaultValue)[0])} (${Object.values(props.defaultValue)[0]})` }
    : null;

  // Initialize state with the default selected option
  const [selectedValue, setSelectedValue] = useState(defaultSelectedOption);

  // Only update selectedValue when defaultValue from props changes, but not when it's null or undefined
  useEffect(() => {
    if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
      const newDefault = {
        code: Object.keys(props.defaultValue)[0],
        name: `${t(Object.keys(props.defaultValue)[0])} (${Object.values(props.defaultValue)[0]})`,
      };
      setSelectedValue(newDefault);
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
      // debugger;
      console.log("filt",filterValues);
      props.onApplyFilters(filterValues); // Call the parent function with selected value
    }
  };

  // Clear filters when the user presses the secondary action button
  const clearFilters = () => {
    // setSelectedValue(selectedValue); // Clear the selection
    setFilterValues({status:null,onRoadCondition:null,terrain:null,securityQ1:null,securityQ2:null});
    if (props.clearFilters) {
      props.clearFilters();
    }
  };

  const handleDropdownChange = (key, value) => {
    console.log("filter",value)
    debugger
    setFilterValues((prev)=>({
      ...prev,
      [key]:value?.name
    }));
    
    // if(key==="onRoadCondition"){
    //   setonRoadCOndition(value?.code);
    // }
  };
  console.log("filtervalue",filterValues);
  console.log("state",state.villageRoadCondition);

  return (
    <FilterCard
      style={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "22vw" }}
      layoutType={"vertical"}
      onClose={props?.onClose}
      onPrimaryPressed={handleApplyFilters} // Apply filters
      onSecondaryPressed={clearFilters} // Clear filters
      primaryActionLabel={resultArray.length > 0 && t(props?.primaryActionLabel)}
      secondaryActionLabel={resultArray.length > 0 && t(props?.secondaryActionLabel)}
      title={t(props?.title)}
    >
      <div className="gap-between-dropdowns" style={{ height: "18rem" }}>
        {/* Only render LabelFieldPair if resultArray has items */}
        {resultArray.length > 0 && (
          <LabelFieldPair vertical style={{ marginBottom: "1rem" }} >
            <RadioButtons
              options={resultArray}
              optionsKey={"name"} // Use "name" key for display
              selectedOption={filterValues["status"]} // Pass current selected option's code for comparison
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem", // Adds space between options
              }}
              onSelect={(value)=>handleDropdownChange("status",value)} // Function to handle selection
            />
          </LabelFieldPair>
        )}

        <LabelFieldPair vertical>
          <TextBlock body={t(`MP_VILLAGE_ROAD_CONDITION`)} />
          <Dropdown
            option={state.villageRoadCondition}
            optionKey={"name"}
            selected={filterValues["onRoadCondition"]}
            select={(value) => handleDropdownChange("onRoadCondition",value)}
            t={t}
            disabled={false}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical>
          <TextBlock body={t(`MP_VILLAGE_TERRAIN`)} />
          <Dropdown
            option={state.villageTerrain}
            optionKey={"name"}
            selected={filterValues["terrain"]}
            select={(value) => handleDropdownChange("terrain",value)}
            t={t}
            disabled={false}
          />
        </LabelFieldPair>

  
          {state.securityQuestions.map((item, index) => {
            // Transform item.values into an array of objects
            const options = item.values.map((value) => ({
              code: value,
              name: value,
              active: true,
            }));

            return (
              <LabelFieldPair vertical>
                <TextBlock body={t(`MP_SECURITY_QUESTION ${index+1}`)} />
                <Dropdown
                  option={options} // Pass transformed options here
                  optionKey="name" // Key for displaying dropdown options
                  selected={filterValues[`securityQ${index+1}`]} // Set selected value
                  select={(value) => handleDropdownChange( `securityQ${index+1}`,value)} // Handle selection
                  t={(key) => key} // Translation function (you can replace as needed)
                  disabled={false}
                />
              </LabelFieldPair>
            );
          })}
       
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
