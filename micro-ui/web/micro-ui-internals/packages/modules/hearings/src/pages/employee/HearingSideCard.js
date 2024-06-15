import { Button, SVG } from "@egovernments/digit-ui-components";
import React from "react";
import { useHistory } from "react-router-dom";


const HearingSideCard = () => {

  const history = useHistory();
  
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || "";
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div className="hearing-side-card">
      <div className="hearing-warning-card">
        <SVG.ErrorOutline width={"24px"} height={"24px"} fill={"#BB2C2F"}></SVG.ErrorOutline>
        <div className="hearing-warning-textwrap">
          <span className="hearing-warning-text">There are 2 last minute rescheduling requests for this hearing</span>
          <Button
            label={"View Requests"}
            variation={"teritiary"}
            onClick={() => handleNavigate("/employee/hearings/view-requests")}
            style={{ padding: "0px" }}
          ></Button>
        </div>
      </div>

      <div className="hearing-details">
        <div className="hearing-title">Case Details</div>
        <div className="hearing-buttons">
          <Button
            label={"Orders"}
            variation={"default"}
            style={{ width: "100%", justifyContent: "center" }}
            iconFill={"#1C1B1F"}
            onClick={() => handleNavigate("/employee/orders/orders-home")}
          />
          <Button
            label={"Submissions"}
            variation={"default"}
            style={{ width: "100%", justifyContent: "center" }}
            icon={""}
            iconFill={"#1C1B1F"}
            onClick={() => handleNavigate("/employee/submissions/submissions-create")}
          />
          <Button
            label={"Case History"}
            variation={"default"}
            style={{ width: "100%", justifyContent: "center" }}
            icon={""}
            iconFill={"#1C1B1F"}
            onClick={() => handleNavigate("/employee/hearings/case-history")}
          />
          <Button
            label={"Parties"}
            variation={"default"}
            style={{ width: "100%", justifyContent: "center" }}
            icon={"Person"}
            iconFill={"#1C1B1F"}
            onClick={() => handleNavigate("/employee/hearings/parties")}
          />
        </div>
      </div>
    </div>
  );
};
export default HearingSideCard;
