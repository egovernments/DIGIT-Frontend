
import React, { useState } from 'react';
import { LabelFieldPair, AddIcon, Button, Card, TextInput, Dropdown } from "@egovernments/digit-ui-react-components";




const CreatePopup = () => {
  const codesopt = [
    // { code: "String" },
    { code: "ABC" },
    { code: "DEF" },
    { code: "GHI" },
    { code: "JKL" }
  ];
  
  const [code, setCode] = useState("ABC");
  const handleUpdateField = (data, target, index, id) => {
    console.log("the data going is", data);
    setCode(data);
  };
  
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
                      <span>{"Select Role"}</span>
                      <Dropdown
                        style={{ width: "50%" }}
                        option={codesopt}
                        optionKey={"code"}
                        select={(value) => {
                          handleUpdateField(value,);
                        }}
                        placeholder="Type"
                      />
      </div>   
    </div>
  );
};

export default CreatePopup;
