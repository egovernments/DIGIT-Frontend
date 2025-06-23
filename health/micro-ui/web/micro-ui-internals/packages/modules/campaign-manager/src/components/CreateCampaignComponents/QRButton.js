import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PopUp ,Button , Loader } from "@egovernments/digit-ui-components";
import QRCode from "react-qr-code";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";

const QRButton = ({setShowQRPopUp}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: appData , isLoading: linkLoading} = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "MobileAppLink",
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.MobileAppLink?.[0];
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.MobileAppLink` }
  );

  if(linkLoading){
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <PopUp
          type={"default"}
          heading={t("ES_APP_QR")}
          description={t("ES_APP_QR_DESC")}
          className={"QR-pop-up"}
          onOverlayClick={() => setShowQRPopUp(false)}
          onClose={() => setShowQRPopUp(false)}
          style={{ width: "35rem" }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              // className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_CLOSE")}
              onClick={() => {
                setShowQRPopUp(false);
              }}
            />,
          ]}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1.5rem 0",
            }}
          >
            <QRCode value={appData?.appLink} size={256} level="H" />
          </div>
        </PopUp>
  );
};

export default QRButton;
