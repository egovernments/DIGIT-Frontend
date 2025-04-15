import React from "react";
import {
  HeaderComponent,
  Card,
  CardText,
  Button,
  BreakLine,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import YoutubeVideo from "./YoutubeVideo";

/**
 * LandingComponent
 * @param {Object} config - Optional prop to override default config
 */
const LandingComponent = ({ config ={}}) => {
  const { t } = useTranslation(); 
  const history = useHistory();  



  // Destructure key config fields with fallback defaults
  const {
    heading = "Sandbox",
    url = "https://www.youtube.com/watch?v=0wcuD67MVt8",
    subsections = [],
  } = config;

  // Define the redirect path for button click - will upate after the product page is ready
  const redirectPathOtpLogin = `/${window?.contextPath}/employee/user/productPage`;

   const introSection = subsections.find(s => s.type === "introSection") || {};
   const stepsSection = subsections.find(s => s.type === "stepsSection") || {}; 
   const buttonSection = subsections.find(s => s.type === "ButtonWrapper") || {};

  const handleContinue = (e) => {
    e.preventDefault();
    history.push(redirectPathOtpLogin);
  };

  return (
    <div className="custom-landing-container">
      <Card className="custom-landing-card">

        {/* ---------- TOP SECTION ---------- */}
        <div className="custom-landing-top flexSpaceAround">

          {/* Left section: Heading and intro paragraph */}
          <div className="left-section">
            <HeaderComponent className="custom-landing-header">
              {t(heading)}
            </HeaderComponent>
            <HeaderComponent className="custom-landing-sub-header">
              {t(introSection.title)}
            </HeaderComponent>

            <BreakLine style={{"border-color":"#c84c0e"}} />

            {/* Intro paragraph text */}
            {introSection?.content?.[0]?.text && (
              <CardText className="custom-section-paragraph">
                <p>{t(introSection.content[0].text)}</p>
              </CardText>
            )}
          </div>

          {/* Right section: Video display */}
          <div className="custom-video-section">
            <YoutubeVideo link={url} overlay={true} />
          </div>
        </div>

        {/* ---------- MIDDLE SECTION ---------- */}
        <div className="custom-landing-middle middle-section">

          <div className="middle-header">
            <HeaderComponent className="custom-landing-header-grey">
              {t(stepsSection.title)}
            </HeaderComponent>
          </div>

          {/* Steps list */}
          <ul className="custom-steps-list steps-list">
            {stepsSection?.content?.map((item, index) => (
              <div key={index}>
                <p className="step-item">{t(item?.text)}</p>
                
                {index !== stepsSection?.content?.length - 1 && (
                  <BreakLine style={{maxWidth:"80%",borderColor:"#B6B5B4",marginLeft:"0px"}}/>
                )}
              </div>
            ))}
          </ul>
        </div>

        {/* ---------- BOTTOM SECTION ---------- */}
        <div className="bottom-section">

          {/* Bottom header with title and subtitle */}
          <HeaderComponent className="custom-landing-header-button">
            <span className="header-span">{t(buttonSection?.title)}</span>{" "}
            {t(buttonSection?.subtitle)}
          </HeaderComponent>

          {/* Continue button */}
          <div className="custom-continue-button-container">
            <Button
              className="custom-continue-button"
              label={t("CONTINUE_LANDING")}  
              variation="primary"             
              icon="ArrowForward"             
              isSuffix
              onClick={handleContinue}        
            />
          </div>
        </div>

      </Card>
    </div>
  );
};

export default LandingComponent;
