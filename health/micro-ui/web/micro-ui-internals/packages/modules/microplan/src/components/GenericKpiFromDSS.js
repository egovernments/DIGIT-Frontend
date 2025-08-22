import React, { useEffect } from 'react';
import { Card } from '@egovernments/digit-ui-components';
import { Loader } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
import useKpiDssSearch from '../hooks/useKpiDssSearch';

const GenericKpiFromDSS = (props) => {
    const { module, status, planId, campaignType, planEmployee = {}, boundariesForKpi = [], refetchTrigger } = props;
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

    const { data, isLoading, refetch } = useKpiDssSearch({
        module,
        planId,
        status,
        campaignType,
        boundariesForKpi: localBoundariesForKpi
    });

    useEffect(() => {
        if (refetchTrigger) {
            refetch();
        }
    }, [refetchTrigger]);

    if (isLoading) {
        return <Loader />
    }

    return (
        data ? (
            <Card>
                <div className="kpi-container">
                    {Object.keys(data || {}).map((key) => (
                        <div key={key} className="kpi-card">
                            <h2>{String(data[key] || 0).padStart(2, '0')}</h2>
                            <p className="kpi-text">{t(key)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        ) : null
    );

};

export default GenericKpiFromDSS;
