import { Button, Card, HeaderComponent } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { GlobeLocationPin } from "../icons/GlobeLocationPin";
import { useHistory } from "react-router-dom";

const ViewDetailComponent = ({ headingName, desc, buttonLabel, navLink }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Card style={{ marginBottom: "1.5rem" }}>
      <div className="details-heading">
        <div className="icon-heading">
          <GlobeLocationPin />
          <HeaderComponent className={"detail-header"}>{headingName}</HeaderComponent>
        </div>
        <Button
          label={buttonLabel}
          onClick={() => {
            history.push(`/${window.contextPath}/employee/campaign/${navLink}`);
          }}
          variation="primary"
        />
      </div>
      <div>{desc}</div>
    </Card>
  );
};

export default ViewDetailComponent;
