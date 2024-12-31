import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

import { useMyContext } from "../../utils/context";
import { AttendanceInboxConfig } from "../../configs/attendance_inbox_config";
import CustomInboxSearchComposer from "../../components/custom_inbox_composer";
import { Card } from "@egovernments/digit-ui-components";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";

const MyBills = () => {

    const { t } = useTranslation();
    const location = useLocation();
    // const moduleName = Digit?.Utils?.getConfigModuleName() || "commonSanitationUiConfig"
    const tenant = Digit.ULBService.getStateId();
    const configs = AttendanceInboxConfig();

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
