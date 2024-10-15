import { Card, Loader } from "@egovernments/digit-ui-components";
import { Button, PopUp } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom";
import { setAllDocuments } from "@cyntler/react-doc-viewer/dist/esm/store/actions";
// import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BoundaryPopup from "../../components/BoundaryPopup";


const Boundary = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const defaultHierarchyType = searchParams.get("defaultHierarchyType");
    const hierarchyType = searchParams.get("hierarchyType");
    const [showPopUp, setShowPopUp] = useState(false);
    const stateData = window.history.state;
    const [geoPodeData, setGeoPodeData] = useState(false);
    // const navigate = useNavigate();
    const history = useHistory();


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
                if(res?.BoundaryHierarchy && res?.BoundaryHierarchy.length > 0)
                    {
                        setDirect(true);
                        setDirectView(true);
                    }

            } catch (error) {
            }
        };
    
        fetchData();
    }, []);

    const callGeoPode = (val)=>{
        history.push(
            `/${window.contextPath}/employee/campaign/geopode?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}&newHierarchy=${val}`,
            { data: data }
        );
    }
    const callViewBoundary = ()=> {
        history.push(
            `/${window.contextPath}/employee/campaign/view-boundary`,
            { data: data }
        );

    };
    const callDirectView = ()=>{
        history.push(
            `/${window.contextPath}/employee/campaign/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
            { data: data }
        );

    }
    if(isFetching)
    {
        return (
            <Loader />
        )
    }
    else
    {
        return (
            <React.Fragment>
                <BoundaryPopup showPopUp={showPopUp} setShowPopUp={setShowPopUp} callGeoPode={callGeoPode} geoPodeData={geoPodeData} />

                <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                    <div style={{fontWeight:700, fontSize:"2.5rem"}}>{t("BOUNDARY_DATA_MANAGEMENT")}</div>
                    <div style={{height:"2rem"}}></div>
                    <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("CREATE_NEW_BOUNDARY_DATA")}
                            onClick={() => {
                                if(direct && geoPodeData) {
                                    callDirectView();
                                }
                                else 
                                {
                                    setShowPopUp(true);
                                }
                            }}
                            style={{width:"38rem", height:"5rem"}}
                            textStyles={{fontSize:"1.5rem"}}
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
                            style={{width:"38rem", height:"5rem"}}
                            textStyles={{fontSize:"1.5rem"}}
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
                            style={{width:"38rem", height:"5rem"}}
                            textStyles={{fontSize:"1.5rem"}}
                        />

                    </div>
                </Card>
            </React.Fragment>

        );
    }
};
export default Boundary;