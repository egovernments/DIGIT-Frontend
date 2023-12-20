import React, { useState } from "react";

import { DatePicker, Modal, CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";

const AssignCampaign = ({ t, onClose, heading, startDate, endDate, onChange, onCancel, onSubmit }) => {
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="#FFFFF" />
      <path fill="#0B0C0C" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );

  const CloseBtn = (props) => {
    return (
      <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
        {props?.isMobileView ? (
          <CloseSvg />
        ) : (
          <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
            {" "}
            <Close />{" "}
          </div>
        )}
      </div>
    );
  };
  const Heading = (props) => {
    return <h1 className="heading-m">{props.heading}</h1>;
  };

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
      <LabelFieldPair>
        <CardLabel className={"card-label-smaller"}> {`${t("WBH_CAMPAIGN_FROM_DATE_LABEL")}`} </CardLabel>

        <DatePicker type="date" name="startDate" date={startDate} onChange={(date) => onChange(date, "startDate")} />
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel className={"card-label-smaller"}> {`${t("WBH_CAMPAIGN_TO_DATE_LABEL")}`} </CardLabel>
        <div className="field">
          <DatePicker type="date" name="endDate" date={endDate} onChange={(date) => onChange(date, "endDate")} />
        </div>
      </LabelFieldPair>
    </Modal>
  );
};

export default AssignCampaign;
