
import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdditionalDetails = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  // State for storing data
  const [additionalDetailsData, setAdditionalDetailsData] = useState([
    {
      key: 1,
      officerInChargeName: {
        code: "",
        name: "",
      },
      officerInChargeDesgn: "",
      totalEstimatedAmount: "",
    },
  ]);

// Function to update the value based on field name and index
const handleChange = (index, field, value, subField = null) => {
    const newData = [...additionalDetailsData];
    if (subField) {
      newData[index][field][subField] = value;
    } else {
      newData[index][field] = value;
    }
    setAdditionalDetailsData(newData);
  };

  // Function to add new row
  const addRow = () => {
    setAdditionalDetailsData([
      ...additionalDetailsData,
      {
        key: additionalDetailsData.length + 1,
        officerInChargeName: {
          code: "",
          name: "",
        },
        officerInChargeDesgn: "",
        totalEstimatedAmount: "",
      },
    ]);
  };

  // Function to delete a row
  const deleteItem = (index) => {
    const newData = additionalDetailsData.filter((item, idx) => idx !== index);
    setAdditionalDetailsData(newData);
  };

  // when doc update calling onSelect for update the value in formdata
  useEffect(() => {
    onSelect("additionalDetails", additionalDetailsData);
  }, [additionalDetailsData]);

  useEffect(() => {
    onSelect("additionalDetails2", additionalDetailsData);
  }, [additionalDetailsData]);

  return (
    <>
      <div><strong>Additional Details </strong></div>
      {additionalDetailsData.map((item, index) => (
        <div
          key={item.key}
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {additionalDetailsData.length > 1 && (
            <div className="delete-resource-icon" style={{ textAlign: "right" }} onClick={() => deleteItem(index)}>
              <DustbinIcon />
            </div>
          )}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("officerInChargeCode")}</span>
            </div>
            <TextInput
              name="officerInChargeCode"
              value={item.officerInChargeName.code || ""}
              onChange={(event) => handleChange(index, "officerInChargeName", event.target.value, "code")}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("officerInChargeName")}</span>
            </div>
            <TextInput
              name="officerInChargeName"
              isMandatory={true}
              value={item.officerInChargeName.name || ""}
              onChange={(event) => handleChange(index, "officerInChargeName", event.target.value, "name")}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("officerInChargeDesgn")}</span>
            </div>
            <TextInput
              name="officerInChargeDesgn"
              isMandatory={true}
              value={item.officerInChargeDesgn || ""}
              onChange={(event) => handleChange(index, "officerInChargeDesgn", event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{t("totalEstimatedAmount")}</span>
            </div>
            <TextInput
              name="totalEstimatedAmount"
              isMandatory={true}
              type="number"
              value={item.totalEstimatedAmount || ""}
              onChange={(event) => handleChange(index, "totalEstimatedAmount", event.target.value)}
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

export default AdditionalDetails;
