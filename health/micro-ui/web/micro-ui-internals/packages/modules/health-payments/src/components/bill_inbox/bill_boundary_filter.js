import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, SubmitBar } from "@egovernments/digit-ui-components";
import BoundaryComponent from "../sample";
import { Card, SVG, Button, ButtonGroup, TextBlock, Dropdown, Toast } from "@egovernments/digit-ui-components";
const BillBoundaryFilter = ({ isRequired, selectedProject, selectedLevel, onFilterChange, updateBoundaryFilters, resetBoundaryFilter }) => {
    const { t } = useTranslation();
    const [boundary, setBoundary] = useState(() => Digit.SessionStorage.get("boundary") || null);
    const [showToast, setShowToast] = useState(null);
    const [boundaryType, setBoundaryType] = useState("");
    const [boundaryKey, setBoundaryKey] = useState(0);
    const [resetFilters, setResetFilters] = useState(false);
    const [levelSelected, setLevelSelected] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);

    const handleApplyFilter = () => {

        if (!boundary || boundary?.boundaryType !== selectedLevel?.code) {
            setShowToast({ key: "error", label: t("HCM_AM_SELECT_BOUNDARY_TILL_LAST_LEVEL"), transitionTime: 3000 });
            return;
        }
        //Clear the toast if the input is valid
        setShowToast(null);
        onFilterChange(boundary.code);
    };
    const onBoundaryChange = (boundary) => {
        if (boundary) {
            setBoundary(boundary);
            Digit.SessionStorage.set("boundary", boundary);

        } else {
            setBoundary(null);
            Digit.SessionStorage.set("boundary", null);
        }
    };

    useEffect(() => {

        if (updateBoundaryFilters) {
            setResetFilters(true);
            setBoundary(null);
            Digit.SessionStorage.set("boundary", null);
            Digit.SessionStorage.set("selectedBoundaryCode", null);
        }

    }, [levelSelected])


    useEffect(() => {
        setLevelSelected(selectedLevel);
    }, [selectedLevel])

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
                        <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                                fill="#505A5F"
                            />
                        </svg>
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
                        updateSeeeionStorage={(newSelectedValues) => {
                            Digit.SessionStorage.set("selectedValues", newSelectedValues);
                        }}
                        onChange={onBoundaryChange}
                        selectedProject={selectedProject}
                        lowestLevel={selectedLevel.code}>
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