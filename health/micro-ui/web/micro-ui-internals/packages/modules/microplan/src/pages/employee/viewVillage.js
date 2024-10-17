import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Card, Header, } from '@egovernments/digit-ui-react-components';
import { Divider, Button, PopUp } from '@egovernments/digit-ui-components';
import AccessibilityPopUP from '../../components/accessbilityPopUP';
import SecurityPopUp from '../../components/securityPopUp';
import EditVillagePopulationPopUp from '../../components/editVillagePopulationPopUP';

const VillageView = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(location.search);

    const miroplanId = queryParams.get('microplanId');
    const boundaryCode = queryParams.get('boundaryCode');

    const [showAccessbilityPopup, setShowAccessbilityPopup] = useState(false);
    const [showSecurityPopup, setShowSecurityPopup] = useState(false);
    const [showEditVillagePopulationPopup, setShowEditVillagePopulationPopup] = useState(false);

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

    const onSecurityClose = () => {
        setShowSecurityPopup(false);
    };
    const onEditPopulationClose = () => {
        setShowEditVillagePopulationPopup(false);
    };



    return (

        <React.Fragment>

            <div>
                <div className="village-header" >
                    {'Village 1'}
                </div>
                <Card type="primary">

                    <div className="label-pair">
                        <span className="label-heading">{t(`HCM_MICROPLAN_DISCRICT_LABEL`)}</span>
                        <span className="label-text">Dist1</span>
                    </div>

                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_ADMIN_POST_LABEL`)}</span>
                        <span className="label-text">AP1</span>
                    </div>

                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_LOCALITY_LABEL`)}</span>
                        <span className="label-text">Loc1</span>
                    </div>
                </Card>

                <Card type="primary">
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

                    <div className="label-pair middle-child">
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
                    <AccessibilityPopUP onClose={onAccibilityClose} />
                )}

                {showSecurityPopup && (
                    <SecurityPopUp onClose={onSecurityClose} />
                )}

                <Card type="primary" className="info-card">
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
                        <span className="label-text">5000</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_UPLOADED_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">1000 sq km</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TARGET_POPULATION_LABEL`)}</span>
                        <span className="label-text">25</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_CONFIRM_TOTAL_POPULATION_LABEL`)}</span>
                        <span className="label-text">3</span>
                    </div>
                    <Divider className="" variant="small" />
                    <div className="label-pair middle-child">
                        <span className="label-heading">{t(`HCM_MICROPLAN_ASSIGNED_DATA_APPROVER_LABEL`)}</span>
                        <span className="label-text">Adequate</span>
                    </div>
                </Card>

                {showEditVillagePopulationPopup && (
                    <EditVillagePopulationPopUp onClose={onEditPopulationClose} />
                )}

                <Card type="primary" className="info-card">
                    <div className="card-heading">
                        <h2 className="card-heading-title">{t(`HCM_MICROPLAN_COMMENT_LOG_HEADING`)}</h2>
                        <Button
                            className="custom-class"
                            icon="Visibility"
                            iconFill=""
                            label={t(`HCM_MICROPLAN_COMMENT_LOG_VIEW_LINK_LABEL`)}
                            onClick={function noRefCheck() { }}
                            options={[]}
                            optionsKey=""
                            size=""
                            style={{}}
                            title=""
                            variation="secondary"
                        />
                    </div>
                </Card>

            </div>
        </React.Fragment>


    );
};
export default VillageView;