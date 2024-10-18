import React, { Fragment, useState, } from "react";
import { useTranslation } from "react-i18next";
import { FilterCard, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";

const InboxFilterWrapper = (props) => {
  const { t } = useTranslation();
  
  // defaultValue structure: {"key": value}
  // defaultSelectedOption structure: { code: string, name: string }
    const defaultSelectedOption = props.defaultValue 
        ? { code: Object.keys(props.defaultValue)[0], name: `${t(Object.keys(props.defaultValue)[0])} (${Object.values(props.defaultValue)[0]})` } 
        : null;

    // Initialize state with the default selected option
    const [selectedValue, setSelectedValue] = useState(defaultSelectedOption);

    const createArrayFromObject = (obj, t) => {
      if (!obj || typeof obj !== 'object' || typeof t !== 'function') {
        console.error('Invalid input to createArrayFromObject');
        return [];
      }
      return Object.entries(obj).map(([key, value]) => ({
        code: key,
        name: `${t(key)} (${value})`
      }));
    };
    
    // Usage of the function
    const resultArray = createArrayFromObject(props?.options, t); 
  
    // Function to handle selection from the radio buttons
    const handleSelect = (option) => {
      setSelectedValue(option); // Update state with the selected option
    };
  
    // Function to handle applying the filters
    const handleApplyFilters = () => {
      if (props.onApplyFilters) {
        props.onApplyFilters(selectedValue);  // Pass the filter data to the parent function
      }
    };

    const clearFilters = () => {
      setSelectedValue(null);
      if (props.onApplyFilters) {
        props.onApplyFilters(null);
      }
    }
  
    return (
      <FilterCard
        layoutType={"vertical"}
        onClose={props?.onClose}
        onPrimaryPressed={handleApplyFilters}  // Trigger filter apply on primary action
        onSecondaryPressed={clearFilters}  // Clear filters on secondary action
        primaryActionLabel={t(props?.primaryActionLabel)}
        secondaryActionLabel={t(props?.secondaryActionLabel)}
        title={t(props?.title)}
      >
        <LabelFieldPair>
          <RadioButtons
            options={resultArray}
            optionsKey={"name"}  // Use "name" key by default
            selectedOption={selectedValue}  // Pass the current selected option
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",  // Adds space between options
            }}
            onSelect={handleSelect}  // Function to handle selection
          />
        </LabelFieldPair>
       </FilterCard>
    );
  };

  InboxFilterWrapper.defaultProps = {
    primaryActionLabel: "ES_COMMON_APPLY_FILTERS",
    secondaryActionLabel: "ES_COMMON_CLEAR_SEARCH",
    title: "FILTERS",
    optionsKey: "name"
  };

export default InboxFilterWrapper;
