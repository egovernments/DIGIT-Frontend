import React, { useState } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import { ProfileIcon } from "./svgindex";
import Button from "./Button";
import TextInput from "./TextInput";
import { Colors } from "../constants/colors/colorconstants";

const MobileSidebar = ({
  items,
  profileName,
  profileNumber,
  theme,
  className,
  styles,
  ref
}) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const handleItemClick = (item, index, parentIndex) => {
    setSelectedItem({ item: item, index: index, parentIndex: parentIndex });
  };

  const handleSearchChange = (index, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const filterItems = (items, searchTerm) => {
    return items.filter((item) => {
      if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (item.children) {
        item.children = filterItems(item.children, searchTerm);
        return item.children.length > 0;
      }
      return false;
    });
  };

  const darkThemeIconColor = Colors.lightTheme.paper.primary;
  const lightThemeIconColor = Colors.lightTheme.primary[2];

  const renderSearch = (index) => (
    <div className={`mb-search-container ${theme || ""}`}>
      <TextInput
        type="search"
        className="mb-search"
        value={searchTerms[index] || ""}
        onChange={(e) => handleSearchChange(index, e.target.value)}
        placeholder="Search"
        autoFocus={true}
        iconFill={theme === "dark" ? darkThemeIconColor : lightThemeIconColor}
      ></TextInput>
    </div>
  );

  const handleArrowClick = (item, index, parentIndex) => {
    if (item.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const renderItems = (items, parentIndex = -1) =>
    items.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];
      const isTopLevel = parentIndex === -1;

      return (
        <>
          <div
            className={`msb-item-child-wrapper ${
              isExpanded ? "expanded" : ""
            } ${theme || ""}`}
            key={currentIndex}
          >
            <div
              className={`msb-sidebar-item ${
                isTopLevel ? "msb-parentLevel" : "msb-child-level"
              }`}
              onClick={() => handleArrowClick(item, currentIndex, parentIndex)}
              tabIndex={0}
            >
              {(item.selectedIcon || item.icon) && (
                <span className="msb-icon">
                  {item.selectedIcon ? item.selectedIcon : item.icon}
                </span>
              )}
              {<span className="msb-item-label">{item.label}</span>}
              {item.children && (
                <span className="msb-expand-icon">
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
          {item.children && isExpanded && (
            <div className="msb-sidebar-children expanded">
              {renderSearch(currentIndex)}
              {renderChildItems(
                filterItems(item.children, searchTerms[currentIndex] || ""),
                currentIndex
              )}
            </div>
          )}
        </>
      );
    });

  const renderChildItems = (items, parentIndex = -1) =>
    items.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];

      return (
        <>
          <div className={"item-child-wrapper-msb"} key={currentIndex}>
            <div
              className={`sidebar-item-msb ${theme || ""} ${
                selectedItem.item === item ? "selected" : ""
              }`}
              onClick={() => handleItemClick(item, currentIndex, parentIndex)}
              tabIndex={0}
            >
              {
                <span className="icon-msb">
                  {item.selectedIcon ? item.selectedIcon : item.icon}
                </span>
              }
              {<span className="item-label-msb">{item.label}</span>}
              {item.children && (
                <span
                  className={`expand-icon-msb ${"child-level"}`}
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
          <div className={`inner-level-child ${theme || ""}`} key={currentIndex}>
            {item.children && isExpanded && (
              <div className="sidebar-children-msb">
                {renderChildItems(item.children, currentIndex)}
              </div>
            )}
          </div>
        </>
      );
    });

  const filteredItems = filterItems(items, searchTerms["root"] || "");

  return (
    <div
      className={`msb-sidebar ${theme || ""} ${className || ""}`}
      style={styles}
      ref={ref}
    >
      <div className="msb-profile">
        <ProfileIcon width={"62px"} height={"64px"} />
        <div className="msb-profile-details">
          <div className={`msb-profile-name ${theme || ""}`}>{profileName}</div>
          <div className={`msb-profile-phone ${theme || ""}`}>
            {profileNumber}
          </div>
        </div>
      </div>
      <div className="msb-sidebar-items">{renderItems(filteredItems)}</div>
      <div className={`msb-sidebar-bottom ${theme || ""}`}>
        <Button label={"Logout"} icon={"Logout"} variation={"secondary"} />
      </div>
    </div>
  );
};

MobileSidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  profileName: PropTypes.string,
  profileNumber: PropTypes.string,
};

export default MobileSidebar;
