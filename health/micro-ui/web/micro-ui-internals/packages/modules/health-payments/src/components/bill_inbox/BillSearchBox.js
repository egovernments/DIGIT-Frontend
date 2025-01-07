import { SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, TextBlock } from "@egovernments/digit-ui-components";

const AGGREGATION_LEVEL_OPTIONS = [
    { name: "HCM_AM_DISTRICT_LEVEL", code: "DISTRICT" },
    { name: "HCM_AM_PROVINCE_LEVEL", code: "PROVINCE" },
    { name: "HCM_AM_COUNTRY_LEVEL", code: "COUNTRY" },
];

const BillSearchBox = ({ onLevelSelect, initialProject, initialAggregationLevel }) => {
    const { t } = useTranslation();
    const [project, setProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(initialProject || null);
    const [selectedAggregationLevel, setSelectedAggregationLevel] = useState(initialAggregationLevel || null);
    const [filteredAggregationOptions, setFilteredAggregationOptions] = useState(AGGREGATION_LEVEL_OPTIONS);

    const HIERARCHY = Digit.SessionStorage.get("boundaryHierarchyOrder");

    // Update aggregation options based on the selected project
    useEffect(() => {
        if (selectedProject) {
            const boundaryType = selectedProject?.address?.boundaryType;

            const filteredOptions = [];

            for (const option of AGGREGATION_LEVEL_OPTIONS) {
                filteredOptions.push(option);
                if (option.code === boundaryType) {
                    break;
                }
            }
            setFilteredAggregationOptions(filteredOptions);
        } else {
            setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS); // Reset to default if no project selected
        }
    }, [selectedProject]);

    // Load project data if not already loaded
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

    // Handle aggregation level change
    const handleAggregationLevelChange = (value) => {
        setSelectedAggregationLevel(value);
        onLevelSelect(selectedProject, value); // Pass the selected project and level to the parent
    };

    // Handle project selection
    const handleProjectSelect = (value) => {
        setSelectedProject(value);
        onLevelSelect(value, selectedAggregationLevel); // Pass the selected project and level to the parent
    };

    return (
        <React.Fragment>
            <Card variant="search">
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <div className="comment-label">
                        {t(`ATTENDANCE_PROJECT_NAME`)}<span className="required"> *</span>
                    </div>
                    <Dropdown
                        t={t}
                        option={project}
                        name={"code"}
                        optionKey={"name"}
                        selected={selectedProject}
                        select={handleProjectSelect}
                    />
                </div>
                <div style={{ maxWidth: "100%", width: "100%" }}>
                    <div className="comment-label">
                        {t(`HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT`)}<span className="required"> *</span>
                    </div>
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
