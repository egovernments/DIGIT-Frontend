//import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { FormComposerV2, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { newConfig } from "../../components/config/config";

import { ReposeScreenType } from "../../constants/enums";

import {
  checkIfUserExistWithPhoneNumber,
  checkIfUserExist,
  formPayloadToCreateUser,
  editDefaultUserValue,
  formPayloadToUpdateUser,
} from "../../services/service";
import { getPattern } from "../../utils/utlis";
import ActionPopUp from "../../components/pageComponents/popup";

const CreateEmployee = ({ editUser = false }) => {
  const isEdit = window.location.pathname.includes("/edit/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);

  const [showToast, setShowToast] = useState(null);

  const [mobile, setMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const [createEmployeeData, setCreateEmployeeData] = useState({});

  const { id } = useParams();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const [showModal, setShowModal] = useState(false);

  const mutation = Digit.Hooks.hrms.useHRMSCreate(tenantId);
  const mutationUpdate = Digit.Hooks.hrms.useHRMSUpdate(tenantId);
  const { isLoadings, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

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

  const onFormValueChange = (setValue = true, formData, formState, reset, setError, clearErrors) => {
    if (isEdit) {
      if (phoneNumber !== formData?.SelectEmployeePhoneNumber) {
        setPhoneNumber(formData?.SelectEmployeePhoneNumber);
        setMobile(true);
      } else {
        setMobile(false);
      }
    }

    const SelectEmployeeName = formData?.SelectEmployeeName;

    if (SelectEmployeeName && !SelectEmployeeName.match(Digit.Utils.getPattern("Name"))) {
      if (!formState.errors.SelectEmployeeName) {
        setError("SelectEmployeeName", { type: "custom", message: t("CORE_COMMON_APPLICANT_NAME_INVALID") }, { shouldFocus: false });
      }
    } else {
      if (formState.errors.SelectEmployeeName) {
        clearErrors("SelectEmployeeName");
      }
    }

    const password = formData?.employeePassword;
    const confirmPassword = formData?.employeeConfirmPassword;
    const passwordPattern = getPattern("Password");

    if (password && !password.match(passwordPattern)) {
      if (!formState.errors.employeePassword) {
        setError("employeePassword", {
          type: "custom",
          message: t("CORE_COMMON_APPLICANT_PASSWORD_INVALID"),
        });
      }
    } else {
      if (formState.errors.employeePassword) {
        clearErrors("employeePassword");
      }
    }

    if (confirmPassword && password !== confirmPassword) {
      if (!formState.errors.employeeConfirmPassword) {
        setError("employeeConfirmPassword", {
          type: "custom",
          message: t("CORE_COMMON_APPLICANT_CONFIRM_PASSWORD_INVALID"),
        });
      }
    } else {
      if (formState.errors.employeeConfirmPassword) {
        clearErrors("employeeConfirmPassword");
      }
    }

    // validate email

    const SelectEmployeeEmailId = formData?.SelectEmployeeEmailId;

    const emailPattern = getPattern("Email");

    if (SelectEmployeeEmailId && !SelectEmployeeEmailId.match(emailPattern)) {
      if (!formState.errors.SelectEmployeeEmailId) {
        setError("SelectEmployeeEmailId", {
          type: "custom",
          message: t("CS_PROFILE_EMAIL_ERRORMSG"),
        });
      }
    } else {
      if (formState.errors.SelectEmployeeEmailId) {
        clearErrors("SelectEmployeeEmailId");
      }
    }

    if (
      formData?.SelectEmployeeName &&
      formData?.SelectEmployeeType?.code &&
      formData?.SelectEmployeeId
      //  &&
      // validatePassword(formData) &&
      // checkMailNameNum(formData)
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
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
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.CREAT_EUSER,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              description: t(`HRMS_CREATE_EMPLOYEE_INFO`),
              message: t(`EMPLOYEE_RESPONSE_CREATE`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.CREATE_USER_ERROR,
              state: "error",
              info: null,
              fileName: error?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_CREATE_ACTION_ERROR`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });

            //t(`ERR_PLAN_UPDATE_FAILED`)
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      // setTriggerEstimate(true);
    }
  };

  const updateEmployeeService = async (payload) => {
    try {
      await mutationUpdate.mutateAsync(
        {
          Employees: payload,
        },
        {
          onSuccess: (res) => {
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            console.log("error",error)
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER_ERROR,
              state: "error",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: error?.Employees?.[0],
              description: t(error?`${error[0]?.code}`:""),
              message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION_ERROR`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
     console.log(error)
      // setTriggerEstimate(true);
    }
  };

  const onSubmit = async (formData) => {
    setShowToast(null);

    try {
      if (editUser == false) {
        const type = await checkIfUserExist(formData, tenantId);
        if (type == true) {
          setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
          setShowModal(false);
        } else {
          const payload = formPayloadToCreateUser(formData, tenantId);
          await createEmployeeService(payload);

          //  navigateToAcknowledgement(payload);
        }
      } else {
        const payload = formPayloadToUpdateUser(formData, data?.Employees, tenantId);
        await updateEmployeeService(payload);
      }
    } catch (err) {
     
      setShowToast({ key: true, label: t(err?`${err?.code}`:"BAD_REQUEST") });
      setShowModal(false);
    }
  };

  const openModal = async (e) => {
    if (isEdit && mobile) {
      const type = await checkIfUserExistWithPhoneNumber(e, tenantId);
      if (type == true) {
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
        setShowModal(false);
      } else {
        setCreateEmployeeData(e);
        setShowModal(true);
      }
    } else if (isEdit) {
      setCreateEmployeeData(e);
      setShowModal(true);
    } else {
      const type = await checkIfUserExistWithPhoneNumber(e, tenantId);
      if (type == true) {
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
        setShowModal(false);
      } else {
        setCreateEmployeeData(e);
        setShowModal(true);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  if (isLoading || isLoadings) {
    return <Loader />;
  }
  //const config = newConfig;
  const config = isEdit
    ? newConfig.map((section) => ({
        ...section,
        body: section.body.filter((field) => field.key !== "employeePassword" && field.key !== "employeeConfirmPassword"),
      }))
    : newConfig;

  return (
    <React.Fragment>
      <div style={{ marginBottom: "80px" }}>
        <div
          style={
            isMobile
              ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
              : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
          }
        >
          {
            <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
              {t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}
            </HeaderComponent>
          }
        </div>

        <FormComposerV2
          defaultValues={editUser == true && data?.Employees ? editDefaultUserValue(data?.Employees, tenantId) : {}}
          heading={t("")}
          config={config}
          onSubmit={openModal}
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
        {showModal && <ActionPopUp headingMsg={"READY_TO_SUBMIT"} onClose={closeModal} onSubmit={() => onSubmit(createEmployeeData)} />}
      </div>
    </React.Fragment>
  );
};
export default CreateEmployee;
