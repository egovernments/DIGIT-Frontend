import { SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, TextBlock, TextInput, ButtonGroup, Button } from "@egovernments/digit-ui-components";

const BillSearchBox = ({ onLevelSelect }) => {
    const { t } = useTranslation();
    const [project, setProject] = useState([]);

    const [selectedProject, setSelectedProject] = useState(null);


    // const onSubmit = (data, e) => {

    // };

    // const clearSearch = () => {
    //     onLevelSelect();
    // };

    // const closeToast = () => {
    //     setShowToast(null);
    // };

    useEffect(() => {
        if (project.length == 0) {
            let datak =
                Digit?.SessionStorage.get("staffProjects") ||
                [].map((target) => ({
                    code: target.id,
                    projectType: target.projectType,
                    name: target.name,
                    boundary: target?.address?.boundary,
                    boundaryType: target?.address?.boundaryType,
                    projectHierarchy: target.projectHierarchy,
                }));
            setProject(datak);
        }
    }, []);

    const handleFilterRefresh = () => { };

    return (
        <React.Fragment>
            <Card variant="search">
                {/*<div style={{ maxWidth: "100%", width: "100%" }}>
          <TextBlock body={t("HCM_AM_ATTENDANCE_ID")}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>*/}
                <div style={{ maxWidth: "100%", width: "100%", marginBottom: "1.5rem" }}>
                    <TextBlock body={`${t("ATTENDANCE_PROJECT_NAME")} *`}></TextBlock>
                    <Dropdown
                        // selected={projectSelected}
                        t={t}
                        option={project}
                        name={"code"}
                        optionKey={"name"}
                        select={(value) => {
                            setSelectedProject(value);
                            //   onProjectSelect(value);
                        }}
                    />
                </div>
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <TextBlock body={`${t("HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT")} *`}></TextBlock>
                    <Dropdown
                        t={t}
                        option={[
                            { "name": "HCM_AM_DISTRICT_LEVEL", "code": 'HCM_AM_DISTRICT_LEVEL' },
                            { "name": "HCM_AM_PROVIENCE_LEVEL", "code": "HCM_AM_PROVIENCE_LEVEL" },
                            { "name": "HCM_AM_COUNTRY_LEVEL", "code": "HCM_AM_COUNTRY_LEVEL" }
                        ]}
                        name={"code"}
                        optionKey={"name"}
                        select={(value) => {
                            onLevelSelect(selectedProject, value);
                        }}
                    />
                </div>

                {/* <ButtonGroup
                    buttonsArray={[
                        <Button variation="teritiary" label={t(`HCM_AM_CLEAR`)} type="button" onClick={() => { }} size="large" />,
                        <Button variation="primary" label={t(`HCM_AM_SEARCH`)} type="button" onClick={() => { }} size="large" />,
                    ]}
                ></ButtonGroup> */}

                {/*showToast && <Toast 
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={closeToast} />
       */}
            </Card>
        </React.Fragment>
    );
};

export default BillSearchBox;
