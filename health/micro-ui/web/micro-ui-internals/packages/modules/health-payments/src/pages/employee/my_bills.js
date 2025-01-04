import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { Card, LoaderScreen } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";

const MyBills = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const BillSearchCri = {
        url: `/health-expense/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                locality: ""
            }
        },
        config: {
            enabled: true,
            select: (data) => {
                return data;
            },
        },
    };

    const { isLoading: isBillLoading, data: BillData } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

    console.log(BillData, 'bbbbbbbbbbbbbbbbbbbbbbbbbb');

    if (isBillLoading) {
        return <LoaderScreen />
    }

    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>
                {t("HCM_AM_MY_BILLS")}
            </Header>


            <MyBillsSearch />

            <Card>
                <MyBillsTable />
            </Card>

        </React.Fragment>
    );
};

export default MyBills;
