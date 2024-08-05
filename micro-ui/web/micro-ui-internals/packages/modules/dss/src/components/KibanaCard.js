import { Card } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { IFrameInterface } from "@egovernments/digit-ui-module-utilities";

const KibanaCard = (props) => {
  const { t } = useTranslation();
  const { moduleName, pageName, filters } = props;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const stateCode = Digit.ULBService.getStateId();

  return (
    <Card className="kibana-card chart-item">
      <IFrameInterface
        wrapperClassName="dss-kibana-iframe-wrapper"
        className="dss-kibana-iframe"
        moduleName={moduleName}
        pageName={pageName}
        stateCode={stateCode}
        filters={filters}
      />
    </Card>
  );
};

export default KibanaCard;