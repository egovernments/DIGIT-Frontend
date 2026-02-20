import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, Loader } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";
import { formatTimestampToDateTime } from '../utils';


const CommentPopUp = ({ onClose, businessId, heading }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();


    const tenantId = Digit.ULBService.getCurrentTenantId();

    const { isLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/process/_search",
        params: {
            tenantId: tenantId,
            businessIds: businessId,
        },
        config: {
            enabled: true,
        },
        changeQueryName: businessId,
    }
    );

    return (
        <PopUp
            style={{ width: "700px" }}
            onClose={onClose}
            heading={t(heading)}
            onOverlayClick={onClose}
            children={[
                isLoading ? <Loader /> :
                    <Timeline
                        label={t(`${workflowData?.ProcessInstances?.[0]?.comment}`) || "NA"}
                        subElements={[formatTimestampToDateTime(workflowData?.ProcessInstances?.[0]?.auditDetails?.lastModifiedTime),]}
                        variant={"completed"}
                        showConnector={true}
                    />

            ]}
        />
    );

};

export default CommentPopUp;
