import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, TimelineMolecule, Loader } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";
import { convertEpochFormateToDate } from '../utils';
import { downloadFileWithCustomName } from "../utils/downloadFileWithCustomName";

const TimelineWrapper = ({ businessId, isWorkFlowLoading, workflowData, labelPrefix="" }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    // Manage timeline data
    const [timelineSteps, setTimelineSteps] = useState([]);

    // Download verification document
    const handleDownloadDocument = async (fileStoreId, fileName = "verification_document") => {
        if (!fileStoreId) return;

        try {
            const { data: { fileStoreIds } = {} } = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);
            const fileData = fileStoreIds?.[0];

            if (fileData?.url) {
                const fileExtension = fileName.split('.').pop();
                const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, '');

                downloadFileWithCustomName({
                    fileStoreId: fileData?.id,
                    customName: fileNameWithoutExtension,
                    fileUrl: fileData?.url,
                    mimeType: fileData?.mimeType
                });
            }
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    useEffect(() => {
        if (workflowData && workflowData.ProcessInstances) {
            // Map API response to timeline steps
            const steps = workflowData.ProcessInstances.map((instance, index) => ({
                label: t(`${labelPrefix}${instance?.action}`),
                variant: 'completed',
                subElements: [
                    convertEpochFormateToDate(instance?.auditDetails?.lastModifiedTime),
                    (instance?.action == "ASSIGN" ? instance?.assignes && `${instance.assignes?.[0]?.name} - ${
                        instance?.assignes?.[0]?.roles
                            ?.map(role => t(Digit.Utils.locale.getTransformedLocale(`ACCESSCONTROL_ROLES_ROLES_${role.code}`)))
                            .join(", ") || t('NA')
                    }` : instance?.assigner &&
                    `${instance.assigner?.name} - ${
                        instance.assigner?.roles
                            ?.map(role => t(Digit.Utils.locale.getTransformedLocale(`ACCESSCONTROL_ROLES_ROLES_${role.code}`)))
                            .join(", ") || t('NA')
                    }`),
                    (instance?.action === "ASSIGN" ? `${t("ES_COMMON_CONTACT_DETAILS")}: ${instance?.assignes?.[0]?.mobileNumber}` : `${t("ES_COMMON_CONTACT_DETAILS")}: ${instance?.assigner?.mobileNumber}`),
                    instance?.comment && `${t('CS_COMMON_EMPLOYEE_COMMENTS')} : "${instance.comment}"`,
                    ...(instance?.documents && instance.documents.length > 0
                        ? instance.documents.map(
                            (doc) =>
                              `${t("ES_COMMON_FILE_UPLOADED")}: ${doc.fileStoreId}`
                          )
                        : []),
                ].filter(Boolean),
                showConnector: true
            }));
            setTimelineSteps(steps);
        }
    }, [workflowData]);
    
    return (
        isWorkFlowLoading ? <Loader /> :
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
    );
};

export default TimelineWrapper;
