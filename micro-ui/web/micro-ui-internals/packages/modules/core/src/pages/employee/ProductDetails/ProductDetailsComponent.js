import React, { Fragment } from "react";
import { HeaderComponent, Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const ProductDetailsComponent = ({ config }) => {
  const { t } = useTranslation();
  const { module } = useParams();
  const history = useHistory();

  const moduleConfig = config.find((item) => item.module === module) || {};
  const IconComponent = moduleConfig.icon ? Digit.Utils.iconRender(moduleConfig.icon,"#c84c0e"): null;

  const handleButtonClick = (action) => {
    const url = '/' + window.contextPath + action;
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
          .filter(ob => ob?.type !== "card")
          .map((section, index) => (
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
                  {section.content.map((item, itemIndex) => (
                    item.type === "paragraph" ? (
                      <CardText className="custom-section-paragraph" key={itemIndex}>
                        <p>{t(item.text)}</p>
                      </CardText>
                    ) 
                    : item.type === "step-heading" ? (
                      <CardText key={itemIndex} className="custom-step-header">
                        {t(item.text)}
                      </CardText>
                    ) : item.type === "step" ? (
                      <li key={itemIndex} className="custom-step-item">
                        {t(item.text)}
                      </li>
                    ) : item.type === "image" ? (
                      <div key={itemIndex} className="custom-image-container">
                        <img src={item.src} alt={item.alt} className="custom-image" />
                      </div>
                    ): null
                    ))}
                </Fragment>
              )}
            </div>
          ))}

        <div className="role-action-container">
          {moduleConfig?.subsections
            .filter((config) => config.type === "card")
            .map((config, index) => {
              const CardIconComponent = config?.icon ? Digit.Utils.iconRender(config.icon,"#c84c0e") : null;
              return (
                <div key={index} className="role-card">
                  <div className="icon-container">
                  {CardIconComponent && CardIconComponent}
                  </div>
                  <CardHeader className="role-section-header">{t(config.heading)}</CardHeader>
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

