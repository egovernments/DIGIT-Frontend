import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock, Card } from '@egovernments/digit-ui-components';
import {LoaderWithGap} from "@egovernments/digit-ui-react-components";
import { useTranslation } from 'react-i18next';


const UserDownload = () => {
    const { t } = useTranslation();
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
                                auditDetails={{userName:item?.username,lastmodTime:item?.auditDetails?.lastmodtime}}
                            />
                            )

    })

                    }
            </Card>
        </div>
    );
}

export default UserDownload;
