import React, { useState,Fragment ,useRef,useEffect} from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import { CustomSVG } from "./CustomSVG";
import Button from "./Button";
import TextInput from "./TextInput";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";
import { Spacers } from "../constants/spacers/spacers";

const Hamburger = ({
  items,
  profileName,
  profileNumber,
  theme,
  className,
  styles,
  hideUserManuals,
  userManualLabel,
  profile,
  usermanuals,
  onSelect,
  onLogout,
  reopenOnLogout,
  closeOnClickOutside,
  onOutsideClick
}) => {
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [openUserManuals, setOpenUserManuals] = useState(false);
  const [showHamburger,setShowHamburger] = useState(true);
  const sidebarRef = useRef(null);

  const iconSize = Spacers.spacer6;

    useEffect(() => {
      if (!closeOnClickOutside && !onOutsideClick) return;
    
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          if (onOutsideClick) {
            onOutsideClick(event);
          }
          if (closeOnClickOutside) {
            setShowHamburger(false); 
          }
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [closeOnClickOutside, onOutsideClick]);
    

  const handleItemClick = (item, index, parentIndex) => {
    setSelectedItem({ item: item, index: index, parentIndex: parentIndex });
    onSelect && onSelect({ item: item, index: index, parentIndex: parentIndex });
  };

  const handleSearchChange = (index, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const onLogoutClick = () => {
    setShowHamburger(false);
    onLogout && onLogout();
    onLogout && reopenOnLogout && setShowHamburger(true);
  }
  
  const filterItems = (items, searchTerm) => {
    return items?.filter((item) => {
      if (item?.label?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (item?.children) {
        item.children = filterItems(item?.children, searchTerm);
        return item?.children.length > 0;
      }
      return false;
    });
  };

  const darkThemeIconColor = Colors.lightTheme.paper.primary;
  const lightThemeIconColor = Colors.lightTheme.primary[2];

  const renderSearch = (index) => (
    <div className={`digit-mb-search-container ${theme || ""}`}>
      <TextInput
        type="search"
        className="digit-mb-search"
        value={searchTerms[index] || ""}
        onChange={(e) => handleSearchChange(index, e.target.value)}
        placeholder="Search"
        autoFocus={true}
        iconFill={theme === "dark" ? darkThemeIconColor : lightThemeIconColor}
      ></TextInput>
    </div>
  );

  const handleArrowClick = (item, index, parentIndex) => {
    if (item?.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
    else {
      handleItemClick(item, index, parentIndex); 
    }
  };

  const userManualsToShow =
    usermanuals && usermanuals.length > 0
      ? usermanuals
      : [
          {
            label: "Help",
            icon: "Home",
          },
          {
            label: "Settings",
            icon: "Settings",
          },
        ];

  const Icon = (icon,className) =>{
    return (
      iconRender(
        icon,
        theme === "light" ? lightThemeIconColor : darkThemeIconColor,
        iconSize,
        iconSize,
        className
      )
    )
  }
  const renderItems = (items, parentIndex = -1) => items?.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];
      const isTopLevel = parentIndex === -1;
      return (
        <>
          <div
            className={`digit-msb-item-child-wrapper ${
              isExpanded ? "expanded" : ""
            } ${theme || ""}`}
            key={currentIndex}
          >
            <div
              className={`digit-msb-sidebar-item ${
                isTopLevel ? "digit-msb-parentLevel" : "digit-msb-child-level"
              }`}
              onClick={() => handleArrowClick(item, currentIndex, parentIndex)}
              tabIndex={0}
            >
              {item?.icon && Icon(item?.icon,"digit-msb-icon")}
              {<span className="digit-msb-item-label">{item?.label}</span>}
              {item?.children && (
                <span className="digit-msb-expand-icon">
                  {isExpanded ? (
                    <SVG.ArrowDropDown
                      fill={
                        theme === "dark"
                          ? darkThemeIconColor
                          : lightThemeIconColor
                      }
                    />
                  ) : (
                    <SVG.ArrowDropDown
                      style={{ transform: "rotate(-90deg)" }}
                      fill={
                        theme === "dark"
                          ? darkThemeIconColor
                          : lightThemeIconColor
                      }
                    />
                  )}
                </span>
              )}
            </div>
          </div>
          {item?.children && isExpanded && (
            <div className="digit-msb-sidebar-children expanded">
              {item?.isSearchable && renderSearch(currentIndex)}
              {filterItems(item?.children, searchTerms[currentIndex] || "")
                .length > 0 ? (
                renderChildItems(
                  filterItems(item?.children, searchTerms[currentIndex] || ""),
                  currentIndex,
                  false
                )
              ) : (
                <div className="digit-msb-no-results">{t("No Results Found")}</div>
              )}
            </div>
          )}
        </>
      );
    });

  const renderChildItems = (items, parentIndex = -1, isUserManual) =>
    items?.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];
      const icon = item?.icon ? Icon(item?.icon,"digit-icon-msb") : null;
      return (
        <>
          <div className={"digit-item-child-wrapper-msb"} key={currentIndex}>
            <div
              className={`digit-sidebar-item-msb ${theme || ""} ${
                selectedItem.item === item ? "selected" : ""
              }`}
              onClick={() => handleItemClick(item, currentIndex, parentIndex)}
              tabIndex={0}
            >
              {icon}
              {/* {item.icon && Icon(item.icon, "digit-icon-msb")} */}
              {
                <span
                  className={`digit-item-label-msb ${
                    (!item?.icon || !icon) ? "withoutIcon" : ""
                  }`}
                >
                  {item?.label}
                </span>
              }
              {item?.children && (
                <span
                  className={`digit-expand-icon-msb ${"child-level"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArrowClick(item, currentIndex, parentIndex);
                  }}
                >
                  {isExpanded ? (
                    <SVG.ArrowDropDown
                      fill={
                        theme === "dark"
                          ? darkThemeIconColor
                          : lightThemeIconColor
                      }
                    ></SVG.ArrowDropDown>
                  ) : (
                    <SVG.ArrowDropDown
                      style={{ transform: "rotate(-90deg)" }}
                      fill={
                        theme === "dark"
                          ? darkThemeIconColor
                          : lightThemeIconColor
                      }
                    ></SVG.ArrowDropDown>
                  )}
                </span>
              )}
            </div>
          </div>
          <div
            className={`digit-inner-level-child ${theme || ""}`}
            key={currentIndex}
          >
            {item?.children && isExpanded && (
              <div className="digit-sidebar-children-msb">
                {renderChildItems(item?.children, currentIndex)}
              </div>
            )}
          </div>
        </>
      );
    });

  const filteredItems = filterItems(items, searchTerms["root"] || "");

  return showHamburger ?  (
    <div
      className={`digit-msb-sidebar ${theme || ""} ${className || ""}`}
      style={styles}
      ref={sidebarRef}
    >
      <div className="digit-msb-profile">
        {!profile && <CustomSVG.ProfileIcon width={"3.875rem"} height={"4rem"} />}
        {profile && (
          <img
            className="digit-hamburger-profile"
            alt="Profile"
            src={profile}
          />
        )}
        <div className="digit-msb-profile-details">
          <div className={`digit-msb-profile-name ${theme || ""}`}>{profileName}</div>
          <div className={`digit-msb-profile-phone ${theme || ""}`}>
            {profileNumber}
          </div>
        </div>
      </div>
      <div className="digit-msb-sidebar-items">{renderItems(filteredItems)}</div>
      {!hideUserManuals && (
        <div
          className={`digit-msb-item-child-wrapper ${"userManuals"} ${theme || ""}`}
        >
          <div
            className={`digit-msb-sidebar-item`}
            onClick={() => setOpenUserManuals(!openUserManuals)}
          >
            <span className={`digit-msb-icon ${"usermanuals"}`}>
              {
                <SVG.FileDownload
                  width={iconSize}
                  height={iconSize}
                  fill={
                    theme === "dark" ? darkThemeIconColor : lightThemeIconColor
                  }
                ></SVG.FileDownload>
              }
            </span>
            <span className={`digit-msb-item-label ${"usermanuals"}`}>
              {t(userManualLabel) || t("UserManuals")}
            </span>
          </div>
        </div>
      )}
      {
        openUserManuals && (
          renderChildItems(userManualsToShow,-1,true)
        )
      }
      {localStorage.getItem("token") && <div className={`digit-msb-sidebar-bottom ${theme || ""}`}>
        <Button onClick={onLogoutClick} label={t("Logout")} icon={"Logout"} variation={"secondary"} size={"medium"} />
      </div>}
    </div>
  ) :  null;
};

Hamburger.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  profileName: PropTypes.string,
  profileNumber: PropTypes.string,
  isSearchable:PropTypes.bool,
  userManualLabel:PropTypes.string,
  reopenOnLogout:PropTypes.bool
};

export default Hamburger;