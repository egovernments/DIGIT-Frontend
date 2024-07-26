
import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NewComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  // option for dropdown
  const [options, setOptions] = useState([
    { code: "ADHAAR", name: "Adhaar" },
    { code: "PANCARD", name: "Pan Card" },
    { code: "PASSPORT", name: "Passport" },
    { code: "VOTERID", name: "voterid" },
  ]);

  // state for storing data
  const [documentData, setDocumentData] = useState([
    {
      key: 1,
      type: null,
      estimateId: null,
      estimateLineItemId: null,
      contractLineItemRef: null,
      tenantId: null,
      unitRate: null,
      noOfunit: null,
      status: null,
    },
  ]);

  // fn to update the value based on type
  const handleUpdateField = ({ field, value, item, index }) => {
    setDocumentData((prev) => {
      return prev.map((i) => {
        if (i.key === item.key) {
          return {
            ...i,
            [field]: value,
          };
        }
        return i;
      });
    });
  };

  // fn to add more field
  const add = () => {
    setDocumentData((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        type: null,
        estimateId: null,
        estimateLineItemId: null,
        contractLineItemRef: null,
        tenantId: null,
        unitRate: null,
        noOfunit: null,
        status: null,
      },
    ]);
  };

  // fn to delete field
  const deleteItem = (data) => {
    const fil = documentData.filter((i) => i.key !== data.key);
    const up = fil.map((item, index) => ({ ...item, key: index + 1 }));
    setDocumentData(up);
  };

  // when doc update calling onSelect for update the value in formdata
  useEffect(() => {
    onSelect("NewDetails", documentData);
  }, [documentData]);

  return (
    <>
    <div><strong>Line Items</strong></div>

      {documentData.map((item, index) => (
        <div
          key={item.key}
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {documentData.length > 1 ? (
            <div className="delete-resource-icon" style={{ textAlign: "right" }} onClick={() => deleteItem(item)}>
              <DustbinIcon />
            </div>
          ) : null}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("estimateId")}</span>
            </div>
            <TextInput
              name="estimateId"
              isMandatory={true}
              value={item.estimateId || ""}
              onChange={(event) => handleUpdateField({ field: "estimateId", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("estimateLineItemId")}</span>
            </div>
            <TextInput
              name="estimateLineItemId"
              isMandatory={true}
              value={item.estimateLineItemId || ""}
              onChange={(event) => handleUpdateField({ field: "estimateLineItemId", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("contractLineItemRef")}</span>
            </div>
            <TextInput
              name="contractLineItemRef"
              isMandatory={true}
              value={item.contractLineItemRef || ""}
              onChange={(event) => handleUpdateField({ field: "contractLineItemRef", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("tenantId")}</span>
            </div>
            <TextInput
              name="tenantId"
              isMandatory={true}
              value={item.tenantId || ""}
              onChange={(event) => handleUpdateField({ field: "tenantId", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("unitRate")}</span>
            </div>
            <TextInput
              name="unitRate"
              isMandatory={true}
              value={item.unitRate || ""}
              onChange={(event) => handleUpdateField({ field: "unitRate", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("noOfunit")}</span>
            </div>
            <TextInput
              name="noOfunit"
              isMandatory={true}
              value={item.noOfunit || ""}
              onChange={(event) => handleUpdateField({ field: "noOfunit", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("status")}</span>
            </div>
            <TextInput
              name="status"
              isMandatory={true}
              value={item.status || ""}
              onChange={(event) => handleUpdateField({ field: "status", value: event.target.value, item, index })}
            />
          </LabelFieldPair>
        </div>
      ))}
      <Button
        variation="secondary"
        label={t("Add more")}
        className={"add-rule-btn hover"}
        icon={<AddIcon fill="#c84c0e" styles={{ height: "1.5rem", width: "1.5rem" }} />}
        onButtonClick={add}
        style={{ marginLeft: "auto" }}
      />
    </>
  );
};

export default NewComponent;
