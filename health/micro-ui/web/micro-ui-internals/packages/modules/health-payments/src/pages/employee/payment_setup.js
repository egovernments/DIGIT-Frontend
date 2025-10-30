import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Card, LabelFieldPair, Dropdown, CardText, HeaderComponent, TextInput, Button, Loader } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import RoleWageTable from "../../components/payment_setup/wageTable";

export const HCM_BILLING_CONFIG_PAYMENT_SETUP = "HCM-BILLING-CONFIG-PAYMENT-SETUP";

const PaymentSetUpPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [billingCycle, setBillingCycle] = useState(null);
  const [customDays, setCustomDays] = useState("");

  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeskills";

  const { data: BillingCycles, isLoading: loading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    HCM_BILLING_CONFIG_PAYMENT_SETUP,
    [{ name: BillingCycle }],
    {
      select: (MdmsRes) => {
        const billingCycles = MdmsRes?.["HCM-BILLING-CONFIG-PAYMENT-SETUP"]?.BillingCycle || [];
        // Sort by order (ascending)
        return billingCycles.sort((a, b) => a.order - b.order);
      },
    },
    { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.BillingCycle` }
  );

  // based on the campaign selection, need to call mdms to fetch the skillls types

  const { data: SkillsData, isLoading: SkillLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    HCM_BILLING_CONFIG_PAYMENT_SETUP,
    [{ name: CampaignTypeskills }],
    {
      select: (MdmsRes) => {
        // const billingCycles = MdmsRes?.["HCM-BILLING-CONFIG-PAYMENT-SETUP"]?.BillingCycle || [];
        // Sort by order (ascending)
        return MdmsRes;
      },
    },
    { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.CampaignTypeskills` }
  );


  console.log(SkillsData)

  // Memoize billing cycle options to prevent unnecessary re-renders
  const billingCycleOptions = useMemo(() => {
    if (!BillingCycles || BillingCycles.length === 0) {
      return [];
    }

    // Transform MDMS data to dropdown format
    return BillingCycles.map((cycle) => ({
      code: cycle.code,
      name: cycle.name || cycle.code, // Fallback to code if name not available
      ...cycle, // Spread other properties if needed
    }));
  }, [BillingCycles]);

  // Memoize campaign options (replace with actual campaign data when available)
  const campaignOptions = useMemo(() => {
    return [{ code: "1", name: "USUSU" }];
  }, []);

  // Memoized callback for campaign selection
  const handleCampaignSelect = useCallback((value) => {
    setSelectedCampaign(value);
  }, []);

  // Memoized callback for billing cycle selection
  const handleBillingCycleSelect = useCallback((value) => {
    setBillingCycle(value);
    // Clear custom days if not custom billing cycle
    if (value?.code !== "CUSTOM") {
      setCustomDays("");
    }
  }, []);

  // Memoized callback for custom days input
  const handleCustomDaysChange = useCallback((event) => {
    const value = event.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setCustomDays(value);
    }
  }, []);

  // Memoized callback for form submission
  const handleSubmit = useCallback(() => {
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
      showFooter: false,
    });
  }, [selectedCampaign, billingCycle, customDays, history, t]);

  const renderLabelPair = useCallback(
    (heading, content) => (
      <div className="label-pair" style={{ alignContent: "center", alignItems: "center" }}>
        <span className="view-label-heading">{t(heading)}</span>
        <span className="view-label-text">{content}</span>
      </div>
    ),
    [t]
  );

  // Show loading state
  if (loading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

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
            option={campaignOptions}
            optionKey="code"
            selected={selectedCampaign}
            select={handleCampaignSelect}
          />
        )}

        {/* Billing Cycle Dropdown */}
        {renderLabelPair(
          "Billing cycle",
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={billingCycleOptions}
            optionKey="code"
            selected={billingCycle}
            select={handleBillingCycleSelect}
            disabled={loading || billingCycleOptions.length === 0}
          />
        )}

        {/* Show TextInput only if "Custom" is selected */}
        {billingCycle?.code === "CUSTOM" &&
          renderLabelPair(
            "Enter the days to generate the bills",
            <TextInput
              name="customDays"
              value={customDays}
              onChange={handleCustomDaysChange}
              placeholder={t("Enter number of days")}
              type="text"
              inputMode="numeric"
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
          onClick={handleSubmit}
          icon={"ArrowForward"}
          isSuffix
          disabled={!selectedCampaign || !billingCycle || (billingCycle?.code === "CUSTOM" && !customDays)}
        />
      </ActionBar>
    </div>
  );
};

export default PaymentSetUpPage;
