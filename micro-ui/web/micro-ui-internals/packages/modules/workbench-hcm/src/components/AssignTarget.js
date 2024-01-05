import React, { useState } from "react";

import { DatePicker, Modal, CardLabel, LabelFieldPair, CloseSvg, Close, TextInput } from "@egovernments/digit-ui-react-components";
import { AssignTargetConfig } from "../configs/AssignTargetConfig";

const AssignTarget = ({ t, onClose, heading, startDate, endDate, onChange, onCancel, onSubmit, data }) => {
  const CloseBtn = (props) => {
    return (
      <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
        {props?.isMobileView ? (
          <CloseSvg />
        ) : (
          <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
            <Close />
          </div>
        )}
      </div>
    );
  };
  const Heading = (props) => {
    return <h1 className="heading-m">{props.heading}</h1>;
  };
  console.log("datadata", data);

  return (
    <Modal
      headerBarMain={<Heading t={t} heading={t(heading)} />}
      headerBarEnd={<CloseBtn onClick={onClose} />}
      actionSaveLabel={t("CORE_COMMON_SUBMIT")}
      formId="modal-action"
      actionCancelLabel={t("CORE_COMMON_CANCEL")}
      actionCancelOnSubmit={onCancel}
      actionSaveOnSubmit={onSubmit}
    >
      {AssignTargetConfig?.map((input, index) => (
        <LabelFieldPair key={index}>
          <CardLabel>
            {t(input.label)}
            {input.isMandatory ? " * " : null}
          </CardLabel>
          <TextInput
            key={input.populators.name}
            value={data[input.populators.name] || ""}
            onChange={(e) => onChange(input.populators.name, e.target.value)}
            disable={false}
            {...input.validation}
          />
        </LabelFieldPair>
      ))}
    </Modal>
  );
};

export default AssignTarget;
