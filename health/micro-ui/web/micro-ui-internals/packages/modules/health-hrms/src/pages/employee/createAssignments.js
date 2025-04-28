import { HeaderComponent, FormComposerV2, Toast, Loader, Header } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { campaignAssignmentConfig } from "../../components/config/campaignAssignmentConfig";
import { convertDateToEpoch } from "../../utils/utlis";
import { editDefaultAssignmentValue } from "../../services/service";
import Urls from "../../services/urls";
import { ReposeScreenType } from "../../constants/enums";

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
  // Fetch employee details using HRMS search
  const { isLoadings, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["CampaignAssignmentFieldsConfig"], {
    select: (data) => {
      return data?.["egov-hrms"]?.CampaignAssignmentFieldsConfig;
    },
    retry: false,
    enable: false,
  });

  const [staffId, setStaffId] = useState(null);

  // Update staffId once data is fetched
  useEffect(() => {
    if (data?.Employees?.length > 0) {
      setStaffId(data.Employees[0]?.user?.userServiceUuid);
    }
  }, [data]);

  // API request criteria for fetching project staff details
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
  // Fetch project staff details using custom API hook
  const { isLoading: isEstimateMusterRollLoading, data: projectStaff } = Digit.Hooks.useCustomAPIHook(reqCri);

  // Re-render form when relevant data changes
  useEffect(() => {
    setFormKey((prevKey) => prevKey + 1);
  }, [editCampaign, projectStaff, tenantId]);

  const onFormValueChange = (setValue = true, formData) => {};

  // Function to create staff assignment
  const createStaffService = async (payload) => {
    try {
      await mutation.mutateAsync(
        {
          staffCreateData: payload,
        },
        {
          onSuccess: (res) => {
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: editCampaign ? ReposeScreenType.EDIT_ASSIGNED_CAMPAIGN : ReposeScreenType.ASSIGN_CAMPAIGN,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              message: editCampaign ? t(`CAMPAIGN_RESPONSE_UPDATE_ACTION`) : t(`CAMPAIGN_RESPONSE_CREATE_ACTION`),
              description: editCampaign ? t("HRMS_CAMPAIGN_ASSIGNED_INFO") : t(`CAMPAIGN_RESPONSE_CREATE_ACTION`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            history.replace(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: editCampaign ? ReposeScreenType.EDIT_ASSIGNED_CAMPAIGN_ERROR : ReposeScreenType.EDIT_ASSIGNED_CAMPAIGN_ERROR,
              state: "error",
              info: t(""),
              fileName: error?.Employees?.[0],
              message: editCampaign ? t("CAMPAIGN_RESPONSE_UPDATE_ACTION_ERROR") : t(`CAMPAIGN_RESPONSE_CREATE_ACTION_ERROR`),
              description: t(``),
              back: t("GO_BACK_TO_HOME"),
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

  // Function to delete staff assignment
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

  // Function to handle form submission
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
    } catch (err) {}
  };

  // Show loader while data is being fetched
  if (isLoadings || isLoading) {
    return <Loader />;
  }

  const config = mdmsData ? mdmsData : campaignAssignmentConfig;
  //const config =  campaignAssignmentConfig;

  return (
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
            {t("HR_COMMON_ASSIGN_CAMPAIGN_HEADER")}
          </HeaderComponent>
        }
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
