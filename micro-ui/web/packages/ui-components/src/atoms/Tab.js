import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import StringManipulator from "./StringManipulator";
import { iconRender } from "../utils/iconRender";
import { Colors } from "../constants/colors/colorconstants";
import { Spacers } from "../constants/spacers/spacers";

const Tab = ({
  configNavItems,
  configItemKey,
  activeLink,
  setActiveLink,
  showNav = false,
  children,
  style = {},
  className = "",
  navClassName = "",
  navStyles = {},
  itemStyle = {},
  onTabClick,
  configDisplayKey
}) => {
  const { t } = useTranslation();
  const primaryColor = Colors.lightTheme.primary[1];
  const secondaryColor = Colors.lightTheme.text.secondary;
  const iconSize = Spacers.spacer6;

  const itemRefs = useRef([]);
  const [maxWidth, setMaxWidth] = useState(0);

  const setActive = (item) => {
    setActiveLink(item?.[configItemKey]);
    onTabClick && onTabClick(item);
  };

  const calculateMaxWidth = () => {
    // Calculate the maximum width of all tab items
    const widths = itemRefs.current.map(
      (ref) => ref?.getBoundingClientRect().width || 0
    );
    const maxItemWidth = Math.max(...widths);
    setMaxWidth(maxItemWidth);
  };


  const handleKeyDown = (e, item) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setActive(item);
    }
  };

 useEffect(() => {
    calculateMaxWidth();
  }, [configNavItems, activeLink]);

  return (
    <div className={`digit-tab-main ${navClassName}`} style={navStyles}>
      {showNav && (
        <div className={`digit-tab ${className}`} style={style}
          role="tablist"
          aria-label="Tab navigation"
        >
          {configNavItems?.map((item, index) => {
            const isActive = activeLink === item?.[configItemKey];
            const tabId = `tab-${item?.[configItemKey]}`;
            const panelId = `tabpanel-${item?.[configItemKey]}`;

          return (
            <div
              key={index}
              className={`digit-tab-list ${isActive ? "active" : ""}`}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, item)}
              onClick={() => setActive(item)}
            >
              <span
                ref={(el) => (itemRefs.current[index] = el)}
                className="digit-tab-item"
                style={
                  maxWidth
                    ? {
                        minWidth: `${maxWidth}px`,
                        ...itemStyle,
                      }
                    : { ...itemStyle }
                }
              >
                {item?.icon && (
                  <div className="digit-tab-icon" aria-hidden="true">
                    {iconRender(
                      item?.icon,
                      activeLink === item?.[configItemKey]
                        ? primaryColor
                        : secondaryColor,
                      iconSize,
                      iconSize,
                      ``
                    )}
                  </div>
                )}
                <div className="digit-tab-label">
                  {StringManipulator(
                    "CAPITALIZEFIRSTLETTER",
                    configDisplayKey ? t(item?.[configDisplayKey]) : t(item?.[configItemKey])
                  )}
                </div>
              </span>
            </div>
          )
        })}
        </div>
      )}
      {children}
    </div>
  );
};

Tab.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
      icon: PropTypes.string,
    })
  ).isRequired,
  configItemKey: PropTypes.string,
  style: PropTypes.object,
  navStyles: PropTypes.object,
  itemStyle: PropTypes.object,
  showNav: PropTypes.bool,
  className: PropTypes.string,
  navClassName: PropTypes.string,
  activeLink: PropTypes.string,
};

Tab.defaultProps = {
  showNav: false,
  style: {},
  className: "",
  navClassName: "",
  navStyles: {},
  itemStyle: {},
};

export default Tab;
