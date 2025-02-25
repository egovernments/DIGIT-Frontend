import { Card, AlertCard, Loader , Button } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import BoundaryPopup from "../../components/BoundaryPopup";

const config = {
  type:"campaign"
};


const boundaryHomeConfig={
  CREATE_NEW_BOUNDARY_DATA:null,
  EDIT_BOUNDARY_DATA:null,
  VIEW_EXISTING_BOUNDARY_DATA:null,
}

const navigate=(history,key,data,setShowPopUp)=>{

let url="";
switch (key){
  case "CREATE_NEW_BOUNDARY_DATA":
    url=`/${window.contextPath}/employee/campaign/boundary/data?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
        break;
  case "VIEW_EXISTING_BOUNDARY_DATA":
    url=`/${window.contextPath}/employee/campaign/boundary/view-all-hierarchy`;

    break;
  case "EDIT_BOUNDARY_DATA":
    url=`/${window.contextPath}/employee/campaign/boundary/data?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
    break;
  default:
    break;
}
if(key=="CREATE_NEW_BOUNDARY_DATA" && Object.keys(data?.boundaryData||{})?.length==0){
  setShowPopUp(true);
}else{
history.push(url);

}
}
const BoundaryHome = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [showPopUp, setShowPopUp] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [geoPodeData, setGeoPodeData] = useState(false);
  const history = useHistory();
  
  const type=searchParams.get("type")|| config?.type;

  const {isLoading,data,error}=Digit.Hooks.campaign.useBoundaryHome({ screenType: type,defaultHierarchyType:searchParams?.get("defaultHierarchyType"),hierarchyType:searchParams?.get("hierarchyType"),userName:Digit.UserService.getUser()?.info?.userName,tenantId });
  if (isLoading) return <Loader page={true} variant={"PageLoader"}/>;

  return (
    <React.Fragment>
      <BoundaryPopup showPopUp={showPopUp} setShowPopUp={setShowPopUp} callGeoPode={()=>{}} data={data} geoPodeData={geoPodeData} />
      {/* {toast &&
        <Toast label={t("USER_NOT_AUTHORISED")} type={"error"} onClose={() => setToast(false)} />} */}
      <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
        <div style={{ fontWeight: 700, fontSize: "2.5rem", fontFamily:"Roboto Condensed"}}>{t("BOUNDARY_DATA_MANAGEMENT")}</div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        {Object.keys(boundaryHomeConfig)?.map(key=>{
          const isBoundaryDataEmpty = Object.keys(data?.boundaryData || {})?.length === 0;
          const isEditDisabled = key === "EDIT_BOUNDARY_DATA" && isBoundaryDataEmpty;
          const isCreateDisabled = key === "CREATE_NEW_BOUNDARY_DATA" && !isBoundaryDataEmpty;
          return (<Button
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t(key)}
            isDisabled={isEditDisabled || isCreateDisabled}
            onClick={()=>navigate(history,key,data,setShowPopUp)}
            style={{ width: "35rem", height: "5rem" }}
            textStyles={{ fontSize: "1.5rem" }}
          />)
        })}
        </div>
      </Card>
      <AlertCard
        label="Info"
        variant="default"
        style={{maxWidth:"200rem", marginTop:"1rem"}}
        additionalElements={[<span style={{ color: "#505A5F", fontWeight:600 }}>{t(`CURRENT_HIERARCHY_TYPE_IS`)} {": "} {t(data?.hierarchyName)}</span>,
          <span style={{ color: "#505A5F", fontWeight: 600 }}>{t(`HIERARCHY_CREATED_ON`)} {": "} {new Date(data?.boundaryData?.auditDetails?.createdTime).toLocaleDateString()}</span>,
          <span style={{ color: "#505A5F", fontWeight: 600 }}>{t(`HIERARCHY_LAST_MODIFIED_ON`)} {": "} {new Date(data?.boundaryData?.auditDetails?.lastModifiedTime).toLocaleDateString()}</span>,
        ]}
      /> 
    </React.Fragment>
  );
};
export default BoundaryHome;
