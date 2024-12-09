import React, { Fragment, } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
import UserAccessMgmtTableWrapper from "./UserAccessMgmtTableWrapper";


const UserAccessMgmt = ({ setupCompleted }) => {
    const { state } = useMyContext();
    const rolesArray = state?.rolesForMicroplan?.sort((a, b) => a.orderNumber - b.orderNumber).map((item) => item.roleCode) || [];

    const { t } = useTranslation();

    if (rolesArray?.length === 0) {
        <Card />
    }

    return (
        <div style={{ marginBottom: "2.5rem" }}>
            <Card className="middle-child">
                <Header className="summary-main-heading">{t("USER_ACCESS_MGMT")} </Header>
            </Card>
            {rolesArray?.map((role, index) => {

                return (
                    <UserAccessMgmtTableWrapper
                        internalKey={index}
                        role={role}
                        setupCompleted={setupCompleted}
                    />
                );
            })
            }
        </div>
    )
};

export default UserAccessMgmt;