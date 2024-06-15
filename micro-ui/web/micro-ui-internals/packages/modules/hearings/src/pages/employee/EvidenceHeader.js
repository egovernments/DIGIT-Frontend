import { Button, SVG } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { Header, Menu } from "@egovernments/digit-ui-react-components";
import { VideoIcon } from "./CustomSVGs";
import { useHistory } from "react-router-dom";

const EvidenceHearingHeader = () => {
  const [activeTab, setActiveTab] = useState("Transcript/Summary");
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();

  const handleTakeAction = () => {
    setShowMenu(!showMenu);
  };

  const handleSelect = (option) => {

    if (option == "Generate Order(s)") {
      const contextPath = window?.contextPath || '';
      history.push(`/${contextPath}/employee/orders/orders-create?orderType=SCHEDULE`);
    }
  };

  return (
    <div className="evidence-header-wrapper">
      <div className="evidence-hearing-header">
        <div className="title-section">
          <Header className={"evidence-header"}>Evidence Hearing</Header>
          <div className="case-details">
            <div className="text">Aparna vs. Subarna</div>
            <div className="breakline"></div>
            <div className="text">NIA 138</div>
            <div className="breakline"></div>
            <div className="text">Trial</div>
          </div>
        </div>
        <div className="evidence-actions">
          <Button variation={"teritiary"} label={"Share"} icon={"Share"} iconFill={"#007E7E"}></Button>
          <Button variation={"primary"} label={"Take Action"} icon={showMenu ? "ExpandLess" : "ExpandMore"} isSuffix={true} onClick={handleTakeAction}></Button>
          {showMenu && <Menu options={["Generate Order(s)", "Add Party"]} onSelect={(option) => handleSelect(option)}></Menu>}
        </div>
      </div>
      <div className="join-video-conference">
        <div className="conference-info">
          <VideoIcon></VideoIcon>
          <span>You can join this hearing online if you are not present in court.</span>
        </div>
        <Button variation={"teritiary"} label={"Join Video Conference"}></Button>
      </div>
      <div className="tabs-component">
        <div className="tab" onClick={() => setActiveTab("Transcript/Summary")}>
          <span className={activeTab === "Transcript/Summary" ? "active" : ""}>Transcript/Summary</span>
          {activeTab === "Transcript/Summary" && <div className="breakline"></div>}
        </div>
        <div className="tab" onClick={() => setActiveTab("Witness Deposition")}>
          <span className={activeTab === "Witness Deposition" ? "active" : ""}>Witness Deposition</span>
          {activeTab === "Witness Deposition" && <div className="breakline"></div>}
        </div>
      </div>
    </div>
  );
};
export default EvidenceHearingHeader;
