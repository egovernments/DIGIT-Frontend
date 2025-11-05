import React, { useState } from "react";
import { Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = (path) => {
    history.push(path);
  };

  // Card container styles with hover state - ensure consistent sizing regardless of section
  const cardStyle = {
    display: "grid",
    gridTemplateRows: "auto auto auto",
    gap: "0.1rem",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: isHovered 
      ? "0px 4px 8px rgba(38, 38, 38, 0.2)" 
      : "0px 2px 7px 0px #00000026",
    background: isHovered ? "#f8fafb" : "#fff",
    height: "fit-content",
    minHeight: "220px",
    width: "100%",
    minWidth: "250px",
    // Remove maxWidth constraint - let grid handle sizing consistently
    position: "relative",
    top: isHovered ? "-4px" : "0px",
    transition: "all 0.2s ease-out",
    border: isHovered ? "1px solid #0b4b66" : "1px solid transparent",
    cursor: "pointer",
  };

  // Card header section styles
  const headerSectionStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.3rem", // Further reduced spacing between icon and title
    minHeight: "auto",
    height: "auto",
    maxHeight: "none",
  };

  // Icon wrapper styles
  const iconWrapperStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "0px", // Removed top margin
  };

  // Card title styles with hover state
  const titleStyle = {
    fontSize: "18px", // Increased font size
    fontWeight: "600",
    color: isHovered ? "#0b4b66" : "#0b4b66",
    lineHeight: "1.2", // Reduced line height to decrease heading height
    margin: "0",
    paddingTop: "0",
    paddingBottom: "0",
    marginBottom: "0",
    display: "-webkit-box",
    WebkitLineClamp: 2, // Reduced from 3 to 2 lines to decrease height
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    hyphens: "auto",
    flex: 1,
    transition: "color 0.2s ease-out",
  };

  // Description section styles
  const descriptionSectionStyle = {
    display: "flex",
    alignItems: "center", // Vertically center
    justifyContent: "flex-start", // Left align
    minHeight: "auto",
    marginBottom: "0",
    paddingBottom: "0",
  };

  // Description text styles with hover state
  const descriptionStyle = {
    fontSize: "14px",
    color: isHovered ? "#333" : "#555",
    lineHeight: "1.2", // Further reduced line height
    margin: "0",
    marginBottom: "0", // Remove excess space below description
    paddingTop: "0",
    paddingBottom: "0",
    textAlign: "left", // Left align text
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    transition: "color 0.2s ease-out",
  };

  // Button section styles
  const buttonSectionStyle = {
    display: "flex",
    alignItems: "flex-end",
    marginTop: "0",
    marginBottom: "0",
    paddingTop: "0",
    paddingBottom: "0",
  };

  // Explore button styles
  const exploreButtonStyle = {
    width: "auto",
    alignSelf: "flex-start",
    padding: "0.3rem 0.8rem 0.3rem 0", // Reduced padding
    margin: "0",
    border: "1px solid transparent",
    background: "transparent",
    color: "#c84c0e",
    fontWeight: "500",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: "6px",
    transition: "none",
  };

  return (
    <div
      className="new-product-card"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>
        handleNavigate(
          `/${window?.contextPath}/employee/sandbox/productDetailsPage/${product?.module}`
        )
      }
    >
      {/* Row 1: Icon + Heading */}
      <div className="card-header-section" style={headerSectionStyle}>
        <div className="card-icon-wrapper" style={iconWrapperStyle}>
          {Digit.Utils.iconRender(product.icon, "#c84c0e", "32", "32")}
        </div>
        <h3 className="card-title" title={t(product.heading)} style={titleStyle}>
          {t(product.heading)}
        </h3>
      </div>

      {/* Row 2: Description */}
      <div className="card-description-section" style={descriptionSectionStyle}>
        <p
          className="card-description"
          title={t(product?.cardDescription)}
          style={descriptionStyle}
        >
          {t(product?.cardDescription)}
        </p>
      </div>

      {/* Row 3: Explore Button */}
      <div className="card-button-section" style={buttonSectionStyle}>
        <Button
          className="card-explore-button"
          size="medium"
          variation="secondary"
          label={`${t("COMMON_EXPLORE")} ➔`}
          onClick={() =>
            handleNavigate(
              `/${window?.contextPath}/employee/sandbox/productDetailsPage/${product?.module}`
            )
          }
          style={exploreButtonStyle}
        />
      </div>
    </div>
  );
};

export default ProductCard;