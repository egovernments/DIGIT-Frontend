import React, { Fragment, useState } from "react";
import { Card, Button, TextBlock,CardHeader,CardText } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


function Drawer({ config }) {
    // Drawer is being show on the screen or not
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };
    return (
        // <Card className={"drawer-container"}>
        //   {isOpen && <div className="fullscreen-blur"></div>}
        <>
            {/* <Card className={`drawer ${isOpen ? "open" : "closed"}`}>
                <TextBlock header={t("SETUP_YOUR_SANDBOX")} headerClasName="header" />
                {mdmsData.map((item) => (
                    <Card key={item.actionId} className="slider-card">
                        <div className="iconContainer">
                            <div className="icon">
                                {Digit.Utils.iconRender(item.iconName, "#F47738", "7rem", "7rem")}
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
            </Card> */}
             <Card className={`drawer ${isOpen ? "open" : "closed"}`}>
      {config.map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          <CardHeader>{t(section.sectionHeader)}</CardHeader>
          {section.sections && section.sections.map((item, itemIndex) => (
            <CardText key={itemIndex}>{t(item.label)}</CardText>
          ))}
          {section.links && Object.values(section.links).map((linkGroup, linkIndex) => (
            <div key={linkIndex}>
              <CardText>{t(linkGroup.description)}</CardText>
              {linkGroup.links.map((link, linkItemIndex) => (
                <div key={linkItemIndex}>
                  <Link to={{ pathname: link.link, search: link.queryParams }} className="quickLink">
                    {t(link.label)}
                  </Link>
                  <CardText>{t(link.description)}</CardText>
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </Card>
            <button
                onClick={toggleDrawer}
                className={`toggle-button ${isOpen ? "open" : "closed"}`}
            >
                {!isOpen ? (
                    <>
                        <span className="arrow-icon">
                            {Digit.Utils.iconRender("ArrowBackIos", "#000000", "2rem", "2rem")}
                        </span>
                        <span className="vertical-bar"></span>
                    </>
                ) : (
                    <>
                        <span className="vertical-bar"></span>
                        <span className="arrow-icon">
                            {Digit.Utils.iconRender("ArrowForwardIos", "#000000", "2rem", "2rem")}
                        </span>
                    </>
                )}
            </button>
        </>
    // {/* </Card> */ }
  );
}
export default Drawer;