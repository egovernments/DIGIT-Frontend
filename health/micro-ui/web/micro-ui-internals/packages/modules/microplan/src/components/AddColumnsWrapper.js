import React, { useState, useEffect, createContext, useContext } from "react";
import AddColumns from "./AddColumns";
import { useTranslation } from "react-i18next";
import { PopUp, CardText, Button, Toast } from "@egovernments/digit-ui-components";

const AddColContext = createContext("addColContext");
export const useAddColContext = () => useContext(AddColContext);

const AddColumnsWrapper = ({ formData, onSelect, props: customProps }) => {
    const { t } = useTranslation();
    const [colValues, setColValues] = useState(() => {
        const storedCols = Digit.SessionStorage.get("MICROPLAN_DATA")?.NEW_COLUMNS?.newColumns;

        // If storedCols exists and is an array, map it to the desired format
        if (Array.isArray(storedCols)) {
            return storedCols.map((val, index) => ({
                key: `MP_COLUMN_${index}`,
                value: val,
            }));
        }

        // Fallback to default columns
        return [
            { key: "MP_COLUMN_0", value: "" },
            { key: "MP_COLUMN_1", value: "" },
        ];
    });

    const [executionCount, setExecutionCount] = useState(0);

    const [showToast, setShowToast] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [columnsToDelete, setColumnsToDelete] = useState(null);


    const deleteCol = () => {
        setColValues((prev) => prev.filter((item) => item.key !== columnsToDelete)); // Removes column correctly
        setColumnsToDelete(null);
        setShowDeletePopup(false);
    };

    const addNewCol = (key, newColName) => {
        if (colValues.some((item) => item.value === newColName)) {
            setShowToast({ message: t("COLUMN_ALREADY_EXISTS"), type: "error" });
            return;
        }
        if (newColName === null || !newColName || newColName.trim() === "") {
            setShowToast({ message: t("COLUMN_NAME_CANNOT_BE_EMPTY"), type: "error" });
            return;
        }
        // Check if newColName exceeds the maximum allowed length of 235 characters
        if (newColName.length > 200) {
            setShowToast({ message: t("COLUMN_NAME_TOO_LONG"), type: "error" });
            return;
        }
        setColValues((prev) => [...prev, { key: key, value: newColName }]); // Adds new column
    };

    useEffect(() => {
        onSelect(customProps.name, colValues.map((item) => (item.value)));
    }, [colValues]);


    useEffect(() => {
        if (executionCount < 5) {
            onSelect(customProps.name, colValues.map((item) => (item.value)));
            setExecutionCount((prevCount) => prevCount + 1);
        }
    });

    return (
        <div>
            <AddColContext.Provider value={{ addNewCol, deleteCol, setColValues, setColumnsToDelete, setShowDeletePopup }}>
                <div>
                    {colValues && Array.isArray(colValues) && colValues.length > 0 && (
                        <AddColumns colValues={colValues} setShowToast={setShowToast} />
                    )}
                </div>
            </AddColContext.Provider>
            {showDeletePopup && (
                <PopUp
                    className={"popUpClass"}
                    type={"default"}
                    heading={t("ADD_NEW_COL_CONFIRM_TO_DELETE")}
                    equalWidthButtons={true}
                    children={[
                        <div>
                            <CardText style={{ margin: 0 }}>
                                {
                                    t(`CONFIRM_DELETE_ADD_COLUMN`)
                                }
                            </CardText>
                        </div>,
                    ]}
                    onOverlayClick={() => {
                        setShowDeletePopup(false);
                    }}
                    footerChildren={[
                        <Button
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t("YES")}
                            title={t("YES")}
                            onClick={() => {
                                deleteCol();
                            }}
                        />,
                        <Button
                            type="button"
                            size="large"
                            variation="primary"
                            label={t("NO")}
                            title={t("NO")}
                            onClick={() => {
                                setShowDeletePopup(false);    // Hide the delete confirmation popup
                                setColumnsToDelete(null);     // Clear the selected columns
                            }}
                        />

                    ]}
                    sortFooterChildren={true}
                    onClose={() => {
                        setShowDeletePopup(false);
                    }}
                ></PopUp>
            )}
            {showToast && (
                <Toast
                    label={showToast?.message}
                    type={showToast?.type}
                    isDleteBtn={true}
                    onClose={() => setShowToast(null)}
                ></Toast>
            )}

        </div>
    );
};

export default AddColumnsWrapper;
