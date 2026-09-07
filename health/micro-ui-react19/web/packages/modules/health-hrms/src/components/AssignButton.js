import { Button, FormComposerV2, Loader, PopUp, Toast } from "@egovernments/digit-ui-components";
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { convertDateToEpoch } from "../utils/utlis";

const formConfig = [
  {
    body: [
      {
        inline: true,
        label: "HR_CAMPAIGN_FROM_DATE_LABEL",
        isMandatory: true,
        key: "startDate",
        type: "date",
        populators: {
          name: "startDate",
          required: true,
          error: "CORE_COMMON_REQUIRED_ERRMSG",
        },
      },
      {
        inline: true,
        label: "HR_CAMPAIGN_TO_DATE_LABEL",
        isMandatory: false,
        key: "endDate",
        type: "date",
        populators: {
          name: "endDate",
          required: false,
          error: "CORE_COMMON_REQUIRED_ERRMSG",
        },
      },
    ],
  },
];

const AssignButton = ({ row, t }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id } = useParams();
  const projectContextPath = (window && window.globalConfigs && window.globalConfigs.getConfig("PROJECT_SERVICE_PATH")) || "health-project";

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const sessionFormData = useRef({});

  const { isLoading: isHRMSLoading, data: hrmsData } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);
  const employeeUUID = hrmsData && hrmsData.Employees && hrmsData.Employees[0] && hrmsData.Employees[0].user && hrmsData.Employees[0].user.userServiceUuid;

  const { isLoading: isStaffLoading, data: projectStaff, revalidate: revalidateProjectStaff } = Digit.Hooks.useCustomAPIHook({
    url: "/" + projectContextPath + "/staff/v1/_search",
    params: { tenantId, limit: 100, offset: 0 },
    body: {
      ProjectStaff: {
        staffId: employeeUUID ? [employeeUUID] : [],
      },
    },
    config: {
      enabled: !!employeeUUID,
      select: (data) => data && data.ProjectStaff,
    },
    changeQueryName: employeeUUID || "no-uuid",
  });

  const createStaffMutation = Digit.Hooks.hrms.useHRMSStaffCreate(tenantId);
  const deleteStaffMutation = Digit.Hooks.hrms.useHRMSStaffDelete(tenantId);

  const isAssigned = !!(projectStaff && projectStaff.length > 0 && projectStaff.some((item) => item.projectId === (row && row.id)));
  const assignedStaff = projectStaff && projectStaff.find((item) => item.projectId === (row && row.id));

  const onFormValueChange = (setValue, formData) => {
    sessionFormData.current = { ...sessionFormData.current, ...formData };
  };

  const handleAssign = async () => {
    if (!sessionFormData.current.startDate) {
      setToast({ key: true, label: t("ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS"), type: "error" });
      return;
    }
    setModalOpen(false);
    const payload = {
      tenantId,
      userId: employeeUUID,
      projectId: row && row.id,
      startDate: sessionFormData.current.startDate ? convertDateToEpoch(sessionFormData.current.startDate) : null,
      endDate: sessionFormData.current.endDate ? convertDateToEpoch(sessionFormData.current.endDate) : null,
    };
    try {
      await createStaffMutation.mutateAsync(
        { projectStaff: payload },
        {
          onSuccess: async () => {
            setToast({ key: false, label: t("ASSIGNED_SUCCESSFULLY"), type: "success" });
            if (revalidateProjectStaff) revalidateProjectStaff();
          },
          onError: async () => {
            setToast({ key: true, label: t("FAILED_TO_ASSIGN_CAMPAIGN"), type: "error" });
          },
        }
      );
    } catch (err) {
      setToast({ key: true, label: t("FAILED_TO_ASSIGN_CAMPAIGN"), type: "error" });
    }
  };

  const handleUnassign = async () => {
    try {
      await deleteStaffMutation.mutateAsync(
        { projectStaff: assignedStaff },
        {
          onSuccess: async () => {
            setToast({ key: false, label: t("UNASSIGNED_SUCCESSFULLY"), type: "success" });
            if (revalidateProjectStaff) revalidateProjectStaff();
          },
          onError: async () => {
            setToast({ key: true, label: t("FAILED_TO_UNASSIGN_CAMPAIGN"), type: "error" });
          },
        }
      );
    } catch (err) {
      setToast({ key: true, label: t("FAILED_TO_UNASSIGN_CAMPAIGN"), type: "error" });
    }
  };

  if (isHRMSLoading || isStaffLoading) {
    return <Loader />;
  }

  return (
    <>
      <Button
        variation={isAssigned ? "secondary" : "primary"}
        label={isAssigned ? t("UNASSIGN") : t("ASSIGN")}
        style={{ minWidth: "10rem" }}
        onClick={() => {
          if (isAssigned) {
            handleUnassign();
          } else {
            sessionFormData.current = {};
            setModalOpen(true);
          }
        }}
      />
      {modalOpen && (
        <PopUp
          type={"default"}
          heading={t("ASSIGN_CAMPAIGN_MODAL_TITLE")}
          onClose={() => setModalOpen(false)}
          onOverlayClick={() => setModalOpen(false)}
          style={{ width: "48.438rem" }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CORE_COMMON_CANCEL")}
              title={t("CORE_COMMON_CANCEL")}
              onClick={() => setModalOpen(false)}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CORE_COMMON_SUBMIT")}
              title={t("CORE_COMMON_SUBMIT")}
              onClick={handleAssign}
            />,
          ]}
          sortFooterChildren={true}
        >
          <FormComposerV2
            config={formConfig}
            noBoxShadow
            inline
            childrenAtTheBottom
            onFormValueChange={onFormValueChange}
          />
        </PopUp>
      )}
      {toast && (
        <div className="assign-button-toast-wrapper">
          <Toast
            error={toast.key}
            isDleteBtn={true}
            label={toast.label}
            onClose={() => setToast(null)}
            type={toast.type}
          />
        </div>
      )}
    </>
  );
};

export default AssignButton;
