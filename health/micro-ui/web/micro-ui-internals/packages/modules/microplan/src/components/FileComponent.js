import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2, DownloadIcon, FileIcon, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { Button, InfoButton, TooltipWrapper, Card } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";


const FileComponent = ({ title, fileName, status, auditDetails, editHandler, deleteHandler, downloadHandler, rowDetails }) => {
    const { t } = useTranslation();
    const { XlsxFile } = CustomSVG;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { userName, lastmodTime } = auditDetails || {};
    const [showPreview, setShowPreview] = useState(false);
    const [fileForPreview, setFileForPreview] = useState([]);
    const XlsPreview = Digit.ComponentRegistryService.getComponent("XlsPreview");


    function formatDate(dateString) {
        // Parse the input date string
        const [day, month, year, time, period] = dateString.split(' ');

        // Remove the ordinal suffix (e.g., "5th" to "5")
        const dayNumber = parseInt(day, 10);

        // Format the output date string
        return `${dayNumber.toString().padStart(2, '0')} ${month} ${year}, ${time} ${period}`;
    }

    const handleFilePreview = async (fileStoreId) => {
        const { data: { fileStoreIds } = {} } = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);
        const file = {
            filename: fileName,
            url: fileStoreIds?.[0]?.url,
            filestoreId: fileStoreIds?.[0]?.id
        }
        setFileForPreview(file);
        setShowPreview(true);
    };

    const onFileDownload = (file) => {
        if (file && file?.url) {
            const fileNameWithoutExtension = file?.filename.split(/\.(xlsx|xls)/)[0];
            Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: file?.filestoreId, customName: fileNameWithoutExtension });
        }
    };
    return (
        <Card type="secondary">
            <div className="dm-parent-container" style={{ background: "#FAFAFA", margin: "0" }}>
                <div
                    className="dm-uploaded-file-container-sub"
                    style={{ marginLeft: "-1rem" }}
                >
                    <div onClick={async () => await handleFilePreview(rowDetails?.fileStoreId || rowDetails?.filestoreId)}>
                        <XlsxFile styles={{ width: "6rem", height: "6rem" }} />
                    </div>
                    <div style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}>{fileName}</div>
                </div>

                <div className="dm-actions-container">

                    {(lastmodTime) ? (
                        <div className="dm-audit-info11">
                            {userName && <span style={{ color: "#787878" }}>{t("WBH_UPLOADED_BY")} {userName} {'at'} </span>}
                            {lastmodTime && <span style={{ color: "#787878" }}>{formatDate(lastmodTime)}</span>}
                        </div>) : null
                    }
                    <div className="dm-campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                        {editHandler &&
                            <Button
                                label={t("WBH_EDIT")}
                                title={t("WBH_EDIT")}
                                variation="secondary"
                                icon={<EditIcon styles={{ height: "1.25rem", width: "2.5rem" }} />}
                                type="button"
                                onButtonClick={(e) => {
                                    editHandler();
                                }}
                            />
                        }
                    </div>

                    {deleteHandler &&
                        <Button
                            label={t("WBH_DELETE")}
                            title={t("WBH_DELETE")}
                            variation="secondary"
                            icon={<DeleteIconv2 styles={{ height: "1.25rem", width: "2.5rem" }} />}
                            type="button"
                            onButtonClick={(e) => {
                                deleteHandler();
                            }}
                            style={{ width: "11rem" }}
                        />
                    }

                    {(downloadHandler && status === "completed") && (
                        <Button
                            label={t("WBH_DOWNLOAD")}
                            title={t("WBH_DOWNLOAD")}
                            variation="secondary"
                            icon={"FileDownload"}
                            type="button"
                            onClick={(e) => {
                                downloadHandler();
                            }}
                            style={{ width: "11rem" }}
                        />
                    )}
                    {(downloadHandler && status === "data-accepted") && (
                        <TooltipWrapper content={t('MP_INPROGRESS_USER_CREATION')} >
                            <InfoButton
                                className="dm-workbench-download-template-btn"
                                infobuttontype="info"
                                icon={"Info"}
                                label={t("WBH_INPROGRESS")}
                                style={{ opacity: 1, width: "11rem", border: "none" }}
                            />
                        </TooltipWrapper>
                    )}

                    {(downloadHandler && status !== "completed" && status !== "data-accepted") && (
                        <TooltipWrapper content={t('MP_FAILED_USER_CREATION')} >
                            <InfoButton
                                className="dm-workbench-download-template-btn"
                                infobuttontype="error"
                                icon={"Info"}
                                label={t("WBH_FAILED")}
                                style={{ opacity: 1, width: "11rem", border: "none" }}
                            />
                        </TooltipWrapper>
                    )}
                </div>
                {showPreview && <XlsPreview file={fileForPreview} onBack={() => setShowPreview(false)} onDownload={() => onFileDownload(fileForPreview)} />}
            </div>
        </Card>
    );
};

export default FileComponent;
