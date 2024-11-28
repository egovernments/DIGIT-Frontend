import { Button, Chip } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { ShowMoreWrapper } from "./ShowMoreWrapper";
import { useTranslation } from "react-i18next";

const AssigneeChips = ({ assignees = [], assigneeNames, heading }) => {
  const { t } = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <div className="digit-tag-container" style={{margin: "0rem", gap: "0rem" }}>
      {assignees.length > 0 && (
        <Chip
          key={0}
          text={
            assigneeNames?.[assignees[0]]?.length > 64
              ? `${assigneeNames?.[assignees[0]].slice(0, 64)}...`
              : assigneeNames?.[assignees[0]] || t("ES_COMMON_NA")
          }
          className=""
          error=""
          extraStyles={{}}
          iconReq=""
          hideClose={true}
        />
      )}

      {assignees.length > 1 && ( 
        <Button
          label={`+${assignees.length - 1} ${t("ES_MORE")}`}
          onClick={() => setShowPopUp(true)}
          variation="link"
          style={{
            height: "2rem",
            minHeight: "2rem",
            padding: "0.5rem",
            minWidth: "0px",
            justifyContent: "center",
            alignItems: "center",
          }}
          textStyles={{
            height: "auto",
            fontSize: "0.875rem",
            fontWeight: "400",
            width: "100%",
            lineHeight: "16px",
            color: "#C84C0E",
          }}
        />
      )}

      {showPopUp && (
        <ShowMoreWrapper
          setShowPopUp={setShowPopUp}
          alreadyQueuedSelectedState={assignees.map((assignee) => assigneeNames?.[assignee] || "N/A")}
          heading={heading || t("ASSIGNEE LIST")}
        />
      )}
    </div>
  );
};

export default AssigneeChips;
