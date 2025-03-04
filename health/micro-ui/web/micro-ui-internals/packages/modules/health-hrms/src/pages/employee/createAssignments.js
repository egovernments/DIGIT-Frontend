import { FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";
import { convertDateToEpoch } from "../../utils/utlis";
import { editDefaultAssignmentValue } from "../../services/service";
import Urls from "../../services/urls";

const AssignCampaign = ({ editCampaign = false }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);

  const [formKey, setFormKey] = useState(0); // Force re-render

  const [showToast, setShowToast] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  // const location = useLocation();
  const mutation = Digit.Hooks.hrms.useHRMSStaffCreate(tenantId);
  const deleteMutation = Digit.Hooks.hrms.useHRMSStaffDelete(tenantId);
  //const fetchMutation = Digit.Hooks.hrms.useHRMSStaffSearch(tenantId);

  const isMobile = window.Digit.Utils.browser.isMobile();

  const { isLoadings, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    if (data?.Employees?.length > 0) {
      setStaffId(data.Employees[0]?.user?.userServiceUuid);
    }
  }, [data]);

  const reqCri = {
    url: Urls.hcm.searchStaff,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
    body: {
      ProjectStaff: {
        staffId: staffId ? [staffId] : [],
      },
    },
    config: {
      enabled: !!staffId,
      select: (data) => {
        return data.ProjectStaff;
      },
    },
  };

  const { isLoading: isEstimateMusterRollLoading, data: projectStaff } = Digit.Hooks.useCustomAPIHook(reqCri);

  console.log("projectStaff", projectStaff);

  useEffect(() => {
    setFormKey((prevKey) => prevKey + 1);
  }, [editCampaign, projectStaff, tenantId]);

  // const fetchAssignMentDetails = async (payload) => {
  //   if (!payload) return;
  //   debugger
  //   try {
  //     await fetchMutation.mutateAsync(
  //       {
  //         ProjectStaff: {
  //           staffId: payload,
  //         },
  //       },
  //       {
  //         onSuccess: (res) => {
  //           debugger;
  //           history.push(`/${window?.contextPath}/employee/hrms/response`, {
  //             isCampaign: true,
  //             state: "success",
  //             info: t("HR_EMPLOYEE_ID_LABEL"),
  //             fileName: res?.Employees?.[0],
  //             description: t(`EMPLOYEE_RESPONSE_CREATE_ACTION`),
  //             message: t(`EMPLOYEE_RESPONSE_CREATE`),
  //             back: t(`GO_BACK_TO_HOME`),
  //             backlink: `/${window.contextPath}/employee`,
  //           });
  //         },
  //         onError: (error) => {
  //           debugger;
  //           history.push(`/${window?.contextPath}/employee/hrms/response`, {
  //             isCampaign: true,
  //             state: "error",
  //             info: t("Testing"),
  //             fileName: error?.Employees?.[0],
  //             description: t(`EMPLOYEE_RESPONSE_CREATE`),
  //             message: t(`EMPLOYEE_RESPONSE_CREATE`),
  //             back: t(`GO_BACK_TO_HOME`),
  //             backlink: `/${window.contextPath}/employee`,
  //           });
  //           // setTriggerEstimate(true);
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     debugger;
  //     // setTriggerEstimate(true);
  //   }
  // };

  // useEffect(() => {
  //   if (editCampaign == true && id) {
  //   debugger
  //     fetchAssignMentDetails(id);
  //   }
  // },[id]);

  const onFormValueChange = (setValue = true, formData) => {};

  const createStaffService = async (payload) => {
    try {
      await mutation.mutateAsync(
        {
          staffCreateData: payload,
        },
        {
          onSuccess: (res) => {
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: true,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              message: t(`CAMPAIGN_RESPONSE_UPDATE_ACTION`),
              description: editCampaign ? t("HRMS_CAMPAIGN_ASSIGNED_INFO") : t(`CAMPAIGN_RESPONSE_CREATE_ACTION`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: true,
              state: "error",
              info: t("Testing"),
              fileName: error?.Employees?.[0],
              message: editCampaign ? t("CAMPAIGN_RESPONSE_UPDATE_ACTION") : t(`CAMPAIGN_RESPONSE_CREATE_ACTION`),
              description: t(`HRMS_CAMPAIGN_ASSIGNED_INFO`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
            // setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      // setTriggerEstimate(true);
    }
  };

  const deleteStaffService = async (payload) => {
    try {
      return await deleteMutation.mutateAsync(payload, {
        onSuccess: (res) => {
          return true;
        },
        onError: (error) => {
          return true;
        },
      });
    } catch (error) {
      return true;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const assignedCampaignData = formData?.CampaignsAssignment?.filter((c, i) => c?.selectedProject != null);
      let ProjectStaffCreatePayload = [];
      let selectedCampaignBoundary = [];
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
      let s = await deleteStaffService(projectStaff);
      await createStaffService(ProjectStaffCreatePayload);
    } catch (err) {
      debugger;
    }
  };

  if (isLoadings) {
    return <Loader />;
  }
  const config = campaignAssignmentConfig;

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
        key={formKey}
        defaultValues={editCampaign && projectStaff ? editDefaultAssignmentValue(projectStaff, tenantId) : ""}
        heading={t("")}
        config={config}
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
