import { Button } from "@egovernments/digit-ui-components";
import React, { useState, Fragment } from "react";

const FacilityPopUpWrapper = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const FacilityPopUp = Digit.ComponentRegistryService.getComponent("FacilityPopup");

  return (
    <React.Fragment>
      <Button
        className=""
        icon="ArrowForward"
        iconFill=""
        isSuffix
        label={props?.t("MICROPLAN_ASSIGN")}
        onClick={() => setShowPopup(true)}
        options={[]}
        optionsKey=""
        size="medium"
        style={{}}
        title=""
        variation="secondary"
      />
      {showPopup && (
        <FacilityPopUp
          details={props?.row}
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default FacilityPopUpWrapper;
