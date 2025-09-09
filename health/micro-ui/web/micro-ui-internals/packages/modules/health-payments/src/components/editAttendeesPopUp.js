import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, Loader, TextInput, Button } from '@egovernments/digit-ui-components';
import { useEffect } from "react";
import EditAttendanceManagementTable from "./EditAttendanceManagementTable";
import { useHistory } from "react-router-dom";
import AttendeeService from "../services/attendance/attendee_service/attendeeService";

import { useAttendanceSummary } from "../utils/update_attendance_summary";

import SearchUserPopUp from "./SearchUserPopUp";


const EditAttendeePopUp = ({boundaryCode, onClose, businessId, heading, registerId }) => {
    const history = useHistory();
    // context path variables
    const attendanceContextPath =
        window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
        "health-attendance";
    const individualContextPath =
        window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") ||
        "health-individual";

    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const labels = ["HCM_AM_ATTENDANCE_NOT_FIND_USER_LABEL", "HCM_AM_ATTENDANCE_USER_ASSIGN_REGISTER"];
    const maxLabelLength = Math.max(...labels.map(label => label.length));
    const labelWidth = `${maxLabelLength * 8}px`;


    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [individualIds, setIndividualIds] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [flag, setFlag] = useState(false);


    const [searchUserpopUp, setSearchUserpopUp] = useState(false);

    // -------- 1. Attendance Register API --------
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
        changeQueryName: flag ? "attendanceSearch_refresh" : "attendanceSearch"
    };

    const { isLoading: isAttendanceLoading, data: AttendanceData } =
        Digit.Hooks.useCustomAPIHook(AttendancereqCri);

    // Extract individualIds once AttendanceData is fetched
    useEffect(() => {
        if (AttendanceData?.attendanceRegister?.length > 0) {
            const ids = AttendanceData.attendanceRegister[0].attendees.map(
                (a) => a.individualId
            );
            setIndividualIds(ids);
        }
    }, [AttendanceData]);

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
            select: (datap) => datap,
        },
        changeQueryName: "allIndividuals",
    };

    const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } =
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
                    const userRole =
                        t(matchingIndividual.skills?.[0]?.type) || t("NA");
                    const noOfDaysWorked =
                        individualEntry?.denrollmentDate == null ? true : false;

                    const id = individualEntry.individualId || 0;

                    const tag = individualEntry?.tag || "NA";

                    return [id, userName, userId, userRole, tag, noOfDaysWorked];
                } else {
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

        // sort alphabetically by user name
        return [...attendanceLogData].sort((a, b) =>
            a[1].toLowerCase().localeCompare(b[1].toLowerCase())
        );
    }

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

    // const { attendanceSummary, isLoading } = useAttendanceSummary({
    //   businessId,
    //   tenantId,
    //   t,
    // });

    //if (isLoading) return <Loader />;

    // ✅ Filter attendanceSummary based on search query

    const filteredData = searchQuery.length >= 3 ?
        attendanceSummary.filter(
            (row) =>
                row[1].toLowerCase().includes(searchQuery.toLowerCase()) || // Name
                row[2].toLowerCase().includes(searchQuery.toLowerCase())    // ID
        ) : attendanceSummary;



    const disableUser = async (value) => {

        setFlag(!flag);

    }


    const closeActionBarPopUp = () => {
        setSearchUserpopUp(false);
    };


    // -------- Render --------
    return (<React.Fragment>
        <PopUp
            style={{ minWidth: "1000px" }}
            onClose={onClose}
            heading={t(heading)}
            onOverlayClick={onClose}
            children={[
                isAttendanceLoading || isAllIndividualsLoading ? (
                    <Loader />
                ) : (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px", // same as Tailwind gap-4
                    }} >
                        <TextInput type="search" name="title" placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <EditAttendanceManagementTable
                            data={searchQuery != "" ? filteredData : attendanceSummary}
                            setAttendanceSummary={setAttendanceSummary}
                            disableUser={disableUser}
                            registerId={businessId}
                            registerNumber={registerId}
                            editAction={true}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: `${labelWidth} auto`, rowGap: "10px", alignItems: "center" }}>
                            <div>{t(labels[0])}</div>
                            <Button label={t("Register New User")} variation="link" onClick={() => history.push(`/${window?.contextPath}/employee/hrms/create`)} />

                            <div>{t(labels[1])}</div>
                            <Button label={t("Search User")} variation="link" onClick={() => setSearchUserpopUp(true)} />
                        </div>

                    </div>
                )
            ]}
            footerChildren={[
                <Button
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t("HCM_AM_SAVE_AND_CLOSE")}
                    onClick={() => onClose}
                />,
            ]}
            sortFooterChildren={true}
        />
        {
            searchUserpopUp && <SearchUserPopUp
                registerId={registerId}
                boundaryCode={boundaryCode}
                onClose={closeActionBarPopUp}
                heading={`${t("HCM_AM_ATTENDANCE_ASSIGN_USER")}`}
            />
        }


    </React.Fragment>
    );
};

export default EditAttendeePopUp;
