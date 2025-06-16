import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const FilterByCycleDropdown = ({handleItemClick}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  const FilterIcon = ({ onClick }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="#f47738" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <path
        d="M0.666904 2.48016C3.36024 5.9335 8.33357 12.3335 8.33357 12.3335V20.3335C8.33357 21.0668 8.93357 21.6668 9.6669 21.6668H12.3336C13.0669 21.6668 13.6669 21.0668 13.6669 20.3335V12.3335C13.6669 12.3335 18.6269 5.9335 21.3202 2.48016C22.0002 1.60016 21.3736 0.333496 20.2669 0.333496H1.72024C0.613571 0.333496 -0.0130959 1.60016 0.666904 2.48016Z"
        fill="#f47738"
      />
    </svg>
  );

  const campaignsInfo = window.Digit.SessionStorage.get("currentProject");
  const selectedProjectTypeId = window.Digit.SessionStorage.get("selectedProjectTypeId");
  const campaign = campaignsInfo?.find((item) => item.projectTypeId === selectedProjectTypeId);
  const dropdownItems = campaign?.additionalDetails?.projectType?.cycles?.map((item, index) => {
    return {
        code: `0${item.id}`, name: `CYCLE_0${item.id}`, id: item.id 
    };
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    handleItemClick(item);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          backgroundColor: "white",
          border: "1px solid #f47738",
          borderRadius: "2px", // Reduced border radius
          padding: "10px 20px 10px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "bottom",
          color: "#f47738",
          fontWeight: "bold",
          maxHeight: "40px",
          maxWidth: "200px",
          outline: "none", // Prevent default outline
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #f47738")} // Keep border color on focus
        onBlur={(e) => (e.target.style.border = "1px solid #f47738")} // Keep border color on blur
      >
        <span style={{ marginRight: "10px", color: "#f47738" }}>
          <FilterIcon />
        </span>
        {`${t("FILTER_BY_CYCLE")}`}
      </button>
      {isOpen && (
       <div
       id="jk-dropdown-unique"
       className={`options-card`}
       style={
        {
            maxHeight: "300px", 
            backgroundColor: "white", 
            position: "absolute", 
            width: "200px", 
            position: "absolute", 
            overflowY: "auto", 
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }}
     >
          {dropdownItems.map((item, index) => (
             <div
             className={`cp profile-dropdown--item display: flex `}
             style={
               index === selectedItem?.id
                 ? {
                     opacity: 1,
                     backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))",
                   }
                 : {}
             }
             key={index}
             onClick={() => onItemClick(item)}
           >
              {`${t("CYCLE")} ${item.code}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default FilterByCycleDropdown;
