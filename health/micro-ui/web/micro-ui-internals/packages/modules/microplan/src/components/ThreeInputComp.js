import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, LabelFieldPair, Button } from "@egovernments/digit-ui-react-components";
import { Dropdown, FieldV1 } from "@egovernments/digit-ui-components";

const ThreeInputComp = ({ title,output, input1, input2, input3, customProps }) => {

  const { t } = useTranslation();

  const onSelect = (selectedValue) => {
    console.log("Selected value:", selectedValue);
  };

  return (
    <div>
      {/* Header component */}

      {/* Card Component */}
      <Card style={{ background: "#FAFAFA" }}>
        {/* Loop through some data to render LabelFieldPair */}
        
          <div >
            <LabelFieldPair className="formula-label-field">
              <span>{t(output)}</span>
              <div className="equals-icon">=</div>

              <FieldV1 value={input1} type="text" nonEditable style={{width:"30rem"}}/>

              <FieldV1 value={input2} type="text" nonEditable style={{width:"20rem"}}/>

              <FieldV1 value={input3} type="text" nonEditable style={{width:"25rem"}}/>


              
             
            </LabelFieldPair>

            {/* Divider */}
            <div style={{ background: "#eee", height: "0.2rem", marginBottom: "1rem" }}></div>
          </div>
     
      </Card>
    </div>
  );
};

export default ThreeInputComp;
