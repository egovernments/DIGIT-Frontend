import React, { useEffect, useState } from "react";
import Button from "../../atoms/Button";
import TextInput from "../../atoms/TextInput";
import Uploader from "../../atoms/Uploader";
import Chip from "../../atoms/Chip";
import {
  Card,
  CheckBox,
  Dropdown,
  LabelFieldPair,
  RadioButtons,
  TextBlock,
} from "../../atoms";

export default {
  title: "Molecules/Card/FormCard",
  component: Card,
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    children: {
      control: "object",
    },
    type: { control: "select", options: ["primary", "secondary"] },
    variant: {
      control: "select",
      options: [
        "empty",
        "form",
        "viewcard",
        "filter1",
        "filter2",
        "menu",
        "kpi",
        "action",
        "search",
      ],
    },
    onClick: {
      control: "function",
    },
    props: {
      control: "object",
    },
  },
};

const Template = (args) => <Card {...args} />;

const tags = ["Dolo 650", "SPAQ  1", "SPAQ 2", "Elbendazol"];

export const ExampleFormCard = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [isSameAsPropertyAddress, setIsSameAsPropertyAddress] = useState(false);

  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });

  const genderOptions = [
    { code: "M", name: "Male" },
    { code: "F", name: "Female" },
    { code: "O", name: "Others" },
  ];

  const guardianOptions = [
    { code: "H", name: "Husband" },
    { code: "F", name: "Father" },
  ];

  const handleGenderSelect = (option) => {
    setSelectedGender(option.code);
  };

  const handleGuardianSelect = (option) => {
    setSelectedGuardian(option.code);
  };

  const handleCheckboxChange = (event) => {
    setIsSameAsPropertyAddress(event.target.checked);
  };

  const textBlockStyle = {
    width: isMobileView ? "100%" : "30%",
  };

  return (
    <Card type={"primary"} variant={"form"}>
      <TextBlock header={"Enter Details"}></TextBlock>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Name"}></TextBlock>
        <TextInput type="text"></TextInput>
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Gender"}></TextBlock>
        <RadioButtons
          options={genderOptions}
          optionsKey="name"
          name="gender"
          selectedOption={selectedGender}
          onSelect={handleGenderSelect}
          style={{ 
            width: "100%", 
            justifyContent: "unset", 
            ...(isMobileView ? {} : { gap: "24px" }) 
          }}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Mobile Number"}></TextBlock>
        <TextInput
          type="text"
          populators={{
            prefix: "+91",
          }}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock
          style={textBlockStyle}
          body={"Alternate Mobile number"}
        ></TextBlock>
        <TextInput
          type="text"
          populators={{
            prefix: "+91",
          }}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Guardian"}></TextBlock>
        <TextInput type="text"></TextInput>
      </LabelFieldPair>
      <RadioButtons
        options={guardianOptions}
        selectedOption={selectedGuardian}
        onSelect={handleGuardianSelect}
        optionsKey="name"
        name="guardian"
        style={{ 
          justifyContent: "unset", 
          ...(isMobileView ? {} : { gap: "24px" }) 
        }}
      />
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Special Category"}></TextBlock>
        <div style={{width:"100%"}}>
        <Dropdown
          option={[
            { code: "1", name: "Below Poverty Line" },
            { code: "2", name: "Above Poverty Line" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "Below Poverty Line" }}
        ></Dropdown>
        </div>

      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Document ID"}></TextBlock>
        <TextInput type="text"></TextInput>
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Document Type"}></TextBlock>
        <div style={{width:"100%"}}>
        <Dropdown
          option={[
            { code: "1", name: "BPL Certificate" },
            { code: "2", name: "CertificateTwo" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "BPL Certificate" }}
        ></Dropdown>
        </div>

      </LabelFieldPair>
      <Uploader
        style={{ marginBottom: "24px" }}
        variant={"uploadFile"}
        multiple={false}
        label={"Choose Document"}
        showLabel={true}
      ></Uploader>
      <LabelFieldPair>
        <TextBlock style={textBlockStyle} body={"Email ID"}></TextBlock>
        <TextInput type="text"></TextInput>
      </LabelFieldPair>
      <LabelFieldPair>
        <TextBlock
          style={textBlockStyle}
          body={"Correspondance Address"}
        ></TextBlock>
        <TextInput type="text"></TextInput>
      </LabelFieldPair>
      <CheckBox
        label={"Same as Property Address"}
        checked={isSameAsPropertyAddress}
        onChange={handleCheckboxChange}
      ></CheckBox>
    </Card>
  );
};

export const SecondaryCardInsidePrimary = () => (
  <Card type={"primary"} variant={"form"}>
    <div
      style={{
        maxWidth: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextBlock header={"Delivery Condition 1"}></TextBlock>
      <Button
        label={"Delete Condition"}
        variation={"teritiary"}
        icon="Delete"
      ></Button>
    </div>
    <Card type="secondary">
      <div
        style={{
          maxWidth: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <TextBlock body={"Attribute"}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <TextBlock body={"Operator"}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <TextBlock body={"Value"}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>
        <Button
          label={"Delete Row"}
          variation={"teritiary"}
          icon="Delete"
          style={{ flexShrink: 0 }}
        ></Button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          label={"Add More Attributes"}
          variation={"secondary"}
          icon="AddNewFill"
          style={{ width: "100%" }}
        ></Button>
      </div>
    </Card>
    <div style={{ display: "flex" }} className="digit-tag-container ">
      {tags.map((tag, index) => (
        <Chip
          key={index}
          text={tag}
          onClick={() => {
            console.log("tag clicked");
          }}
        />
      ))}
    </div>
    <Button
      label={"Add Products To be Delivered"}
      variation={"secondary"}
      icon="AppRegistration"
    ></Button>
  </Card>
);

export const UploaderCard = () => (
  <Card type={"primary"}>
    <div
      style={{
        maxWidth: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextBlock header={"Upload Targets"}></TextBlock>
      <Button
        variation="secondary"
        label={"Download Template"}
        icon={"FileDownload"}
      ></Button>
    </div>
    <div style={{ maxWidth: "100%", width: "100%" }}>
      <TextBlock
        body={
          "Please populate the downloaded template with boundary data and upload the Excel sheet."
        }
      ></TextBlock>
    </div>
    <Uploader
      variant={"uploadPopup"}
      uploadedFiles={[]}
      showDownloadButton={true}
      showReUploadButton={true}
      multiple={false}
    ></Uploader>
  </Card>
);
