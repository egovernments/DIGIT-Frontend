import React from 'react';
import { Button, Card } from '@egovernments/digit-ui-components';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';
import { EditIcon } from '@egovernments/digit-ui-react-components';

const AssumptionsList = ({ customProps }) => {
    const { t } = useTranslation();

    const assumptionValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues || [];
    let dic = {};

    for (const ob of assumptionValues) {
        const category = ob?.category || 'NA'; 
        const key = ob?.key || 'NA';
        const value = ob?.value || 'NA'; 

        if (!(category in dic)) {
            dic[category] = [{ [key]: value }];
        } else {
            dic[category].push({ [key]: value });
        }
    }

    return (
        <div>
            {Object.keys(dic).map((item, ind) => (
                <Card key={`card_${ind}`} style={{ padding: '20px', marginBottom: '15px' }}>
                    {/* Header with title and edit button */}
                    <div className="header-container">
                        <HeaderComp title={String(item)} />
                        <Button
                                label={t("WBH_EDIT")}
                                variation="secondary"
                                icon={"EditIcon"}
                                type="button"
                                className="dm-workbench-download-template-btn dm-hover"
                                onButtonClick={(e) => {
                                    downloadHandler();
                                }}
                            />
                    </div>

                    <div className="as-table-like">
                        {dic[item].map((item1, index) => {
                            const [key, value] = Object.entries(item1)[0] || ['NA', 'NA'];

                            return (
                                <div key={`pair_${index}`} className="as-table-row" style={{ borderBottom: '1px solid #e0e0e0' }} >
                                    <span className="as-table-cell as-key-cell">
                                        <strong>{t(key)}</strong>
                                    </span>
                                    <span className="as-table-cell as-value-cell">
                                        {t(value)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AssumptionsList;
