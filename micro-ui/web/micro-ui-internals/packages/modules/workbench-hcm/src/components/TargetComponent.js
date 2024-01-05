import { Button, Header, SVG } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AssignTarget from "./AssignTarget";

const TargetComponent = (props) => {
  const { t } = useTranslation();

  console.log("propss", props?.targets);
  const [showModal, setShowModal] = useState(false);
  const [editTargetIndex, setEditTargetIndex] = useState(null);
  const [formData, setFormData] = useState({
    beneficiaryType: "",
    totalNo: 0,
    targetNo: 0,
  });

  const handleOnChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const columns = [
    { label: t("BENEFICIARY_TYPE"), key: "beneficiaryType" },
    { label: t("TOTAL_NUMBER"), key: "totalNo" },
    { label: t("TARGET_NUMBER"), key: "targetNo" },
    { label: t("ACTIONS"), key: "actions" },
  ];

  const handleEditButtonClick = (index) => {
    setEditTargetIndex(index);
    setFormData(props.targets[index]);

    setShowModal(true);
  };
  return (
    <div className="override-card">
      <Header className="works-header-view">{t("WBH_TARGET")}</Header>

      {showModal && (
        <AssignTarget
          t={t}
          heading={"WBH_CAMPAIGN_ASSIGNMENT_EDIT_TARGET"}
          onClose={() => {
            setShowModal(false);
            setEditTargetIndex(null);
          }}
          data={props.targets[editTargetIndex]}
          onChange={handleOnChange}
        />
      )}
      {props?.targets?.length === 0 ? (
        <h1>{t("NO_TARGETS_FOUND")}</h1>
      ) : (
        <table className="table reports-table sub-work-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props?.targets?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>
                    {column.key !== "actions" ? (
                      row[column.key]
                    ) : (
                      <Button
                        label={`${t("WBH_EDIT_ACTION")}`}
                        type="button"
                        variation="secondary"
                        icon={<SVG.Delete width={"28"} height={"28"} />}
                        onButtonClick={() => handleEditButtonClick(rowIndex)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TargetComponent;
