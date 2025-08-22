import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, Loader, TextInput, Button } from '@egovernments/digit-ui-components';
import { useEffect } from "react";
import EditAttendanceManagementTable from "./EditAttendanceManagementTable";
import { useHistory } from "react-router-dom";
import AttendanceService from "../services/attendance/attendanceService";
import SelectableList from "./SelectableList";



const SearchUserPopUp = ({ onClose, businessId, heading, registerId }) => {

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { mutate: createMapping } = Digit.Hooks.payments.useCreateAttendeeFromRegister(tenantId);
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



            const result = await AttendanceService.searchIndividual(
                { name, undefined, tenantId }
            );

            setSearchedIndividual(result)
        } catch (error) {




        }

    }

    const onSelect = (value) => {
        setSelectedUser(value);


    }


    const handleEnrollAttendee = async () => {

        // const attendee = {
        //   registerId: props.registerNumber,
        //   individualId: value,
        //   enrollmentDate: null,
        //   denrollmentDate: new Date(Date.now() - (1 * 60 * 1000 + 30 * 1000)).getTime(),
        //   tenantId: String(tenantId)
        // };

        
        const attendee = {
            registerId: businessId,
            individualId: selectedUser["uuid"],
            enrollmentDate: new Date().getTime(),
            tenantId: selectedUser["tenantId"],
            additionalDetails: {
                individualName: selectedUser["name"],
                individualID: selectedUser["individualCode"],
                individualGaurdianName: selectedUser["individualGaurdianName"],
                identifierId: selectedUser["aadhaar"],
                gender: selectedUser["gender"]
            }
        };


        await createMapping({ "attendees": [attendee] },
            {
                onError: async (error) => {

                    console.log("hello", error)
                    setShowToast(
                        { key: "error", label: t(`HCM_AM_ERROR_MESSAGE`), transitionTime: 3000 }
                    );


                },
                onSuccess: async (responseData) => {

                    console.log("responseData", responseData);

                    setShowToast({ key: "success", label: t(`HCM_AM_ATTENDEE_DE_ENROLL_SUCCESS_MESSAGE`), transitionTime: 3000 });
                    props.disableUser("");
                },
            }
        )


    };

    // -------- Render --------
    return (
        <PopUp
            style={{ width: "500px" }}
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
                        <TextInput type="search" name="title" placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // prevent form submit if inside a form
                                searchUser(searchQuery); // call your API
                            }
                        }} />

                        {searchedIndividual.length > 0 && <SelectableList selectableList={searchedIndividual} onSelect={onSelect} />}

                        <div style={{ display: "grid", gridTemplateColumns: `${labelWidth} auto`, rowGap: "10px", alignItems: "center" }}>
                            <div>{t(labels[0])}</div>
                            <Button label={t("Register New User")} variation="link" onClick={() => {

                            }} />


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
                    onClick={handleEnrollAttendee}
                />,
            ]}
            sortFooterChildren={true}
        />
    );
};

export default SearchUserPopUp;
