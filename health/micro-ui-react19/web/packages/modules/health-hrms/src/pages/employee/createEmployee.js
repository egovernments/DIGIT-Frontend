import { FormComposerV2, HeaderComponent, Toast, Loader } from "@egovernments/digit-ui-components";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";

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
import { CreateEmployeeConfig } from "../../components/config/createEmployeeConfig";

const CreateEmployee = ({ editUser = false }) => {
  const { boundaryCode } = Digit.Hooks.useQueryParams();

  const isEdit = window.location.pathname.includes("/edit/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);

  const [showToast, setShowToast] = useState(null);

  const [mobile, setMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // Get query params
  const queryParams = new URLSearchParams(location.search);

  // Access specific param
  const boundaryCodep = queryParams.get("boundarycode");

  const [createEmployeeData, setCreateEmployeeData] = useState({});

  const { id } = useParams();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const formattedDate = eighteenYearsAgo.toISOString().split("T")[0];


  const mutation = Digit.Hooks.hrms.useHRMSCreate(tenantId);
  const mutationUpdate = Digit.Hooks.hrms.useHRMSUpdate(tenantId);
  const { isLoading: isHRMSSearchLoading, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

  const { data: mdmsData, isLoading: isHRMSConfigLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["CreateEmployeeConfig"], {
    select: (data) => {
      return data?.["egov-hrms"]?.CreateEmployeeConfig?.[0];
    },
    retry: false,
    enable: false,
  });


  const validatePhoneNumber = (value) => {
    const stringValue = String(value || "");
    return !!stringValue.match(getPattern("MobileNo"));
  };

  const onFormValueChange = (setValue, formData) => {
    if (isEdit) {
      if (phoneNumber !== formData?.SelectEmployeePhoneNumber) {
        setPhoneNumber(formData?.SelectEmployeePhoneNumber);
        setMobile(true);
      } else {
        setMobile(false);
      }
    }

    if (
      formData?.SelectEmployeeName &&
      formData?.SelectEmployeeType?.code &&
      formData?.SelectEmployeeId &&
      formData?.SelectEmployeePhoneNumber &&
      formData?.gender &&
      formData?.SelectDateofBirthEmployment &&
      formData?.SelectDateofEmployment &&
      formData?.SelectEmployeeDepartment &&
      formData?.SelectEmployeeDesignation &&
      formData?.RolesAssigned &&
      (isEdit || formData?.Jurisdictions)
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const memoizedDefaultValues = useMemo(() => {
    return editUser === true && data?.Employees ? editDefaultUserValue(data?.Employees, tenantId) : {};
  }, [editUser, data?.Employees, tenantId]);

  const createEmployeeService = async (payload) => {
    try {
      setLoading(true);
      await mutation.mutateAsync(
        {
          Employees: payload,

          key: "CREATE",
          action: "CREATE",
        },
        {
          onSuccess: (res) => {
            setLoading(false);
            navigate(`/${window?.contextPath}/employee/hrms/response`, {
              replace: true,
              state: {
                isCampaign: ReposeScreenType.CREAT_EUSER,
                state: "success",
                info: t("HR_EMPLOYEE_ID_LABEL"),
                fileName: res?.Employees?.[0],
                description: t(`HRMS_CREATE_EMPLOYEE_INFO`),
                message: t(`EMPLOYEE_RESPONSE_CREATE`),
                back: t(`CORE_COMMON_GO_TO_HOME_CREATE_SUCCESS`),
                backlink: `/${window.contextPath}/employee`,
              },
            });
          },
          onError: (error) => {
            setLoading(false);
            navigate(`/${window?.contextPath}/employee/hrms/response`, {
              replace: true,
              state: {
                isCampaign: ReposeScreenType.CREATE_USER_ERROR,
                state: "error",
                info: null,
                fileName: error?.Employees?.[0],
                description: null,
                message: t(`EMPLOYEE_RESPONSE_CREATE_ACTION_ERROR`),
                back: t(`CORE_COMMON_GO_TO_HOME_CREATE_ERROR`),
                backlink: `/${window.contextPath}/employee`,
              },
            });

            //t(`ERR_PLAN_UPDATE_FAILED`)
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      setLoading(false);
      // setTriggerEstimate(true);
    }
  };

  const updateEmployeeService = async (payload) => {
    try {
      setLoading(true);
      await mutationUpdate.mutateAsync(
        {
          Employees: payload,
        },
        {
          onSuccess: (res) => {
            setLoading(false);
            navigate(`/${window?.contextPath}/employee/hrms/response`, {
              replace: true,
              state: {
                isCampaign: ReposeScreenType.EDIT_USER,
                state: "success",
                info: t("HR_EMPLOYEE_ID_LABEL"),
                fileName: res?.Employees?.[0],
                description: null,
                message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION`),
                back: t(`CORE_COMMON_GO_TO_HOME_UPDATE_SUCCESS`),
                backlink: `/${window.contextPath}/employee`,
              },
            });
          },
          onError: (error) => {
            setLoading(false);
            navigate(`/${window?.contextPath}/employee/hrms/response`, {
              replace: true,
              state: {
                isCampaign: ReposeScreenType.EDIT_USER_ERROR,
                state: "error",
                info: t("HR_EMPLOYEE_ID_LABEL"),
                fileName: error?.Employees?.[0],
                description: t(error ? `${error[0]?.code}` : ""),
                message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION_ERROR`),
                back: t(`CORE_COMMON_GO_TO_HOME_UPDATE_ERROR`),
                backlink: `/${window.contextPath}/employee`,
              },
            });
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      // setTriggerEstimate(true);
    }
  };

  const onSubmit = async (formData) => {
    setShowToast(null);

    try {
      if (editUser == false) {
        const type = await checkIfUserExist(formData, tenantId);
        if (type == true) {
          setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID", type: "error" });
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
      setShowToast({ key: true, label: t(err ? `${err?.code}` : "BAD_REQUEST"), type: "error" });
      setShowModal(false);
    }
  };

  const openModal = async (e) => {
    // Check validations first — show specific toast and stop if any fail
    if (!isEdit && e?.SelectEmployeeName && !e.SelectEmployeeName.match(Digit.Utils.getPattern("Name"))) {
      setShowToast({ key: true, label: "CORE_COMMON_APPLICANT_NAME_INVALID", type: "error" });
      return;
    }

    const password = e?.employeePassword;
    const confirmPassword = e?.employeeConfirmPassword;
    const passwordPattern = getPattern("Password");
    if (password && !password.match(passwordPattern)) {
      setShowToast({ key: true, label: "CORE_COMMON_APPLICANT_PASSWORD_INVALID", type: "error" });
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setShowToast({ key: true, label: "CORE_COMMON_APPLICANT_CONFIRM_PASSWORD_INVALID", type: "error" });
      return;
    }

    const emailPattern = getPattern("Email");
    if (e?.SelectEmployeeEmailId && !e.SelectEmployeeEmailId.match(emailPattern)) {
      setShowToast({ key: true, label: "CS_PROFILE_EMAIL_ERRORMSG", type: "error" });
      return;
    }

    if (e?.SelectEmployeePhoneNumber && !validatePhoneNumber(e.SelectEmployeePhoneNumber)) {
      setShowToast({ key: true, label: "CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID", type: "error" });
      return;
    }

    if (isEdit && mobile) {
      const type = await checkIfUserExistWithPhoneNumber(e, tenantId);
      if (type == true) {
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID", type: "error" });
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
        setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOBILE_NUMBER", type: "error" });
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

  // const fConfig = CreateEmployeeConfig?.CreateEmployeeConfig?.[0];
  //const fConfig = mdmsData ? mdmsData : CreateEmployeeConfig?.CreateEmployeeConfig?.[0];


  // Original config assignment
  const fConfig = mdmsData ? mdmsData : CreateEmployeeConfig?.CreateEmployeeConfig?.[0];

  // Define your new component to be injected
  const userAssignmentComponent = {
    type: "component",
    isMandatory: true,
    component: "UserAssignment",
    key: "UserAssignment",
    withoutLabel: true,
    populators: {
      name: "UserAssignment",
    },
  };

  // Find the section where you want to insert (HR_NEW_EMPLOYEE_FORM_HEADER)
  const newEmployeeFormSection = fConfig?.form?.find(
    (section) => section.head === "HR_NEW_EMPLOYEE_FORM_HEADER"
  );


  if (boundaryCodep) {

    if (newEmployeeFormSection) {
      const body = newEmployeeFormSection.body;

      // Check if UserAssignment already exists
      const alreadyExists = body.some((field) => field.key === "UserAssignment");

      if (!alreadyExists) {
        // Find index of RolesAssigned field
        const index = body.findIndex((field) => field.key === "RolesAssigned");

        if (index !== -1) {
          // Insert UserAssignment right after RolesAssigned
          body.splice(index + 1, 0, userAssignmentComponent);
        }
      }
    }
  }


  const updatedConfig = useMemo(
    () =>
      Digit.Utils.preProcessMDMSConfig(
        t,
        fConfig,
        {
          updateDependent: [
            {
              key: "SelectDateofBirthEmployment",
              value: [formattedDate]
            },
            {
              key: "SelectDateofEmployment",
              value: [new Date().toISOString().split("T")[0]]
            }

          ],
        }
      ),
    [fConfig,]
  );

  const config = isEdit
    ? updatedConfig?.form?.map((section) => ({
      ...section,
      body: section.body.filter(
        (field) => field.key !== "employeePassword" && field.key !== "employeeConfirmPassword" && field.key !== "Jurisdictions"
      ),
    }))
    : updatedConfig?.form;

  if (isHRMSSearchLoading || isHRMSConfigLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />
  }

  if (loading) {
    return <Loader variant={"OverlayLoader"} />
  }

  return (
    <React.Fragment>
      <div style={{ marginBottom: "80px" }}>
        <div
          style={
            isMobile
              ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
              : { marginLeft: "0px", fontFamily: "calibri", color: "#FF0000" }
          }
        >
          {
            <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
              {t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}
            </HeaderComponent>
          }
        </div>

        <FormComposerV2
          defaultValues={memoizedDefaultValues}
          heading={t("")}
          config={config}
          onSubmit={openModal}
          className={"custom-form"}
          onFormValueChange={onFormValueChange}
          isDisabled={!canSubmit}
          label={t("HR_COMMON_BUTTON_SUBMIT")}
          actionClassName={"actionBarClass"}
          className="custom-form-employee-create"
        />

        {showToast && (
          <Toast
            type={showToast.type}
            error={showToast.key}
            isDleteBtn="true"
            label={t(showToast.label)}
            onClose={() => {
              setShowToast(null);
            }}
            style={{zIndex:10001}}
          />
        )}
        {showModal && <ActionPopUp headingMsg={"READY_TO_SUBMIT"} onClose={closeModal} onSubmit={() => onSubmit(createEmployeeData)} />}
      </div>
    </React.Fragment>
  );
};
export default CreateEmployee;
