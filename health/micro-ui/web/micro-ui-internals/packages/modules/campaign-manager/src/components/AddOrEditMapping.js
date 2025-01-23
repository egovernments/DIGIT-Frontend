import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, TextInput, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-components";
import MultiSelectDropdown from "./MultiSelectDropdown";

const AddOrEditMapping = forwardRef(({ schema, dispatch,  boundaryHierarchy, allSelectedBoundary }, ref) =>  {

    const { t } = useTranslation();
    const columns = schema.filter(item => !item.hideColumn);


    const [newdata, setNewData] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedBoundary, setSelectedBoundary] = useState(null);

    // Expose a method to the parent component
    useImperativeHandle(ref, () => ({
        getData: () => {
        return newdata;
        },
    }));

    const renderInput = (column) => {
        if (column?.type === "number") {
            return (
                <div key={column.name} style={{ marginBottom: "1rem" }}>
                    <div style={{display:"flex"}}>
                        <label>{column.description}</label>
                        <span className="mandatory-span">*</span>
                    </div>
                    
                    <TextInput
                        isRequired={true}
                        className="tetxinput-example"
                        type={"number"}
                        name="title"
                        value={newdata[t(column.name)] || ""}
                        onChange={(event) => {
                            const updatedData = { ...newdata, [t(column.name)]: event.target.value };
                            setNewData(updatedData);
                        }}
                        placeholder={t("")}
                        />
                </div>
            );
        } 
        else if(column?.type === "string") {
            if(column?.description === "Boundary Code" || column?.description === "Boundary Code (Mandatory)")
            {
                return (
                    <div style={{ marginBottom: "1rem" }}>
                        <label>{t("CHOOSE_BOUNDARY_LEVEL")}</label>
                        <Dropdown
                            className="mappingPopUp"
                            selected={selectedLevel}
                            disabled={false}
                            isMandatory={true}
                            option={boundaryHierarchy}
                            select={(value) => {
                                setSelectedLevel(value);
                                setSelectedBoundary(null);
                            }}
                            optionKey="boundaryType"
                            t={t}
                        />
                        <div style={{height:"1rem"}}></div>
                        <label>{t("CHOOSE_BOUNDARY")}</label>
                        <MultiSelectDropdown
                            variant="nestedmultiselect"
                            props={{ className: "data-mapping-dropdown" }}
                            t={t}
                            options={
                                Object.values(
                                (allSelectedBoundary?.filter((i) => i.type === selectedLevel?.boundaryType) || []).reduce((acc, item) => {
                                    const { parent, code, type } = item;

                                    // Initialize the parent group if it doesn't exist
                                    if (!acc[parent]) {
                                    acc[parent] = {
                                        code: parent,
                                        options: [],
                                    };
                                    }

                                    // Add each item as a child of the corresponding parent
                                    acc[parent].options.push({
                                    code,
                                    type,
                                    parent,
                                    });

                                    return acc;
                                }, {})
                                ) || []
                            }
                            optionsKey={"code"}
                            selected={selectedBoundary ? selectedBoundary : []}
                            onClose={(value) => {
                                const boundariesInEvent = value?.map((event) => event?.[1]);
                                const values = boundariesInEvent?.map((i) => i?.code)?.join(",")
                                const updatedData = { ...newdata, [t(column.name)]: values };
                                setNewData(updatedData);
                                setSelectedBoundary(boundariesInEvent);
                            }}    
                            onSelect={(value) => {
                                // setSelectedBoundary(value);
                            }}
                            addCategorySelectAllCheck={true}
                            addSelectAllCheck={true}
                        />
                    {/* </LabelFieldPair> */}
                    </div>
                )
            }
            else {
            return (
                <div key={column.name} style={{ marginBottom: "1rem" }}>
                    <div style={{display:"flex"}}>
                        <label>{column.description}</label>
                        <span className="mandatory-span">*</span>
                    </div>
                    <TextInput
                        isRequired={true}
                        className="tetxinput-example"
                        type={"text"}
                        name="title"
                        value={newdata[t(column.name)] || ""}
                        onChange={(event) => {
                            const updatedData = { ...newdata, [t(column.name)]: event.target.value };
                            setNewData(updatedData);
                        }}
                        placeholder={t("")}
                        />
                </div>
            );}
        }
        else if (!column?.type && column?.enum) {
            const dropdownValues = column?.enum.map(item => ({
                code: item
              }));
            return (
                <div key={column.name} style={{ marginBottom: "1rem" }}>
                    <div style={{display:"flex"}}>
                        <label>{column.description}</label>
                        <span className="mandatory-span">*</span>
                    </div>
                    <Dropdown
                        className="roleTableCell"
                        selected={dropdownValues?.find(
                            (item) => item?.code === newdata[t(column.name)] // Get value from newdata
                          ) || null}
                        isMandatory={true}
                        option={dropdownValues}
                        select={(value) => {
                            // Update the newdata state with the selected value from the dropdown
                            const updatedData = { ...newdata, [t(column.name)]: value?.code };
                            setNewData(updatedData);  // Update state
                          }}
                        optionKey="code"
                        t={t}
                    />
                    
                </div>
            );
        }
        return null;
    };

    return (

        <div style={{marginTop: "1rem"}}>
            {columns.map(column => renderInput(column))}
        </div>
    );
});

export default AddOrEditMapping;
