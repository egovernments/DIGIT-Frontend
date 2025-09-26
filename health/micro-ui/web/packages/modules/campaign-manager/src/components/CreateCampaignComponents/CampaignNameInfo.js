import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AlertCard , Loader } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";


const CampaignNameInfo = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: infoData , isLoading: infoLoading} = Digit.Hooks.useCustomMDMS(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [
        {
          name: "CampaignNamingConvention",
        },
      ],
      {
        select: (data) => {
          return data?.[CONSOLE_MDMS_MODULENAME]?.CampaignNamingConvention?.[0];
        },
      },
      { schemaCode: `${CONSOLE_MDMS_MODULENAME}.CampaignNamingConvention` }
    );
  
    if(infoLoading){
      return <Loader page={true} variant={"PageLoader"} />;
    }

  return (
    <AlertCard
            label={t("CONSOLE_NAMING_CONVENTION")}
            style={{ width: "100%", maxWidth: "unset" }}
            additionalElements={[
              <div className="campaign-name-parent-container">
                {infoData?.data?.map((item, index) => (
                  <div key={`container-${item}`} className="campaign-name-container" >
                    <p key={`number-${index}`} >
                      {t(index + 1)}.
                    </p>
                    <p key={`text-${index}`} className="campaign-name-code">
                      {t(item)}
                    </p>
                  </div>
                ))}
              </div>,
            ]}
          />
  );
};

export default CampaignNameInfo;
