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
  const { registerNumber } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceDuration, setAttendanceDuration] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [disabledAction, setDisabledAction] = useState(false);
  const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
  const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
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
    if (AttendanceData?.attendanceRegister[0]?.endDate > new Date()) {
      setDisabledAction(true);
    }
  }, [AttendanceData])

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
      enabled: (AttendanceData ? true : false) && disabledAction,
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

  const { isLoading: isMusterRollLoading, data: MusterRollData } = Digit.Hooks.useCustomAPIHook(searchReqCri);

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
            musterRoll: {
              tenantId: tenantId,
              registerId: AttendanceData?.attendanceRegister[0]?.id,
              startDate: AttendanceData?.attendanceRegister[0]?.startDate,
              endDate: AttendanceData?.attendanceRegister[0]?.endDate
            },
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
              fileName: 'dummmy name',
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
              tenantId: tenantId,
              registerId: AttendanceData?.attendanceRegister[0]?.id,
              startDate: AttendanceData?.attendanceRegister[0]?.startDate,
              endDate: AttendanceData?.attendanceRegister[0]?.endDate
            },
            workflow: {
              action: "EDIT",
            }
          },
        },
        {
          onSuccess: (data) => {
            setShowToast({ key: "success", label: t("HCM_AM_ATTENDANCE_UPDATED_SUCCESSFULLY"), transitionTime: 3000 });
            history.push(`/${window.contextPath}/employee/payments/view-attendance?registerNumber=${registerNumber}`);

          },
          onError: (error) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          }
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  useEffect(() => {
    /// need to check api when this response is coming empty
    triggerMusterRollCreate();
  }, [MusterRollData]);

  const triggerMusterRollCreate = async () => {
    if (MusterRollData) {
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
                action: "EDIT",
              }
            },
          },
          {
            onSuccess: (data) => {
              /// need to update on success 
            },
            onError: (error) => {
              /// need to show estimate data only
            }
          }
        );
      } catch (error) {
        /// will show estimate data only
      }
    }
  };

  const individualReqCriteria = {
    url: `/health-individual/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
    body: {
      Individual: {
        id: [AttendanceData?.attendanceRegister[0]?.staff?.[0]?.userId]
      }
    },
    config: {
      enabled: AttendanceData?.attendanceRegister[0]?.staff?.[0]?.userId ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  const hardCodedMusterRollData = [
    {
      "id": null,
      "tenantId": "od.testing",
      "musterRollNumber": null,
      "registerId": "fc54761d-6e88-4b57-a9ad-d13afeb774e9",
      "status": "ACTIVE",
      "musterRollStatus": null,
      "startDate": 1733682600000,
      "endDate": 1734201000000,
      "individualEntries": [
        {
          "id": null,
          "individualId": "329a6c2a-e41c-4d38-8c41-9e851c835560",
          "actualTotalAttendance": 0.5,
          "modifiedTotalAttendance": null,
          "attendanceEntries": [
            {
              "id": null,
              "time": 1733682600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733769000000,
              "attendance": 0.5,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": {
                "entryAttendanceLogId": "cef79e8e-c08f-4cee-8313-9dcd86632cc8",
                "exitAttendanceLogId": "44e91bc0-37d9-4d62-ada4-b5a3cc9c84ee"
              }
            },
            {
              "id": null,
              "time": 1733855400000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733941800000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734028200000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734114600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734201000000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            }
          ],
          "additionalDetails": {
            "skillCode": [
              "SOR_000371",
              "SOR_000373"
            ],
            "userName": "rakesh",
            "userId": "IND-2024-09-16-004120",
            "userRole": "Distributor"
          },
          "auditDetails": {
            "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "createdTime": 1734686454590,
            "lastModifiedTime": 1734686454590
          }
        },
        {
          "id": null,
          "individualId": "e8430fc1-9c07-43ef-aa7d-7da24653e868",
          "actualTotalAttendance": 0.5,
          "modifiedTotalAttendance": null,
          "attendanceEntries": [
            {
              "id": null,
              "time": 1733682600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733769000000,
              "attendance": 0.5,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": {
                "entryAttendanceLogId": "f4719332-516b-4d12-bbf5-d6fb3c2554a3",
                "exitAttendanceLogId": "14e2a4a0-e3fb-486a-b8a8-bddbdef32eb4"
              }
            },
            {
              "id": null,
              "time": 1733855400000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733941800000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734028200000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734114600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734201000000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            }
          ],
          "additionalDetails": {
            "skillCode": [
              "SOR_000367",
              "SOR_000374",
              "SOR_000378",
              "SOR_000380",
              "SOR_000379",
              "SOR_000381",
              "SOR_000382",
              "SOR_000383",
              "SOR_000384",
              "SOR_000385",
              "SOR_000386"
            ],
            "userName": "Sam Dham",
            "userId": "IND-2024-08-13-003194",
            "userRole": "Distributor"
          },
          "auditDetails": {
            "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "createdTime": 1734686454590,
            "lastModifiedTime": 1734686454590
          }
        },
        {
          "id": null,
          "individualId": "0eb1cc9c-274b-49c4-b0ef-1e6bcadfb94a",
          "actualTotalAttendance": 0.0,
          "modifiedTotalAttendance": null,
          "attendanceEntries": [
            {
              "id": null,
              "time": 1733682600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733769000000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": {
                "entryAttendanceLogId": "7f3396ce-d8c2-4e7e-8352-0e3c54cb0c90",
                "exitAttendanceLogId": "cc43447e-ad92-4f76-a58f-8a27d64feb8e"
              }
            },
            {
              "id": null,
              "time": 1733855400000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1733941800000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734028200000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734114600000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            },
            {
              "id": null,
              "time": 1734201000000,
              "attendance": 0.0,
              "auditDetails": {
                "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
                "createdTime": 1734686454590,
                "lastModifiedTime": 1734686454590
              },
              "additionalDetails": null
            }
          ],
          "additionalDetails": {
            "skillCode": [
              "SOR_000026",
              "SOR_000438",
              "SOR_000437",
              "SOR_000436",
              "SOR_000435"
            ],
            "userName": "DPP check",
            "userId": "IND-2024-12-10-004160",
            "userRole": "Distributor"
          },
          "auditDetails": {
            "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
            "createdTime": 1734686454590,
            "lastModifiedTime": 1734686454590
          }
        }
      ],
      "referenceId": null,
      "serviceCode": "WORKS-CONTRACT",
      "additionalDetails": null,
      "auditDetails": {
        "createdBy": "d227b211-d718-43ed-8048-90e12b2525ce",
        "lastModifiedBy": "d227b211-d718-43ed-8048-90e12b2525ce",
        "createdTime": 1734686454590,
        "lastModifiedTime": 1734686454590
      },
      "processInstance": null
    }
  ];

  function getUserAttendanceSummary(data) {
    return data[0].individualEntries.map((individual) => {
      const userName = individual.additionalDetails.userName;
      const userId = individual.additionalDetails.userId;
      const userRole = individual.additionalDetails.userRole;
      const noOfDaysWorked = individual?.actualTotalAttendance;

      return [userName, userId, userRole, noOfDaysWorked];
    });
  }

  // Populate attendanceSummary when AttendanceData changes
  useEffect(() => {
    setAttendanceSummary(getUserAttendanceSummary(hardCodedMusterRollData));
  }, []); /// need to update dependency


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

  if (isAttendanceLoading || isEstimateMusterRollLoading || isIndividualsLoading || isMusterRollLoading) {
    return <LoaderScreen />
  }

  return (
    <React.Fragment>
      <div>
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
            <span className="label-text">{t(`PENDING FOR APPROVAL`)}</span>
            {/* HARD CODING NOW NEED TO UPDATE */}
          </div>
        </Card>
        <Card>
          <AttendanceManagementTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} data={attendanceSummary} setAttendanceSummary={setAttendanceSummary} duration={attendanceDuration} editAttendance={editAttendance} />
        </Card>
      </div>
      {openEditAlertPopUp && <AlertPopUp
        onClose={closeActionBarPopUp}
        alertHeading={t(`HCM_AM_ALERT_HEADING`)}
        alertMessage={`HCM_AM_ALERT_EDIT_DESCRIPTION`}
        submitLabel={t(`HCM_AM_PROCEED`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          history.push(`/${window.contextPath}/employee/payments/edit-attendance?registerNumber=${registerNumber}`);
        }}
      />}
      {openApproveAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenApproveAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_APPROVE_HEADING`)}
        alertMessage={`HCM_AM_ALERT_APPROVE_DESCRIPTION`}
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
                triggerMusterRollUpdate();
              }}
              style={{ minWidth: "14rem" }}
              type="button"
              variation="primary"
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