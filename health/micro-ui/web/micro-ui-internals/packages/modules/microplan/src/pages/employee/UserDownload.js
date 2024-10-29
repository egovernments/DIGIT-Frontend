import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock, Card,Button,ActionBar } from '@egovernments/digit-ui-components';
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const UserDownload = () => {
    const { t } = useTranslation();
    const {history}=useHistory();
    const [Files, setFile] = useState(""); // Initialize as an empty string
    const { data, isFetching, isLoading } = Digit.Hooks.microplanv1.useFileDownload({
        "SearchCriteria": {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "type": "user",
            "status": "completed"
            // "action": "create"
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






    // Use useEffect to update Files only when data changes
    useEffect(() => {
        if (data && data["ResourceDetails"]) {
            // Create a new array of file IDs based on the data
            const newFiles = data["ResourceDetails"].map(ob => ob["processedFilestoreId"]);
            setFile(newFiles); // Update the state with the new file IDs
        }
    }, [data]); // Only run this effect when `data` changes













    return (
        <div>
            {isLoading && <LoaderWithGap text={t("CS_LOADING")} />}
            <Card type="secondary" >
                <HeaderComp title="DOWNLOAD_USER_DATA" styles={{ color: "black" }} />
                <TextBlock body={t("DOWNLOAD_DESC")} />
                {data?.ResourceDetails &&
                    [...data?.ResourceDetails].reverse().map((item, index) => {
                        let fileName = item?.additionalDetails?.fileName || `FileNo${item?.processedFilestoreId?.slice(0, 4) || ''}`;

                        console.log("item", item);
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
                                auditDetails={{ userName: item?.username, lastmodTime: item?.auditDetails?.lastmodtime }}
                            />
                        )

                    })

                }
                <ActionBar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: "1" }}>
                    <Link to="/microplan-ui/employee/" style={{ textDecoration: "none" }}>
                        <Button
                            style={{ margin: "0.5rem", minWidth: "12rem", marginLeft: "6rem" }}
                            className="previous-button"
                            variation="secondary"
                            label={t("BACK")}
                            icon={"ArrowBack"}
                        />
                    </Link>
                   
                </ActionBar>
            </Card>
        </div>
    );
}

export default UserDownload;
