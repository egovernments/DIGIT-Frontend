import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dropdown,
    Loader,
    HeaderComponent,
    Card,
    LabelFieldPair,
    Button,
    Toast,
    CardLabel, TextInput,
} from "@egovernments/digit-ui-components";

import SearchUserToReport from "./SearchUserToReport";

const UserAssignment = ({ t, config, onSelect, formData, }) => {


    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [options, setOptions] = useState([]);

    const boundaryCode = Digit?.SessionStorage.get("selectedBoundary")?.code;
    //const { t } = useTranslation();
    const tenantId = Digit.ULBService.getStateId();
    const [searchQuery, setSearchQuery] = useState("");

    const [open, setOpen] = useState(false);




    const seletctedValue = (value) => {
        setSearchQuery(value?.name);
        onSelect(config.key, value?.id);
    }

    return (<div>
        <LabelFieldPair>
            <CardLabel style={{ width: "50.1%" }} className="digit-card-label-smaller">
                {t("HCM_AM_REPORTING_TO")}<span style={{ color: "#B91900" }}> *</span>
            </CardLabel>
            <div style={{ width: "100%" }}
                onClick={() => {
                    setOpen(true)
                }}
            >

                <TextInput type="search" name="title" placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
        </LabelFieldPair>

        {
            open && <SearchUserToReport

                boundaryCode={boundaryCode}
                onClose={() => { setOpen(false) }}
                heading={`${t("HCM_AM_ATTENDANCE_ASSIGN_USER")}`}
                onSubmit={seletctedValue}
            />
        }
    </div>
    )
}



export default UserAssignment;