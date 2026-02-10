import React, { useEffect, useRef, useState } from "react";
import { Notifications, ZoomIn, ZoomOut } from "@egovernments/digit-ui-svg-components";

const MobileBezelFrame = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1); // default 1 (100%)
  const [bezelZoom, setBezelZoom] = useState(1);

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(2, prev + 0.1)); // limit to 200%
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(0.3, prev - 0.1)); // limit to 30%
  };
  const zoomPercentage = Math.round(zoomLevel * 100);

  const scrollRef = useRef(null);
  let scrollTimeout = null;

  // Dynamically calculate zoom so the phone always fits in the preview area
  useEffect(() => {
    const calculateBezelZoom = () => {
      const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const viewportHeight = window.innerHeight;
      // Preview area: top 12.375rem + bottom 4.5rem = 16.875rem offset
      const previewAreaHeight = viewportHeight - (16.875 * remSize);
      const phoneHeight = 45 * remSize; // device height (45rem)
      const margin = 2 * remSize; // 1rem margin top + bottom
      const targetHeight = previewAreaHeight - margin;
      const zoom = Math.min(1, targetHeight / phoneHeight);
      setBezelZoom(zoom);
    };

    calculateBezelZoom();
    window.addEventListener("resize", calculateBezelZoom);
    return () => window.removeEventListener("resize", calculateBezelZoom);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      scrollElement.classList.add("scrolling");

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollElement.classList.remove("scrolling");
      }, 1000);
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="mobile-bezel-flexContainer">
      {/* <div className="mobile-bezel-zoom-container">
        <button className="item zoom-button" onClick={zoomOut}>
          <ZoomOut />
        </button>
        <span className="item zoom-span">{zoomPercentage}%</span>
        <button className="item zoom-button" onClick={zoomIn}>
          <ZoomIn />
        </button>
      </div> */}
      <div className="mobile-bezel-outerWrapper" style={{ ...styles.outerWrapper, zoom: bezelZoom }}>
        <div className="mobile-bezel-deviceWrapper" style={styles.deviceWrapper}>
          <div className="mobile-bezel-camera" style={styles.camera}></div>
          <div className="mobile-bezel-screen" ref={scrollRef} style={styles.screen}>
            <div
              className="zoom-content"
              style={{
                transform: `scaleY(${zoomLevel})`,
                transformOrigin: "top",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="mobile-top-bar" style={{ flexDirection: "row", gap: "1rem" }}>
                <div className="mobile-menu-icon">&#9776;</div>
                <img
                  src="https://egov-uat-assets.s3.ap-south-1.amazonaws.com/hcm/mseva-white-logo.png"
                  alt="MSEVA Logo"
                  className="mseva-logo"
                  style={{ width: "8rem", filter: "brightness(0) invert(1)" }}
                />
                <div className="mobile-notifications-icon" style={{ marginLeft: "auto" }}>
                  <Notifications width="24" height="24" fill="white" />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerWrapper: {
    // background: "linear-gradient(to bottom, #555, #222)",
    // padding: "40px",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // minHeight: "100vh",
  },
  deviceWrapper: {
    width: "29rem",
    height: "45rem",
    backgroundColor: "#000",
    borderRadius: "40px",
    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
    position: "relative",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  camera: {
    width: "10px",
    height: "10px",
    backgroundColor: "#333",
    borderRadius: "50%",
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2,
  },
  screen: {
    marginTop: "24px",
    backgroundColor: "#fff",
    borderRadius: "24px",
    flexGrow: 1,
    // padding: "16px",
    boxSizing: "border-box",
  },
};

export default MobileBezelFrame;
