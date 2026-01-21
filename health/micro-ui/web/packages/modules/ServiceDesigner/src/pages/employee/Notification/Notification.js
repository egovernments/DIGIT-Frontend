import React, { useState, useEffect, useRef } from "react";
import { Button, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import { CardHeader, CardText } from "@egovernments/digit-ui-react-components";
import NotificationCard from "../../../components/NotificationCard";
import NotifCardConfig from "../../../config/NotifCardConfig";
import { Toggle } from "@egovernments/digit-ui-components";
import EmailPreFilledData from "../../../config/NotificationData";
import { SMSPreFilledData, PushPreFilledData } from "../../../config/NotificationData";
import { useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "../../../utils/tableStyles";
import { useNotificationConfigAPI } from "../../../hooks/useNotificationConfigAPI";

const Notification = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const roleModule = searchParams.get("module") || "Studio";
    const roleService = searchParams.get("service") || "Service";
    const Category = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;
    const [showToast, setShowToast] = useState(null);
    const [selectedToggle, setSelectedToggle] = useState("email");
    const [notificationData, setNotificationData] = useState([]);

    // Use the new notification config API hook
    const { searchNotificationConfigs } = useNotificationConfigAPI();
    const { data: notificationConfigs, isLoading, refetch } = searchNotificationConfigs(roleModule, roleService);
    
    // Filter notifications by type
    
    // Temporary: Show all notifications for debugging
    const smsData = notificationConfigs?.filter(item => {
        const isSMS = item.additionalDetails?.type === "sms";
        const categoryMatch = item.additionalDetails?.category?.toUpperCase() === Category.toUpperCase();
        // Temporarily show all SMS notifications for debugging
        return isSMS;
    }) || [];
    
    const emailData = notificationConfigs?.filter(item => {
        const isEmail = item.additionalDetails?.type === "email";
        const categoryMatch = item.additionalDetails?.category?.toUpperCase() === Category.toUpperCase();
        // Temporarily show all email notifications for debugging
        return isEmail;
    }) || [];
    
    // const pushData = notificationConfigs?.filter(item => item.additionalDetails?.type === "push" &&  (item.additionalDetails?.category === Category || item.additionalDetails?.category?.toUpperCase() === Category)) || [];

    const toggleOptions = [
        { name: t("EMAIL"), code: "email" },
        { name: t("SMS"), code: "sms" },
        // { name: t("PUSH"), code: "push" },
    ]

    // Refetch data when component mounts or when navigating back
    useEffect(() => {
        refetch();
        
        // Add focus event listener to refetch data when user returns to the page
        const handleFocus = () => {
            refetch();
        };
        
        // Add visibility change listener to refetch data when user switches tabs
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refetch();
            }
        };
        
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refetch]);

    // Format data for data table
    useEffect(() => {
        let currentData = [];
        if (selectedToggle === "email" && emailData) {
            currentData = emailData.map((item, index) => ({
                id: index,
                title: item.title,
                messageBody: item.messageBody,
                subject: item.subject || "-",
                type: item.additionalDetails?.type,
                createdDate: item.additionalDetails?.createdDate ? 
                    Digit.DateUtils.ConvertEpochToDate(item.additionalDetails.createdDate) : "N/A",
                data: item
            }));
        } else if (selectedToggle === "sms" && smsData) {
            currentData = smsData.map((item, index) => ({
                id: index,
                title: item.title,
                messageBody: item.messageBody,
                subject: "-",
                type: item.additionalDetails?.type,
                createdDate: item.additionalDetails?.createdDate ? 
                    Digit.DateUtils.ConvertEpochToDate(item.additionalDetails.createdDate) : "N/A",
                data: item
            }));
        }
        // } else if (selectedToggle === "push" && pushData) {
        //     currentData = pushData.map((item, index) => ({
        //         id: index,
        //         title: item.title,
        //         messageBody: item.messageBody,
        //         subject: "-",
        //         type: item.additionalDetails?.type,
        //         createdDate: "N/A", // Since we don't have auditDetails in the new structure
        //         data: item
        //     }));
        // }
        setNotificationData(currentData);
    }, [selectedToggle, notificationConfigs]);

    // DataTable columns configuration
    const columns = [
        {
            name: t("STUDIO_SNO"),
            selector: (row, index) => index + 1,
            width: "80px",
            sortable: false,
        },
        {
            name: t("NOTIFICATION_TITLE"),
            selector: (row) => row.title,
            cell: (row) => (
                <div>
                    <div style={{ fontWeight: "400" }}>{row.title}</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                        {row.messageBody}
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            name: t("STUDIO_CREATED_DATE"),
            selector: (row) => row.createdDate,
            sortable: true,
        },
        {
            name: t("STUDIO_CREATED_ACTIONS"),
            cell: (row) => (
                <Button
                    label={t("STUDIO_EDIT")}
                    variation="secondary"
                    size="small"
                    style={{ color: "#c84c0e", fontSize: "14px", width: "4rem" }}
                    onClick={() => onExistingCardClick(row.type, row.data)}
                />
            ),
            sortable: false,
        },
    ];

    const onCardClick = (e,data) => {
        history.push({
            pathname: `/${window.contextPath}/employee/servicedesigner/create-notification`,
            search: `?module=${roleModule}&service=${roleService}`,
            state: {
                type: e,
                data: e == "email" ? EmailPreFilledData : e == "sms" ? SMSPreFilledData : PushPreFilledData,
                isUpdate: false,
            },
        })
    }

    const onExistingCardClick = (e,data) => {
        history.push({
            pathname: `/${window.contextPath}/employee/servicedesigner/create-notification`,
            search: `?module=${roleModule}&service=${roleService}`,
            state: {
                type: e,
                data: data,
                isUpdate: true,
            },
        })
    }

    if (isLoading) {
        return <Loader />;
    }
    return (
        <React.Fragment>
            {/* <CardHeader styles={{ fontSize: "xx-large", fontWeight: "bold", paddingTop: "24px", marginBottom: "0px" }}>{t("NOTIFICATION_HEADER")}</CardHeader>
            <CardText>{t("NOTIFICATION_HEADER_DESCRIPTION")}</CardText> */}
            <div style={{ fontSize: "2rem",
            fontWeight: 700,
            color: "#0B4B66",
            fontFamily: "Roboto condensed" }}>{t("NOTIFICATION_HEADER")}</div> 
      
      <div style={{
              fontSize: "1rem",
              color: "#505A5F",
              margin: "1rem 0",
            }}>{t("NOTIFICATION_HEADER_DESCRIPTION")}</div>
            <Card>
                <div style={{ display: "flex" }}>
                    {NotifCardConfig.map((item, index) => (
                        <NotificationCard key={item.key || index} title={item.title} desc={item.desc} index={item.key} onClick={onCardClick} data={null} icon={item.icon} />
                    ))}
                </div>
            </Card>
            <Card style={{paddingLeft:"26px"}}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                        alignItems: "center",
                    }}
                >
                    <Toggle
                        name="toggleOptions"
                        numberOfToggleItems={3}
                        onSelect={(e) => setSelectedToggle(e)}
                        style={{ maxWidth: "23.5rem", marginTop: "10px" }}
                        options={toggleOptions}
                        optionsKey="name"
                        selectedOption={selectedToggle}
                        type="toggle"
                    />
                </div>

                {isLoading ? (
                    <div style={{ padding: "1rem" }}>Loading...</div>
                ) : notificationData.length > 0 ? (
                    <div style={{ marginTop: "1rem" }}>
                        <DataTable
                            columns={columns}
                            data={notificationData}
                            customStyles={tableCustomStyle}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5, 10, 20, 50]}
                            noDataComponent={<div style={{ padding: "1rem", fontStyle: "italic" }}>{t("NO_NOTIFICATIONS_MESSAGE")}</div>}
                            responsive
                            highlightOnHover
                            pointerOnHover
                        />
                    </div>
                ) : (
                    <div style={{ fontStyle: "italic" }}>{t("NO_NOTIFICATIONS_MESSAGE")}</div>
                )}
            </Card>
            {
                showToast && (
                    <Toast
                        type={showToast?.type}
                        label={t(showToast?.label)}
                        onClose={() => {
                            setShowToast(null);
                        }}
                        isDleteBtn={showToast?.isDleteBtn}
                        style={{ zIndex: 99999 }}
                    />
                )
            }
        </React.Fragment >
    );
};

export default Notification;