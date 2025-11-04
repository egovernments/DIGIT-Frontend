// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useLocation, useHistory } from "react-router-dom";
// import { Card, LabelFieldPair, Dropdown, CardText, HeaderComponent, TextInput, Button, Loader } from "@egovernments/digit-ui-components";
// import { ActionBar } from "@egovernments/digit-ui-react-components";
// import RoleWageTable from "../../components/payment_setup/wageTable";
// import ProjectService from "../../services/project/ProjectService";
// import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";

// export const HCM_BILLING_CONFIG_PAYMENT_SETUP = "HCM-BILLING-CONFIG-PAYMENT-SETUP";

// const PaymentSetUpPage = () => {
//   const { t } = useTranslation();
//   const history = useHistory();

//   // State Management
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [billingCycle, setBillingCycle] = useState(null);
//   const [customDays, setCustomDays] = useState("");
//   const [projectOptions, setProjectOptions] = useState([]);
//   const [skillsData, setSkillsData] = useState(null);
//   const [loadingSkills, setLoadingSkills] = useState(false);

//   const [wagePayload, setWagePayload] = useState(null);

//   // Constants
//   const tenantId = Digit?.ULBService?.getCurrentTenantId();
//   const BillingCycle = "BillingCycle";
//   const CampaignTypeskills = "CampaignTypeskills";

//   // Campaign Search Configuration
//   const CampaignSearchCri = useMemo(
//     () => ({
//       url: `/project-factory/v1/project-type/search`,
//       body: {
//         CampaignDetails: {
//           tenantId,
//           status: ["creating", "created"],
//           isLikeSearch: true,
//           isOverrideDatesFromProject: true,
//           createdBy: Digit.UserService.getUser().info.uuid,
//           campaignsIncludeDates: false,
//           startDate: new Date().getTime(),
//           pagination: {
//             sortBy: "createdTime",
//             sortOrder: "desc",
//             limit: 10,
//             offset: 0,
//           },
//         },
//       },
//       config: {
//         enabled: true,
//         select: (data) => data,
//       },
//     }),
//     [tenantId]
//   );

//   // Fetch Campaign Data using Custom Hook
//   const { isLoading: isCampaignLoading, data: CampaignData } = Digit.Hooks.useCustomAPIHook(CampaignSearchCri);

//   // Process Campaign Data into dropdown options
//   useEffect(() => {
//     if (CampaignData?.CampaignDetails?.length > 0) {
//       const mappedProjects = CampaignData.CampaignDetails.map((item) => ({
//         code: item?.id,
//         name: item?.campaignName,
//         projectType: item?.projectType,
//         projectId: item?.projectId,
//       }));
//       setProjectOptions(mappedProjects);
//     } else {
//       setProjectOptions([]);
//     }
//   }, [CampaignData]);

//   // Fetch Billing Cycles from MDMS
//   const { data: BillingCycles, isLoading: loadingBilling } = Digit.Hooks.useCustomMDMS(
//     tenantId,
//     HCM_BILLING_CONFIG_PAYMENT_SETUP,
//     [{ name: BillingCycle }],
//     {
//       select: (MdmsRes) => {
//         const billingCycles = MdmsRes?.["HCM-BILLING-CONFIG-PAYMENT-SETUP"]?.BillingCycle || [];
//         return billingCycles.sort((a, b) => a.order - b.order);
//       },
//     },
//     { schemaCode: `${HCM_BILLING_CONFIG_PAYMENT_SETUP}.BillingCycle` }
//   );

//   // Fetch Skills Data via Direct API Call (No Hook)
//   const fetchSkillsData = useCallback(
//     async (projectType) => {
//       if (!projectType) return;

//       setLoadingSkills(true);
//       try {
//         const body = {
//           MdmsCriteria: {
//             tenantId: tenantId,
//             moduleDetails: [
//               {
//                 moduleName: HCM_BILLING_CONFIG_PAYMENT_SETUP,
//                 masterDetails: [
//                   {
//                     name: CampaignTypeskills,
//                     filter: `[?(@.campaignType=='${projectType}')]`,
//                   },
//                 ],
//               },
//             ],
//           },
//         };

//         const response = await ProjectService.mdmsSkillWageSearch({ body: body });

//         // Extract skills data from response
//         const skillsArray = response?.MdmsRes?.[HCM_BILLING_CONFIG_PAYMENT_SETUP]?.[CampaignTypeskills] || [];

//         // Find matching skills for the selected campaign type
//         const matchingSkills = skillsArray.find((skill) => skill.campaignType === projectType);

//         setSkillsData(matchingSkills || null);
//       } catch (error) {
//         console.error("Error fetching skills data:", error);
//         setSkillsData(null);
//       } finally {
//         setLoadingSkills(false);
//       }
//     },
//     [tenantId, CampaignTypeskills]
//   );

//   // Memoize billing cycle options
//   const billingCycleOptions = useMemo(() => {
//     if (!BillingCycles || BillingCycles.length === 0) {
//       return [];
//     }
//     return BillingCycles.map((cycle) => ({
//       code: cycle.code,
//       name: cycle.name || cycle.code,
//       ...cycle,
//     }));
//   }, [BillingCycles]);

//   // Memoize campaign options
//   const campaignOptions = useMemo(() => {
//     return projectOptions;
//   }, [projectOptions]);

//   // Campaign Selection Handler - Triggers MDMS API Call
//   const handleCampaignSelect = useCallback(
//     (value) => {
//       setSelectedCampaign(value);

//       const body = {
//         searchCriteria: {
//           tenantId: "dev",
//           projectId: "PJ-2025-01-001",
//           includePeriods: true,
//         },
//       };
//       const selectedData = PaymentSetUpService.billingConfigSearchByProjectId({ body: body });

//       // Clear previous skills data
//       setSkillsData(null);

//       // Fetch skills data when campaign is selected
//       if (value?.projectType) {
//         fetchSkillsData(value.projectType);
//       }
//     },
//     [fetchSkillsData]
//   );

//   // Billing Cycle Selection Handler
//   const handleBillingCycleSelect = useCallback((value) => {
//     setBillingCycle(value);
//     if (value?.code !== "CUSTOM") {
//       setCustomDays("");
//     }
//   }, []);

//   // Custom Days Input Handler - Only allows numeric input
//   const handleCustomDaysChange = useCallback((event) => {
//     const value = event.target.value;
//     if (value === "" || /^\d+$/.test(value)) {
//       setCustomDays(value);
//     }
//   }, []);

//   // Form Submission Handler
//   const handleSubmit = useCallback(() => {
//     console.log({
//       selectedCampaign,
//       billingCycle,
//       customDays,
//       campaignData: skillsData,
//     });

//     // Navigate to success page
//     history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
//       state: "success",
//       info: "",
//       fileName: "",
//       description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
//       message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
//       back: t(`GO_BACK_TO_HOME`),
//       backlink: `/${window.contextPath}/employee`,
//       showFooter: false,
//     });
//   }, [selectedCampaign, billingCycle, customDays, skillsData, history, t]);

//   // Render Label Pair Helper Function
//   const renderLabelPair = useCallback(
//     (heading, content) => (
//       <div className="label-pair" style={{ alignContent: "center", alignItems: "center" }}>
//         <span className="view-label-heading">{t(heading)}</span>
//         <span className="view-label-text">{content}</span>
//       </div>
//     ),
//     [t]
//   );

//   // Handle wage table data changes
//   const handleWageDataChange = useCallback((payload) => {
//     setWagePayload(payload);
//   }, []);

//   // Show loading state for initial data fetch
//   if (loadingBilling || isCampaignLoading) {
//     return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
//   }

//   return (
//     <div>
//       {/* Payment Setup Card */}
//       <Card type="primary" className="bottom-gap-card-payment">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <HeaderComponent>{t("Caption Setup payment for campaign")}</HeaderComponent>
//           <Button
//             label={"View audit logs"}
//             onButtonClick={(e) => {
//               e.stopPropagation();
//             }}
//             variation="link"
//             style={{ whiteSpace: "nowrap", width: "auto" }}
//           />
//         </div>

//         <CardText>{t("Setup billing cycles for a campaign")}</CardText>

//         {/* Campaign Dropdown */}
//         {renderLabelPair(
//           "Select a campaign",
//           <Dropdown
//             style={{ width: "100%" }}
//             t={t}
//             option={campaignOptions}
//             optionKey="name"
//             selected={selectedCampaign}
//             select={handleCampaignSelect}
//           />
//         )}

//         {/* Billing Cycle Dropdown */}
//         {renderLabelPair(
//           "Billing cycle",
//           <Dropdown
//             style={{ width: "100%" }}
//             t={t}
//             option={billingCycleOptions}
//             optionKey="code"
//             selected={billingCycle}
//             select={handleBillingCycleSelect}
//             disabled={loadingBilling || billingCycleOptions.length === 0}
//           />
//         )}

//         {/* Custom Days Input - Only shown when CUSTOM billing cycle is selected */}
//         {billingCycle?.code === "CUSTOM" &&
//           renderLabelPair(
//             "Enter the days to generate the bills",
//             <TextInput
//               name="customDays"
//               value={customDays}
//               onChange={handleCustomDaysChange}
//               placeholder={t("Enter number of days")}
//               type="text"
//               inputMode="numeric"
//             />
//           )}
//       </Card>

//       {/* Role Wages Setup Card */}
//       <Card>
//         <HeaderComponent>{t("Setup role wages")}</HeaderComponent>
//         <CardText>{t("for each role for a campaign. Workers will be paid based on the number of days worked.")}</CardText>

//         {/* Conditional Rendering based on loading and data state */}
//         {loadingSkills ? (
//           <div>
//             <Loader className={"digit-center-loader"} />
//           </div>
//         ) : skillsData ? (
//           <RoleWageTable
//             skills={skillsData.skills}
//             rateBreakupSchema={skillsData.rateBreakupSchema}
//             onDataChange={handleWageDataChange}
//             campaignId={selectedCampaign?.code}
//             campaignName={selectedCampaign?.name}
//           />
//         ) : selectedCampaign ? (
//           <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("No skills data available for this campaign type")}</div>
//         ) : (
//           <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("Please select a campaign to view roles and wages")}</div>
//         )}
//       </Card>

//       {/* Action Bar with Submit Button */}
//       <ActionBar className="mc_back">
//         <Button
//           style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "12rem" }}
//           variation="primary"
//           label={t("SUBMIT")}
//           title={t("SUBMIT")}
//           onClick={handleSubmit}
//           icon={"ArrowForward"}
//           isSuffix
//           disabled={!selectedCampaign || !billingCycle || (billingCycle?.code === "CUSTOM" && !customDays)}
//         />
//       </ActionBar>
//     </div>
//   );
// };

// export default PaymentSetUpPage;

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

  // Constants
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const BillingCycle = "BillingCycle";
  const CampaignTypeskills = "CampaignTypeskills";

  const { mutate: createBillConfig } = Digit.Hooks.payments.usePaymentSetUpForCampaign(tenantId);
  const { mutate: mDMSRatesCreate } = Digit.Hooks.payments.useMDMSRatesCreate(tenantId);

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
        console.error("Error fetching default skills data:", error);
        return null;
      }
    },
    [tenantId, CampaignTypeskills]
  );

  // Fetch User-Configured Rates from MDMS v2
  const fetchUserConfiguredRates = useCallback(
    async (campaignId) => {
      if (!campaignId) return null;
      debugger;
      try {
        const body = {
          // MdmsCriteria: {
          //   tenantId: tenantId,
          //   filters: {
          //     campaignId: projectId,
          //     campaignType: projectType,
          //   },
          //   schemaCode: "HCM.WORKER_RATES",
          // },

          MdmsCriteria: {
            tenantId: tenantId,

            schemaCode: "HCM.WORKER_RATES",
            filters: {
              //"c408d5b8-7178-4793-ab7b-7f38b099ec42"
              campaignId: campaignId,
            },
          },
        };
        debugger;
        const response = await PaymentSetUpService.mdmsSkillWageRatesSearch({ body: body });
        debugger;
        if (response && response.length > 0) {
          return response[0]; // Return the first matching rate configuration
        }
        return null;
      } catch (error) {
        console.error("Error fetching user-configured rates:", error);
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
            projectId: value.projectId,
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
          const userRatesData = await fetchUserConfiguredRates(value.code);
          debugger;
          // Step 4: Merge both (if user rates exist)
          const finalSkillsData =
            userRatesData && userRatesData.data?.rates?.length > 0 ? mergeUserConfiguredRates(defaultSkills, userRatesData) : defaultSkills;

          setSkillsData(finalSkillsData);
        }

        // end
        else {
          // Step 5: If no billing config, call default MDMS skills API
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);
          setSkillsData(defaultSkills);
        }
      } catch (error) {
        console.error("Error in campaign selection flow:", error);

        // Fallback: Try to fetch default skills data on error
        try {
          const defaultSkills = await fetchDefaultSkillsData(value.projectType);
          setSkillsData(defaultSkills);
        } catch (fallbackError) {
          console.error("Error fetching fallback skills data:", fallbackError);
          setSkillsData(null);
        }
      } finally {
        setLoadingSkills(false);
      }
    },
    [tenantId, fetchUserConfiguredRates, fetchDefaultSkillsData]
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
  // working one
  // const createRates = async () => {
  //   debugger;
  //   await mDMSRatesCreate(
  //     { wagePayload },
  //     {
  //       onError: async (error) => {
  //         debugger;
  //         // Show error toast
  //         setShowToast({
  //           key: "error",
  //           label: t(`HCM_AM_ERROR_MESSAGE`),
  //           transitionTime: 3000,
  //         });
  //       },
  //       onSuccess: async (responseData) => {
  //         // Show success toast and refresh parent data
  //         debugger;
  //         setShowToast({
  //           key: "success",
  //           label: t(`HCM_AM_ATTENDEE_DE_ENROLL_SUCCESS_MESSAGE`),
  //           transitionTime: 3000,
  //         });
  //       },
  //     }
  //   );
  // };

  // // Form Submission Handler
  // const handleSubmit = useCallback(async () => {
  //   console.log({
  //     selectedCampaign,
  //     billingCycle,
  //     customDays,
  //     campaignData: skillsData,
  //     billingConfig: billingConfigData,
  //     wageData: wagePayload,
  //   });
  //   debugger;
  //   const billingConfig = {
  //     tenantId: tenantId,
  //     projectId: selectedCampaign?.projectId,
  //     billingFrequency: billingCycle?.code,
  //     projectStartDate: selectedCampaign?.startDate,
  //     projectEndDate: selectedCampaign?.endDate,
  //     status: "ACTIVE",
  //     createdBy: Digit.UserService.getUser().info.uuid,
  //   };

  //   debugger;

  //   // Trigger API call using Digit mutation hook
  //   await createBillConfig(
  //     { billingConfig: billingConfig },
  //     {
  //       onError: async (error) => {
  //         debugger;
  //         // Show error toast
  //         setShowToast({
  //           key: "error",
  //           label: t(`HCM_AM_ERROR_MESSAGE`),
  //           transitionTime: 3000,
  //         });
  //       },
  //       onSuccess: async (responseData) => {
  //         // Show success toast and refresh parent data
  //        await  createRates();
  //       },
  //     }
  //   );

  //   history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
  //     state: "success",
  //     info: "",
  //     fileName: "",
  //     description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
  //     message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
  //     back: t(`GO_BACK_TO_HOME`),
  //     backlink: `/${window.contextPath}/employee`,
  //     showFooter: false,
  //   });
  // }, [selectedCampaign, billingCycle, customDays, skillsData, billingConfigData, wagePayload, history, t]);

  //INFO:: create mdms rates
  const createRates = async () => {
    try {
      await mDMSRatesCreate(
        { Mdms: wagePayload.Mdms },
        {
          onError: (error) => {
            console.error("Error creating MDMS rates:", error);
            setShowToast({
              key: "error",
              label: t("HCM_AM_ERROR_MESSAGE"),
              transitionTime: 3000,
            });
          },
          onSuccess: (responseData) => {
            console.log("MDMS rates created successfully:", responseData);
            setShowToast({
              key: "success",
              label: t("HCM_AM_ATTENDEE_DE_ENROLL_SUCCESS_MESSAGE"),
              transitionTime: 3000,
            });

            //  Navigate to success screen
            history.push(`/${window.contextPath}/employee/payments/payment-setup-success`, {
              state: "success",
              info: "",
              fileName: "",
              description: t("HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION"),
              message: t("HCM_AM_ATTENDANCE_APPROVE_SUCCESS"),
              back: t("GO_BACK_TO_HOME"),
              backlink: `/${window.contextPath}/employee`,
              showFooter: false,
            });
          },
        }
      );
    } catch (err) {
      console.error("Unexpected error while creating MDMS rates:", err);
      setShowToast({
        key: "error",
        label: t("HCM_AM_ERROR_MESSAGE"),
        transitionTime: 3000,
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

    const billingConfig = {
      tenantId: tenantId,
      projectId: selectedCampaign?.projectId,
      billingFrequency: billingCycle?.code,
      projectStartDate: selectedCampaign?.startDate,
      projectEndDate: selectedCampaign?.endDate,
      status: "ACTIVE",
      createdBy: Digit.UserService.getUser().info.uuid,
    };

    try {
      // ✅ Call the billing config creation first
      await createBillConfig(
        { billingConfig },
        {
          onError: (error) => {
            console.error("Billing Config creation failed:", error);
            setShowToast({
              key: "error",
              label: t("HCM_AM_ERROR_MESSAGE"),
              transitionTime: 3000,
            });
          },
          onSuccess: async (responseData) => {
            console.log("Billing Config created successfully:", responseData);

            //  Only after billingConfig succeeds, create MDMS Rates
            await createRates();
          },
        }
      );
    } catch (err) {
      console.error("Unexpected error during form submission:", err);
      setShowToast({
        key: "error",
        label: t("HCM_AM_ERROR_MESSAGE"),
        transitionTime: 3000,
      });
    }
  }, [selectedCampaign, billingCycle, customDays, skillsData, billingConfigData, wagePayload, history, t]);

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

        {/* Custom Days Input */}
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

        {/* Conditional Rendering */}
        {loadingSkills ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Loader className={"digit-center-loader"} />
          </div>
        ) : skillsData ? (
          <RoleWageTable
            skills={skillsData.skills}
            rateBreakupSchema={skillsData.rateBreakupSchema}
            onDataChange={handleWageDataChange}
            campaignId={selectedCampaign?.code}
            campaignName={selectedCampaign?.name}
            existingRatesData={skillsData ? skillsData.existingRatesData : null}
          />
        ) : selectedCampaign ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("No skills data available for this campaign type")}</div>
        ) : (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("Please select a campaign to view roles and wages")}</div>
        )}
      </Card>

      {/* Action Bar */}
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "12rem" }}
          variation="primary"
          label={t("SUBMIT")}
          title={t("SUBMIT")}
          onClick={handleSubmit}
          icon={"ArrowForward"}
          isSuffix
          disabled={!selectedCampaign || !billingCycle || (billingCycle?.code === "CUSTOM" && !customDays) || !skillsData}
        />
      </ActionBar>
    </div>
  );
};

export default PaymentSetUpPage;
