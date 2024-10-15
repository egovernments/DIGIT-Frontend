import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock } from '@egovernments/digit-ui-components';

const UserDownload = () => {
    const [Files, setFile] = useState(""); // Initialize as an empty string
    const reqCriteriaResource = {
        url: "/project-factory/v1/data/_search",
        body: {
            "SearchCriteria": {
                "tenantId": Digit.ULBService.getCurrentTenantId(),
                "source": "microplan",
                "status": "completed"
            }
        },
        config: {
            enabled: true,
            select: data => {
                // debugger;
                return data;
            }
        }
    };

    // const {

    //     data,

    // } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

    const { data, isFetching, isLoading } = Digit.Hooks.microplanv1.useFileDownload({
        "SearchCriteria": {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "source": "microplan",
            "status": "completed"
        }
    },
        {
            enabled: true,
            select: data => {
                // debugger;
                return data;
            }
        }

    )



    console.log("fileDownloadData", data);



    // Use useEffect to update Files only when data changes
    useEffect(() => {
        if (data && data["ResourceDetails"]) {
            // Create a new array of file IDs based on the data
            const newFiles = data["ResourceDetails"].map(ob => ob["processedFilestoreId"]);
            setFile(newFiles); // Update the state with the new file IDs
        }
    }, [data]); // Only run this effect when `data` changes



    // console.log("data", data);





    // console.log("fileurl", Files);





    return (
        <div>


            <Card>
                <HeaderComp title="DOWNLOAD_USER_DATA" styles={{ color: "black" }} />
                <TextBlock body="DOWNLOAD_DESC" />
                {data?.ResourceDetails &&
                    data?.ResourceDetails.map((item, index) => {
                        {console.log("item.userName",item,item?.auditDetails?.lastmodtime)}
                        return (
                        <FileComponent
                            title=""
                            fileName={`FileNo${item?.fileStoreId.slice(0, 4)}`}
                            downloadHandler={() => {
                                Digit.Utils.campaign.downloadExcelWithCustomName({
                                    fileStoreId: item?.fileStoreId, customName: `FileNo${item?.fileStoreId.slice(0, 4)}`
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
