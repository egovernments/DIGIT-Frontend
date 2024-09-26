import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, LabelFieldPair, Button } from "@egovernments/digit-ui-react-components";
import { Dropdown, FieldV1 } from "@egovernments/digit-ui-components";
import { TextInput } from "@egovernments/digit-ui-react-components";

const ThreeInputComp = ( {output, input1, input2, input3} ) => {

  const { t } = useTranslation();

  const onSelect = (selectedValue) => {
    console.log("Selected value:", selectedValue);
  };
  console.log("threeinut",output, input1, input2, input3);
  return (
    <div>
      {/* Header component */}

      {/* Card Component */}
      <Card style={{ background: "#FAFAFA" }}>
        {/* Loop through some data to render LabelFieldPair */}
        
          <div >
            <LabelFieldPair className="formula-label-field" style={{display:"flex",overflow: "hidden"  }}>
              <span>{t(output)}</span>
              <div className="equals-icon">=</div>

              {/* < value={input1} type="text"  styles={{ width: "17rem", marginBottom: "0" }}/> */}
              <TextInput name="name"style={{width:"17rem"}}/>
              <TextInput name="name1"style={{width:"11.25rem"}}/>
              <TextInput name="name2"style={{width:"14.1rem"}}/>


              {/* <FieldV1 value={input2} type="text"  styles={{width:"11.25rem"}}/> */}

              {/* <FieldV1 value={input3} type="text" styles={{width:"14.1rem"}}/> */}


              
             
            </LabelFieldPair>

            {/* Divider */}
            <div style={{ background: "#eee", height: "0.2rem", marginBottom: "1rem" }}></div>
          </div>
     
      </Card>
    </div>
  );
};

export default ThreeInputComp;
