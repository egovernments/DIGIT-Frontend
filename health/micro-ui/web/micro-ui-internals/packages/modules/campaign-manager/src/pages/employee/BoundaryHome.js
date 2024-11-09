import { Card, Loader } from "@egovernments/digit-ui-components";
import { Button, Toast } from "@egovernments/digit-ui-components";
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
    url=`/${window.contextPath}/employee/campaign/boundary/view-hierarchy?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
        break;
  case "VIEW_EXISTING_BOUNDARY_DATA":
    url=`/${window.contextPath}/employee/campaign/boundary/view-all-hierarchy`;

    break;
  case "EDIT_BOUNDARY_DATA":
    url=`/${window.contextPath}/employee/campaign/boundary/view-hierarchy?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
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
  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <BoundaryPopup showPopUp={showPopUp} setShowPopUp={setShowPopUp} callGeoPode={()=>{}} data={data} geoPodeData={geoPodeData} />
      {/* {toast &&
        <Toast label={t("USER_NOT_AUTHORISED")} type={"error"} onClose={() => setToast(false)} />} */}
      <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
        <div style={{ fontWeight: 700, fontSize: "2.5rem" }}>{t("BOUNDARY_DATA_MANAGEMENT")}</div>
        <div style={{ height: "2rem" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        {Object.keys(boundaryHomeConfig)?.map(key=>{
          return (<Button
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t(key)}
            isDisabled={key=="EDIT_BOUNDARY_DATA"&&Object.keys(data?.boundaryData||{})?.length==0}
            onClick={()=>navigate(history,key,data,setShowPopUp)}
            style={{ width: "38rem", height: "5rem" }}
            textStyles={{ fontSize: "1.5rem" }}
          />)
        })}
        </div>
      </Card>
    </React.Fragment>
  );
};
export default BoundaryHome;
