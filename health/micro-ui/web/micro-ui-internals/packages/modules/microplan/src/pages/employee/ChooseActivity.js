import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "@egovernments/digit-ui-react-components";
import ActivityHomeCard from "../../components/ActivityCard";


const ChooseActivity = () => {
    const { t } = useTranslation();

    const disableCardBasedOnRole = (validRoles = []) => {
        const userInfo = Digit.UserService.getUser();
        const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
      //to see different flows should be removed later
        return false;
        const enabled = userRoles?.filter((role) => validRoles?.includes(role));
      
        return !(validRoles?.length > 0 && enabled?.length > 0);
      };      

    const activityCardData = [
        { 
            name: t("VALIDATE_N_APPROVE_POPULATION_DATA"), 
            link: "", 
            icon: <SVG.Population/>,
            disable: disableCardBasedOnRole(["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"])
        },
        { 
            name: t("ASSIGN_FACILITIES_TO_VILLAGE"), 
            link: "", 
            icon: <SVG.AssignmentTurnedIn/>,
            disable: disableCardBasedOnRole(["FACILITY_CATCHMENT_MAPPER", "ROOT_FACILITY_CATCHMENT_MAPPER"])
        },
        { 
            name: t("VALIDATE_N_APPROVE_MICROPLAN_ESTIMATIONS"), 
            link: "", 
            icon: <SVG.FactCheck/>,
            disable: disableCardBasedOnRole(["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"]),
        },
        { 
            name: t("GEOSPATIAL_MAP_VIEW"), 
            link: null, 
            icon: <SVG.LocationOn/>,
            disable: disableCardBasedOnRole()
        },
        { 
            name: t("VIEW_MICROPLAN_ESTIMATIONS"), 
            link: null, 
            icon: <SVG.Visibility/>,
            disable: disableCardBasedOnRole()
        }
      ];

    return (
        <React.Fragment>
            <ActivityHomeCard title={t("SELECT_AN_ACTIVITY_TO_CONTINUE")} module={activityCardData}/>
        </React.Fragment>
    )
}

export default ChooseActivity;