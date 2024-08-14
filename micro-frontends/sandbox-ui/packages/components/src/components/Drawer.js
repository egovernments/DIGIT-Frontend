import React, { Fragment, useState } from "react";
import { DigitUIComponents } from "./../index";
import "./../css/index.css";
const { Card, Button, TextBlock } = DigitUIComponents;

import { iconRender } from "../utils/iconRender";
import { useTranslation } from "react-i18next";

function Drawer({ mdmsData = [] }) {
  // Drawer is being show on the screen or not
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className={"drawer-container"}>
      {isOpen && <div className="fullscreen-blur"></div>}
      <Card className={`drawer ${isOpen ? "open" : "closed"}`}>
        <TextBlock header={t("SETUP_YOUR_SANDBOX")} headerClasName="header" />
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
                caption={t(item.title)}
                captionClassName="caption"
                bodyClasName="textbody"
                body={t(item.label)}
              />
              <Card className="button">
                <Button
                  variation="secondary"
                  label={t(item.buttonName)}
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
            <span className="arrow-icon">
              {iconRender("ArrowBackIos", "#000000", "2rem", "2rem")}
            </span>
            <span className="vertical-bar"></span>
          </>
        ) : (
          <>
            <span className="vertical-bar"></span>
            <span className="arrow-icon">
              {iconRender("ArrowForwardIos", "#000000", "2rem", "2rem")}
            </span>
          </>
        )}
      </button>
    </Card>
  );
}

export default Drawer;
