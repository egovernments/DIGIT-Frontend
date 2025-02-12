import { FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig } from "../../components/config/config";
import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";
//import ActionModal from "../../components/Modal";
import { HRMS_CONSTANTS } from "../../constants/constants";

import { convertDateToEpoch } from "../../components/Utils/index";

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
  const hrmsUserId = Digit.SessionStorage.get("HRMSUserId");
  const employmentDate = Digit.SessionStorage.get("employmentDate");
  const [createEmployeeData, setCreateEmployeeData] = useState({});
  const [assignCampaigns, setAssignCampaigns] = useState(false);
  const hrmsUserName = Digit.SessionStorage.get("HRMSUserName");
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const userProjectDetails = Digit.SessionStorage.get("currentProject");

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
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    if (hrmsUserId && employmentDate) {
      setAssignCampaigns(!!new URLSearchParams(location.search).get("assignCampaigns"));
    } else {
      const queryParams = new URLSearchParams(location.search);

      if (queryParams.has("assignCampaigns")) {
        queryParams.delete("assignCampaigns");
        history.replace({
          search: queryParams.toString(),
        });
      }
    }
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

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
  useEffect(() => {
    if (
      mobileNumber &&
      (mobileNumber.length === 9 || mobileNumber.length === 10) &&
      (mobileNumber.match(Digit.Utils.getPattern("MobileNo")) || mobileNumber.match(Digit.Utils.getPattern("MozMobileNo")))
    ) {
      setShowToast(null);
      setPhonecheck(true);
      // Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
      //   if (result.Employees.length > 0) {
      //     setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOB" });
      //     setPhonecheck(false);
      //   } else {
      //     setPhonecheck(true);
      //   }
      // });
    } else {
      setPhonecheck(true);
    }
  }, [mobileNumber]);

  const defaultValues = {
    Jurisdictions: [
      {
        id: undefined,
        key: 1,
        hierarchy: hierarchyType,
        boundaryType: userProjectDetails?.[0]?.address?.boundaryType, //TODO: if national level boundary data label is changed in mdms, this must be changed
        boundary: userProjectDetails?.[0]?.address?.boundary,
        roles: [],
      },
    ],
  };

  const onFormValueChange = (setValue = true, formData) => {
    debugger;
    if (assignCampaigns) {
      for (let i = 0; i < formData?.CampaignsAssignment?.length; i++) {
        if (!formData?.CampaignsAssignment?.[i].selectedProject) {
          setCampaignAssignCheck(false);
          setSubmitValve(false);
          break;
        }
        setCampaignAssignCheck(true);
        setSubmitValve(true);
      }
      return;
    }
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
    for (let i = 0; i < formData?.Jurisdictions?.length; i++) {
      let key = formData?.Jurisdictions[i];
      if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.tenantId && key?.roles?.length > 0)) {
        setcheck(false);
        break;
      } else {
        setcheck(true);
      }
    }

    let setassigncheck = true;
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

  const onSubmit = (data) => {
    if (!assignCampaigns) {
      if (data.Jurisdictions.filter((juris) => juris.tenantId == tenantId).length == 0) {
        setShowToast({ key: true, label: "ERR_BASE_TENANT_MANDATORY" });
        setShowModal(false);
        return;
      }
      if (
        !Object.values(
          data.Jurisdictions.reduce((acc, sum) => {
            if (sum && sum?.tenantId) {
              acc[sum.tenantId] = acc[sum.tenantId] ? acc[sum.tenantId] + 1 : 1;
            }
            return acc;
          }, {})
        ).every((s) => s == 1)
      ) {
        setShowToast({ key: true, label: "ERR_INVALID_JURISDICTION" });
        setShowModal(false);
        return;
      }
      let roles = data?.Jurisdictions?.map((ele) => {
        return ele.roles?.map((item) => {
          item["tenantId"] = tenantId;
          return item;
        });
      });

      const mappedroles = [].concat.apply([], roles);
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
      /* use customiseCreateFormData hook to make some chnages to the Employee object */
      Employees = Digit?.Customizations?.HRMS?.customiseCreateFormData
        ? Digit.Customizations.HRMS.customiseCreateFormData(data, Employees)
        : Employees;

      if (data?.SelectEmployeeId?.code && data?.SelectEmployeeId?.code?.trim().length > 0) {
        Digit.HRMSService.search(tenantId, null, { codes: data?.SelectEmployeeId?.code }).then((result, err) => {
          if (result.Employees.length > 0) {
            setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
            setShowModal(false);
            return;
          } else {
            navigateToAcknowledgement(Employees);
          }
        });
      } else {
        navigateToAcknowledgement(Employees);
      }
    } else {
      const assignedCampaignData = data?.CampaignsAssignment?.filter((c, i) => c?.selectedProject != null);
      let ProjectStaffCreatePayload = [];
      let selectedCampaignBoundary = [];
      for (let i = 0; i < assignedCampaignData?.length; i++) {
        ProjectStaffCreatePayload.push({
          tenantId: tenantId,
          userId: hrmsUserId,
          projectId: assignedCampaignData?.[i].selectedProject?.id,
          startDate: assignedCampaignData?.[i]?.fromDate
            ? convertDateToEpoch(assignedCampaignData?.[i]?.fromDate)
            : assignedCampaignData?.[i].selectedProject?.startDate,
          endDate:
            assignedCampaignData?.[i]?.toDate != null
              ? convertDateToEpoch(assignedCampaignData?.[i]?.toDate) > assignedCampaignData?.[i].selectedProject?.endDate
                ? assignedCampaignData?.[i].selectedProject?.endDate
                : convertDateToEpoch(assignedCampaignData?.[i]?.toDate)
              : assignedCampaignData?.[i].selectedProject?.endDate,
        });
        selectedCampaignBoundary.push(assignedCampaignData?.[i]?.selectedProject?.address?.boundary);
      }
      navigateToCampaignAssignmentAcknowledgement(ProjectStaffCreatePayload, selectedCampaignBoundary);
    }
  };
  const openModal = (e) => {
    setCreateEmployeeData(e);
    setShowModal(true);
  };
  if (isLoading) {
    return <Loader />;
  }
  const config = mdmsData?.config ? mdmsData.config : newConfig;
  const campaignAssignConfig = mdmsData?.campaignAssignConfig ? mdmsData.campaignAssignConfig : campaignAssignmentConfig;
  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        {!assignCampaigns && <Header>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Header>}
        {assignCampaigns && <Header>{t("HR_COMMON_ASSIGN_CAMPAIGN_HEADER")}</Header>}
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
