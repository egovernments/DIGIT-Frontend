import React from 'react';
import { Card } from '@egovernments/digit-ui-components';
import { Loader } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
import useKpiDssSearch from '../hooks/useKpiDssSearch';

const GenericKpiFromDSS = (props) => {
    const { module, planId, campaignType, planEmployee={}, boundariesForKpi=[] } = props;

    // Create a copy of the boundariesForKpi array
    const localBoundariesForKpi = [...boundariesForKpi];


    if (localBoundariesForKpi.length === 0) {
        const hierarchyLevel = planEmployee?.planData?.[0]?.hierarchyLevel;
        const jurisdictionCodes = planEmployee?.planData?.[0]?.jurisdiction;
        if(jurisdictionCodes?.length > 0 && hierarchyLevel){
            for (const code of jurisdictionCodes) {
                localBoundariesForKpi.push({
                    type: hierarchyLevel,
                    code: code
                });
            }
        }
    }

    const { t } = useTranslation();

    const { data, loader } = useKpiDssSearch({
        module,
        planId,
        campaignType,
        boundariesForKpi: localBoundariesForKpi
    });

    if (loader) {
        return <Loader />
    }

    return (
        <Card>
            <div className="kpi-container">
                {Object.keys(data || {}).map((key) => (
                    <div key={key} className={`kpi-card`}>
                        <h2>{String(data[key] || 0).padStart(2, '0')}</h2>
                        <p className="kpi-text">
                            {t(key)}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default GenericKpiFromDSS;
