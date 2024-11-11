import { Card, Uploader, Button,  ActionBar, Toast, Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useRef} from "react";
import { useTranslation } from "react-i18next";
import XlsPreviewNew from "../../components/XlsPreviewNew";
import { Svgicon } from "../../utils/Svgicon";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MapView from "../../components/MapView";
const ViewHierarchy = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const defaultHierarchyType = searchParams.get("defaultHierarchyType");
    const hierarchyType = searchParams.get("hierarchyType");
    const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";

    const inputRef = useRef(null); // Ref to trigger file input

    const [defData, setDefData] = useState([]);
    const [hierData, setHierData] = useState([]);

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
    const language = Digit.StoreData.getCurrentLanguage();
    const modulePrefix = "hcm";
    const stateCode = Digit.ULBService.getCurrentTenantId();
    const moduleCode = `boundary-${hierarchyType.toLowerCase().replace(/\s+/g, "_")}`;
    const { isLoading, data } = Digit.Services.useStore({
      stateCode,
      moduleCode,
      language,
      modulePrefix,
    });
  
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

    const generateFile = async () => {
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
        // const res = await generateFile()
        const resFile = await generateTemplate();
        if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
            // Splitting filename before .xlsx or .xls
            const fileNameWithoutExtension = hierarchyType ;
            Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid, customName: fileNameWithoutExtension });
        }
        else if ( resFile && resFile?.GeneratedResource?.[0]?.status === "inprogress"){
          setShowToast({label: "PLEASE_WAIT_AND_RETRY_AFTER_SOME_TIME", isError: "info" });
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
      
    const callCreateDataApi = async () => {
        setDisable(true);
        setDataCreationGoing(true);
        try {
          setDataCreateToast(true);
      
          const createResponse = await Digit.CustomService.getResponse({
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
                  source: "boundary",
                },
                campaignId: "default"
              },
            },
          });
      
          const id = createResponse?.ResourceDetails?.id;
          const typeOfData = createResponse?.ResourceDetails?.type;
      
          if (id) {
            try {
              await pollForStatusCompletion(id, typeOfData);
              setDataCreateToast(false);
              setShowToast({ label: `${t("WBH_HIERARCHY_CREATED")}`, isError: "success" });
            } catch (pollError) {
              throw pollError; // Propagate polling errors to the outer catch block
            }
          }
      
          return createResponse;
        } catch (error) {
          setDisable(false);
          let label;
          
          if (error.message === "Polling timeout" || error.message === "Max retries reached") {
            label = `${t("WBH_BOUNDARY_CREATION_TIMEOUT")}: ${t("WBH_OPERATION_INCOMPLETE")}`;
          } else {
            label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            error?.response?.data?.Errors?.forEach((err, idx) => {
              if (idx === error?.response?.data?.Errors?.length - 1) {
                label += t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
              } else {
                label += t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
              }
            });
          }
          
          setShowToast({ label, isError: "error" });
          setDataCreationGoing(false);
          return {};
        }
      };
      
      // const pollForStatusCompletion = async (id, typeOfData) => {
      //   const pollInterval = 1000; // Poll every 1 second
      //   const maxRetries = 100; // Maximum number of retries
      //   let retries = 0;
      
      //   return new Promise((resolve, reject) => {
      //     const poll = async () => {
      //       try {
              
      //         if (retries >= maxRetries) {
      //           setDataCreationGoing(false);
      //           reject(new Error("Max retries reached"));
      //           return;
      //         }
      
      //         const searchResponse = await Digit.CustomService.getResponse({
      //           url: "/project-factory/v1/data/_search",
      //           params: {},
      //           body: {
      //             SearchCriteria: {
      //               id: [id],
      //               tenantId: tenantId,
      //               type: typeOfData
      //             }
      //           },
      //         });
      
              
      //         const status = searchResponse?.ResourceDetails?.status;
      
      //         if (status === "completed") {
      //           setShowToast({ label: `${t("WBH_HIERARCHY_STATUS_COMPLETED")}`, isError: "success" });
      //           setDataCreationGoing(false);
      //           resolve(true);
      //         } else if (status === "failed") {
      //           reject(new Error("Operation failed"));
      //         } else {
      //           retries++;
      //           setTimeout(poll, pollInterval);
      //         }
      //       } catch (error) {
      //         setDataCreationGoing(false);
      //         reject(error);
      //       }
      //     };
      
      //     // Start the polling
      //     poll().catch(reject);
      
      //     // Set a timeout for the entire polling operation
      //     const timeoutDuration = (maxRetries + 1) * pollInterval;
      //     setTimeout(() => {
      //       if (retries < maxRetries) {  // Only reject if not already resolved
      //         setDataCreationGoing(false);
      //         reject(new Error("Polling timeout"));
      //       }
      //     }, timeoutDuration);
      //   });
      // };

      const pollForStatusCompletion = async (id, typeOfData) => {
        const pollInterval = 1000; // Poll every 1 second
        const maxRetries = 100; // Maximum number of retries
        let retries = 0;
      
        return new Promise((resolve, reject) => {
          const poll = async () => {
            try {
              if (retries >= maxRetries) {
                setDataCreationGoing(false);
                reject(new Error("Max retries reached"));
                return;
              }
      
              const searchResponse = await Digit.CustomService.getResponse({
                url: "/project-factory/v1/data/_search",
                params: {},
                body: {
                  SearchCriteria: {
                    id: [id],
                    tenantId: tenantId,
                    type: typeOfData,
                  },
                },
              });
      
              const status = searchResponse?.ResourceDetails?.[0]?.status;
      
              if (status === "completed") {
                setShowToast({ label: `${t("WBH_HIERARCHY_STATUS_COMPLETED")}`, isError: "success" });
                setDataCreationGoing(false);
                resolve(true);
              } else if (status === "failed") {
                reject(new Error("Operation failed"));
              } else {
                retries++;
                setTimeout(poll, pollInterval);
              }
            } catch (error) {
              // console.error("Error while polling:", error);
              retries++;
              setTimeout(poll, pollInterval);
            }
          };
      
          // Start the polling
          poll().catch(reject);
      
          // Set a timeout for the entire polling operation
          const timeoutDuration = (maxRetries + 1) * pollInterval;
          setTimeout(() => {
            if (retries < maxRetries) {
              // Only reject if not already resolved
              setDataCreationGoing(false);
              reject(new Error("Polling timeout"));
            }
          }, timeoutDuration);
        });
      };

    
    const createData = async()=> {
        const res = await callCreateDataApi();

    }

   
    if(!viewState || isLoading)
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
                                                    {/* {t(hierItem?.boundaryType)} */}
                                                    {`${t(( hierarchyType + "_" + hierItem?.boundaryType).toUpperCase().replace(/\s+/g, "_"))}`}
                                                </div>
                                                <div style={{height:"1rem"}}></div>
                                                <Card type={"primary"} variant={"form"} className={"question-card-container"} >
                                                    <div style={{display:"flex", gap:"2rem"}}>
                                                    <Svgicon />
                                                    <div style={{display:"flex", alignItems:"center", fontWeight:"600"}}>
                                                    {`${t(( hierarchyType + "_" + hierItem?.boundaryType).toUpperCase().replace(/\s+/g, "_"))}-geojson.json`}
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
                                                {`${t(( hierarchyType + "_" + hierItem?.boundaryType).toUpperCase().replace(/\s+/g, "_"))}`}
                                              </div>
                                              {/* <Uploader
                                                        onUpload={() => {}}
                                                        showAsTags
                                                        uploadedFiles={[]}
                                                        variant="uploadFile"
                                                        style={{width:"50rem"}}
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
                                                size="large"
                                                style={{}}
                                                title=""
                                                variation="secondary"
                                              />
                                            </div>
                                            <div style={{ height: "2rem" }}></div>
                                            <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                                          </div>
                                        );
                                    }
                                } else {
                                    return (
                                      <div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
                                          <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>{hierItem?.boundaryType}</div>
                                          {/* <Uploader
                                                        onUpload={() => {}}
                                                        showAsTags
                                                        uploadedFiles={[]}
                                                        variant="uploadFile"
                                                        style={{width:"50rem"}}
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
                                            size="large"
                                            style={{}}
                                            title=""
                                            variation="secondary"
                                          />
                                        </div>
                                        <div style={{ height: "2rem" }}></div>
                                        <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
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
                                <div style={{height:"2rem"}}></div>
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
                {previewPage && (
                    <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                        <div style={{fontSize:"2.5rem", fontWeight:700}}>{t("CONFIRM_BOUNDARY_DATA")}</div>
                        <div style={{height:"1.5rem"}}></div>
                        {!dataCreationGoing && <XlsPreviewNew file={fileData} onDownload={() => {}} onBack={() => {setShowPreview(false); setUploadPage(true)}} />}
                        {dataCreationGoing && <Loader />}
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
