import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CustomSVG } from "@egovernments/digit-ui-components";

const RoleComp = ({ role, desc, isNew = false, onRoleClick, data, module, service }) => {
  const { t } = useTranslation();
  const [showRoleTooltip, setShowRoleTooltip] = useState(false);
  const [showDescTooltip, setShowDescTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const roleRef = useRef(null);
  const descRef = useRef(null);

  // Function to format role name: remove module_service prefix, underscores and convert to camel case
  const formatRoleName = (roleName) => {
    // Display STUDIO_CITIZEN as "Citizen"
    if (roleName === "STUDIO_CITIZEN") {
      return "Citizen";
    }

    let formattedRole = roleName;

    // Remove module_service prefix if module and service are provided
    if (module && service) {
      const prefix = `${module.toUpperCase()}_${service.toUpperCase()}_`;
      if (formattedRole.startsWith(prefix)) {
        formattedRole = formattedRole.substring(prefix.length);
      }
    }

    // Remove underscores, split into words, and convert to camel case
    return formattedRole
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const displayRoleName = formatRoleName(role);

  // Common tooltip styles
  const tooltipStyles = {
    position: "fixed",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    zIndex: 10000,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "300px",
    whiteSpace: "normal",
    wordWrap: "break-word",
    textAlign: "center",
    pointerEvents: "none"
  };

  const handleMouseEnter = (ref, isRole) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      });
      if (isRole) {
        setShowRoleTooltip(true);
      } else {
        setShowDescTooltip(true);
      }
    }
  };

  if (isNew) {
    return (
      <div className="state-card new" style={{ width: "225px", height:"220px", margin: "9px", border: "2px dashed #C84C0E",display: "flex", justifyContent: "center", overflow: "visible" }} onClick={() => onRoleClick(role, desc, isNew, false, false, false)}>
        <div className="state-card-content" style={{ justifyContent: "center", padding: "6px", flexDirection: "column", alignItems: "normal", overflow: "visible" }}>
          <div className="state-icon" style={{padding: "6px"}}>
            <CustomSVG.AddIcon height="30" width="30" fill="#C84C0E" style={{
                backgroundColor: "beige",
                border: "1px solid beige",
                borderRadius: "5px",
                padding: "3px",
              }}/>
          </div>
          <div
            style={{ position: "relative", padding: "6px" }}
            onMouseEnter={() => handleMouseEnter(roleRef, true)}
            onMouseLeave={() => setShowRoleTooltip(false)}
          >
            <p ref={roleRef} className="state-title" style={{
              display: "block",
              textAlign: "center",
              color: "#363636",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
              width: "200px"
            }}>{displayRoleName}</p>
            {showRoleTooltip && displayRoleName && displayRoleName.length > 20 && (
              <span style={{
                ...tooltipStyles,
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`
              }}>
                {displayRoleName}
              </span>
            )}
          </div>
          <div
            style={{ position: "relative", padding: "6px" }}
            onMouseEnter={() => handleMouseEnter(descRef, false)}
            onMouseLeave={() => setShowDescTooltip(false)}
          >
            <p ref={descRef} className="state-description" style={{
              textAlign: "center",
              color: "#363636",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
              width: "200px"
            }}>{desc}</p>
            {showDescTooltip && desc && desc.length > 20 && (
              <span style={{
                ...tooltipStyles,
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`
              }}>
                {desc}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="state-card" style={{ width: "225px", height:"220px", margin: "9px", display: "flex", justifyContent: "center", overflow: "visible" }} onClick={() => onRoleClick(role, desc, isNew, data?.additionalDetails?.access?.editor || false, data?.additionalDetails?.access?.viewer || false, data?.additionalDetails?.access?.creater || false)}>
      <div className="state-card-content" style={{ justifyContent: "center", padding: "6px", flexDirection: "column", alignItems: "normal", overflow: "visible" }}>
        <div className="state-icon" style={{padding: "6px"}}>
          <CustomSVG.PersonIcon height="30" width="30" fill="#C84C0E" style={{
                backgroundColor: "beige",
                border: "1px solid beige",
                borderRadius: "5px",
                padding: "3px",
              }}/>
        </div>
        <div
          style={{ position: "relative", padding: "6px", width: "100%" }}
          onMouseEnter={() => handleMouseEnter(roleRef, true)}
          onMouseLeave={() => setShowRoleTooltip(false)}
        >
          <p ref={roleRef} className="state-title" style={{
            display: "block",
            textAlign: "center",
            color: "#363636",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
            width: "200px"
          }}>{displayRoleName}</p>
          {showRoleTooltip && displayRoleName && displayRoleName.length > 20 && (
            <span style={{
              ...tooltipStyles,
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`
            }}>
              {displayRoleName}
            </span>
          )}
        </div>
        <div
          style={{ position: "relative", padding: "6px", width: "100%" }}
          onMouseEnter={() => handleMouseEnter(descRef, false)}
          onMouseLeave={() => setShowDescTooltip(false)}
        >
          <p ref={descRef} className="state-description" style={{
            textAlign: "center",
            color: "#363636",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
            width: "200px"
          }}>{desc}</p>
          {showDescTooltip && desc && desc.length > 20 && (
            <span style={{
              ...tooltipStyles,
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`
            }}>
              {desc}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


export default RoleComp;