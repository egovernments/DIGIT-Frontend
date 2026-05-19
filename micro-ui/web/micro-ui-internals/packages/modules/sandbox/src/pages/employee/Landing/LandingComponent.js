import React, { Fragment } from "react";
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
import SupaDemoPlayer from "./SupaDemoPlayer";
import { sandboxConfig } from "./SandboxConfig";

/**
 * LandingComponent
 * @param {Object} config - Optional prop to override default config
 */
const LandingComponent = ({ config = {} }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveMargin = () => {
    if (windowWidth <= 480) return "0.5rem";
    if (windowWidth <= 768) return "1rem";
    if (windowWidth <= 1024) return "1.5rem";
    if (windowWidth <= 1280) return "2rem";
    if (windowWidth <= 1440) return "2.5rem";
    if (windowWidth <= 1920) return "3rem";
    return "3.5rem"; // For ultra-wide displays
  };




  // Destructure key config fields with fallback defaults from sandboxConfig
  const {
    heading = sandboxConfig.heading,
    url = sandboxConfig.url,
    subsections = sandboxConfig.subsections,
  } = config;

  // Define the redirect path for button click - will upate after the product page is ready
  const redirectPathOtpLogin = `/${window?.contextPath}/employee/sandbox/productPage`;

  const introSection = subsections.find(s => s.type === "introSection") || {};
  const stepsSection = subsections.find(s => s.type === "stepsSection") || {};
  const buttonSection = subsections.find(s => s.type === "ButtonWrapper") || {};

  const handleContinue = (e) => {
    e.preventDefault();
    history.push(redirectPathOtpLogin);
  };

  const brandName = t(buttonSection?.subtitle);


  return (
    <div className="" style={{ "padding": "0px" }}>
      <Card className="">

        {/* ---------- TOP SECTION ---------- */}
        <div className="custom-landing-top flexSpaceAround">

          {/* Left section: Heading and intro paragraph */}
          <div className="left-section">
            <div className="custom-landing-header-container" style={{
              marginTop: windowWidth <= 768 ? "1rem" : "2rem"
            }}>
              <HeaderComponent className="custom-landing-header">
                {t(heading)}
              </HeaderComponent>
              <HeaderComponent className="custom-landing-sub-header">
                {t(introSection.title)}
              </HeaderComponent>
            </div>

            <BreakLine style={{ borderColor: "#c84c0e" }} />

            {/* Intro paragraph text */}
            {introSection?.content?.[0]?.text && (
              <CardText className="custom-section-paragraph">
                <p>{t(introSection.content[0].text)}</p>
              </CardText>
            )}
          </div>

          {/* Right section: Video display */}
          <div className="custom-video-section" style={{ minHeight: "400px", height: "400px", maxWidth: "500px", width: "100%" }}>
            <SupaDemoPlayer src={config.url ? config.url : sandboxConfig.url} overlay={true} title="Sandbox Demo" />
            {/* <YoutubeVideo link={url} overlay={true} /> */}
          </div>
        </div>

        {/* ---------- MIDDLE SECTION ---------- */}
        <div className="custom-landing-middle middle-section">

          {/* Left Column - Heading with underline */}
          <div className="middle-left-column">
            <div className="custom-landing-header-grey middle-center-text">
              <div>{t(stepsSection.title)}</div>
              <div style={{ color: "#C84C0E", fontFamily: 'Roboto Condensed', fontWeight: 700, fontSize: '40px', display: 'block' }}>{brandName}?</div>
            </div>
          </div>

          {/* Right Column - Steps list */}
          <div className="middle-right-column">
            <ul className="custom-steps-list">
              {stepsSection?.content?.map((item, index) => (
                <div key={index} className="step-item-container">
                  <p className="step-item">{t(item?.text)}</p>
                  <BreakLine style={{ maxWidth: "100%", borderColor: "#D6D5D4", marginLeft: "0px", marginRight: "3rem" }} />
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- BOTTOM SECTION ---------- */}
        <div className="bottom-section">

          {/* Bottom header with title and subtitle */}
          <HeaderComponent className="custom-landing-header-button">
            <div style={{ lineHeight: "1.2" }}>
              <span className="header-span">{t(buttonSection?.title)}</span>
              <br />
              {brandName}
            </div>
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