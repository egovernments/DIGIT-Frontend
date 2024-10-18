import React, { Fragment, useState, } from "react";
import { useTranslation } from "react-i18next";
import { FilterCard, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";

const InboxFilterWrapper = (props) => {
  const { t } = useTranslation();
    // State to store the selected radio button value
    const [selectedValue, setSelectedValue] = useState(props?.defaultValue || null);
  
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
            options={props.options}
            optionsKey={props?.optionsKey}  // Use "name" key by default
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
