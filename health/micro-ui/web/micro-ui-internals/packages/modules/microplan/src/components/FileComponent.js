 import React from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileIcon } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Table } from '@egovernments/digit-ui-react-components';

const FileComponent = ({ title,fileName,editHandler,deleteHandler}) => {
    const {t}=useTranslation();
    return (
        <div>
            
                {/* First card */}
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>{title}</CardSubHeader>

                </div>
                <Card>
                <div className="dm-parent-container">
                    {/* Left side: File Icon */}
                    <div
                        className="dm-uploaded-file-container-sub"
                        onClick={() => setShowPreview(true)}
                    >
                        <FileIcon className="dm-icon" />
                        <div>{fileName}</div>
                    </div>

                    {/* Right side: Edit and Delete Buttons */}
                    <div className="dm-actions-container">
                        {/* Edit Icon and Button */}
                        <div className="dm-campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                            {/* <span>{t("CAMPAIGN_EDIT")}</span> */}
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
                        </div>

                        {/* Delete Button */}
                        <Button
                            label={t("WBH_DELETE")}
                            variation="secondary"
                            icon={<DeleteIconv2 styles={{ height: "1.25rem", width: "2.5rem" }} />}
                            type="button"
                            className="dm-workbench-download-template-btn dm-hover"
                            onButtonClick={(e) => {
                                deleteHandler();
                            }}
                        />
                    </div>
                </div>
                </Card>
            
            </div>
    );
};

export default FileComponent;
            