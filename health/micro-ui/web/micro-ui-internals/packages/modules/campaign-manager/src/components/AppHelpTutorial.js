import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopUp } from "@egovernments/digit-ui-components";

const AppHelpTutorial = ({ campaignName }) => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Button
        className="custom-class"
        icon="help"
        isSuffix={true}
        label={t("CAMP_HELP_TEXT")}
        onClick={() => setShowPopup(true)}
        title="Help"
        variation="link"
      />
      {showPopup && (
        <PopUp
          showIcon={true}
          heading={t("Explore our tutorials")}
          className={"camp-app-help-tutorial-popup"}
          onClose={() => setShowPopup(false)}
        >
          <AppHelpContent />
        </PopUp>
      )}
    </>
  );
};

const AppHelpContent = () => {
  const { t } = useTranslation();

  const tutorialList = [
    { title: "Start configuring forms", icon: "📱" },
    { title: "How to customise map view?", icon: "📍" },
    { title: "How to manage users?", icon: "👤" },
    { title: "Preview Applications...", icon: "📝" },
    { title: "Start configuring forms", icon: "📱" },
    { title: "How to customise map view?", icon: "📍" },
    { title: "How to manage users?", icon: "👤" },
    { title: "Preview Applications...", icon: "📝" },
  ];

  return (
    <div className="tutorial-wrapper">
    <div className="tutorial-row">
      {tutorialList.map((item, index) => (
        <div
          key={index}
          className="tutorial-card"
        >
          <div className="tutorial-icon">{item.icon}</div>
          <div className="tutorial-title">{t(item.title)}</div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default AppHelpTutorial;
