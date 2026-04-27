import { FormComposer, Loader, Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../components/config/config";
import _ from "lodash";
import { Toast } from "@egovernments/digit-ui-components";

const CreateEmployee = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const [checkfield, setcheck] = useState(false)
  const { t } = useTranslation();
  const history = useHistory();
  const isMobile = window.Digit.Utils.browser.isMobile();


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
  const stateLvlTenantId = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getCurrentTenantId() : window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit.Utils.getMultiRootTenant() ? "common-masters" : "commonUiConfig";
  const { data: validationConfig, isLoading: isValidationLoading } = Digit.Hooks.useCustomMDMS(
    stateLvlTenantId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const allItems = data?.[moduleName]?.UserValidation || [];
        const mobileConfigs = allItems.filter((x) => x.fieldType === "mobile").map(item => ({
          prefix: item?.attributes?.prefix,
          pattern: item?.rules?.pattern,
          maxLength: item?.rules?.maxLength,
          minLength: item?.rules?.minLength,
          errorMessage: item?.rules?.errorMessage,
          isDefault: item?.default === true || String(item?.default).toLowerCase() === "true",
        }));

        const defaultItem = mobileConfigs.find((x) => x.isDefault) || mobileConfigs[0];
        return {
          mobileConfigs,
          defaultConfig: defaultItem,
          prefix: defaultItem?.prefix || "+91",
          pattern: defaultItem?.pattern || "^[6-9][0-9]{9}$",
          maxLength: defaultItem?.maxLength || 10,
          minLength: defaultItem?.minLength || 10,
          errorMessage: defaultItem?.errorMessage || "CORE_COMMON_MOBILE_ERROR",
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
  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
    // Reset stale country code so MDMS default is always used on fresh load
    if (sessionFormData?.SelectEmployeePhoneNumber?.countryCode) {
      setSessionFormData({
        ...sessionFormData,
        SelectEmployeePhoneNumber: {
          ...sessionFormData.SelectEmployeePhoneNumber,
          countryCode: undefined,
        },
      });
    }
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
    const currentValidation = window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation || validationConfig;
    const maxLength = currentValidation?.maxLength || 10;
    const minLength = currentValidation?.minLength || 10;
    const pattern = currentValidation?.pattern
      ? new RegExp(currentValidation.pattern, 'i')
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
      });
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);

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
      if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.tenantId && key?.roles?.length > 0)) {
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



  const onSubmit = async (data) => {
    // Validate mobile number before submission
    const mobileNum = data?.SelectEmployeePhoneNumber?.mobileNumber;

    if (mobileNum) {
      // Get validation parameters from MDMS or use defaults
      const currentValidation = window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation || validationConfig;
      const maxLength = currentValidation?.maxLength || 10;
      const minLength = currentValidation?.minLength || 10;
      const pattern = currentValidation?.pattern
        ? new RegExp(currentValidation.pattern, 'i')
        : Digit.Utils.getPattern('MobileNo');

      // Check length
      if (mobileNum.length < minLength || mobileNum.length > maxLength) {
        setShowToast({
          key: "error",
          label: currentValidation?.errorMessage || "CORE_COMMON_MOBILE_ERROR"
        });
        return;
      }

      // Check pattern
      if (!mobileNum.match(pattern)) {
        setShowToast({
          key: "error",
          label: currentValidation?.errorMessage || "CORE_COMMON_MOBILE_ERROR"
        });
        return;
      }
    }

    const hasCurrentAssignment = data?.Assignments?.some(assignment => assignment?.isCurrentAssignment === true);
    const selectedCity = data?.Jurisdictions?.[0]?.boundary;
    data.Jurisdictions = data?.Jurisdictions?.map((juris) => {
      const normalizedBoundary = juris?.boundary === "citya" ? "pg.citya" : juris?.boundary;
      return {
        ...juris,
        boundary: normalizedBoundary,
        tenantId: tenantId
      };
    });

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
      if (sum && sum?.tenantId) {
        acc[sum.tenantId] = acc[sum.tenantId] ? acc[sum.tenantId] + 1 : 1;
      }
      return acc;
    }, {})).every(s => s == 1)) {
      setShowToast({ key: "error", label: "ERR_INVALID_JURISDICTION" });
      return;
    }
    let roles = data?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        if (Digit.Utils.getMultiRootTenant()) {
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
          countryCode: (data?.SelectEmployeePhoneNumber?.countryCode || window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.prefix || "+91"),
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
  if (isLoading) {
    return <Loader />;
  }
  const config = mdmsData?.config ? mdmsData.config : newConfig;
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
      {showToast && (
        <Toast
          type={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  );
};
export default CreateEmployee;
