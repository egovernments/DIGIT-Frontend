import React, { Fragment } from 'react'
import FileComponent from './FileComponent';
import { Header } from '@egovernments/digit-ui-react-components';
import { Card, Button } from '@egovernments/digit-ui-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const DataMgmtComponent = ({ customProps, setupCompleted }) => {
    const history = useHistory();
    const { t } = useTranslation();
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
        <div style={{ marginBottom: "1.5rem" }}>
            <Card className="middle-child" >
                <Header className="summary-main-heading">{t(`MICROPLAN_DATA_CONFIGURATION_HEADING`)} </Header>
            </Card>
            <Card className="mp-margin-bottom">
            
                <div className="mp-header-container">
                    <Header className="summary-sub-heading">
                        {t(`POPULATION`)}
                    </Header>
                    {!(setupCompleted === 'true') &&
                        <Button
                            label={t("WBH_EDIT")}
                            title={t("WBH_EDIT")}
                            variation="secondary"
                            icon={"Edit"}
                            size="medium"
                            type="button"
                            onClick={(e) => {
                                const url = Digit.Hooks.useQueryParams();
                                const urlParams = Digit.Hooks.useQueryParams();
                                urlParams.key = '4';
                                const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                                history.push(updatedUrl);
                            }}
                        />
                    }
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
                                status="completed"
                                rowDetails={item}



                            />
                        )

                    })
                }
            </Card>
            <Card>

                <div className="mp-header-container">
                    <Header className="summary-sub-heading">
                        {t(`FACILITIES`)}
                    </Header>
                    {!(setupCompleted === 'true') &&

                        <Button
                            label={t("WBH_EDIT")}
                            title={t("WBH_EDIT")}
                            variation="secondary"
                            icon={"Edit"}
                            size="medium"
                            type="button"
                            onClick={(e) => {
                                const url = Digit.Hooks.useQueryParams();
                                const urlParams = Digit.Hooks.useQueryParams();
                                urlParams.key = '5';
                                const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                                history.push(updatedUrl);
                            }}
                        />
                    }
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
                                status="completed"
                                rowDetails={item}

                            />
                        )

                    })
                }


            </Card>
        </div>


    )
}
