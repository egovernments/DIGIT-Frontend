import React from "react";
import { SummaryCardFieldPair } from "@egovernments/digit-ui-components";

const LabelFieldPairTemplate = ({ field, t }) => {
  const { data = [] } = field;

  return (
    <div>
      {data.map((pair, index) => (
        <div key={index}>
          <SummaryCardFieldPair
            style={{
              overflowX: "hidden",
              display: "flex",
              alignItems: "center",
              paddingBottom: "1rem",
            }}
            key={index}
            inline={true}
            label={t(pair.key)}
            value="*****"
          />
        </div>
      ))}
    </div>
  );
};

export default LabelFieldPairTemplate;