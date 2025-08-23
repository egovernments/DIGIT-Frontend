import React from "react";
import { LanguageIcon, LogoutIcon, AddressBookIcon, LocationIcon } from "../../custom-components";
import ChangeLanguage from "../components/ChangeLanguage";

const SideBarMenu = (t, closeSidebar, redirectToLoginPage, isEmployee) => [
  {
    type: "component",
    element: "LANGUAGE",
    action: <ChangeLanguage />,
    icon: "LanguageIcon",
  },
  {
    id: "login-btn",
    element: "LOGIN",
    text: t("CORE_COMMON_LOGIN"),
    icon: <LogoutIcon className="icon" />,
    populators: {
      onClick: redirectToLoginPage,
    },
  },
];

export default SideBarMenu;
