import React from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileIcon } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { datamgmtconfig } from "../configs/datamgmtconfigs";

const FileComponent = ({ file, index, handleFileDelete, handleRedirect, setShowPreview }) => {
    const { t } = useTranslation();
    const datamgmtConfigs = datamgmtconfig();
    console.log(datamgmtConfigs);
    return (
        <div>
            <Card>
                {/* First card */}
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>Population</CardSubHeader>

                </div>
                <div className="dm-parent-container">
                    {/* Left side: File Icon */}
                    <div
                        className="dm-uploaded-file-container-sub"
                        onClick={() => setShowPreview(true)}
                    >
                        <FileIcon className="dm-icon" />
                        <div>Filename.xlsx</div>
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
                                    // e.stopPropagation();
                                    //  handleFileDelete(file, index);
                                    // setShowPreview(false);
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
                                // e.stopPropagation();
                                //  handleFileDelete(file, index);
                                // setShowPreview(false);
                            }}
                        />
                    </div>
                </div>
            </Card>
            {/* Second card */}
            <Card>
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>Facilities</CardSubHeader>

                </div>
                <div className="dm-parent-container">
                    {/* Left side: File Icon */}
                    <div
                        className="dm-uploaded-file-container-sub"
                        onClick={() => setShowPreview(true)}
                    >
                        <FileIcon className="dm-icon" />
                        <div>"Hello"</div>
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
                                    // e.stopPropagation();
                                    //  handleFileDelete(file, index);
                                    // setShowPreview(false);
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
                                // e.stopPropagation();
                                //  handleFileDelete(file, index);
                                // setShowPreview(false);
                            }}
                        />
                    </div>
                </div>
            </Card>
            <Card>
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>Vehicles</CardSubHeader>
                </div>
                <InboxSearchComposer
                    configs={datamgmtConfigs}
                />

                
                

                


            </Card>
        </div>
    );
};

export default FileComponent;
