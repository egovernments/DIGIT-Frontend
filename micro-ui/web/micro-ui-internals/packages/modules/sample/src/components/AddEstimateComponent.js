import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AddEstimateComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  // state for storing data
  const [documentData, setDocumentData] = useState([
    {
      key: 1,
      sorId: null,
      category: null,
      description: null,
      unitRate: null,
      uom: null,
      length: null,
      width: null,
    },
  ]);

  // fn to update the value based on type. 
  const handleUpdateField = ({ type, value, item, index }) => {
    setDocumentData((prev) => {
      return prev?.map((i, n) => {
        if (i.key === item.key) {
          return {
            ...i,
            [type]: value,
          };
        }
        return i;
      });
    });
  };

  //fn to add more field
  const add = () => {
    setDocumentData((prev) => [
      ...prev,
      {
        key: prev?.length + 1,
        sorId: null,
        category: null,
        description: null,
        unitRate: null,
        uom: null,
        length: null,
        width: null,
      },
    ]);
  };
  //fn to delete field
  const deleteItem = (data) => {
    const fil = documentData.filter((i) => i.key !== data.key);
    const up = fil.map((item, index) => ({ ...item, key: index + 1 }));
    setDocumentData(up);
  };

  // when doc update calling onselect for update the value in formdata
  useEffect(() => {
    onSelect("estimateDetails", documentData);
  }, [documentData]);
  
  return (
    <>
      {documentData?.map((item, index) => (
        <div 
          key={item.key}
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {documentData?.length > 1 ? (
            <div className="delete-resource-icon" style={{ textAlign: "right" }} onClick={() => deleteItem(item, index)}>
              <DustbinIcon />
            </div>
          ) : null}
          {props.config.populators.options.map( (field) =>
          <LabelFieldPair key={field.key}>
            <div style={{ width: "30%" }}>
                <span>{`${t(field.label)}`}</span>
            </div>
            <TextInput
                name={field.key}
                type={field.type === "number" ? "number" : "text"}
                inputMode={field.type === "number" ? "numeric" : "text"}
                pattern={field.type === "number" ? "[0-9]*" : undefined}
                value={item?.[field.key] || ""}
                onChange={(event) => handleUpdateField({ type: field.key, value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>
          )}
        </div>
      ))}
      <Button
        variation="secondary"
        label={t(`Add more`)}
        className={"add-rule-btn hover"}
        icon={<AddIcon fill="#c84c0e" styles={{ height: "1.5rem", width: "1.5rem" }} />}
        onButtonClick={add}
        style={{ marginLeft: "auto" }}
      />
    </>
  );
};

export default AddEstimateComponent;
