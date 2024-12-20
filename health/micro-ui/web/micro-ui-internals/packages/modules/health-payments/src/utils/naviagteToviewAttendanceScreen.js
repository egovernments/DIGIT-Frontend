import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useTranslation } from "react-i18next";

export const navigateToViewAttendance = ( value) => {
    const { t } = useTranslation();
debugger;
    let linkTo = `/${window?.contextPath}/employee/view-attendance`;

    if (ingestionStatus !== "Completed") {
        linkTo = `/${window?.contextPath}/employee/hcmworkbench/view?jobid=${jobid}`;
    }

    return (
        <Link to={linkTo}>
            {value ? value : t("ES_COMMON_NA")}
        </Link>
    );
};