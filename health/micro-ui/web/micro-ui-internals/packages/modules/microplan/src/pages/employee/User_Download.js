import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import { Card } from '@egovernments/digit-ui-components';
import HeaderComp from '../../components/HeaderComp';
import { TextBlock } from '@egovernments/digit-ui-components';

const User_Download = () => {
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

    const {

        data,

    } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);


    // Use useEffect to update Files only when data changes
    useEffect(() => {
        if (data && data["ResourceDetails"]) {
            // Create a new array of file IDs based on the data
            const newFiles = data["ResourceDetails"].map(ob => ob["processedFilestoreId"]);
            setFile(newFiles); // Update the state with the new file IDs
        }
    }, [data]); // Only run this effect when `data` changes

    console.log("files", Files); // This will show the updated files after state is set


    console.log("data", data);





    console.log("fileurl", Files);





    return (
        <div>


            <Card>
                <HeaderComp title="DOWNLOAD_USER_DATA" styles={{ color: "black" }} />
                <TextBlock body="DOWNLOAD_DESC" />
                {Files &&
                    Files.map((item, index) => (

                        <FileComponent
                            title=""
                            fileName={String(index)}
                            downloadHandler={() => { Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: item, customName: String(index) }); }} // Passing the download function
                        />

                    ))

                }
            </Card>
        </div>
    );
}

export default User_Download;
