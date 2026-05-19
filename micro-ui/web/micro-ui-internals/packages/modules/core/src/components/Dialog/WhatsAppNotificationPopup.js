import { PopUp, Button, CardText } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const PREFERENCE_CODE = "USER_NOTIFICATION_PREFERENCES";

const WhatsAppNotificationPopup = ({ onClose }) => {
  const { t } = useTranslation();
  const tenant = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [isChecked, setIsChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preferenceUpsertMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/user-preference/v1/_upsert",
  });

  const handleEnable = async () => {
    if (!isChecked) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await preferenceUpsertMutation.mutateAsync({
        body: {
          preference: {
            userId: userInfo?.uuid,
            tenantId: tenant,
            preferenceCode: PREFERENCE_CODE,
            payload: {
              consent: {
                WHATSAPP: { scope: "GLOBAL", status: "GRANTED" },
              },
            },
          },
        },
      });
      sessionStorage.setItem("whatsapp_popup_shown", "true");
      onClose();
    } catch (error) {
      console.error("Failed to save WhatsApp preference:", error);
      sessionStorage.setItem("whatsapp_popup_shown", "true");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("whatsapp_popup_shown", "true");
    onClose();
  };

  return (
    <PopUp
      type="default"
      heading={t("CS_WHATSAPP_POPUP_HEADING")}
      onClose={onClose}
      onOverlayClick={onClose}
      style={{ width: "620px", maxWidth: "90vw" }}
      equalWidthButtons={true}
      sortFooterButtons={true}
      footerChildren={[
        <Button
          key="dismiss"
          type="button"
          size="large"
          variation="secondary"
          label={t("CS_WHATSAPP_POPUP_NOT_NOW")}
          onClick={handleDismiss}
        />,
        <Button
          key="enable"
          type="button"
          size="large"
          variation="primary"
          label={t("CS_WHATSAPP_POPUP_ENABLE")}
          onClick={handleEnable}
          isDisabled={isSubmitting}
        />,
      ]}
    >
      <div style={{ padding: "8px 0 16px" }}>
        <CardText style={{ fontSize: "16px", color: "#505A5F", lineHeight: "1.5", marginBottom: "24px" }}>
          {t("CS_WHATSAPP_POPUP_DESCRIPTION")}
        </CardText>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 0",
            borderTop: "1px solid #D6D5D4",
            borderBottom: "1px solid #D6D5D4",
            cursor: "pointer",
          }}
          onClick={() => setIsChecked(!isChecked)}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            style={{
              width: "20px",
              height: "20px",
              accentColor: "#c84c0e",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#0B0C0C" }}>
            {t("CS_WHATSAPP_POPUP_CHECKBOX_LABEL")}
          </span>
        </div>

        <CardText style={{ fontSize: "14px", color: "#505A5F", marginTop: "12px" }}>
          {t("CS_WHATSAPP_POPUP_FOOTER_NOTE")}
        </CardText>
      </div>
    </PopUp>
  );
};

export default WhatsAppNotificationPopup;
