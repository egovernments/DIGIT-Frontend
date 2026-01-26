import React, { useState, useEffect,Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { SVG, TextInput } from "../atoms";
import { IMAGES } from "../constants/images/images";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";
import { Spacers } from "../constants/spacers/spacers";

const SideNav = ({
  items,
  theme,
  variant,
  transitionDuration,
  className,
  styles,
  hideAccessbilityTools,
  expandedWidth,
  collapsedWidth,
  onSelect,
  onBottomItemClick,
  enableSearch
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMultiRootTenant = Digit?.Utils?.getMultiRootTenant();
  const tenantId = Digit?.ULBService?.getStateId();
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const darkThemeColor = Colors.lightTheme.paper.primary;
  const lightThemeColor = Colors.lightTheme.primary[2];

  const primaryColor = theme === "dark" ? darkThemeColor : lightThemeColor;
  const iconSize = Spacers.spacer6;
  const bottomIconSize = Spacers.spacer4;

  useEffect(() => {
    const updateSelectedItem = (items, parentIndex) => {
      items?.forEach((item, index) => {
        if (item.children) {
          updateSelectedItem(item.children, index);
        } else if (item.navigationUrl) {
          let redirectionUrl = item.navigationUrl;
          if (isMultiRootTenant) {
            if (redirectionUrl.includes("sandbox-ui") && tenantId) {
              redirectionUrl = redirectionUrl.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`);
            }
          }
          if (location.pathname.startsWith(redirectionUrl)) {
            setSelectedItem({ item: item, index, parentIndex });
          }
        }
      })
    }
    updateSelectedItem(items, -1);
  }, [location.pathname, items]);

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
    onSelect && onSelect({ item: item, index: index, parentIndex: parentIndex });
  };

  const isParentOfSelectedItem = (index) => {
    const { parentIndex } = selectedItem;
    return parentIndex && parentIndex.toString().startsWith(index);
  };

  const IconRender = (
    isSelected,
    isParentOfSelectedItem,
    iconReq,
    iconFill,
    width = iconSize,
    height = iconSize
  ) => {
    return iconRender(
      iconReq,
      iconFill ||
        (theme === "dark" ||
        (theme === "light" && variant === "primary" && isSelected && hovered) ||
        (theme === "light" &&
          variant === "primary" &&
          (isSelected || isParentOfSelectedItem) &&
          !hovered)
          ? darkThemeColor
          : lightThemeColor),
      width,
      height,
      `digit-sidebar-item-icon`
    );
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
          <div
            className={`digit-sidebar-search-container ${theme || ""} ${
              variant || ""
            }`}
          >
            <TextInput
              type="search"
              className="digit-sidebar-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search")}
              autoFocus={true}
              iconFill={primaryColor}
            ></TextInput>
          </div>
        ) : (
          <div
            className={`digit-sidebar-search-container-collapsed ${
              theme || ""
            } ${variant || ""}`}
          >
            <SVG.Search
              width={"24px"}
              height={"24px"}
              fill={theme === "dark" ? darkThemeColor : lightThemeColor}
              className="search-icon"
            />
          </div>
        )}
      </>
    );
  };

  const renderItems = (items, parentIndex = -1) => 
    items?.map((item, index) => {
      const currentIndex = parentIndex >= 0 ? `${parentIndex}-${index}` : index;
      const isExpanded = expandedItems[currentIndex];
      const isSelected = selectedItem.item === item;
      const isTopLevel = parentIndex === -1;

      return (
        <div className={"item-child-wrapper"} key={currentIndex}>
          <div
            className={`digit-sidebar-item ${theme || ""} ${variant || ""} ${
              selectedItem.item === item ? "selected" : ""
            } ${parentIndex === -1 ? "parentLevel" : ""} ${
              isParentOfSelectedItem(currentIndex) ? "selectedAsParent" : ""
            } ${hovered ? "hovered" : "collapsed"}`}
            onClick={() => handleItemClick(item, currentIndex, parentIndex)}
            tabIndex={0}
          >
            {(isTopLevel || hovered) && (
              <span className="icon">
                {(isSelected || isParentOfSelectedItem(currentIndex)) &&
                item?.selectedIcon
                  ? IconRender(
                      isSelected,
                      isParentOfSelectedItem(currentIndex),
                      item?.selectedIcon?.icon,
                      item?.selectedIcon?.iconFill,
                      item?.selectedIcon?.width,
                      item?.selectedIcon?.height
                    )
                  : IconRender(
                      isSelected,
                      isParentOfSelectedItem(currentIndex),
                      item?.icon?.icon,
                      item?.icon?.iconFill,
                      item?.icon?.width,
                      item?.icon?.height
                    )}
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
                  <SVG.ArrowDropDown
                    fill={
                      theme === "dark" ||
                      (selectedItem.item === item &&
                        theme === "light" &&
                        variant === "primary")
                        ? darkThemeColor
                        : lightThemeColor
                    }
                  ></SVG.ArrowDropDown>
                ) : (
                  <SVG.ArrowDropDown
                    style={{ transform: "rotate(-90deg)" }}
                    fill={
                      theme === "dark" ||
                      (selectedItem.item === item &&
                        theme === "light" &&
                        variant === "primary")
                        ? darkThemeColor
                        : lightThemeColor
                    }
                  ></SVG.ArrowDropDown>
                )}
              </span>
            )}
          </div>
          {item.children && isExpanded && hovered && (
            <div className="digit-sidebar-children">
              {renderItems(item.children, currentIndex)}
            </div>
          )}
        </div>
      );
    });

  const filteredItems = filterItems(items, search);

  const getImageUrl = (imageKey) => {
    return IMAGES[imageKey];
  };

  const digitFooterImg =
    theme === "dark"
      ? getImageUrl("DIGIT_FOOTER_DARK")
      : getImageUrl("DIGIT_FOOTER_LIGHT");

  return (
    <div
      className={`digit-sidebar ${hovered ? "hovered" : "collapsed"} ${
        theme || ""
      } ${variant || ""} ${enableSearch ? "" :"searchDisabled"} ${className || ""}`}
      style={{
        width:
          hovered && expandedWidth
            ? expandedWidth
            : !hovered && collapsedWidth
            ? collapsedWidth
            : undefined,
        transition: `width ${transitionDuration || 0.5}s`,
        ...styles,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {enableSearch && renderSearch()}
      <div
        className={`digit-sidebar-items-container ${theme || ""} ${
          variant || ""
        } ${enableSearch ? "" :"searchDisabled"}`}
      >
        {filteredItems.length > 0 ? (
          renderItems(filteredItems)
        ) : (
          hovered && <div className="digit-msb-no-results">{t("No Results Found")}</div>
        )}
      </div>
      {hovered && !hideAccessbilityTools && (
        <div className={`digit-sidebar-bottom ${theme || ""} ${variant || ""}`}>
          <div>
            <div className="digit-sidebar-bottom-item" onClick={()=> onBottomItemClick && onBottomItemClick("Help")}>
              <SVG.Help width={bottomIconSize} height={bottomIconSize} fill={primaryColor} />
              <span className="digit-sidebar-bottom-item-text">{t("Help")}</span>
            </div>
            <div className={`digit-sidebar-bottom-item`} onClick={()=> onBottomItemClick && onBottomItemClick("Settings")}>
              <SVG.Settings
                width={bottomIconSize}
                height={bottomIconSize}
                fill={primaryColor}
              />
              <span className="digit-sidebar-bottom-item-text">{t("Settings")}</span>
            </div>
            <div className={`digit-sidebar-bottom-item`} onClick={()=>onBottomItemClick && onBottomItemClick("Logout")}>
              <SVG.Logout width={bottomIconSize} height={bottomIconSize} fill={primaryColor} />
              <span className="digit-sidebar-bottom-item-text">{t("Logout")}</span>
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

SideNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      icon: PropTypes.object,
      label: PropTypes.string.isRequired,
      children: PropTypes.array,
    })
  ).isRequired,
  theme: PropTypes.oneOf(["dark", "light"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  collapsedWidth: PropTypes.string,
  expandedWidth: PropTypes.string,
  transitionDuration: PropTypes.number,
  styles: PropTypes.object,
  hideAccessbilityTools: PropTypes.bool,
  enableSearch: PropTypes.bool,
};

SideNav.defaultProps = {
  theme: "dark",
  variant: "primary",
  transitionDuration: 0.3,
  styles: {},
  enableSearch: true
};

export default SideNav;
