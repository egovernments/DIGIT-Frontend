import React from "react";
import { CheckBox, CardLabel, ErrorMessage } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

/**
 * Declaration Component for Citizen Property Tax Assessment
 * Displays terms and conditions with a checkbox for acceptance
 */
const Declaration = (props) => {
    const { t } = useTranslation();

    // FormComposerV2 passes ALL props at the root level, not nested in customProps
    // Check both locations for backwards compatibility
    const termsAccepted = props?.config?.customProps?.termsAccepted || props?.termsAccepted || false;
    const onTermsChange = props?.config?.customProps?.onTermsChange || props?.onTermsChange || (() => { });
    const error = props?.config?.customProps?.error || props?.error || null;
    const disabled = props?.config?.customProps?.disabled || props?.disabled || false;
    const label = props?.config?.customProps?.label || props?.label;
    return (
        <div className="declaration-container" style={{ marginTop: "24px", marginBottom: "24px" }}>
            <CardLabel className="declaration-title" style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0B4B66",
                margin: "0px",
                marginBottom: "24px"
            }}>
                {t("PT_FINAL_DECLARATION") || "Declaration"}
            </CardLabel>
            <CheckBox
                onChange={(e) => {
                    if (onTermsChange) {
                        onTermsChange(e.target.checked);
                    }
                }}
                checked={termsAccepted}
                disabled={disabled}
                style={{ marginTop: "2px" }}
                label={label || t("PT_FINAL_DECLARATION_MESSAGE")}
                isLabelFirst={false}
            />

            {error && (
                <ErrorMessage message={t(error) || error} showIcon={true} />
            )}
        </div>
    );
};

export default Declaration;