import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdditionalComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();
  // option for dropdown
  const [options, setOptions] = useState([
    {
      code: "ADHAAR",
      name: "Adhaar",
    },
    {
      code: "PANCARD",
      name: "Pan Card",
    },
    {
      code: "PASSPORT",
      name: "Passport",
    },
  ]);

  // state for storing data
  const [documentData, setDocumentData] = useState([
    {
      key: 1,
      type: null,
      value: null,
    },
  ]);

  // fn to update the value based on type. 
  const handleUpdateField = ({ type, value, item, index }) => {
    switch (type) {
      case "TYPE":
        setDocumentData((prev) => {
          return prev?.map((i, n) => {
            if (i.key === item.key) {
              return {
                ...i,
                type: value?.code,
              };
            }
            return i;
          });
        });
        break;
      case "VALUE":
        setDocumentData((prev) => {
          return prev?.map((i, n) => {
            if (i.key === item.key) {
              return {
                ...i,
                value: value,
              };
            }
            return i;
          });
        });
        break;
      default:
        break;
    }
  };

  //fn to add more field
  const add = () => {
    setDocumentData((prev) => [
      ...prev,
      {
        key: prev?.length + 1,
        value: null,
        type: null,
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
    onSelect("additionalDetails", documentData);
  }, [documentData]);
  
  return (
    <>
      {documentData?.map((item, index) => (
        <div
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
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Document Type")}`}</span>
            </div>
            <Dropdown
              style={{ width: "100%" }}
              t={t}
              option={options}
              optionKey={"name"}
              selected={options?.find((i) => i.code === item?.type)}
              select={(value) => {
                handleUpdateField({ type: "TYPE", value: value, item: item, index: index });
              }}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Document ID")}`}</span>
            </div>
            <TextInput
              name="name"
              value={item?.value || ""}
              onChange={(event) => handleUpdateField({ type: "VALUE", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>
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

export default AdditionalComponent;
