import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen, Dropdown } from "@egovernments/digit-ui-components";
import _ from "lodash";

const ProjectSelect = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const billScreen = location.pathname.includes("project-and-aggregation-selection");
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || null);
  const [showToast, setShowToast] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
  const boundaryHierarchyOrder = Digit.SessionStorage.get("boundaryHierarchyOrder");
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentConfig")?.lowestLevelBoundary || "DISTRICT";

    const AGGREGATION_LEVEL_OPTIONS = boundaryHierarchyOrder
        ?.filter((item) => item.order <= boundaryHierarchyOrder?.find((d) => d.code === lowestLevelBoundaryType)?.order)
        ?.map((b) => {
            return {
                name: `HCM_AM_${b?.code}_LEVEL`,
                code: b?.code,
                order: b?.order,
            };
        });
    const [filteredAggregationOptions, setFilteredAggregationOptions] = useState(AGGREGATION_LEVEL_OPTIONS);

    // Update aggregation options based on the selected project
    useEffect(() => {
        if (selectedProject) {
            const boundaryType = selectedProject?.address?.boundaryType;
            // Find the order of the selected boundary type
            const boundaryTypeOrder = AGGREGATION_LEVEL_OPTIONS.find((option) => option.code === boundaryType)?.order;

            if (boundaryTypeOrder) {
                // Filter options dynamically based on the boundaryType's order
                const filteredOptions = AGGREGATION_LEVEL_OPTIONS.filter((option) => option.order >= boundaryTypeOrder);
                setFilteredAggregationOptions(filteredOptions);
            } else {
                setFilteredAggregationOptions(AGGREGATION_LEVEL_OPTIONS);
            }
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
            handleProjectSelect(Digit?.SessionStorage.get("staffProjects")?.[0]);
        }
    }, []);

  // clear every other storage when comes on this page
  useEffect(() => {
    window.Digit.SessionStorage.del("selectedLevel");
    window.Digit.SessionStorage.del("selectedBoundaryCode");
    window.Digit.SessionStorage.del("boundary");
    window.Digit.SessionStorage.del("selectedValues");
    window.Digit.SessionStorage.del("paymentInbox");
  }, []);

    // Handle project selection
    const handleProjectSelect = (value) => {
        Digit.SessionStorage.set("selectedProject", value);
        setSelectedProject(value);
    };

  // Handle aggregation level change
  const handleAggregationLevelChange = (value) => {
    setSelectedLevel(value);
    Digit.SessionStorage.set("selectedLevel", value);
  };

    return (
        <React.Fragment>
            <div style={{ marginBottom: "2.5rem" }}>
                <Card type="primary" className="middle-child" style={{ gap: "1.5rem" }}>
                    <Header className="pop-inbox-header">
                        {billScreen ? t('HCM_AM_PROJECT_AND_BILL_AGGREGATION_HEADING') : t('HCM_AM_CHOOSE_PROJECT_TO_VIEW_REGISTERS')}
                    </Header>
                    <div className="label-pair">
                        {billScreen ? t(`HCM_AM_PROJECT_AND_BILL_AGGREGATION_DESCRIPTION`) : t(`HCM_AM_PROJECT_CHOOSE_DESCRIPTION`)}
                    </div>
                    <div className="label-pair">
                        <div className="label-heading">
                            {t(`ATTENDANCE_PROJECT_NAME`)}<span className="required" style={{ color: "#b91900" }}> *</span>
                        </div>
                        <div className="label-text">
                            <Dropdown
                                t={t}
                                option={project}
                                name={"code"}
                                optionKey={"name"}
                                selected={selectedProject}
                                select={handleProjectSelect}
                            />
                        </div>
                    </div>
                    {billScreen && selectedProject && <div className="label-pair">
                        <div className="label-heading">
                            {t(`HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT`)}<span className="required" style={{ color: "#b91900" }}> *</span>
                        </div>
                        <div className="label-text">
                            <Dropdown
                                t={t}
                                option={filteredAggregationOptions}
                                name={"code"}
                                optionKey={"name"}
                                selected={selectedLevel}
                                select={handleAggregationLevelChange}
                            />
                        </div>
                    </div>}
                </Card>
            </div>
            <ActionBar
                actionFields={[
                    <Button
                        label={t(`HCM_AM_BACK_LABEL`)}
                        onClick={() => {
                            history.push(`/${window.contextPath}/employee`);
                        }}
                        style={{ marginLeft: "2.5rem", minWidth: "14rem" }}
                        type="button"
                        variation="secondary"
                    />,
                    <Button
                        label={t(`HCM_AM_NEXT_LABEL`)}
                        title={t(`HCM_AM_NEXT_LABEL`)}
                        onClick={() => {
                            if (!billScreen) {
                                if (selectedProject === null) {
                                    setShowToast({ key: "error", label: t("HCM_AM_PROJECT_SELECTION_IS_MANDATORY"), transitionTime: 3000 });
                                } else {
                                    Digit.SessionStorage.set("selectedProject", selectedProject);
                                    history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
                                }
                            } else {
                                if (selectedProject === null || selectedLevel == null) {
                                    setShowToast({ key: "error", label: t("HCM_AM_PLEASE_SELECT_MANDATORY_FIELDS"), transitionTime: 3000 });
                                } else {
                                    Digit.SessionStorage.set("selectedProject", selectedProject);
                                    history.push(`/${window.contextPath}/employee/payments/generate-bill`);
                                }
                            }
                        }}
                        style={{ minWidth: "14rem" }}
                        type="button"
                        variation="primary"
                    />,
                ]}
                className=""
                maxActionFieldsAllowed={5}
                sortActionFields
                style={{}}
            />
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    // error={showToast.key === "error"}
                    transitionTime={showToast.transitionTime}
                    onClose={() => setShowToast(null)}
                />
             
          )}
      
     
      <ActionBar
        actionFields={[
          <Button
            label={t(`HCM_AM_BACK_LABEL`)}
            onClick={() => {
              history.push(`/${window.contextPath}/employee`);
            }}
            style={{ marginLeft: "2.5rem", minWidth: "14rem" }}
            type="button"
            variation="secondary"
          />,
          <Button
            label={t(`HCM_AM_NEXT_LABEL`)}
            title={t(`HCM_AM_NEXT_LABEL`)}
            onClick={() => {
              if (!billScreen) {
                if (selectedProject === null) {
                  setShowToast({ key: "error", label: t("HCM_AM_PROJECT_SELECTION_IS_MANDATORY"), transitionTime: 3000 });
                } else {
                  Digit.SessionStorage.set("selectedProject", selectedProject);
                  history.push(`/${window.contextPath}/employee/payments/registers-inbox`);
                }
              } else {
                if (selectedProject === null || selectedLevel == null) {
                  setShowToast({ key: "error", label: t("HCM_AM_PLEASE_SELECT_MANDATORY_FIELDS"), transitionTime: 3000 });
                } else {
                  Digit.SessionStorage.set("selectedProject", selectedProject);
                  history.push(`/${window.contextPath}/employee/payments/generate-bill`);
                }
              }
            }}
            style={{ minWidth: "14rem" }}
            type="button"
            variation="primary"
          />,
        ]}
        className=""
        maxActionFieldsAllowed={5}
        sortActionFields
        style={{}}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};
export default ProjectSelect;
