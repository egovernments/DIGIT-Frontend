import { Hamburger, TopBar as TopBarComponent } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-components";
import React, { Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ChangeCity from "../ChangeCity";
import ChangeLanguage from "../ChangeLanguage";
import { Header as TopBarComponentMain } from "@egovernments/digit-ui-components";
import ImageComponent from "../ImageComponent";

const DEFAULT_EGOV_LOGO ="https://egov-dev-assets.s3.ap-south-1.amazonaws.com/egov-logo-2025.png";
const TopBar = ({
  t,
  stateInfo,
  toggleSidebar,
  isSidebarOpen,
  handleLogout,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  userOptions,
  handleUserDropdownSelection,
  logoUrl,
  logoUrlWhite,
  showLanguageChange = true,
}) => {
  const [profilePic, setProfilePic] = React.useState(null);

  React.useEffect(async () => {
    const tenant = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId();
    const uuid = userDetails?.info?.uuid;
    if (uuid) {
      const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
      if (usersResponse && usersResponse.user && usersResponse.user.length) {
        const userDetails = usersResponse.user[0];
        const thumbs = userDetails?.photo?.split(",");
        setProfilePic(thumbs?.at(0));
      }
    }
  }, [profilePic !== null, userDetails?.info?.uuid]);

  const CitizenHomePageTenantId = Digit.ULBService.getCitizenCurrentTenant(true);

  let history = useHistory();
  const { pathname } = useLocation();

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (Digit.UserService?.getUser()?.info?.type === "CITIZEN") {
      if (!CitizenHomePageTenantId) return false;
      else return true;
    }
    return false;
  };

  const { data: { unreadCount: unreadNotificationCount } = {}, isSuccess: notificationCountLoaded } = Digit.Hooks.useNotificationCount({
    tenantId: CitizenHomePageTenantId,
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  const updateSidebar = () => {
    if (!Digit.clikOusideFired) {
      toggleSidebar(true);
    } else {
      Digit.clikOusideFired = false;
    }
  };

  function onNotificationIconClick() {
    history.push(`/${window?.contextPath}/citizen/engagement/notifications`);
  }

  const urlsToDisableNotificationIcon = (pathname) =>
    !!Digit.UserService?.getUser()?.access_token
      ? false
      : [`/${window?.contextPath}/citizen/select-language`, `/${window?.contextPath}/citizen/select-location`].includes(pathname);

  if (CITIZEN) {
    return (
      <div>
        <TopBarComponent
          img={stateInfo?.logoUrlWhite}
          isMobile={true}
          toggleSidebar={updateSidebar}
          logoUrl={stateInfo?.logoUrlWhite}
          onLogout={handleLogout}
          userDetails={userDetails}
          notificationCount={unreadNotificationCount < 99 ? unreadNotificationCount : 99}
          notificationCountLoaded={notificationCountLoaded}
          cityOfCitizenShownBesideLogo={t(CitizenHomePageTenantId)}
          onNotificationIconClick={onNotificationIconClick}
          hideNotificationIconOnSomeUrlsWhenNotLoggedIn={urlsToDisableNotificationIcon(pathname)}
          changeLanguage={!mobileView ? <ChangeLanguage dropdown={true} /> : null}
        />
      </div>
    );
  }
  const loggedin = userDetails?.access_token ? true : false;

  //checking for custom topbar components
  const CustomEmployeeTopBar = Digit.ComponentRegistryService?.getComponent("CustomEmployeeTopBar");

  if (CustomEmployeeTopBar) {
    return (
      <CustomEmployeeTopBar
        {...{
          t,
          stateInfo,
          toggleSidebar,
          isSidebarOpen,
          handleLogout,
          userDetails,
          CITIZEN,
          cityDetails,
          mobileView,
          userOptions,
          handleUserDropdownSelection,
          logoUrl,
          showLanguageChange,
          loggedin,
        }}
      />
    );
  }
  return (
    <TopBarComponentMain
      actionFields={[
        <ChangeCity dropdown={true} t={t} />,
        showLanguageChange && <ChangeLanguage dropdown={true} />,
        userDetails?.access_token && (
          <Dropdown
            option={userOptions}
            optionKey="name"
            profilePic={profilePic ? profilePic : userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Employee"}
            select={handleUserDropdownSelection}
            showArrow={true}
            menuStyles={{ marginTop: "1rem" }}
            theme="light"
          />
        ),
      ]}
      onHamburgerClick={() => {
        toggleSidebar();
      }}
      className="digit-employee-header"
      img={logoUrl}
      logoWidth={"64px"}
      logoHeight={"48px"}
      logo={(loggedin ? cityDetails?.logoId : stateInfo?.statelogo)||DEFAULT_EGOV_LOGO}
      onImageClick={() => {}}
      onLogoClick={() => {}}
      props={{}}
      showDeafultImg
      style={{}}
      theme="light"
      ulb={
        loggedin ? (
          cityDetails?.city?.ulbGrade ? (
            <>
              {t(cityDetails?.i18nKey).toUpperCase()}{" "}
              {t(`ULBGRADE_${cityDetails?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`).toUpperCase()}
            </>
          ) : (
            <ImageComponent className="state" src={logoUrlWhite} alt="State Logo" />
          )
        ) : (
          <>
            {t(`MYCITY_${stateInfo?.code?.toUpperCase()}_LABEL`)} {t(`MYCITY_STATECODE_LABEL`)}
          </>
        )
      }
    />
  );
};

export default TopBar;
