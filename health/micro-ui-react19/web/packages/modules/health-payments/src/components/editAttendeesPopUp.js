import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    PopUp,
    Timeline,
    Loader,
    TextInput,
    Button,
} from "@egovernments/digit-ui-components";
import EditAttendanceManagementTable from "./EditAttendanceManagementTable";
import { useNavigate } from "react-router-dom";

/**
 * Component: EditAttendeePopUp
 * --------------------------------------
 * This component renders a popup to view and edit attendees in an attendance register.
 * It fetches attendance data and individual user data using Digit’s custom hooks,
 * then displays the data in a table with search functionality.
 */
const EditAttendeePopUp = ({
    boundaryCode,
    onClose,
    businessId,
    heading,
    registerId,
    sessionType,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    /** -----------------------------
     *  Context Path Configuration
     * -----------------------------
     * Fetching context paths dynamically from global configuration (Digit platform).
     * Defaults are provided as fallback values.
     */
    const attendanceContextPath =
        window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
        "health-attendance";
    const individualContextPath =
        window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") ||
        "health-individual";

    // Current tenant (ULB) context
    const tenantId = Digit.ULBService.getCurrentTenantId();

    // UI label configuration for field alignment
    const labels = [
        "HCM_AM_ATTENDANCE_NOT_FIND_USER_LABEL",
        "HCM_AM_ATTENDANCE_USER_ASSIGN_REGISTER",
    ];
    const maxLabelLength = Math.max(...labels.map((label) => label.length));
    const labelWidth = `${maxLabelLength * 6}px`;

    /** -----------------------------
     *  Component State Variables
     * -----------------------------
     */
    const [attendanceSummary, setAttendanceSummary] = useState([]); // Combined data for table
    const [individualIds, setIndividualIds] = useState([]); // Extracted IDs for API
    const [searchQuery, setSearchQuery] = useState(""); // Local search input
    const [flag, setFlag] = useState(false); // Used to trigger API refresh
    const [searchUserpopUp, setSearchUserpopUp] = useState(false); // Placeholder for additional popup (if needed)

    // Popup size (responsive)
    const [popupWidth, setPopupWidth] = useState(getResponsiveWidth());
    const [popupHeight, setPopupHeight] = useState(getResponsiveHeight());

    /** -----------------------------
     *  Responsive Dimension Handlers
     * -----------------------------
     */
    function getResponsiveHeight() {
        const windowHeight = window.innerHeight;
        if (windowHeight < 600) return "90vh"; // Small mobile
        if (windowHeight < 900) return "80vh"; // Tablet
        return "200vh"; // Desktop
    }

    function getResponsiveWidth() {
        if (window.innerWidth < 768) return "100%"; // Mobile
        if (window.innerWidth < 1200) return "90%"; // Tablet
        return "1300px"; // Desktop
    }

    // Adjust popup size when the window is resized
    useEffect(() => {
        const handleResize = () => setPopupHeight(getResponsiveHeight());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleResize = () => setPopupWidth(getResponsiveWidth());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /** -----------------------------
     *  1. Attendance Register API
     * -----------------------------
     * Fetches attendance register details by register number (businessId).
     */
    const AttendancereqCri = {
        url: `/${attendanceContextPath}/v1/_search`,
        params: {
            tenantId: tenantId,
            registerNumber: businessId,
        },
        config: {
            enabled: !!businessId,
            select: (data) => data,
        },
        changeQueryName: flag ? "attendanceSearch_refresh" : "attendanceSearch",
    };

    const { isLoading: isAttendanceLoading, data: AttendanceData } =
        Digit.Hooks.useCustomAPIHook(AttendancereqCri);

    /**
     * Extract individual IDs once the attendance data is fetched
     * These IDs are used to fetch individual user details.
     */
    useEffect(() => {
        if (AttendanceData?.attendanceRegister?.length > 0) {
            const ids = AttendanceData.attendanceRegister[0].attendees.map(
                (a) => a.individualId
            );
            setIndividualIds(ids);
        }
    }, [AttendanceData]);

    /** -----------------------------
     *  2. Individual API
     * -----------------------------
     * Fetches individual details for the extracted individual IDs.
     */
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
            enabled: individualIds.length > 0, // Fire only when IDs exist
            select: (datap) => datap,
        },
        changeQueryName: "allIndividuals",
    };

    const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } =
        Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);

    /** -----------------------------
     *  3. Build Attendance Summary
     * -----------------------------
     * Combines both attendance and individual details into one dataset for UI.
     */
    function getUserAttendanceSummary(attendanceData, individualsData, t) {
        const attendanceLogData =
            attendanceData.attendanceRegister[0].attendees.map((individualEntry) => {
                const individualId = individualEntry.individualId;
                const matchingIndividual = individualsData?.Individual?.find(
                    (individual) => individual.id === individualId
                );

                // Merge details if found
                if (matchingIndividual) {
                    const userName = matchingIndividual.name?.givenName || t("NA");
                    const userId = matchingIndividual?.userDetails?.username || t("NA");
                    const userRole =
                        t(matchingIndividual.skills?.[0]?.type) || t("NA");
                    const noOfDaysWorked =
                        individualEntry?.denrollmentDate == null ? true : false;
                    const id = individualEntry.individualId || 0;
                    const tag = individualEntry?.tag || "NA";

                    return [id, userName, userId, userRole, tag, noOfDaysWorked];
                } else {
                    // Handle missing individuals gracefully
                    return [
                        "N/A",
                        "Unknown",
                        "N/A",
                        "Unassigned",
                        "N/A",
                        individualEntry?.denrollmentDate == null ? true : false,
                    ];
                }
            });

        // Sort alphabetically by user name
        return [...attendanceLogData].sort((a, b) =>
            a[1].toLowerCase().localeCompare(b[1].toLowerCase())
        );
    }

    // Generate summary when both data sources are ready
    useEffect(() => {
        if (
            AttendanceData?.attendanceRegister?.length > 0 &&
            AllIndividualsData?.Individual?.length > 0
        ) {
            const summary = getUserAttendanceSummary(
                AttendanceData,
                AllIndividualsData,
                t
            );
            setAttendanceSummary(summary);
        }
    }, [AllIndividualsData, AttendanceData, t]);

    /** -----------------------------
     *  4. Search & Filter Logic
     * -----------------------------
     */
    const filteredData =
        searchQuery.length >= 3
            ? attendanceSummary.filter(
                (row) =>
                    row[1].toLowerCase().includes(searchQuery.toLowerCase()) || // Name
                    row[2].toLowerCase().includes(searchQuery.toLowerCase()) // ID
            )
            : attendanceSummary;

    /** -----------------------------
     *  5. Utility & Handlers
     * -----------------------------
     */
    // Toggle flag to refresh API data
    const disableUser = async (value) => {
        setFlag(!flag);
    };

    // Close popup action
    const closeActionBarPopUp = () => {
        setSearchUserpopUp(false);
    };

    /** -----------------------------
     *  Render UI
     * -----------------------------
     */
    return (
        <React.Fragment>
            <PopUp
                style={{ minWidth: popupWidth, height: "650px" }}
                onClose={onClose}
                heading={t(heading)}
                onOverlayClick={onClose}
                children={[
                    isAttendanceLoading || isAllIndividualsLoading ? (
                        // Loader section while fetching data

                        <Loader variant={"PageLoader"} className={"digit-center-loader"} />

                    ) : (
                        // Main content: search + table + link
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            {/* Search box */}
                            <TextInput
                                type="search"
                                name="title"
                                placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* Attendance Table */}
                            <EditAttendanceManagementTable
                                height="320px"
                                data={searchQuery !== "" ? filteredData : attendanceSummary}
                                setAttendanceSummary={setAttendanceSummary}
                                disableUser={disableUser}
                                registerId={businessId}
                                registerNumber={registerId}
                                editAction={true}
                                sessionType={sessionType}
                            />

                            {/* Action section for searching new users */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `${labelWidth} auto`,
                                    rowGap: "5px",
                                    alignItems: "center",
                                }}
                            >
                                <div>{t(labels[1])}</div>
                                <Button
                                    label={t("HCM_AM_SEARCH_USER")}
                                    variation="link"
                                    onClick={() => {
                                        // Navigate to attendee inbox page
                                        navigate(
                                            `/${window?.contextPath}/employee/payments/attendee-inbox?registerId=${registerId}&boundaryCode=${boundaryCode}&sessionType=${sessionType}`
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    ),
                ]}
                footerChildren={[
                    // Footer Save & Close Button
                    <Button
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={t("HCM_AM_SAVE_AND_CLOSE")}
                        onClick={onClose}
                    />,
                ]}
                sortFooterChildren={true}
            />
        </React.Fragment>
    );
};

export default EditAttendeePopUp;
