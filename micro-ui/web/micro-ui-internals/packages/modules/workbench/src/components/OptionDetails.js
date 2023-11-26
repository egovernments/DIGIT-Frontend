import React from 'react';
import { Button, Close } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const OptionDetails = ({
    isSelect,
    showDetails,
    selectedDetails,
    schemaCode,
    handleSelect,
    setShowTooltipFlag,
    setIsSelect,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const handleViewMoreClick = (detail) => {
        const schemaCode = detail?.schemaCode;
        const [moduleName, masterName] = schemaCode.split(".");
        const uniqueIdentifier = detail?.uniqueIdentifier;
        history.push(`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`);
    };

    return (
        <div className="option-details">
            {isSelect && (
                <div>
                    {showDetails?.map((detail) => (
                        <div key={detail.id}>
                            <div className="detail-container">
                                {Object.keys(detail.data).map((key) => {
                                    const value = detail.data[key];
                                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                                        return (
                                            <div className="detail-item" key={key}>
                                                <div className="key">{t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${key}`))}</div>
                                                <div className="value">{String(value)}</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="select">
                                <Button label={t("WORKBENCH_LABEL_SELECT")} onButtonClick={() => handleSelect(detail)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isSelect && (
                <div>
                    {selectedDetails?.map((detail) => (
                        <div key={detail.id}>
                            <div className="detail-container">
                                {Object.keys(detail.data).map((key) => {
                                    const value = detail.data[key];
                                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                                        return (
                                            <div className="detail-item" key={key}>
                                                <div className="key">{t(Digit.Utils.locale.getTransformedLocale(`${schemaCode}_${key}`))}</div>
                                                <div className="value">{String(value)}</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="view-more">
                                <Button label={t("WORKBENCH_LABEL_VIEW_MORE")} onButtonClick={() => handleViewMoreClick(detail)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="close-button" onClick={() => { setShowTooltipFlag(false); setIsSelect(false); }}>
                <Close />
            </div>
        </div>
    );
};

export default OptionDetails;
