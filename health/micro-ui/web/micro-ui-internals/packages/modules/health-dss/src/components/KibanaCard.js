import { Card } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { IFrameInterface } from "@egovernments/digit-ui-module-utilities";

const KibanaCard = (props) => {
  const { t } = useTranslation();
  const { moduleName, pageName, filters } = props;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const isMobile = window.Digit?.Utils?.browser?.isMobile();
  const stateCode = Digit?.ULBService?.getStateId();
  const kibanaMapsDomain=window?.globalConfigs?.getConfig("KIBANA_MAPS_DOMAIN");

  return (
    <Card className="digit-kibana-card chart-item">
      <IFrameInterface
        wrapperClassName="digit-dss-kibana-iframe-wrapper"
        className="digit-dss-kibana-iframe"
        moduleName={moduleName}
        pageName={pageName}
        stateCode={stateCode}
        filters={filters}
        kibanaMapsDomain={kibanaMapsDomain}
      />
    </Card>
  );
};

export default KibanaCard;
