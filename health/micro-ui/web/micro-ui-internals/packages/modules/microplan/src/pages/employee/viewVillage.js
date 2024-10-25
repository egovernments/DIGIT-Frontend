import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Loader, Header } from '@egovernments/digit-ui-react-components';
import { Divider, Button, PopUp, Card, ActionBar, Link } from '@egovernments/digit-ui-components';
import AccessibilityPopUP from '../../components/accessbilityPopUP';
import SecurityPopUp from '../../components/securityPopUp';
import EditVillagePopulationPopUp from '../../components/editVillagePopulationPopUP';
import TimelinePopUpWrapper from '../../components/timelinePopUpWrapper';

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
    const [showEditVillagePopulationPopup, setShowEditVillagePopulationPopup] = useState(false);
    const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);

    const findHierarchyPath = (boundaryCode, data, maxHierarchyLevel) => {
        const hierarchy = [];

        let currentNode = data.find(item => item.code === boundaryCode);

        while (currentNode) {
            hierarchy.unshift({ name: currentNode.name, type: currentNode.type }); // Store name and type in the hierarchy
            if (currentNode.type === maxHierarchyLevel) break; // Stop if type matches maxHierarchyLevel
            currentNode = data.find(item => item.code === currentNode.parent); // Move up to the parent
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
    };

    if (isLoading || isLoadingCampaignObject || isLoadingPlanEmployee || isWorkflowLoading) {
        return <Loader />;
    }



    return (

        <React.Fragment>

            <div>
                <div className="village-header" >
                    {'Village 1'}
                </div>
                <Card type="primary" className="middle-child">
                    {hierarchy.map((node, index) => (
                        <div key={index} className="label-pair">
                            <span className="label-heading">
                                {t(`HCM_MICROPLAN_${node.type.toUpperCase()}_LABEL`)}
                            </span>
                            <span className="label-text">{node.name}</span>
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
                                size=""
                                style={{ alignSelf: 'flex-start' }}
                                title=""
                                variation="link"
                            />
                        </div>
                    </div>
                    <Divider
                        className=""
                        variant="small"
                    />

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
                                size=""
                                style={{ alignSelf: 'flex-start' }}
                                title=""
                                variation="link"
                            />
                        </div>
                    </div>
                </Card>
                {showAccessbilityPopup && (
                    <AccessibilityPopUP onClose={onAccibilityClose} census={data} onSuccess={(data) => { refetch(); }} />
                )}

                {showSecurityPopup && (
                    <SecurityPopUp onClose={onSecurityClose} census={data} onSuccess={(data) => { refetch(); }} />
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
                            size=""
                            style={{}}
                            title=""
                            variation="secondary"
                        />}
                    </div>
                    {/* Five Label-Text Pairs */}
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_UPLOADED_TARGET_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data?.additionalDetails?.targetPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_UPLOADED_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data?.totalPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair ">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TARGET_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data?.additionalDetails?.confirmedTargetPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data?.additionalDetails?.confirmedTotalPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_ASSIGNED_DATA_APPROVER_LABEL`)}</span>
                        <span className="label-text">{data?.assignee}</span>
                    </div>
                </Card>

                {showEditVillagePopulationPopup && (
                    <EditVillagePopulationPopUp onClose={onEditPopulationClose} census={data} onSuccess={(data) => { refetch(); }} />
                )}

                <Card type="primary" className="info-card">
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

        </React.Fragment>


    );
};
export default VillageView;