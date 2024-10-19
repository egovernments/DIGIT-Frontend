import { Card } from "@egovernments/digit-ui-components";
import { Button, PopUp, FieldV1, Uploader, ActionBar, TextInput, Toast } from "@egovernments/digit-ui-components";
import { inRange, isError } from "lodash";
import React, { useEffect, useState , useRef} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { Svgicon } from "../../utils/Svgicon";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import FinalPopup from "../../components/FinalPopup";



// import { TextInput } from "@egovernments/digit-ui-react-components";

const GeoPode = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const hierarchyType = searchParams.get("hierarchyType");
    const defaultHierarchyType = searchParams.get("defaultHierarchyType")
    const newHierarchy = JSON.parse(searchParams.get("newHierarchy"));
    const [showPopUp, setShowPopUp] = useState(false);
    const [additionalData, setAdditionalData] = useState(false);
    const [showFinalPopup, setShowFinalPopup] = useState(false);
    const [enableCreate, setEnableCreate] = useState(false);

    // const state = window.history.state;
    const state = location.state;
    let receivedData = state?.data?.BoundaryHierarchy?.[0]?.boundaryHierarchy;
    const [boundaryData, setBoundaryData]=useState((receivedData === undefined ? [] : receivedData));
    const [newBoundaryData, setNewBoundaryData] = useState([]);
    const [firstPage, setFirstPage] = useState(true);
    const [uploadPage, setUploadPage] = useState(false);
    const [previewPage, setPreviewPage] = useState(false);
    const inputRef = useRef(null); // Ref to trigger file input
    const [showToast, setShowToast] = useState(null); // State to handle toast notifications
    const [fileUrl, setFileUrl] = useState("");
    const [fileData, setFileData] = useState({});


    useEffect(() => {
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

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const createNewHierarchy = async()=>{
        
        try{
            const res = await callCreate();
            setShowToast({ label: t("HIERARCHY_CREATED_SUCCESSFULLY"), isError: "success" });
            await sleep(2000);

            history.push(
                `/${window.contextPath}/employee/campaign/boundary/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
                {  }
            );

        }catch (error) {
            setShowToast({ label: error?.response?.data?.Errors?.[0]?.message ? error?.response?.data?.Errors?.[0]?.message : t("HIERARCHY_CREATION_FAILED") , isError:"error"});
        }
    }

    const goBackToBoundary = ()=> {
        history.push(
            `/${window.contextPath}/employee/campaign/boundary/home?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
            { data: state }
        );

    }

    const addParents = ()=>{
        setNewBoundaryData((prevItems) => {
            // Loop through the array starting from the second element
            return prevItems.map((item, idx) => {
                if(idx===0) 
                {
                    if(newHierarchy) item.parentBoundaryType=null;
                    else{
                        if(boundaryData.length === 0) item.parentBoundaryType=null;
                        else item.parentBoundaryType = boundaryData[boundaryData.length-1].boundaryType;

                    }
                }
                if (idx > 0) {
                    item.parentBoundaryType = prevItems[idx - 1].boundaryType;
                }
                return item; 
            });
        });

    }

    if(newHierarchy == false)
    {
        return (
            <React.Fragment>
                {firstPage && !newHierarchy && <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{fontSize:"2.5rem", fontWeight:700}}>Boundary data from GeoPoDe</div>
                        <Button
                            icon={"Preview"}
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
                                <div style={{height:"1rem"}}></div>
                                <Card type={"primary"} variant={"form"} className={"question-card-container"} >
                                    <div style={{display:"flex", gap:"2rem"}}>
                                    <Svgicon />
                                    <div style={{display:"flex", alignItems:"center", fontWeight:"600"}}>
                                        {item?.boundaryType}{".shp"}
                                    </div>
                                    </div>
                                </Card>
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
                                <div style={{fontSize:"2.5rem", fontWeight:700}}>{t("NEWLY_ADDED_BOUNDARY_DATA")}</div>
                                <div style={{height:"2rem"}}>
                                </div>
                            </div>
                            <div>
                                {
                                newBoundaryData.map((item, index)=>(
                                    <div>
                                        <div style={{display:"flex"}}>
                                            <div style={{width:"20rem", marginTop:"0.6rem", fontWeight:"600"}}>{t("LEVEL")} {boundaryData.length + index + 1}</div>
                                            <div style={{display:"flex", gap:"1rem"}}>
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
                <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} addParents={addParents} createNewHierarchy={createNewHierarchy} />
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

                {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}
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
                                {
                                    newBoundaryData.map((item, index)=>(
                                        <div>
                                            <div style={{display:"flex"}}>
                                                <div style={{width:"20rem", marginTop:"0.6rem", fontWeight:"600"}}>{t("LEVEL")} {index + 1}</div>
                                                <div style={{display:"flex", gap:"1rem"}}>
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
                <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} addParents={addParents} createNewHierarchy={createNewHierarchy} />
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
                {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}

            </React.Fragment>
                

        );
    }

};


export default GeoPode;