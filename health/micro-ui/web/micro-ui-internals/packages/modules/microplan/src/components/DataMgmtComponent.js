import React, { Fragment } from 'react'
import FileComponent from './FileComponent';
import HeaderComp from './HeaderComp';
import { Card } from '@egovernments/digit-ui-components';
export const DataMgmtComponent = ({ customProps }) => {
    const totalFormData = customProps;
    const uploadedFiles = totalFormData?.sessionData?.UPLOADBOUNDARYDATA?.boundary?.uploadedFile ? totalFormData?.sessionData?.UPLOADBOUNDARYDATA?.boundary?.uploadedFile : []
    const uploadedFacilities = totalFormData?.sessionData?.UPLOADFACILITYDATA?.facilityWithBoundary?.uploadedFile ? totalFormData?.sessionData?.UPLOADFACILITYDATA?.facilityWithBoundary?.uploadedFile : []

    // console.log("totalfiles", uploadedFiles);
    // {
    //     "filestoreId": "695334cb-5813-4892-a282-a46c075f0798",
    //         "resourceId": "8650d05f-92dc-4410-b96b-29b39876f7c5",
    //             "facilityname": "Population Template (19).xlsx",
    //                 "type": "boundaryWithTarget",
    //                     "inputFileType": "xlsx",
    //                         "templateIdentifier": "Population"
    // }
    return (
        <>
            <Card style={{marginBottom:"1rem"}}>
                <HeaderComp title="POPULATION" styles={{ color: "black" }} />

                {
                    uploadedFiles?.map((item) => {
                        const fileName = item?.filename ? (item?.filename) : (`FileNo${item?.filestoreId}`)
                        return (
                            <FileComponent
                                title=""
                                fileName={fileName}
                                downloadHandler={() => {
                                    Digit.Utils.campaign.downloadExcelWithCustomName({
                                        fileStoreId: item?.filestoreId,
                                        customName: String(fileName)

                                    });
                                }} // Passing the download function




                            />
                        )

                    })
                }
            </Card>
            <Card> 

                <HeaderComp title="FACILITIES" styles={{ color: "black" }} />
                {
                    uploadedFacilities?.map((item) => {
                        const fileName = item?.filename ? (item?.filename) : (`FileNo${item?.filestoreId}`)
                        return (
                            <FileComponent
                                title=""
                                fileName={fileName}
                                downloadHandler={() => {
                                    Digit.Utils.campaign.downloadExcelWithCustomName({
                                        fileStoreId: item?.filestoreId,
                                        customName: String(fileName)

                                    });
                                }} // Passing the download function
                            />
                        )

                    })
                }


            </Card>
        </>


    )
}
