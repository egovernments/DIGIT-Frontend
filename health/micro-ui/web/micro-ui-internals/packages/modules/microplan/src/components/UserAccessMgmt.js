import React, { Fragment, } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header } from "@egovernments/digit-ui-react-components";
import { useMyContext } from "../utils/context";
import UserAccessMgmtTableWrapper from "./UserAccessMgmtTableWrapper";


const UserAccessMgmt = ({}) => {
    const { state } = useMyContext();
    const rolesArray = state?.rolesForMicroplan?.sort((a, b) => a.orderNumber - b.orderNumber).map((item) => item.roleCode) || [];
    
    const { t } = useTranslation();

    if(rolesArray?.length === 0){
        <Card/>
    }

    return (
        <div>
        <Card>
        <Header styles={{ fontSize: "32px" }}>{t("USER_ACCESS_MGMT")}</Header>
        </Card>
        {rolesArray?.map((role, index) => {

            return(
              <UserAccessMgmtTableWrapper
              internalKey={index}
              role={role}
              />
                );
        })
        }
        </div>
        )
};

export default UserAccessMgmt;