import React, { Fragment, useState } from "react";
import { DigitUIComponents } from "./../index";
import "./../css/index.css";
const { Card, Button, TextBlock } = DigitUIComponents;

import { iconRender } from "../utils/iconRender";

function Drawer({ drawerDirection = "right", mdmsData = [] }) {
  // Drawer is being show on the screen or not
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    console.log("ACTIVE", isOpen);
    setIsOpen(!isOpen);
  };

  // Secondary Card
  //Secondary Button will be used

  console.log(drawerDirection);

  return (
    <Card className={`drawer-container ${drawerDirection}`}>
      {isOpen && <div className="fullscreen-blur"></div>}
      <Card className={`drawer ${isOpen ? "open" : "closed"}`}>
        <TextBlock header="Setup your Sandbox!" headerClasName="header" />
        {mdmsData.map((item) => (
          <Card key={item.actionId} className="slider-card">
            <div className="iconContainer">
              <div className="icon">
                {iconRender(item.iconName, "#F47738", "7rem", "7rem")}
              </div>
            </div>
            <span className="card-divider"></span>
            <Card className="content-button">
              <TextBlock
                caption="Explore your Applications"
                captionClassName="caption"
                bodyClasName="textbody"
                // body={t(item.label)}
                body="Explore default DIGIT applications, envision use cases and make your applications live after configuration. Explore default DIGIT applications, envision use cases and make your applications live after configuration."
              />
              <Card className="button">
                <Button
                  variation="secondary"
                  label={item.buttonName}
                  className="custom-button"
                />
              </Card>
            </Card>
          </Card>
        ))}
      </Card>

      <button
        onClick={toggleDrawer}
        className={`toggle-button ${isOpen ? "open" : "closed"}`}
      >
        {!isOpen ? (
          <>
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.67 18.1284L9.9 19.8984L0 9.99844L9.9 0.0984391L11.67 1.86844L3.54 9.99844L11.67 18.1284Z"
                fill="#0B0C0C"
              />
            </svg>
            <span className="vertical-bar"></span>
          </>
        ) : (
          <>
            <span className="vertical-bar"></span>
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.33 18.1284L2.1 19.8984L12 9.99844L2.1 0.0984391L0.329998 1.86844L8.46 9.99844L0.33 18.1284Z"
                fill="#0B0C0C"
              />
            </svg>
          </>
        )}
      </button>
    </Card>
  );
}

export default Drawer;
