import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

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

  // Get cached user data
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

  // Set cached user data
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

  // Fetch user details using Digit.CustomService.getResponse
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
          name: user.name || "Unknown User",
          mobileNumber: user.mobileNumber || "NA",
          emailId: user.emailId || "NA",
          userName: user?.userName || "NA",
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

  // Handle click to reveal user details
  const handleClick = () => {
    if (!uuid) return;

    // Check cache first
    const cachedUser = getCachedUser(uuid);
    if (cachedUser) {
      setuserResponse(cachedUser);
      setShowTooltip(true);
      return;
    }

    // Fetch if not cached
    fetchUserDetails(uuid);
    setShowTooltip(true);
  };

  // Hide tooltip when clicking outside
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

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Mask UUID for display
  const maskUUID = (uuid) => {
    if (!uuid) return "N/A";
    if (uuid.length <= 8) return uuid;
    return `${uuid.substring(0, 4)}...${uuid.substring(uuid.length - 4)}`;
  };

  // Get tooltip position styles
  const getTooltipPosition = () => {
    const baseStyles = {
      position: "absolute",
      zIndex: 1000,
      backgroundColor: "#333",
      color: "white",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      maxWidth: "200px",
      wordWrap: "break-word"
    };

    switch (tooltipPosition) {
      case "top":
        return {
          ...baseStyles,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: "8px"
        };
      case "bottom":
        return {
          ...baseStyles,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "8px"
        };
      case "left":
        return {
          ...baseStyles,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: "8px"
        };
      case "right":
        return {
          ...baseStyles,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: "8px"
        };
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
        <span style={{ fontFamily: "monospace" }}>
          {maskUUID(uuid)}
        </span>
        {showIcon && uuid && (
          <span style={{ marginLeft: "4px", fontSize: "12px" }}>👁️</span>
        )}
        {isLoading && (
          <span style={{ marginLeft: "4px", fontSize: "12px" }}>⏳</span>
        )}
      </button>

      {showTooltip && (userResponse || error) && (
        <div
          ref={tooltipRef}
          style={getTooltipPosition()}
        >
          {error ? (
            <div style={{ color: "#ff6b6b" }}>
              {error}
            </div>
          ) : userResponse ? (
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {userResponse.name}
              </div>
               {userResponse?.userName &&  <div style={{ fontSize: "11px", opacity: 0.8 }}>
                User Name: {userResponse.userName}
              </div>}
            {userResponse?.mobileNumber&&  <div style={{ fontSize: "11px", opacity: 0.8 }}>
                Mobile: {userResponse.mobileNumber}
              </div>}
            {userResponse?.emailId !='NA' && (
              <div style={{ fontSize: "11px", opacity: 0.8 }}>
                Email: {userResponse.emailId}
              </div>
            )}
             {userResponse?.roles && (
              <div style={{ fontSize: "11px", opacity: 0.8 }}>
                Roles: {userResponse?.roles|| "NA"}
              </div>
            )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
