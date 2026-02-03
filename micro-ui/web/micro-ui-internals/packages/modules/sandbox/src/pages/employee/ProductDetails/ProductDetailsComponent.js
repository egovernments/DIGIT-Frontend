import React, { Fragment } from "react";
import { HeaderComponent, Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import {  useLocation } from "react-router-dom";
import { CustomSVG } from "@egovernments/digit-ui-components";
const Components = require("@egovernments/digit-ui-svg-components");

const renderContentItem = (item, itemIndex, module, t) => {
  switch (item.type) {
    case "paragraph":
      return (
        <CardText className="custom-section-paragraph" key={itemIndex}>
          <p>{t(item.text)}</p>
        </CardText>
      );
    case "step-heading":
      return (
        <CardText key={itemIndex} className="custom-step-header">
          {t(item.text)}
        </CardText>
      );
    case "step":
      return (
        <li key={itemIndex} className="custom-step-item">
          {t(item.text)}
        </li>
      );
    case "image":
      return (
        <div key={itemIndex} className="custom-image-container">
          <img src={item.text} alt={`${module}Image`} className="custom-image" />
        </div>
      );
    default:
      return null;
  }
};


const ProductDetailsComponent = ({config,module}) => {
  const { t } = useTranslation();

  const moduleConfig = config?.find((item) => item.module === module) || {};
  const IconComponent = moduleConfig.icon ? Digit.Utils.iconRender({iconName: moduleConfig.icon, iconFill: "#c84c0e",CustomSVG,Components}): null;

  const handleButtonClick = (action) => {
    const url = '/' + window.contextPath + action + "?from=sandbox";
    window.open(url, "_blank");
  };

  return (
    <div className="custom-landing-container">
      <Card className="custom-landing-card">
        <div className="icon-header-container">
        <div className="product-icon">
            {IconComponent}
        </div>
          <HeaderComponent className="custom-landing-header"
          >
            {t(moduleConfig.heading)}
          </HeaderComponent>
        </div>
        {moduleConfig?.subsections
          ?.map((section, index) => (
            <div key={index} className="custom-section-container">
              <CardHeader className="custom-section-header">{t(section.title)}</CardHeader>
              {section.type === "paragraph" && section.content?.map((paragraph, paraIndex) => (
                <CardText className="custom-section-paragraph" key={paraIndex}>
                  <p>{t(paragraph.text)}</p>
                </CardText>
              ))}
              {section.type === "steps" && section.content && (
                <ul className="custom-steps-list">
                  {section.content.map((step, stepIndex) => (
                    <li key={stepIndex} className="custom-step-item">
                      {t(step.text)}
                    </li>
                  ))}
                </ul>
              )}
              {section.type === "both" && section.content && (
                <Fragment>
                {section.content.map((item, itemIndex) => 
                  renderContentItem(item, itemIndex, module, t)
                )}
              </Fragment>
              )}
            </div>
          ))}

        <div className="role-action-container">
          {moduleConfig?.cards
            ?.map((config, index) => {
              const CardIconComponent = config?.icon ? Digit.Utils.iconRender({iconName: config.icon, iconFill: "#c84c0e",CustomSVG,Components}) : null;
              return (
                <div key={index} className="role-card">
                  <div className="icon-container">
                  {CardIconComponent && CardIconComponent}
                  </div>
                  <CardHeader className="role-section-header">{t(config.title)}</CardHeader>
                  <Button
                    className="role-button"
                    label={t(config.buttonName)}
                    variation={"primary"}
                    onClick={() => {
                      try {
                        if (config.isExternal) {
                          window.open(config?.action, "_blank");
                        } else {
                          handleButtonClick(config?.action);
                        }
                      } catch (error) {
                        console.error("Error navigating to URL:", error);
                      }
                    }}                  />
                  <CardText className="role-paragraph">{t(config.description)}</CardText>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailsComponent;

