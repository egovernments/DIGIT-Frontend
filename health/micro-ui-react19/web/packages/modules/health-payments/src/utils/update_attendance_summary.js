import { useState, useEffect } from "react";

export const useAttendanceSummary = ({ businessId, tenantId, t }) => {
     const attendanceContextPath =
        window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
        "health-attendance";
    const individualContextPath =
        window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") ||
        "health-individual";
        
  const [individualIds, setIndividualIds] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);

  // -------- 1. Attendance Register API --------
  const attendanceReqCri = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      registerNumber: businessId,
    },
    config: {
      enabled: !!businessId,
      select: (data) => data,
    },
  };

  const { isLoading: isAttendanceLoading, data: attendanceData } =
    Digit.Hooks.useCustomAPIHook(attendanceReqCri);

  // Extract individualIds once attendanceData is fetched
  useEffect(() => {
    if (attendanceData?.attendanceRegister?.length > 0) {
      const ids = attendanceData.attendanceRegister[0].attendees.map(
        (a) => a.individualId
      );
      setIndividualIds(ids);
    }
  }, [attendanceData]);

  // -------- 2. Individual API (depends on IDs) --------
  const allIndividualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: individualIds.length,
      offset: 0,
    },
    body: {
      Individual: {
        id: individualIds,
      },
    },
    config: {
      enabled: individualIds.length > 0, // ✅ only fire when we have IDs
      select: (data) => data,
    },
    changeQueryName: "allIndividuals",
  };

  const { isLoading: isAllIndividualsLoading, data: allIndividualsData } =
    Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);

  // -------- 3. Build Attendance Summary --------
  function getUserAttendanceSummary(attendanceData, individualsData, t) {
    const attendanceLogData =
      attendanceData.attendanceRegister[0].attendees.map((individualEntry) => {
        const individualId = individualEntry.individualId;
        const matchingIndividual = individualsData?.Individual?.find(
          (individual) => individual.id === individualId
        );

        if (matchingIndividual) {
          const userName = matchingIndividual.name?.givenName || t("NA");
          const userId = matchingIndividual?.userDetails?.username || t("NA");
          const userRole = t(matchingIndividual.skills?.[0]?.type) || t("NA");
          const noOfDaysWorked =
            individualEntry?.denrollmentDate == null ? true : false;

          const id = individualEntry.individualId || 0;

          return [id, userName, userId, userRole, noOfDaysWorked];
        } else {
          return [
            "N/A",
            "Unknown",
            "N/A",
            "Unassigned",
            individualEntry?.denrollmentDate == null ? true : false,
          ];
        }
      });

    // sort alphabetically by user name
    return [...attendanceLogData].sort((a, b) =>
      a[1].toLowerCase().localeCompare(b[1].toLowerCase())
    );
  }

  useEffect(() => {
    if (
      attendanceData?.attendanceRegister?.length > 0 &&
      allIndividualsData?.Individual?.length > 0
    ) {
      const summary = getUserAttendanceSummary(
        attendanceData,
        allIndividualsData,
        t
      );
      setAttendanceSummary(summary);
    }
  }, [allIndividualsData, attendanceData, t]);

  return {
    attendanceSummary,
    isLoading: isAttendanceLoading || isAllIndividualsLoading,
    raw: { attendanceData, allIndividualsData }, // optional: expose raw data
  };
};
