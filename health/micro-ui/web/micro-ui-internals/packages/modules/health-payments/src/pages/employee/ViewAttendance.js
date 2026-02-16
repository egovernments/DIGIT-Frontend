import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, LoaderWithGap, ActionBar } from "@egovernments/digit-ui-react-components";
import {
  Loader,
  Divider,
  Button,
  PopUp,
  Card,
  Link,
  ViewCardFieldPair,
  Toast,
  LoaderScreen,
  LoaderComponent,
} from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import ApproveCommentPopUp from "../../components/approveCommentPopUp";
import _ from "lodash";
import { formatTimestampToDate } from "../../utils";
import CommentPopUp from "../../components/commentPopUp";

import EditAttendeePopUp from "../../components/editAttendeesPopUp";

/**
 * @function ViewAttendance
 * @description This component is used to view attendance.
 * @param {boolean} editAttendance - Whether attendance is editable or not.
 * @returns {ReactFragment} A React Fragment containing the attendance details.
 */
const ViewAttendance = ({ editAttendance = false }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  // context path variables
  const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
  const musterRollContextPath = window?.globalConfigs?.getConfig("MUSTER_ROLL_CONTEXT_PATH") || "health-muster-roll";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // State variables
  const { registerNumber, boundaryCode, periodDurationInDays } = Digit.Hooks.useQueryParams();
  const { fromCampaignSupervisor } = location.state || false;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [attendanceDuration, setAttendanceDuration] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [initialAttendanceSummary, setInitialAttendanceSummary] = useState([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const paymentConfig = Digit?.SessionStorage.get("paymentsConfig");
  const [disabledAction, setDisabledAction] = useState(fromCampaignSupervisor);
  const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
  const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);
  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [triggerCreate, setTriggerCreate] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [data, setData] = useState([]);
  const [individualIds, setIndividualIds] = useState([]);
  const [triggerEstimate, setTriggerEstimate] = useState(false);
  const [comment, setComment] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);

  const selectedPeriod = Digit.SessionStorage.get("selectedPeriod");

  const pId = selectedPeriod?.id;

  // INFO:: de-enroll attendee
  const [showDeEnrollPopup, setShowDeEnrollPopup] = useState(false);

  const project = Digit?.SessionStorage.get("staffProjects");

  const AttendancereqCri = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      registerNumber: registerNumber,
      billingPeriodId: pId,
    },
    config: {
      enabled: registerNumber ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isAttendanceLoading, data: AttendanceData } = Digit.Hooks.useCustomAPIHook(AttendancereqCri);

  /// ADDED CONDITION THAT IF CAMPAIGN HAS NOT ENDED THEN WE WILL SHOW ESTIMATE DATA ONLY AND DISABLED ALL THE ACTIONS

  useEffect(() => {
    if (AttendanceData) {
      setAttendanceDuration(
        // Math.ceil((AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000))

        Math.ceil(selectedPeriod?.periodDurationInDays)
      );
      if (AttendanceData?.attendanceRegister?.[0]?.registerPeriodStatus === "APPROVED") {
        setDisabledAction(true);
      }

      // commented the old code
      // if (!paymentConfig.enableApprovalAnyTime && AttendanceData?.attendanceRegister[0]?.endDate > new Date()) {
      //   setDisabledAction(true);
      // }

      if (!paymentConfig.enableApprovalAnyTime && selectedPeriod?.periodEndDate > new Date()) {
        setDisabledAction(true);
      }
    }
  }, [AttendanceData]);

  const reqCri = {
    url: `/${musterRollContextPath}/v1/_estimate`,
    body: {
      musterRoll: {
        tenantId: tenantId,
        registerId: AttendanceData?.attendanceRegister[0]?.id,
        // startDate: AttendanceData?.attendanceRegister[0]?.startDate,
        // endDate: AttendanceData?.attendanceRegister[0]?.endDate,
        startDate: selectedPeriod.periodStartDate,
        endDate: selectedPeriod.periodEndDate,
        billingPeriodId: pId,
      },
    },
    config: {
      enabled: triggerEstimate,
      select: (data) => {
        return data;
      },
    },
    changeQueryName: registerNumber,
  };

  const { isLoading: isEstimateMusterRollLoading, data: estimateMusterRollData } = Digit.Hooks.useCustomAPIHook(reqCri);

  /// SEARCH MUSTERROLL TO CHECK IF WE NEED TO SHOW ESTIMATE OR MUSTERROLL SEARCH DATA

  const searchReqCri = {
    url: `/${musterRollContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      registerId: AttendanceData?.attendanceRegister?.[0]?.id,
      billingPeriodId: pId,
    },
    config: {
      enabled: AttendanceData?.attendanceRegister.length === 1 ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isMusterRollLoading, isrefetching, data: MusterRollData, refetch: refetchMusterRoll } = Digit.Hooks.useCustomAPIHook(
    searchReqCri
  );

  useEffect(() => {
    if (MusterRollData?.count === 0) {
      if (disabledAction) {
        setTriggerEstimate(true);
      } else {
        if (triggerCreate) {
          if (searchCount > 3) {
            setShowToast({ key: "info", label: t(`HCM_AM_MUSTOROLE_GENERATION_INPROGRESS_INFO_MESSAGE`), transitionTime: 3000 });
            setTriggerEstimate(true);
            setDisabledAction(true);
          } else {
            setSearchCount((prevKey) => prevKey + 1);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              refetchMusterRoll();
            }, 2000);
          }
        } else {
          setTriggerCreate(true);
          triggerMusterRollCreate();
        }
      }
    } else if (triggerEstimate === true) {
      setTriggerEstimate(false);
    }

    if (MusterRollData?.count > 0) {
      setData(MusterRollData?.musterRolls);
    } else if (estimateMusterRollData) {
      setData(estimateMusterRollData?.musterRolls);
    }
  }, [estimateMusterRollData, MusterRollData]);

  useEffect(() => {
    if (data) {
      if (data?.[0]?.musterRollStatus === "APPROVED") {
        setShowLogs(true);
      } else {
        setShowLogs(false);
      }
      // Extract individual IDs
      const ids = data.flatMap((muster) => muster.individualEntries.map((entry) => entry.individualId));
      setIndividualIds(ids);
    }
  }, [data]);


  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${musterRollContextPath}/v1/_create`,
  });

  const updateMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${musterRollContextPath}/v1/_update`,
  });

  const approveMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${musterRollContextPath}/v1/_update`,
  });

  const triggerMusterRollApprove = async () => {
    try {
      await approveMutation.mutateAsync(
        {
          body: {
            musterRoll: { ...data?.[0], billingPeriodId: selectedPeriod.id },
            workflow: {
              action: "APPROVE",
              comments: comment,
            },
          },
        },
        {
          onSuccess: (data) => {
            history.push(`/${window.contextPath}/employee/payments/attendance-approve-success`, {
              state: "success",
              info: t("HCM_AM_MUSTER_ROLL_ID"),
              fileName: data?.musterRolls?.[0]?.musterRollNumber,
              description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
              message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
          onError: (error) => {
            history.push(`/${window.contextPath}/employee/payments/attendance-approve-failed`, {
              state: "error",
              message: t(`HCM_AM_ATTENDANCE_APPROVE_FAILED`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
          },
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  const triggerMusterRollUpdate = async () => {
    try {
      await updateMutation.mutateAsync(
        {
          body: {
            musterRoll: {
              ...data[0], // Spread the existing data
              individualEntries: data[0].individualEntries.map((entry) => {
                const updatedAttendance = attendanceSummary.find(([id]) => id === entry.individualId)?.[4]; // Extract the updated actualTotalAttendance
                return {
                  ...entry,
                  modifiedTotalAttendance: updatedAttendance || entry.actualTotalAttendance,
                };
              }),
              billingPeriodId: selectedPeriod.id,
            },
            workflow: {
              action: "EDIT",
            },
          },
        },
        {
          onSuccess: (data) => {
            setShowToast({ key: "success", label: t("HCM_AM_ATTENDANCE_UPDATED_SUCCESSFULLY"), transitionTime: 3000 });
            // Delay the navigation for 3 seconds
            setTimeout(() => {
              setUpdateDisabled(false);
              history.push(
                `/${window.contextPath}/employee/payments/view-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}&periodDurationInDays=${periodDurationInDays}`
              );
            }, 2000);
          },
          onError: (error) => {
            setUpdateDisabled(false);
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  const triggerMusterRollCreate = async () => {

    try {
      await mutation.mutateAsync(
        {
          body: {
            musterRoll: {
              billingPeriodId: selectedPeriod.id,
              tenantId: tenantId,
              registerId: AttendanceData?.attendanceRegister[0]?.id,
              // startDate: AttendanceData?.attendanceRegister[0]?.startDate,
              // endDate: AttendanceData?.attendanceRegister[0]?.endDate,
              startDate: selectedPeriod.periodStartDate,
              endDate: selectedPeriod.periodEndDate,
            },
            workflow: {
              action: "SUBMIT",
            },
          },
        },
        {
          onSuccess: (data) => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              refetchMusterRoll();
            }, 2000);
          },
          onError: (error) => {
            setTriggerEstimate(true);
          },
        }
      );
    } catch (error) {
      setTriggerEstimate(true);
    }
  };

  const allIndividualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: data?.[0]?.individualEntries?.length + 1,
      offset: 0,
    },
    body: {
      Individual: {
        id: individualIds,
      },
    },
    config: {
      enabled: individualIds.length > 0 ? true : false,
      select: (data) => {
        return data;
      },
    },
    changeQueryName: "allIndividuals",
  };

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);

  const individualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
    body: {
      Individual: {
        id: [AttendanceData?.attendanceRegister[0]?.staff?.find((staff) => staff?.staffType?.includes("OWNER"))?.userId],
      },
    },
    config: {
      enabled:
        AttendanceData?.attendanceRegister.length === 1 &&
        AttendanceData?.attendanceRegister[0]?.staff?.find((staff) => staff?.staffType?.includes("OWNER"))?.userId
          ? true
          : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  const reqMdmsCriteria = {
    url: `/${mdms_context_path}/v1/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            "moduleName": "HCM",
            "masterDetails": [
              {
                "name": "WORKER_RATES"
              }
            ]
          }
        ]
      }
    },
    config: {
      enabled: selectedProject ? true : false,
      select: (mdmsData) => {
        const referenceCampaignId = selectedProject?.id;
        return mdmsData.MdmsRes.HCM.WORKER_RATES.filter((item) => item.campaignId === referenceCampaignId)?.[0]
      },
    }
  };
  const { isLoading1, data: workerRatesData, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqMdmsCriteria);
  console.log("workerRatesData", workerRatesData);

  function getUserAttendanceSummary(data, individualsData, t) {
    const attendanceLogData = data[0].individualEntries.map((individualEntry) => {
      const individualId = individualEntry.individualId;
      const matchingIndividual = individualsData?.Individual?.find((individual) => individual.id === individualId);

      if (matchingIndividual) {
        const userName = matchingIndividual.name?.givenName || t("NA");
        const uniqueId = matchingIndividual?.name?.familyName || t("NA");
        const userId = matchingIndividual?.userDetails?.username || t("NA");
        const matchedSkill = matchingIndividual?.skills?.find((skill) =>
          !skill?.isDeleted && workerRatesData?.rates?.some(
            (rate) => rate?.skillCode === skill?.type
          )
        );
        const userRole = matchedSkill ? t(matchedSkill.type) : t("NA");
        // const userRole =
        //   t(matchingIndividual.skills?.[0]?.type) || t("NA");
        const noOfDaysWorked = individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0;
        const id = individualEntry.individualId || 0;
        const gender = matchingIndividual?.gender;
        const dob = matchingIndividual?.dateOfBirth;
        const mobileNumber = matchingIndividual?.mobileNumber;
        const userType = matchingIndividual?.additionalFields?.fields?.find(
          (detail) => detail.key === "userType"
      )?.value || "N/A";
        return [id, userName, userId, userRole, noOfDaysWorked, gender, dob, mobileNumber, uniqueId, userType];
      } else {
        // Handle cases where no match is found in individualsData
        return ["N/A", "Unknown", "N/A", "Unassigned", individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0];
      }
    });

    const sortedData = [...attendanceLogData].sort((a, b) => {
      const nameA = a[1].toLowerCase(); // Convert to lowercase for case-insensitive sorting
      const nameB = b[1].toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return sortedData;
  }

  // Populate attendanceSummary when AttendanceData changes
  useEffect(() => {
    if (data.length > 0 && AllIndividualsData) {
      setAttendanceSummary(getUserAttendanceSummary(data, AllIndividualsData, t));
    }
  }, [AllIndividualsData, data]); /// need to update dependency

  useEffect(() => {
    if (attendanceSummary.length > 0 && initialAttendanceSummary.length === 0) {
      // Store the initial state of attendanceSummary when data is loaded for the first time
      setInitialAttendanceSummary(attendanceSummary);
    }
  }, [attendanceSummary]);

  useEffect(() => {
    if (attendanceSummary.length > 0 && initialAttendanceSummary.length > 0) {
      // Compare the current attendanceSummary with the initialAttendanceSummary using Lodash
      const hasChanged = !_.isEqual(attendanceSummary, initialAttendanceSummary);

      if (hasChanged) {
        if (!isSubmitEnabled) {
          setIsSubmitEnabled(true);
        }
      } else {
        if (isSubmitEnabled) {
          setIsSubmitEnabled(false);
        }
      }
    }
  }, [attendanceSummary]);

  const closeActionBarPopUp = () => {
    setOpenEditAlertPopUp(false);
  };
  const handleCommentLogClick = () => {
    setShowCommentLogPopup(true);
  };

  const onCommentLogClose = () => {
    setShowCommentLogPopup(false);
  };

  // INFO:: To de-enroll , add new attendee
  const handleDeEnrollClick = () => {
    setShowDeEnrollPopup(true);
  };

  const onDeEnrollClose = () => {
    setShowDeEnrollPopup(false);
  };
  //

  const renderLabelPair = (heading, text) => (
    <div className="label-pair">
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text">{text}</span>
    </div>
  );

  if (updateMutation.isLoading) {
    return <Loader variant={"OverlayLoader"} />;
  }

  if (
    loading ||
    isAttendanceLoading ||
    isEstimateMusterRollLoading ||
    isIndividualsLoading ||
    isMusterRollLoading ||
    isAllIndividualsLoading ||
    mutation.isLoading ||
    isrefetching
  ) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <React.Fragment>
      <div style={{ marginBottom: "2.5rem" }}>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          <span style={{ color: "#0B4B66" }}>{editAttendance ? t("HCM_AM_EDIT_ATTENDANCE") : t("HCM_AM_VIEW_ATTENDANCE")}</span>
        </Header>
        <Card type="primary" className="bottom-gap-card-payment">
          {renderLabelPair("HCM_AM_ATTENDANCE_ID", t(registerNumber))}
          {renderLabelPair("HCM_AM_CAMPAIGN_NAME", t(project?.[0]?.name || "NA"))}
          {renderLabelPair("HCM_AM_PROJECT_TYPE", t(project?.[0]?.projectType || "NA"))}
          {renderLabelPair("HCM_AM_BOUNDARY_CODE", t(boundaryCode || "NA"))}
          {renderLabelPair("HCM_AM_ATTENDANCE_OFFICER", individualsData?.Individual?.[0]?.name?.givenName)}
          {renderLabelPair("HCM_AM_ATTENDANCE_OFFICER_CONTACT_NUMBER", individualsData?.Individual?.[0]?.mobileNumber)}
          {renderLabelPair("HCM_AM_NO_OF_ATTENDEE", AttendanceData?.attendanceRegister[0]?.attendees?.length || 0)}
          {/* {renderLabelPair("HCM_AM_CAMPAIGN_START_DATE", formatTimestampToDate(project?.[0]?.startDate))} */}
          {/* {renderLabelPair("HCM_AM_CAMPAIGN_END_DATE", formatTimestampToDate(project?.[0]?.endDate))} */}

          {renderLabelPair(
            "HCM_AM_EVENT_DURATION",
            `${Math.ceil(
              (AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000)
            )}`
          )}
          {renderLabelPair(
            "HCM_AM_ATTENDANCE_DURATION",
            `${formatTimestampToDate(selectedPeriod?.periodStartDate)} - ${formatTimestampToDate(selectedPeriod?.periodEndDate)}`
          )}
          {renderLabelPair("HCM_AM_DURATION", attendanceDuration || 0)}
          {renderLabelPair("HCM_AM_STATUS", t(data?.[0]?.musterRollStatus) || t("APPROVAL_PENDING"))}
        </Card>
        <Card className="bottom-gap-card-payment">
          {/*  INFO:: commenting it as it is handled in edit register screen
          {<div className="card-heading" >
            <h2 className="card-heading-title"></h2>
          <Button
              className="custom-class"
              icon="Edit"
              iconFill=""
              label={t(`Edit Register`)}
              onClick={handleDeEnrollClick}
              options={[]}
              optionsKey=""
              size=""
              style={{}}
              title={t(`Edit Register`)}
              variation="secondary"
            />
            </div>} */}
          <AttendanceManagementTable
            data={attendanceSummary}
            setAttendanceSummary={setAttendanceSummary}
            duration={parseInt(periodDurationInDays ? periodDurationInDays : "0", 10) || 0}
            editAttendance={editAttendance}
          />
        </Card>
        {showLogs && (
          <Card>
            <div className="card-heading">
              <h2 className="card-heading-title">{t(`HCM_AM_COMMENT_LOG_HEADING`)}</h2>
              <Button
                className="custom-class"
                icon="Visibility"
                iconFill=""
                label={t(`HCM_AM_COMMENT_LOG_VIEW_LINK_LABEL`)}
                onClick={handleCommentLogClick}
                options={[]}
                optionsKey=""
                size=""
                style={{}}
                title={t(`HCM_AM_COMMENT_LOG_VIEW_LINK_LABEL`)}
                variation="secondary"
              />
            </div>
          </Card>
        )}

        {showCommentLogPopup && (
          <CommentPopUp onClose={onCommentLogClose} businessId={data?.[0]?.musterRollNumber} heading={`${t("HCM_AM_STATUS_LOG_FOR_LABEL")}`} />
        )}

        {/* To DeEnroll Attendee*/}
        {/* {showDeEnrollPopup && (
          <EditAttendeePopUp
            onClose={onDeEnrollClose}
            businessId={registerNumber}
            heading={`${t("Edit Attendance Register")}`}
          />
        )} */}
      </div>

      {/* Alert Pop-Up for edit */}
      {openEditAlertPopUp && (
        <AlertPopUp
          onClose={closeActionBarPopUp}
          alertHeading={t(`HCM_AM_ALERT_HEADING`)}
          alertMessage={t(`HCM_AM_ALERT_EDIT_DESCRIPTION`)}
          submitLabel={t(`HCM_AM_PROCEED`)}
          cancelLabel={t(`HCM_AM_CANCEL`)}
          onPrimaryAction={() => {
            history.push(
              `/${window.contextPath}/employee/payments/edit-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}&periodDurationInDays=${periodDurationInDays}`
            );
          }}
        />
      )}

      {/* Alert Pop-Up for approve */}
      {openApproveAlertPopUp && (
        <AlertPopUp
          onClose={() => {
            setOpenApproveAlertPopUp(false);
          }}
          alertHeading={t(`HCM_AM_ALERT_APPROVE_HEADING`)}
          alertMessage={t(`HCM_AM_ALERT_APPROVE_DESCRIPTION`)}
          submitLabel={t(`HCM_AM_APPROVE`)}
          cancelLabel={t(`HCM_AM_CANCEL`)}
          onPrimaryAction={() => {
            triggerMusterRollApprove();
          }}
        />
      )}

      {/* approve comment pop-up*/}
      {openApproveCommentPopUp && (
        <ApproveCommentPopUp
          onClose={() => {
            setOpenApproveCommentPopUp(false);
          }}
          onSubmit={(comment) => {
            setComment(comment);
            setOpenApproveCommentPopUp(false);
            setOpenApproveAlertPopUp(true);
          }}
        />
      )}

      {/* action bar for bill generation*/}
      {
        <ActionBar
          className="mc_back"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: "1rem",
          }}
        >
          {disabledAction ? (
            <Button
              label={t(`HCM_AM_GO_BACK`)}
              title={t(`HCM_AM_GO_BACK`)}
              onClick={() => {
                fromCampaignSupervisor
                  ? history.push(`/${window.contextPath}/employee/payments/generate-bill`, {
                      fromViewScreen: true,
                    })
                  : history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
              }}
              type="button"
              style={{ minWidth: "13rem" }}
              variation="primary"
              icon="ArrowBack"
            />
          ) : editAttendance ? (
            <Button
              label={t(`HCM_AM_SUBMIT_LABEL`)}
              title={t(`HCM_AM_SUBMIT_LABEL`)}
              onClick={() => {
                setUpdateDisabled(true);
                triggerMusterRollUpdate();
              }}
              style={{ minWidth: "14rem" }}
              type="button"
              variation="primary"
              isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "15%",
              }}
            >
              <Button
                className="custom-class"
                iconFill=""
                label={t(`HCM_AM_ACTIONS`)}
                menuStyles={{ bottom: "40px" }}
                onOptionSelect={(value) => {
                  if (value.code === "EDIT_ATTENDANCE") setOpenEditAlertPopUp(true);
                  if (value.code === "APPROVE") setOpenApproveCommentPopUp(true);
                }}
                options={[
                  {
                    code: "EDIT_ATTENDANCE",
                    name: t(`HCM_AM_ACTIONS_EDIT_ATTENDANCE`),
                  },
                  {
                    code: "APPROVE",
                    name: t(`HCM_AM_ACTIONS_APPROVE`),
                  },
                ]}
                optionsKey="name"
                style={{ minWidth: "14rem" }}
                type="actionButton"
              />
            </div>
          )}
        </ActionBar>
      }

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};
export default ViewAttendance;