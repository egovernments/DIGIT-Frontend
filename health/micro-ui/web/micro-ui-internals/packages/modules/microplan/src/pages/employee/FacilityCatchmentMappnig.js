import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import facilityMappingConfig from "../../configs/FacilityMappingConfig";

const FacilityCatchmentMapping = ({}) => {
    const { t } = useTranslation();
    const config = facilityMappingConfig();

    return (
        <React.Fragment>
          <Header>{t("MICROPLAN_ASSIGN_CATCHMENT_VILLAGES")}</Header>
          <div className="inbox-search-wrapper">
            <InboxSearchComposer
              configs={config}
            ></InboxSearchComposer>
          </div>
        </React.Fragment>
      );
};

export default FacilityCatchmentMapping;
