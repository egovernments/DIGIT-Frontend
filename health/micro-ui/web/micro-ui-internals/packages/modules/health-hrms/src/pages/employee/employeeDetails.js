import React, { useState, useEffect } from "react";
// /import { CardSubHeader, Header, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { convertEpochToDate } from "../../utils/utlis";
import { searchStaff } from "../../services/service";

import { Button, Card, Footer, ActionBar, SummaryCard, Tag } from "@egovernments/digit-ui-components";
import Urls from "../../services/urls";
import { Loader } from "@egovernments/digit-ui-react-components";
import DeactivatePopUp from "../../components/pageComponents/DeactivatePopUp";
import { ReposeScreenType } from "../../constants/enums";

const EmployeeDetailScreen = () => {
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const activeworkflowActions = [
    { code: "EDIT_CAMPAIGN_ASSIGNMENT", name: t("HR_COMMON_EDIT_CAMPAIGNS_HEADER") },
    { code: "DEACTIVATE_EMPLOYEE_HEAD", name: t("HR_DEACTIVATE_EMPLOYEE_HEAD") },
    { code: "COMMON_EDIT_EMPLOYEE_HEADER", name: t("HR_COMMON_EDIT_EMPLOYEE_HEADER") },
  ];
  const deactiveworkflowActions = [{ code: "ACTIVATE_EMPLOYEE_HEAD", name: "ACTIVATE_EMPLOYEE_HEAD" }];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutationUpdate = Digit.Hooks.hrms.useHRMSUpdate(tenantId);

  const history = useHistory();
  const { id } = useParams();
  const [campaign, setcampaign] = useState([]);

  const { isLoading, isError, error, data } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

  const campaignFetch = async (fetchedEmployeeId) => {
    const camData = await searchStaff(fetchedEmployeeId, tenantId);
    setcampaign(camData);
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
      return activeworkflowActions.filter((action) => action?.code !== "DEACTIVATE_EMPLOYEE_HEAD");
    }
    return activeworkflowActions;
  };

  const deActivateUser = async (comment, date, reason, order) => {
    let datak = {
      ...data?.Employees[0], // Keep existing data
      isActive: false, // Update isActive to false
      deactivationDetails: [
        {
          effectiveFrom: Date.now(), // Use the current timestamp
          reasonForDeactivation: reason,
          remarks: order,
          orderNo: comment,
        },
      ],
    };

    try {
      await mutationUpdate.mutateAsync(
        {
          Employees: [datak],
        },
        {
          onSuccess: (res) => {
            debugger;
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
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
            history.push(`/${window?.contextPath}/employee/hrms/response`, {
              isCampaign: ReposeScreenType.EDIT_USER_ERROR,
              state: "error",
              info: t("HR_EMPLOYEE_ID_LABEL"),
              fileName: error?.Employees?.[0],
              description: null,
              message: t(`EMPLOYEE_RESPONSE_UPDATE_ACTION`),
              back: t(`CORE_COMMON_GO_TO_HOME`),
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
        {/* <Header>{t("HR_NEW_EMPLOYEE_FORM_HEADER")}</Header>*/}
      </div>
      {true ? (
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
                    value: data?.Employees ? (data?.Employees[0].isActive ? t("ACTIVE") : t("IN_ACTIVE")) : t("IN_ACTIVE"),
                  },
                  {
                    inline: true,
                    label: t("HR_USERNAME_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0].code : "NA",
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
                    value: data?.Employees ? data?.Employees[0]?.user?.name : "NA",
                  },
                  {
                    inline: true,
                    label: t("HR_MOB_NO_LABEL"),
                    type: "text",

                    value: data?.Employees ? data?.Employees[0]?.user?.mobileNumber : "NA",
                  },
                  {
                    inline: true,
                    label: t("HR_GENDER_LABEL"),
                    value: data?.Employees ? data?.Employees[0]?.user?.gender : "NA",
                  },
                  {
                    inline: true,
                    label: t("HR_EMAIL_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0]?.user?.emailId : "NA",
                  },
                  {
                    inline: true,
                    label: t("HR_CORRESPONDENCE_ADDRESS_LABEL"),
                    type: "text",
                    value: data?.Employees ? data?.Employees[0]?.user?.correspondenceAddress : "NA",
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
                    value: data?.Employees ? data?.Employees[0]?.employeeType : "NA",
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
                    value: data?.Employees?.[0]?.dateOfAppointment ? convertEpochToDate(data.Employees[0].dateOfAppointment) : "NA",
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
                                        value: element?.hierarchy || "NA",
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_BOUNDARY_TYPE_LABEL"),
                                        type: "text",
                                        value: element?.boundaryType || "NA",
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_BOUNDARY_LABEL"),
                                        value: element?.boundary || "NA",
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
                      return (
                        <SummaryCard
                          sections={
                            campaign
                              ? campaign?.map((element, index) => {
                                  debugger;
                                  return {
                                    cardType: "primary",
                                    fieldPairs: [
                                      {
                                        inline: true,
                                        label: t("HR_CAMPAIGN_LABEL"),
                                        type: "text",
                                        value: element?.name || "NA",
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_ASMT_FROM_DATE_LABEL"),
                                        type: "text",
                                        value: element?.startDate ? convertEpochToDate(element?.startDate) : "NA",
                                      },
                                      {
                                        inline: true,
                                        label: t("HR_ASMT_TO_DATE_LABEL"),
                                        value: element?.endDate ? convertEpochToDate(element?.endDate) : "NA",
                                      },
                                    ],
                                    header: "",
                                    subHeader: `${t("HR_ASSIGNMENT")} ${index + 1}`,
                                  };
                                })
                              : []
                          }
                        />
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
      ) : null}

      {/* action bar for bill generation*/}
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

                  default:
                    break;
                }
              }}
              options={data?.Employees[0].isActive ? getActiveWorkFlowActions(data?.Employees?.[0]) : []}
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
          onClose={() => {
            setOpenModal(false);
          }}
          onSubmit={(comment, date, reason, order) => {
            deActivateUser(comment, date, reason, order);
            debugger;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default EmployeeDetailScreen;
