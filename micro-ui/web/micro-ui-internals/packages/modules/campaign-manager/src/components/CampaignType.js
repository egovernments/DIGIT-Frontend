import React, { useState, useMemo, useRef, useEffect } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header, Dropdown } from "@egovernments/digit-ui-react-components";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import useCustomMDMS from "@egovernments/digit-ui-libraries/src/hooks/useCustomMDMS";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

const CampaignType = ({ onSelect, formData }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const { isLoading, data: projectType } = useCustomMDMS("mz", "HCM-PROJECT-TYPES", [{ name: "projectTypes" }]);
  const [type, setType] = useState({});
  const [ beneficiaryType , setBeneficiaryType] = useState("");
  const [ showBeneficiary , setShowBeneficiaryType] = useState(false);
  const handleChange = (data) => {
    setType(data);
    setBeneficiaryType(data.beneficiaryType);
    setShowBeneficiaryType(true);
  };

  useEffect(() => {
    onSelect("projectType", type);
  }, [type]);

  return (
    <React.Fragment>
      <Header>{t(`HCM_CAMPAIGN_TYPE_HEADER`)}</Header>
      <p>{t(`HCM_CAMPAIGN_TYPE_DESCRIPTION`)}</p>
      <LabelFieldPair>
        <span className="start">{`${t("HCM_CAMPAIGN_TYPE")}`}</span>
        <Dropdown
          style={{ width: "50%" }}
          t={t}
          option={projectType?.["HCM-PROJECT-TYPES"]?.projectTypes}
          optionKey={"code"}
          selected={type}
          select={(value) => {
            handleChange(value);
          }}
        />
      </LabelFieldPair>
      {showBeneficiary &&
      <LabelFieldPair>
        <span>{`${t("HCM_BENEFICIARY_TYPE")}`}</span>
        <span>{beneficiaryType}</span>
      </LabelFieldPair>
      }
    </React.Fragment>
  );
};

export default CampaignType;
