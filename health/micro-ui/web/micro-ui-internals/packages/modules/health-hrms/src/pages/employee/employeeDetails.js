import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { convertEpochToDate } from "../../utils/utlis";
import { searchStaff } from "../../services/service";

import { HeaderComponent, Button, Card, Footer, ActionBar, SummaryCard, Tag, NoResultsFound } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-react-components";
import DeactivatePopUp from "../../components/pageComponents/DeactivatePopUp";
import { ReposeScreenType } from "../../constants/enums";

const EmployeeDetailScreen = () => {
  const [openActivate, setOpenActivate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const activeworkflowActions = [
    { code: "EDIT_CAMPAIGN_ASSIGNMENT", name: t("HR_COMMON_EDIT_CAMPAIGNS_HEADER") },
    { code: "DEACTIVATE_EMPLOYEE_HEAD", name: t("HR_DEACTIVATE_EMPLOYEE_HEAD") },
    { code: "COMMON_EDIT_EMPLOYEE_HEADER", name: t("HR_COMMON_EDIT_EMPLOYEE_HEADER") },
  ];
  const deactiveworkflowActions = [{ code: "ACTIVATE_EMPLOYEE_HEAD", name: t("HR_ACTIVATE_EMPLOYEE_HEAD") }];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutationUpdate = Digit.Hooks.hrms.useHRMSUpdate(tenantId);

  const history = useHistory();
  const { id } = useParams();
  const [campaign, setcampaign] = useState([]);

  const { data: mdmsData, isLoading: isMDMSLoading } = Digit.Hooks.useCommonMDMS(
    Digit.ULBService.getStateId(),
    "egov-hrms",
    ["ActiveWorkflowActions", "DeactiveWorkflows"],
    {
      select: (data) => {
        return data?.["egov-hrms"];
      },
      retry: false,
      enable: false,
    }
  );

  /**
   * Fetches employee details based on the provided employee ID (`id`) and tenant ID (`tenantId`)
   * `isLoading`: Indicates if the data is still being fetched
   * `isError`: Indicates if there was an error during the fetch
   * `error`: Contains error details if the request fails
   * `data`: Contains the fetched employee data
   */
  const { isLoading, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

  const campaignFetch = async (fetchedEmployeeId) => {
    try {
      // Fetch campaign data for the given employee ID
      const camData = await searchStaff(fetchedEmployeeId, tenantId);
      setcampaign(camData);
    } catch (error) {
      setcampaign([]);
    }
  };

  useEffect(() => {
    if (!isLoading && data?.Employees?.length > 0) {
      const fetchedEmployeeId = data.Employees[0]?.user?.userServiceUuid;

      if (fetchedEmployeeId) {
        campaignFetch(fetchedEmployeeId);
      }
    }
  }, [isLoading, data]);

  const getActiveWorkFlowActions = (employeeDetails) => {
    if (employeeDetails?.user?.roles?.some((role) => role?.code === "SYSTEM_ADMINISTRATOR")) {
      return mdmsData?.ActiveWorkflowActions
        ? mdmsData?.ActiveWorkflowActions?.filter((action) => action?.code !== "DEACTIVATE_EMPLOYEE_HEAD")
        : activeworkflowActions.filter((action) => action?.code !== "DEACTIVATE_EMPLOYEE_HEAD");
    }
    return mdmsData?.ActiveWorkflowActions ? mdmsData?.ActiveWorkflowActions : activeworkflowActions;
  };

  const deActivateUser = async (comment, date, reason, order) => {
    let updatedDeactivationDetails = [];

    const existingEmployee = data?.Employees[0];

    if (existingEmployee.deactivationDetails && existingEmployee.deactivationDetails.length > 0) {
      // Update the first object
      updatedDeactivationDetails = existingEmployee.deactivationDetails.map((item, index) =>
        index === 0
          ? {
              ...item,
              effectiveFrom: Date.now(),
              reasonForDeactivation: reason,
              remarks: order,
              orderNo: comment,
            }
          : item
      );
    } else {
      // Create a new object if no existing objects
      updatedDeactivationDetails = [
        {
          effectiveFrom: Date.now(),
          reasonForDeactivation: reason,
          remarks: order,
          orderNo: comment,
        },
      ];
    }

    let employeeData = {
      ...data?.Employees[0], // Keep existing data
      isActive: false, // Update isActive to false
      deactivationDetails: updatedDeactivationDetails,
    };

    try {
      // Call the mutation function to update the employee status
      await mutationUpdate.mutateAsync(
        {
          Employees: [employeeData],
        },
        {
          onSuccess: (res) => {
            // Redirect to response page on successful deactivation
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_DEACTIVATION_ACTION`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            // Handle errors and redirect to error response page
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER_ERROR,
              state: "error",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: error?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION_ERROR`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
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

  const activateUser = async (comment, date, reason, order) => {
    let employeeData = {
      ...data?.Employees[0], // Keep existing data
      isActive: true, // Update isActive to false
    };

    try {
      await mutationUpdate.mutateAsync(
        {
          Employees: [employeeData],
        },
        {
          onSuccess: (res) => {
            // Redirect to response page on successful deactivation
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER,
              state: "success",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: res?.Employees?.[0],
              description: null,
              message: t(`HR_RACTIVATE_SUCCESS_MESSAGE`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            // Handle errors and redirect to error response page
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER_ERROR,
              state: "error",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: error?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION_ERROR`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
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

  if (isLoading || isMDMSLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // horizontal center
          alignItems: "center", // vertical center
          height: "100vh", // take full viewport height
          width: "100%", // full width
        }}
      >
        <Loader />
      </div>
    );
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
            {t("HR_NEW_EMPLOYEE_FORM_HEADER")}
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
                    label: t("HR_EMP_STATUS_LABEL"),
                    type: "text",
                    value: data?.Employees ? (data?.Employees[0].isActive ? t("ACTIVE") : t("INACTIVE")) : t("INACTIVE"),
                  },
                  {
                    inline: true,
                    label: t("HR_USERNAME_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0].code : t(`CORE_COMMON_NA`),
                  },
                  {
                    inline: true,
                    label: t("HR_PASSWORD_LABEL"),
                    value: "******",
                  },
                ],
                header: t("HR_LOGIN_FORM_HEADER"),
                subHeader: "",
              },
              // Personal Details
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: true,
                    label: t("HR_NAME_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0]?.user?.name : t(`CORE_COMMON_NA`),
                  },
                  {
                    inline: true,
                    label: t("HR_MOB_NO_LABEL"),
                    type: "text",

                    value: data?.Employees ? data?.Employees[0]?.user?.mobileNumber : t(`CORE_COMMON_NA`),
                  },
                  {
                    inline: true,
                    label: t("HR_GENDER_LABEL"),
                    value: data?.Employees ? data?.Employees[0]?.user?.gender : t(`CORE_COMMON_NA`),
                  },
                  {
                    inline: true,
                    label: t("HR_EMAIL_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0]?.user?.emailId : t(`CORE_COMMON_NA`),
                  },
                  {
                    inline: true,
                    label: t("HR_CORRESPONDENCE_ADDRESS_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0]?.user?.correspondenceAddress : t(`CORE_COMMON_NA`),
                  },
                ],
                header: t("HR_PERSONAL_DETAILS_FORM_HEADER"),
                subHeader: "",
              },

              // Employee Details

              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: true,
                    label: t("HR_EMPLOYMENT_TYPE_LABEL"),
                    type: "text",
                    //value: data?.Employees?.[0]?.assignments?.length > 0 ? data.Employees[0].assignments[0].department : "NA",
                    value: data?.Employees ? data?.Employees[0]?.employeeType : t(`CORE_COMMON_NA`),
                  },
                  // {
                  //   inline: true,
                  //   label: t("EMPLOYEE_RESPONSE_CREATE_LABEL"),
                  //   type: "text",
                  //   value: "USR-003682",
                  // },
                  {
                    inline: true,
                    label: t("HR_COMMON_TABLE_COL_DEPT"),
                    type: "text",
                    value:
                      data?.Employees?.[0]?.assignments?.length > 0
                        ? data.Employees[0].assignments[0].department
                        : "COMMON_MASTERS_DEPARTMENT_undefined",
                  },
                  {
                    inline: true,
                    label: t("HR_APPOINTMENT_DATE_LABEL"),
                    type: "text",
                    value: data?.Employees?.[0]?.dateOfAppointment ? convertEpochToDate(data.Employees[0].dateOfAppointment) : t(`CORE_COMMON_NA`),
                  },
                ],
                header: t("HR_PROFESSIONAL_DETAILS_FORM_HEADER"),
                subHeader: "",
              },

              // custom card

              {
                cardType: "primary",
                fieldPairs: [
                  {
                    label: "",
                    value: "",
                    type: "custom",
                    inline: false,
                    renderCustomContent: (value) => {
                      return (
                        <SummaryCard
                          sections={
                            data?.Employees
                              ? data?.Employees[0]?.jurisdictions?.map((element, index) => {
                                  return {
                                    cardType: "primary",
                                    fieldPairs: [
                                      {
                                        inline: true,
                                        label: t("HR_HIERARCHY_LABEL"),
                                        type: "text",
                                        value: element?.hierarchy || t(`CORE_COMMON_NA`),
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_BOUNDARY_TYPE_LABEL"),
                                        type: "text",
                                        value: element?.boundaryType || t(`CORE_COMMON_NA`),
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_BOUNDARY_LABEL"),
                                        value: element?.boundary || t(`CORE_COMMON_NA`),
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_ROLE_LABEL"),
                                        value: data?.Employees?.[0]?.user?.roles
                                          ?.filter((ele) => ele.tenantId == element?.tenantId)
                                          .map((ele) => t(`ACCESSCONTROL_ROLES_ROLES_` + ele?.code)),
                                      },
                                    ],
                                    header: "",
                                    subHeader: `${t("HR_JURISDICTION")} ${index + 1}`,
                                  };
                                })
                              : []
                          }
                        />
                      );
                    },
                  },
                ],
                header: t("HR_JURISDICTION_DETAILS_HEADER"),
                subHeader: "",
              },

              // campaign data
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    label: "",
                    value: "",
                    type: "custom",
                    inline: false,
                    renderCustomContent: (value) => {
                      return campaign && campaign?.length > 0 ? (
                        <SummaryCard
                          sections={
                            campaign
                              ? campaign?.map((element, index) => {
                                  return {
                                    cardType: "primary",
                                    fieldPairs: [
                                      {
                                        inline: true,
                                        label: t("HR_CAMPAIGN_LABEL"),
                                        type: "text",
                                        value: element?.name || t(`CORE_COMMON_NA`),
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_ASMT_FROM_DATE_LABEL"),
                                        type: "text",
                                        value: element?.startDate ? convertEpochToDate(element?.startDate) : t(`CORE_COMMON_NA`),
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_ASMT_TO_DATE_LABEL"),
                                        value: element?.endDate ? convertEpochToDate(element?.endDate) : t(`CORE_COMMON_NA`),
                                      },
                                    ],
                                    header: "",
                                    subHeader: `${t("HR_ASSIGNMENT")} ${index + 1}`,
                                  };
                                })
                              : []
                          }
                        />
                      ) : (
                        <NoResultsFound />
                      );
                    },
                  },
                ],
                header: t("HR_ASSIGN_DET_HEADER"),
                subHeader: "",
              },

              //end of campaign data
            ]}
            style={{}}
            subHeader="Subheading"
            type="primary"
          />
        </div>
      }

      {/* action bar */}
      {
        <Footer
          actionFields={[
            <Button
              className="custom-class"
              iconFill=""
              isSearchable
              label={t("HR_COMMON_TAKE_ACTION")}
              menuStyles={{
                bottom: "40px",
              }}
              onClick={function noRefCheck() {}}
              onOptionSelect={(e) => {
                let key = e.code;
                switch (key) {
                  case "COMMON_EDIT_EMPLOYEE_HEADER":
                    history.push(`/${window.contextPath}/employee/hrms/edit/${id}`);
                    break;
                  case "DEACTIVATE_EMPLOYEE_HEAD":
                    setOpenModal(true);
                    // history.push(`/${window.contextPath}/employee/hrms/assign-campaign/${id}`);
                    break;
                  case "EDIT_CAMPAIGN_ASSIGNMENT":
                    history.push(`/${window.contextPath}/employee/hrms/update/assign-campaign/${id}`);
                    break;

                  case "ACTIVATE_EMPLOYEE_HEAD":
                    setOpenActivate(true);
                    break;

                  default:
                    break;
                }
              }}
              options={
                data?.Employees[0].isActive
                  ? getActiveWorkFlowActions(data?.Employees?.[0])
                  : mdmsData?.DeactiveWorkflows
                  ? mdmsData?.DeactiveWorkflows
                  : deactiveworkflowActions
              }
              optionsKey="name"
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

      {openModal && (
        <DeactivatePopUp
          bussnessBtnLabel="HR_DEACTIVATE_EMPLOYEE_BUTTON_TEXT"
          label="HR_COMMON_DEACTIVATED_EMPLOYEE_HEADER"
          onClose={() => {
            setOpenModal(false);
          }}
          onSubmit={(comment, date, reason, order) => {
            deActivateUser(comment, date, reason, order);
          }}
          reasonMsg={false}
        />
      )}

      {openActivate && (
        <DeactivatePopUp
          bussnessBtnLabel="HR_ACTIVATE_EMPLOYEE_HEAD"
          label="HR_ACTIVATE_EMPLOYEE_HEAD"
          onClose={() => {
            setOpenActivate(false);
          }}
          onSubmit={(comment, date, reason, order) => {
            activateUser(comment, date, reason, order);
          }}
          reasonMsg={true}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeDetailScreen;
