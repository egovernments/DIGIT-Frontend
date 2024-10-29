import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock, Card, ActionBar, Button } from '@egovernments/digit-ui-components';
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const UserDownload = () => {
    const { t } = useTranslation();
    const [Files, setFile] = useState(""); // Initialize as an empty string
    const { data, isFetching, isLoading } = Digit.Hooks.microplanv1.useFileDownload({
        "SearchCriteria": {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "type": "user"
        }
    },
        {
            enabled: true,
            select: data => {
                const currentUserUuid = Digit.UserService.getUser().info.uuid;
                const ResourceDetails = data?.ResourceDetails || [];
                const filteredData = ResourceDetails.filter(item => item?.auditDetails?.createdBy == currentUserUuid && item?.action == "create");
                data.ResourceDetails = filteredData
                return data;
            }
        }

    )

    useEffect(() => {
        if (data && data["ResourceDetails"]) {
            // Create a new array of file IDs based on the data
            const newFiles = data["ResourceDetails"].map(ob => ob["processedFilestoreId"]);
            setFile(newFiles); // Update the state with the new file IDs
        }
    }, [data]); 

    return (
        <div>
            {isLoading && <LoaderWithGap text={t("CS_LOADING")} />}
            <Card type="secondary" style={{ margin: "1.5rem 0 0 0.5rem" }}>
                <HeaderComp title="DOWNLOAD_USER_DATA" styles={{ color: "black" }} />
                <TextBlock body={
                    <div style={{ color: "black" }}>
                        <span>  {t("DOWNLOAD_DESC")}  </span>
                    </div>
                }
                />
                {data?.ResourceDetails &&
                    [...data?.ResourceDetails].reverse().map((item, index) => {
                        let fileName = item?.additionalDetails?.fileName || `FileNo${item?.processedFilestoreId?.slice(0, 4) || ''}`;


                        return (
                            <FileComponent
                                title=""
                                fileName={fileName}
                                downloadHandler={() => {
                                    Digit.Utils.campaign.downloadExcelWithCustomName({
                                        fileStoreId: item?.processedFilestoreId,
                                        customName: String(fileName)
                                    });
                                }} // Passing the download function
                                status={item?.status}
                                auditDetails={{ userName: item?.username, lastmodTime: item?.auditDetails?.lastmodtime }}
                            />
                        )
                    })
                }
            </Card>
            <ActionBar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: "1" }}>
                <div style={{ marginLeft: "auto" }}>
                    <Link to="/microplan-ui/employee/microplan/user-management" style={{ textDecoration: "none" }}>
                        <Button
                            style={{ minWidth: "12rem" }}
                            className="previous-button"
                            variation="secondary"
                            label={t("BACK")}
                            icon={"ArrowBack"}
                        />
                    </Link>
                </div>
            </ActionBar>
        </div>
    );
}

export default UserDownload;
