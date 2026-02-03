import { CardText, FormComposerV2, Loader, Modal, } from "@egovernments/digit-ui-components";
import set from "lodash/set";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { configEmployeeActiveApplication } from "./Modal/EmployeeActivation";
import { configEmployeeApplication } from "./Modal/EmployeeAppliaction";
import { configEmployeePasswordReset } from "./Modal/EmployeePasswordReset";

/**
 * handles multiple employee-related actions
 * @param {*} param0
 * @returns
 * TODO:[need to configure the actions in the MDMS]
 */

const EmployeeAction = ({ t, action, tenantId, closeModal, submitAction, applicationData, resendOtpFn, setToast }) => {
  const history = useHistory();
  const [config, setConfig] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const { isLoading, isError, errors, data, ...rest } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "DeactivationReason");

  function maskEmail(email) {
    const [localPart, domain] = email?.split("@");
    const maskedLocalPart = localPart?.slice(0, -4) + "****";
    return `${maskedLocalPart}@${domain}`;
  }


  useEffect(() => {
    switch (action) {
      case "PASSWORD_RESET":
        return setConfig(configEmployeePasswordReset({ t }));
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setConfig(
          configEmployeeApplication({
            t,
            action,
            selectFile,
            uploadedFile,
            setUploadedFile,
            selectedReason,
            reasons,
            selectReason,
          })
        );
      case "ACTIVATE_EMPLOYEE_HEAD":
        return setConfig(
          configEmployeeActiveApplication({
            t,
            action,
            selectFile,
            uploadedFile,
            setUploadedFile,
            selectedReason,
            reasons,
            selectReason,
            employees: applicationData?.Employees[0] || {},
          })
        );
      default:
        break;
    }
  }, [action, uploadedFile, reasons]);

  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };

  function selectReason(e) {
    setSelectedReason(e);
  }
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );

  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };

  function selectFile(e) {
    setFile(e.target.files[0]);
  }
  useEffect(() => {
    setReasons(
      data?.["egov-hrms"]?.DeactivationReason.map((ele) => {
        ele["i18key"] = "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code;
        return ele;
      })
    );
  }, [data]);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            setUploadedFile(null);
            const response = await Digit.UploadServices.Filestorage("HRMS", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  async function submit(data) {
    // useHRMSUpdate
    data.effectiveFrom = new Date(data.effectiveFrom).getTime();
    data.reasonForDeactivation = selectedReason.code;
    let Employees = [...applicationData.Employees];

    switch (action) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        if (file) {
          let documents = {
            referenceType: "DEACTIVATION",
            documentId: uploadedFile,
            documentName: file.name,
          };
          applicationData.Employees[0]["documents"].push(documents);
        }

        set(Employees[0], "deactivationDetails[0].effectiveFrom", new Date()?.getTime());
        set(Employees[0], "deactivationDetails[0].orderNo", data?.orderNo);
        set(Employees[0], "deactivationDetails[0].reasonForDeactivation", data?.reasonForDeactivation);
        set(Employees[0], "deactivationDetails[0].remarks", data?.remarks);

        Employees[0].isActive = false;
        history.replace(`/${window?.contextPath}/employee/hrms/response`, {
          Employees,
          key: "UPDATE",
          action: "DEACTIVATION",
        });
        break;
      case "ACTIVATE_EMPLOYEE_HEAD":
        if (file) {
          let documents = {
            referenceType: "ACTIVATION",
            documentId: uploadedFile,
            documentName: file.name,
          };
          applicationData.Employees[0]["documents"].push(documents);
        }

        set(Employees[0], "reactivationDetails[0].effectiveFrom", new Date()?.getTime());
        set(Employees[0], "reactivationDetails[0].orderNo", data?.orderNo);
        set(Employees[0], "reactivationDetails[0].reasonForDeactivation", data?.reasonForDeactivation);
        set(Employees[0], "reactivationDetails[0].remarks", data?.remarks);
        Employees[0].isActive = true;

        history.replace(`/${window?.contextPath}/employee/hrms/response`, {
          Employees,
          key: "UPDATE",
          action: "ACTIVATION",
        });
        break;
      case "PASSWORD_RESET":
        if (data?.password && data?.confirmPassword && data.password === data.confirmPassword) {
          if (otp.length !== 6) {
            setResendOtpToast({ key: "error", action: "CS_OTP_INVALID" });
            setError(t("CS_OTP_INVALID"));
            return;
          }
          if (!data.password.match(Digit.Utils.getPattern("Password"))) {
            setResendOtpToast({ key: "error", action: "CORE_COMMON_APPLICANT_PASSWORD_INVALID" });
            setError(t("CORE_COMMON_APPLICANT_PASSWORD_INVALID"));
            return;
          }
          const requestData = {
            userName: applicationData.Employees?.[0]?.code,
            newPassword: data.confirmPassword,
            otpReference: otp,
            tenantId,
            type: Digit.UserService.getType().toUpperCase(),
          };

          Digit.UserService.changePassword(requestData, tenantId)
            .then((response) => {
              setToast({ key: "success", action: t("PASSWORD_RESET_SUCCESS") });
              closeModal();
            })
            .catch((err) => {
              setResendOtpToast({ key: "error", action: err?.response?.data?.error?.fields?.[0]?.message || t("ES_SOMETHING_WRONG") });
            });
        } else {
          setResendOtpToast({ key: "error", action: "CS_PASSWORD_NOT_EQUAL" });
          setError(t("CS_PASSWORD_NOT_EQUAL"));
        }
    }
  }

  switch (action) {
    case "CREATE_EMPLOYEE":
      return (
        <Modal
          headerBarMain={<Heading label={t("READY_TO_SUBMIT")} />}
          actionCancelLabel={t("CANCEL")}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t("SUBMIT")}
          actionSaveOnSubmit={submitAction}
          formId="modal-action"
        >
          <CardText style={{ margin: "9px" }}>{t("HR_READY_TO_SUBMIT_TEXT")}</CardText>
        </Modal>
      );
    default:
      return action && config?.form ? (
        <Modal
          headerBarMain={<Heading label={t(config?.label?.heading)} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t(config?.label?.submit)}
          actionSaveOnSubmit={() => {}}
          formId="modal-action"
          isDisabled={!selectedReason}
        >
          <FormComposerV2 config={config?.form} noBoxShadow inline childrenAtTheBottom onSubmit={submit} formId="modal-action" />
        </Modal>
      ) : (
        <Loader />
      );
  }
};
export default EmployeeAction;
