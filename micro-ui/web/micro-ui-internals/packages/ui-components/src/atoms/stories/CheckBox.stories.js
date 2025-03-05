import React from "react";
import FieldV1 from "../../hoc/FieldV1";
import CheckBox from "../CheckBox";

export default {
  title: "Atoms/CheckBox",
  component: CheckBox,
  argTypes: {
    config: { control: "object" },
    inputRef: { control: false },
    onChange: { action: "onChange" },
    errorStyle: { control: "object" },
    disabled: { control: "boolean" },
    type: { control: "text" },
    props: { control: "object" },
    populators: { control: "object" },
    formData: { control: "object" },
  },
};

const Template = (args) => <FieldV1 {...args} />;

const t = (key) => key;

const commonArgs = {
  t: t,
  populators: {
    title: "Value",
    name: "checked",
    isLabelFirst:false,
  },
  formData: {
    checked: true,
  },
  inputRef: null,
  onChange: () => {},
  errorStyle: null,
  disabled: false,
  type: "checkbox",
};

//Default checkbox
export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "",
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
};

//checkbox with label
export const DefaultLabelled = Template.bind({});
DefaultLabelled.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "Value",
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
};

//checkbox with paragrah as a label
export const Labelled = Template.bind({});
Labelled.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title:
      "In the quiet glow of dawn, the city stirred to life. A gentle breeze carried whispers of possibility through the streets, as if the day itself held secrets waiting to unfold. Birds painted ribbons of melody across the sky, joining the symphony of a waking world. The first rays of sunlight tiptoed over the horizon, casting a warm, golden hue on the buildings and trees below. In this tranquil moment, the promise of a new day hung in the air, inviting everyone to embrace the journey ahead.",
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
};


//checkbox with label before
export const DefaultLabelFirst = Template.bind({});
DefaultLabelFirst.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "Value",
    isLabelFirst:true
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
};

//checkbox with label before
export const LabelFirst = Template.bind({});
LabelFirst.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    isLabelFirst:true,
    title:
      "In the quiet glow of dawn, the city stirred to life. A gentle breeze carried whispers of possibility through the streets, as if the day itself held secrets waiting to unfold. Birds painted ribbons of melody across the sky, joining the symphony of a waking world. The first rays of sunlight tiptoed over the horizon, casting a warm, golden hue on the buildings and trees below. In this tranquil moment, the promise of a new day hung in the air, inviting everyone to embrace the journey ahead.",
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
};

//checkbox disabled
export const DefaultDisabled = Template.bind({});
DefaultDisabled.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "Value",
  },
  formData: {
    ...commonArgs.formData,
    checked: false,
  },
  disabled: true,
};

//checkbox when checked
export const Checked = Template.bind({});
Checked.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "",
  },
  formData: {
    ...commonArgs.formData,
    checked: true,
  },
};

//checkbox labelled and checked
export const CheckedLabelled = Template.bind({});
CheckedLabelled.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "Value",
  },
  formData: {
    ...commonArgs.formData,
    checked: true,
  },
};

//checkbox checked and disabled
export const CheckedDisabled = Template.bind({});
CheckedDisabled.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    title: "Value",
  },
  formData: {
    ...commonArgs.formData,
    checked: true,
  },
  disabled: true,
};

export const FunctionalCheckbox = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <CheckBox
      label={"Label"}
      checked={isChecked}
      onChange={handleCheckboxChange}
    ></CheckBox>
  );
};
