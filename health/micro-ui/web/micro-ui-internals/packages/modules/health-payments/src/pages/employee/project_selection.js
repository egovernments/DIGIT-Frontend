import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Header, Button, Dropdown, Toast } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";

/**
 * This component is used to select a project and aggregation level for the generate bill or registers inbox feature.
 * It fetches the list of projects from session storage and displays them in a dropdown.
 * It also fetches the aggregation level options from session storage and filters them based on the selected project.
 * The selected project and aggregation level are stored in session storage and used to fetch the relevant data.
 * @returns {JSX.Element} The JSX element for the project and aggregation level selection screen
 */
const ProjectSelect = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const history = useHistory();

    // Determine if the current screen is the project and aggregation selection screen
    const billScreen = location.pathname.includes("project-and-aggregation-selection");

    // State variables
    const [project, setProject] = useState([]); // List of projects
    const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || null);
    const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
    const [filteredAggregationOptions, setFilteredAggregationOptions] = useState([]);
    const [showToast, setShowToast] = useState(null);

    // Fetch configuration from session storage
    const boundaryHierarchyOrder = Digit.SessionStorage.get("boundaryHierarchyOrder");
    const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";

    // Generate aggregation level options based on boundary hierarchy
    const AGGREGATION_LEVEL_OPTIONS = boundaryHierarchyOrder
        ?.filter(item => item.order <= boundaryHierarchyOrder?.find(d => d.code === lowestLevelBoundaryType)?.order)
        ?.map(b => ({
            name: `HCM_AM_${b?.code}_LEVEL`,
            code: b?.code,
            order: b?.order,
        }));

    // Filter aggregation options dynamically based on selected project
    useEffect(() => {
        if (selectedProject) {
            const boundaryTypeOrder = AGGREGATION_LEVEL_OPTIONS.find(option => option.code === selectedProject?.address?.boundaryType)?.order;

            if (boundaryTypeOrder) {
                setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS.filter(option => option.order >= boundaryTypeOrder));
            } else {
                setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS);
            }
        } else {
            setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS);
        }
    }, [selectedProject]);

    // Load project data if not already loaded
    useEffect(() => {
        if (project == null || project?.length === 0) {
            const projectData = Digit?.SessionStorage.get("staffProjects") || [];
            setProject(projectData);
            handleProjectSelect(projectData?.[0]); // Default to the first project
        }
    }, []);

    // Handle project selection
    const handleProjectSelect = (value) => {
        Digit.SessionStorage.set("selectedProject", value);
        setSelectedProject(value);
    };

    // Handle aggregation level selection
    const handleAggregationLevelChange = value => {
        if (value !== Digit.SessionStorage.get("selectedLevel")) {
            Digit.SessionStorage.del("selectedBoundaryCode");
            Digit.SessionStorage.del("boundary");
            Digit.SessionStorage.del("selectedValues");
        }
        setSelectedLevel(value);
        Digit.SessionStorage.set("selectedLevel", value);
    };

    // Handle navigation to next screen
    const handleNextClick = () => {
        if (billScreen) {
            if (!selectedProject || !selectedLevel) {
                setShowToast({ key: "error", label: t("HCM_AM_PLEASE_SELECT_MANDATORY_FIELDS"), transitionTime: 3000 });
                return;
            }
            Digit.SessionStorage.set("selectedProject", selectedProject);
            history.push(`/${window.contextPath}/employee/payments/generate-bill`);
        } else {
            if (!selectedProject) {
                setShowToast({ key: "error", label: t("HCM_AM_PROJECT_SELECTION_IS_MANDATORY"), transitionTime: 3000 });
                return;
            }
            Digit.SessionStorage.set("selectedProject", selectedProject);
            history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
        }
    };



    return (
        <React.Fragment>
            <div style={{ marginBottom: "2.5rem" }}>
                <Card type="primary" className="bottom-gap-card-payment" style={{ gap: "1.5rem" }}>
                    {/* {<Header className="pop-inbox-header">
                        {billScreen ? t("HCM_AM_PROJECT_AND_BILL_AGGREGATION_HEADING") : t("HCM_AM_CHOOSE_PROJECT_TO_VIEW_REGISTERS")}
                    </Header>} */}
                    <div className="label-pair">
                        {billScreen ? t("HCM_AM_PROJECT_AND_BILL_AGGREGATION_DESCRIPTION") : t("HCM_AM_PROJECT_CHOOSE_DESCRIPTION")}
                    </div>
                    <div className="label-pair">
                        <div className="">
                            {t("ATTENDANCE_PROJECT_NAME")}
                            <span className="required" style={{ color: "#b91900" }}> *</span>
                        </div>
                        <div className="label-text">
                            {<Dropdown
                                t={t}
                                option={project}
                                name={"code"}
                                optionKey={"name"}
                                selected={selectedProject}
                                select={handleProjectSelect}
                            />}
                        </div>
                    </div>
                    {billScreen && selectedProject && (
                        <div className="label-pair">
                            <div className="label-heading">
                                {t("HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT")}
                                <span className="required" style={{ color: "#b91900" }}> *</span>
                            </div>
                            {<div className="label-text">
                                <Dropdown
                                    t={t}
                                    option={filteredAggregationOptions}
                                    name={"code"}
                                    optionKey={"name"}
                                    selected={selectedLevel}
                                    select={handleAggregationLevelChange}
                                />
                            </div>}
                        </div>
                    )}
                </Card>
            </div>
            {<ActionBar className="mc_back" style={{
                display: "flex", justifyContent: "space-between"
            }}>

                <Button
                    icon="ArrowBack"
                    label={t("HCM_AM_BACK_LABEL")}
                    onClick={() => history.push(`/${window.contextPath}/employee`)}
                    style={{ marginLeft: "2.5rem", minWidth: "10rem" }}
                    type="button"
                    variation="secondary"
                />,
                <Button
                    icon="ArrowForward"
                    isSuffix
                    label={t("HCM_AM_NEXT_LABEL")}
                    onClick={handleNextClick}
                    style={{ minWidth: "10rem" }}
                    type="button"
                    variation="primary"
                />

            </ActionBar>}
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    transitionTime={showToast.transitionTime}
                    onClose={() => setShowToast(null)}
                />
            )}
        </React.Fragment>
    );
};

export default ProjectSelect;