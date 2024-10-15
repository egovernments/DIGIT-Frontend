import { Card, Uploader, Button, PopUp, ActionBar, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useRef} from "react";
import { useTranslation } from "react-i18next";
// import { useParams,useHistory } from "react-router-dom";
import XlsPreviewNew from "../../components/XlsPreviewNew";
import { Svgicon } from "../../utils/Svgicon";
import { Loader } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ViewHierarchy = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const defaultHierarchyType = searchParams.get("defaultHierarchyType");
    const hierarchyType = searchParams.get("hierarchyType");
    const [showPopUp, setShowPopUp] = useState(false);
    // const stateData = window.history.state;
    const stateData = location.state;
    const [geoPodeData, setGeoPodeData] = useState(false);
    const inputRef = useRef(null); // Ref to trigger file input


    const [defData, setDefData] = useState([]);
    const [hierData, setHierData] = useState([]);

    const hierarchies = [defaultHierarchyType, hierarchyType];
    const [previewPage, setPreviewPage] = useState(false);
    const [firstPage, setFirstPage] = useState(true);
    const [fileUrl, setFileUrl] = useState("");
    const [fileData, setFileData] = useState({});
    const [fileStoreId, setFileStoreId] = useState("");
    const [showToast, setShowToast] = useState(null); // State to handle toast notifications
    const [dataCreateToast, setDataCreateToast] = useState(false);
    const [disable, setDisable] = useState(false);
    const [disableFile, setDisableFile] = useState(false);
    const [dataCreationGoing, setDataCreationGoing] = useState(false);

    const callSearch = async(hierarchy) =>{
        const res = await Digit.CustomService.getResponse({
            url: `/boundary-service/boundary-hierarchy-definition/_search`,
                body: {
                    BoundaryTypeHierarchySearchCriteria: {
                        tenantId: tenantId,
                        limit: 2,
                        offset: 0,
                        hierarchyType: hierarchy
                  }
                }
        });
        return res;

    }

    const [viewState, setViewState] = useState(false);

    const fetchData = async()=>{
        try{
            const res = await callSearch(defaultHierarchyType);
            if(res?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setDefData(res?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
            const res1 = await callSearch(hierarchyType);
            if(res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setHierData(res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
            setViewState(true);
        }
        catch(error) {
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    // const { downloadExcelTemplate, loading, error } = downloadTemplate(defData, defaultHierarchyType);
    
    const generateFile = async()=>{
        const res = await Digit.CustomService.getResponse({
            url: `/project-factory/v1/data/_generate`,
            body: {
            },
            params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                forceUpdate: true,
                hierarchyType: hierarchyType,
                campaignId: "default"
            }
        });
        return res;
    }
    const generateTemplate = async() => {
        const res = await Digit.CustomService.getResponse({
            url: `/project-factory/v1/data/_download`,
            body: {
            },
            params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                hierarchyType: hierarchyType,
                campaignId: "default"
            }
        });
        return res;

    }
    const downloadExcelTemplate = async() => {
        const res = await generateFile()
        const resFile = await generateTemplate();
        if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
            // Splitting filename before .xlsx or .xls
            const fileNameWithoutExtension = hierarchyType ;
            
            Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid, customName: fileNameWithoutExtension });
        }

    }

    const handleUpload = () => {
        inputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = [event.target.files[0]]; // Get the first selected file
        if (file) {
          try {
            // Call function to upload the selected file to an API
            await uploadFileToAPI(file);
            setDisableFile(true);
            setShowToast({ label: t("FILE_UPLOADED_SUCCESSFULLY"), isError:"success"});
          } catch (error) {
            setShowToast({ label: error?.response?.data?.Errors?.[0]?.message ? error?.response?.data?.Errors?.[0]?.message : t("FILE_UPLOAD_FAILED") , isError:"error" });
          }
        }
    };

    const uploadFileToAPI = async (files) => {
            const module = "HCM";
            let file = files[0];
            let fileDataTemp = {};
            fileDataTemp.fileName = file?.name
            
            const response = await Digit.UploadServices.Filestorage(module, file, tenantId);
            fileDataTemp.fileStoreId = response?.data?.[0]?.fileStoreId;
            let fileStoreIdTemp = response?.data?.files?.[0]?.fileStoreId;
            setFileStoreId(response?.data?.files?.[0]?.fileStoreId);
            const { data: { fileStoreIds: fileUrlTemp } = {} } = await Digit.UploadServices.Filefetch([fileStoreIdTemp], tenantId);
            fileDataTemp.url = fileUrlTemp?.[0]?.url;

            setFileUrl(fileDataTemp?.url);
            setFileData(fileDataTemp);
      };

    const callCreateDataApi = async()=>{
        setDisable(true);
        setDataCreationGoing(true);
        try{
            setDataCreateToast(true);
            const res = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_create",
                params: {},
                body: {
                    ResourceDetails: {
                        tenantId: tenantId,
                        type: "boundaryManagement",
                        fileStoreId: fileStoreId,
                        action: "create",
                        hierarchyType: hierarchyType,
                        additionalDetails: {
                            source: "boundary"
                        },
                    },
                },

            });
            setDataCreateToast(false);
            setShowToast({ label: `${t("WBH_HIERARCHY_CREATED")}`, isErro:"success" });
            return res;
        }
        catch(resp){
            setDisable(false);
            let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            resp?.response?.data?.Errors?.map((err, idx) => {
            if (idx === resp?.response?.data?.Errors?.length - 1) {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
            } else {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
            }
            });
            setShowToast({ label, isError: "error" });
            setDataCreationGoing(false);
            return {};
        }
    }
    
    const createData = async()=> {
        const res = await callCreateDataApi();

    }

   
    if(!viewState)
    {
        return (
            <Loader />
        )
    }

    else
    {
        return (
            <React.Fragment>
                {firstPage && 
                    <div>
                        <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                            <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{t(`HIERARCHY`)} {hierarchyType}</div>
                            <div style={{ height: "2rem" }}></div>
                            {hierData.map((hierItem, index) => {
                                // Check if the index is less than defData length
                                const isLessThanDefData = index < defData.length;
            
                                if (isLessThanDefData) {
                                    if (hierItem?.boundaryType === defData[index]?.boundaryType) {
                                        return (
                                            <div>
                                                <div style={{fontWeight:"600", fontSize:"1.2rem"}}>
                                                    {hierItem?.boundaryType}
                                                </div>
                                                <div style={{height:"1rem"}}></div>
                                                <Card type={"primary"} variant={"form"} className={"question-card-container"} >
                                                    <div style={{display:"flex", gap:"2rem"}}>
                                                    <Svgicon />
                                                    <div style={{display:"flex", alignItems:"center", fontWeight:"600"}}>
                                                        {hierItem?.boundaryType}{".shp"}
                                                    </div>
                                                    </div>
                                                </Card>
                                                <hr style={{borderTop:"1px solid #ccc", margin:"1rem 0"}}/>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
                                                    <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                                                        {hierItem?.boundaryType}
                                                    </div>
                                                    <Uploader
                                                        onUpload={() => {}}
                                                        showAsTags
                                                        uploadedFiles={[]}
                                                        variant="uploadFile"
                                                        style={{width:"50rem"}}
                                                    />
                                                </div>
                                                <div style={{height:"2rem"}}></div>
                                                <hr style={{borderTop:"1px solid #ccc", margin:"1rem 0"}}/>
                                            </div>
                                        );
                                    }
                                } else {
                                    return (
                                        <div>
                                                <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
                                                    <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                                                        {hierItem?.boundaryType}
                                                    </div>
                                                    <Uploader
                                                        onUpload={() => {}}
                                                        showAsTags
                                                        uploadedFiles={[]}
                                                        variant="uploadFile"
                                                        style={{width:"50rem"}}
                                                    />
                                                </div>
                                                <div style={{height:"2rem"}}></div>
                                                <hr style={{borderTop:"1px solid #ccc", margin:"1rem 0"}}/>
                                            </div>
                                    );
                                }
                            })}
                        </Card>
                        <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                <div style={{fontSize:"2.5rem", fontWeight:700}}>{t("UPLOAD_EXCEL")}</div>
                                <Button
                                    className="custom-class"
                                    icon="DownloadIcon"
                                    iconFill=""
                                    label={t("DOWNLOAD_EXCEL_TEMPLATE")}
                                    onClick={downloadExcelTemplate}
                                    options={[]}
                                    optionsKey=""
                                    size="small"
                                    style={{}}
                                    title=""
                                    variation="link"
                                />
                            </div>  
                            <div>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <div style={{fontWeight:"600", fontSize:"1.2rem"}}>{t("UPLOAD_EXCEL_FOR_ALL_BOUNDARIES")}</div>
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange} // Trigger file upload when a file is selected
                                    />
                                    <Button
                                        className="custom-class"
                                        icon="Upload"
                                        iconFill=""
                                        label={t("UPLOAD_EXCEL")}
                                        onClick={handleUpload}
                                        options={[]}
                                        optionsKey=""
                                        size="large"
                                        style={{}}
                                        title=""
                                        variation="secondary"
                                    />
                                </div>
                            </div>                  
                        </Card>
                        <ActionBar
                            actionFields={[
                                <Button 
                                    icon="ArrowBack" 
                                    style={{marginLeft:"3.5rem"}} 
                                    label={t("Back")} 
                                    isDisabled={true}
                                    // onClick={{}}
                                    type="button" 
                                    variation="secondary"  
                                    textStyles={{width:'unset'}}
                                />,
                                <Button 
                                    icon="ArrowForward" 
                                    isDisabled={!disableFile }
                                    style={{marginLeft:"auto"}} 
                                    isSuffix 
                                    label={t("Next")} 
                                    onClick={()=>{setPreviewPage(true); setFirstPage(false);}} 
                                    type="button" 
                                    textStyles={{width:'unset'}}
                                />
                            ]}
                            className="custom-action-bar"
                            maxActionFieldsAllowed={5}
                            setactionFieldsToRight
                            sortActionFields
                            style={{}}
                        />
                    </div>
                }
                {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}
                {dataCreateToast && <Toast label={t("DATA_CREATION_IN_PROGRESS")} type={"info"} transitionTime={600000000} />}
                {previewPage && (
                    <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                        <div style={{fontSize:"2.5rem", fontWeight:700}}>{t("CONFIRM_BOUNDARY_DATA")}</div>
                        <div style={{height:"1.5rem"}}></div>
                        <XlsPreviewNew file={fileData} onDownload={() => {}} onBack={() => {setShowPreview(false); setUploadPage(true)}} />
                        <ActionBar
                            actionFields={[
                                <Button 
                                    icon="ArrowBack" 
                                    style={{marginLeft:"3.5rem"}} 
                                    isDisabled={disable}
                                    label={t("Back")} 
                                    onClick={()=>{setFirstPage(true); setPreviewPage(false)}} 
                                    type="button" 
                                    variation="secondary"  
                                    textStyles={{width:'unset'}}
                                />,
                                <Button 
                                    icon="ArrowForward" 
                                    isDisabled={dataCreationGoing}
                                    style={{marginLeft:"auto"}} 
                                    isSuffix 
                                    label={t("Next")} 
                                    onClick={()=>{createData()}} 
                                    type="button" 
                                    textStyles={{width:'unset'}}
                                />
                            ]}
                            className="custom-action-bar"
                            maxActionFieldsAllowed={5}
                            setactionFieldsToRight
                            sortActionFields
                            style={{}}
                        />
                    </Card>
                )}
            </React.Fragment>
        );
    }
};
export default ViewHierarchy;