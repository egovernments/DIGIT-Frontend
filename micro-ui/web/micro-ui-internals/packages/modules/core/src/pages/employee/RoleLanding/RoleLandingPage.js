import React from "react";
import { Card, CardText, CardHeader, Button , Header} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { externalConfig } from "./RoleLandingConfig";
import YoutubeVideo from "../Landing/YoutubeVideo";

const RoleLandingComponent = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const handleButtonClick = (action) => {
        const url= '/'+window.contextPath+action
        window.open(url, "_blank");
    };

    return (
        <Card>
            {externalConfig.filter(config => config.type === "link")
            .map((config, index)=>(
                <div key={index}>
                <Header className="headerFlex" styles={{ fontWeight: "700", fontSize: "32px", marginBottom: "20px" }}>{t("ROLE_BASED_LANDING_HEADER")}</Header>
                <YoutubeVideo link={config.url} overlay={true} />
                </div>
            ))
            }
            {externalConfig
                .filter(config => config.type === "text")
                .map((config, index) => (
                    <div key={index} className="config-section">
                        <CardHeader styles={{ marginBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>{config.heading}</CardHeader>
                        {config.paragraphs.map((paragraph, pIndex) => (
                            <CardText key={pIndex}>{paragraph}</CardText>
                        ))}
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                            {config.steps.map((stepObj, sIndex) => (
                                <li key={sIndex}>
                                    {stepObj.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            
            <div className="role-action-container">
                {externalConfig
                    .filter(config => config.type === "card")
                    .map((config, index) => {
                        const IconComponent = config.icon; // Changed to IconComponent
                        return (
                            <div key={index} className="role-card">
                                {IconComponent && <IconComponent />} {/* Render icon */}
                                {/* Card-specific content */}
                                <CardHeader>{t(config.heading)}</CardHeader>
                                <Button
                                    className="role-button"
                                    label={t(config.buttonName)}
                                    variation={"primary"}
                                    onClick={() => handleButtonClick(config.action)}
                                />
                                <CardText>{t(config.description)}</CardText>
                            </div>
                        );
                    })}
            </div>
        </Card>
    );
};

export default RoleLandingComponent;
