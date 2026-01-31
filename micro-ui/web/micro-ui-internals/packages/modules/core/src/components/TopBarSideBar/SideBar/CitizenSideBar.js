// import { NavBar } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-components";
import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ChangeCity from "../../ChangeCity";
import { defaultImage } from "../../utils";
import StaticCitizenSideBar from "./StaticCitizenSideBar";
import { Hamburger } from "@egovernments/digit-ui-components";
import { LogoutIcon } from "@egovernments/digit-ui-react-components";
import ImageComponent from "../../ImageComponent";

const Profile = ({ info, stateName, t }) => {
  const [profilePic, setProfilePic] = React.useState(null);
  React.useEffect(async () => {
    const tenant = Digit.ULBService.getCurrentTenantId();
    const uuid = info?.uuid;
    if (uuid) {
      const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
      if (usersResponse && usersResponse.user && usersResponse?.user?.length) {
        const userDetails = usersResponse.user[0];
        const thumbs = userDetails?.photo?.split(",");
        setProfilePic(thumbs?.at(0));
      }
    }
  }, [profilePic !== null]);

  const CustomEmployeeTopBar = Digit.ComponentRegistryService?.getComponent("CustomEmployeeTopBar");

  return (
    <div className="profile-section">
      <div className="imageloader imageloader-loaded">
        <ImageComponent
          className="img-responsive img-circle img-Profile"
          src={profilePic ? profilePic : defaultImage}
          style={{ objectFit: "cover", objectPosition: "center" }}
          alt="Profile Image"
        />
      </div>
      <div id="profile-name" className="label-container name-Profile">
        <div className="label-text"> {info?.name} </div>
      </div>
      <div id="profile-location" className="label-container loc-Profile">
        <div className="label-text"> {info?.mobileNumber} </div>
      </div>
      {info?.emailId && (
        <div id="profile-emailid" className="label-container loc-Profile">
          <div className="label-text"> {info.emailId} </div>
        </div>
      )}
      <div className="profile-divider"></div>
      {window.location.href.includes("/employee") &&
        !window.location.href.includes("/employee/user/login") &&
        !window.location.href.includes("employee/user/language-selection") &&
        !CustomEmployeeTopBar && <ChangeCity t={t} mobileView={true} />}
    </div>
  );
};

/* 
Feature :: Citizen Webview sidebar
*/
export const CitizenSideBar = ({
  isOpen,
  isMobile = false,
  toggleSidebar,
  onLogout,
  isEmployee = false,
  linkData,
  islinkDataLoading,
  userProfile,
}) => {
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const { data: storeData, isFetched } = Digit.Hooks.useStore.getInitData();
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const [profilePic, setProfilePic] = useState(null);
  const { languages, stateInfo } = storeData || {};
  const user = Digit.UserService.getUser();
  const [search, setSearch] = useState("");
  const [dropDownData, setDropDownData] = useState(null);
  const [selectCityData, setSelectCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]); //selectedCities?.[0]?.value
  const [selected, setselected] = useState(selectedLanguage);
  let selectedCities = [];
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();

  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str?.includes(searcher)) {
      str = str?.replace(searcher, replaceWith);
    }
    return str;
  };

  useEffect(() => {
    const userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    let teantsArray = [],
      filteredArray = [];
    userloggedValues?.info?.roles?.forEach((role) => teantsArray.push(role.tenantId));
    let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);
    unique?.forEach((uniCode) => {
      filteredArray.push({
        label: t(`TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`),
        value: uniCode,
      });
    });
    selectedCities = filteredArray?.filter((select) => select.value == Digit.SessionStorage.get("Employee.tenantId"));
    setSelectCityData(filteredArray);
  }, [dropDownData]);

  const closeSidebar = () => {
    Digit.clikOusideFired = true;
    toggleSidebar(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const tenant = Digit.ULBService.getCurrentTenantId();
      const uuid = user?.info?.uuid;
      if (uuid) {
        const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
        const userData = usersResponse?.user?.[0];
        if (userData) {
          const currentUser = Digit.UserService.getUser();
          Digit.UserService.setUser({
            ...currentUser,
            info: userData
          });
        }
        if (usersResponse && usersResponse.user && usersResponse?.user?.length) {
          const userDetails = usersResponse.user[0];
          const thumbs = userDetails?.photo?.split(",");
          setProfilePic(thumbs?.at(0));
        }
      }
    };
    if (!profilePic) {
      fetchUserProfile();
    }
  }, [profilePic]);

  const handleChangeCity = (city) => {
    const loggedInData = Digit.SessionStorage.get("citizen.userRequestObject");
    const filteredRoles = Digit.SessionStorage.get("citizen.userRequestObject")?.info?.roles?.filter((role) => role.tenantId === city.value);
    if (filteredRoles?.length > 0) {
      loggedInData.info.roles = filteredRoles;
      loggedInData.info.tenantId = city?.value;
    }
    Digit.SessionStorage.set("Employee.tenantId", city?.value);
    Digit.UserService.setUser(loggedInData);
    setDropDownData(city);
    if (window.location.href.includes(`/${window?.contextPath}/employee/`)) {
      const redirectPath = location.state?.from || `/${window?.contextPath}/employee`;
      history.replace(redirectPath);
    }
    window.location.reload();
  };

  const handleChangeLanguage = (language) => {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };

  const handleModuleClick = (url) => {
    let updatedUrl = null;
    if (Digit.Utils.getMultiRootTenant()) {
      updatedUrl = isEmployee
        ? url.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`)
        : url.replace("/sandbox-ui/citizen", `/sandbox-ui/${tenantId}/citizen`);
      history.push(updatedUrl);
      toggleSidebar();
    } else {
      url[0] === "/"
        ? history.push(`/${window?.contextPath}/${isEmployee ? "employee" : "citizen"}${url}`)
        : history.push(`/${window?.contextPath}/${isEmployee ? "employee" : "citizen"}/${url}`);
      toggleSidebar();
    }
  };

  const redirectToLoginPage = () => {
    if (isEmployee) {
      history.push(`/${window?.contextPath}/employee/user/language-selection`);
    } else {
      history.push(`/${window?.contextPath}/citizen/login`);
    }
    closeSidebar();
  };

  if (islinkDataLoading || isLoading) {
    return <Loader />;
  }

  let menuItems = [
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

  let profileItem;
  if (isFetched && user && user.access_token) {
    profileItem = <Profile info={user?.info} stateName={stateInfo?.name} t={t} />;
    menuItems = menuItems.filter((item) => item?.id !== "login-btn");
  }

  let configEmployeeSideBar = {};

  if (!isEmployee) {
    Object.keys(linkData)
      ?.sort((x, y) => y.localeCompare(x))
      ?.map((key) => {
        if (linkData[key][0]?.sidebar === "digit-ui-links")
          menuItems.splice(1, 0, {
            type: linkData[key][0]?.sidebarURL?.includes(window?.contextPath) ? "link" : "external-link",
            text: t(`ACTION_TEST_${Digit.Utils.locale.getTransformedLocale(key)}`),
            links: linkData[key],
            icon: linkData[key][0]?.leftIcon,
            link: linkData[key][0]?.sidebarURL,
          });
      });
  } else {
    data?.actions
      .filter((e) => e.url === "url" && e.displayName !== "Home")
      .forEach((item) => {
        if (search == "" && item.path !== "") {
          let index = item.path.split(".")[0];
          if (index === "TradeLicense") index = "Trade License";
          if (!configEmployeeSideBar[index]) {
            configEmployeeSideBar[index] = [item];
          } else {
            configEmployeeSideBar[index].push(item);
          }
        } else if (item.path !== "" && item?.displayName?.toLowerCase().includes(search.toLowerCase())) {
          let index = item.path.split(".")[0];
          if (index === "TradeLicense") index = "Trade License";
          if (!configEmployeeSideBar[index]) {
            configEmployeeSideBar[index] = [item];
          } else {
            configEmployeeSideBar[index].push(item);
          }
        }
      });
    const keys = Object.keys(configEmployeeSideBar);
    for (let i = 0; i < keys?.length; i++) {
      const getSingleDisplayName = configEmployeeSideBar[keys[i]][0]?.displayName?.toUpperCase()?.replace(/[ -]/g, "_");
      const getParentDisplayName = keys[i]?.toUpperCase()?.replace(/[ -]/g, "_");

      if (configEmployeeSideBar[keys[i]][0].path.indexOf(".") === -1) {
        menuItems.splice(1, 0, {
          type: "link",
          text: t(`ACTION_TEST_${getSingleDisplayName}`),
          link: configEmployeeSideBar[keys[i]][0]?.navigationURL,
          icon: configEmployeeSideBar[keys[i]][0]?.leftIcon,
          populators: {
            onClick: () => {
              history.push(configEmployeeSideBar[keys[i]][0]?.navigationURL);
              closeSidebar();
            },
          },
        });
      } else {
        menuItems.splice(1, 0, {
          type: "dynamic",
          moduleName: t(`ACTION_TEST_${getParentDisplayName}`),
          links: configEmployeeSideBar[keys[i]]?.map((ob) => {
            return {
              ...ob,
              displayName: t(`ACTION_TEST_${ob?.displayName?.toUpperCase()?.replace(/[ -]/g, "_")}`),
            };
          }),
          icon: configEmployeeSideBar[keys[i]][1]?.leftIcon,
        });
      }
    }
    const indx = menuItems.findIndex((a) => a.element === "HOME");
    const home = menuItems.splice(indx, 1);
    const comp = menuItems.findIndex((a) => a.element === "LANGUAGE");
    const part = menuItems.splice(comp, menuItems?.length - comp);
    menuItems.sort((a, b) => {
      let c1 = a?.type === "dynamic" ? a?.moduleName : a?.text;
      let c2 = b?.type === "dynamic" ? b?.moduleName : b?.text;
      return c1.localeCompare(c2);
    });
    home?.[0] && menuItems.splice(0, 0, home[0]);
    menuItems = part?.length > 0 ? menuItems.concat(part) : menuItems;
  }

  /*  URL with openlink wont have sidebar and actions    */
  if (history.location.pathname.includes("/openlink")) {
    profileItem = <span></span>;
    menuItems = menuItems.filter((ele) => ele.element === "LANGUAGE");
  }

  menuItems = menuItems?.map((item) => ({
    ...item,
    label: item?.text || item?.moduleName || "",
    icon: item?.icon ? item?.icon : undefined,
  }));

  let city = "";
  if (Digit.Utils.getMultiRootTenant()) {
    city = t(`TENANT_TENANTS_${tenantId}`);
  } else {
    city = t(`TENANT_TENANTS_${stringReplaceAll(Digit.ULBService.getCurrentTenantId(), ".", "_")?.toUpperCase()}`);
    // city = "TEST";
  }
  const goToHome = () => {
    if (isEmployee) {
      history.push(`/${window?.contextPath}/employee`);
    } else {
      history.push(`/${window?.contextPath}/citizen`);
    }
  };
  const onItemSelect = ({ item, index, parentIndex }) => {
    if (item?.navigationURL) {
      handleModuleClick(item?.navigationURL);
    } else if (item?.link) {
      handleModuleClick(item?.link);
    } else if (item?.type === "custom") {
      switch (item?.key) {
        case "home":
          goToHome();
          toggleSidebar();
          break;
        case "editProfile":
          userProfile();
          toggleSidebar();
          break;
        case "language":
          handleChangeLanguage(item);
          toggleSidebar();
          break;
        case "city":
          handleChangeCity(item);
          toggleSidebar();
          break;
      }
    } else {
      return;
    }
  };

  const transformedMenuItems = menuItems?.map((item) => {
    if (item?.type === "dynamic") {
      return {
        ...item,
        children: item?.links?.map((link) => ({
          ...link,
          label: link?.displayName,
          icon: link?.leftIcon,
        })),
      };
    } else {
      return item;
    }
  });

  const transformedSelectedCityData = selectCityData?.map((city) => ({
    ...city,
    type: "custom",
    key: "city",
  }));

  const transformedLanguageData = languages?.map((language) => ({
    ...language,
    type: "custom",
    key: "language",
    icon: "Language",
  }));

  const hamburgerItems = [
    {
      label: "HOME",
      value: "HOME",
      icon: "Home",
      // children: transformedSelectedCityData?.length>0 ? transformedSelectedCityData : undefined,
      type: "custom",
      key: "home",
    },
    {
      label: city,
      value: city,
      children: transformedSelectedCityData?.length > 0 ? transformedSelectedCityData : undefined,
      type: "custom",
      icon: "LocationCity",
      key: "city",
    },
    {
      label: t("Language"),
      children: transformedLanguageData?.length > 0 ? transformedLanguageData : undefined,
      type: "custom",
      icon: "Language",
      key: "language",
    },
    ...(user && user.access_token
    ? [
        {
          label: t("EDIT_PROFILE"),
          type: "custom",
          icon: "Edit",
          key: "editProfile",
        },
      ]
    : []),
    {
      label: t("Modules"),
      icon: "DriveFileMove",
      children: transformedMenuItems,
    },
  ];
  return isMobile ? (
    <Hamburger
      items={hamburgerItems}
      profileName={user?.info?.name}
      profileNumber={user?.info?.mobileNumber || user?.info?.emailId}
      theme="dark"
      transitionDuration={0.3}
      styles={{ marginTop: "64px", height: "93%" }}
      onLogout={onLogout}
      hideUserManuals={true}
      profile={profilePic ? profilePic : undefined}
      isSearchable={true}
      onSelect={({ item, index, parentIndex }) => onItemSelect({ item, index, parentIndex })}
    />
  ) : (
    <StaticCitizenSideBar logout={onLogout} />
  );
};