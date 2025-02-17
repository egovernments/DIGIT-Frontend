import { FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";

import { HRMS_CONSTANTS } from "../../constants/constants";

import { convertDateToEpoch } from "../../utils/utlis";

const AssignCampaign = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);

  const [showToast, setShowToast] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  // const location = useLocation();
  const mutation = Digit.Hooks.hrms.useHRMSStaffCreate(tenantId);
  const isMobile = window.Digit.Utils.browser.isMobile();
  //"A07497961"
  const { isLoadings, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);
  //   useEffect(() => {
  //     if (!editUser && data?.Employees) {
  //       setEditEmployee(editDefaultUserValue(data.Employees, tenantId));
  //     }
  //   }, [data]);

  console.log("data", data);
  const onFormValueChange = (setValue = true, formData) => {};

  const createStaffService = async (payload) => {
    debugger;
    try {
      await mutation.mutateAsync(
        {
          staffCreateData: payload,
        },
        {
          onSuccess: (res) => {
            debugger;
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: true,
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
            debugger;
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
            isCampaign: true,
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

  const onSubmit = async (formData) => {
    try {
      debugger;
      const assignedCampaignData = formData?.CampaignsAssignment?.filter((c, i) => c?.selectedProject != null);
      let ProjectStaffCreatePayload = [];
      let selectedCampaignBoundary = [];
      debugger;
      for (let i = 0; i < assignedCampaignData?.length; i++) {
        ProjectStaffCreatePayload.push({
          tenantId: tenantId,
          userId: data.Employees?.[0].user?.userServiceUuid,
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
        //selectedCampaignBoundary.push(assignedCampaignData?.[i]?.selectedProject?.address?.boundary);
      }
      debugger;
      await createStaffService(ProjectStaffCreatePayload);
    } catch (err) {
      debugger;
    }
  };

  if (isLoadings) {
    return <Loader />;
  }

  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        <Header>{t("HR_COMMON_ASSIGN_CAMPAIGN_HEADER")}</Header>
      </div>
      <FormComposerV2
        // defaultValues={editUser && data?.Employees ? editDefaultUserValue(data?.Employees, tenantId) : ""}
        heading={t("")}
        config={campaignAssignmentConfig}
        onSubmit={onSubmit}
        className={"custom-form"}
        onFormValueChange={onFormValueChange}
        isDisabled={canSubmit}
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
export default AssignCampaign;
