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
      {props.showDownloadIcon && (
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


export const convertGeojsonToExcelSingleSheet = (InputData, fileName) => {
  if (!InputData || !Array.isArray(InputData) || InputData.length === 0) {
    console.error("InputData is missing or invalid.");
    return null;
  }

  // Extract keys from the first feature's properties
  const keys = Object.keys(InputData?.[0]?.properties);

  if (!keys || keys.length === 0) {
    console.error("Properties keys are missing or invalid in the InputData.");
    return null;
  }

  // Extract corresponding values for each feature
  const values = InputData?.map((feature) => {
    return keys.map((key) => feature.properties[key]);
  });

  // Group keys and values into the desired format
  return { [fileName]: [keys, ...values] };
};
