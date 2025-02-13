import { FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig } from "../../components/config/config";
import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";
//import ActionModal from "../../components/Modal";
import { HRMS_CONSTANTS } from "../../constants/constants";

import { checkIfUserExist ,formPayloadToCreateUser} from "../../services/service";

const CreateEmployee = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const [checkfield, setcheck] = useState(false);
  const [campaignAssignCheck, setCampaignAssignCheck] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(
    Digit.ULBService.getStateId(),
    "egov-hrms",
    ["CommonFieldsConfig", "CampaignAssignmentFieldsConfig"],
    {
      select: (data) => {
        return {
          config: data?.MdmsRes?.["egov-hrms"]?.CommonFieldsConfig,
          campaignAssignConfig: data?.MdmsRes?.["egov-hrms"]?.CampaignAssignmentFieldsConfig,
        };
      },
      retry: false,
      enable: false,
    }
  );

  const checkMailNameNum = (formData) => {
    const email = formData?.SelectEmployeeEmailId?.emailId || "";
    const name = formData?.SelectEmployeeName?.employeeName || "";
    const address = formData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress || "";
    const validEmail = email.length == 0 ? true : email.match(Digit.Utils.getPattern("Email"));
    const validAddress = address.length === 0 ? true : address.match(Digit.Utils.getPattern("Address"));
    return validEmail && name.match(Digit.Utils.getPattern("Name")) && validAddress;
  };
  const validatePassword = (formData) => {
    const password = formData?.SelectEmployeePassword?.employeePassword;
    const confirmPassword = formData?.SelectEmployeePassword?.employeeConfirmPassword;
    return (
      password &&
      confirmPassword &&
      password.match(Digit.Utils.getPattern("Password")) &&
      confirmPassword.match(Digit.Utils.getPattern("Password")) &&
      password === confirmPassword
    );
  };
  // useEffect(() => {
  //   if (
  //     mobileNumber &&
  //     (mobileNumber.length === 9 || mobileNumber.length === 10) &&
  //     (mobileNumber.match(Digit.Utils.getPattern("MobileNo")) || mobileNumber.match(Digit.Utils.getPattern("MozMobileNo")))
  //   ) {
  //     setShowToast(null);
  //     setPhonecheck(true);
  //     // Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
  //     //   if (result.Employees.length > 0) {
  //     //     setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOB" });
  //     //     setPhonecheck(false);
  //     //   } else {
  //     //     setPhonecheck(true);
  //     //   }
  //     // });
  //   } else {
  //     setPhonecheck(true);
  //   }
  // }, [mobileNumber]);

  const onFormValueChange = (setValue = true, formData) => {
    if (formData?.SelectEmployeePhoneNumber?.mobileNumber) {
      setMobileNumber(
        formData?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
          ? formData?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
          : formData?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
          ? formData?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
          : formData?.SelectEmployeePhoneNumber?.mobileNumber
      );
    } else {
      setMobileNumber(
        formData?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(
          HRMS_CONSTANTS.INDIA_COUNTRY_CODE
            ? formData?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
            : formData?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
            ? formData?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
            : formData?.SelectEmployeePhoneNumber?.mobileNumber
        )
      );
    }

    if (formData?.SelectEmployeeName?.employeeName && formData?.SelectEmployeeType?.code && formData?.SelectEmployeeId?.code) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const navigateToAcknowledgement = (Employees) => {
    history.replace(`/${window?.contextPath}/employee/hrms/response`, { Employees, key: "CREATE", action: "CREATE" });
  };

  const navigateToCampaignAssignmentAcknowledgement = (ProjectStaffPayload, selectedCampaignBoundary) => {
    Digit.HRMSService.search(tenantId, null, { codes: hrmsUserName })
      .then((res) => {
        let UpdateAssignmentPayload = {};
        if (res?.Employees?.length > 0) {
          UpdateAssignmentPayload["Employees"] = res.Employees;
        }
        history.replace(`/${window?.contextPath}/employee/hrms/response`, {
          payload: { ProjectStaffPayload, UpdateAssignmentPayload },
          action: "CREATE",
          campaignAssignment: true,
          key: "CREATE",
        });
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = async (data) => {
    setShowToast(null);
    const mappedroles = [].concat.apply([], data?.RolesAssigned);
    let createdAssignments = [
      {
        fromDate: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
        toDate: undefined,
        isCurrentAssignment: true,
        department: data?.SelectEmployeeDepartment?.code || HRMS_CONSTANTS.DEFAULT_DEPARTMENT,
        designation: data?.SelectEmployeeDesignation?.code || "undefined",
      },
    ];
    let Employees = [
      {
        tenantId: tenantId,
        employeeStatus: "EMPLOYED",
        assignments: createdAssignments,
        code: data?.SelectEmployeeId?.code,
        dateOfAppointment: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
        employeeType: data?.SelectEmployeeType?.code,
        jurisdictions: data?.Jurisdictions,
        user: {
          mobileNumber: data?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
            ? data?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
            : (data?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
                ? data?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
                : data?.SelectEmployeePhoneNumber?.mobileNumber) || null,
          name: data?.SelectEmployeeName?.employeeName,
          correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress || null,
          emailId: data?.SelectEmployeeEmailId?.emailId ? data?.SelectEmployeeEmailId?.emailId : null,
          gender: data?.SelectEmployeeGender?.gender.code,
          dob: new Date(data?.SelectDateofBirthEmployment?.dob || HRMS_CONSTANTS.DEFAULT_DOB).getTime(),
          roles: mappedroles,
          tenantId: tenantId,
          userName: data?.SelectEmployeeId?.code,
          password: data?.SelectEmployeePassword?.employeePassword,
        },
        serviceHistory: [],
        education: [],
        tests: [],
      },
    ];

    // if (data?.SelectEmployeeId?.code && data?.SelectEmployeeId?.code?.trim().length > 0) {
    //   Digit.HRMSService.search(tenantId, null, { codes: data?.SelectEmployeeId?.code }).then((result, err) => {
    //     if (result.Employees.length > 0) {
    //       setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
    //       setShowModal(false);
    //       return;
    //     } else {
    //       navigateToAcknowledgement(Employees);
    //     }
    //   });
    // } else {
    //   navigateToAcknowledgement(Employees);
    // }
    try {
      const type = await checkIfUserExist(data,tenantId);
      debugger;
      if (type == true) {
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
        setShowModal(false);
      } else {
      const payload= formPayloadToCreateUser(data,tenantId)
    debugger
        navigateToAcknowledgement(payload);
      }
    } catch (err) {
      debugger;
      setShowToast({ key: true, label: "Some error happened" });
      setShowModal(false);
    }
  };
  const openModal = (e) => {
    setCreateEmployeeData(e);
    setShowModal(true);
  };
  if (isLoading) {
    return <Loader />;
  }
  const config = newConfig;

  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        <Header>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Header>
      </div>
      <FormComposerV2
        // defaultValues={defaultValues}
        heading={t("")}
        config={config}
        onSubmit={onSubmit}
        className={"custom-form"}
        onFormValueChange={onFormValueChange}
        isDisabled={!canSubmit}
        label={t("HR_COMMON_BUTTON_SUBMIT")}
      />

      {showToast && (
        <Toast
          error={showToast.key}
          isDleteBtn="true"
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
      {/*showModal && (
        <ActionModal t={t} action={"CREATE_EMPLOYEE"} tenantId={tenantId} closeModal={closeModal} submitAction={() => onSubmit(createEmployeeData)} />
      )*/}
    </div>
  );
};
export default CreateEmployee;
