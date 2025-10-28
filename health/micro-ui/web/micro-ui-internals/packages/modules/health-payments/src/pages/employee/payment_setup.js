import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Card, LabelFieldPair, Dropdown, CardText, HeaderComponent, TextInput, Button } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import RoleWageTable from "../../components/payment_setup/wageTable";

const PaymentSetUpPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [billingCycle, setBillingCycle] = useState(null);
  const [customDays, setCustomDays] = useState("");

  const renderLabelPair = (heading, content) => (
    <div className="label-pair" style={{ alignContent: "center", alignItems: "center" }}>
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text">{content}</span>
    </div>
  );

  return (
    <div>
      <Card type="primary" className="bottom-gap-card-payment">
        <HeaderComponent>{t("Caption Setup payment for campaign")}</HeaderComponent>
        <CardText>{t("Setup billing cycles for a campaign")}</CardText>

        {/* Campaign Dropdown */}
        {renderLabelPair(
          "Select a campaign",
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={[{ code: "1", name: "USUSU" }]}
            optionKey="code"
            selected={selectedCampaign}
            select={(value) => setSelectedCampaign(value)}
          />
        )}

        {/* Billing Cycle Dropdown */}
        {renderLabelPair(
          "Billing cycle",
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={[
              { code: "WEEKLY", name: "Weekly" },
              { code: "MONTHLY", name: "Monthly" },
              { code: "END", name: "End of campaign" },
              { code: "CUSTOM", name: "Custom" },
            ]}
            optionKey="code"
            selected={billingCycle}
            select={(value) => setBillingCycle(value)}
          />
        )}

        {/* Show TextInput only if "Custom" is selected */}
        {billingCycle?.code === "CUSTOM" &&
          renderLabelPair(
            "Enter the days to generate the bills",
            <TextInput
              name="customDays"
              value={customDays}
              onChange={(event) => setCustomDays(event.target.value)}
              placeholder={t("Enter number of days")}
            />
          )}
      </Card>

      <Card>
        <HeaderComponent>{t("Setup role wages")}</HeaderComponent>
        <CardText>{t("for each role for a campaign. Workers will be paid based on the number of days worked.")}</CardText>
        <RoleWageTable />
      </Card>

      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "12rem" }}
          variation="primary"
          label={t("SUBMIT")}
          title={t("SUBMIT")}
          onClick={() => {
            console.log({
              selectedCampaign,
              billingCycle,
              customDays,
            });

            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
              message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
              showFooter:false
            });
          }}
          icon={"ArrowForward"}
          isSuffix
        />
      </ActionBar>
    </div>
  );
};

export default PaymentSetUpPage;
