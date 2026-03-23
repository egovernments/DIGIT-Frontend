import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Header, Button, Dropdown, Toast, HeaderComponent } from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";

/* --------------------------- Media Query Hook --------------------------- */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const ProjectSelect = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Responsive styles
  const labelPairStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    gap: isMobile ? "0.5rem" : "1rem",
    width: "60%",
  };

  const labelItemStyle = {
    width: isMobile ? "100%" : "40%",
    display: "flex",
    flexDirection: "row",
    fontWeight: 500,
    gap: isMobile ? "0.01rem" : "0.4rem",
  };
  const dropdownItemStyle = {
    width: isMobile ? "100%" : "60%",
    display: "flex",
    flexDirection: "column",
  };

  const billScreen = location.pathname.includes("project-and-aggregation-selection");

  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || null);
  const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
  const [filteredAggregationOptions, setFilteredAggregationOptions] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const boundaryHierarchyOrder = Digit.SessionStorage.get("boundaryHierarchyOrder");
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";

  const AGGREGATION_LEVEL_OPTIONS = boundaryHierarchyOrder
    ?.filter((item) => item.order <= boundaryHierarchyOrder?.find((d) => d.code === lowestLevelBoundaryType)?.order)
    ?.map((b) => ({
      name: `HCM_AM_${b?.code}_LEVEL`,
      code: b?.code,
      order: b?.order,
    }));

  useEffect(() => {
    if (selectedProject) {
      const boundaryTypeOrder = AGGREGATION_LEVEL_OPTIONS.find((option) => option.code === selectedProject?.address?.boundaryType)?.order;

      if (boundaryTypeOrder) {
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
            if(selectedProject == null){
                handleProjectSelect(projectData?.[0]); // Default to the first project
            }
        }
    }, []);

    // Handle project selection
    const handleProjectSelect = (value) => {
        if (value !== Digit.SessionStorage.get("selectedProject")) {
            Digit.SessionStorage.del("selectedBoundaryCode");
            Digit.SessionStorage.del("boundary");
            Digit.SessionStorage.del("selectedValues");
            Digit.SessionStorage.del("boundary");
            Digit.SessionStorage.del("paymentInbox");
        }
        Digit.SessionStorage.set("selectedProject", value);
        setSelectedProject(value);
    };

    // Handle aggregation level selection
    const handleAggregationLevelChange = value => {
        if (value !== Digit.SessionStorage.get("selectedLevel")) {
            Digit.SessionStorage.del("selectedBoundaryCode");
            Digit.SessionStorage.del("boundary");
            Digit.SessionStorage.del("selectedValues");
            Digit.SessionStorage.del("boundary");
            Digit.SessionStorage.del("paymentInbox");
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
          <HeaderComponent>
            <span style={{ color: "#0B4B66", fontWeight: "inherit" }}>
              {billScreen ? t("HCM_AM_PAYEMENT_BILL_AGGREGATION_HEAD") : t("HCM_AM_PAYEMENT_PROJECT_HEAD")}
            </span>
          </HeaderComponent>
          <div style={{ marginBottom: "0.5rem" }}>
            {billScreen ? t("HCM_AM_PROJECT_AND_BILL_AGGREGATION_DESCRIPTION") : t("HCM_AM_PROJECT_CHOOSE_DESCRIPTION")}
          </div>

          {/* ------------ Project Dropdown ------------ */}
          <div style={labelPairStyle}>
            <div style={labelItemStyle}>
              {t("ATTENDANCE_PROJECT_NAME")}
              <span style={{ color: "#b91900" }}> *</span>
            </div>

            <div style={dropdownItemStyle}>
              <Dropdown
                t={t}
                option={project}
                name={"code"}
                optionKey={"name"}
                selected={selectedProject}
                select={handleProjectSelect}
                disabled={selectedProject != null && project.length === 1}
              />
            </div>
          </div>

          {/* ------------ Aggregation Level ------------ */}
          {billScreen && selectedProject && (
            <div style={labelPairStyle}>
              <div style={labelItemStyle}>
                {t("HCM_AM_BILL_AGGREGATION_FOR_EMPLOYEE_MAPPED_AT")}
                <span style={{ color: "#b91900" }}> *</span>
              </div>

              <div style={dropdownItemStyle}>
                <Dropdown
                  t={t}
                  option={filteredAggregationOptions}
                  name={"code"}
                  optionKey={"name"}
                  selected={selectedLevel}
                  select={handleAggregationLevelChange}
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <ActionBar className="mc_back" style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          icon="ArrowBack"
          label={t("HCM_AM_BACK_LABEL")}
          onClick={() => history.push(`/${window.contextPath}/employee`)}
          style={{ marginLeft: "2.5rem", minWidth: "10rem" }}
          type="button"
          variation="secondary"
        />
        <Button
          icon="ArrowForward"
          isSuffix
          label={t("HCM_AM_NEXT_LABEL")}
          onClick={handleNextClick}
          style={{ minWidth: "10rem" }}
          type="button"
          variation="primary"
        />
      </ActionBar>

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