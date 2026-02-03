import React, { useContext ,Fragment} from "react";
import FilterContext from "./FilterContext";

const Switch = ({nameOfFilter, onSelect, t, filterOptions, changeFilterHandler, selectedFilterOption}) => {
  const { value } = useContext(FilterContext);

  return (
    <>
      <div className="mbsm">{t(nameOfFilter)}</div>
      <div className="switch-wrapper">
        {filterOptions.map((label, idx) => (
          <div key={idx} style={{color:"#B1B4B6",backgroundColor:"#FFFFFF",border: "1px solid #D6D5D4",boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)" }}>
            <input 
              type="radio"
              style={{color:"#F47738"}}
              id={label}
              className="radio-switch"
              name="unit"
              defaultChecked={label === selectedFilterOption}
              onClick={() => onSelect(changeFilterHandler(label))}
            />
            <label className="cursorPointer" style={{whiteSpace:"nowrap"}} htmlFor={label}>{t(Digit.Utils.locale.getTransformedLocale(label))}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default Switch;
