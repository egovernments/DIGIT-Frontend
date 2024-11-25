import { Button, Chip } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { ShowMoreWrapper } from "./ShowMoreWrapper";

const AssigneeChips = ({ assignees, assigneeNames, heading }) => {
  const [showPopUp, setShowPopUp] = useState(false);

  // Safely handle empty or undefined assignee arrays
  const assigneeList = assignees || [];

  return (
    <div className="digit-tag-container" style={{minWidth:"unset", margin:"0rem", gap:"0rem"}}>
      {assigneeList.length > 0 && (
        <Chip
          key={0}
          text={
            assigneeNames?.[assigneeList[0]]?.length > 64
              ? `${assigneeNames[assigneeList[0]].slice(0, 64)}...`
              : assigneeNames?.[assigneeList[0]] || "N/A"
          }
          className=""
          error=""
          extraStyles={{}}
          iconReq=""
          hideClose={true}
        />
      )}

      {assigneeList.length > 1 && (
        <Button
          label={`+${assigneeList.length - 1} More`}
          onClick={() => setShowPopUp(true)}
          variation="link"
          style={{
            height: "2rem",
            minHeight: "2rem",
            padding: "0.5rem",
            minWidth:"0px",
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
          alreadyQueuedSelectedState={assigneeList.map((assignee) => assigneeNames?.[assignee] || "N/A")}
          heading={heading || "More Assignees"}
        />
      )}
    </div>
  );
};

export default AssigneeChips;
