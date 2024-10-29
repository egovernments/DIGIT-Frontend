import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2, DownloadIcon, FileIcon, Card, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { Button, InfoButton } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";


const FileComponent = ({ title, fileName, status, auditDetails, editHandler, deleteHandler, downloadHandler }) => {
    const { t } = useTranslation();
    const { XlsxFile } = CustomSVG;
    const { lastmodTime } = auditDetails || {};
    return (
        <Card
            style={{ background: "#F3F3F3", border: "1px solid #D6D5D4" }}
        >
            <div className="dm-parent-container" style={{ background: "#F3F3F3", margin: "0" }}>
                {/* Left side: File Icon */}
                <div
                    className="dm-uploaded-file-container-sub"
                    style={{ marginLeft: "-1rem" }}
                >
                    {/* <FileIcon className="dm-icon" /> */}
                    <XlsxFile styles={{ width: "6rem", height: "6rem" }} />
                    <div style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}>{fileName}</div>
                </div>

                {/* Right side: Edit, Delete, and Audit details */}
                <div className="dm-actions-container">

                    {/* Display audit details (Uploaded by user and last modified time) */}
                    {(lastmodTime) ? (
                        <div className="dm-audit-info11">
                            {/* Displaying the audit information */}
                            {lastmodTime && <span style={{ color: "#7a7674" }}>{lastmodTime}</span>}
                        </div>) : null
                    }
                    {/* Edit Icon and Button */}
                    <div className="dm-campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                        {editHandler &&
                            <Button
                                label={t("WBH_EDIT")}
                                variation="secondary"
                                icon={<EditIcon styles={{ height: "1.25rem", width: "2.5rem" }} />}
                                type="button"
                                className="dm-workbench-download-template-btn dm-hover"
                                onButtonClick={(e) => {
                                    editHandler();
                                }}
                            />
                        }
                    </div>

                    {/* Delete Button */}
                    {deleteHandler &&
                        <Button
                            label={t("WBH_DELETE")}
                            variation="secondary"
                            icon={<DeleteIconv2 styles={{ height: "1.25rem", width: "2.5rem" }} />}
                            type="button"
                            className="dm-workbench-download-template-btn dm-hover"
                            onButtonClick={(e) => {
                                deleteHandler();
                            }}
                            style={{ width: "11rem" }}
                        />
                    }

                    {/* Download Button */}
                    {(downloadHandler && status === "completed") && (
                        <Button
                            label={t("WBH_DOWNLOAD")}
                            variation="secondary"
                            icon={"FileDownload"}
                            type="button"
                            className="dm-workbench-download-template-btn dm-hover"
                            onClick={(e) => {
                                downloadHandler();
                            }}
                            style={{ width: "11rem" }}
                        />
                    )}
                    {(downloadHandler && status === "data-accepted") && (
                        <Button
                            label={t("WBH_INPROGRESS")}
                            variation="secondary"
                            icon={"Info"}
                            type="button"
                            className="dm-workbench-download-template-btn"
                            style={{ width: "11rem" }}
                        />
                    )}

                    {(downloadHandler && status !== "completed" && status !== "data-accepted") && (
                        <InfoButton
                            className="dm-workbench-download-template-btn"
                            infobuttontype="error"
                            icon={"Info"}
                            label={t("WBH_FAILED")}
                            // isDisabled={true}
                            style={{ background: "#b30505", opacity: 1 , width: "11rem" }}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
};

export default FileComponent;
