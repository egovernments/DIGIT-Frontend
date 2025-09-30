import React from "react";
import { useCustomT } from "./hooks/useCustomT";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, TextInput, TextArea } from "@egovernments/digit-ui-components";

const HeaderFieldWrapper = ({ label, type, value, onChange, currentCard }) => {
  const { t } = useTranslation();
  const localizedValue = useCustomT(value ? value : `${currentCard?.flow}_${currentCard?.parent}_${currentCard?.name}_${label}`);

  return (
    <LabelFieldPair className={type === "textarea" ? "appConfigHeaderLabelField desc" : "appConfigHeaderLabelField"}>
      <div className="appConfigLabelField-label-container">
        <div className="appConfigLabelField-label">
          <span>{t(label)}</span>
        </div>
        {type === "textarea" ? (
          <TextArea type="textarea" className="appConfigLabelField-Input" name="" value={localizedValue} onChange={(e) => onChange(e)} />
        ) : (
          <TextInput className="appConfigLabelField-Input" name="" value={localizedValue} onChange={(e) => onChange(e)} />
        )}
      </div>
    </LabelFieldPair>
  );
};
export default React.memo(HeaderFieldWrapper);
