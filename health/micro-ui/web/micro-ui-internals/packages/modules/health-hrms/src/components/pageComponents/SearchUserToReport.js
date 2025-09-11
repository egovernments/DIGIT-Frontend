import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, Loader, TextInput, Button } from '@egovernments/digit-ui-components';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import AttendanceService from "../../services/hrms/SearchUser";
import SelectableList from "./SelectableList";



const SearchUserToReport = ({ boundaryCode, onClose, onSubmit }) => {

    const tenantId = Digit.ULBService.getCurrentTenantId();
    // const { mutate: createMapping } = Digit.Hooks.payments.useCreateAttendeeFromRegister(tenantId);
    const history = useHistory();
    // context path variables
    const attendanceContextPath =
        window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
        "health-attendance";
    const individualContextPath =
        window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") ||
        "health-individual";

    const { t } = useTranslation();


    const labels = ["HCM_AM_ATTENDANCE_NOT_FIND_USER_LABEL", "HCM_AM_ATTENDANCE_USER_ASSIGN_REGISTER"];
    const maxLabelLength = Math.max(...labels.map(label => label.length));
    const labelWidth = `${maxLabelLength * 8}px`;

    const [searchQuery, setSearchQuery] = useState("");
    const [searchedIndividual, setSearchedIndividual] = useState([]);

    const [selectedUser, setSelectedUser] = useState();


    const searchUser = async (name) => {

        try {

            const locallity = Digit.SessionStorage.get("selectedBoundary")?.code || null;

            if (locallity === null) {
                setShowToast(
                    { key: "error", label: t(`Locality is not selected`), transitionTime: 3000 }
                );
                return;
            }

            if (/^\d+$/.test(name)) {
                console.log("it is nummeric");
            } else {
                console.log("it is not nummeric");
            }

            const result = await AttendanceService.searchIndividual(
                { name, locallity, tenantId }
            );

            setSearchedIndividual(result)
        } catch (error) {




        }

    }

    const onSelect = (value) => {
        setSelectedUser(value);


    }


    const handleEnrollAttendee = async () => {

        // userUuid

        onSubmit({
            id: selectedUser?.userUuid,
            name: selectedUser?.name?.givenName
        })

        onClose();
        return ;


    };

    // -------- Render --------
    return (
        <PopUp
            style={{ width: "500px" }}
            onClose={onClose}
            heading={t("HCM_AM_SEARCH_USER")}
            onOverlayClick={onClose}
            children={[
                (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px", // same as Tailwind gap-4
                    }} >
                        <TextInput type="search" name="title" placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // prevent form submit if inside a form
                                searchUser(searchQuery); // call your API
                            }
                        }} />

                        {searchedIndividual.length > 0 && <SelectableList selectableList={searchedIndividual} onSelect={onSelect} />}



                    </div>
                )
            ]}
            footerChildren={[
                <Button
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t("HCM_AM_ASSIGN_BT")}
                    onClick={handleEnrollAttendee}
                />,
            ]}
            sortFooterChildren={true}
        />
    );
};

export default SearchUserToReport;
