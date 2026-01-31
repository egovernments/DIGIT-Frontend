

import { Button, LandingPageCard,  } from "@egovernments/digit-ui-components";
import React, { Fragment } from "react";
import { ArrowRightInbox } from "./svgindex";
import { useHistory, useLocation, Link } from "react-router-dom";


/**
 * EmployeeModuleCard - A New reusable card component to display module information with KPIs, links, and actions.
 *
 * @param {Object} props - Component props
 * @param {React.Element|string} Icon - Icon to display, can be a React component or a string identifier
 * @param {string} moduleName - Name of the module
 * @param {Array} kpis - Array of KPI objects to display metrics
 * @param {Array} links - Array of link objects for navigation
 * @param {string} className - Additional CSS class for the card
 * @param {Array} otherLinks - Array of additional links rendered as buttons
 * @param {string} buttonSize - Size of the buttons in otherLinks, defaults to "medium"
 */
const EmployeeModuleCard = ({
  Icon,
  moduleName,
  kpis = [],
  links = [],
  className,
  otherLinks = [],
  buttonSize = "medium",
}) => {
  // Hook for navigation
  const history = useHistory();

  /**
   * Handles navigation when a link is clicked.
   * Uses React Router's history for internal navigation and window.location for external links.
   * @param {string} link - The link to navigate to
   */
  const handleLinkClick = (link) => {
    link?.includes(`${window?.contextPath}/`)
      ? history?.push(link) // Internal navigation
      : (window.location.href = link); // External navigation
  };

  // Configuration object for the LandingPageCard component
  const propsForModuleCard = {
    // Determines the icon to display. Defaults to "FactIcon" if not a string.
    icon: typeof Icon === "string" ? Icon : "FactIcon",

    // Module name to display
    moduleName: moduleName,

    // KPIs to display on the card
    metrics: kpis,

    // Maps links to include a default icon ("ArrowForward")
    links: links?.map((linkObject) => ({ icon: "ArrowForward", ...linkObject })),

    // Renders additional links as buttons in the center of the card
    centreChildren: otherLinks?.filter(linkObj=>linkObj&&linkObj?.placement=="top")?.map((linkObj) => (
      <Button
        variation="tertiary"
        label={linkObj?.label}
        icon={linkObj?.icon}
        type="button"
        size={buttonSize}
        onClick={() => handleLinkClick(linkObj?.link)}
        style={{ padding: "0px" }}
      />
    )),

    // Renders additional links as buttons at the end of the card
    endChildren: otherLinks?.filter(linkObj=>linkObj&&linkObj?.placement=="bottom")?.map((linkObj) => (
      <Button
        variation="tertiary"
        label={linkObj?.label}
        icon={linkObj?.icon}
        type="button"
        size={buttonSize}
        onClick={() => handleLinkClick(linkObj?.link)}
        style={{ padding: "0px" }}
      />
    )),
  };

  // Render the card with the generated configuration
  return <LandingPageCard className={className} buttonSize={buttonSize} {...propsForModuleCard} />;
};



const ModuleCardFullWidth = ({ moduleName,  links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
  return (
    <div className={className ? className : "employeeCard card-home customEmployeeCard home-action-cards"} style={styles ? styles : {}}>
      <div className="complaint-links-container" style={{ padding: "10px" }}>
        <div className="header" style={isCitizen ? { padding: "0px" } : headerStyle}>
          <span className="text removeHeight">{moduleName}</span>
          <span className="link">
            <a href={subHeaderLink}>
              <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#F47738", fontWeight: "bold" }} onClick={()=>history.push(`${link}`)}>
                {subHeader || "-"}
                <span style={{ marginLeft: "10px" }}>
                  {" "}
                  <ArrowRightInbox />
                </span>
              </span>
            </a>
          </span>
        </div>
        <div className="body" style={{ margin: "0px", padding: "0px" }}>
          <div className="links-wrapper" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
            {links.map(({ count, label, link }, index) => (
              <span className="link full-employee-card-link" key={index}>
                {link ? (link?.includes(`${window?.contextPath}/`)?<Link to={link}>{label}</Link>:<a href={link}>{label}</a>) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export { EmployeeModuleCard, ModuleCardFullWidth };
