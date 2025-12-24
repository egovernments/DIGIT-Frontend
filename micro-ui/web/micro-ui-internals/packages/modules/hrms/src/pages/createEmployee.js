import { FormComposer, Loader, Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../components/config/config";
import _ from "lodash";
import { Toast } from "@egovernments/digit-ui-components";

const CreateEmployee = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const [checkfield, setcheck] = useState(false)
  const { t } = useTranslation();
  const history = useHistory();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["CommonFieldsConfig"], {
    select: (data) => {
      return {
        config: data?.MdmsRes?.['egov-hrms']?.CommonFieldsConfig
      };
    },
    retry: false,
    enable: false,
  });

  // Fetch mobile validation config from MDMS
  const stateLvlTenantId = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit?.Utils?.getConfigModuleName?.() || "commonUiConfig";
  const { data: validationConfig, isLoading: isValidationLoading } = Digit.Hooks.useCustomMDMS(
    stateLvlTenantId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const validationData = data?.[moduleName]?.UserValidation?.find((x) => x.fieldType === "mobile");
        const rules = validationData?.rules;
        const attributes = validationData?.attributes;
        return {
          prefix: attributes?.prefix || "+91",
          pattern: rules?.pattern || "^[6-9][0-9]{9}$",
          maxLength: rules?.maxLength || 10,
          minLength: rules?.minLength || 10,
          errorMessage: rules?.errorMessage || "CORE_COMMON_MOBILE_ERROR",
        };
      },
      staleTime: 300000, // Cache for 5 minutes
      enabled: !!stateLvlTenantId,
    }
  );

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);
  const mutationCreate = Digit.Hooks.hrms.useHRMSCreate(tenantId);
  const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = employeeCreateSession;

  // Store MDMS validation config globally for getPattern to use
  useEffect(() => {
    if (validationConfig) {
      if (!window.Digit) window.Digit = {};
      if (!window.Digit.MDMSValidationPatterns) window.Digit.MDMSValidationPatterns = {};
      window.Digit.MDMSValidationPatterns.mobileNumberValidation = validationConfig;
    }
  }, [validationConfig]);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
    return () => {
      if (window.location.pathname.includes("/hrms/create")) {
        return;
      } else {
        clearSessionFormData();
      }
    };
  }, []);

  const checkMailNameNum = (formData) => {

    const email = formData?.SelectEmployeeEmailId?.emailId || '';
    const name = formData?.SelectEmployeeName?.employeeName || '';
    const address = formData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress || '';
    const validEmail = email.length == 0 ? true : email.match(Digit.Utils.getPattern('Email'));
    return validEmail && name.match(Digit.Utils.getPattern('Name')) && address.match(Digit.Utils.getPattern('Address'));
  }
  useEffect(() => {
    const maxLength = validationConfig?.maxLength || 10;
    const minLength = validationConfig?.minLength || 10;
    const pattern = validationConfig?.pattern
      ? new RegExp(validationConfig.pattern, 'i')
      : Digit.Utils.getPattern('MobileNo');

    if (
      mobileNumber &&
      mobileNumber.length >= minLength &&
      mobileNumber.length <= maxLength &&
      mobileNumber.match(pattern)
    ) {
      setShowToast(null);
      Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
        if (result.Employees.length > 0) {
          setShowToast({ key: "error", label: "ERR_HRMS_USER_EXIST_MOB" });
          setPhonecheck(false);
        } else {
          setPhonecheck(true);
        }
      }).catch(err => {
        setPhonecheck(false);
      });
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber, validationConfig]);

  const defaultValues = {

    Jurisdictions:
      [{
        id: undefined,
        key: 1,
        hierarchy: null,
        boundaryType: null,
        boundary: {
          code: tenantId
        },
        roles: [],
      }]
  }

  const onFormValueChange = (setValue = true, formData) => {

    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }

    if (formData?.SelectEmployeePhoneNumber?.mobileNumber) {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    } else {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    }
    for (let i = 0; i < formData?.Jurisdictions?.length; i++) {
      let key = formData?.Jurisdictions[i];
      if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.roles?.length > 0)) {
        setcheck(false);
        break;
      } else {
        setcheck(true);
      }
    }

    let setassigncheck = false;
    for (let i = 0; i < formData?.Assignments?.length; i++) {
      let key = formData?.Assignments[i];
      if (
        !(key.department && key.designation && key.fromDate && (formData?.Assignments[i].toDate || formData?.Assignments[i]?.isCurrentAssignment))
      ) {
        setassigncheck = false;
        break;
      } else if (formData?.Assignments[i].toDate == null && formData?.Assignments[i]?.isCurrentAssignment == false) {
        setassigncheck = false;
        break;
      } else {
        setassigncheck = true;
      }
    }


    if (
      formData?.SelectDateofEmployment?.dateOfAppointment &&
      formData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress &&
      formData?.SelectEmployeeGender?.gender.code &&
      formData?.SelectEmployeeName?.employeeName &&
      formData?.SelectEmployeeType?.code &&
      formData?.SelectEmployeePhoneNumber?.mobileNumber &&
      checkfield &&
      setassigncheck &&
      phonecheck &&
      checkMailNameNum(formData)
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const navigateToAcknowledgement = ({ id, message }) => {
    history.replace(`/${window?.contextPath}/employee/hrms/response?isSuccess=true`, { id, message, showID: true, showChildren: false });
  };


  const ToastOverlay = ({ showToast, t, onClose }) => {
    if (!showToast) return null;
    return (
      <div style={{
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        maxWidth: "90%",
      }}>
        <Toast
          type={showToast.key}
          label={t(showToast.label)}
          onClose={onClose}
        />
      </div>
    );
  };

  function hasMatchingJurisdiction(jurisdictions = [], parentCity = "") {
    if (!Array.isArray(jurisdictions) || !parentCity) return false;

    return jurisdictions.some(j => j?.boundary === parentCity);
  }




  const onSubmit = async (data) => {
    // Validate mobile number before submission
    const mobileNum = data?.SelectEmployeePhoneNumber?.mobileNumber;

    if (mobileNum) {
      // Get validation parameters from MDMS or use defaults
      const maxLength = validationConfig?.maxLength || 10;
      const minLength = validationConfig?.minLength || 10;
      const pattern = validationConfig?.pattern
        ? new RegExp(validationConfig.pattern, 'i')
        : Digit.Utils.getPattern('MobileNo');

      // Check length
      if (mobileNum.length < minLength || mobileNum.length > maxLength) {
        setShowToast({
          key: "error",
          label: validationConfig?.errorMessage || "CORE_COMMON_MOBILE_ERROR"
        });
        return;
      }

      // Check pattern
      if (!mobileNum.match(pattern)) {
        setShowToast({
          key: "error",
          label: validationConfig?.errorMessage || "CORE_COMMON_MOBILE_ERROR"
        });
        return;
      }
    }

    const hasCurrentAssignment = data?.Assignments?.some(assignment => assignment?.isCurrentAssignment === true);
    const selectedCity = data?.Jurisdictions?.[0]?.boundary;
    data.Jurisdictions = data?.Jurisdictions?.map((juris) => {
      return {
        ...juris,
        tenantId: tenantId
      };
    });


    if (!hasMatchingJurisdiction(data?.Jurisdictions, userInfo.info.tenantId)) {
      setShowToast({ key: "error", label: "ERR_BASE_TENANT_MANDATORY" });
      return;
    }

    if (!canSubmit) {
      setShowToast({ key: "error", label: "ERR_ALL_MANDATORY_FIELDS" });
      return;
    }




    if (!hasCurrentAssignment) {
      setShowToast({ key: "error", label: "ERR_NO_CURRENT_ASSIGNMENT" });
      return;
    }
    if (data.Jurisdictions.filter((juris) => juris.tenantId == tenantId).length == 0) {
      setShowToast({ key: "error", label: "ERR_BASE_TENANT_MANDATORY" });
      return;
    }


    if (!Object.values(data.Jurisdictions.reduce((acc, sum) => {
      if (sum && sum?.boundary) {
        acc[sum.boundary] = acc[sum.boundary] ? acc[sum.boundary] + 1 : 1;
      }
      return acc;
    }, {})).every(s => s == 1)) {
      setShowToast({ key: "error", label: "ERR_INVALID_JURISDICTION" });
      return;
    }
    let roles = data?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        if (isMultiRootTenant) {
          item["tenantId"] = tenantId;
        }
        else {
          item["tenantId"] = ele.boundary;
        }
        return item;
      });
    });

    const mappedroles = [].concat.apply([], roles);
    let Employees = [
      {
        tenantId: tenantId,
        employeeStatus: "EMPLOYED",
        assignments: data?.Assignments,
        code: data?.SelectEmployeeId?.code ? data?.SelectEmployeeId?.code : undefined,
        dateOfAppointment: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
        employeeType: data?.SelectEmployeeType?.code,
        jurisdictions: data?.Jurisdictions,
        user: {
          mobileNumber: data?.SelectEmployeePhoneNumber?.mobileNumber,
          name: data?.SelectEmployeeName?.employeeName,
          correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress,
          emailId: data?.SelectEmployeeEmailId?.emailId ? data?.SelectEmployeeEmailId?.emailId : undefined,
          gender: data?.SelectEmployeeGender?.gender.code,
          dob: new Date(data?.SelectDateofBirthEmployment?.dob).getTime(),
          roles: mappedroles,
          tenantId: tenantId,
        },
        serviceHistory: [],
        education: [],
        tests: [],
      },
    ];
    /* use customiseCreateFormData hook to make some chnages to the Employee object */
    Employees = Digit?.Customizations?.HRMS?.customiseCreateFormData ? Digit.Customizations.HRMS.customiseCreateFormData(data, Employees) : Employees;

    if (data?.SelectEmployeeId?.code && data?.SelectEmployeeId?.code?.trim().length > 0) {
      Digit.HRMSService.search(tenantId, null, { codes: data?.SelectEmployeeId?.code }).then((result, err) => {
        if (result.Employees.length > 0) {
          setShowToast({ key: "error", label: "ERR_HRMS_USER_EXIST_ID" });
          return;
        } else {
          // navigateToAcknowledgement(Employees);
          mutationCreate.mutate(
            {
              Employees: Employees,
            },
            {
              onError: (error, variables) => {
                setShowToast({
                  key: "error",
                  label: error?.response?.data?.Errors?.[0]?.code ? error?.response?.data?.Errors?.[0]?.code : "HRMS_CREATE_ERROR",
                });
              },
              onSuccess: async (data) => {
                navigateToAcknowledgement({ id: data?.Employees?.[0]?.code, message: "HRMS_CREATE_EMPLOYEE_RESPONSE_MESSAGE" });
              },
            }
          );
        }
      });
    } else {
      // navigateToAcknowledgement(Employees);
      mutationCreate.mutate(
        {
          Employees: Employees,
        },
        {
          onError: (error, variables) => {
            setShowToast({
              key: "error",
              label: error?.response?.data?.Errors?.[0]?.code ? error?.response?.data?.Errors?.[0]?.code : "HRMS_CREATE_ERROR",
            });
          },
          onSuccess: async (data) => {
            navigateToAcknowledgement({ id: data?.Employees?.[0]?.code, message: "HRMS_CREATE_EMPLOYEE_RESPONSE_MESSAGE" });
            // navigateToAcknowledgement(Employees);
          },
        }
      );
    }
  };
  if (isLoading || isValidationLoading) {
    return <Loader />;
  }

  // Inject validation config into the phone number field
  const config = (mdmsData?.config ? mdmsData.config : newConfig).map((section) => ({
    ...section,
    body: section.body.map((field) => {
      if (field.component === "SelectEmployeePhoneNumber") {
        return { ...field, validationConfig };
      }
      return field;
    }),
  }));
  return (
    <div>
      <div style={isMobile ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" } : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Header>
      </div>
      <FormComposer
        // defaultValues={defaultValues}
        defaultValues={sessionFormData}
        heading={t("")}
        config={config}
        onSubmit={onSubmit}
        onFormValueChange={onFormValueChange}
        // isDisabled={!canSubmit}
        label={t("HR_COMMON_BUTTON_SUBMIT")}
      />

      <ToastOverlay showToast={showToast} t={t} onClose={() => setShowToast(null)} />
    </div>
  );
};
export default CreateEmployee;
