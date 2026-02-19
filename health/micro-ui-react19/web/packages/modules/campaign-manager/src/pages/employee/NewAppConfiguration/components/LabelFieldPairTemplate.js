import React from "react";
import { SummaryCardFieldPair } from "@egovernments/digit-ui-components";

const LabelFieldPairTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;
  const { data = [] } = selectedField;

  return (
    <div style={{width:"100%"}}>
      {data.map((pair, index) => (
        <div key={index} style={{width:"100%"}}>
          <SummaryCardFieldPair
            style={{
              overflowX: "hidden",
              display: "flex",
              alignItems: "center",
              ...(index < data.length - 1 && { paddingBottom: "1rem" }),
            }}
            key={index}
            inline={true}
            label={(field ? t : props?.t)(pair.key)}
            value="*****"
            className={"app-config-summary-card-fieldpair"}
          />
        </div>
      ))}
    </div>
  );
};

export default LabelFieldPairTemplate;