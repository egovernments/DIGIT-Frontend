import { FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig } from "../../components/config/config";
import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";

import { HRMS_CONSTANTS } from "../../constants/constants";

import { checkIfUserExist, formPayloadToCreateUser, editDefaultUserValue } from "../../services/service";

const CreateEmployee = ({ editUser = false }) => {
  const [editEmpolyee, setEditEmployee] = useState(null);
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

  const mutation = Digit.Hooks.hrms.useHRMSCreate(tenantId);
  const { isLoadings, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: location.codes }, tenantId);
  useEffect(() => {
    if (!editUser && data?.Employees) {
      setEditEmployee(editDefaultUserValue(data.Employees, tenantId));
    }
  }, [data]);

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

  const defaultValues = {
    SelectEmployeeId: { code: "1234" },
  };

  const createEmployeeService = async (payload) => {
    try {
      await mutation.mutateAsync(
        {
          Employees: payload,

          key: "CREATE",
          action: "CREATE",
        },
        {
          onSuccess: (res) => {
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: false,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              description: t(`EMPLOYEE_RESPONSE_CREATE_ACTION`),
              message: t(`EMPLOYEE_RESPONSE_CREATE`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: false,
              state: "error",
              info: t("Testing"),
              fileName: error?.Employees?.[0],
              description: t(`EMPLOYEE_RESPONSE_CREATE`),
              message: t(`EMPLOYEE_RESPONSE_CREATE`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      debugger;
      // setTriggerEstimate(true);
    }
  };

  const onSubmit = async (data) => {
    setShowToast(null);

    try {
      const type = await checkIfUserExist(data, tenantId);
      if (type == true) {
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
        setShowModal(false);
      } else {
        const payload = formPayloadToCreateUser(data, tenantId);
        await createEmployeeService(payload);

        //  navigateToAcknowledgement(payload);
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
  if (isLoading || isLoadings) {
    return <Loader />;
  }
  const config = newConfig;

  console.log(data?.Employees, "data?.Employees");

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
        defaultValues={!editUser && data?.Employees ? editDefaultUserValue(data?.Employees, tenantId) : ""}
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
