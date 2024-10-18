import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock } from '@egovernments/digit-ui-components';

const UserDownload = () => {
    
    const [Files, setFile] = useState(""); // Initialize as an empty string
   

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


            <Card>
                <HeaderComp title="DOWNLOAD_USER_DATA" styles={{ color: "black" }} />
                <TextBlock body="DOWNLOAD_DESC" />
                    {data?.ResourceDetails &&
                        [...data?.ResourceDetails].reverse().map((item, index) => {
                            let fileName=`FileNo${item?.processedFilestoreId.slice(0, 4)}`
                            if ((data?.ResourceDetails?.additionalDetails?.fileName)){
                                fileName=data?.ResourceDetails?.additionalDetails?.fileName;

                            }
                            
                            return (
                            <FileComponent
                                title=""
                                fileName={`FileNo${item?.fileStoreId.slice(0, 4)}`}
                                downloadHandler={() => {
                                    Digit.Utils.campaign.downloadExcelWithCustomName({
                                        fileStoreId: fileName
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
