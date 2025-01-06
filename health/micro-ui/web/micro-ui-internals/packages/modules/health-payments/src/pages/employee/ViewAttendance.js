import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import ApproveCommentPopUp from "../../components/approveCommentPopUp";

const ViewAttendance = ({ editAttendance = false }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const { registerNumber, boundaryCode } = Digit.Hooks.useQueryParams();
  const { fromCampaignSupervisor } = location.state || false;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceDuration, setAttendanceDuration] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [disabledAction, setDisabledAction] = useState(false);
  const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
  const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [data, setData] = useState([]);
  const [individualIds, setIndividualIds] = useState([]);
  const [triggerEstimate, setTriggerEstimate] = useState(false);
  const [comment, setComment] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

  const project = Digit?.SessionStorage.get("staffProjects");


  const AttendancereqCri = {
    url: `/health-attendance/v1/_search`,
    params: {
      tenantId: tenantId,
      registerNumber: registerNumber
    },
    config: {
      enabled: registerNumber ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isAttendanceLoading, data: AttendanceData } = Digit.Hooks.useCustomAPIHook(AttendancereqCri);

  useEffect(() => {
    if (AttendanceData) {
      setAttendanceDuration(
        Math.floor((AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000))
      );
    }
  }, [AttendanceData])

  /// ADDED CONDITION THAT IF CAMPAIGN HAS NOT ENDED THEN WE WILL SHOW ESTIMATE DATA ONLY AND DISABLED ALL THE ACTIONS

  useEffect(() => {
    ///NEED TO ADD THIS CONDITION ALSO REMOVING FOR TESTING
    //AttendanceData?.attendanceRegister[0]?.endDate > new Date()
    if (data?.[0]?.musterRollStatus === "APPROVED") {
      setDisabledAction(true);
    }
    if (fromCampaignSupervisor) {
      setDisabledAction(true);
    }
  }, [AttendanceData, data, fromCampaignSupervisor])

  const reqCri = {
    url: `/health-muster-roll/v1/_estimate`,
    body: {
      musterRoll: {
        tenantId: tenantId,
        registerId: AttendanceData?.attendanceRegister[0]?.id,
        startDate: AttendanceData?.attendanceRegister[0]?.startDate,
        endDate: AttendanceData?.attendanceRegister[0]?.endDate
      }
    },
    config: {
      enabled: ((AttendanceData ? true : false) && disabledAction && data?.[0]?.musterRollStatus !== "APPROVED") || triggerEstimate,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isEstimateMusterRollLoading, data: estimateMusterRollData } = Digit.Hooks.useCustomAPIHook(reqCri);


  /// SEARCH MUSTERROLL TO CHECK IF WE NEED TO SHOW ESTIMATE OR MUSTERROLL SEARCH DATA

  const searchReqCri = {
    url: `/health-muster-roll/v1/_search`,
    params: {
      tenantId: tenantId,
      registerId: AttendanceData?.attendanceRegister[0]?.id
    },
    config: {
      enabled: (AttendanceData ? true : false) && !disabledAction,
      select: (data) => {
        return data;
      },
    },
  };


  const { isLoading: isMusterRollLoading, data: MusterRollData, refetch: refetchMusterRoll } = Digit.Hooks.useCustomAPIHook(searchReqCri);

  useEffect(() => {
    if (MusterRollData?.count === 0) {
      triggerMusterRollCreate();
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
      // Extract individual IDs
      const ids = data.flatMap((muster) =>
        muster.individualEntries.map((entry) => entry.individualId)
      );
      setIndividualIds(ids);
    }
  }, [data]);

  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/health-muster-roll/v1/_create",
  });

  const updateMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/health-muster-roll/v1/_update",
  });

  const approveMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/health-muster-roll/v1/_update",
  });

  const triggerMusterRollApprove = async () => {
    try {
      await approveMutation.mutateAsync(
        {
          body: {
            musterRoll: data?.[0],
            workflow: {
              action: "APPROVE",
              comments: comment,
            }
          },
        },
        {
          onSuccess: (data) => {
            history.push(`/${window.contextPath}/employee/payments/attendance-approve-success`, {
              state: "success",
              info: "HCM_AM_MUSTER_ROLL_ID",
              fileName: data?.musterRolls?.[0]?.musterRollNumber,
              description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
              message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
          },
          onError: (error) => {
            history.push(`/${window.contextPath}/employee/payments/attendance-approve-failed`, {
              state: "error",
              message: t(`HCM_AM_ATTENDANCE_APPROVE_FAILED`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
          }
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
                const updatedAttendance = attendanceSummary.find(
                  ([id,]) => id === entry.individualId
                )?.[4]; // Extract the updated actualTotalAttendance
                return {
                  ...entry,
                  modifiedTotalAttendance: updatedAttendance || entry.actualTotalAttendance,
                };
              }),
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
              history.push(`/${window.contextPath}/employee/payments/view-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}`);
            }, 3000);

          },
          onError: (error) => {
            setUpdateDisabled(false);
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          }
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
              tenantId: tenantId,
              registerId: AttendanceData?.attendanceRegister[0]?.id,
              startDate: AttendanceData?.attendanceRegister[0]?.startDate,
              endDate: AttendanceData?.attendanceRegister[0]?.endDate
            },
            workflow: {
              action: "SUBMIT",
            }
          },
        },
        {
          onSuccess: (data) => {
            refetchMusterRoll();
          },
          onError: (error) => {
            setTriggerEstimate(true);
          }
        }
      );
    } catch (error) {
      setTriggerEstimate(true);
    }

  };


  const allIndividualReqCriteria = {
    url: `/health-individual/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
    body: {
      Individual: {
        id: individualIds
      }
    },
    config: {
      enabled: individualIds.length > 0 ? true : false,
      select: (data) => {
        return data;
      },
    },
    changeQueryName: "allIndividuals"
  };

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);

  const individualReqCriteria = {
    url: `/health-individual/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
    body: {
      Individual: {
        id: [AttendanceData?.attendanceRegister[0]?.staff?.find(
          (staff) => staff?.staffType?.includes("OWNER")
        )?.userId]
      }
    },
    config: {
      enabled: AttendanceData?.attendanceRegister[0]?.staff?.find(
        (staff) => staff?.staffType?.includes("OWNER")
      )?.userId ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  function getUserAttendanceSummary(data, individualsData, t) {
    return data[0].individualEntries.map((individualEntry) => {
      const individualId = individualEntry.individualId;
      const matchingIndividual = individualsData?.Individual?.find(
        (individual) => individual.id === individualId
      );

      if (matchingIndividual) {
        const userName = matchingIndividual.name?.givenName || t("NA");
        const userId = matchingIndividual?.userDetails?.username || t("NA");
        const userRole =
          t(matchingIndividual.skills?.[0]?.type) || t("NA");
        const noOfDaysWorked = individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0;
        const id = individualEntry.individualId || 0;

        return [id, userName, userId, userRole, noOfDaysWorked];
      } else {
        // Handle cases where no match is found in individualsData
        return ["N/A", "Unknown", "N/A", "Unassigned", individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0];
      }
    });
  }

  // Populate attendanceSummary when AttendanceData changes
  useEffect(() => {

    if (data.length > 0 && AllIndividualsData) {
      setAttendanceSummary(getUserAttendanceSummary(data, AllIndividualsData, t));
    }

  }, [AllIndividualsData, data]); /// need to update dependency


  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage })
  }
  const closeActionBarPopUp = () => {
    setOpenEditAlertPopUp(false);
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage })
  }

  if (isAttendanceLoading || isEstimateMusterRollLoading || isIndividualsLoading || isMusterRollLoading || isAllIndividualsLoading || mutation.isLoading) {
    return <LoaderScreen />
  }

  return (
    <React.Fragment>
      <div style={{ marginBottom: "2.5rem" }}>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {editAttendance ? t('HCM_AM_EDIT_ATTENDANCE') : t('HCM_AM_VIEW_ATTENDANCE')}
        </Header>
        <Card type="primary" className="middle-child">
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_ATTENDANCE_ID`)}</span>
            <span className="label-text">{t(registerNumber)}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_CAMPAIGN_NAME`)}</span>
            <span className="label-text">{t(project?.[0]?.name || "NA")}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_PROJECT_TYPE`)}</span>
            <span className="label-text">{t(project?.[0]?.projectType || "NA")}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_BOUNDARY_CODE`)}</span>
            <span className="label-text">{t(boundaryCode || "NA")}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_ATTENDANCE_OFFICER`)}</span>
            <span className="label-text">{individualsData?.Individual?.[0]?.name?.givenName}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_ATTENDANCE_OFFICER_CONTACT_NUMBER`)}</span>
            <span className="label-text">{individualsData?.Individual?.[0]?.mobileNumber}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_NO_OF_ATTENDEE`)}</span>
            <span className="label-text">{AttendanceData?.attendanceRegister[0]?.attendees?.length || 0}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_EVENT_DURATION`)}</span>
            <span className="label-text">{attendanceDuration || 0}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`HCM_AM_STATUS`)}</span>
            <span className="label-text">{t(data?.[0]?.musterRollStatus) || t(`APPROVAL_PENDING`)}</span>
          </div>
        </Card>
        <Card>
          <AttendanceManagementTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} data={attendanceSummary} setAttendanceSummary={setAttendanceSummary} duration={attendanceDuration} editAttendance={editAttendance} />
        </Card>
      </div>
      {openEditAlertPopUp && <AlertPopUp
        onClose={closeActionBarPopUp}
        alertHeading={t(`HCM_AM_ALERT_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_EDIT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_PROCEED`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          history.push(`/${window.contextPath}/employee/payments/edit-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}`);
        }}
      />}
      {openApproveAlertPopUp && <AlertPopUp
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
      />}
      {openApproveCommentPopUp && <ApproveCommentPopUp
        onClose={() => {
          setOpenApproveCommentPopUp(false);
        }}
        onSubmit={(comment) => {
          setComment(comment);
          setOpenApproveCommentPopUp(false);
          setOpenApproveAlertPopUp(true);
        }}
      />}
      <ActionBar
        actionFields={[
          disabledAction ? (
            <Button
              label={t(`HCM_AM_GO_BACK`)}
              title={t(`HCM_AM_GO_BACK`)}
              onClick={() => {
                fromCampaignSupervisor ? history.push(`/${window.contextPath}/employee/payments/generate-bill`) :
                  history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
              }}
              type="button"
              style={{ minWidth: "14rem" }}
              variation="primary"
            />
          ) : editAttendance ? (
            <Button
              icon="CheckCircle"
              label={t(`HCM_AM_SUBMIT_LABEL`)}
              title={t(`HCM_AM_SUBMIT_LABEL`)}
              onClick={() => {
                setUpdateDisabled(true);
                triggerMusterRollUpdate();
              }}
              style={{ minWidth: "14rem" }}
              type="button"
              variation="primary"
              isDisabled={updateMutation.isLoading || updateDisabled}
            />
          ) : (
            <Button
              className="custom-class"
              iconFill=""
              label={t(`HCM_AM_ACTIONS`)}
              menuStyles={{
                bottom: "40px",
              }}
              onOptionSelect={(value) => {
                if (value.code === "EDIT_ATTENDANCE") {
                  setOpenEditAlertPopUp(true);
                } else if (value.code === "APPROVE") {
                  setOpenApproveCommentPopUp(true);
                }
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
              size=""
              style={{ minWidth: "14rem" }}
              title=""
              type="actionButton"
            />
          ),
        ]}
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
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