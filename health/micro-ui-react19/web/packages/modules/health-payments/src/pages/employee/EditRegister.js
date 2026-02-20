import React, { useState, useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Toast, Loader } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { formatTimestampToDate } from "../../utils";

import EditAttendeePopUp from "../../components/editAttendeesPopUp";
import EditAttendanceManagementTable from "../../components/EditAttendanceManagementTable";

/**
 * @function EditRegister
 * @description Component used for viewing and editing attendance register details.
 * @param {boolean} editAttendance - Enables or disables editing actions.
 * @returns {ReactFragment} - The rendered attendance register details screen.
 */
const EditRegister = ({ editAttendance = false }) => {
  /** -------------------- 🔹 STATE VARIABLES -------------------- **/
  const [showMore, setShowMore] = useState(false); // Toggle for extra details section
  const location = useLocation();
  const { t } = useTranslation();

  // Context path configuration (read from global configs)
  const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";

  // Extract query params (register details)
  const { registerNumber, boundaryCode, registerId } = Digit.Hooks.useQueryParams();
  const { fromCampaignSupervisor } = location.state || false;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Attendance-related states
  const [attendanceDuration, setAttendanceDuration] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [initialAttendanceSummary, setInitialAttendanceSummary] = useState([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const [data, setData] = useState([]);
  const [individualIds, setIndividualIds] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Popup control for De-enroll
  const [showDeEnrollPopup, setShowDeEnrollPopup] = useState(false);

  // Current project info (stored in session)
  const project = Digit?.SessionStorage.get("staffProjects");

  const [attendanceType, setAttendanceType] = useState(0);

  /** -------------------- 🔹 FETCH ATTENDANCE REGISTER -------------------- **/
  const AttendancereqCri = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      registerNumber: registerNumber,
    },
    config: {
      enabled: registerNumber ? true : false,
      select: (data) => data,
    },
  };

  const { isLoading: isAttendanceLoading, data: AttendanceData } = Digit.Hooks.useCustomAPIHook(AttendancereqCri);

  /**
   * Once attendance data is fetched, calculate duration in days
   * between startDate and endDate.
   */
  useEffect(() => {
    if (AttendanceData) {
      setAttendanceDuration(
        Math.ceil((AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000))
      );
    }
  }, [AttendanceData]);

  /**
   * Extract all individual IDs (attendees) from the attendance register.
   */
  useEffect(() => {
    if (AttendanceData?.attendanceRegister?.length > 0) {
      if (AttendanceData.attendanceRegister[0].attendees != null && AttendanceData.attendanceRegister[0].attendees?.length > 0) {
        const ids = AttendanceData.attendanceRegister[0].attendees.map((a) => a.individualId);
        setIndividualIds(ids);
      } else {
        setIndividualIds([]);
      }
    }
  }, [AttendanceData]);

  /** -------------------- 🔹 FETCH ALL INDIVIDUALS -------------------- **/
  const allIndividualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: individualIds.length,
      offset: 0,
    },
    body: {
      Individual: { id: individualIds },
    },
    config: {
      enabled: individualIds.length > 0, // ✅ Only call API when IDs exist
      select: (datap) => datap,
    },
    changeQueryName: "allIndividuals",
  };

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);

  /** -------------------- 🔹 FETCH ATTENDANCE OFFICER DETAILS -------------------- **/
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
      select: (data) => data,
    },
  };

  const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  /** -------------------- 🔹 PROCESS ATTENDANCE SUMMARY -------------------- **/
  function getUserAttendanceSummary(attendanceData, individualsData, t) {
    if (!attendanceData.attendanceRegister[0].attendees?.length) {
      return [];
    }

    // Map each attendee to their respective details from Individuals API
    const attendanceLogData = attendanceData.attendanceRegister[0].attendees.map((individualEntry) => {
      const individualId = individualEntry.individualId;
      const matchingIndividual = individualsData?.Individual?.find((individual) => individual.id === individualId);

      if (matchingIndividual) {
        const userName = matchingIndividual.name?.givenName || t("NA");
        const userId = matchingIndividual?.userDetails?.username || t("NA");
        const userRole = t(matchingIndividual.skills?.[0]?.type) || t("NA");
        const tag = individualEntry?.tag || "N/A";
        const id = individualEntry.individualId || 0;
        const status = individualEntry?.denrollmentDate == null ? true : false;

        return [id, userName, userId, userRole, tag, status];
      } else {
        // Fallback when individual data is missing
        return ["N/A", "Unknown", "N/A", "Unassigned", "N/A", individualEntry?.denrollmentDate == null ? true : false];
      }
    });

    // Sort alphabetically by name for better readability
    const sortedData = [...attendanceLogData].sort((a, b) => a[1].toLowerCase().localeCompare(b[1].toLowerCase()));

    return sortedData;
  }

  // Populate attendance summary after data fetch
  useEffect(() => {
    if (AttendanceData?.attendanceRegister?.length > 0 && AllIndividualsData?.Individual?.length > 0) {
      const summary = getUserAttendanceSummary(AttendanceData, AllIndividualsData, t);
      const sessionType = AttendanceData?.attendanceRegister?.[0]?.additionalDetails?.sessions
        ? AttendanceData.attendanceRegister[0].additionalDetails.sessions
        : 0;
      setAttendanceType(sessionType);
      setAttendanceSummary(summary);
    }
  }, [AllIndividualsData, AttendanceData]);

  // Store initial summary for change detection
  useEffect(() => {
    if (attendanceSummary.length > 0 && initialAttendanceSummary.length === 0) {
      setInitialAttendanceSummary(attendanceSummary);
    }
  }, [attendanceSummary]);

  /**
   * Enable or disable submit based on whether attendance data has changed.
   */
  useEffect(() => {
    if (attendanceSummary.length > 0 && initialAttendanceSummary.length > 0) {
      const hasChanged = !_.isEqual(attendanceSummary, initialAttendanceSummary);
      setIsSubmitEnabled(hasChanged);
    }
  }, [attendanceSummary]);

  /** -------------------- 🔹 ACTION HANDLERS -------------------- **/
  const handleDeEnrollClick = () => setShowDeEnrollPopup(true);
  const onDeEnrollClose = () => setShowDeEnrollPopup(false);

  // Utility to render key-value pairs
  const renderLabelPair = (heading, text) => (
    <div className="label-pair">
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text">{text}</span>
    </div>
  );

  /** -------------------- 🔹 LOADING STATE -------------------- **/
  if (loading || isAttendanceLoading || isIndividualsLoading || isAllIndividualsLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  /** -------------------- 🔹 MAIN RENDER -------------------- **/
  return (
    <Fragment>
      <div style={{ marginBottom: "2.5rem" }}>
        {/* ---- Attendance Summary Card ---- */}
        <Card type="primary" className="bottom-gap-card-payment">
          {renderLabelPair("HCM_AM_ATTENDANCE_ID", t(registerNumber))}
          {renderLabelPair("HCM_AM_CAMPAIGN_NAME", t(project?.[0]?.name || "NA"))}
          {renderLabelPair("HCM_AM_PROJECT_TYPE", t(project?.[0]?.projectType || "NA"))}
          {renderLabelPair("HCM_AM_BOUNDARY_CODE", t(boundaryCode || "NA"))}

          {/* ✅ Show additional details only if expanded */}
          {showMore && (
            <Fragment>
              {renderLabelPair("HCM_AM_ATTENDANCE_OFFICER", individualsData?.Individual?.[0]?.name?.givenName)}
              {renderLabelPair("HCM_AM_ATTENDANCE_OFFICER_CONTACT_NUMBER", individualsData?.Individual?.[0]?.mobileNumber)}
              {renderLabelPair("HCM_AM_NO_OF_ATTENDEE", AttendanceData?.attendanceRegister[0]?.attendees?.length || 0)}
              {renderLabelPair("HCM_AM_CAMPAIGN_START_DATE", formatTimestampToDate(project?.[0]?.startDate))}
              {renderLabelPair("HCM_AM_CAMPAIGN_END_DATE", formatTimestampToDate(project?.[0]?.endDate))}
              {renderLabelPair("HCM_AM_EVENT_DURATION", attendanceDuration || 0)}
            </Fragment>
          )}

          {/* Toggle for View More / View Less */}
          <div className="label-pair">
            <span className="view-label-heading">
              <Button
                label={showMore ? t("HCM_AM_VIEW_LESS") : t("HCM_AM_VIEW_MORE")}
                onClick={() => setShowMore((prev) => !prev)}
                variation="link"
                style={{ whiteSpace: "nowrap", width: "auto" }}
              />
            </span>
          </div>
        </Card>

        {/* ---- Attendance Edit Table ---- */}
        <Card className="bottom-gap-card-payment">
          <div className="card-heading">
            <h2 className="card-heading-title"></h2>
            <Button
              icon="Edit"
              label={t(`HCM_AM_EDIT_REGISTER`)}
              onClick={handleDeEnrollClick}
              variation="secondary"
              title={t(`HCM_AM_EDIT_REGISTER`)}
            />
          </div>

          {/* Editable Attendance Table */}
          <EditAttendanceManagementTable
            data={attendanceSummary || []}
            setAttendanceSummary={setAttendanceSummary}
            duration={attendanceDuration}
            editAttendance={editAttendance}
            editAction={false}
          />
        </Card>

        {/* ---- De-Enroll Popup ---- */}
        {showDeEnrollPopup && (
          <EditAttendeePopUp
            onClose={onDeEnrollClose}
            businessId={registerNumber}
            registerId={registerId}
            boundaryCode={boundaryCode}
            heading={`${t("HCM_AM_ATTENDANCE_EDIT_REGISTER")}`}
            sessionType={attendanceType || 0}
          />
        )}
      </div>

      {/* ---- Toast Notifications ---- */}
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </Fragment>
  );
};

export default EditRegister;
