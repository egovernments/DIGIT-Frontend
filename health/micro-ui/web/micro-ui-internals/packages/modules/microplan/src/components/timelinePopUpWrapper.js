import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, TimelineMolecule, Loader } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";


const TimelinePopUpWrapper = ({ onClose, businessId, heading,labelPrefix="" }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();


    const tenantId = Digit.ULBService.getCurrentTenantId();

    const { isLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/process/_search",
        params: {
            tenantId: tenantId,
            history: true,
            businessIds: businessId,
        },
        config: {
            enabled: true,
        },
        changeQueryName: businessId,
    }
    );
    
    // Manage timeline data
    const [timelineSteps, setTimelineSteps] = useState([]);

    useEffect(() => {
        if (workflowData && workflowData.ProcessInstances) {
            // Map API response to timeline steps
            const steps = workflowData.ProcessInstances.map((instance, index) => ({
                label: t(`${labelPrefix}${instance?.action}`),
                variant: 'completed',
                subElements: [
                    Digit.Utils.microplanv1.epochToDateTime(instance?.auditDetails?.lastModifiedTime),
                    instance?.assigner &&
                    `${instance.assigner?.name} - ${
                        instance.assigner?.roles
                            ?.map(role => t(Digit.Utils.locale.getTransformedLocale(`MP_ROLE_${role.code}`)))
                            .join(", ") || t('NA')
                    }`,
                    instance.comment && `${t('COMMENT_PREFIX')} "${instance.comment}"`
                ],
                showConnector: true
            }));
            setTimelineSteps(steps);
        }
    }, [workflowData]);
    

    return (
        <PopUp
            onClose={onClose}
            heading={t(heading)}
            onOverlayClick={onClose}
            children={[

                isLoading ? <Loader /> :
                    <TimelineMolecule key="timeline" initialVisibleCount={4} hidePastLabel={timelineSteps.length < 5}>
                        {timelineSteps.map((step, index) => (
                            <Timeline
                                key={index}
                                label={step.label}
                                subElements={step.subElements}
                                variant={step.variant}
                                showConnector={step.showConnector}
                            />
                        ))}
                    </TimelineMolecule>
            ]}
        />
    );

};

export default TimelinePopUpWrapper;
