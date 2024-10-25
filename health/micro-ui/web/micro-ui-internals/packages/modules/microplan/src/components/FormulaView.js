import React from "react";
import { useTranslation } from "react-i18next";
import { Card, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { TextInput } from "@egovernments/digit-ui-components";

const FormulaView = ({ output="N/A", input1="N/A", input2="N/A", input3="N/A" }) => {

  const { t } = useTranslation();

  return (
    <div>
      {/* Card Component */}
      <Card className="card-color">
        <div>
          {/* LabelFieldPair with CSS Grid layout */}
          <LabelFieldPair className="formula-label-field" style={{ display: "grid", gridTemplateColumns: "2fr auto 2fr 1fr 2fr", gap: "1rem", overflow: "hidden", alignItems: "center" }}>
            {/* Output Label */}
            <span style={{ minWidth: "20rem", overflow: "hidden" }}>{t(output)}</span>
            
            {/* Equals sign */}
            <div className="equals-icon">=</div>

            {/* Inputs in a grid layout */}
            <TextInput
              type="text"
              value={input1}
              nonEditable={true}
              style={{ width: "100%" }}
            />
            <TextInput
              type="text"
              value={input2}
              nonEditable={true}
              style={{ width: "100%" }}
            />
            <TextInput
              type="text"
              value={input3}
              nonEditable={true}
              style={{ width: "100%" }}
            />
          </LabelFieldPair>

          {/* Divider */}
          <div style={{ background: "#eee", height: "0.2rem", marginBottom: "1rem" }}></div>
        </div>
      </Card>
    </div>
  );
};

export default FormulaView;
