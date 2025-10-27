import { Button, Card, HeaderComponent } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ViewDetailComponent = ({ headingName, desc, buttonLabel, navLink, type, icon, disabled, isDraftCampaign }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Card style={{ marginBottom: "1.5rem" }} className={"clickable"}>
      <div className="details-heading">
        <div className="icon-heading">
          {icon}
          <HeaderComponent
            className={"detail-header"}
            styles={{
              color: disabled ? "#C5C5C5" : "#004b5e", // same gray for disabled header
            }}
          >
            {headingName}
          </HeaderComponent>
        </div>
        <Button
          label={buttonLabel}
          onClick={() => {
            history.push(`/${window.contextPath}/employee/campaign/${navLink}`, { isDraftCampaign: isDraftCampaign });
          }}
          variation={type}
          style={{ width: "19rem" }}
          isDisabled={disabled}
          title={buttonLabel}
        />
      </div>
      <div className="details-desc">{desc}</div>
    </Card>
  );
};

export default ViewDetailComponent;
