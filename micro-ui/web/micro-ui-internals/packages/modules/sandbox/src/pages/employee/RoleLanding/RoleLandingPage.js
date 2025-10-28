import React from "react";
import { Card, CardText, CardHeader, Button, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { externalConfig } from "./RoleLandingConfig";
import YoutubeVideo from "../Landing/YoutubeVideo";

const RoleLandingComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleButtonClick = (action) => {
    const url = '/' + window.contextPath + action;
    window.open(url, "_blank");
  };

  return (
    <div className="role-landing-container">
      <Card className="role-landing-card">
        {externalConfig
          .filter((config) => config.type === "link")
          .map((config, index) => (
            <div key={index} className="header-video-section">
              <HeaderComponent className="role-header">{t("ROLE_BASED_LANDING_HEADER")}</HeaderComponent>
              <YoutubeVideo link={config.url} overlay={true} className="role-video" />
            </div>
          ))}

        {externalConfig
          .filter((config) => config.type === "text")
          .map((config, index) => (
            <div key={index} className="config-section">
              <CardHeader className="role-section-header">{t(config.heading)}</CardHeader>
              {config.paragraphs.map((paragraph, pIndex) => (
                <CardText className="role-paragraph" key={pIndex}>
                  {t(paragraph)}
                </CardText>
              ))}
              {/* Adding bullets to steps */}
              <ul className="role-list">
                {config.steps.map((stepObj, sIndex) => (
                  <li key={sIndex} className="role-list-item">
                    {t(stepObj.description)} {/* Display step description with a bullet */}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        <div className="role-action-container">
          {externalConfig
            .filter((config) => config.type === "card")
            .map((config, index) => {
              const IconComponent = config.icon;
              return (
                <div key={index} className="role-card">
                  <div className="icon-container">
                    {IconComponent && <IconComponent />} {/* Icon inside the container */}
                  </div>
                  <CardHeader className="role-section-header">{t(config.heading)}</CardHeader>
                  <Button
                    className="role-button"
                    label={t(config.buttonName)}
                    variation={"primary"}
                    onClick={() => handleButtonClick(config.action)}
                  />
                  <CardText className="role-paragraph">{t(config.description)}</CardText>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default RoleLandingComponent;
