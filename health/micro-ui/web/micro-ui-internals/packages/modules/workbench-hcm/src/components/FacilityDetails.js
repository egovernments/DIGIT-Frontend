import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const FacilityDetails = ({ 
  facilityId, 
  tenantId = Digit?.ULBService?.getCurrentTenantId(),
  className = "",
  style = {},
  showIcon = true,
  iconSize = "16px",
  tooltipPosition = "top",
  cacheKey = "facility-details-cache"
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [facilityResponse, setFacilityResponse] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState(null);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  // Get cached facility data
  const getCachedFacility = (facilityId) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cache = JSON.parse(cached);
        const cachedData = cache[facilityId];
        // Check if cache is still valid (24 hours)
        if (cachedData && (Date.now() - cachedData.cachedAt) < 24 * 60 * 60 * 1000) {
          return cachedData;
        }
      }
    } catch (error) {
      console.warn("Failed to read facility cache:", error);
    }
    return null;
  };

  // Set cached facility data
  const setCachedFacility = (facilityId, facilityData) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      const cache = cached ? JSON.parse(cached) : {};
      cache[facilityId] = {
        ...facilityData,
        cachedAt: Date.now()
      };
      // Limit cache size to 100 entries
      const cacheKeys = Object.keys(cache);
      if (cacheKeys.length > 100) {
        // Remove oldest entries
        const sortedKeys = cacheKeys.sort((a, b) => 
          (cache[a].cachedAt || 0) - (cache[b].cachedAt || 0)
        );
        for (let i = 0; i < cacheKeys.length - 100; i++) {
          delete cache[sortedKeys[i]];
        }
      }
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn("Failed to cache facility data:", error);
    }
  };

  // Fetch facility details using Digit.CustomService.getResponse
  const fetchFacilityDetails = async (facilityId) => {
    if (!facilityId || !tenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await Digit.CustomService.getResponse({
        url: "/facility/v1/_search",
        body: {
          Facility: {
            tenantId: tenantId,
            id: [facilityId]
          }
        },
         params: {
        tenantId: tenantId,
        limit: 1,
        offset: 0
      }

      });
      
      if (res?.Facilities?.[0]) {
        const facility = res.Facilities[0];
        const facilityData = {
          name: facility.name || "Unknown Facility",
          type: facility.usage || facility.type || "NA",
          address: facility.address?.locality?.code || facility.address?.district || "NA",
          status: facility.isActive === false ? "Inactive" : "Active",
          storageCapacity: facility.storageCapacity || "NA",
          isPermanent: facility.isPermanent ? "Permanent" : "Temporary"
        };
        
        setFacilityResponse(facilityData);
        setCachedFacility(facilityId, facilityData);
      } else {
        setError("Facility not found");
      }
    } catch (error) {
      console.error("Error fetching facility details:", error);
      setError("Failed to fetch facility details");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click to reveal facility details
  const handleClick = () => {
    if (!facilityId) return;

    // Check cache first
    const cachedFacility = getCachedFacility(facilityId);
    if (cachedFacility) {
      setFacilityResponse(cachedFacility);
      setShowTooltip(true);
      return;
    }

    // Fetch if not cached
    fetchFacilityDetails(facilityId);
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

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Mask facility ID for display
  const maskFacilityId = (id) => {
    if (!id) return "N/A";
    if (id.length <= 20) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  // Get facility type color
  const getFacilityTypeColor = (type) => {
    const typeColors = {
      "WAREHOUSE": "#2196F3",
      "HEALTH_FACILITY": "#4CAF50",
      "CLINIC": "#00BCD4",
      "HOSPITAL": "#9C27B0",
      "DISTRIBUTION_CENTER": "#FF9800",
      "PHC": "#8BC34A",
      "CHC": "#03A9F4",
      "default": "#757575"
    };
    return typeColors[type?.toUpperCase()] || typeColors.default;
  };

  // Get tooltip position styles
  const getTooltipPosition = () => {
    const baseStyles = {
      position: "absolute",
      zIndex: 1000,
      backgroundColor: "#333",
      color: "white",
      padding: "10px 14px",
      borderRadius: "6px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
      minWidth: "200px",
      maxWidth: "300px",
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
      className={`facility-details-container ${className}`} 
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={!facilityId || isLoading}
        style={{
          background: "none",
          border: "none",
          padding: "4px 8px",
          cursor: facilityId ? "pointer" : "default",
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
          if (facilityId) e.target.style.backgroundColor = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
        }}
      >
        <span style={{ 
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#673AB7",
          backgroundColor: "#F3E5F5",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid #E1BEE7"
        }}>
          {maskFacilityId(facilityId)}
        </span>
        {showIcon && facilityId && (
          <span style={{ marginLeft: "4px", fontSize: iconSize }}>🏥</span>
        )}
        {isLoading && (
          <span style={{ marginLeft: "4px", fontSize: iconSize }}>⏳</span>
        )}
      </button>

      {showTooltip && (facilityResponse || error) && (
        <div
          ref={tooltipRef}
          style={getTooltipPosition()}
        >
          {error ? (
            <div style={{ color: "#ff6b6b" }}>
              {error}
            </div>
          ) : facilityResponse ? (
            <div>
              <div style={{ 
                fontWeight: "bold", 
                marginBottom: "6px",
                fontSize: "13px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "4px"
              }}>
                {facilityResponse.name}
              </div>
              
              <div style={{ 
                fontSize: "11px", 
                opacity: 0.9,
                marginBottom: "3px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span>Type:</span>
                <span style={{
                  backgroundColor: getFacilityTypeColor(facilityResponse.type),
                  padding: "1px 6px",
                  borderRadius: "3px",
                  fontWeight: "500"
                }}>
                  {facilityResponse.type}
                </span>
              </div>

              {facilityResponse?.status && (
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>
                  Status: <span style={{
                    color: facilityResponse.status === "Active" ? "#4CAF50" : "#f44336",
                    fontWeight: "500"
                  }}>
                    {facilityResponse.status}
                  </span>
                </div>
              )}

              {facilityResponse?.isPermanent !== "NA" && (
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>
                  Type: {facilityResponse.isPermanent}
                </div>
              )}

              {facilityResponse?.address !== "NA" && (
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>
                  Location: {t(facilityResponse.address)}
                </div>
              )}

              {facilityResponse?.storageCapacity !== "NA" && (
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  Storage: {facilityResponse.storageCapacity} units
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FacilityDetails;