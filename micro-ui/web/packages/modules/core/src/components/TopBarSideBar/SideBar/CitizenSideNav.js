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

  // Tenant + language switchers — parity with the mobile hamburger (CitizenSideBar).
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { languages, stateInfo } = storeData || {};

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

  // Same behaviour as the mobile hamburger's city switch: narrow the logged-in
  // user's roles/tenant to the picked city and reload.
  const handleChangeCity = (city) => {
    const loggedInData = Digit.SessionStorage.get("citizen.userRequestObject");
    const filteredRoles = loggedInData?.info?.roles?.filter((role) => role.tenantId === city.value);
    if (filteredRoles?.length > 0) {
      loggedInData.info.roles = filteredRoles;
      loggedInData.info.tenantId = city?.value;
    }
    Digit.SessionStorage.set("Employee.tenantId", city?.value);
    Digit.UserService.setUser(loggedInData);
    try {
      window.location.reload();
    } catch (error) {
      console.warn("Failed to reload page:", error);
    }
  };

  const handleChangeLanguage = (language) => {
    Digit.LocalizationService.changeLanguage(language.value, stateInfo?.code);
  };

  const onItemSelect = ({ item }) => {
    if (item?.type === "custom") {
      if (item.key === "city") handleChangeCity(item);
      else if (item.key === "language") handleChangeLanguage(item);
      return;
    }
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

    // DIGIT Studio only: city + language switchers (parity with the mobile
    // hamburger), since Studio drops the module-links section below. Stock
    // DIGIT keeps its original sidebar contents unchanged.
    if (isDigitStudio) {
      // Options come from the logged-in user's role tenants; without options
      // (logged out) the item still shows the current city, like mobile.
      const cityCodes = [
        ...new Set(
          (Digit.SessionStorage.get("citizen.userRequestObject")?.info?.roles || [])
            .map((role) => role.tenantId)
            .filter(Boolean)
        ),
      ];
      const cityChildren = cityCodes.map((code) => ({
        label: t(`TENANT_TENANTS_${code.replace(/\./g, "_").toUpperCase()}`),
        value: code,
        type: "custom",
        key: "city",
        icon: { icon: "LocationCity", width: "1.5rem", height: "1.5rem" },
      }));
      const currentCityLabel = isMultiRootTenant
        ? t(`TENANT_TENANTS_${tenantId}`)
        : t(`TENANT_TENANTS_${(Digit.ULBService.getCurrentTenantId() || "").replace(/\./g, "_").toUpperCase()}`);
      items.push({
        label: currentCityLabel,
        icon: { icon: "LocationCity", width: "1.5rem", height: "1.5rem" },
        children: cityChildren.length > 0 ? cityChildren : undefined,
        orderNumber: orderCounter++,
      });

      items.push({
        label: t("Language"),
        icon: { icon: "Language", width: "1.5rem", height: "1.5rem" },
        children:
          languages?.length > 0
            ? languages.map((language) => ({
                ...language,
                type: "custom",
                key: "language",
                icon: { icon: "Language", width: "1.5rem", height: "1.5rem" },
              }))
            : undefined,
        orderNumber: orderCounter++,
      });
    }

    // DIGIT Studio: citizen services are reached from the home/landing tiles —
    // the module links section is dropped from the sidebar entirely (mobile
    // parity: CitizenSideBar's hamburger drops its "Modules" group).
    if (!isDigitStudio) {
      Object.keys(linkData || {})
        ?.sort((x, y) => x.localeCompare(y))
        ?.forEach((key) => {
          const moduleEntries = linkData[key];
          if (!moduleEntries || moduleEntries.length === 0) return;

          // Check if any entry in this module has a sidebar value ending with "-links"
          const hasSidebarLink = moduleEntries.some((entry) => entry.sidebar?.endsWith("-links"));
          if (!hasSidebarLink) return;

          const rawIcon = moduleEntries[0]?.leftIcon;
          const leftIcon = rawIcon || "ViewModule";

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
            icon: { icon: entry.leftIcon || "ViewModule", width: "1.5rem", height: "1.5rem" },
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
    }

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
