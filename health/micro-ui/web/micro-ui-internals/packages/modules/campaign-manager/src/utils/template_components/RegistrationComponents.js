import { Switch, FieldV1, RoundedLabel, CustomSVG } from "@egovernments/digit-ui-components";
import React from "react";




  export const SearchBar = ({props, t}) => (
    <div style={{width: "100%"}}>
        <FieldV1
        style={{width: "100%"}}
        onChange={function noRefCheck(){}}
        placeholder={t(props.label) || "LABEL"}
        type="search"
        populators={{
        fieldPairClassName: `app-preview-field-pair`
        }
        }
        />
    </div>    
  );


  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.250666 1.61C2.27067 4.2 6.00067 9 6.00067 9V15C6.00067 15.55 6.45067 16 7.00067 16H9.00067C9.55067 16 10.0007 15.55 10.0007 15V9C10.0007 9 13.7207 4.2 15.7407 1.61C16.2507 0.95 15.7807 0 14.9507 0H1.04067C0.210666 0 -0.259334 0.95 0.250666 1.61Z" fill="#C84C0E"/>
</svg>

  );
  export const Filter = ({props, t}) => (
    <div className="digit-search-action">
    {/* <RoundedLabel count={props.filterCount}></RoundedLabel> */}
    <FilterIcon /> <span className="digit-search-text">{t(props.label) || "LABEL"}</span>
  </div>
  );

  
const ProximitySearch = ({props, t}) => (
    <Switch
    label={t(props.label) || "LABEL"}
    onToggle={null}
    isCheckedInitially={true}
    shapeOnOff
    />
);

export const RegistrationComponentRegistry = {
  ProximitySearch,
  SearchBar,
  Filter,
};