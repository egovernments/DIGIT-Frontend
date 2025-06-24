import React, { useEffect, useRef } from "react";
import { Notifications } from "@egovernments/digit-ui-svg-components";

const MobileBezelFrame = ({ children }) => {
  const scrollRef = useRef(null);
  let scrollTimeout = null;
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
    <div className="mobile-bezel-outerWrapper" style={styles.outerWrapper}>
      <div className="mobile-bezel-deviceWrapper" style={styles.deviceWrapper}>
        <div className="mobile-bezel-camera" style={styles.camera}></div>
        <div className="mobile-bezel-screen" ref={scrollRef} style={styles.screen}>
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
    height: "calc(100vh - 12rem)",
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
    overflowY: "auto",
    // padding: "16px",
    boxSizing: "border-box",
  },
};

export default MobileBezelFrame;
