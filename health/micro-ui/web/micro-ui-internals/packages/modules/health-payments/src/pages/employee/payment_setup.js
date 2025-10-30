import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  const [projectOptions, setProjectOptions] = useState([]);

  const [shouldFetchSkills, setShouldFetchSkills] = useState(false);

  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeskills";

  const CampaignSearchCri = useMemo(
    () => ({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId,
          status: ["creating", "created"],
          isLikeSearch: true,
          isOverrideDatesFromProject: true,
          createdBy: "cfacf16d-2544-4285-9235-3bd29a547186",
          campaignsIncludeDates: false,
          startDate: 1761849000000,
          pagination: {
            sortBy: "createdTime",
            sortOrder: "desc",
            limit: 10,
            offset: 0,
          },
        },
      },
      config: {
        enabled: true,
        select: (data) => data,
      },
    }),
    [tenantId]
  );

  const { isLoading: isCampaignLoading, data: CampaignData } = Digit.Hooks.useCustomAPIHook(CampaignSearchCri);

  useEffect(() => {
    if (CampaignData?.CampaignDetails?.length > 0) {
      const mappedProjects = CampaignData.CampaignDetails.map((item) => ({
        code: item?.id,
        name: item?.campaignName,
        projectType: item?.projectType,
        projectId: item?.projectId,
      }));
      setProjectOptions(mappedProjects);
    } else {
      setProjectOptions([]);
    }
  }, [CampaignData]);

  const { data: BillingCycles, isLoading: loadingBilling } = Digit.Hooks.useCustomMDMS(
    tenantId,
    HCM_BILLING_CONFIG_PAYMENT_SETUP,
    [{ name: BillingCycle }],
    {
      select: (MdmsRes) => {
        const billingCycles = MdmsRes?.["HCM-BILLING-CONFIG-PAYMENT-SETUP"]?.BillingCycle || [];
        return billingCycles.sort((a, b) => a.order - b.order);
      },
    },
    { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.BillingCycle` }
  );

  // CRITICAL: Memoize the projectType to prevent infinite loops
  const selectedProjectType = useMemo(() => {
    debugger
    return selectedCampaign?.projectType || null;
  }, [selectedCampaign?.projectType]);

  // CRITICAL: Memoize the MDMS query array to maintain stable reference
  const skillsMdmsQuery = useMemo(() => {
    if (!selectedProjectType) return [];
    return [{ 
      name: CampaignTypeskills, 
      filter: `[?(@.campaignType=='${selectedProjectType}')]` 
    }];
  }, [selectedProjectType, CampaignTypeskills]);

  // Hook always runs but enabled flag controls API call
  // shouldFetchSkills ensures no initial call until user selects dropdown
  const { data: SkillsData, isLoading: loadingSkills } = Digit.Hooks.useCustomMDMS(
    tenantId,
    HCM_BILLING_CONFIG_PAYMENT_SETUP,
    skillsMdmsQuery,
    {
      enabled: shouldFetchSkills && !!selectedProjectType, // Dual condition prevents initial call
      select: (MdmsRes) => {
        return MdmsRes?.["HCM-BILLING-CONFIG-PAYMENT-SETUP"]?.CampaignTypeskills || [];
      },
    },
    { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.CampaignTypeskills` }
  );

  // Memoize billing cycle options
  const billingCycleOptions = useMemo(() => {
    if (!BillingCycles || BillingCycles.length === 0) {
      return [];
    }
    return BillingCycles.map((cycle) => ({
      code: cycle.code,
      name: cycle.name || cycle.code,
      ...cycle,
    }));
  }, [BillingCycles]);

  // Memoize campaign options
  const campaignOptions = useMemo(() => {
    return projectOptions;
  }, [projectOptions]);

  // Get selected campaign's skills data
  const selectedCampaignData = useMemo(() => {
    if (!selectedCampaign || !SkillsData || SkillsData.length === 0) {
      return null;
    }
    
    // Find the matching skills data for the selected campaign type
    const matchingSkills = SkillsData.find(
      skill => skill.campaignType === selectedCampaign.projectType
    );
    
    return matchingSkills || null;
  }, [selectedCampaign, SkillsData]);

  // Memoized callback for campaign selection
  const handleCampaignSelect = useCallback((value) => {
    setSelectedCampaign(value);
    // Enable API calls only after first dropdown selection
    if (value) {
      setShouldFetchSkills(true);
    }
  }, []);

  // Memoized callback for billing cycle selection
  const handleBillingCycleSelect = useCallback((value) => {
    setBillingCycle(value);
    if (value?.code !== "CUSTOM") {
      setCustomDays("");
    }
  }, []);

  // Memoized callback for custom days input
  const handleCustomDaysChange = useCallback((event) => {
    const value = event.target.value;
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
      campaignData: selectedCampaignData,
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
  }, [selectedCampaign, billingCycle, customDays, selectedCampaignData, history, t]);

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
  if (loadingBilling || isCampaignLoading) {
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
            optionKey="name"
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
            disabled={loadingBilling || billingCycleOptions.length === 0}
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
        {loadingSkills ? (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <Loader />
          </div>
        ) : selectedCampaignData ? (
          <RoleWageTable 
            skills={selectedCampaignData.skills} 
            rateBreakupSchema={selectedCampaignData.rateBreakupSchema} 
          />
        ) : selectedCampaign ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
            {t("No skills data available for this campaign type")}
          </div>
        ) : (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
            {t("Please select a campaign to view roles and wages")}
          </div>
        )}
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



