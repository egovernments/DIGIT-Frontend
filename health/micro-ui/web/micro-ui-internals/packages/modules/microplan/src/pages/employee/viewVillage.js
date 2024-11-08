import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Loader, Header } from '@egovernments/digit-ui-react-components';
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast } from '@egovernments/digit-ui-components';
import AccessibilityPopUP from '../../components/accessbilityPopUP';
import SecurityPopUp from '../../components/securityPopUp';
import EditVillagePopulationPopUp from '../../components/editVillagePopulationPopUP';
import TimelinePopUpWrapper from '../../components/timelinePopUpWrapper';
import WorkflowCommentPopUp from '../../components/WorkflowCommentPopUp';

const VillageView = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const history = useHistory();
    const [hierarchy, setHierarchy] = useState([]);
    const [availableActionsForUser, setAvailableActionsForUser] = useState([]);
    const { microplanId, boundaryCode, campaignId } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const userInfo = Digit.UserService.getUser();
    const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
    const [showAccessbilityPopup, setShowAccessbilityPopup] = useState(false);
    const [showSecurityPopup, setShowSecurityPopup] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [showEditVillagePopulationPopup, setShowEditVillagePopulationPopup] = useState(false);
    const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);
    const [assigneeName, setAssigneeName] = useState(null);
    const [showComment, setShowComment] = useState(false);
    const [updatedCensus, setUpdatedCensus] = useState(null);

    const findHierarchyPath = (boundaryCode, data, maxHierarchyLevel) => {
        const hierarchy = [];

        let currentNode = data.find(item => item.code === boundaryCode);

        while (currentNode) {
            hierarchy.unshift({ name: currentNode.name, type: currentNode.type });
            if (currentNode.type === maxHierarchyLevel) break;
            currentNode = data.find(item => item.code === currentNode.parent);
        }

        return hierarchy;
    };


    const { data: planEmployeeDetailsData, isLoading: isLoadingPlanEmployee } = Digit.Hooks.microplanv1.usePlanSearchEmployee({
        tenantId: tenantId,
        body: {
            PlanEmployeeAssignmentSearchCriteria: {
                tenantId: tenantId,
                planConfigurationId: microplanId,
                employeeId: [userInfo.info.uuid],
                role: ["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"]
            },
        },
        config: {
            enabled: true,
            select: (data) => {
                return data?.PlanEmployeeAssignment?.[0];
            },
        },
    });


    const {
        isLoading: isLoadingCampaignObject,
        data: campaignObject,
        error: errorCampaign,
        refetch: refetchCampaign,
    } = Digit.Hooks.microplanv1.useSearchCampaign(
        {
            CampaignDetails: {
                tenantId,
                ids: [campaignId],
            },
        },
        {
            enabled: planEmployeeDetailsData ? true : false,
        }
    );


    useEffect(() => {
        if (campaignObject?.boundaries) {
            const parentHierarchy = findHierarchyPath(boundaryCode, campaignObject?.boundaries, planEmployeeDetailsData?.hierarchyLevel);
            setHierarchy(parentHierarchy);
        }
    }, [campaignObject]);

    // Custom hook to fetch census data based on microplanId and boundaryCode
    const reqCriteriaResource = {
        url: `/census-service/_search`,
        body: {
            CensusSearchCriteria: {
                tenantId: tenantId,
                source: microplanId,
                areaCodes: [
                    boundaryCode
                ]
            },
        },
        config: {
            enabled: true,
            select: (data) => {
                return data?.Census[0];
            },
        },
    };

    const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);


    const reqCri = {
        url: `/health-hrms/employees/_search`,
        params: {
            tenantId: tenantId,
            userServiceUuids: data?.assignee,
        },
        config: {
            enabled: data ? true : false,
            select: (data) => {
                return data?.Employees[0];
            },
        },
    };

    const { isLoading: isEmployeeLoading, data: employeeData } = Digit.Hooks.useCustomAPIHook(reqCri);





    const { isLoading: isWorkflowLoading, data: workflowData, revalidate, refetch: refetchBussinessService } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/businessservice/_search",
        params: {
            tenantId: tenantId,
            businessServices: "CENSUS",
        },
        config: {
            enabled: data ? true : false,
            select: (data) => {
                return data.BusinessServices?.[0];
            },
        },
    });

    useEffect(() => {
        if (employeeData?.user?.name) {
            setAssigneeName(employeeData?.user?.name);
        }
    }, [employeeData]);


    useEffect(() => {
        if (workflowData) {

            // Assume selectedFilter maps to applicationStatus or state
            const selectedState = workflowData?.states?.find(
                (state) => state.state === data?.status
            );

            // Filter actions based on the selected state
            const availableActions = selectedState?.actions?.filter((action) =>
                action.roles.some((role) => userRoles.includes(role))
            );

            // Update the available actions state
            setAvailableActionsForUser(availableActions || []);

        }
    }, [workflowData, data]);


    // actionsToHide array by checking for "EDIT" in the actionMap
    const availableEditAction = availableActionsForUser?.filter(action => action?.action?.includes("EDIT"))?.map(action => action?.action);

    const handleEditPopulationClick = () => {
        setShowEditVillagePopulationPopup(true);
    };
    const handleAccibilityClick = () => {
        setShowAccessbilityPopup(true);
    };
    const handleSecurityClick = () => {
        setShowSecurityPopup(true);
    };

    const onAccibilityClose = () => {
        setShowAccessbilityPopup(false);
    };

    const handleCommentLogClick = () => {
        setShowCommentLogPopup(true);
    };

    const onCommentLogClose = () => {
        setShowCommentLogPopup(false);
    };

    const onSecurityClose = () => {
        setShowSecurityPopup(false);
    };
    const onEditPopulationClose = () => {
        setShowEditVillagePopulationPopup(false);
        refetch();
    };

    const onCommentClose = () => {
        setShowComment(false);
    };

    if (isLoading || isLoadingCampaignObject || isLoadingPlanEmployee || isWorkflowLoading) {
        return <Loader />;
    }



    return (

        <React.Fragment>

            <div>
                <div className="village-header" >
                    {t(boundaryCode)}
                </div>
                <Card type="primary" className="middle-child">
                    {hierarchy.map((node, index) => (
                        <div key={index} className="label-pair">
                            <span className="label-heading">
                                {t(`HCM_MICROPLAN_${node.type.toUpperCase()}_LABEL`)}
                            </span>
                            <span className="label-text">{t(node.name)}</span>
                        </div>
                    ))}
                </Card>

                <Card type="primary" className="middle-child">
                    <h2 className="card-heading-title">{t(`HCM_MICROPLAN_SECURITY_AND_ACCESSIBILITY_HEADING`)}</h2>
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_VILLAGE_SECURITY_LABEL`)}</span>
                        <div className="label-text">
                            <Button
                                className="custom-class"
                                icon="ArrowForward"
                                iconFill=""
                                isSuffix
                                label={t(`HCM_MICROPLAN_VILLAGE_SECURITY_DETAIL_LINK`)}
                                onClick={handleSecurityClick}
                                options={[]}
                                optionsKey=""
                                size="medium"
                                style={{ alignSelf: 'flex-start' }}
                                title=""
                                variation="link"
                            />
                        </div>
                    </div>
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_LABEL`)}</span>
                        <div className="label-text">
                            <Button
                                className="custom-class"
                                icon="ArrowForward"
                                iconFill=""
                                isSuffix
                                label={t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_DETAIL_LINK`)}
                                onClick={handleAccibilityClick}
                                options={[]}
                                optionsKey=""
                                size="medium"
                                style={{ alignSelf: 'flex-start' }}
                                title=""
                                variation="link"
                            />
                        </div>
                    </div>
                </Card>
                {showAccessbilityPopup && (
                    <AccessibilityPopUP onClose={onAccibilityClose} census={data} onSuccess={(data) => {
                        onAccibilityClose();
                        setShowToast({ key: "success", label: t("ACCESSIBILITY_DETAILS_UPDATE_SUCCESS"), transitionTime: 5000 });
                        refetch();
                    }} />
                )}

                {showSecurityPopup && (
                    <SecurityPopUp onClose={onSecurityClose} census={data} onSuccess={(data) => {
                        onSecurityClose();
                        setShowToast({ key: "success", label: t("SECURITY_DETAILS_UPDATE_SUCCESS"), transitionTime: 5000 });
                        refetch();
                    }} />
                )}

                <Card type="primary" className="info-card middle-child">
                    <div className="card-heading">
                        <h2 className="card-heading-title">{t(`HCM_MICROPLAN_POPULATION_DATA_HEADING`)}</h2>
                        {availableEditAction.length > 0 && <Button
                            className="custom-class"
                            icon="Edit"
                            iconFill=""
                            label="Edit Confirmed Population"
                            onClick={handleEditPopulationClick}
                            options={[]}
                            optionsKey=""
                            size="small"
                            style={{}}
                            title=""
                            variation="secondary"
                        />}
                    </div>
                    {Object.entries(data?.additionalFields || []).map(([key, fieldData]) => (
                        <React.Fragment key={fieldData.id || key}>
                            <ViewCardFieldPair
                                className=""
                                inline
                                label={t(`HCM_MICROPLAN_${fieldData.key || key}_LABEL`)}
                                style={{}}
                                value={fieldData.value || t("ES_COMMON_NA")}
                            />
                            {/* Only show the divider if it's not the last item */}
                            {key !== Object.keys(data?.additionalFields).slice(-1)[0] && (
                                <Divider className="" variant="small" />
                            )}
                        </React.Fragment>
                    ))}
                </Card>

                {showEditVillagePopulationPopup && (
                    <EditVillagePopulationPopUp onClose={onEditPopulationClose} census={data} onSuccess={(data) => {
                        setUpdatedCensus(data);
                        setShowComment(true);
                        // setShowToast({ key: "success", label: t("EDIT_WORKFLOW_UPDATED_SUCCESSFULLY"), transitionTime: 5000 });
                        // refetch();
                    }} />
                )}

                {showComment && (
                    <WorkflowCommentPopUp
                        onClose={onCommentClose}
                        heading={t(`HCM_MICROPLAN_EDIT_POPULATION_COMMENT_LABEL`)}
                        submitLabel={t(`HCM_MICROPLAN_EDIT_POPULATION_COMMENT_SUBMIT_LABEL`)}
                        url="/census-service/_update"
                        requestPayload={{ Census: updatedCensus }}
                        commentPath="workflow.comments"
                        onSuccess={(data) => {
                            setShowToast({ key: "success", label: t("HCM_MICROPLAN_EDIT_WORKFLOW_UPDATED_SUCCESSFULLY"), transitionTime: 5000 });
                            onCommentClose();
                            refetch();
                        }}
                        onError={(error) => {
                            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                        }}
                    />
                )}

                <Card type="primary" className="info-card" style={{ marginBottom: "2.5rem" }}>
                    <div className="card-heading">
                        <h2 className="card-heading-title">{t(`HCM_MICROPLAN_COMMENT_LOG_HEADING`)}</h2>
                        <Button
                            className="custom-class"
                            icon="Visibility"
                            iconFill=""
                            label={t(`HCM_MICROPLAN_COMMENT_LOG_VIEW_LINK_LABEL`)}
                            onClick={handleCommentLogClick}
                            options={[]}
                            optionsKey=""
                            size=""
                            style={{}}
                            title=""
                            variation="secondary"
                        />
                    </div>
                </Card>

                {showCommentLogPopup && (
                    <TimelinePopUpWrapper onClose={onCommentLogClose} businessId={data?.id} heading="HCM_MICROPLAN_STATUS_LOG_LABEL" />
                )}

            </div>
            {/* commenting becuase some css is not working inside the component*/}
            <ActionBar
                actionFields={[
                    <Button icon="ArrowBack" label={t(`HCM_MICROPLAN_VIEW_VILLAGE_BACK`)} onClick={() => { history.push(`/${window.contextPath}/employee/microplan/pop-inbox?microplanId=${microplanId}&campaignId=${campaignId}`); }} type="button" variation="secondary" />,
                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
            />

            {showToast && (
                <Toast style={{ zIndex: 10001 }}
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
export default VillageView;