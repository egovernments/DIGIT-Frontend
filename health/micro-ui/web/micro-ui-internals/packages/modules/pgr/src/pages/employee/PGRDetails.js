import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HeaderComponent, Button, Card, Footer, ActionBar, SummaryCard, Tag, Timeline } from "@egovernments/digit-ui-components";
import { Loader, WorkflowModal } from "@egovernments/digit-ui-react-components";
import { convertEpochFormateToDate } from "../../utils";
import TimelineWrapper from "../../components/TimeLineWrapper";

const PGRDetails = () => {
  const [openActivate, setOpenActivate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const activeworkflowActions = [
    { code: "ASSIGN", name: t("HR_COMMON_EDIT_CAMPAIGNS_HEADER") },
    { code: "DEACTIVATE_EMPLOYEE_HEAD", name: t("HR_DEACTIVATE_EMPLOYEE_HEAD") },
    { code: "COMMON_EDIT_EMPLOYEE_HEADER", name: t("HR_COMMON_EDIT_EMPLOYEE_HEADER") },
  ];
  const deactiveworkflowActions = [{ code: "ACTIVATE_EMPLOYEE_HEAD", name: t("HR_ACTIVATE_EMPLOYEE_HEAD") }];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutationUpdate = Digit.Hooks.pgr.usePGRUpdate(tenantId);

  const history = useHistory();
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState(null);

  const { isLoading, isError, error, data } = Digit.Hooks.pgr.usePGRSearch({ serviceRequestId: id }, tenantId);

  // const campaignFetch = async (fetchedEmployeeId) => {
  //   const camData = await searchStaff(fetchedEmployeeId, tenantId);
  //   setcampaign(camData);
  // };

  const { isLoading: isWorkflowLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: {
        tenantId: tenantId,
        history: true,
        businessIds: id,
    },
    config: {
        enabled: true,
    },
    changeQueryName: id,
}
);

  const workflowConfig = {
    label: {
      heading: `PGR_HEADER_${selectedAction?.action}`,
      cancel: "CORE_COMMON_CANCEL",
      submit: "CORE_COMMON_SUBMIT",
    },
    disable: false,
    form: [
      {
        body: [
          {
            type: "component",
            isMandatory: true,
            component: "PGRAssigneeComponent",
            key: "SelectedAssignee",
            label: "CS_COMMON_EMPLOYEE_NAME",
            populators: {
              name: "SelectedAssignee",
            },
          }
        ],
      }
    ]
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div
        style={
          false ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" } : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        {
          <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
            {t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")}
          </HeaderComponent>
        }
      </div>
      {
        <div>
          <SummaryCard
            asSeperateCards
            className=""
            header="Heading"
            layout={1}
            sections={[
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_COMPLAINT_NO"),
                    type: "text",
                    value: data?.ServiceWrappers[0].service?.serviceRequestId || "NA",
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
                    type: "text",
                    value: t(data?.ServiceWrappers[0].service?.serviceCode || "NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_FILED_DATE"),
                    value: convertEpochFormateToDate(data?.ServiceWrappers[0].service?.auditDetails?.createdTime) || t("NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_AREA"),
                    value: t(data?.ServiceWrappers[0].service?.address?.locality?.code || "NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_CURRENT_STATUS"),
                    value: t(`CS_COMPLAINT_STATUS_${data?.ServiceWrappers[0].service?.applicationStatus || "NA"}`),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_LANDMARK__DETAILS"),
                    value: data?.ServiceWrappers[0].service?.address?.landmark || "NA",
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION"),
                    value: data?.ServiceWrappers[0].service?.description || "NA",
                  },
                  {
                    inline: true,
                    label: t("CORE_LOGIN_USERNAME"),
                    value: data?.ServiceWrappers[0].service?.user?.name || "NA",
                  },
                  {
                    inline: true,
                    label: t("ES_COMMON_CONTACT_DETAILS"),
                    value: data?.ServiceWrappers[0].service?.user?.mobileNumber || "NA",
                  },
                ],
                header: "",
                subHeader: "",
              },
              // Personal Details
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: false,
                    label: "",
                    type: "custom",
                    renderCustomContent: (value) => {
                      return (<TimelineWrapper isWorkFlowLoading={isWorkflowLoading} workflowData={workflowData} businessId={id} labelPrefix="WF_PGR_"></TimelineWrapper>);
                    }
                  },
                ],
                header: "CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE",
                subHeader: "",
              },
            ]}
            style={{}}
            subHeader="Subheading"
            type="primary"
          />
        </div>
      }

      {/* action bar */}
      {
        isWorkflowLoading ? <Loader/> : <Footer
          actionFields={[
            <Button
              className="custom-class"
              iconFill=""
              isSearchable
              label={t("ES_COMMON_TAKE_ACTION")}
              menuStyles={{
                bottom: "40px",
              }}
              onClick={function noRefCheck() {}}
              onOptionSelect={(e) => {
               setSelectedAction(e);
               setOpenModal(true);
              }}
              options={workflowData?.ProcessInstances?.[0]?.nextActions}
              optionsKey="action"
              style={{}}
              title=""
              type="actionButton"
            />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToLeft="Right"
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />
      }
      {
        openModal && (
          <WorkflowModal
          config={workflowConfig}
          closeModal={() => setOpenModal(false)}
          onSubmit={(data) => {
            console.log("data", data);
          }}
          ></WorkflowModal>
        )
      }
    </React.Fragment>
  );
};

export default PGRDetails;