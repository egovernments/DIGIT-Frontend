import { Hamburger, TopBar as TopBarComponent } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-components-core";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import ChangeCity from "../ChangeCity";
import ChangeLanguage from "../ChangeLanguage";

const TextToImg = (props) => (
  <span className="user-img-txt" onClick={props.toggleMenu} title={props.name}>
    {props?.name?.[0]?.toUpperCase()}
  </span>
);
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
  showLanguageChange = true,
}) => {
  const [profilePic, setProfilePic] = React.useState(null);

  React.useEffect(async () => {
    const tenant = Digit.ULBService.getCurrentTenantId();
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
  return (
    <div className="topbar">
      <div className="digit-hamburger-class">{<Hamburger  handleClick={toggleSidebar} color="#9E9E9E" />}</div>
      <img className="city" src={loggedin ? cityDetails?.logoId : stateInfo?.statelogo} />
      <span className="digit-topbar-container">
        {loggedin &&
          (cityDetails?.city?.ulbGrade ? (
            <p className="ulb">
              {t(cityDetails?.i18nKey).toUpperCase()}{" "}
              {t(`ULBGRADE_${cityDetails?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`).toUpperCase()}
            </p>
          ) : (
            <img className="state" src={logoUrl} />
          ))}
        {!loggedin && (
          <p className="ulb">
            {t(`MYCITY_${stateInfo?.code?.toUpperCase()}_LABEL`)} {t(`MYCITY_STATECODE_LABEL`)}
          </p>
        )}
        <div className={mobileView ? "right" : "flex-right right w-80 column-gap-15"} style={!loggedin ? { width: "80%" } : {}}>
          <div className="left">
            {!window.location.href.includes("employee/user/login") && !window.location.href.includes("employee/user/language-selection") && (
              <ChangeCity dropdown={true} t={t} />
            )}
          </div>
          <div className="left">{showLanguageChange && <ChangeLanguage dropdown={true} />}</div>
          {userDetails?.access_token && (
            <div className="left">
              <Dropdown
                option={userOptions}
                optionKey={"name"}
                select={handleUserDropdownSelection}
                showArrow={true}
                freeze={true}
                style={{}}
                optionCardStyles={{ overflow: "revert", display: "table" }}
                topbarOptionsClassName={"topbarOptionsClassName"}
                customSelector={
                  profilePic == null ? (
                    <TextToImg name={userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Employee"} />
                  ) : (
                    <img src={profilePic} style={{ height: "48px", width: "48px", borderRadius: "50%" }} />
                  )
                }
                showIcon={true}
              />
            </div>
          )}
          <img className="state" src={logoUrl} />
        </div>
      </span>
    </div>
  );
};

export default TopBar;
