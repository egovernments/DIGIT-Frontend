import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, TimelineMolecule, Loader } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
import { convertEpochFormateToDate } from "../utils";
import { downloadFileWithCustomName } from "../utils/downloadFileWithCustomName";
import { DownloadIcon, FileIcon } from "@egovernments/digit-ui-react-components";

const TimelineWrapper = ({ businessId, isWorkFlowLoading, workflowData, labelPrefix = "" }) => {
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
        const fileExtension = fileName.split(".").pop();
        const fileNameWithoutExtension = fileName.replace(`.${fileExtension}`, "");

        downloadFileWithCustomName({
          fileStoreId: fileData?.id,
          customName: fileNameWithoutExtension,
          fileUrl: fileData?.url,
          mimeType: fileData?.mimeType,
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
        variant: "completed",
        subElements: [
          convertEpochFormateToDate(instance?.auditDetails?.lastModifiedTime),
          instance?.action == "ASSIGN"
            ? instance?.assignes &&
              `${instance.assignes?.[0]?.name} - ${
                instance?.assignes?.[0]?.roles
                  ?.map((role) => t(Digit.Utils.locale.getTransformedLocale(`ACCESSCONTROL_ROLES_ROLES_${role.code}`)))
                  .join(", ") || t("NA")
              }`
            : instance?.assigner &&
              `${instance.assigner?.name} - ${
                instance.assigner?.roles
                  ?.map((role) => t(Digit.Utils.locale.getTransformedLocale(`ACCESSCONTROL_ROLES_ROLES_${role.code}`)))
                  .join(", ") || t("NA")
              }`,
          instance?.action === "ASSIGN"
            ? `${t("ES_COMMON_CONTACT_DETAILS")}: ${instance?.assignes?.[0]?.mobileNumber}`
            : `${t("ES_COMMON_CONTACT_DETAILS")}: ${instance?.assigner?.mobileNumber}`,
          instance?.comment && <CommentBox header={t("CS_COMMON_EMPLOYEE_COMMENTS")} description={instance.comment} />,
          ...(instance?.documents && instance.documents.length > 0
            ? instance.documents.map((doc, docIndex) => {
                return (
                  <div key={`doc-${index}-${docIndex}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <FileIcon />
                    <span>{doc.documentName || t("ES_COMMON_FILE_UPLOADED")}</span>
                    <button
                      onClick={() => handleDownloadDocument(doc.fileStoreId, doc.documentName || "document")}
                      className="pgr-download-button"
                      title={t("CS_COMMON_DOWNLOAD")}
                      aria-label={t("CS_COMMON_DOWNLOAD")}
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                );
              })
            : []),
        ].filter(Boolean),
        showConnector: true,
      }));
      setTimelineSteps(steps);
    }
  }, [workflowData]);

  const CommentBox = ({ header, description }) => {
    return (
      <div
        style={{
          border: "1px solid #D6D5D4",
          padding: "12px",
          borderRadius: "8px",
          background: "#FAFAFA",
          width: "fit-content",
          maxWidth: "300px",
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "6px", fontSize: "14px", color: "#333" }}>{header}</h4>

        <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{description}</p>
      </div>
    );
  };

  return isWorkFlowLoading ? (
    <Loader />
  ) : (
    <TimelineMolecule key="timeline" initialVisibleCount={4} hidePastLabel={timelineSteps.length < 5}>
      {timelineSteps.map((step, index) => (
        <Timeline key={index} label={step.label} subElements={step.subElements} variant={step.variant} showConnector={step.showConnector} />
      ))}
    </TimelineMolecule>
  );
};

export default TimelineWrapper;
