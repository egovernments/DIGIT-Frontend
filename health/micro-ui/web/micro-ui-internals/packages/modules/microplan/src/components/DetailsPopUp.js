import React, { Fragment, useState, useEffect } from "react";
import { PopUp, Button, TextInput, Toast,CardLabel,LabelFieldPair } from "@egovernments/digit-ui-components";

const DetailsPopUp = ({
  isVisible,
  onClose,
  onSubmit,
  initialValue,
  alertHeading,
  alertMessage,
}) => {
  const [value, setValue] = useState(initialValue || "");
  return (
    <>
      {isVisible && (
        <PopUp
          type="alert"
          onClose={onClose}
          alertMessage={alertMessage || "Enter details"}
        //   alertHeading={alertHeading || "Edit Value"}
          onOverlayClick={onClose}
          equalWidthButtons={true}
          style={{maxWidth:"40rem"}}
          footerChildren={[
            <Button
              key="cancel-button"
              label="Cancel"
              variation="secondary"
              onClick={onClose}
            />,
            <Button
            key="save-button"
            label="Submit"
            variation="primary"
            onClick={() => onSubmit(value)}
          />
          ]}
        >
            <LabelFieldPair style={{flexDirection:"column",marginBottom:"0px",alignItems:"center"}}>
{/* <CardLabel style={{margin:"0px"}}>{"Enter Details"}</CardLabel> */}
            <TextInput
            id="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
            </LabelFieldPair>
        </PopUp>
      )}
    </>
  );
};

export default DetailsPopUp;
