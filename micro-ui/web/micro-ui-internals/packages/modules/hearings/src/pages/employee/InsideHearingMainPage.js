import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";
import { Header, ActionBar, SVG, SubmitBar, Card } from "@egovernments/digit-ui-react-components";
import { Button, TextArea } from "@egovernments/digit-ui-components";
import EvidenceHearingHeader from "./EvidenceHeader";
import HearingSideCard from "./HearingSideCard";

const fieldStyle = { marginRight: 0 };

const InsideHearingMainPage = () => {
  const history = useHistory();

  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || "";
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div style={{ display: "flex" }}>
      <Card>
        <EvidenceHearingHeader></EvidenceHearingHeader>
        <div style={{ padding: "20px 40px", minWidth: "940px", minHeight: "453px" }}>
          <TextArea style={{ minWidth: "940px", minHeight: "453px" }} ></TextArea>
        </div>
      </Card>
      <Card>
        <HearingSideCard></HearingSideCard>
      </Card>
      <ActionBar>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <button
              style={{
                border: "1px solid blue",
                backgroundColor: "#e6f0ff",
                color: "#1a73e8",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "inline-block",
                fontSize: "16px",
                width: "100%",
              }}
            >
              Attendance: <strong>03</strong>
            </button>
            <Button
              label={"Mark Attendance"}
              variation={"teritiary"}
              onClick={() => handleNavigate("/employee/hearings/mark-attendance")}
              style={{ width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              label={"Adjourn Hearing"}
              variation={"secondary"}
              onClick={() => handleNavigate("/employee/hearings/adjourn-hearing")}
              style={{ width: "100%" }}
            />

            <Button
              label={"End Hearing"}
              variation={"primary"}
              onClick={() => handleNavigate("/employee/orders/orders-create?orderType=SUMMON")}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </ActionBar>
    </div>
  );
};

export default InsideHearingMainPage;
