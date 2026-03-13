import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import {InfoIcon} from "@egovernments/digit-ui-components";

const UserDetails = ({
  uuid,
  tenantId = Digit?.ULBService?.getCurrentTenantId(),
  className = "",
  style = {},
  showIcon = true,
  iconSize = "16px",
  tooltipPosition = "top",
  cacheKey = "user-details-cache"
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userResponse, setuserResponse] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState(null);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  const getCachedUser = (uuid) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cache = JSON.parse(cached);
        return cache[uuid];
      }
    } catch (error) {
      console.warn("Failed to read user cache:", error);
    }
    return null;
  };

  const setCachedUser = (uuid, userData) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      const cache = cached ? JSON.parse(cached) : {};
      cache[uuid] = {
        ...userData,
        cachedAt: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn("Failed to cache user data:", error);
    }
  };

  const fetchUserDetails = async (uuid) => {
    if (!uuid || !tenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await Digit.CustomService.getResponse({
        url: "/user/_search",
        body: {
            tenantId : Digit?.ULBService?.getCurrentTenantId(),
            uuid: [uuid],
            apiOperation: "SEARCH"
        },
      });

      if (res?.user?.[0]) {
        const user = res.user[0];
        const userData = {
          name: user.userName || "Unknown User",
          mobileNumber: user.mobileNumber || "NA",
          emailId: user.emailId || "NA",
          roles: user?.roles.map(ele => ele?.name).join(", ") || "NA"
        };

        setuserResponse(userData);
        setCachedUser(uuid, userData);
      } else {
        setError("User not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!uuid) return;

    const cachedUser = getCachedUser(uuid);
    if (cachedUser) {
      setuserResponse(cachedUser);
      setShowTooltip(true);
      return;
    }

    fetchUserDetails(uuid);
    setShowTooltip(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const maskUUID = (uuid) => {
    if (!uuid) return "N/A";
    if (uuid.length <= 8) return uuid;
    return `${uuid.substring(0, 4)}...${uuid.substring(uuid.length - 4)}`;
  };

  // Calculate tooltip position in viewport coordinates (for portal rendering)
  const getTooltipStyle = () => {
    const baseStyles = {
      position: "fixed",
      zIndex: 99999,
      backgroundColor: "#333",
      color: "white",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      whiteSpace: "normal",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      maxWidth: "280px",
      wordWrap: "break-word",
      pointerEvents: "auto",
    };

    if (!buttonRef.current) return baseStyles;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;

    // If not enough space above (< 80px), show below instead
    const showBelow = tooltipPosition === "top" && spaceAbove < 80;
    const effectivePosition = showBelow ? "bottom" : tooltipPosition;

    switch (effectivePosition) {
      case "top":
        return { ...baseStyles, bottom: `${window.innerHeight - rect.top + 8}px`, left: `${centerX}px`, transform: "translateX(-50%)" };
      case "bottom":
        return { ...baseStyles, top: `${rect.bottom + 8}px`, left: `${centerX}px`, transform: "translateX(-50%)" };
      case "left":
        return { ...baseStyles, top: `${rect.top + rect.height / 2}px`, right: `${window.innerWidth - rect.left + 8}px`, transform: "translateY(-50%)" };
      case "right":
        return { ...baseStyles, top: `${rect.top + rect.height / 2}px`, left: `${rect.right + 8}px`, transform: "translateY(-50%)" };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      className={`user-details-container ${className}`}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={!uuid || isLoading}
        style={{
          background: "none",
          border: "none",
          padding: "4px 8px",
          cursor: uuid ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "inherit",
          color: "inherit",
          fontFamily: "inherit",
          borderRadius: "4px",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={(e) => {
          if (uuid) e.target.style.backgroundColor = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
        }}
      >
        {/* <span style={{ fontFamily: "monospace" }}>
          {maskUUID(uuid)}
        </span> */}
         <span style={{ fontFamily: "monospace" }}>
          {userResponse.name || maskUUID(uuid)}
        </span>
        {showIcon && uuid && (
          // <span style={{ marginLeft: "4px", fontSize: "12px" }}>eye-icon</span>
           <InfoIcon
                  height="16"
                  width="16"
                  fill="#666666"
                />
        )}
        {isLoading && (
          <span style={{ marginLeft: "4px", fontSize: "12px" }}>loading...</span>
        )}
      </button>

      {showTooltip && (userResponse || error) && ReactDOM.createPortal(
        <div ref={tooltipRef} style={getTooltipStyle()}>
          {error ? (
            <div style={{ color: "#ff6b6b" }}>{error}</div>
          ) : userResponse ? (
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {userResponse.name}
              </div>
              {userResponse?.mobileNumber && (
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  Mobile: {userResponse.mobileNumber}
                </div>
              )}
              {userResponse?.emailId != 'NA' && (
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  Email: {userResponse.emailId}
                </div>
              )}
              {userResponse?.roles && (
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  Roles: {userResponse?.roles || "NA"}
                </div>
              )}
            </div>
          ) : null}
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserDetails;
