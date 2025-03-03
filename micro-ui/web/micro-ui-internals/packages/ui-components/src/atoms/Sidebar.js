import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import { SVG, TextInput } from "../atoms";
import { IMAGES} from "../constants/images/images";
import { Colors} from "../constants/colors/colorconstants";

const Sidebar = ({ items, theme, variant,transitionDuration,className,styles }) => {
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const darkThemeColor = Colors.lightTheme.paper.primary;
  const lightThemeColor = Colors.lightTheme.primary[2];

  const primaryColor = theme === "dark" ? darkThemeColor : lightThemeColor;

  const handleArrowClick = (item, index, parentIndex) => {
    if (item.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const handleItemClick = (item, index, parentIndex) => {
    setSelectedItem({ item: item, index: index, parentIndex: parentIndex });
  };

  const isParentOfSelectedItem = (index) => {
    const { parentIndex } = selectedItem;
    return parentIndex && parentIndex.toString().startsWith(index);
  };


  const filterItems = (items, query) => {
    if (!query) {
      return items;
    }

    return items
      .map((item) => {
        if (item.label.toLowerCase().includes(query.toLowerCase())) {
          return item;
        }

        if (item.children) {
          const filteredChildren = filterItems(item.children, query);
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }

        return null;
      })
      .filter((item) => item !== null);
  };

  const renderSearch = () => {
    return (
      <>
        {hovered ? (
          <div className={`sidebar-search-container ${theme || ""} ${variant || ""}`}>
            <TextInput
              type="search"
              className="sidebar-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              autoFocus={true}
              iconFill={primaryColor}
            ></TextInput>
          </div>
        ) : (
          <div className={`sidebar-search-container-collapsed ${theme || ""} ${variant || ""}`}>
            <SVG.Search
              width={"24px"}
              height={"24px"}
              fill={theme==="dark" ? darkThemeColor : lightThemeColor}
              className="search-icon"
            />
          </div>
        )}
      </>
    );
  };

  const renderItems = (items, parentIndex = -1) =>
    items.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];
      const isSelected = selectedItem.item === item;
      const isTopLevel = parentIndex === -1;

      return (
        <div className={"item-child-wrapper"} key={currentIndex}>
          <div
            className={`sidebar-item ${theme || ""} ${variant || ""} ${
              selectedItem.item === item ? "selected" : ""
            } ${parentIndex === -1 ? "parentLevel" : ""} ${
              isParentOfSelectedItem(currentIndex) ? "selectedAsParent" : ""
            }`}
            onClick={() => handleItemClick(item, currentIndex, parentIndex)}
            tabIndex={0}
          >
            {(isTopLevel || hovered) && (
              <span className="icon">
                {(isSelected || isParentOfSelectedItem(currentIndex) ) && item.selectedIcon
                  ? item.selectedIcon
                  : item.icon}
              </span>
            )}
            {hovered && <span className="item-label">{item.label}</span>}
            {item.children && hovered && (
              <span
                className="expand-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArrowClick(item, currentIndex, parentIndex);
                }}
              >
                {isExpanded ? (
                  <SVG.ArrowDropDown fill={theme==="dark" || (selectedItem.item===item && (theme==="light" && variant==="primary")) ? darkThemeColor : lightThemeColor}></SVG.ArrowDropDown>
                ) : (
                  <SVG.ArrowDropDown
                    style={{ transform: "rotate(-90deg)" }}
                    fill={theme==="dark" || (selectedItem.item===item  && (theme==="light" && variant==="primary" )) ? darkThemeColor : lightThemeColor}
                  ></SVG.ArrowDropDown>
                )}
              </span>
            )}
          </div>
          {item.children && isExpanded && hovered && (
            <div className="sidebar-children">
              {renderItems(item.children, currentIndex)}
            </div>
          )}
        </div>
      );
    });

  const filteredItems = filterItems(items, search);

  const getImageUrl = (imageKey) => {
    return IMAGES[imageKey] ;
  };

  const digitFooterImg = (theme === "dark" ? getImageUrl('DIGIT_FOOTER_DARK') : getImageUrl('DIGIT_FOOTER_LIGHT'));

  return (
    <div
      className={`sidebar ${hovered ? "hovered" : "collapsed"} ${theme || ""} ${variant || ""} ${className || ""}`}
      style={{
        transition: `width ${transitionDuration}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {renderSearch()}
      <div className={`sidebar-items-container ${theme || ""} ${variant || ""}`}>
        {renderItems(filteredItems)}
      </div>
      {hovered && (
        <div className={`sidebar-bottom ${theme || ""} ${variant || ""}`}>
          <div>
            <div className="sidebar-bottom-item">
              <SVG.Help width={"16px"} height={"16px"} fill={primaryColor} />
              <span className="sidebar-bottom-item-text">Help</span>
            </div>
            <div className={`sidebar-bottom-item`}>
              <SVG.Settings
                width={"16px"}
                height={"16px"}
                fill={primaryColor}
              />
              <span className="sidebar-bottom-item-text">Settings</span>
            </div>
            <div className={`sidebar-bottom-item`}>
              <SVG.Logout width={"16px"} height={"16px"} fill={primaryColor} />
              <span className="sidebar-bottom-item-text">Logout</span>
            </div>
            <hr className={`divider`}></hr>
          </div>
          <img
            className="digit-sidebar-footer-img"
            alt="Powered by DIGIT"
            src={digitFooterImg}
            onClick={() => {
              window
                .open(
                  window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"),
                  "_blank"
                )
                .focus();
            }}
          />
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array,
    })
  ).isRequired,
  theme: PropTypes.oneOf(["dark", "light"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  collapsedWidth: PropTypes.string,
  expandedWidth: PropTypes.string,
  transitionDuration: PropTypes.number,
};

Sidebar.defaultProps = {
  theme: "dark",
  variant:"primary",
  transitionDuration: 0.3,
};

export default Sidebar;
