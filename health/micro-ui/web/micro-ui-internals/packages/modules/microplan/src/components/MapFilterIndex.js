import React,{Fragment} from "react";
import * as DigitSvgs from "@egovernments/digit-ui-svg-components";

const IconCollection = {...DigitSvgs };

export const FilterItemBuilder = ({ item, MapFilters, t }) => {
    let temp = MapFilters?.find((e) => e?.name === item)?.icon?.index;
    let DynamicIcon = IconCollection?.[temp];
    // let icon;
    // if (typeof DynamicIcon === "function") icon = DynamicIcon({});
    return DynamicIcon && typeof DynamicIcon === "function" ? (
      <div className="filter-row">
        <DynamicIcon width={"1.5rem"} height={"1.5rem"} fill={"white"} />
        <p className="map-filter-layers">{t(item)}</p>
      </div>
    ) : (
      // <div style={{width:"1.5rem"}}></div>
      ""
    );
  };

const MapFilterIndex = ({ filterSelections, MapFilters, t }) => {
    return (
      <div className="filter-index">
        {filterSelections && filterSelections.length > 0 ? (
          <>
            {filterSelections.map((item, index) => (
              // <div className="filter-row">
              <FilterItemBuilder key={item?.id || index} item={item} MapFilters={MapFilters} t={t} />
              //   <p>{t(item)}</p>
              // </div>
            ))}
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

export default MapFilterIndex;