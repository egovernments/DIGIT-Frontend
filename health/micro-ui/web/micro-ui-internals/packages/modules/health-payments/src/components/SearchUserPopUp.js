import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, Loader, TextInput, Button } from '@egovernments/digit-ui-components';
import { useEffect } from "react";
import EditAttendanceManagementTable from "./EditAttendanceManagementTable";
import { useHistory } from "react-router-dom";



const SearchUserPopUp = ({ onClose, businessId, heading ,registerId}) => {
    const history = useHistory();
    // context path variables
    const attendanceContextPath =
        window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
        "health-attendance";
    const individualContextPath =
        window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") ||
        "health-individual";

    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const labels = ["HCM_AM_ATTENDANCE_NOT_FIND_USER_LABEL", "HCM_AM_ATTENDANCE_USER_ASSIGN_REGISTER"];
    const maxLabelLength = Math.max(...labels.map(label => label.length));
    const labelWidth = `${maxLabelLength * 8}px`;

    const [searchQuery, setSearchQuery] = useState("");
    const [flag,setFlag]=useState(false);

    // -------- Render --------
    return (
        <PopUp
            style={{ minWidth: "1000px" }}
            onClose={onClose}
            heading={t(heading)}
            onOverlayClick={onClose}
            children={[
                 (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px", // same as Tailwind gap-4
                    }} >
                        <TextInput type="search" name="title" placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                       
                        <div style={{ display: "grid", gridTemplateColumns: `${labelWidth} auto`, rowGap: "10px", alignItems: "center" }}>
                            <div>{t(labels[0])}</div>
                            <Button label={t("Register New User")} variation="link" onClick={() => history.push(`/${window?.contextPath}/employee/hrms/create`)} />

                            
                        </div>

                    </div>
                )
            ]}
            footerChildren={[
                <Button
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t("HCM_AM_ASSIGN_BT")}
                    onClick={() => onClose}
                />,
            ]}
            sortFooterChildren={true}
        />
    );
};

export default SearchUserPopUp;
