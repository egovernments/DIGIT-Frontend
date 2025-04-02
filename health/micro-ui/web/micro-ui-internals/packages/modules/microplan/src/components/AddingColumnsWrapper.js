import React, { useState, useEffect, createContext, useContext } from "react";
import AddingColumns from "./AddingColumns";
import { TextBlock, Card } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";

const AddColContext = createContext("addColContext");
export const useAddColContext = () => useContext(AddColContext);

const AddingColumnsWrapper = ({ formData, onSelect, props:customProps }) => {
    const { t } = useTranslation();
    const [colValues, setColValues] = useState([
        { key: "MP_COLUMN_1", value: "SOME_VALUE" },
        { key: "MP_COLUMN_2", value: "SOME_VALUE" },
    ]);
    const [executionCount, setExecutionCount] = useState(0);

    const [showToast, setShowToast] = useState({});

    const deleteCol = (key) => {
        setColValues((prev) => prev.filter((item) => item.key !== key)); // ✅ Removes column correctly
    };

    const addNewCol = (key, newColName) => {
        if (colValues.some((item) => item.value === newColName)) {
            setShowToast({ message: "Column already exists!", type: "error" });
            return;
        }
        setColValues((prev) => [...prev, { key: key, value: newColName }]); // ✅ Adds new column
    };

    useEffect(() => {
        onSelect(customProps.name, colValues);
    }, [colValues]);


    useEffect(() => {
        if (executionCount < 5) {
            onSelect(customProps.name, colValues);
            setExecutionCount((prevCount) => prevCount + 1);
        }
    });

    return (
        <div>
            <AddColContext.Provider value={{ addNewCol, deleteCol, setColValues }}>
                <div>
                    {colValues && Array.isArray(colValues) && colValues.length > 0 && (
                        <AddingColumns colValues={colValues} setShowToast={setShowToast} />
                    )}
                </div>
            </AddColContext.Provider>
        </div>
    );
};

export default AddingColumnsWrapper;
