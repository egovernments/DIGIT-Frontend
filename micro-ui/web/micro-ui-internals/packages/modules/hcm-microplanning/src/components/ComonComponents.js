import { FileDownload } from "@egovernments/digit-ui-svg-components";
import React from "react";
import { useTranslation } from "react-i18next";

export const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick} style={{ backgroundColor: "#FFFFFF", borderRadius: "0.25rem" }}>
      <Close width={props.side ? props.side : "24"} height={props.side ? props.side : "24"} />
    </div>
  );
};

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
      <div className="icon">
        <CustomIcon color={"white"} height={"24"} width={"24"} Icon={FileDownload} />
      </div>
      <p>{props.text}</p>
    </div>
  );
};

// Custom icon component
export const CustomIcon = (props) => {
  if (!props.Icon) return null;
  return <props.Icon fill={props.color} style={{}} {...props} />;
};

export const ModalHeading = (props) => {
  return (
    <p className="modal-header" style={props.style}>
      {props.label}
    </p>
  );
};

export const Loader = (props) => {
  const { t } = useTranslation();
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-inner" />
      </div>
      <div className="loader-text">{t(props.text || "FILE_UPLOADING")}</div>
    </div>
  );
};

const Close = ({ width, height }) => (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#0B0C0C" />
    </svg>
  );
  