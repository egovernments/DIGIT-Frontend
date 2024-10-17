import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader, ULBHomeCard,SVG } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { UserManagementConfig } from "../../configs/UserManagementConfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { useMyContext } from "../../utils/context";
import ActivityHomeCard from "../../components/ActivityCard";


const ChooseActivity = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();
    

    
    const config = UserManagementConfig?.UserManagementConfig?.[0];
    


    const history=useHistory();


    

    const { dispatch, state } = useMyContext();
    const [microplanData, setData] = useState(state["rolesForMicroplan"]);

    const disableCardBasedOnRole = (validRoles = []) => {
        const userInfo = Digit.UserService.getUser();
        const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
      
        const enabled = userRoles?.filter((role) => validRoles?.includes(role));
      
        return !(validRoles?.length > 0 && enabled?.length > 0);
      };      

    const activityCardData = [
        { 
            name: t("VALIDATE_N_APPROVE_POPULATION_DATA"), 
            link: "", 
            icon: <SVG.Population></SVG.Population>,
            roles: ["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"],
            disable: disableCardBasedOnRole(["MICROPLAN_ADMIN"])
        },
        { 
            name: t("ASSIGN_FACILITIES_TO_VILLAGE"), 
            link: "", 
            icon: <SVG.AssignmentTurnedIn></SVG.AssignmentTurnedIn>,
            roles: ["FACILITY_CATCHMENT_MAPPER", "ROOT_FACILITY_CATCHMENT_MAPPER"],
            disable: disableCardBasedOnRole(["MICROPLAN_ADMIN"])
        },
        { 
            name: t("VALIDATE_N_APPROVE_MICROPLAN_ESTIMATIONS"), 
            link: "", 
            icon: <SVG.FactCheck></SVG.FactCheck>,
            roles: ["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"],
            disable: disableCardBasedOnRole(["MICROPLAN_ADMIN"]),
        },
        { 
            name: t("GEOSPATIAL_MAP_VIEW"), 
            link: null, 
            icon: <SVG.LocationOn></SVG.LocationOn>,
            disable: disableCardBasedOnRole()
        },
        { 
            name: t("VIEW_MICROPLAN_ESTIMATIONS"), 
            link: null, 
            icon: <SVG.Visibility></SVG.Visibility>,
            disable: disableCardBasedOnRole()
        }
      ];

    return (
        <React.Fragment>
            <ActivityHomeCard title={t("SELECT_AN_ACTIVITY_TO_CONTINUE")} module={activityCardData}></ActivityHomeCard>
        </React.Fragment>
    )
}

export default ChooseActivity;