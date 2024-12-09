import React from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-components";
import { TextInput } from "@egovernments/digit-ui-components";

const FormulaView = ({ output = "N/A", input1 = "N/A", input2 = "N/A", input3 = "N/A" }) => {

  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: "0rem" }}>
      {/* Card Component */}
      <Card type="secondary">
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
              value={t(input1)}
              nonEditable={true}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
              className="mp-tooltip"
              title={t(input1)}
            />
            <TextInput
              type="text"
              value={t(input2)}
              nonEditable={true}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
            />
            <TextInput
              type="text"
              value={t(input3)}
              nonEditable={true}
              style={{
                width: "100%",
                cursor: "pointer",
                
              }}
              title={t(input3)}
            />
          </LabelFieldPair>

        </div>
      </Card>
    </div>
  );
};

export default FormulaView;
