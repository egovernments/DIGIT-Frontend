// ============================================
// PaymentSetUpPage.jsx
// ============================================
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Card, LabelFieldPair, Dropdown, CardText, HeaderComponent, TextInput, Button, Loader } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import RoleWageTable from "../../components/payment_setup/wageTable";
import ProjectService from "../../services/project/ProjectService";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import ActionPopUp from "../../components/payment_setup/AlertStatus";

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
  const [billingConfigData, setBillingConfigData] = useState(null);

  const [edit, setEdit] = useState(false);
  const [update, setUpdate] = useState(false);

  // for opening the popup screen
  const [popup, setPopUp] = useState(false);

  const [loading, setLoading] = useState(false);

  // Constants
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeskills";

  const { mutate: createBillConfig } = Digit.Hooks.payments.usePaymentSetUpForCampaign(tenantId);
  const { mutate: updateBillConfig } = Digit.Hooks.payments.usePaymentSetUpForCampaignUpdate(tenantId);
  const { mutate: mDMSRatesCreate } = Digit.Hooks.payments.useMDMSRatesCreate(tenantId);
  const { mutate: mDMSRatesUpdate } = Digit.Hooks.payments.useMDMSRatesUpdate(tenantId);

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
            limit: 20,
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
        startDate: item?.startDate,
        endDate: item?.endDate,
        campaignNumber: item?.campaignNumber,
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

  // Fetch Default Skills Data from MDMS
  const fetchDefaultSkillsData = useCallback(
    async (projectType) => {
      if (!projectType) return null;

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
        const skillsArray = response?.MdmsRes?.[HCM_BILLING_CONFIG_PAYMENT_SETUP]?.[CampaignTypeskills] || [];
        const matchingSkills = skillsArray.find((skill) => skill.campaignType === projectType);

        return matchingSkills || null;
      } catch (error) {
        return null;
      }
    },
    [tenantId, CampaignTypeskills]
  );

  // Fetch User-Configured Rates from MDMS v2
  const fetchUserConfiguredRates = useCallback(
    async (campaignId) => {
      if (!campaignId) return null;

      try {
        const body = {
          MdmsCriteria: {
            tenantId: tenantId,

            schemaCode: "HCM.WORKER_RATES",
            filters: {
              //"c408d5b8-7178-4793-ab7b-7f38b099ec42"
              campaignId: campaignId,
            },
          },
        };

        const response = await PaymentSetUpService.mdmsSkillWageRatesSearch({ body: body });

        if (response && response.length > 0) {
          return response[0]; // Return the first matching rate configuration
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    [tenantId, selectedCampaign]
  );

  // Helper: Merge user-configured rates with default MDMS skills
  const mergeUserConfiguredRates = (defaultSkillsData, userRatesData) => {
    if (!defaultSkillsData || !defaultSkillsData.skills) return null;

    //  If userRatesData is null or empty → return defaultSkillsData as-is
    const userRates = userRatesData?.data?.rates;
    if (!userRates || userRates.length === 0) {
      return {
        ...defaultSkillsData,
        skills: defaultSkillsData.skills,
        rateBreakupSchema: defaultSkillsData.rateBreakupSchema,
        existingRatesData: null,
      };
    }

    // Merge user-configured rates into default skills
    const mergedSkills = defaultSkillsData.skills.map((skill) => {
      const userRate = userRates.find((r) => r.skillCode === skill.code);
      return {
        ...skill,
        rateBreakup: userRate?.rateBreakup || skill.rateBreakup || {},
      };
    });

    if (userRatesData) {
      setEdit(true);
    }

    return {
      ...defaultSkillsData,
      skills: mergedSkills,
      rateBreakupSchema: defaultSkillsData.rateBreakupSchema,
      existingRatesData: userRatesData ? userRatesData : null,
    };
  };

  // Main Campaign Selection Handler with Sequential API Calls
  const handleCampaignSelect = useCallback(
    async (value) => {
      setSelectedCampaign(value);
      setSkillsData(null);
      setBillingConfigData(null);
      setLoadingSkills(true);

      if (!value?.projectId || !value?.projectType) {
        setLoadingSkills(false);
        return;
      }

      try {
        // Step 1: Call Billing Config Search API
        const billingConfigBody = {
          searchCriteria: {
            tenantId: tenantId,
            campaignNumber: value.campaignNumber,
            includePeriods: true,
          },
        };

        const billingConfigResponse = await PaymentSetUpService.billingConfigSearchByProjectId({
          body: billingConfigBody,
        });

        // Check if billing config data exists
        if (billingConfigResponse && billingConfigResponse?.periods.length > 0) {
          const cy = billingCycleOptions.find((x) => x.code === billingConfigResponse?.billingConfig?.billingFrequency) || null;

          setBillingCycle(cy);

          setBillingConfigData(billingConfigResponse?.billingFrequency);

          // start
          // Step 2: Fetch default MDMS skills
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);

          // Step 3: Fetch user-configured rates
          const userRatesData = await fetchUserConfiguredRates(value.projectId);

          // Step 4: Merge both (if user rates exist)
          const finalSkillsData =
            userRatesData && userRatesData.data?.rates?.length > 0 ? mergeUserConfiguredRates(defaultSkills, userRatesData) : defaultSkills;

          setSkillsData(finalSkillsData);
        }

        // end
        else {
          setEdit(false);
          setUpdate(false);
          setBillingCycle(null);
          // Step 5: If no billing config, call default MDMS skills API
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);
          setSkillsData(defaultSkills);
        }
      } catch (error) {
        // Fallback: Try to fetch default skills data on error
        try {
          setEdit(false);
          setUpdate(false);
          setBillingCycle(null);
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);
          setSkillsData(defaultSkills);
        } catch (fallbackError) {
          setSkillsData(null);
        }
      } finally {
        setLoadingSkills(false);
      }
    },
    [tenantId, fetchUserConfiguredRates, fetchDefaultSkillsData, edit]
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

  // Billing Cycle Selection Handler
  const handleBillingCycleSelect = useCallback((value) => {
    setBillingCycle(value);
    if (value?.code !== "CUSTOM") {
      setCustomDays("");
    }
  }, []);

  // Custom Days Input Handler
  const handleCustomDaysChange = useCallback((event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomDays(value);
    }
  }, []);

  //INFO:: create mdms rates
  const createRates = async () => {
    try {
      await mDMSRatesCreate(
        { Mdms: wagePayload.Mdms },
        {
          onError: (error) => {
            history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
              state: "error",
              info: "",
              fileName: "",
              description: "",
              message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
          onSuccess: (responseData) => {
            //  Navigate to success screen
            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: t("HCM_AM_PAYMENT_SETUP_DESC_SUCCESS"),
              message: t("HCM_AM_PAYMENT_SETUP_HEADER_SUCCESS"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
        }
      );
    } catch (err) {
      history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
        state: "error",
        info: "",
        fileName: "",
        description: "",
        message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
        back: t("GO_BACK_TO_HOME"),
        backlink: `/${window.contextPath}/employee`,
        showFooter: false,
      });
    }
  };

  //INFO:: update mdms rates
  const updateRates = async () => {
    try {
      await mDMSRatesUpdate(
        { Mdms: wagePayload.Mdms },
        {
          onError: (error) => {
            history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
              state: "error",
              info: "",
              fileName: "",
              description: "",
              message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
          onSuccess: (responseData) => {
            //  Navigate to success screen
            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: t("HCM_AM_PAYMENT_SETUP_DESC_SUCCESS"),
              message: t("HCM_AM_PAYMENT_SETUP_UPDATE_HEADER_SUCCESS"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
        }
      );
    } catch (err) {
      history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
        state: "error",
        info: "",
        fileName: "",
        description: "",
        message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
        back: t("GO_BACK_TO_HOME"),
        backlink: `/${window.contextPath}/employee`,
        showFooter: false,
      });
    }
  };

  // Form Submission Handler
  const handleSubmit = useCallback(async () => {
    console.log({
      selectedCampaign,
      billingCycle,
      customDays,
      campaignData: skillsData,
      billingConfig: billingConfigData,
      wageData: wagePayload,
    });

    try {
      //  Call the billing config creation first

      if (update) {
        const billingConfig = {
          tenantId: tenantId,
          campaignNumber: selectedCampaign?.campaignNumber,
          billingFrequency: billingCycle?.code,
          projectStartDate: selectedCampaign?.startDate,
          projectEndDate: selectedCampaign?.endDate,
          status: "ACTIVE",
          createdBy: Digit.UserService.getUser().info.uuid,
          projectId: selectedCampaign?.projectId,
          id: billingCycle?.id,
          ...(billingCycle?.code === "CUSTOM" && { customFrequencyDays: customDays }),
        };
        await updateBillConfig(
          { billingConfig },
          {
            onError: (error) => {
              history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
                state: "error",
                info: "",
                fileName: "",
                description: "",
                message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
                back: t("GO_BACK_TO_HOME"),
                backlink: `/${window.contextPath}/employee`,
                showFooter: false,
              });
            },
            onSuccess: async (responseData) => {
              //  Only after billingConfig succeeds, create MDMS Rates

              if (skillsData.existingRatesData != null) {
                await updateRates();
              } else {
                await createRates();
              }
            },
          }
        );
      } else {
        const billingConfig = {
          tenantId: tenantId,
          campaignNumber: selectedCampaign?.campaignNumber,
          billingFrequency: billingCycle?.code,
          projectStartDate: selectedCampaign?.startDate,
          projectEndDate: selectedCampaign?.endDate,
          status: "ACTIVE",
          createdBy: Digit.UserService.getUser().info.uuid,
          projectId: selectedCampaign?.projectId,
          //id: billingCycle?.id,
          ...(billingCycle?.code === "CUSTOM" && { customFrequencyDays: customDays }),
        };
        await createBillConfig(
          { billingConfig },
          {
            onError: (error) => {
              history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
                state: "error",
                info: "",
                fileName: "",
                description: "",
                message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
                back: t("GO_BACK_TO_HOME"),
                backlink: `/${window.contextPath}/employee`,
                showFooter: false,
              });
            },
            onSuccess: async (responseData) => {
              //  Only after billingConfig succeeds, create MDMS Rates

              if (skillsData.existingRatesData != null) {
                await updateRates();
              } else {
                await createRates();
              }
            },
          }
        );
      }
    } catch (err) {
      history.push(`/${window.contextPath}/employee/payments/payment-setup-failed`, {
        state: "error",
        info: "",
        fileName: "",
        description: "",
        message: t("HCM_AM_PAYMENT_SETUP_HEADER_ERROR"),
        back: t("GO_BACK_TO_HOME"),
        backlink: `/${window.contextPath}/employee`,
        showFooter: false,
      });
    }
  }, [update, selectedCampaign, billingCycle, customDays, skillsData, billingConfigData, wagePayload, history, t]);

  // Render Label Pair Helper
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

  // Show loading state
  if (loadingBilling || isCampaignLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  if (loading) {
    return <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />;
  }

  return (
    <div>
      {/* Payment Setup Card */}
      <Card type="primary" className="bottom-gap-card-payment">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HeaderComponent>{t("HCM_AM_PAYEMENT_SETUP_HEAD")}</HeaderComponent>
          <Button
            label={t("HCM_AM_PAYEMENT_SETUP_VIEW_AUDIT")}
            onButtonClick={(e) => {
              e.stopPropagation();
            }}
            variation="link"
            style={{ whiteSpace: "nowrap", width: "auto" }}
          />
        </div>

        <CardText>{t("HCM_AM_PAYEMENT_SETUP_SUB_HEAD")}</CardText>

        {/* Campaign Dropdown */}
        {renderLabelPair(
          "HCM_AM_PAYEMENT_SELECT_CAMPAIGN_LABEL",
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
          "HCM_AM_PAYEMENT_SELECT_BILLING_CYCLE_LABEL",
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={billingCycleOptions}
            optionKey="code"
            selected={billingCycle}
            select={handleBillingCycleSelect}
            disabled={edit || loadingBilling || billingCycleOptions.length === 0}
          />
        )}

        {/* Custom Days Input */}
        {billingCycle?.code === "CUSTOM" &&
          renderLabelPair(
            "HCM_AM_PAYEMENT_SELECT_BILLING_CYCLE_CUSTOM_LABEL",
            <TextInput
              name="customDays"
              value={customDays}
              onChange={handleCustomDaysChange}
              placeholder={t("HCM_AM_PAYEMENT_SELECT_BILLING_CYCLE_CUSTOM_NO_DAYS")}
              type="text"
              inputMode="numeric"
            />
          )}
      </Card>

      {/* Role Wages Setup Card */}
      <Card>
        <HeaderComponent>{t("HCM_AM_PAYEMENT_SETUP_WAGE_ROLE_HEAD")}</HeaderComponent>
        <CardText>{t("HCM_AM_PAYEMENT_SETUP_WAGE_ROLE_SUB_HEAD")}</CardText>

        {/* Conditional Rendering */}
        {loadingSkills ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Loader className={"digit-center-loader"} />
          </div>
        ) : skillsData ? (
          <RoleWageTable
            disabled={edit ? true : false}
            skills={skillsData.skills}
            rateBreakupSchema={skillsData.rateBreakupSchema}
            onDataChange={handleWageDataChange}
            campaignId={selectedCampaign?.projectId}
            campaignName={selectedCampaign?.name}
            existingRatesData={skillsData ? skillsData.existingRatesData : null}
          />
        ) : selectedCampaign ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("HCM_AM_PAYEMENT_SETUP_WAGE_ROLE_ERR_NO_SKILL")}</div>
        ) : (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("HCM_AM_PAYEMENT_SETUP_WAGE_ROLE_INFO_SELECT_CAMPAIGN")}</div>
        )}
      </Card>

      {/* Action Bar */}
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "12rem" }}
          variation="primary"
          label={edit ? t("HCM_AM_BTN_EDIT") : update ? t("HCM_AM_BTN_UPDATE") : t("HCM_AM_BTN_SUBMIT")}
          title={edit ? t("HCM_AM_BTN_EDIT") : update ? t("HCM_AM_BTN_UPDATE") : t("HCM_AM_BTN_SUBMIT")}
          onClick={() => {
            if (edit) {
              // setEdit(false);
              // setUpdate(true);

              // Step 1: show loader
              setLoading(true);

              // Step 2: wait 500ms, then update states
              setTimeout(() => {
                setEdit(false);
                setUpdate(true);

                // Step 3: hide loader after state updates
                setLoading(false);
              }, 500);
            } else {
              setPopUp(true);
            }
          }}
          icon={"ArrowForward"}
          isSuffix
          isDisabled={!selectedCampaign || !billingCycle || (billingCycle?.code === "CUSTOM" && !customDays) || !skillsData}
        />
      </ActionBar>
      {popup && (
        <ActionPopUp
          headingMsg={t("HCM_AM_PAYMENT_SETUP_CONFIRM_ALERT_HEADER")}
          description={t("HCM_AM_PAYMENT_SETUP_CONFIRM_ALERT_CREATE_DES")}
          onSubmit={handleSubmit}
          onClose={() => {
            setPopUp(false);
          }}
        />
      )}
    </div>
  );
};

export default PaymentSetUpPage;
