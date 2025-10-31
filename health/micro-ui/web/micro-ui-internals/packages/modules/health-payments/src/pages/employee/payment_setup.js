import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Card, LabelFieldPair, Dropdown, CardText, HeaderComponent, TextInput, Button, Loader } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import RoleWageTable from "../../components/payment_setup/wageTable";
import ProjectService from "../../services/project/ProjectService";

export const HCM_BILLING_CONFIG_PAYMENT_SETUP = "HCM-BILLING-CONFIG-PAYMENT-SETUP";

const PaymentSetUpPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  // State Management
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [billingCycle, setBillingCycle] = useState(null);
  const [customDays, setCustomDays] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [skillsData, setSkillsData] = useState(null);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [wagePayload, setWagePayload] = useState(null);

  // Constants
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeskills";

  // Campaign Search Configuration
  const CampaignSearchCri = useMemo(
    () => ({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId,
          status: ["creating", "created"],
          isLikeSearch: true,
          isOverrideDatesFromProject: true,
          createdBy: Digit.UserService.getUser().info.uuid,
          campaignsIncludeDates: false,
          startDate: new Date().getTime(),
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

  // Fetch Campaign Data using Custom Hook
  const { isLoading: isCampaignLoading, data: CampaignData } = Digit.Hooks.useCustomAPIHook(CampaignSearchCri);

  // Process Campaign Data into dropdown options
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

  // Fetch Billing Cycles from MDMS
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

  // Fetch Skills Data via Direct API Call (No Hook)
  const fetchSkillsData = useCallback(
    async (projectType) => {
      if (!projectType) return;

      setLoadingSkills(true);
      try {
        const body = {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              {
                moduleName: HCM_BILLING_CONFIG_PAYMENT_SETUP,
                masterDetails: [
                  {
                    name: CampaignTypeskills,
                    filter: `[?(@.campaignType=='${projectType}')]`,
                  },
                ],
              },
            ],
          },
        };

        const response = await ProjectService.mdmsSkillWageSearch({ body: body });

        // Extract skills data from response
        const skillsArray = response?.MdmsRes?.[HCM_BILLING_CONFIG_PAYMENT_SETUP]?.[CampaignTypeskills] || [];

        // Find matching skills for the selected campaign type
        const matchingSkills = skillsArray.find((skill) => skill.campaignType === projectType);

        setSkillsData(matchingSkills || null);
      } catch (error) {
        console.error("Error fetching skills data:", error);
        setSkillsData(null);
      } finally {
        setLoadingSkills(false);
      }
    },
    [tenantId, CampaignTypeskills]
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

  // Campaign Selection Handler - Triggers MDMS API Call
  const handleCampaignSelect = useCallback(
    (value) => {
      setSelectedCampaign(value);

      // Clear previous skills data
      setSkillsData(null);

      // Fetch skills data when campaign is selected
      if (value?.projectType) {
        fetchSkillsData(value.projectType);
      }
    },
    [fetchSkillsData]
  );

  // Billing Cycle Selection Handler
  const handleBillingCycleSelect = useCallback((value) => {
    setBillingCycle(value);
    if (value?.code !== "CUSTOM") {
      setCustomDays("");
    }
  }, []);

  // Custom Days Input Handler - Only allows numeric input
  const handleCustomDaysChange = useCallback((event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomDays(value);
    }
  }, []);

  // Form Submission Handler
  const handleSubmit = useCallback(() => {
    console.log({
      selectedCampaign,
      billingCycle,
      customDays,
      campaignData: skillsData,
    });

    // Navigate to success page
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
  }, [selectedCampaign, billingCycle, customDays, skillsData, history, t]);

  // Render Label Pair Helper Function
  const renderLabelPair = useCallback(
    (heading, content) => (
      <div className="label-pair" style={{ alignContent: "center", alignItems: "center" }}>
        <span className="view-label-heading">{t(heading)}</span>
        <span className="view-label-text">{content}</span>
      </div>
    ),
    [t]
  );

  // Handle wage table data changes
  const handleWageDataChange = useCallback((payload) => {
    setWagePayload(payload);
  }, []);

  // Show loading state for initial data fetch
  if (loadingBilling || isCampaignLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <div>
      {/* Payment Setup Card */}
      <Card type="primary" className="bottom-gap-card-payment">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HeaderComponent>{t("Caption Setup payment for campaign")}</HeaderComponent>
          <Button
            label={"View audit logs"}
            onButtonClick={(e) => {
              e.stopPropagation();
            }}
            variation="link"
            style={{ whiteSpace: "nowrap", width: "auto" }}
          />
        </div>

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

        {/* Custom Days Input - Only shown when CUSTOM billing cycle is selected */}
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

      {/* Role Wages Setup Card */}
      <Card>
        <HeaderComponent>{t("Setup role wages")}</HeaderComponent>
        <CardText>{t("for each role for a campaign. Workers will be paid based on the number of days worked.")}</CardText>

        {/* Conditional Rendering based on loading and data state */}
        {loadingSkills ? (
          <div>
            <Loader className={"digit-center-loader"} />
          </div>
        ) : skillsData ? (
          <RoleWageTable
            skills={skillsData.skills}
            rateBreakupSchema={skillsData.rateBreakupSchema}
            onDataChange={handleWageDataChange}
            campaignId={selectedCampaign?.code}
            campaignName={selectedCampaign?.name}
          />
        ) : selectedCampaign ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("No skills data available for this campaign type")}</div>
        ) : (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("Please select a campaign to view roles and wages")}</div>
        )}
      </Card>

      {/* Action Bar with Submit Button */}
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
