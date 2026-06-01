import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  EditPencilIcon,
  LogoutIcon,
  AddressBookIcon,
  PropertyHouse,
  CaseIcon,
  CollectionIcon,
  PTIcon,
  OBPSIcon,
  PGRIcon,
  FSMIcon,
  WSICon,
  MCollectIcon,
  Phone,
  BirthIcon,
  DeathIcon,
  FirenocIcon,
  Loader,
} from "@egovernments/digit-ui-react-components";
import { Link, useLocation } from "react-router-dom";
import SideBarMenu from "../../../config/sidebar-menu";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import LogoutDialog from "../../Dialog/LogoutDialog";
import ChangeCity from "../../ChangeCity";
import { defaultImage } from "../../utils";
import ImageComponent from "../../ImageComponent";

/* 
Feature :: Citizen Webview sidebar
*/
const Profile = ({ info, stateName, t, countryCode }) => (
  <div className="profile-section">
    <div className="imageloader imageloader-loaded">
      <ImageComponent className="img-responsive img-circle img-Profile" src={defaultImage} alt="Profile Logo" />
    </div>
    <div id="profile-name" className="label-container name-Profile">
      <div className="label-text"> {info?.name} </div>
    </div>
    <div id="profile-location" className="label-container loc-Profile">
      <div className="label-text"> {countryCode ? `${countryCode} ${info?.mobileNumber}` : info?.mobileNumber} </div>
    </div>
    {info?.emailId && (
      <div id="profile-emailid" className="label-container loc-Profile">
        <div className="label-text"> {info.emailId} </div>
      </div>
    )}
    <div className="profile-divider"></div>
    {window.location.href.includes("/employee") &&
      !window.location.href.includes("/employee/user/login") &&
      !window.location.href.includes("employee/user/language-selection") && <ChangeCity t={t} mobileView={true} />}
  </div>
);
const WhatsAppLogo = ({ className }) => (
  // Two-tone (green circle + white handset). Fills are set via inline style so
  // they win over the sidebar's ".icon { fill: grey }" CSS rule.
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      style={{ fill: "#25D366" }}
      d="M12 .5A11.5 11.5 0 0 0 2.1 17.8L1 23l5.3-1.4A11.5 11.5 0 1 0 12 .5z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
    />
  </svg>
);

const IconsObject = {
  CommonPTIcon: <PTIcon className="icon" />,
  OBPSIcon: <OBPSIcon className="icon" />,
  propertyIcon: <PropertyHouse className="icon" />,
  TLIcon: <CaseIcon className="icon" />,
  PGRIcon: <PGRIcon className="icon" />,
  FSMIcon: <FSMIcon className="icon" />,
  WSIcon: <WSICon className="icon" />,
  MCollectIcon: <MCollectIcon className="icon" />,
  BillsIcon: <CollectionIcon className="icon" />,
  BirthIcon: <BirthIcon className="icon" />,
  DeathIcon: <DeathIcon className="icon" />,
  FirenocIcon: <FirenocIcon className="icon" />,
  HomeIcon: <HomeIcon className="icon" />,
  EditPencilIcon: <EditPencilIcon className="icon" />,
  LogoutIcon: <LogoutIcon className="icon" />,
  Phone: <Phone className="icon" />,
  WhatsAppIcon: <WhatsAppLogo className="icon" />,
};
const StaticCitizenSideBar = ({ linkData, islinkDataLoading }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const { data: storeData, isFetched } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const user = Digit.UserService.getUser();
  let isMobile = window.Digit.Utils.browser.isMobile();

  const [isEmployee, setisEmployee] = useState(false);
  const [isSidebarOpen, toggleSidebar] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    const fetchCountryCode = async () => {
      const tenant = Digit.ULBService.getCurrentTenantId();
      const uuid = user?.info?.uuid;
      if (uuid) {
        const res = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
        if (res?.user?.length) setCountryCode(res.user[0]?.countryCode || null);
      }
    };
    fetchCountryCode();
  }, [user?.info?.uuid]);

  const handleLogout = () => {
    toggleSidebar(false);
    setShowDialog(true);
  };
  const handleOnSubmit = async () => {
    const savedDigitLocale = window.sessionStorage.getItem("Digit.locale");
    try {
      await Digit.UserService.logoutUser();
    } catch (e) { }
    window.localStorage.clear();
    window.sessionStorage.clear();
    if (savedDigitLocale) {
      window.sessionStorage.setItem("Digit.locale", savedDigitLocale);
    }
    setShowDialog(false);
    window.location.replace(`/${window?.contextPath}/citizen`);
  };
  const handleOnCancel = () => {
    setShowDialog(false);
  };

  if (islinkDataLoading) {
    return <Loader />;
  }

  const redirectToLoginPage = () => {
    // localStorage.clear();
    // sessionStorage.clear();
    history.push(`/${window?.contextPath}/citizen/login`);
  };
  const showProfilePage = () => {
    history.push(`/${window?.contextPath}/citizen/user/profile`);
  };

  const closeSidebar = () => {
    history.push(`/${window?.contextPath}/citizen/all-services`);
  };

  let menuItems = [...SideBarMenu(t, showProfilePage, redirectToLoginPage, isEmployee)];

  menuItems = menuItems.filter((item) => item.element !== "LANGUAGE");

  const tenantId = Digit.ULBService.getCurrentTenantId();

  // WhatsApp option config — read from global config if present, else defaults.
  const whatsApp = {
    number: window?.globalConfigs?.getConfig?.("WHATSAPP_BUSINESS_NUMBER") || "917676472431",
    text: window?.globalConfigs?.getConfig?.("WHATSAPP_DEFAULT_TEXT") || "hi",
    label: window?.globalConfigs?.getConfig?.("WHATSAPP_LABEL") || "Contact us",
    displayNumber: window?.globalConfigs?.getConfig?.("WHATSAPP_DISPLAY_NUMBER") || "+91 76764 72431",
  };

  const MenuItem = ({ item }) => {
    const leftIconArray = item?.icon || item.icon?.type?.name;
    const leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.BillsIcon;
    let itemComponent;
    if (item.type === "component") {
      itemComponent = item.action;
    } else {
      itemComponent = item.text;
    }
    const Item = () => (
      <span className="menu-item" {...item.populators}>
        {leftIcon}
        <div className="menu-label">{itemComponent}</div>
      </span>
    );
    if (item.type === "external-link") {
      return (
        <a href={item.link}>
          <Item />
        </a>
      );
    }
    if (item.type === "link") {
      return (
        <Link to={item?.link}>
          <Item />
        </Link>
      );
    }

    return <Item />;
  };
  let profileItem;

  if (isFetched && user && user.access_token && user?.info?.type === "CITIZEN") {
    profileItem = <Profile info={user?.info} stateName={stateInfo?.name} t={t} countryCode={countryCode} />;
    menuItems = menuItems.filter((item) => item?.id !== "login-btn");
    menuItems = [
      ...menuItems,
      {
        type: "link",
        icon: "HomeIcon",
        element: "HOME",
        text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
        link: isEmployee ? `/${window?.contextPath}/employee` : `/${window?.contextPath}/citizen`,
        populators: {
          onClick: closeSidebar,
        },
      },
      {
        text: t("EDIT_PROFILE"),
        element: "PROFILE",
        icon: "EditPencilIcon",
        populators: {
          onClick: showProfilePage,
        },
      },
      {
        text: t("CORE_COMMON_LOGOUT"),
        element: "LOGOUT",
        icon: "LogoutIcon",
        populators: { onClick: handleLogout },
      },
      {
        // Opens WhatsApp for our business number (+91 76764 72431) with "hi"
        // pre-filled. App-first: tries the WhatsApp Desktop app (no tab); if the
        // app isn't installed, falls back to WhatsApp Web in a NEW tab (DIGIT page
        // stays open). The fallback is skipped when the app takes over (detected
        // via lost focus/visibility or timer drift), so it won't open two tabs.
        text: (
          <React.Fragment>
            {t("CS_COMMON_WHATSAPP_CHATBOT", whatsApp.label)}
            <div className="telephone" style={{ marginTop: "-10%" }}>
              <div className="link">{whatsApp.displayNumber}</div>
            </div>
          </React.Fragment>
        ),
        element: "WHATSAPP_CHATBOT",
        icon: "WhatsAppIcon",
        populators: {
          onClick: () => {
            const encodedText = encodeURIComponent(whatsApp.text);
            const appUrl = `whatsapp://send?phone=${whatsApp.number}&text=${encodedText}`;
            const webUrl = `https://wa.me/${whatsApp.number}?text=${encodedText}`;
            const start = Date.now();
            setTimeout(() => {
              // App opened => tab lost focus/visibility, or timers drifted while the
              // OS "Open WhatsApp?" dialog was up. In any of those cases, don't fall back.
              if (document.hidden || !document.hasFocus() || Date.now() - start > 1100) return;
              window.open(webUrl, "_blank", "noopener,noreferrer");
            }, 800);
            window.location.href = appUrl;
          },
        },
      },

    ];
  }
  Object.keys(linkData)
    ?.sort((x, y) => y.localeCompare(x))
    ?.map((key) => {
      if (linkData[key][0]?.sidebar === `${window.contextPath}-links`) {
        menuItems.splice(1, 0, {
          type: linkData[key][0]?.sidebarURL?.includes(window?.contextPath) ? "link" : "external-link",
          text: t(`ACTION_TEST_${Digit.Utils.locale.getTransformedLocale(key)}`),
          links: linkData[key],
          icon: linkData[key][0]?.leftIcon,
          link: linkData[key][0]?.sidebarURL,
        });
      }
    });

  return (
    <React.Fragment>
      <div>
        <div
          style={{
            height: "100%",
            width: "100%",
            top: "0px",
            backgroundColor: "rgba(0, 0, 0, 0.54)",
            pointerzevents: "auto",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "calc(100vh - 56px)" : "auto",
            zIndex: "99",
          }}
        >
          {profileItem}
          <div className="drawer-desktop">
            {menuItems?.map((item, index) => (
              <div className={`sidebar-list ${pathname === item?.link || pathname === item?.sidebarURL ? "active" : ""}`} key={index}>
                <MenuItem item={item} />
              </div>
            ))}
          </div>
        </div>
        <div>{showDialog && <LogoutDialog onSelect={handleOnSubmit} onCancel={handleOnCancel} onDismiss={handleOnCancel}></LogoutDialog>}</div>
      </div>
    </React.Fragment>
  );
};

export default StaticCitizenSideBar;
