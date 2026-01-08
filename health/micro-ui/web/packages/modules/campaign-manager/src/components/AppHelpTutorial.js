import React, { useState, Fragment, useMemo } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { Button, Loader } from "@egovernments/digit-ui-components";
import { Close, TutorialGuide } from "@egovernments/digit-ui-svg-components";

const SampleHelpContent = [
  {
    url: "https://youtu.be/_yxD9Wjqkfw?feature=shared",
    icon: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/proximity.png",
    order: 0,
    pages: ["app-modules", "app-features", "app-configuration-redesign"],
    title: "CMN_CAMP_START_CONFIG_FORMS",
    iconBackground: "#F6F0E8",
  },
  {
    url: "https://youtu.be/_yxD9Wjqkfw?feature=shared",
    icon: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/mapView.png",
    order: 1,
    pages: ["app-modules", "app-features", "app-configuration-redesign"],
    title: "CMN_CAMP_HOW_TO_CONFIG_MAPVIEW",
    iconBackground: "#F6EBE8",
  },
  {
    url: "https://youtu.be/_yxD9Wjqkfw?feature=shared",
    icon: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/qrScanner.png",
    order: 2,
    pages: ["app-modules", "app-features", "app-configuration-redesign"],
    title: "CMN_CAMP_PREVIEW_APPLICATIONS",
    iconBackground: "#F1F6E8",
  },
  {
    url: "https://youtu.be/_yxD9Wjqkfw?feature=shared",
    icon: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/proximity.png",
    order: 3,
    pages: ["app-modules", "app-features", "app-configuration-redesign"],
    title: "CMN_CAMP_OFFLINE_QR_SCANNER",
    iconBackground: "#E8F4F6",
  },
  {
    url: "https://youtu.be/_yxD9Wjqkfw?feature=shared",
    icon: "https://egov-dev-assets.s3.ap-south-1.amazonaws.com/hcm/helpimages/qrScanner.png",
    order: 4,
    pages: ["app-modules", "app-features", "app-configuration-redesign"],
    title: "CMN_CAMP_OFFLINE_DATA_SHARING",
    iconBackground: "#F1F6E8",
  },
];

const checkCurrentScreenVisible = (config, pathVar) => {
  const listOfEnabledScreens = config?.flat();
  return listOfEnabledScreens?.includes(pathVar);
};
const AppHelpTutorial = ({ appPath, location, buttonLabel = "HELP", buttonIcon = "TutorialGuide" }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const module = appPath?.split?.("/")?.[appPath?.split("/")?.length - 1];

  const pathVar = location.pathname.replace(`${appPath}/`, "").split("?")?.[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      "commonUiConfig",
      [
        {
          name: "HelpTutorial",
          filter: `[?(@.module=='${module}')].helpContent.*.pages`,
        },
      ],
      `MDMSDATA-${module}-HelpTutorial`,
      {
        enabled: !!module,
        ...Digit.Utils.campaign.getMDMSV1Selector("commonUiConfig", "HelpTutorial"),
      }
    );
  }, [module]);

  const { isLoading: isSelectedFeatureLoading, data: selectedFeatureConfigs } = Digit.Hooks.useCustomAPIHook(selectedFeatureCriteria);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
    }, 300); // match animation duration
  };

  return (
    <>
      {checkCurrentScreenVisible(selectedFeatureConfigs, pathVar) && (
        <Button
          className={`width-auto camp-help-button-${pathVar}`}
          icon={buttonIcon}
          label={t(buttonLabel)}
          onClick={(e) => {
            e.stopPropagation();
            setClosing(false); // reset closing state
            setVisible(true); // immediately show popup
          }}
          title="Help"
          variation="secondary"
          size={"medium"}
          style={{marginLeft: "auto" }}
        />
      )}

      {visible && (
        <AppHelpDrawer
          closing={closing}
          handleClose={handleClose}
          module={module}
          pathVar={pathVar}
          SampleHelpContent={SampleHelpContent}
        />
      )}
    </>
  );
};
//TODO @bhavya @jagan move this component to ui-component repo
const AppHelpDrawer = ({ closing, handleClose, module, pathVar }) => {
  const { t } = useTranslation();

  return ReactDOM.createPortal(
    <div className={`tutorial-overlay ${closing ? "fade-out" : "fade-in"}`} onClick={handleClose}>
      <div
        className={`tutorial-drawer ${closing ? "slide-out" : "slide-in"}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside drawer
      >
        <div className="tutorial-header">
          <span style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            <TutorialGuide />
            {t("EXPLORE_TUTORIALS")}
          </span>
          <Close className="tutorial-close" height="32" width="32" fill="#0B0C0C" onClick={handleClose} />
        </div>
        <div className="tutorial-row">
          <AppHelpContent module={module} pathVar={pathVar} />
        </div>
      </div>
    </div>,
    document.body
  );
};

// export default AppHelpTutorial;

export const AppHelpCard = ({ helpContent = {}, index }) => {
  const { t } = useTranslation();
  return (
    <div
      key={index}
      className="tutorial-card"
      onClick={() => window.open(helpContent?.url, "_blank")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(helpContent?.url, "_blank");
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open tutorial: ${t(helpContent?.title)}`}
    >
      <div
        className="tutorial-card-image"
        style={{
          display: "flex",
          ...(helpContent?.iconBackground ? { backgroundColor: helpContent.iconBackground } : {}),
        }}
      >
        {helpContent?.icon && <img src={helpContent.icon} alt={t(helpContent.title)} />}
      </div>
      <div className="tutorial-card-content">
        <div className="tutorial-card-title">{t(helpContent.title)}</div>
        {helpContent?.subtitle && <div className="tutorial-card-subtext">{t(helpContent.subtitle)}</div>}
        {helpContent?.cta && (
          <div className="tutorial-card-link">
            {t(helpContent.cta)} <span className="arrow">→</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const AppHelpContent = ({ helpContentList = [], module, pathVar }) => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      "commonUiConfig",
      [
        {
          name: "HelpTutorial",
          filter: `[?(@.module=='${module}')].helpContent`,
        },
      ],
      `MDMSDATA-${module}-HelpTutorial-data`,
      {
        enabled: !!module,
        ...Digit.Utils.campaign.getMDMSV1Selector("commonUiConfig", "HelpTutorial"),
      }
    );
  }, [module]);

  const { isLoading: isSelectedFeatureLoading, data: selectedFeatureConfigs } = Digit.Hooks.useCustomAPIHook(selectedFeatureCriteria);

  const helpContents =
    selectedFeatureConfigs?.[0]?.filter((ele) => ele?.pages?.includes(pathVar))?.sort((x, y) => x?.order - y?.order) || helpContentList;
  if (isSelectedFeatureLoading) return <Loader />;

  return (
    <div className="tutorial-wrapper">
      <div className="tutorial-row">
        <div className="tutorial-wrapper">
          <div className="tutorial-row">
            {isSelectedFeatureLoading && <Loader></Loader>}
            {helpContents.map((item, index) => (
              <AppHelpCard key={`help-card-${index}`} helpContent={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHelpTutorial;
