import React, { Fragment } from "react";
import { Header, Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components"; // Importing the required DIGIT UI components
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import YoutubeVideo from "./YoutubeVideo";

const LandingComponent = ({ config }) => {
  const { t } = useTranslation(); // To handle translations (if needed)
  const { heading, subsections, url } = config;
  let redirectPathOtpLogin = `/${window?.contextPath}/employee/user/landing/select-role`;
  const history = useHistory();

  return (
    <div className="custom-landing-container">
      <Card className="custom-landing-card">
        {/* Main Heading */}
        <Header className="custom-landing-header">
          {t(heading)}
        </Header>

        {/* Video Section */}
        <div className="custom-video-section">
          <YoutubeVideo link={url} overlay={true} />
        </div>

        {/* Subsections */}
        {subsections.map((section, index) => (
          <div key={index} className="custom-section-container">
            {/* Subsection Title */}
            <CardHeader className="custom-section-header">{t(section.title)}</CardHeader>

            {/* Render Content for "paragraph" type */}
            {section.type === "paragraph" && section.content && (
              <Fragment>
                {section.content.map((paragraph, paraIndex) => (
                  <CardText className="custom-section-paragraph" key={paraIndex}>
                    <p>{t(paragraph.text)}</p>
                  </CardText>
                ))}
              </Fragment>
            )}

            {/* Render Content for "steps" type */}
            {section.type === "steps" && section.content && (
              <ul className="custom-steps-list">  {/* Updated list with bullets */}
                {section.content.map((step, stepIndex) => (
                  <li key={stepIndex} className="custom-step-item">  {/* Only bullets, no step.id */}
                    {t(step.text)}
                  </li>
                ))}
              </ul>
            )}

            {/* Render Content for "both" type */}
            {section.type === "both" && section.content && (
              <Fragment>
                {section.content.map((item, itemIndex) => {
                  if (item.type === "paragraph") {
                    return (
                      <CardText className="custom-section-paragraph" key={itemIndex}>
                        <p>{t(item.text)}</p>
                      </CardText>
                    );
                  } else if (item.type === "step") {
                    return (
                      <li key={itemIndex} className="custom-step-item">  {/* Only bullets, no step.id */}
                        {t(item.text)}
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </Fragment>
            )}
          </div>
        ))}

        {/* Continue Button */}
        <div className="custom-continue-button-container">
          <Button
            className="custom-continue-button"
            label={t("CONTINUE_LANDING")}
            variation={"primary"}
            icon="ArrowForward"
            isSuffix={true}
            onClick={(e) => {
              e.preventDefault();
              history.push(redirectPathOtpLogin);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default LandingComponent;
