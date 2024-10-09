import { Card } from "@egovernments/digit-ui-components";
import { Button, PopUp, FieldV1, Uploader, ActionBar, TextInput, Toast } from "@egovernments/digit-ui-components";
import { inRange } from "lodash";
import React, { useEffect, useState , useRef} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { CitizenConsentForm } from "@egovernments/digit-ui-react-components";
// import * as ExcelJS from "exceljs";
import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import XlsPreview from "../../components/XlsPreview";
import { FileUploader } from "react-drag-drop-files";
import { FILE_STORE } from "../../../../hcm-microplanning/src/configs/constants";
import XlsPreviewNew from "../../components/XlsPreviewNew";
import { downloadExcelWithCustomName } from "../../utils";
import downloadTemplate from "../../utils/downloadTemplate";
import { useRowState } from "react-table";
import { ShpFileIcon } from "../../components/icons/ShapeFileIcon";


// import { TextInput } from "@egovernments/digit-ui-react-components";

const GeoPode = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const hierarchyType = searchParams.get("hierarchyType");
    const defaultHierarchyType = searchParams.get("defaultHierarchyType")
    const newHierarchy = JSON.parse(searchParams.get("newHierarchy"));
    const [showPopUp, setShowPopUp] = useState(false);
    const [additionalData, setAdditionalData] = useState(false);
    const [showFinalPopup, setShowFinalPopup] = useState(false);
    const [enableCreate, setEnableCreate] = useState(false);
    // const { hierarchyType } = useParams();
    const state = window.history.state;
    // console.log("received state data is", state);
    // console.log("boundary data is bkc", state?.data?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
    // console.log("new hierarchy", newHierarchy);
    // let boundaryData;
    let receivedData = state?.data?.BoundaryHierarchy?.[0]?.boundaryHierarchy;
    const [boundaryData, setBoundaryData]=useState((receivedData === undefined ? [] : receivedData));

    // console.log("boundary data is", boundaryData);
    const [newBoundaryData, setNewBoundaryData] = useState([]);
    const [firstPage, setFirstPage] = useState(true);
    const [uploadPage, setUploadPage] = useState(false);
    const [previewPage, setPreviewPage] = useState(false);
    const inputRef = useRef(null); // Ref to trigger file input
    const [showToast, setShowToast] = useState(null); // State to handle toast notifications
    const [fileUrl, setFileUrl] = useState("");
    const [fileData, setFileData] = useState({});
    

    useEffect(() => {
        // Call addLevel function when the component is mounted
        addLevel();
      }, []);
    const addLevel = ()=>{
        setNewBoundaryData((prevItems)=> [...prevItems, {active:true, boundaryType:"", parentBoundaryType:""}]);
    }
    const addLevelName = (name, index) => {
        setNewBoundaryData((prevItems)=> 
            prevItems.map((item, id)=> 
                id === index ? {...item, boundaryType:name} : item))

    }
    const removeLevel = (index) => {
        setNewBoundaryData((prevItems)=>{
            const filteredData = prevItems.filter((item, idx) => idx!==index);
            return filteredData;
        })
    }


    // const reqCriteriaResourceCreate = {
    //     url: `/boundary-service/boundary-hierarchy-definition/_create`,
    //     body: {
    //         BoundaryHierarchy: {
    //             tenantId: tenantId,
    //             hierarchyType: hierarchyType,
    //             boundaryHierarchy: [...boundaryData, ...newBoundaryData],
    //         }
    //     },
    //     config: {
    //       enabled: enableCreate,
    //       select: (data) => {
    //         return data?.mdms?.[0]?.data?.data;
    //       },
    //     },
    //   };
    //   const { isLoadingCreate, dataCreate, isFetchingCreate } = Digit.Hooks.useCustomAPIHook(reqCriteriaResourceCreate);

    
    // useEffect(()=>{
    //     console.log("isFetchingCreate", isFetchingCreate);
    //     if(isFetching === false)
    //         {
    //             window.history.pushState(
    //                 {
    //                     data: dataCreate
    //                 },
    //                 "",
    //                 `/${window.contextPath}/employee/campaign/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`
    //             );
    //             const navEvent = new PopStateEvent("popstate");
    //             window.dispatchEvent(navEvent);

    //         } 
    // }, [isFetchingCreate])

    

    const callCreate = async () => {
        let defData = boundaryData;
        if(newHierarchy === true)
        {
            defData = [];
        }
        const res = await Digit.CustomService.getResponse({
            url: `/boundary-service/boundary-hierarchy-definition/_create`,
            body: {
                BoundaryHierarchy: {
                    tenantId: tenantId,
                    hierarchyType: hierarchyType,
                    boundaryHierarchy: [...defData, ...newBoundaryData],
              }
            }
        });
        return res;

    }

    const createNewHierarchy = async()=>{

        // const reqCriteria = {
            // url: `/boundary-service/boundary-hierarchy-definition/_create`,
            // body: {
            //     BoundaryHierarchy: {
            //         tenantId: tenantId,
            //         hierarchyType: hierarchyType,
            //         boundaryHierarchy: [...boundaryData, ...newBoundaryData],
            //   }
            // }
        //   };
        // const { isLoading, data,  isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
        
        try{
            const res = await callCreate();
            // console.log("resut is", res);
            window.history.pushState(
                {
                    // data: dataCreate
                },
                "",
                `/${window.contextPath}/employee/campaign/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`
            );
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);

        }catch (error) {
            console.log("error", error);
        }
        
        // setEnableCreate(true);
        // console.log("created");
    }
    // useEffect(()=>{
        // window.history.pushState(
        //     {
        //         data: dataCreate
        //     },
        //     "",
        //     `/${window.contextPath}/employee/campaign/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`
        // );
        // const navEvent = new PopStateEvent("popstate");
        // window.dispatchEvent(navEvent);


    // }, [dataCreate])

    const goBackToBoundary = ()=> {
        window.history.pushState(
            {
                data:data
            },
            "",
            `/${window.contextPath}/employee/campaign/boundary-management?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`
        );
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);

    }
    const goNextToUploadShapefile = ()=> {
        setFirstPage(false);
        setUploadPage(true);
    }
    const goBackToCreateBoundary = ()=> {
        setUploadPage(false);
        setFirstPage(true);
        
    }
    const goToPreview = ()=> {
        setPreviewPage(true);
        setFirstPage(false);
        setUploadPage(false);
    }
    const goBackToUploadFile = ()=> {
        setFirstPage(false);
        setPreviewPage(false);
        setUploadPage(true);
    }
    const gotTosetShowFinalPopup = ()=> {
        setShowFinalPopup(true);
    }

    const addParents = ()=>{
        setNewBoundaryData((prevItems) => {
            // Loop through the array starting from the second element
            return prevItems.map((item, idx) => {
                // console.log("last", boundaryData?.[boundaryData.length-1].boundaryType);
                if(idx===0) 
                {
                    if(newHierarchy) item.parentBoundaryType=null;
                    else{
                        if(boundaryData.length === 0) item.parentBoundaryType=null;
                        else item.parentBoundaryType = boundaryData[boundaryData.length-1].boundaryType;

                    }
                }
                if (idx > 0) {
                    // Set the parent name to the previous element's name
                    item.parentBoundaryType = prevItems[idx - 1].boundaryType;
                }
                return item; // Return the updated item
            });
        });

    }

    const requestCriteriaBulkUpload = {
        url: "/project-factory/v1/data/_create",
        params: {},
        body: {
          ResourceDetails: {},
        },
      };
    
    const mutation = Digit.Hooks.useCustomAPIMutationHook(requestCriteriaBulkUpload);
    
    const { downloadExcelTemplate, loading, error } = downloadTemplate(state?.data?.BoundaryHierarchy?.[0]?.boundaryHierarchy, defaultHierarchyType);
    
    // const downloadExcelTemplate = () => {

    //     downloadTemplate(state?.data?.BoundaryHierarchy?.[0]?.boundaryHierarchy, defaultHierarchyType);
    // }

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
            let fileStoreId = response?.data?.files?.[0]?.fileStoreId;
            const { data: { fileStoreIds: fileUrlTemp } = {} } = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);
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
            //       closeToast();
            //     },
            //     onError: (resp) => {
            //       console.log("error raised", resp);
            //       let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            //       resp?.response?.data?.Errors?.map((err, idx) => {
            //         if (idx === resp?.response?.data?.Errors?.length - 1) {
            //           label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
            //         } else {
            //           label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
            //         }
            //       });
            //       setShowToast({ label, isError: true });
            //       closeToast();
            //     },
            //   }
            // );

        // console.log("api to be called");
      };

    useEffect(()=>{
        // console.log("new boundary data is", newBoundaryData);
    }, [newBoundaryData])


    if(newHierarchy == false)
    {
        return (
            <React.Fragment>
                {firstPage && showPopUp &&  (
                    <PopUp 
                        className={"custom-popup"}
                        type={"default"}
                        heading={t("ADD_BOUNDARY_HIERARCHY_LEVEL")}
                        children={[
                        ]}
                        onClose={()=>{
                            setShowPopUp(false);
                        }}
                        onOverlayClick={()=>{
                            setShowPopUp(false);
                        }}
                        style={{
                            // height:"11rem"
                            width: "50rem"
                        }}
                        footerChildren={[
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                label={t("CANCEL")}
                                onClick={() => {
                                    setShowPopUp(false);
                                }}
                            />,
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"primary"}
                                label={t("CONFIRM_BOUNDARY_HIERARCHY_LEVEL")}
                                onClick={() => {
                                    // createNewChecklist();
                                    addParents();
                                    if(newBoundaryData.length>0) setAdditionalData(true);
                                    setShowPopUp(false);
                                }}
                            />
                        ]}
                        sortFooterChildren={true}
                    >
                        <div>
                            {/* {console.log("bhau", boundaryData)} */}
                            {!newHierarchy && 
                                boundaryData.map((item, index)=>(
                                    <div>
                                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                            <div style={{width:"20rem", marginTop:"0.6rem"}}>{t("LEVEL")} {index+1}</div>
                                            <div style={{display:"flex"}}>
                                                <TextInput
                                                    type={"text"}
                                                    populators={{
                                                        resizeSmart: false
                                                    }}
                                                    style={{width:"28.5rem", display:"flex", justifyContent:"flex-end"}}
                                                    value={item?.boundaryType}
                                                    nonEditable={true}
                                                    placeholder={""}
                                                /> 
                                            </div>
                                        </div>
                                        <div style={{height:"1.5rem"}}></div>
                                    </div>
                                ))
                            }
                            {/* {console.log("bhau new", newBoundaryData)} */}

                            {
                                newBoundaryData.map((item, index)=>(
                                    <div>
                                        <div style={{display:"flex"}}>
                                            <div style={{width:"20rem", marginTop:"0.6rem"}}>{t("LEVEL")} {boundaryData.length + index + 1}</div>
                                            <div style={{display:"flex"}}>
                                                <TextInput
                                                    type={"text"}
                                                    populators={{
                                                        resizeSmart: false
                                                    }}
                                                    style={{width:"27rem", display:"flex", justifyContent:"flex-end"}}
                                                    value={item?.boundaryType}
                                                    onChange={(event)=>addLevelName(event.target.value, index)}
                                                    placeholder={""}
                                                /> 
                                                <div className="dustbin-icon"  onClick={() => removeLevel(index)}>
                                                    <DustbinIcon />
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div style={{height:"1.5rem"}}></div>
                                    </div>
                                ))
                            }
                            <Button
                                className="custom-class"
                                icon="Add"
                                iconFill=""
                                label={t("ADD_HIERARCHY_LEVEL")}
                                onClick={() => addLevel()}
                                size="medium"
                                title=""
                                variation="teritiary"
                                textStyles={{width:'unset'}}
                            />   
                        </div>
                    </PopUp>

                )}
                {firstPage && !newHierarchy && <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{fontSize:"2.5rem", fontWeight:700}}>Boundary data from GeoPoDe</div>
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("PREVIEW_ON_MAP")}
                            onClick={() => {
                                // setShowPopUp(true);
                            }}
                        /> 
                    </div>
                    <div style={{height:"2rem"}}></div>
                    <div>
                        {boundaryData.map((item, index) => (
                            <div>
                                <div style={{fontWeight:"600", fontSize:"1.2rem"}}>
                                    {item?.boundaryType}
                                </div>
                                <div  onClick={() => {}}>
                                    <ShpFileIcon />
                                </div>
                                {/* <div style={{height:"2rem"}}>
                                </div> */}
                                <hr style={{borderTop:"1px solid #ccc", margin:"1rem 0"}}/>
                            </div>
                        ))}
                    </div>
                </Card>
                }
                {firstPage && newBoundaryData.length>0 && (
                    <div>
                        <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                            <div>
                                <div style={{fontSize:"2.5rem", fontWeight:700}}>Newly Added Boundary Data</div>
                                <div style={{height:"2rem"}}>
                                </div>
                            </div>
                            <div>
                                {/* {console.log("running again and again")} */}
                                {
                                newBoundaryData.map((item, index)=>(
                                    <div>
                                        <div style={{display:"flex"}}>
                                            <div style={{width:"20rem", marginTop:"0.6rem"}}>{t("LEVEL")} {boundaryData.length + index + 1}</div>
                                            <div style={{display:"flex"}}>
                                                <TextInput
                                                    type={"text"}
                                                    populators={{
                                                        resizeSmart: false
                                                    }}
                                                    style={{width:"27rem", display:"flex", justifyContent:"flex-end"}}
                                                    value={item?.boundaryType}
                                                    onChange={(event)=>addLevelName(event.target.value, index)}
                                                    placeholder={""}
                                                /> 
                                                <div className="dustbin-icon"  onClick={() => removeLevel(index)}>
                                                    <DustbinIcon />
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div style={{height:"1.5rem"}}></div>
                                    </div>
                                ))
                                }
                                <Button
                                    className="custom-class"
                                    icon="Add"
                                    iconFill=""
                                    label={t("ADD_HIERARCHY_LEVEL")}
                                    onClick={() => addLevel()}
                                    size="medium"
                                    title=""
                                    variation="teritiary"
                                    textStyles={{width:'unset'}}
                                />   
                            </div>
                        </Card>
                    </div>
                )
                }
                {showFinalPopup  &&
                    <PopUp 
                        className={"custom-popup"}
                        type={"default"}
                        heading={t("CREATE_BOUNDARY_HIERARCHY")}
                        children={[
                        ]}
                        onClose={()=>{
                            setShowFinalPopup(false);
                        }}
                        onOverlayClick={()=>{
                            setShowFinalPopup(false);
                        }}
                        style={{
                            // height:"11rem"
                            width: "50rem"
                        }}
                        footerChildren={[
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                label={t("CANCEL")}
                                onClick={() => {
                                    setShowFinalPopup(false);
                                }}
                            />,
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"primary"}
                                label={t("CREATE")}
                                onClick={() => {
                                    addParents();
                                    createNewHierarchy();
                                    setShowFinalPopup(false);
                                }}
                            />
                        ]}
                        sortFooterChildren={true}
                        >
                        <div>
                            {<div>{t("YOU_WON'T_BE_ABLE_TO_UNDO_THIS_STEP_OF_CREATING_HIERARCHY")}</div>}
                        </div>
                    </PopUp>
                }
                {/* <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    {firstPage && !additionalData && <Button
                        type={"button"}
                        size={"large"}
                        icon={"Add"}
                        variation={"secondary"}
                        label={t("ADD_NEW_BOUNDARY_HIERARCHY_LEVEL")}
                        onClick={()=>{
                            setShowPopUp(true);
                        }}
                    />}
                </div> */}
                <ActionBar
                    actionFields={[
                        <Button 
                            icon="ArrowBack" 
                            style={{marginLeft:"3.5rem"}} 
                            label={t("BACK")} 
                            onClick={goBackToBoundary} 
                            type="button" 
                            variation="secondary"  
                            textStyles={{width:'unset'}}
                        />,
                        <Button 
                            icon="ArrowForward" 
                            style={{marginLeft:"auto"}} 
                            isSuffix 
                            label={t("NEXT")} 
                            // onClick={goToPreview} 
                            onClick={()=>{setShowFinalPopup(true)}}
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

                {/* Toast to show success/failure */}
                {showToast && <Toast label={showToast.label} error={showToast.isError} onClose={() => setShowToast(null)} />}
            </React.Fragment>

        );
    }
    else{
        return (
            <React.Fragment>
                {firstPage && (
                    <div>
                        <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                <div style={{fontSize:"2.5rem", fontWeight:700}}>{t("CREATE_BOUNDARY_HIERARCHY")}</div>
                            </div>
                            <div style={{height:"1.5rem"}}></div>
                            <div>
                                {t("MSG")}
                            </div>
                            <div style={{height:"2rem"}}></div>
                            <div>
                                {/* {console.log("bhau new", newBoundaryData)} */}
                                {
                                    newBoundaryData.map((item, index)=>(
                                        <div>
                                            <div style={{display:"flex"}}>
                                                <div style={{width:"20rem", marginTop:"0.6rem"}}>{t("LEVEL")} {index + 1}</div>
                                                <div style={{display:"flex"}}>
                                                    <TextInput
                                                        type={"text"}
                                                        populators={{
                                                            resizeSmart: false
                                                        }}
                                                        style={{width:"27rem", display:"flex", justifyContent:"flex-end"}}
                                                        value={item?.boundaryType}
                                                        onChange={(event)=>addLevelName(event.target.value, index)}
                                                        placeholder={""}
                                                    /> 
                                                    <div className="dustbin-icon"  onClick={() => removeLevel(index)}>
                                                        <DustbinIcon />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div style={{height:"1.5rem"}}></div>
                                        </div>
                                    ))
                                }
                                <Button
                                    className="custom-class"
                                    icon="Add"
                                    iconFill=""
                                    label={t("ADD_HIERARCHY_LEVEL")}
                                    onClick={() => addLevel()}
                                    size="medium"
                                    title=""
                                    variation="secondary"
                                    textStyles={{width:'unset'}}
                                />   
                            </div>
                        </Card>
                    </div>
                )}
                {showFinalPopup  &&
                    <PopUp 
                        className={"custom-popup"}
                        type={"default"}
                        heading={t("CREATE_BOUNDARY_HIERARCHY")}
                        children={[
                        ]}
                        onClose={()=>{
                            setShowFinalPopup(false);
                        }}
                        onOverlayClick={()=>{
                            setShowFinalPopup(false);
                        }}
                        style={{
                            // height:"11rem"
                            width: "50rem"
                        }}
                        footerChildren={[
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                label={t("CANCEL")}
                                onClick={() => {
                                    setShowFinalPopup(false);
                                }}
                            />,
                            <Button
                                type={"button"}
                                size={"large"}
                                variation={"primary"}
                                label={t("CREATE")}
                                onClick={() => {
                                    addParents();
                                    createNewHierarchy();
                                    setShowFinalPopup(false);
                                }}
                            />
                        ]}
                        sortFooterChildren={true}
                        >
                        <div>
                            {<div>{t("YOU_WON'T_BE_ABLE_TO_UNDO_THIS_STEP_OF_CREATING_HIERARCHY")}</div>}
                        </div>
                    </PopUp>
                }
                <ActionBar
                    actionFields={[
                        <Button 
                            icon="ArrowBack" 
                            style={{marginLeft:"3.5rem"}} 
                            label={t("Back")} 
                            onClick={goBackToBoundary} 
                            type="button" 
                            variation="secondary"  
                            textStyles={{width:'unset'}}
                        />,
                        <Button 
                            icon="ArrowForward" 
                            style={{marginLeft:"auto"}} 
                            isSuffix 
                            label={t("Next")} 
                            // onClick={goToPreview} 
                            onClick={()=>{setShowFinalPopup(true)}}
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
                {showToast && <Toast label={showToast.label} error={showToast.isError} onClose={() => setShowToast(null)} />}

            </React.Fragment>
                

        );
    }

};


export default GeoPode;