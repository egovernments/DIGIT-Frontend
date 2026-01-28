import {
  Calender,
  CardBasedOptions,
  CaseIcon,
  ComplaintIcon,
  DocumentIcon,
  HomeIcon,
  OBPSIcon,
  PTIcon,
  Loader,
  WhatsNewCard,
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ImageComponent from "../../../components/ImageComponent";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() : Digit.ULBService.getCitizenCurrentTenant(true);
  const { data: { stateInfo, uiHomePage } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  let isMobile = window.Digit.Utils.browser.isMobile();

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (!Digit.UserService?.getUser()?.access_token) return false;
    return true;
  };

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
    tenantId,
    variant: "whats-new",
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  if (!tenantId) {
    navigate(`/${window?.contextPath}/citizen/select-language`);
  }

  const appBannerWebObj = uiHomePage?.appBannerDesktop;
  const appBannerMobObj = uiHomePage?.appBannerMobile;
  const citizenServicesObj = uiHomePage?.citizenServicesCard;
  const infoAndUpdatesObj = uiHomePage?.informationAndUpdatesCard;
  const whatsAppBannerWebObj = uiHomePage?.whatsAppBannerDesktop;
  const whatsAppBannerMobObj = uiHomePage?.whatsAppBannerMobile;
  const whatsNewSectionObj = uiHomePage?.whatsNewSection;
  const redirectURL = uiHomePage?.redirectURL;
  /* configure redirect URL only if it is required to overide the default citizen home screen */
  if (redirectURL) {
    navigate(`/${window?.contextPath}/citizen/${redirectURL}`);
  }
  /* fix for sanitation ui & sandbox*/
  if (window?.location?.href?.includes?.("sanitation-ui") || window?.location?.href?.includes?.("sandbox-ui")) {
    navigate(`/${window?.contextPath}/citizen/all-services`);
  }

  const handleClickOnWhatsAppBanner = (obj) => {
    window.open(obj?.navigationUrl);
  };

  const allCitizenServicesProps = {
    header: t(citizenServicesObj?.headerLabel),
    sideOption: {
      name: t(citizenServicesObj?.sideOption?.name),
      onClick: () =>
        navigate(citizenServicesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(citizenServicesObj?.props?.[0]?.label),
        Icon: <ComplaintIcon />,
        onClick: () =>
          navigate(citizenServicesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[1]?.label),
        Icon: <PTIcon className="fill-path-primary-main" />,
        onClick: () =>
          navigate(citizenServicesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[2]?.label),
        Icon: <CaseIcon className="fill-path-primary-main" />,
        onClick: () =>
          navigate(citizenServicesObj?.props?.[2]?.navigationUrl),
      },
      // {
      //     name: t("ACTION_TEST_WATER_AND_SEWERAGE"),
      //     Icon: <DropIcon/>,
      //     onClick: () => history.push(`/${window?.contextPath}/citizen`)
      // },
      {
        name: t(citizenServicesObj?.props?.[3]?.label),
        Icon: <OBPSIcon />,
        onClick: () =>
          navigate(citizenServicesObj?.props?.[3]?.navigationUrl),
      },
    ],
    styles: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      width: "100%",
    },
  };
  const allInfoAndUpdatesProps = {
    header: t(infoAndUpdatesObj?.headerLabel),
    sideOption: {
      name: t(infoAndUpdatesObj?.sideOption?.name),
      onClick: () => navigate(infoAndUpdatesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(infoAndUpdatesObj?.props?.[0]?.label),
        Icon: <HomeIcon />,
        onClick: () =>
          navigate(infoAndUpdatesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[1]?.label),
        Icon: <Calender />,
        onClick: () =>
          navigate(infoAndUpdatesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[2]?.label),
        Icon: <DocumentIcon />,
        onClick: () =>
          navigate(infoAndUpdatesObj?.props?.[2]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[3]?.label),
        Icon: <DocumentIcon />,
        onClick: () =>
          navigate(infoAndUpdatesObj?.props?.[3]?.navigationUrl),
      },
      // {
      //     name: t("CS_COMMON_HELP"),
      //     Icon: <HelpIcon/>
      // }
    ],
    styles: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      width: "100%",
    },
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="HomePageContainer">
      {/* <div className="SideBarStatic">
        <StaticCitizenSideBar />
      </div> */}
      <div className="HomePageWrapper">
        {
          <div className="BannerWithSearch">
            {isMobile ? (
              <ImageComponent src={appBannerMobObj?.bannerUrl} alt="Banner Image" />
            ) : (
              <ImageComponent src={appBannerWebObj?.bannerUrl} alt="Banner Image" />
            )}
            {/* <div className="Search">
            <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
          </div> */}
            <div className="ServicesSection">
              <CardBasedOptions style={{ marginTop: "-30px" }} {...allCitizenServicesProps} />
              <CardBasedOptions style={isMobile ? {} : { marginTop: "-30px" }} {...allInfoAndUpdatesProps} />
            </div>
          </div>
        }

        {(whatsAppBannerMobObj || whatsAppBannerWebObj) && (
          <div className="WhatsAppBanner">
            {isMobile ? (
              <ImageComponent
                src={whatsAppBannerMobObj?.bannerUrl}
                onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerMobObj)}
                alt="Whatsapp Banner"
              />
            ) : (
              <ImageComponent
                src={whatsAppBannerWebObj?.bannerUrl}
                onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerWebObj)}
                alt="Whatsapp Banner"
              />
            )}
          </div>
        )}

        {conditionsToDisableNotificationCountTrigger() ? (
          EventsDataLoading ? (
            <Loader />
          ) : (
            <div className="WhatsNewSection">
              <div className="headSection">
                <h2>{t(whatsNewSectionObj?.headerLabel)}</h2>
                <p onClick={() => navigate(whatsNewSectionObj?.sideOption?.navigationUrl)}>{t(whatsNewSectionObj?.sideOption?.name)}</p>
              </div>
              <WhatsNewCard {...EventsData?.[0]} />
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Home;
