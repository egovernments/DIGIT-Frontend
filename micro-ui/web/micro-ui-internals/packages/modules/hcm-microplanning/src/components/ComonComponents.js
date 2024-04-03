import { Close, FileDownload } from "@egovernments/digit-ui-svg-components";
import React from "react";
import { useTranslation } from "react-i18next";

export const ButtonType1 = (props) => {
  return (
    <div className="button-type-1">
      <p>{props.text}</p>
    </div>
  );
};

export const ButtonType2 = (props) => {
  return (
    <div className="button-type-2">
      {props.download && (
        <div className="icon">
          <FileDownload fill={"white"} height={"24"} width={"24"} />
        </div>
      )}
      <p>{props.text}</p>
    </div>
  );
};

export const ModalHeading = (props) => {
  return (
    <p className={`modal-header ${props.className ? props.className : ""}`} style={props.style}>
      {props.label}
    </p>
  );
};
