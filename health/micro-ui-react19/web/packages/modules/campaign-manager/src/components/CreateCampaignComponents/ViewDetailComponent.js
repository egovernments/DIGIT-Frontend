import { Button, Card, HeaderComponent } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ViewDetailComponent = ({ headingName, desc, buttonLabel, navLink, type, icon, disabled, isDraftCampaign,buttonId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card style={{ marginBottom: "1.5rem" }} className={"clickable"}>
      <div className="details-heading">
        <div className="icon-heading">
          {icon}
          <HeaderComponent
            className={"detail-header campaign-home-card-header"}
            styles={{
              color: disabled ? "#C5C5C5" : "#0B4B66", // same gray for disabled header
            }}
          >
            {headingName}
          </HeaderComponent>
        </div>
        <Button
          label={buttonLabel}
          onClick={() => {
            navigate(`/${window.contextPath}/employee/campaign/${navLink}`, { state: { isDraftCampaign: isDraftCampaign } });
          }}
          variation={type}
          style={{ width: "19rem" }}
          isDisabled={disabled}
          title={buttonLabel}
          id={buttonId}
        />
      </div>
      <div className="details-desc">{desc}</div>
    </Card>
  );
};

export default ViewDetailComponent;
