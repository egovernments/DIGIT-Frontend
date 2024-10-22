import React from 'react';
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';

const AssumptionsList = ({ customProps }) => {
    const { t } = useTranslation();

    // Safely access assumptionValues using optional chaining
    const assumptionValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues || [];

    let dic = {};

    // Iterate through assumptionValues and build the dictionary
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
                    <HeaderComp title={String(item)} />
                    <div className="as-table-like">
                        {dic[item].map((item1, index) => {
                            // Safely destructure the key-value pair, with fallbacks for missing data
                            const [key, value] = Object.entries(item1)[0] || ['NA', 'NA'];

                            return (
                                <div key={`pair_${index}`} className="as-table-row">
                                    <span className="as-table-cell as-key-cell">
                                        <strong>{t(key)}</strong> {/* Display key as label */}
                                    </span>
                                    <span className="as-table-cell as-value-cell">
                                        {t(value)} {/* Display value */}
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
