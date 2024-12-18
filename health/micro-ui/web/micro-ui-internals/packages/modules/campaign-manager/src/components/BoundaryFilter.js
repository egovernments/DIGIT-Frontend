import React, { memo, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, Button, MultiSelectDropdown, TooltipWrapper, Tooltip , Dropdown } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { InfoIconOutline, CardLabel } from "@egovernments/digit-ui-react-components";

const BoundaryFilter = ({t,filterOptions , onSelectBoundary}) => {
  const  [boundaryType , setBoundaryType] = useState(); 

  function convertFilterOptionsToArray(filterOptions) {
    const keys = Object.keys(filterOptions);
    return keys
      .filter((key) => Array.isArray(filterOptions[key])) 
      .map((key) => ({
        code: key, 
        name: key, 
      }));
  }

  useEffect(() => {
      onSelectBoundary({boundaryType: boundaryType });
  }, [boundaryType]);

  return (
    <div className={`map-filter-by-boundary`}>
      <Button
        type="actionButton"
        variation="secondary"
        icon="FilterAlt"
        label={t("BUTTON_FILTER_BY_BOUNDARY")}
        title={t("BUTTON_FILTER_BY_BOUNDARY")}
        options={convertFilterOptionsToArray(filterOptions)}
        optionsKey="name"
        showBottom={true}
        isSearchable={false}
        onOptionSelect={(value) => {
          setBoundaryType(value?.code);
        }}
      />
    </div>
  );
};

export default BoundaryFilter;
