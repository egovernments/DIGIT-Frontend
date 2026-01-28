import React , { useState, Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TutorialGuide , Close } from "@egovernments/digit-ui-svg-components";
import Loader from "./Loader";

export const AppHelpCard = ({ helpContent = {}, index }) => {
  const { t } = useTranslation();
  return (
    <div
      key={index}
      className="tutorial-card"
      onClick={() => window.open(helpContent?.url, "_blank")}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
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
          ...(helpContent?.iconBackground
            ? { backgroundColor: helpContent.iconBackground }
            : {}),
        }}
      >
        {helpContent?.icon && (
          <img src={helpContent.icon} alt={t(helpContent.title)} />
        )}
      </div>
      <div className="tutorial-card-content">
        <div className="tutorial-card-title">{t(helpContent.title)}</div>
        {helpContent?.subtitle && (
          <div className="tutorial-card-subtext">{t(helpContent.subtitle)}</div>
        )}
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
        <AppHelpCard
           key={`help-card-${index}`}
           helpContent={item}
            index={index}
          />
         ))}
       </div>
     </div>
      </div>
    </div>
  );
};



const AppHelpDrawer = ({ closing, handleClose, module, pathVar }) => {
  const { t } = useTranslation();

  return (
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
          <Close className="tutorial-close"  height="32" width="32" fill="#0B0C0C" onClick={handleClose}  />
        </div>
        <div className="tutorial-row">
          <AppHelpContent module={module} pathVar={pathVar} />
        </div>
      </div>
    </div>
  );
};

AppHelpDrawer.propTypes = {
  closing: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  module: PropTypes.string.isRequired,
  pathVar: PropTypes.string.isRequired,
};



export default AppHelpDrawer;