import React from "react";
import { useTranslation } from "react-i18next";
import instructionConfig from "../config/instructions";

const QuickStart = ({ }) => {
    const { t } = useTranslation();

    return (
        <div className={`state-card`}>
            <div className="state-card-content" style={{justifyContent: "center", flexDirection: "column", alignItems: "normal"}}>
                <h3 className={`quickstart-title`}>{t("QUICK_START")}</h3>
                
                {instructionConfig.map((item, index) => (
                    <div>
                        <div className="step-number">{t(item.step)}</div>
                        <div className="step-description">{t(item.desc)}</div>
                    </div>
                ))}
            </div>
        </div> 
    );
};

export default QuickStart;