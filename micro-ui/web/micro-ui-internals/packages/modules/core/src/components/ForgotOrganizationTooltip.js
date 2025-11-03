import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";

const ForgotOrganizationTooltip = ({ onSelect }) => {
    const { t } = useTranslation();
    const [showTip, setShowTip] = useState(false);
    const wrapperRef = useRef(null);
    const [topMargin, setTopMargin] = useState("-2rem");

    useEffect(() => {
        const computeTopMargin = () => {
            const width = window.innerWidth || window.screen.availWidth;
            const height = window.innerHeight || window.screen.availHeight;

            // Very small screens (mobile)
            if (width <= 480) {
                return "0.5rem";
            }
            // Small screens (tablet)
            else if (width <= 768) {
                return "0rem";
            }
            // Medium screens with high DPI
            else if (
                width <= 1366 ||
                (height <= 768 && window.devicePixelRatio > 1.0)
            ) {
                return "-1.5rem";
            }
            // Large screens
            return "-2rem";
        };

        setTopMargin(computeTopMargin());

        const handleResize = () => setTopMargin(computeTopMargin());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowTip(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div ref={wrapperRef} className="loginSignUpSelector" style={{ position: "relative", marginTop: topMargin }}>
            <Button
                label={t(`SB_FORGOTORGANIZATION_TOOLTIP`)}
                variation={"link"}
                size={"small"}
                onClick={() => setShowTip((prev) => !prev)}
                // isSuffix={true}
                style={{ marginBottom: "0.5rem", paddingLeft: "0.2rem" }}
            ></Button>
            {showTip && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateY(-4px)",
                        backgroundColor: "#0b4b66",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        maxWidth: "20rem",
                        zIndex: 1000,
                        fontSize: "0.875rem"
                    }}
                >
                    {t("SB_FORGOTORGANIZATION_TOOLTIP_TEXT")}
                </div>
            )}
        </div>
    );
};

export default ForgotOrganizationTooltip;
