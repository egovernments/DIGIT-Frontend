import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Table } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, CardHeader, CardText, Loader, SVG } from "@egovernments/digit-ui-components";
import { setupMasterConfig } from "../applicationMgmt/config/setupMasterConfig";

const TenantInfocard = () => {

  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const module = searchParams.get("module");
  const config = setupMasterConfig?.SetupMaster?.filter((item) => item.module === module)?.[0];

  return (
    <Card className={"sandboxSetupMasterInfo"}>
      <>
        <Header className="headerFlex" styles={{ fontSize: "32px" }}>
          <SVG.Announcement height={40} width={40} />
          {t(config?.header || "N/A")}
        </Header>
        <CardText>{t(config?.description)}</CardText>
        {config?.add_organization?.length > 0 && <CardHeader className="subHeader"> {t("SUB_ORGANIZATION_ADD")}</CardHeader>}
        {config?.add_organization?.length > 0 &&
          config?.add_organization?.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>{index + 1}. </span>
              <span style={{ marginRight: "0.5rem" }}>{t(item.name)}</span>
            </li>
          ))}

        {config?.view_organization?.length > 0 && <CardHeader className="subHeader"> {t("SUB_ORGANIZATION_VIEW")}</CardHeader>}
        {config?.view_organization?.length > 0 &&
          config?.view_organization?.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>{index + 1}. </span>
              <span style={{ marginRight: "0.5rem" }}>{t(item.name)}</span>
            </li>
          ))}

        {config?.edit_organization?.length > 0 && <CardHeader className="subHeader"> {t("SUB_ORGANIZATION_EDIT")}</CardHeader>}
        {config?.edit_organization?.length > 0 &&
          config?.edit_organization?.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>{index + 1}. </span>
              <span style={{ marginRight: "0.5rem" }}>{t(item.name)}</span>
            </li>
          ))}
        <div className="setupMasterSetupActionBar">
          <Button
            className="actionButton"
            label={t(config.actionText)}
            variation={"secondary"}
            icon="ArrowForward"
            isSuffix={true}
            onClick={(e) => {
              e.preventDefault();
              history.push(`/${window?.contextPath}/employee/sandbox/tenant-management/create`);
            }}
          ></Button>
        </div>
      </>
    </Card>
  );
};

export default TenantInfocard;
