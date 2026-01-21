import { CustomSVG, Button } from "@egovernments/digit-ui-components";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

// Color palette for role cards - matching ServiceCard exactly
const cardColorPalette = [
  { header: "rgba(246, 240, 232, 1)", dateBg: "#FDF6F0", dateText: "#9E6D3F" }, // Peach/Cream
  { header: "rgba(232, 246, 233, 1)", dateBg: "#EBF5EB", dateText: "#3D7B3D" }, // Light Green
  { header: "rgba(235, 232, 246, 1)", dateBg: "#F3EBF8", dateText: "#6B4D7D" }, // Light Purple
  { header: "rgba(249, 243, 243, 1)", dateBg: "#EBF3F8", dateText: "#3D6B8A" }, // Light pink
];

// Role Icon SVG Component
const RoleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
      fill="#0B4B66"
    />
  </svg>
);

const RoleCard = ({ 
  roleName, 
  roleCode,
  description, 
  isNew = false, 
  onClick, 
  onEditClick,
  colorIndex = 0,
  access = {},
  isDefaultRole = false,
  selfRegistration = false,
  module,
  service
}) => {
  const { t } = useTranslation();
  const [showEditButton, setShowEditButton] = useState(false);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [showBodyTooltip, setShowBodyTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  // Get color scheme based on colorIndex
  const safeColorIndex = (colorIndex !== undefined && colorIndex >= 0) ? colorIndex : 0;
  const colorScheme = cardColorPalette[safeColorIndex % cardColorPalette.length];

  const handleMouseEnter = (ref, isHeader) => {
    if (ref.current) {
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const isOverflowing = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

      if (isOverflowing) {
        setTooltipPos({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2
        });
        if (isHeader) {
          setShowHeaderTooltip(true);
        } else {
          setShowBodyTooltip(true);
        }
      }
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEditClick) {
      onEditClick();
    }
  };

  // Format access permissions for display
  const getAccessBadges = () => {
    const badges = [];
    if (access.creater) badges.push("Create");
    if (access.editor) badges.push("Edit");
    if (access.viewer) badges.push("View");
    return badges;
  };

  // ============================================
  // RENDER: Create a New Role Card
  // ============================================
  if (isNew) {
    return (
      <div
        onClick={handleClick}
        style={{
          width: "303px",
          height: "247px",
          cursor: "pointer",
          gap: "16px",
          border: "2px dashed #C84C0E",
          borderRadius: "12px",
          backgroundColor: "#FFFAF7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#FFF0E5";
          e.currentTarget.style.borderColor = "#A33D0B";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFAF7";
          e.currentTarget.style.borderColor = "#C84C0E";
        }}
      >
        {/* Plus Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill="#C84C0E"/>
            <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="#C84C0E"/>
          </svg>
        </div>

        {/* Text */}
        <span
          style={{
            color: "#C84C0E",
            fontSize: "20px",
            fontWeight: 700,
            fontStyle: "bold",
            textAlign: "center",
            lineHeight: "1.3",
          }}
        >
          {t("CREATE_NEW_ROLE")}
        </span>
      </div>
    );
  }

  // ============================================
  // RENDER: Role Card
  // ============================================
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
      style={{
        width: "303px",
        height: "247px",
        padding: "16px",
        gap: "16px",
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Edit Button */}
      {showEditButton && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 10,
          }}
        >
          <Button
            style={{
              minWidth: "auto",
              height: "auto",
              padding: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #E0E0E0",
              borderRadius: "4px",
            }}
            onClick={handleEditClick}
            title={t("EDIT_ROLE")}
            label={
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" 
                  fill="#c84c0e"
                />
              </svg>
            }
          />
        </div>
      )}

      {/* Colored Header Section */}
      <div
        style={{
          backgroundColor: colorScheme.header,
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
        }}
      >
        {/* White Icon Container */}
        <div
          style={{
            width: "80px",
            height: "50px",
            backgroundColor: "#FFFFFF",
            borderRadius: "6px",
            border: "1px solid #E8E8E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RoleIcon />
        </div>
      </div>

      {/* Body Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1
        }}
      >
        {/* Title */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleMouseEnter(headerRef, true)}
          onMouseLeave={() => setShowHeaderTooltip(false)}
        >
          <h3
            ref={headerRef}
            style={{
              color: "rgba(11, 75, 102, 1)",
              fontSize: "16px",
              fontWeight: 700,
              fontStyle: "bold",
              margin: "0 0 8px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: "1.3",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {roleName || t("ROLE_NAME")}
            {isDefaultRole && (
              <span
                style={{
                  backgroundColor: "#E8F4F8",
                  color: "#0B4B66",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                {t("DEFAULT")}
              </span>
            )}
          </h3>
          {showHeaderTooltip && (
            <span
              style={{
                position: "fixed",
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`,
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                zIndex: 1000,
                whiteSpace: "nowrap",
              }}
            >
              {roleName}
            </span>
          )}
        </div>

        {/* Description */}
        <div
          style={{ position: "relative", flex: 1 }}
          onMouseEnter={() => handleMouseEnter(bodyRef, false)}
          onMouseLeave={() => setShowBodyTooltip(false)}
        >
          <p
            ref={bodyRef}
            style={{
              color: "rgba(120, 120, 120, 1)",
              fontSize: "14px",
              fontWeight: 400,
              margin: "0 0 12px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.4",
            }}
          >
            {description || t("ROLE_DESCRIPTION_PLACEHOLDER")}
          </p>
          {showBodyTooltip && (
            <span
              style={{
                position: "fixed",
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`,
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                zIndex: 1000,
                maxWidth: "200px",
                whiteSpace: "normal",
              }}
            >
              {description}
            </span>
          )}
        </div>

        {/* Access Badges */}
        {getAccessBadges().length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {getAccessBadges().map((badge, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "rgba(239, 248, 255, 1)",
                  color: "rgba(11, 75, 102, 1)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {badge}
              </span>
            ))}
            {selfRegistration && (
              <span
                style={{
                  backgroundColor: "#E8F5E9",
                  color: "#2E7D32",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {t("SELF_REG")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleCard;