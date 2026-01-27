import React, { useState, useEffect } from "react";
import {
    Card,
    Loader,
    Toast,
    Button,
    Tag,
    HeaderComponent,
    SummaryCard,
    Footer,
    Accordion,
    AccordionList
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useHistory } from "react-router-dom";

const ApplicationDetails = () => {
    const { t } = useTranslation();
    const { id: applicationNo } = useParams();
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();

    const [applicationData, setApplicationData] = useState(null);
    const [toast, setToast] = useState(null);
    const [workflowHistory, setWorkflowHistory] = useState([]);

    // API hook for fetching application details
    const { isLoading, data: applicationResponse, error } = applicationNo && tenantId
        ? Digit.Hooks.useCustomAPIHook({
            url: "/tl-services/v1/_search",
            params: {
                tenantId,
                applicationNumber: applicationNo
            },
            config: {
                enabled: !!(applicationNo && tenantId),
                select: (data) => data?.Licenses || [],
            },
        })
        : { isLoading: false, data: null, error: null };

    // API hook for fetching workflow history
    const { data: workflowResponse } = applicationNo && tenantId
        ? Digit.Hooks.useCustomAPIHook({
            url: "/egov-workflow-v2/egov-wf/process/_search",
            params: {
                tenantId,
                businessIds: applicationNo,
                history: true
            },
            config: {
                enabled: !!(applicationNo && tenantId),
                select: (data) => data?.ProcessInstances || [],
            },
        })
        : { data: null };

    useEffect(() => {
        if (applicationResponse && applicationResponse.length > 0) {
            const application = applicationResponse[0];
            const tradeLicenseDetail = application.tradeLicenseDetail || {};
            const owners = tradeLicenseDetail.owners || [];
            const address = tradeLicenseDetail.address || {};
            const tradeUnits = tradeLicenseDetail.tradeUnits || [];

            const formattedApplicationData = {
                applicationNumber: application.applicationNumber,
                licenseNumber: application.licenseNumber,
                applicationDate: application.applicationDate,
                status: application.status,
                financialYear: application.financialYear,
                tradeName: application.tradeName,
                tenantId: application.tenantId,
                address: {
                    doorNo: address.doorNo,
                    buildingName: address.buildingName,
                    street: address.street,
                    locality: address.locality?.name || address.locality,
                    city: address.city,
                    pincode: address.pincode
                },
                tradeDetails: {
                    licenseType: application.licenseType,
                    structureType: tradeLicenseDetail.structureType,
                    subStructureType: tradeLicenseDetail.subStructureType,
                    commencementDate: application.commencementDate
                },
                tradeUnits: tradeUnits.map(unit => ({
                    tradeType: unit.tradeType,
                    uom: unit.uom,
                    uomValue: unit.uomValue
                })),
                owners: owners.map(owner => ({
                    name: owner.name,
                    fatherOrHusbandName: owner.fatherOrHusbandName,
                    mobileNumber: owner.mobileNumber,
                    emailId: owner.emailId,
                    ownerType: owner.ownerType,
                    status: owner.status
                })),
                documents: tradeLicenseDetail.applicationDocuments || []
            };

            setApplicationData(formattedApplicationData);
        }
    }, [applicationResponse]);

    useEffect(() => {
        if (workflowResponse && workflowResponse.length > 0) {
            setWorkflowHistory(workflowResponse);
        }
    }, [workflowResponse]);

    const handleBack = () => {
        history.goBack();
    };


    const getStatusType = (status) => {
        switch (status) {
            case "APPROVED":
                return "success";
            case "REJECTED":
            case "CANCELLED":
                return "error";
            case "INITIATED":
            case "CITIZEN_ACTION_REQUIRED":
            case "PENDINGPAYMENT":
            case "FIELDINSPECTION":
                return "warning";
            default:
                return "monochrome";
        }
    };

    const formatDate = (timestamp) => {
        return timestamp ? new Date(timestamp).toLocaleDateString() : t("ES_COMMON_NA");
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error || !applicationData) {
        return (
            <div>
                <HeaderComponent>{t("TL_APPLICATION_DETAILS")}</HeaderComponent>
                <div className="error-message">{t("TL_APPLICATION_NOT_FOUND")}</div>
            </div>
        );
    }

    const textStyles = {
        color: "#0B4B66",
        fontWeight: "700",
        fontSize: "32px",
        marginBottom: "1.5rem"
    };

    return (
        <div>
            {/* Header Section */}
            <HeaderComponent styles={textStyles}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                        <div styles={textStyles}>{t("TL_APPLICATION_DETAILS")}</div>
                        <Tag
                            type={"monochrome"}
                            label={`${t("TL_APPLICATION_NO")}: ${applicationNo}`}
                            showIcon={true}
                        />
                    </div>
                </div>
            </HeaderComponent>

            {/* Application Status */}
            <Card style={{ marginBottom: "1rem", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "#0B4B66" }}>
                            {t("TL_APPLICATION_STATUS")}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Tag
                                type={getStatusType(applicationData.status)}
                                label={t(`WF_NEWTL_${applicationData.status}`) || t("ES_COMMON_NA")}
                                showIcon={true}
                            />
                            <div style={{ color: "#666" }}>
                                {t("TL_APPLIED_ON")}: {formatDate(applicationData.applicationDate)}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Application Information */}
            <SummaryCard
                header={t("TL_APPLICATION_INFORMATION")}
                type="primary"
                layout={2}
                style={{ marginBottom: "1rem" }}
                sections={[
                    {
                        cardType: 'primary',
                        header: t("TL_DETAILS"),
                        fieldPairs: [
                            {
                                inline: true,
                                label: t("TL_APPLICATION_NO"),
                                value: applicationData.applicationNumber || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_LICENSE_NUMBER"),
                                value: applicationData.licenseNumber || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_FINANCIAL_YEAR"),
                                value: applicationData.financialYear || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_TRADE_NAME"),
                                value: applicationData.tradeName || t("ES_COMMON_NA")
                            }
                        ]
                    }
                ]}
            />

            {/* Trade Details */}
            <SummaryCard
                header={t("TL_TRADE_DETAILS")}
                type="primary"
                layout={2}
                style={{ marginBottom: "1rem" }}
                sections={[
                    {
                        cardType: 'primary',
                        header: t("TL_TRADE_UNITS"),
                        fieldPairs: applicationData.tradeUnits.map((unit, index) => [
                            {
                                inline: true,
                                label: t("TL_TRADE_TYPE"),
                                value: t(`TRADELICENSE_TRADETYPE_${unit.tradeType.replace(".", "_")}`) || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_UOM"),
                                value: unit.uom || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_UOM_VALUE"),
                                value: unit.uomValue || t("ES_COMMON_NA")
                            }
                        ]).flat()
                    }
                ]}
            />

            {/* Address Details */}
            <SummaryCard
                header={t("TL_ADDRESS_DETAILS")}
                type="primary"
                layout={2}
                style={{ marginBottom: "1rem" }}
                sections={[
                    {
                        cardType: 'primary',
                        header: t("TL_ADDRESS_DETAILS"),
                        fieldPairs: [
                            {
                                inline: true,
                                label: t("TL_DOOR_NO"),
                                value: applicationData.address.doorNo || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_BUILDING_NAME"),
                                value: applicationData.address.buildingName || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_STREET_NAME"),
                                value: applicationData.address.street || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_LOCALITY"),
                                value: applicationData.address.locality || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_CITY"),
                                value: applicationData.address.city || t("ES_COMMON_NA")
                            },
                            {
                                inline: true,
                                label: t("TL_PINCODE"),
                                value: applicationData.address.pincode || t("ES_COMMON_NA")
                            }
                        ]
                    }
                ]}
            />

            {/* Owner Details */}
            <SummaryCard
                header={t("TL_OWNER_DETAILS")}
                type="primary"
                layout={2}
                style={{ marginBottom: "1rem" }}
                sections={
                    applicationData.owners && applicationData.owners.length > 0
                        ? applicationData.owners.map((owner, index) => ({
                            cardType: 'primary',
                            header: `${t("TL_OWNER")} ${index + 1}`,
                            fieldPairs: [
                                {
                                    inline: true,
                                    label: t("TL_OWNER_NAME"),
                                    value: owner.name || t("ES_COMMON_NA")
                                },
                                {
                                    inline: true,
                                    label: t("TL_FATHER_HUSBAND_NAME"),
                                    value: owner.fatherOrHusbandName || t("ES_COMMON_NA")
                                },
                                {
                                    inline: true,
                                    label: t("TL_MOBILE_NUMBER"),
                                    value: owner.mobileNumber || t("ES_COMMON_NA")
                                },
                                {
                                    inline: true,
                                    label: t("TL_EMAIL_ID"),
                                    value: owner.emailId || t("ES_COMMON_NA")
                                },
                                {
                                    inline: true,
                                    label: t("TL_OWNER_TYPE"),
                                    value: owner.ownerType || t("ES_COMMON_NA")
                                },
                                {
                                    inline: true,
                                    label: t("TL_STATUS"),
                                    type: "custom",
                                    renderCustomContent: (value) => value,
                                    value: (
                                        <Tag
                                            type={getStatusType(owner.status)}
                                            label={owner.status || t("ES_COMMON_NA")}
                                            showIcon={true}
                                        />
                                    )
                                }
                            ]
                        }))
                        : [{
                            cardType: 'primary',
                            header: t("TL_NO_OWNERS_FOUND"),
                            fieldPairs: [
                                {
                                    inline: true,
                                    label: t("TL_STATUS"),
                                    value: t("ES_COMMON_NA")
                                }
                            ]
                        }]
                }
            />

            <AccordionList>
                {/* Documents */}
                <Accordion
                    title={t("TL_DOCUMENTS")}
                    icon=""
                    number=""
                    onToggle={() => { }}
                    style={{ marginBottom: "1rem" }}
                    hideCardBorder={false}
                    hideDivider={false}
                    hideCardBg={false}
                    hideBorderRadius={false}
                >
                    <div style={{ padding: "1rem" }}>
                        {applicationData.documents && applicationData.documents.length > 0 ? (
                            applicationData.documents.map((doc, index) => (
                                <div key={index} style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "0.5rem" }}>
                                    <div style={{ fontWeight: "500" }}>{t(doc.documentType) || t("ES_COMMON_NA")}</div>
                                    <div style={{ fontSize: "14px", color: "#666" }}>{doc.fileStoreId || t("ES_COMMON_NA")}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                                {t("TL_NO_DOCUMENTS_UPLOADED")}
                            </div>
                        )}
                    </div>
                </Accordion>

                {/* Workflow History */}
                <Accordion
                    title={t("TL_WORKFLOW_HISTORY")}
                    icon=""
                    number=""
                    onToggle={() => { }}
                    style={{ marginBottom: "1rem" }}
                    hideCardBorder={false}
                    hideDivider={false}
                    hideCardBg={false}
                    hideBorderRadius={false}
                >
                    <div style={{ padding: "1rem" }}>
                        {workflowHistory.length > 0 ? (
                            workflowHistory.map((step, index) => (
                                <div key={index} style={{
                                    marginBottom: index < workflowHistory.length - 1 ? "1.5rem" : "0",
                                    paddingBottom: index < workflowHistory.length - 1 ? "1.5rem" : "0",
                                    borderBottom: index < workflowHistory.length - 1 ? "1px solid #e0e0e0" : "none"
                                }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div>
                                            <span style={{ color: "#666", fontSize: "14px" }}>{t("TL_ACTION")}</span>
                                            <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                                                {step.action || t("ES_COMMON_NA")}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: "#666", fontSize: "14px" }}>{t("TL_DATE")}</span>
                                            <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                                                {formatDate(step.auditDetails.createdTime)}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: "#666", fontSize: "14px" }}>{t("TL_BY")}</span>
                                            <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                                                {step.assigner?.name || t("ES_COMMON_NA")}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: "#666", fontSize: "14px" }}>{t("TL_COMMENTS")}</span>
                                            <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                                                {step.comment || t("ES_COMMON_NA")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                                {t("TL_NO_WORKFLOW_HISTORY")}
                            </div>
                        )}
                    </div>
                </Accordion>
            </AccordionList>

            {/* Footer Actions */}
            <Footer
                actionFields={[
                    <Button
                        key="back"
                        label={t("TL_BACK")}
                        variation="secondary"
                        size="medium"
                        onClick={handleBack}
                    />
                ]}
                setactionFieldsToRight={false}
            />

            {toast && (
                <Toast
                    label={toast.label}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ApplicationDetails;
