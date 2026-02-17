import React, { useState } from "react";
import { SideNav, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MediaQuery from "react-responsive";
import LogoutDialog from "../../Dialog/LogoutDialog";

const CitizenSideNav = ({ linkData, islinkDataLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const tenantId = Digit?.ULBService?.getStateId();
  const user = Digit.UserService.getUser();
  const isLoggedIn = user && user.access_token && user?.info?.type === "CITIZEN";

  const [showDialog, setShowDialog] = useState(false);

  const handleLogoutSubmit = () => {
    Digit.UserService.logout();
    setShowDialog(false);
    window.location.href = `/${window?.contextPath}/citizen/login`;
  };

  const handleLogoutCancel = () => {
    setShowDialog(false);
  };

  const navigateToUrl = (url) => {
    if (!url || url === "/") return;

    const isExternal = /^https?:\/\//i.test(url);
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!url.includes(`/${window?.contextPath}`)) {
      const hostUrl = window.location.origin;
      if (isMultiRootTenant) {
        const contextPath = window?.contextPath || "sandbox-ui";
        url = url.replace(`/${contextPath}/citizen`, `/${contextPath}/${tenantId}/citizen`);
        navigate(url);
      } else {
        const updatedUrl = hostUrl + url;
        try {
          window.location.href = updatedUrl;
        } catch (error) {
          console.warn("Navigation failed, attempting fallback:", error);
          window.location.replace(updatedUrl);
        }
      }
    } else {
      navigate(url);
    }
  };

  const onItemSelect = ({ item }) => {
    if (item?.navigationUrl) {
      navigateToUrl(item.navigationUrl);
    }
  };

  const onBottomItemClick = (item) => {
    if (item === "Logout") {
      setShowDialog(true);
    }
  };

  const buildItems = () => {
    const isDigitStudio = window.location.href.includes("digit-studio");
    const items = [];
    let orderCounter = 1;

    if (isLoggedIn) {
      items.push({
        label: t("COMMON_BOTTOM_NAVIGATION_HOME"),
        icon: { icon: "Home", width: "1.5rem", height: "1.5rem" },
        navigationUrl: `/${window?.contextPath}/citizen`,
        orderNumber: orderCounter++,
      });

      items.push({
        label: t("EDIT_PROFILE"),
        icon: { icon: "Edit", width: "1.5rem", height: "1.5rem" },
        navigationUrl: `/${window?.contextPath}/citizen/user/profile`,
        orderNumber: orderCounter++,
      });
    }

    Object.keys(linkData || {})
      ?.sort((x, y) => x.localeCompare(y))
      ?.forEach((key) => {
        const moduleEntries = linkData[key];
        if (!moduleEntries || moduleEntries.length === 0) return;

        // Check if any entry in this module has a sidebar value ending with "-links"
        const hasSidebarLink = moduleEntries.some((entry) => entry.sidebar?.endsWith("-links"));
        if (!hasSidebarLink) return;

        const rawIcon = moduleEntries[0]?.leftIcon;
        const leftIcon = isDigitStudio && (!rawIcon || rawIcon === "TLIcon") ? "Devices" : (rawIcon || "ViewModule");

        // Deduplicate entries by name to avoid duplicate children
        const seen = new Set();
        const uniqueEntries = moduleEntries.filter((entry) => {
          if (seen.has(entry.name)) return false;
          seen.add(entry.name);
          return true;
        });

        // Build children from all entries (Apply, My Applications, etc.)
        const children = uniqueEntries.map((entry) => ({
          label: t(entry.displayName || entry.i18nKey),
          icon: { icon: isDigitStudio && (!entry.leftIcon || entry.leftIcon === "TLIcon") ? "Devices" : (entry.leftIcon || "ViewModule"), width: "1.5rem", height: "1.5rem" },
          navigationUrl: entry.navigationURL || entry.link,
          orderNumber: entry.orderNumber,
        }));

        // Sort children by orderNumber
        children.sort((a, b) => {
          const aOrder = a.orderNumber !== undefined ? a.orderNumber : Infinity;
          const bOrder = b.orderNumber !== undefined ? b.orderNumber : Infinity;
          return aOrder - bOrder;
        });

        if (children.length === 1) {
          // Single entry — render as flat item (no parent/child nesting)
          items.push({
            label: t(`ACTION_TEST_${Digit.Utils.locale.getTransformedLocale(key)}`),
            icon: { icon: leftIcon, width: "1.5rem", height: "1.5rem" },
            navigationUrl: children[0].navigationUrl,
            orderNumber: orderCounter++,
          });
        } else {
          // Multiple entries — render as parent with children
          items.push({
            label: t(`ACTION_TEST_${Digit.Utils.locale.getTransformedLocale(key)}`),
            icon: { icon: leftIcon, width: "1.5rem", height: "1.5rem" },
            children: children,
            orderNumber: orderCounter++,
          });
        }
      });

    items.sort((a, b) => {
      const aOrder = a.orderNumber !== undefined ? a.orderNumber : Infinity;
      const bOrder = b.orderNumber !== undefined ? b.orderNumber : Infinity;
      return aOrder - bOrder;
    });

    return items;
  };

  if (islinkDataLoading) {
    return <Loader />;
  }

  const items = buildItems();

  return (
    <React.Fragment>
      <MediaQuery minWidth={768}>
        <SideNav
          items={items}
          hideAccessbilityTools={!isLoggedIn}
          onSelect={onItemSelect}
          theme={window?.globalConfigs?.getConfig("SIDENAV_THEME") || "light"}
          enableSearch={true}
          variant={window?.globalConfigs?.getConfig("SIDENAV_VARIANT") || "primary"}
          transitionDuration={""}
          className=""
          styles={{ position : "unset"}}
          expandedWidth=""
          collapsedWidth=""
          onBottomItemClick={onBottomItemClick}
        />
      </MediaQuery>
      {showDialog && (
        <LogoutDialog
          onSelect={handleLogoutSubmit}
          onCancel={handleLogoutCancel}
          onDismiss={handleLogoutCancel}
        />
      )}
    </React.Fragment>
  );
};

export default CitizenSideNav;
