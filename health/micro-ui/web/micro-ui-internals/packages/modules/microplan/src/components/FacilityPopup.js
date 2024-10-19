import React, { useState, useMemo, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card } from "@egovernments/digit-ui-components";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import facilityMappingConfig from "../configs/FacilityMappingConfig";

const FacilityPopUp = ({ details, onClose }) => {
  const { t } = useTranslation();

  const config = facilityMappingConfig();

  return (
    <>
      <PopUp
        onClose={onClose}
        heading={`${t(`MICROPLAN_ASSIGNMENT_FACILITY`)} ${details?.additionalDetails?.name}`}
        children={[
          <InboxSearchComposer
            configs={config} // dummy config
          ></InboxSearchComposer>,
        ]}
        onOverlayClick={onClose}
        footerChildren={[
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t(`MICROPLAN_CLOSE_BUTTON`)}
            onClick={onClose}
          />,
        ]}
        className={"facility-popup"}
      />
    </>
  );
};

export default FacilityPopUp;
