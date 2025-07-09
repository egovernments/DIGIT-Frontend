import { Card } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { IFrameInterface } from "@egovernments/digit-ui-module-utilities";

const KibanaCard = (props) => {
  const { t } = useTranslation();
  const { moduleName, pageName, filters } = props;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const stateCode = Digit?.ULBService?.getStateId();

  return (
    <Card className="digit-kibana-card chart-item">
      <IFrameInterface
        wrapperClassName="digit-dss-kibana-iframe-wrapper"
        className="digit-dss-kibana-iframe"
        moduleName={moduleName}
        pageName={pageName}
        stateCode={stateCode}
        filters={filters}
      />
    </Card>
  );
};

export default KibanaCard;

/**
 * 
 * return (
 * <Card className="kibana-card chart-item">
      <Header>{t("title")}</Header>
      <div className="app-iframe-wrapper dss-kibana-iframe-wrapper">
        <iframe
          id="nabeel-kibana"
          src={"https://fr.wikipedia.org/wiki/Main_Page"}
          title={""}
          className="app-iframe dss-kibana-iframe"
          onLoad={() => {
            const check = document.getElementsByTagName("iframe");
            console.log("NABEELEELELEL", check, "NABEEL", check?.contentWindow?.document?.body?.scrollHeight);
          }}
        />
      </div>
    </Card>
  );
 */
