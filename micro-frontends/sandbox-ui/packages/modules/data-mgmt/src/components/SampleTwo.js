import React, { useState } from "react";
import { DigitUIComponents } from "components";
const {
  CheckBox,
  InputTextAmount,
  MobileNumber,
  MultiSelectDropdown,
  Paragraph,
  TextArea,
  TextInput,
  TestComponent,
  Tag,
  SelectionCard,
  ErrorMessage,
} = DigitUIComponents; // Import only the necessary component

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
      <Tag />
      <SelectionCard
        options={[
          {
            code: "sasa",
            name: "name",
          },
        ]}
      />
      <ErrorMessage message="Error" />
      <TestComponent></TestComponent>
    </div>
  );
};

export default SampleTwo;
