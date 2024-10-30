import React, { Fragment } from 'react'
import FileComponent from './FileComponent';
import HeaderComp from './HeaderComp';
import { Card,Button } from '@egovernments/digit-ui-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const DataMgmtComponent = ({ customProps }) => {
    const history=useHistory();
    const {t}=useTranslation();
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
            <Card style={{ marginBottom: "1rem" }}>
                <div className="header-container">
                    <HeaderComp title="POPULATION" styles={{ color: "black" }} />
                    <Button
                        label={t("WBH_EDIT")}
                        variation="secondary"
                        icon={"EditIcon"}
                        type="button"
                        className="dm-workbench-download-template-btn dm-hover"
                        onClick={(e) => {
                            const url = Digit.Hooks.useQueryParams();
                            const urlParams = Digit.Hooks.useQueryParams();
                            urlParams.key = '4';
                            const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                            history.push(updatedUrl);
                        }}
                    />
                </div>

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

            <div className="header-container">
                    <HeaderComp title="FACILITIES" styles={{ color: "black" }} />
                    <Button
                        label={t("WBH_EDIT")}
                        variation="secondary"
                        icon={"EditIcon"}
                        type="button"
                        className="dm-workbench-download-template-btn dm-hover"
                        onClick={(e) => {
                            const url = Digit.Hooks.useQueryParams();
                            const urlParams = Digit.Hooks.useQueryParams();
                            urlParams.key = '5';
                            const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                            history.push(updatedUrl);
                        }}
                    />
                </div>
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
