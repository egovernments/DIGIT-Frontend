import { Card } from "@egovernments/digit-ui-components";
import { Button, PopUp } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom";
import { setAllDocuments } from "@cyntler/react-doc-viewer/dist/esm/store/actions";

const Boundary = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const defaultHierarchyType = searchParams.get("defaultHierarchyType");
    const hierarchyType = searchParams.get("hierarchyType");
    const [showPopUp, setShowPopUp] = useState(false);
    const stateData = window.history.state;
    const [geoPodeData, setGeoPodeData] = useState(false);
    // const { hierarchyType } = useParams();
    const reqCriteriaResource = {
        url: `/boundary-service/boundary-hierarchy-definition/_search`,
        body: {
            BoundaryTypeHierarchySearchCriteria: {
                tenantId: tenantId,
                limit: 2,
                offset: 0,
                hierarchyType: defaultHierarchyType
          }
        }
      };
    const { isLoading, data,  isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
    useEffect(()=>{
        console.log("received data is", data);
        if(data?.BoundaryHierarchy && data?.BoundaryHierarchy.length > 0) setGeoPodeData(true);
    }, [data])

    const [direct, setDirect] = useState(false);
    const [directView, setDirectView] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Digit.CustomService.getResponse({
                    url: `/boundary-service/boundary-hierarchy-definition/_search`,
                    params: {},
                    body: {
                        BoundaryTypeHierarchySearchCriteria: {
                            tenantId: tenantId,
                            limit: 2,
                            offset: 0,
                            hierarchyType: hierarchyType,
                        },
                    },
                });
                console.log("res of hierarchy ", res);
                if(res?.BoundaryHierarchy && res?.BoundaryHierarchy.length > 0)
                    {
                        setDirect(true);
                        setDirectView(true);
                    }

                // Do something with res (e.g., set state)
            } catch (error) {
                console.error("Error fetching boundary data:", error);
            }
        };
    
        fetchData();
    }, []); // Add tenantId and hierarchyType to dependency array if they are state/props
    
    

    const callGeoPode = (val)=>{

        window.history.pushState(
            {
                data:data
            },
            "",
            `/${window.contextPath}/employee/campaign/geopode?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}&newHierarchy=${val}`
        );
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);
    }
    const callViewBoundary = ()=> {
        window.history.pushState(
            {
                data:data
            },
            "",
            `/${window.contextPath}/employee/campaign/view-boundary`
        );
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);

    };
    const callDirectView = ()=>{
        window.history.pushState(
            {
                // data:data
            },
            "",
            `/${window.contextPath}/employee/campaign/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`
        );
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);

    }
    if(isFetching)
    {
        return (
            <div>

            </div>
        )
    }
    else
    {
        return (
            <React.Fragment>
                {showPopUp &&  (
                    <PopUp 
                        className={"custom-popup-boundary"}
                        type={"default"}
                        heading={t("CHOOSE_MEANS_TO_CREATE_BOUNDARY")}
                        children={[
                        ]}
                        onClose={()=>{
                            setShowPopUp(false);
                        }}
                        style={{
                            // height:"11rem"
                            width: "50rem"
                        }}
                        footerChildren={[
                        ]}
                        sortFooterChildren={true}
                    >
                    <div style={{display:"flex", gap:"1rem"}}>
                        <Button
                            type={"button"}
                            size={"large"}
                            isDisabled={!geoPodeData}
                            variation={"secondary"}
                            label={t("GET_BOUNDARY_DATA_FROM_GEOPODE")}
                            onClick={() => {
                                callGeoPode(false);
                            }}
                        />
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("CREATE_MY_OWN_BOUNDARY_DATA")}
                            onClick={() => {
                                callGeoPode(true);
                            }}
                        />
                    </div>
                    </PopUp>

                )}
                <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                    <div style={{fontWeight:700}}>Boundary Data Management</div>
                    <div style={{height:"2rem"}}></div>
                    <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("CREATE_NEW_BOUNDARY_DATA")}
                            onClick={() => {
                                if(direct && geoPodeData) {
                                    console.log("getting called");
                                    callDirectView();
                                }
                                else 
                                {
                                    console.log("direct", direct);
                                    console.log("def", geoPodeData);
                                    setShowPopUp(true);
                                }
                            }}
                        />
                        <Button
                            type={"button"}
                            size={"large"}
                            isDisabled={!directView}
                            variation={"secondary"}
                            label={t("EDIT_BOUNDARY_DATA")}
                            onClick={() => {
                                // setShowPopUp(false);
                                callDirectView();
                            }}
                        />
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("VIEW_EXISTING_BOUNDARY_DATA")}
                            onClick={() => {
                                // setShowPopUp(false);
                                callViewBoundary();
                            }}
                        />

                    </div>
                </Card>
            </React.Fragment>

        );
    }
};
export default Boundary;