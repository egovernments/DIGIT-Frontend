import React from "react";
import { Header, Card, CardText, CardHeader, Button } from "@egovernments/digit-ui-components"; // Importing the required DIGIT UI components
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import YoutubeVideo from "./YoutubeVideo";

const LandingComponent = ({ config }) => {
  const { t } = useTranslation(); // To handle translations (if needed)
  const { heading, subsections, url } = config;
  let redirectPathOtpLogin = `/${window?.contextPath}/employee`;
  const history = useHistory();

  return (
    <Card>
      {/* Main Heading */}
      <Header className="headerFlex" styles={{ fontWeight: "700", fontSize: "32px", marginBottom: "20px" }}>
        {t(heading)}
      </Header>

      <YoutubeVideo link={url} overlay={true} />

      {/* Subsections */}
      {subsections.map((section, index) => (
        <div key={index}>
          {/* Subsection Title */}
          <CardHeader styles={{ marginBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>{t(section.title)}</CardHeader>

          {/* Section Content */}
          {section.type === "paragraph" &&
            section.content.map((paragraph, paraIndex) => (
              <CardText key={paraIndex}>
                <p style={{ lineHeight: "1.6" }}>{t(paragraph.text)}</p>
              </CardText>
            ))}

          {/* Numbered Steps based on the `id` field */}
          {section.type === "steps" && (
            <ul style={{ paddingLeft: "0px" }}>
              {section.content.map((step, stepIndex) => (
                <CardText key={step.id}>
                  <li style={{ listStyleType: "none" }}>
                    {step.id}. {t(step.text)}
                  </li>
                </CardText>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Continue Button */}
      <div className="setupMasterSetupActionBar" style={{ textAlign: "right", marginTop: "2rem" }}>
        <Button
          className="actionButton"
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
  );
};

export default LandingComponent;
