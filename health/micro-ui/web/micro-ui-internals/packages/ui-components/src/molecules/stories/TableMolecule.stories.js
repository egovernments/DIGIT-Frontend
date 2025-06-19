import React from "react";
import TableMolecule from "../TableMolecule";
import { Button } from "../../atoms";
import { Chip } from "../../atoms";
import {Iframe} from "../../atoms";

export default {
  title: "Molecules/Table Molecule",
  component: TableMolecule,
  argTypes: {
    headerData: { control: "array" },
    rows: { control: "array" },
    pagination: { control: "object" },
    styles:{control:"object"},
    tableDetails:{
      control:"object"
    },
    sorting:{
      control:"object"
    },
    selection:{
      control:"object"
    },
    footerProps:{control:"object"},
    frozenColumns: { control: "number" },
    isStickyHeader: { control: "boolean" },
    className:{control:"text"},
    onFilter:{control:"onchange"},
    addFilter:{control:"boolean"},
    onRowClick: { control: "onchange" },
    actionButtonLabel: { control: "text" },
    actions: { control: "array" },
  },
};

const Template = (args) => <TableMolecule {...args} />;

const headerData = [
  { label: "S.No", type: "serialno" },
  { label: "Text", type: "text"},
  { label: "Numeric", type: "numeric" },
  { label: "Description", type: "description" },
  { label: "Tag", type: "tag" },
  { label: "Switch", type: "switch" },
  { label: "Button", type: "button" },
  { label: "Checkbox", type: "checkbox" },
  { label: "TextInput", type: "textinput" },
  { label: "Dropdown", type: "dropdown" },
  { label: "Multiselectdropdown", type: "multiselectdropdown" },
  { label: "Custom", type: "custom" },
];

const headerDataWithDescription = [
  { label: "S.No", description: "Serialno column", type: "serialno" },
  { label: "Text", description: "Text column", type: "text" },
  { label: "Numeric", description: "Numeric column", type: "numeric" },
  {
    label: "Description",
    description: "Description column",
    type: "description",
  },
  { label: "Tag", description: "Tag column", type: "tag" },
  { label: "Switch", description: "Switch column", type: "switch" },
  { label: "Button", description: "Button column", type: "button" },
  { label: "Checkbox", description: "Checkbox column", type: "checkbox" },
  { label: "TextInput", description: "Textinput column", type: "textinput" },
  { label: "Dropdown", description: "Dropdown column", type: "dropdown" },
  {
    label: "Multiselectdropdown",
    description: "Multiselectdropdown column",
    type: "multiselectdropdown",
  },
  { label: "Custom", description: "Custom component column", type: "custom" },
];

const options = [
  { name: "English", code: "English1" },
  { name: "Hindi", code: "Hindi2" },
];

const headerDataForCustomStyles = [
  { label: "S.No", type: "serialno" },
  { label: "Text", type: "text" },
  { label: "Text", type: "text" },
  { label: "Text", type: "text" },
  { label: "Numeric", type: "numeric" },
]
const samplerows = [
  [1, "Row1", "Description1", "Example1", 455666],
  [2, "Row2", "Description2", "Example2", 4553232666],
  [3, "Row3", "Description3", "Example3", 6666],
  [4, "Row4", "Description4", "Example4", 32323],
  [5, "Row5", "Description5", "Example5", 4556266],
  [6, "Row6", "Description6", "Example6", 455333666],
  [7, "Row7", "Description7", "Example7", 455666],
  [8, "Row8", "Description8", "Example8", 343434],
  [9, "Row9", "Description9", "Example9", 400],
  [10, "Row10", "Description10", "Example10", 455666],
];

const headerDataWithAccessors = [
  { label: "S.No", type: "serialno",accessor:"data?.sno"},
  { label: "Text", type: "text",accessor:"data?.text"},
  { label: "Numeric", type: "numeric",accessor:"data?.numeric"},
  { label: "Description", type: "description",accessor:"data?.description"},
];

const rowsWithAccessor = [
  [
    {
      data:{
        sno:1
      }
    },
    {
      data:{
        text:"Label"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
  ],
  [
    {
      data:{
        sno:2
      }
    },
    {
      data:{
        text:"Label2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
  ],
]
const rows = [
  [
    1,
    {
      label:
        "ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    10000,
    {
      label:
        "ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag1",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "success",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch1",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button1",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox1",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link1"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    2,
    {
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    20000,
    {
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag2",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "monochrome",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch2",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button2",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox2",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link2"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    3,
    {
      label:
        "CLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    30000,
    {
      label:
        "CLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag3",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "error",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch3",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button3",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox3",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link3"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    4,
    {
      label:
        "DLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    40000,
    {
      label:
        "DLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag4",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "warning",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch4",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button4",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox4",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link4"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    5,
    {
      label:
        "ELorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    50000,
    {
      label:
        "ELorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag5",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "monochrome",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch5",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button5",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox5",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link5"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    6,
    {
      label:
        "FLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    60000,
    {
      label:
        "FLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag6",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "success",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch6",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button6",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link6"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    7,
    {
      label:
        "GLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    70000,
    {
      label:
        "GLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag7",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "success",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch7",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button7",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox7",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link7"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    8,
    {
      label:
        "HLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    80000,
    {
      label:
        "HLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag8",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "success",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch8",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button8",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox8",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link8"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    9,
    {
      label:
        "ILorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    90000,
    {
      label:
        "ILorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag9",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "error",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch9",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button9",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox9",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link9"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
  [
    10,
    {
      label:
        "JLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    100000,
    {
      label:
        "JLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      icon: "",
      label: "Tag10",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "warning",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    },
    {
      isLabelFirst: false,
      label: "Switch10",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    },
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button10",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    },
    {
      onChange: () => {},
      label: "Checkbox10",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    },
    {
      type: "text",
    },
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    },
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    },
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link10"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>,
  ],
];

const actions = [
  <div
    style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <div className="digit-tag-container" style={{ margin: "0px" }}>
      <Chip text={"Action1"} />
      <Chip text={"Action2"} />
    </div>
    <Button
      variation="primary"
      label={"ButtonAction1"}
      type="button"
      onClick={() => console.log("clicked")}
      size={"medium"}
    />
    <Button
      variation="primary"
      label={"ButtonAction2"}
      type="button"
      onClick={() => console.log("clicked")}
      size={"medium"}
    />
  </div>,
];

const rowsWithNestedTable = [
  [
    {
      data:{
        sno:1
      }
    },
    {
      data:{
        text:"Label"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      nestedData:{
        headerData:headerDataForCustomStyles,
        rows:samplerows,
        tableDetails:{
          tableTitle: "Nested Table Title",
          tableDescription: "Nested Table Description",
          addClose:true
        },
      }
    }
  ],
  [
    {
      data:{
        sno:2
      }
    },
    {
      data:{
        text:"Label2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      nestedData:{
        headerData:headerDataForCustomStyles,
        rows:samplerows,
        tableDetails:{
          tableTitle: "Nested Table Title",
          tableDescription: "Nested Table Description",
          addClose:true
        },
      }
    }
  ],
]

const singlerowWithNestedTable = [
  [
    {
      data:{
        sno:1
      }
    },
    {
      data:{
        text:"Label"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
  ],
  [
    {
      data:{
        sno:2
      }
    },
    {
      data:{
        text:"Label2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    },
    {
      data:{
        numeric:20000
      },
    },
    {
      data:{
        description:"description2"
      },
      label:
        "BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    },
    {
      nestedData:{
        headerData:headerDataForCustomStyles,
        rows:samplerows
      }
    }
  ],
]

const commonArgs = {
  headerData: [],
  rows: [],
  styles:{
    withBorder: false,
    withAlternateBg: false,
    withHeaderDivider: true,
    withColumnDivider: false,
    withRowDivider: true,
    extraStyles: {},
  },
  pagination:{
    initialRowsPerPage:5,
    rowsPerPageOptions:[5,10,15,20],
    manualPagination:false,
    onNextPage:()=>{},
    onPrevPage:()=>{},
    onPageSizeChange:()=>{}
  },
  tableDetails:{
    tableTitle: "",
    tableDescription: "",
  },
  sorting:{
    isTableSortable:false,
    initialSortOrder:"",
    customSortFunction:()=>{}
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: () => {},
    showSelectedState: false,
  },
  footerProps: {
    footerContent: null,
    hideFooter: false,
    stickyFooterContent: null,
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  onRowClick:()=>{},
  actionButtonLabel: "",
  actions:[],
  className:"",
  addFilter:false,
  onFilter:()=>{},
}

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Table Documentation"
  />
);

Documentation.storyName = "Docs";


export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick:undefined,
};

export const HeadersWithDescription = Template.bind({});
HeadersWithDescription.args = {
  ...commonArgs,
  headerData: headerDataWithDescription,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick:undefined
};

export const WithBorder = Template.bind({});
WithBorder.args = {
  headerData: headerData,
  rows: rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:false,
    withRowDivider:false,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithHeaderDivider = Template.bind({});
WithHeaderDivider.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:false,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick: undefined,
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithOnlyColumnDivider = Template.bind({});
WithOnlyColumnDivider.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: true,
    extraStyles: {},
    withHeaderDivider:false,
    withRowDivider:false,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithColumnDividerAndHeaderDivider = Template.bind({});
WithColumnDividerAndHeaderDivider.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: true,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:false,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithRowDivider = Template.bind({});
WithRowDivider.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:false,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithAlternateBg = Template.bind({});
WithAlternateBg.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: true,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:false,
    withRowDivider:false,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithAll = Template.bind({});
WithAll.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    extraStyles: {},
    withBorder:true,
    withHeaderDivider: true,
    withColumnDivider: true,
    withRowDivider: true,
    withAlternateBg:true
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithStickyHeader = Template.bind({});
WithStickyHeader.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  onRowClick: undefined,
  frozenColumns: 0,
  isStickyHeader: true,
};

export const WithStickyFooter = Template.bind({});
WithStickyFooter.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: true,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithStickyFooterAndHeader = Template.bind({});
WithStickyFooterAndHeader.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: true,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: true,
};

export const WithFrozenColumns = Template.bind({});
WithFrozenColumns.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: true,
    extraStyles: {},
    withHeaderDivider:false,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick:undefined,
  frozenColumns:2
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  tableDetails:{
    tableTitle: "Table Title",
    tableDescription: "",
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithTableDescription = Template.bind({});
WithTableDescription.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  tableDetails:{
    tableTitle: "Table Title",
    tableDescription: "Table Description",
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithAddCheckbox = Template.bind({});
WithAddCheckbox.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: true,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithAddCheckboxAndSelectionState = Template.bind({});
WithAddCheckboxAndSelectionState.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: true,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: true,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  actionButtonLabel: "",
};

export const WithAddCheckboxAndSelectionStateAndInitialSelectedRows = Template.bind(
  {}
);
WithAddCheckboxAndSelectionStateAndInitialSelectedRows.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: true,
    checkboxLabel: 'Select All',
    initialSelectedRows: [0,1],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: true,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  actionButtonLabel: "",
};

export const WithAddCheckboxAndSelectionStateAndInitialSelectedRowsWithActions = Template.bind(
  {}
);
WithAddCheckboxAndSelectionStateAndInitialSelectedRowsWithActions.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  tableDetails:{
    tableTitle: "Table Title",
    tableDescription: "Description",
  },
  selection: {
    addCheckbox: true,
    checkboxLabel: 'Select All',
    initialSelectedRows: [0,1],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: true,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  actionButtonLabel: "",
};

export const WithAddCheckboxAndSelectionStateAndCustomActions = Template.bind(
  {}
);
WithAddCheckboxAndSelectionStateAndCustomActions.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  tableDetails:{
    tableTitle: "Table Title",
    tableDescription: "Description",
  },
  selection: {
    addCheckbox: true,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: true,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  actionButtonLabel: "",
  actions:actions
};

export const WithoutFooter = Template.bind({});
WithoutFooter.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },

  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: true,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithDefaultRowsPerPage = Template.bind({});
WithDefaultRowsPerPage.args = {
  headerData: headerData,
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  rows: rows,
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithCustomRowsPerPage = Template.bind({});
WithCustomRowsPerPage.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: null,
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithCustomFooterContent = Template.bind({});
WithCustomFooterContent.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: <div>{"Here you can add any content"}</div>,
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: true,
    isStickyFooter: false,
    addStickyFooter: false,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithStickyFooterContent = Template.bind({});
WithStickyFooterContent.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: false,
    isStickyFooter: true,
    addStickyFooter: true,
  },
};


export const WithScrollableStickyFooterContent = Template.bind({});
WithScrollableStickyFooterContent.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: 
    <tr> 
    <td>GrandTotal</td>
    <td >₹34,000.00</td>
    <td>₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    <td >₹34,000.00</td>
    </tr>,
    scrollableStickyFooterContent: true,
    isStickyFooter: true,
    addStickyFooter: true,
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithOnRowClick = Template.bind({});
WithOnRowClick.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: false,
    isStickyFooter: false,
    addStickyFooter: true,
  },
  onRowClick: (row, index) => {
    console.log(row, index, "this row is clicked");
  },
  frozenColumns: 0,
  isStickyHeader: false,
};

export const WithFilter = Template.bind({});
WithFilter.args = {
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  footerProps: {
    footerContent: null,
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: false,
    isStickyFooter: false,
    addStickyFooter: true,
  },
  frozenColumns: 0,
  isStickyHeader: false,
  onFilter:(e)=>{console.log(e,"filter clicked")},
  addFilter:true
};

export const WithCustomStyles = Template.bind({});
WithCustomStyles.args = {
  headerData:headerDataForCustomStyles,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  styles:{
    withAlternateBg: false,
    withHeaderDivider:true,
    withBorder:true,
    withColumnDivider: false,
    extraStyles:{
      headerStyles:{
        backgroundColor:"#0B4B66",
        color:"#FFFFFF"
      },
      bodyStyles:{
        backgroundColor:"#FFFFFF",
        color:"#0B4B66"
      },
      footerStyles:{
        color:"#363636"
      }
    },
    withRowDivider:true,
  },
  onRowClick: (row, index) => {
    console.log(row, index, "this row is clicked");
  },
  footerProps: {
    footerContent: "Footer Content",
    hideFooter: false,
    stickyFooterContent: "Sticky Footer Content",
    scrollableStickyFooterContent: false,
    isStickyFooter: false,
    addStickyFooter: true,
  },
  rows: samplerows,
  frozenColumns: 0,
  isStickyHeader: false,
};


export const WithAscendingAsInitialSortOrder = Template.bind({});
WithAscendingAsInitialSortOrder.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  sorting:{
    initialSortOrder: "ascending",
    isTableSortable:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick:undefined,
};

export const WithDescendingAsInitialSortOrder = Template.bind({});
WithDescendingAsInitialSortOrder.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  sorting:{
    initialSortOrder: "descending",
    isTableSortable:true,
  },
  onRowClick:undefined,
};

export const WithAccessor = Template.bind({});
WithAccessor.args = {
  ...commonArgs,
  sorting: {
    isTableSortable: false,
  },
  headerData: headerDataWithAccessors,
  rows: rowsWithAccessor,
  pagination: {
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles: {
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider: true,
    withRowDivider: true,
    withBorder: true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: "",
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick: undefined,
};


export const WithNestedTable = Template.bind({});
WithNestedTable.args = {
  ...commonArgs,
  sorting: {
    isTableSortable: false,
  },
  headerData: headerDataWithAccessors,
  rows: rowsWithNestedTable,
  pagination: {
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles: {
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider: true,
    withRowDivider: true,
    withBorder: true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: "",
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick: undefined
};


export const WithOnlyOneRowNestedTable = Template.bind({});
WithOnlyOneRowNestedTable.args = {
  ...commonArgs,
  sorting: {
    isTableSortable: false,
  },
  headerData: headerDataWithAccessors,
  rows: singlerowWithNestedTable,
  pagination: {
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  styles: {
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider: true,
    withRowDivider: true,
    withBorder: true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: "",
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick: undefined
};

export const ManualPagination = Template.bind({});
ManualPagination.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
    manualPagination: true,
    onPageSizeChange:(event)=> { console.log(event)},
    onNextPage:()=>{console.log("onNextPage")},
    onPrevPage:()=>{console.log("onPrevPage")}
  },
  styles:{
    withAlternateBg: false,
    withColumnDivider: false,
    extraStyles: {},
    withHeaderDivider:true,
    withRowDivider:true,
    withBorder:true,
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  onRowClick:undefined,
};

const myCustomSort = (rows, columnIndex) => {
  const middleIndex = Math.floor(rows.length / 2); 
  const firstHalfReversed = [...rows.slice(0, middleIndex)].reverse(); 
  const secondHalf = rows.slice(middleIndex); 
  return [...firstHalfReversed, ...secondHalf];
};


export const WithCustomSortOrder = Template.bind({});
WithCustomSortOrder.args = {
  ...commonArgs,
  headerData: headerData,
  rows:rows,
  pagination:{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [2, 4, 6, 8, 10],
  },
  selection: {
    addCheckbox: false,
    checkboxLabel: 'Select All',
    initialSelectedRows: [],
    onSelectedRowsChange: (e) => {
      console.log("These are the selected rows", e);
    },
    showSelectedState: false,
  },
  sorting:{
    initialSortOrder: "custom",
    isTableSortable:true,
    customSortFunction:myCustomSort
  },
  onRowClick:undefined,
};