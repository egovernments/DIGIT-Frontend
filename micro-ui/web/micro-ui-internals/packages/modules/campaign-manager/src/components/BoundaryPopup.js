import React from "react";
import { PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BoundaryPopup = ({ showPopUp, setShowPopUp, data })=> {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        showPopUp &&  (
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
                    height:"11rem",
                    width: "48rem"
                }}
                footerChildren={[
                ]}
                sortFooterChildren={true}
            >
            <div style={{display:"flex", gap:"1rem", justifyContent:"space-around"}}>
                <Button
                    type={"button"}
                    size={"large"}
                    isDisabled={Object.keys(data?.defaultBoundaryData||{})?.length==0}
                    variation={"secondary"}
                    label={t("GET_BOUNDARY_DATA_FROM_GEOPODE")}
                    onClick={() => {
                        navigate(`/${window.contextPath}/employee/campaign/boundary/create?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}&newHierarchy=${false}`,
                            { data: data?.defaultBoundaryData }
                        );
                    }}
                    style={{height:"4rem"}}
                />
                <Button
                    type={"button"}
                    size={"large"}
                    variation={"secondary"}
                    label={t("CREATE_MY_OWN_BOUNDARY_DATA")}
                    onClick={() => {
                        navigate(`/${window.contextPath}/employee/campaign/boundary/create?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}&newHierarchy=${true}`);
                    }}
                    style={{height:"4rem"}}
                />
            </div>
            </PopUp>

        )
    );
};

export default BoundaryPopup;