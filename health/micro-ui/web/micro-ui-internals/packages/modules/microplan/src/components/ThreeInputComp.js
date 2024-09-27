import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, LabelFieldPair, Button } from "@egovernments/digit-ui-react-components";
import { Dropdown, FieldV1 } from "@egovernments/digit-ui-components";
import { TextInput } from "@egovernments/digit-ui-components";

const ThreeInputComp = ({ output, input1, input2, input3 }) => {

  const { t } = useTranslation();

  const onSelect = (selectedValue) => {
    
  };
  
  return (
    <div>
      {/* Header component */}

      {/* Card Component */}
      <Card style={{ background: "#FAFAFA" }}>
        {/* Loop through some data to render LabelFieldPair */}

        <div >
          <LabelFieldPair className="formula-label-field" style={{ display: "flex", overflow: "hidden" }}>
            <span>{t(output)}</span>
            <div className="equals-icon">=</div>



            <TextInput
              type="text"
              value={"Population of boundary"}
              nonEditable={true}
              style={{ width: "17rem" }}
            ></TextInput>
            <TextInput
              type="text"
              value={"Divided by "}
              nonEditable={true}
              style={{ width: "rem" }}
            ></TextInput>
            <TextInput
              type="text"
              value={"Average people H/H "}
              nonEditable={true}
              style={{ width: "14.1rem" }}
            ></TextInput>






          </LabelFieldPair>

          {/* Divider */}
          <div style={{ background: "#eee", height: "0.2rem", marginBottom: "1rem" }}></div>
        </div>

      </Card>
    </div>
  );
};

export default ThreeInputComp;
