import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";

const FilterByCycleDropdown = ({ handleItemClick }) => {
  const { t } = useTranslation();
  const actionRef = useRef(null);
  const projectData= Digit.SessionStorage.get("projectSelected");

  const dropdownItems =
  projectData?.project?.additionalDetails?.projectType?.cycles?.map((item) => ({
      code: String(item.id).padStart(2, "0"),
      name: `${t("CYCLE")} ${String(item.id).padStart(2, "0")}`,
      id: item.id,
    })) || [];

  return (
    <Button
      ref={actionRef}
      type="actionButton"
      label={t("FILTER_BY_CYCLE")}
      size="medium"
      variation="secondary"
      icon="FilterAlt"
      options={dropdownItems}
      showBottom={true}
      optionsKey="name"
      onOptionSelect={(item) => {
        handleItemClick(item);
      }}
    />
  );
};

export default FilterByCycleDropdown;