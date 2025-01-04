import { SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, TextBlock } from "@egovernments/digit-ui-components";

const AGGREGATION_LEVEL_OPTIONS = [
    { name: "HCM_AM_DISTRICT_LEVEL", code: "DISTRICT" },
    { name: "HCM_AM_PROVIENCE_LEVEL", code: "PROVIENCE" },
    { name: "HCM_AM_COUNTRY_LEVEL", code: "COUNTRY" },
];

const BillSearchBox = ({ onLevelSelect }) => {
    const { t } = useTranslation();
    const [project, setProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedAggregationLevel, setSelectedAggregationLevel] = useState(null);
    const [filteredAggregationOptions, setFilteredAggregationOptions] = useState(AGGREGATION_LEVEL_OPTIONS);

    const HIERARCHY = Digit.SessionStorage.get("boundaryHierarchyOrder");

    useEffect(() => {
        if (selectedProject) {
            // Get the boundary type from the selected project
            const boundaryType = selectedProject?.address?.boundaryType;

            const filteredOptions = [];

            for (const option of AGGREGATION_LEVEL_OPTIONS) {
                filteredOptions.push(option);
                if (option.code === boundaryType) {
                    break; // Stop once we include the desired boundaryType
                }
            }
            setFilteredAggregationOptions(filteredOptions);

        } else {
            setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS); // Reset to default if no project selected
        }
    }, [selectedProject]);



    useEffect(() => {
        if (project.length === 0) {
            const datak =
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

    const handleAggregationLevelChange = (value) => {
        setSelectedAggregationLevel(value);
        onLevelSelect(selectedProject, value); // Pass the selected project and level to the parent
    };

    return (
        <React.Fragment>
            <Card variant="search">
                <div style={{ maxWidth: "100%", width: "100%", marginBottom: "1.5rem" }}>
                    <TextBlock body={`${t("ATTENDANCE_PROJECT_NAME")} *`} />
                    <Dropdown
                        t={t}
                        option={project}
                        name={"code"}
                        optionKey={"name"}
                        selected={selectedProject}
                        select={(value) => setSelectedProject(value)}
                    />
                </div>
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <TextBlock body={`${t("HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT")} *`} />
                    <Dropdown
                        t={t}
                        option={filteredAggregationOptions}
                        name={"code"}
                        optionKey={"name"}
                        selected={selectedAggregationLevel}
                        select={handleAggregationLevelChange}
                    />
                </div>
            </Card>
        </React.Fragment>
    );
};

export default BillSearchBox;
