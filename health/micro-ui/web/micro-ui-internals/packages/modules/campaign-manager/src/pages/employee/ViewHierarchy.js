import { Card, Uploader, Button, PopUp, ActionBar, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useRef} from "react";
import { useTranslation } from "react-i18next";
import { useParams,useHistory } from "react-router-dom";
import downloadTemplate from "../../utils/downloadTemplate";
import XlsPreviewNew from "../../components/XlsPreviewNew";
import { ShpFileIcon } from "../../components/icons/ShapeFileIcon";

const ViewHierarchy = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const defaultHierarchyType = searchParams.get("defaultHierarchyType");
    const hierarchyType = searchParams.get("hierarchyType");
    const [showPopUp, setShowPopUp] = useState(false);
    const stateData = window.history.state;
    const [geoPodeData, setGeoPodeData] = useState(false);
    const inputRef = useRef(null); // Ref to trigger file input


    const [defData, setDefData] = useState([]);
    const [hierData, setHierData] = useState([]);

    // let defData=[];
    // let hierData=[];

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
            // console.log("ress is", res);
            // console.log("default", defaultHierarchyType);
            if(res?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setDefData(res?.BoundaryHierarchy?.[0]?.boundaryHierarchy)
            // defData = res?.BoundaryHierarchy?.[0]?.boundaryHierarchy;
            // console.log("defData", defData);
            // console.log("new hierarchy type", hierarchyType);
            const res1 = await callSearch(hierarchyType);
            // console.log("res1 is", res1);
            if(res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setHierData(res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
            // hierData = res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy;
            // console.log("hierData", hierData);
            setViewState(true);
        }
        catch(error) {
            console.log("error", error);
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    const { downloadExcelTemplate, loading, error } = downloadTemplate(defData, defaultHierarchyType);

    const requestCriteriaBulkUpload = {
        url: "/project-factory/v1/data/_create",
        params: {},
        body: {
          ResourceDetails: {},
        },
      };
    
    const mutation = Digit.Hooks.useCustomAPIMutationHook(requestCriteriaBulkUpload);
    
    const handleUpload = () => {
        inputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = [event.target.files[0]]; // Get the first selected file
        if (file) {
        //   console.log("the file is", file);
          try {
            // Call function to upload the selected file to an API
            await uploadFileToAPI(file);
            setDisableFile(true);
            setShowToast({ label: "File uploaded successfully!", isError: false });
          } catch (error) {
            setShowToast({ label: "File upload failed. Please try again.", isError: true });
          }
        }
    };

    const uploadFileToAPI = async (files) => {
            // console.log("coming to upload", files);
            // console.log("file which is ciming isnde is", files);
           
            // const formData = new FormData();
            // formData.append("file", file); // Attach the first file
            // console.log("form data", formData);
        // try {

            const module = "HCM";
            // if(key == 2) file = file[0];
            let file = files[0];
            let fileDataTemp = {};
            fileDataTemp.fileName = file?.name
            
            const response = await Digit.UploadServices.Filestorage(module, file, tenantId);
            // console.log("respose from file storage is", response);
            fileDataTemp.fileStoreId = response?.data?.[0]?.fileStoreId;
            let fileStoreIdTemp = response?.data?.files?.[0]?.fileStoreId;
            setFileStoreId(response?.data?.files?.[0]?.fileStoreId);
            const { data: { fileStoreIds: fileUrlTemp } = {} } = await Digit.UploadServices.Filefetch([fileStoreIdTemp], tenantId);
            // console.log("the fetched url is", fileUrlTemp);
            fileDataTemp.url = fileUrlTemp?.[0]?.url;

            setFileUrl(fileDataTemp?.url);
            setFileData(fileDataTemp);

            // await mutation.mutate(
            //   {
            //     params: {},
            //     body: {
            //       ResourceDetails: {
            //         tenantId: tenantId,
            //         type: "boundary",
            //         fileStoreId: fileStoreId,
            //         action: "create",
            //         hierarchyType: defaultHierarchyType,
            //         additionalDetails: {},
            //       },
            //     },
            //   },
            //   {
            //     onSuccess: () => {
            //       setShowToast({ label: `${t("WBH_HIERARCHY_CREATED")}` });
            //     //   closeToast();
            //     },
            //     onError: (resp) => {
                //   console.log("error raised", resp);
                //   let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
                //   resp?.response?.data?.Errors?.map((err, idx) => {
                //     if (idx === resp?.response?.data?.Errors?.length - 1) {
                //       label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
                //     } else {
                //       label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
                //     }
                //   });
                //   setShowToast({ label, isError: true });
            //     //   closeToast();
                  

            //     },
            //   }
            // );

        // console.log("api to be called");
      };

    const callCreateDataApi = async()=>{
        setDisable(true);
        try{
            setDataCreateToast(true);
            const res = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_create",
                params: {},
                body: {
                    ResourceDetails: {
                        tenantId: tenantId,
                        type: "boundary",
                        fileStoreId: fileStoreId,
                        action: "create",
                        hierarchyType: defaultHierarchyType,
                        additionalDetails: {},
                    },
                },

            });
            setDataCreateToast(false);
            setShowToast({ label: `${t("WBH_HIERARCHY_CREATED")}` });
            return res;
        }
        catch(resp){
            // console.log("error raised", resp);
            let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            resp?.response?.data?.Errors?.map((err, idx) => {
            if (idx === resp?.response?.data?.Errors?.length - 1) {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
            } else {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
            }
            });
            setShowToast({ label, isError: true });
            return {};
        }
    }
    
    const createData = async()=> {
        try{
            const res = await callCreateDataApi();
            // console.log("data create res", res);
        }
        catch (error){
            console.log("error in data create", error);
        }

    }

   
    if(!viewState)
    {
        return (
            <div>
              FETCHIING
            </div>
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
                            {/* {console.log("hier data", hierData)}
                            {console.log("def data is", defData)} */}
            
                            {hierData.map((hierItem, index) => {
                                // console.log("Processing hierItem:", hierItem);
            
                                // Check if the index is less than defData length
                                const isLessThanDefData = index < defData.length;
            
                                if (isLessThanDefData) {
                                    if (hierItem?.boundaryType === defData[index]?.boundaryType) {
                                        // console.log("hehe"); // This will log when the condition is met
                                        return (
                                            <div>
                                                <div style={{ fontWeight: 400 }} key={index}>
                                                    {hierItem?.boundaryType}
                                                </div>
                                                <div  onClick={() => {}}>
                                                    <ShpFileIcon />
                                                </div>
                                                {/* <div style={{height:"2rem"}}></div> */}
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
                                    {/* <Uploader
                                        // multiple
                                        onUpload={(e)=>{console.log(e)}}
                                        showAsTags
                                        uploadedFiles={[]}
                                        variant="uploadFile"
                                    /> */}
                                    {/* <FileUploader
                                        // multiple={multiple}
                                        // handleChange={(file)=>{uploadFileToAPI(file)}}
                                        // handleChange = {handleUpload}
                                        name="file"
                                        // types={fileTypes}
                                        // children={dragDropJSX}
                                        // onTypeError={fileTypeError}
                                    /> */}
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
                                        size="small"
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
                                    isDisabled={!disableFile}
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
                {showToast && <Toast label={showToast.label} error={showToast.isError} onClose={() => setShowToast(null)} />}
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