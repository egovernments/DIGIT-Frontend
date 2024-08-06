import { DigitUIComponents } from "components";
import React, { useState } from "react";

const {
  CheckBox,
  InputTextAmount,
  MobileNumber,
  MultiSelectDropdown,
  Paragraph,
  TextArea,
  TextInput,
} = DigitUIComponents;

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
