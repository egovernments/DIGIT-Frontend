import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen, LoaderComponent } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import ApproveCommentPopUp from "../../components/approveCommentPopUp";
import _ from "lodash";
import { formatTimestampToDate } from "../../utils";
import CommentPopUp from "../../components/commentPopUp";

import EditAttendeePopUp from "../../components/editAttendeesPopUp";
import EditAttendanceManagementTable from "../../components/EditAttendanceManagementTable";

/**
 * @function ViewAttendance
 * @description This component is used to view attendance.
 * @param {boolean} editAttendance - Whether attendance is editable or not.
 * @returns {ReactFragment} A React Fragment containing the attendance details.
 */
const EditRegister = ({ editAttendance = false }) => {
    const location = useLocation();
    const { t } = useTranslation();
    const history = useHistory();

    // context path variables
    const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
    const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";

    // State variables
    const { registerNumber, boundaryCode, registerId } = Digit.Hooks.useQueryParams();
    const { fromCampaignSupervisor } = location.state || false;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [attendanceDuration, setAttendanceDuration] = useState(null);
    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [initialAttendanceSummary, setInitialAttendanceSummary] = useState([]);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [disabledAction, setDisabledAction] = useState(fromCampaignSupervisor);
    const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
    const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
    const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);

    const [data, setData] = useState([]);
    const [individualIds, setIndividualIds] = useState([]);
    const [triggerEstimate, setTriggerEstimate] = useState(false);
    const [comment, setComment] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);

    // INFO:: de-enroll attendee
    const [showDeEnrollPopup, setShowDeEnrollPopup] = useState(false);

    const project = Digit?.SessionStorage.get("staffProjects");


    const AttendancereqCri = {
        url: `/${attendanceContextPath}/v1/_search`,
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

    /// ADDED CONDITION THAT IF CAMPAIGN HAS NOT ENDED THEN WE WILL SHOW ESTIMATE DATA ONLY AND DISABLED ALL THE ACTIONS

    useEffect(() => {
        if (AttendanceData) {
            setAttendanceDuration(
                Math.ceil((AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000))
            );

        }
    }, [AttendanceData])

    useEffect(() => {
        if (AttendanceData?.attendanceRegister?.length > 0) {
            const ids = AttendanceData.attendanceRegister[0].attendees.map(
                (a) => a.individualId
            );
            setIndividualIds(ids);
        }
    }, [AttendanceData]);


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
                id: [AttendanceData?.attendanceRegister[0]?.staff?.find(
                    (staff) => staff?.staffType?.includes("OWNER")
                )?.userId]
            }
        },
        config: {
            enabled: AttendanceData?.attendanceRegister.length === 1 && AttendanceData?.attendanceRegister[0]?.staff?.find(
                (staff) => staff?.staffType?.includes("OWNER")
            )?.userId ? true : false,
            select: (data) => {
                return data;
            },
        },
    };

    const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

    function getUserAttendanceSummary(attendanceData, individualsData, t) {

        const attendanceLogData = attendanceData.attendanceRegister[0].attendees.map((individualEntry) => {
            const individualId = individualEntry.individualId;
            const matchingIndividual = individualsData?.Individual?.find(
                (individual) => individual.id === individualId
            );

            if (matchingIndividual) {
                const userName = matchingIndividual.name?.givenName || t("NA");
                const userId = matchingIndividual?.userDetails?.username || t("NA");
                const userRole =
                    t(matchingIndividual.skills?.[0]?.type) || t("NA");
                // const noOfDaysWorked = individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0;
                const tag = individualEntry?.tag || "N/A";
                const id = individualEntry.individualId || 0;

                return [id, userName, userId, userRole, tag];
            } else {
                // Handle cases where no match is found in individualsData
                return ["N/A", "Unknown", "N/A", "Unassigned", "N/A"];
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

        if (AttendanceData?.attendanceRegister?.length > 0 &&
            AllIndividualsData?.Individual?.length > 0) {
            const summary = getUserAttendanceSummary(
                AttendanceData,
                AllIndividualsData,
                t
            );
            setAttendanceSummary(summary);
        }

    }, [AllIndividualsData, AttendanceData]); /// need to update dependency


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

    // if (updateMutation.isLoading) {
    //     return <LoaderComponent variant={"OverlayLoader"} />
    // }

    if (loading || isAttendanceLoading || isIndividualsLoading || isAllIndividualsLoading) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <div style={{ marginBottom: "2.5rem" }}>
                <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
                    {t('HCM_AM_VIEW_REGISTER')}
                </Header>
                <Card type="primary" className="bottom-gap-card-payment">
                    {renderLabelPair('HCM_AM_ATTENDANCE_ID', t(registerNumber))}
                    {renderLabelPair('HCM_AM_CAMPAIGN_NAME', t(project?.[0]?.name || 'NA'))}
                    {renderLabelPair('HCM_AM_PROJECT_TYPE', t(project?.[0]?.projectType || 'NA'))}
                    {renderLabelPair('HCM_AM_BOUNDARY_CODE', t(boundaryCode || 'NA'))}
                    {renderLabelPair('HCM_AM_ATTENDANCE_OFFICER', individualsData?.Individual?.[0]?.name?.givenName)}
                    {renderLabelPair('HCM_AM_ATTENDANCE_OFFICER_CONTACT_NUMBER', individualsData?.Individual?.[0]?.mobileNumber)}
                    {renderLabelPair('HCM_AM_NO_OF_ATTENDEE', AttendanceData?.attendanceRegister[0]?.attendees?.length || 0)}
                    {renderLabelPair('HCM_AM_CAMPAIGN_START_DATE', formatTimestampToDate(project?.[0]?.startDate))}
                    {renderLabelPair('HCM_AM_CAMPAIGN_END_DATE', formatTimestampToDate(project?.[0]?.endDate))}
                    {renderLabelPair('HCM_AM_EVENT_DURATION', attendanceDuration || 0)}
                    {/* {renderLabelPair('HCM_AM_STATUS', t(data?.[0]?.musterRollStatus) || t('APPROVAL_PENDING'))} */}
                </Card>
                <Card className="bottom-gap-card-payment">
                    <div className="card-heading" >
                        <h2 className="card-heading-title"></h2>
                        <Button
                            className="custom-class"
                            icon="Edit"
                            iconFill=""
                            label={t(`HCM_AM_EDIT_REGISTER`)}
                            onClick={handleDeEnrollClick}
                            options={[]}
                            optionsKey=""
                            size=""
                            style={{}}
                            title={t(`HCM_AM_EDIT_REGISTER`)}
                            variation="secondary"
                        />
                    </div>
                    <EditAttendanceManagementTable data={attendanceSummary} setAttendanceSummary={setAttendanceSummary} duration={attendanceDuration} editAttendance={editAttendance} editAction={false} />
                </Card>




                {/* To DeEnroll Attendee*/}
                {showDeEnrollPopup && (
                    <EditAttendeePopUp
                        onClose={onDeEnrollClose}
                        businessId={registerNumber}
                        registerId={registerId}
                        heading={`${t("HCM_AM_ATTENDANCE_EDIT_REGISTER")}`}
                    />
                )}

            </div>

            {/* Alert Pop-Up for edit */}
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

            {/* Alert Pop-Up for approve */}
            {openApproveAlertPopUp && <AlertPopUp
                onClose={() => {
                    setOpenApproveAlertPopUp(false);
                }}
                alertHeading={t(`HCM_AM_ALERT_APPROVE_HEADING`)}
                alertMessage={t(`HCM_AM_ALERT_APPROVE_DESCRIPTION`)}
                submitLabel={t(`HCM_AM_APPROVE`)}
                cancelLabel={t(`HCM_AM_CANCEL`)}
                onPrimaryAction={() => {

                }}
            />}

            {/* approve comment pop-up*/}
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

            {/* action bar for bill generation*/}
            {/* { <ActionBar
                actionFields={[
                    disabledAction ? (
                        <Button
                            label={t(`HCM_AM_GO_BACK`)}
                            title={t(`HCM_AM_GO_BACK`)}
                            onClick={() => {
                                fromCampaignSupervisor ? history.push(`/${window.contextPath}/employee/payments/generate-bill`, { fromViewScreen: true }) :
                                    history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
                            }}
                            type="button"
                            style={{ minWidth: "14rem" }}
                            variation="primary"
                        />
                    ) : editAttendance ? (
                        <Button
                            label={t(`HCM_AM_SUBMIT_LABEL`)}
                            title={t(`HCM_AM_SUBMIT_LABEL`)}
                            onClick={() => {

                            }}
                            style={{ minWidth: "14rem" }}
                            type="button"
                            variation="primary"
                            isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
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
            />} */}
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
export default EditRegister;