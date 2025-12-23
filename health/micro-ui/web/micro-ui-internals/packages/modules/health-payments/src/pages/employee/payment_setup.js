import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import {
  Card,
  LabelFieldPair,
  Dropdown,
  CardText,
  HeaderComponent,
  TextInput,
  Button,
  Loader,
  NoResultsFound,
} from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import RoleWageTable from "../../components/payment_setup/wageTable";
import ProjectService from "../../services/project/ProjectService";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import ActionPopUp from "../../components/payment_setup/AlertStatus";

export const HCM_BILLING_CONFIG_PAYMENT_SETUP = "HCM-BILLING-CONFIG-PAYMENT-SETUP";

// Store state outside component to persist across remounts WITHIN the same page session
let cachedState = {
  selectedCampaign: null,
  billingCycle: null,
  customDays: "",
  skillsData: null,
  edit: false,
  update: false,
  wagePayload: null,
  billingConfigData: null,
};

// Function to reset cache
const resetCache = () => {
  cachedState = {
    selectedCampaign: null,
    billingCycle: null,
    customDays: "",
    skillsData: null,
    edit: false,
    update: false,
    wagePayload: null,
    billingConfigData: null,
  };
};

const PaymentSetUpPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  // Always reset cache on mount (first load or returning to page)
  // This must happen before state initialization
  if (!window.__paymentSetupMounted) {
    resetCache();
  }

  // Mark as mounted and setup cleanup
  useEffect(() => {
    window.__paymentSetupMounted = true;

    return () => {
      // Clear flag when unmounting (navigating away)
      delete window.__paymentSetupMounted;
    };
  }, []);

  // State Management - Initialize from cached state
  const [selectedCampaign, setSelectedCampaign] = useState(cachedState.selectedCampaign);
  const [billingCycle, setBillingCycle] = useState(cachedState.billingCycle);
  const [customDays, setCustomDays] = useState(cachedState.customDays);
  const [projectOptions, setProjectOptions] = useState([]);
  const [skillsData, setSkillsData] = useState(cachedState.skillsData);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [wagePayload, setWagePayload] = useState(cachedState.wagePayload);
  const [billingConfigData, setBillingConfigData] = useState(cachedState.billingConfigData);

  const [edit, setEdit] = useState(cachedState.edit);
  const [update, setUpdate] = useState(cachedState.update);

  // for opening the popup screen
  const [popup, setPopUp] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tableError, setTableError] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);

  // Update cached state whenever state changes (only while mounted)
  useEffect(() => {
    cachedState = {
      selectedCampaign,
      billingCycle,
      customDays,
      skillsData,
      edit,
      update,
      wagePayload,
      billingConfigData,
    };
  }, [selectedCampaign, billingCycle, customDays, skillsData, edit, update, wagePayload, billingConfigData]);

  // Constants
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeSkills";

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
          status: ["created"],
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
        cacheTime: Infinity, // Keep in cache forever
        staleTime: Infinity, // Never consider stale
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
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
    } else if (!isCampaignLoading) {
      setProjectOptions([]);
    }
  }, [CampaignData, isCampaignLoading]);

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
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
    { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.BillingCycle` }
  );

  // Memoize billing cycle options BEFORE using it in callbacks
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

  // Fetch Default Skills Data from MDMS - STABLE CALLBACK
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
    [tenantId]
  );

  // Fetch User-Configured Rates from MDMS v2 - STABLE CALLBACK
  const fetchUserConfiguredRates = useCallback(
    async (campaignId) => {
      if (!campaignId) return null;

      try {
        const body = {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "HCM.WORKER_RATES",
            filters: {
              campaignId: campaignId,
            },
          },
        };

        const response = await PaymentSetUpService.mdmsSkillWageRatesSearch({ body: body });

        if (response && response.length > 0) {
          return response[0];
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    [tenantId]
  );

  // Helper: Merge user-configured rates with default MDMS skills - MEMOIZED
  const mergeUserConfiguredRates = useCallback((defaultSkillsData, userRatesData) => {
    if (!defaultSkillsData || !defaultSkillsData.skills) return null;

    const userRates = userRatesData?.data?.rates;
    if (!userRates || userRates.length === 0) {
      return {
        ...defaultSkillsData,
        skills: defaultSkillsData.skills,
        rateBreakupSchema: defaultSkillsData.rateBreakupSchema,
        rateMaxLimitSchema: defaultSkillsData.rateMaxLimitSchema,

        existingRatesData: null,
      };
    }

    const mergedSkills = defaultSkillsData.skills.map((skill) => {
      const userRate = userRates.find((r) => r.skillCode === skill.code);
      return {
        ...skill,
        rateBreakup: userRate?.rateBreakup || skill.rateBreakup || {},
      };
    });

    return {
      ...defaultSkillsData,
      skills: mergedSkills,
      rateBreakupSchema: defaultSkillsData.rateBreakupSchema,
      rateMaxLimitSchema: defaultSkillsData.rateMaxLimitSchema,
      existingRatesData: userRatesData ? userRatesData : null,
    };
  }, []);

  // Main Campaign Selection Handler with Sequential API Calls - FIXED DEPENDENCIES
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
        if (billingConfigResponse && billingConfigResponse?.periods?.length > 0) {
          const cy = billingCycleOptions.find((x) => x.code === billingConfigResponse?.billingConfig?.billingFrequency) || null;

          setBillingCycle(cy);

          setBillingConfigData(billingConfigResponse?.billingConfig);
          setCustomDays(String(billingConfigResponse?.billingConfig?.customFrequencyDays || 3));

          // Step 2: Fetch default MDMS skills
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);

          // Step 3: Fetch user-configured rates
          const userRatesData = await fetchUserConfiguredRates(value.projectId);

          // Step 4: Merge both (if user rates exist)
          const finalSkillsData = mergeUserConfiguredRates(defaultSkills, userRatesData);

          // Set edit state if user rates exist
          if (userRatesData?.data?.rates?.length > 0) {
            // INFO :: with edit button feature
            //setEdit(true);

            setEdit(false);
            setUpdate(true);
          }

          setSkillsData(finalSkillsData);
        } else {
          // No billing config found
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
    [tenantId, fetchUserConfiguredRates, fetchDefaultSkillsData, mergeUserConfiguredRates, billingCycleOptions]
  );

  // Derived flag: check if selected campaign already started
  const isCampaignStarted = useMemo(() => {
    if (!selectedCampaign?.startDate) return false;
    const now = new Date().getTime();
    return now >= selectedCampaign.startDate;
  }, [selectedCampaign]);

  // Billing Cycle Selection Handler
  const handleBillingCycleSelect = useCallback((value) => {
    setBillingCycle(value);
    setIsFormModified(true);
    if (value?.code !== "CUSTOM") {
      setCustomDays("");
    }
  }, []);

  // Custom Days Input Handler
  const handleCustomDaysChange = useCallback((event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomDays(value);
      setIsFormModified(true);
    }
  }, []);

  //INFO:: create mdms rates
  const createRates = useCallback(async () => {
    try {
      await mDMSRatesCreate(
        { Mdms: wagePayload.Mdms },
        {
          onError: (error) => {
            setLoading(false);
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
            setLoading(false);
            const camData = `<strong>${selectedCampaign?.name}</strong>`;
            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: `${t("HCM_AM_PAYMENT_SETUP_DESC_SUCCESS_PART_1")} ${camData}. ${t(
                "HCM_AM_PAYMENT_SETUP_DESC_SUCCESS_PART_2"
              )}`,
              message: t("HCM_AM_PAYMENT_SETUP_HEADER_SUCCESS"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
        }
      );
    } catch (err) {
      setLoading(false);
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
  }, [mDMSRatesCreate, wagePayload, history, t, selectedCampaign]);

  //INFO:: update mdms rates
  const updateRates = useCallback(async () => {
    try {
      await mDMSRatesUpdate(
        { Mdms: wagePayload.Mdms },
        {
          onError: (error) => {
            setLoading(false);
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
            setLoading(false);
            const camData = `<strong>${selectedCampaign?.name}</strong>`;
            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: `${t("HCM_AM_PAYMENT_SETUP_DESC_SUCCESS_PART_1")} ${camData}. ${t(
                "HCM_AM_PAYMENT_SETUP_DESC_SUCCESS_PART_2"
              )}`,
              message: t("HCM_AM_PAYMENT_SETUP_UPDATE_HEADER_SUCCESS"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
        }
      );
    } catch (err) {
      setLoading(false);
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
  }, [mDMSRatesUpdate, wagePayload, history, t, selectedCampaign]);

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
    setLoading(true);
    try {
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
          id: billingConfigData?.id,
          ...(billingCycle?.code === "CUSTOM" && { customFrequencyDays: customDays }),
        };

        await updateBillConfig(
          { billingConfig },
          {
            onError: (error) => {
              setLoading(false);
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
  }, [
    update,
    selectedCampaign,
    billingCycle,
    customDays,
    skillsData,
    billingConfigData,
    wagePayload,
    tenantId,
    updateBillConfig,
    createBillConfig,
    updateRates,
    createRates,
    history,
    t,
  ]);

  // Render Label Pair Helper
  const renderLabelPair = useCallback(
    (heading, content) => (
      <div className="label-pair" style={{ alignContent: "center", alignItems: "center" }}>
        <span className="view-label-heading comment-label">
          {t(heading)}
          <span className="required comment-label"> *</span>
        </span>
        <span className="view-label-text">{content}</span>
      </div>
    ),
    [t]
  );

  // Handle wage table data changes
  const handleWageDataChange = useCallback(({ payload, errorFlag, isFormModified }) => {
    setWagePayload(payload);
    setIsFormModified(isFormModified);
    setTableError(errorFlag);
  }, []);

  // Handle Edit Button Click
  const handleEditClick = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setEdit(false);
      setUpdate(true);
      setLoading(false);
    }, 500);
  }, []);

  // Handle Primary Button Click
  const handlePrimaryButtonClick = useCallback(() => {
    if (isCampaignStarted) {
      history.push(`/${window.contextPath}/employee`);
      return;
    }

    //INFO :: for edit functionality
    // if (edit) {
    //   handleEditClick();
    // } else {
    //setPopUp(true);
    //}

    setPopUp(true);
  }, [isCampaignStarted, edit, history, handleEditClick]);

  // Show loading state
  if (loadingBilling || isCampaignLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  if (loading) {
    return <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />;
  }

  if (!CampaignData || CampaignData?.CampaignDetails?.length === 0) {
    return (
      <div>
        <Card type="primary" className="bottom-gap-card-payment">
          <NoResultsFound style={{ height: "35rem" }} text={t(`HCM_AM_NO_UPCOMING_CAMPAIGN_FOUND`)} />
        </Card>

        {/* Action Bar */}
        <ActionBar className="mc_back">
          <Button
            style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "14rem" }}
            variation="primary"
            label={t("GO_BACK_TO_HOME")}
            title={t("GO_BACK_TO_HOME")}
            onClick={() => {
              history.push(`/${window.contextPath}/employee`);
              return;
            }}
            icon={"ArrowBack"}
            isSuffix={false}
            isDisabled={false}
          />
        </ActionBar>
      </div>
    );
  }

  return (
    <div>
      {/* Payment Setup Card */}
      <Card type="primary" className="bottom-gap-card-payment">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HeaderComponent>
            <span style={{ color: "#0B4B66", fontWeight: "inherit" }}>{t("HCM_AM_PAYEMENT_SETUP_HEAD")}</span>
          </HeaderComponent>
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
            <div>
            <TextInput
              name="customDays"
              value={customDays}
              onChange={handleCustomDaysChange}
              placeholder={t("HCM_AM_PAYEMENT_SELECT_BILLING_CYCLE_CUSTOM_NO_DAYS")}
              type="text"
              inputMode="numeric"
              disabled={edit ? true : false}
              allowNegativeValues={false}
              min={billingCycle.minDuration}
              max={billingCycle.maxDuration}
            />
            {billingCycle?.code === "CUSTOM" && customDays!=""&& Number(customDays) < Number(billingCycle.minDuration) && <span style={{ color: "red", fontSize: "0.8rem" }}>{`${t("HCM_AM_MINIMUM_BILLING_CYCLE_DURATION")} ${billingCycle.minDuration}${t("HCM_AM_DAYS")}`}</span>}
            </div>
          )}
      </Card>

      {/* Role Wages Setup Card */}
      {selectedCampaign ? (
        <Card>
          <HeaderComponent>
            {" "}
            <span style={{ color: "#0B4B66", fontWeight: "inherit" }}>{t("HCM_AM_PAYEMENT_SETUP_WAGE_ROLE_HEAD")}</span>
          </HeaderComponent>
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
              rateMaxLimitSchema={skillsData.rateMaxLimitSchema}
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
      ) : (
        <div></div>
      )}

      {/* Action Bar */}
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "12rem" }}
          variation="primary"
          label={
            isCampaignStarted
              ? t("GO_BACK_TO_HOME")
              : // edit ? t("HCM_AM_BTN_EDIT") :
              update
              ? t("HCM_AM_BTN_UPDATE")
              : t("HCM_AM_BTN_SUBMIT")
          }
          title={
            isCampaignStarted
              ? t("GO_BACK_TO_HOME")
              : //  edit ? t("HCM_AM_BTN_EDIT") :
              update
              ? t("HCM_AM_BTN_UPDATE")
              : t("HCM_AM_BTN_SUBMIT")
          }
          onClick={handlePrimaryButtonClick}
          icon={edit ? "" : "ArrowForward"}
          isSuffix={edit ? false : true}
          isDisabled={
            !isFormModified || !tableError || !selectedCampaign || !billingCycle || (billingCycle?.code === "CUSTOM" && Number(customDays) < Number(billingCycle.minDuration)) || !skillsData
          }
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
