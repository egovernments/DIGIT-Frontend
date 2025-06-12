import React from "react";

const MobileBezelFrame = ({ children }) => {
  return (
    <div className="mobile-bezel-outerWrapper" style={styles.outerWrapper}>
      <div className="mobile-bezel-deviceWrapper" style={styles.deviceWrapper}>
        <div className="mobile-bezel-camera" style={styles.camera}></div>
        <div className="mobile-bezel-screen" style={styles.screen}>
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
    height: "calc(100vh - 15rem)",
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
