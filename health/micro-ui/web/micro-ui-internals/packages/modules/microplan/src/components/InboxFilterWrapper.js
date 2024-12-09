import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FilterCard, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";

const InboxFilterWrapper = (props) => {
  const { t } = useTranslation();

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
      props.onApplyFilters(selectedValue); // Call the parent function with selected value
    }
  };

  // Clear filters when the user presses the secondary action button
  const clearFilters = () => {
    setSelectedValue(selectedValue); // Clear the selection
    if (props.clearFilters) {
      props.clearFilters();
    }
  };

  return (
    <FilterCard
      style={{ flexGrow: 1, display: "flex", flexDirection: "column",width:"22vw" }}
      layoutType={"vertical"}
      onClose={props?.onClose}
      onPrimaryPressed={handleApplyFilters} // Apply filters
      onSecondaryPressed={clearFilters} // Clear filters
      primaryActionLabel={resultArray.length > 0 && t(props?.primaryActionLabel)}
      secondaryActionLabel={resultArray.length > 0 && t(props?.secondaryActionLabel)}
      title={t(props?.title)}
    >
      <div className="filter-content-wrapper" style={{ height: "18rem" }}>
        {/* Only render LabelFieldPair if resultArray has items */}
        {resultArray.length > 0 && (
          <LabelFieldPair>
            <RadioButtons
              options={resultArray}
              optionsKey={"name"} // Use "name" key for display
              selectedOption={selectedValue?.code} // Pass current selected option's code for comparison
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem", // Adds space between options
              }}
              onSelect={handleSelect} // Function to handle selection
            />
          </LabelFieldPair>
        )}
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
