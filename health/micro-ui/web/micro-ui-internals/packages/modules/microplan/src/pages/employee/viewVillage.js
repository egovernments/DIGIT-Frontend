import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    const queryParams = new URLSearchParams(location.search);

    const microplanId = queryParams.get('microplanId');
    const boundaryCode = queryParams.get('boundaryCode');
    const tenantId = Digit.ULBService.getCurrentTenantId();

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


    const [showAccessbilityPopup, setShowAccessbilityPopup] = useState(false);
    const [showSecurityPopup, setShowSecurityPopup] = useState(false);
    const [showEditVillagePopulationPopup, setShowEditVillagePopulationPopup] = useState(false);
    const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);

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
        refetch();
    };

    const handleCommentLogClick = () => {
        setShowCommentLogPopup(true);
    };

    const onCommentLogClose = () => {
        setShowCommentLogPopup(false);
        refetch();
    };

    const onSecurityClose = () => {
        setShowSecurityPopup(false);
        refetch();
    };
    const onEditPopulationClose = () => {
        setShowEditVillagePopulationPopup(false);
        refetch();
    };

    if (isLoading) {
        return <Loader />;
    }

    return (

        <React.Fragment>

            <div>
                <div className="village-header" >
                    {'Village 1'}
                </div>
                <Card type="primary" className="middle-child" >

                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_DISCRICT_LABEL`)}</span>
                        <span className="label-text">{data.boundaryCode}</span>
                    </div>

                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_ADMIN_POST_LABEL`)}</span>
                        <span className="label-text">{data.boundaryCode}</span>
                    </div>

                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_LOCALITY_LABEL`)}</span>
                        <span className="label-text">{data.boundaryCode}</span>
                    </div>
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
                    <AccessibilityPopUP onClose={onAccibilityClose} census={data} />
                )}

                {showSecurityPopup && (
                    <SecurityPopUp onClose={onSecurityClose} census={data} />
                )}

                <Card type="primary" className="info-card middle-child">
                    <div className="card-heading">
                        <h2 className="card-heading-title">{t(`HCM_MICROPLAN_POPULATION_DATA_HEADING`)}</h2>
                        <Button
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
                        />
                    </div>
                    {/* Five Label-Text Pairs */}
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_UPLOADED_TARGET_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data.additionalDetails.targetPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_UPLOADED_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data.totalPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair ">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TARGET_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data.additionalDetails.confirmedTargetPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">{data.additionalDetails.confirmedTotalPopulation}</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_ASSIGNED_DATA_APPROVER_LABEL`)}</span>
                        <span className="label-text">{data.assignee}</span>
                    </div>
                </Card>

                {showEditVillagePopulationPopup && (
                    <EditVillagePopulationPopUp onClose={onEditPopulationClose} census={data} />
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
                    <TimelinePopUpWrapper onClose={onCommentLogClose} businessId={data.id} heading="HCM_MICROPLAN_STATUS_LOG_LABEL" />
                )}

            </div>
            {/* commenting becuase some css is not working inside the component*/}
            {/* <ActionBar
                actionFields={[
                    <Button icon="ArrowBack" label="Back" onClick={function noRefCheck() { }} type="button" variation="secondary" />,
                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight={true}
                sortActionFields
                style={{}}
            /> */}

        </React.Fragment>


    );
};
export default VillageView;