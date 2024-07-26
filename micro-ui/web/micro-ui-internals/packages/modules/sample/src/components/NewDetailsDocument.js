import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NewDetailsDocument = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  // state for storing data
  const [documentsData, setDocumentsData] = useState([
    {
      key: 1,
      documentType: null,
      fileStore: null,
      status: null,
      additionalDetails: {
        fileName: null,
      },
    },
  ]);

  // fn to update the value based on field name and index
  const handleChange = (index, field, value, subField = null) => {
    const newData = [...documentsData];
    if (subField) {
      newData[index][field][subField] = value;
    } else {
      newData[index][field] = value;
    }
    setDocumentsData(newData);
  };

  // fn to add new row
  const addRow = () => {
    setDocumentsData([
      ...documentsData,
      {
        key: documentsData.length + 1,
        documentType: null,
        fileStore: null,
        status: null,
        additionalDetails: {
          fileName: null,
        },
      },
    ]);
  };

  // fn to delete field
  const deleteItem = (index) => {
    const newData = documentsData.filter((item, idx) => idx !== index);
    setDocumentsData(newData);
  };

  // when doc update calling onSelect for update the value in formdata
  useEffect(() => {
    onSelect("documents", documentsData);
  }, [documentsData]);

  return (
    <>
      <div><strong>Documents</strong></div>
      {documentsData.map((item, index) => (
        <div
          key={item.key}
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {documentsData.length > 1 ? (
            <div className="delete-resource-icon" style={{ textAlign: "right" }} onClick={() => deleteItem(index)}>
              <DustbinIcon />
            </div>
          ) : null}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("documentType")}</span>
            </div>
            <TextInput
              name="documentType"
              value={item.documentType || ""}
              onChange={(event) => handleChange(index, "documentType", event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("fileStore")}</span>
            </div>
            <TextInput
              name="fileStore"
              value={item.fileStore || ""}
              onChange={(event) => handleChange(index, "fileStore", event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("status")}</span>
            </div>
            <TextInput
              name="status"
              value={item.status || ""}
              onChange={(event) => handleChange(index, "status", event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("fileName")}</span>
            </div>
            <TextInput
              name="fileName"
              isMandatory={true}
              value={item.additionalDetails.fileName || ""}
              onChange={(event) => handleChange(index, "additionalDetails", event.target.value, "fileName")}
            />
          </LabelFieldPair>
        </div>
      ))}
      <Button
        variation="secondary"
        label={t("Add more")}
        className={"add-rule-btn hover"}
        icon={<AddIcon fill="#c84c0e" styles={{ height: "1.5rem", width: "1.5rem" }} />}
        onButtonClick={addRow}
        style={{ marginLeft: "auto" }}
      />
    </>
  );
};

export default NewDetailsDocument;
