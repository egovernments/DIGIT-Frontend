import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, SubmitBar } from "@egovernments/digit-ui-components";
import BoundaryComponent from "../BoundaryComponent";
import { Card, SVG, Toast } from "@egovernments/digit-ui-components";

/**
 * BillBoundaryFilter component allows users to filter boundaries
 * based on the selected project and level.
 *
 * @param {boolean} isRequired - Whether the filter is required.
 * @param {object} selectedProject - The currently selected project.
 * @param {object} selectedLevel - The currently selected boundary level.
 * @param {function} onFilterChange - Callback when a filter is applied.
 * @param {function} resetBoundaryFilter - Function to reset boundary filters.
 */
const BillBoundaryFilter = ({ isRequired, selectedProject, selectedLevel, onFilterChange, resetBoundaryFilter }) => {
    const { t } = useTranslation();

    // State variables
    const [boundary, setBoundary] = useState(() => Digit.SessionStorage.get("boundary") || null);
    const [showToast, setShowToast] = useState(null);
    const [boundaryKey, setBoundaryKey] = useState(0);
    const [resetFilters, setResetFilters] = useState(false);

    /**
   * Applies the selected boundary filter.
   * Displays a toast if the boundary is not properly selected.
   */
    const handleApplyFilter = () => {

        if (!boundary || boundary?.boundaryType !== selectedLevel?.code) {
            setShowToast({ key: "error", label: t("HCM_AM_SELECT_BOUNDARY_TILL_LAST_LEVEL"), transitionTime: 3000 });
            return;
        }
        //Clear the toast if the input is valid
        setShowToast(null);
        onFilterChange(boundary.code);
    };

    // Updates the boundary when changed in the BoundaryComponent.
    const onBoundaryChange = (boundary) => {
        if (boundary) {
            setBoundary(boundary);
            Digit.SessionStorage.set("boundary", boundary);

        } else {
            setBoundary(null);
            Digit.SessionStorage.set("boundary", null);
        }
    };

    // Clears all applied filters and resets the component state.
    const handleClearFilter = () => {
        setResetFilters(true);
        setBoundary(""); // Clear the boundary value
        setBoundaryKey((prevKey) => prevKey + 1); // Increment the key to re-render BoundaryComponent
        Digit.SessionStorage.set("boundary", null);
        Digit.SessionStorage.set("selectedBoundaryCode", null);
        Digit.SessionStorage.set("selectedValues", null);
        resetBoundaryFilter();
    };

    return (
        <Card
            className="inbox-search-links-container"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <div
                style={{
                    flexGrow: 1, // Ensures this section grows to take available space
                    overflowY: "auto", // Enables scrolling if content exceeds available space
                }}
            >
                <div onClick={handleClearFilter}
                    style={{
                        cursor: "pointer",
                        alignItems: "center",
                        gap: ".75rem",
                        marginBottom: "24px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <SVG.FilterAlt width={"32px"} height={"32px"} fill={"#C84C0E"} />
                        <span className="custom-inbox-filter-heading">{t("HCM_AM_FILTER")}</span>
                    </div>

                    <span onClick={() => { }} style={{ border: "1px solid #E0E0E0", padding: "6px", marginBottom: "10px" }}>
                        <SVG.AutoRenew width={"24px"} height={"24px"} fill={"#c84c0e"} />
                    </span>
                </div>
                {selectedProject?.address?.boundary && selectedLevel && (
                    <BoundaryComponent
                        key={boundaryKey} // Add the key to force re-render
                        isRequired={isRequired}
                        reset={resetFilters}
                        makeReset={() => {
                            setResetFilters(false);
                        }}
                        initialValue={Digit.SessionStorage.get("selectedValues")}
                        updateSessionStorage={(newSelectedValues) => {
                            Digit.SessionStorage.set("selectedValues", newSelectedValues);
                        }}
                        onChange={onBoundaryChange}
                        selectedProject={selectedProject}
                        lowestLevel={selectedLevel.code}>
                        disableChildOptions={true}
                    </BoundaryComponent>
                )}
            </div>
            <div
                style={{
                    justifyContent: "center",
                    marginTop: "auto", // Pushes this section to the bottom
                    paddingTop: "16px", // Adds spacing above the button
                }}
            >
                {selectedProject?.address?.boundary && selectedLevel && <SubmitBar onSubmit={handleApplyFilter} className="w-fullwidth" label={t("HCM_AM_COMMON_APPLY")} />}
                {showToast && (
                    <Toast
                        style={{ zIndex: 10001 }}
                        label={showToast.label}
                        type={showToast.key}
                        onClose={() => setShowToast(null)}
                    />
                )}
            </div>
        </Card>
    );
};
export default BillBoundaryFilter;