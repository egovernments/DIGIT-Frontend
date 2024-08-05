import {
    CheckBox,
    InputTextAmount,
    MobileNumber,
    MultiSelectDropdown,
    Paragraph,
    TextArea,
    TextInput,
  } from "@egovernments/digit-ui-components";
  
  import React, { useState } from "react";
  
  const SampleTwo = () => {
    return (
      <div>
        <TextInput />
        <TextArea />
        <Paragraph />
        <MobileNumber />
        <InputTextAmount />
        <CheckBox />
        <h2>SampleTwo</h2>
      </div>
    );
  };
  
  export default SampleTwo;
  