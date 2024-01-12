import { Button, Header, SVG } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AssignTarget from "./AssignTarget";

const TargetComponent = (props) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    beneficiaryType: "",
    totalNo: 0,
    targetNo: 0,
  });

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const columns = [
    { label: t("WBH_BENEFICIARY_TYPE"), key: "beneficiaryType" },
    { label: t("WBH_TOTAL_NUMBER"), key: "totalNo" },
    { label: t("WBH_TARGET_NUMBER"), key: "targetNo" },
    { label: t("WBH_ACTIONS"), key: "actions" },
  ];

  const handleEditButtonClick = (index) => {
    setFormData(props.targets[index]);
    setShowModal(true);
  };

  const reqCriteria = {
    url: "/project/v1/_update",
    config: false,
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteria);

  const handleSubmitTarget = async () => {
    const targets = {
      beneficiaryType: formData?.beneficiaryType,
      totalNo: Number(formData?.totalNo),
      targetNo: Number(formData?.targetNo),
      isDeleted: false,
    };

    const updatedProject = {
      ...props?.project,
      targets: [...props.project.targets, targets],
    };

    await mutation.mutate({
      body: {
        Projects: [updatedProject],
      },
    });

    console.log(props?.project, targets);
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
          }}
          onChange={handleOnChange}
          beneficiaryType={formData?.beneficiaryType}
          totalNo={formData?.totalNo}
          targetNo={formData?.targetNo}
          onSubmit={handleSubmitTarget}
        />
      )}
      {props?.targets?.length === 0 ? (
        <h1>{t("WBH_NO_TARGETS_FOUND")}</h1>
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
