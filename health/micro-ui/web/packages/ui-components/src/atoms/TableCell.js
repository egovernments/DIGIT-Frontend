import React from "react";
import PropTypes from "prop-types";
import Switch from "./Switch";
import CheckBox from "./CheckBox";
import StringManipulator from "./StringManipulator";
import Tag from "./Tag";
import Button from "./Button";
import TextInput from "./TextInput";
import Dropdown from "./Dropdown";
import MultiSelectDropdown from "./MultiSelectDropdown";

const TableCell = ({
  isHeader,
  isFooter,
  colSpan,
  className,
  columnType,
  cellData,
  children,
  style,
  cellref,
  accessor,
  updateTableData,
  tableData,
  rowIndex,
  cellIndex,
}) => {
  const getValueFromAccessor = (cellData, accessor) => {
    return accessor
      ? accessor
          .split("?.")
          .reduce((acc, key) => (acc ? acc[key] : undefined), cellData)
      : cellData;
  };

  const renderTableCell = () => {
    switch (columnType) {
      case "serialno":
        return accessor ? getValueFromAccessor(cellData, accessor) : cellData;
      case "numeric":
        return accessor ? getValueFromAccessor(cellData, accessor) : cellData;
      case "text":
      case "description": {
        const defaultmaxChars = columnType === "text" ? 64 : 256;
        if (typeof cellData === "object") {
          return (
            <div>
              {StringManipulator(
                "TOSENTENCECASE",
                StringManipulator(
                  "TRUNCATESTRING",
                  accessor
                    ? getValueFromAccessor(cellData, accessor)
                    : cellData?.label,
                  {
                    maxLength: cellData?.maxLength || defaultmaxChars,
                  }
                )
              )}
            </div>
          );
        }
        return cellData;
      }
      case "tag":
        return (
          <Tag
            icon={cellData?.icon}
            label={cellData?.label}
            labelStyle={cellData?.labelStyle}
            showIcon={cellData?.showIcon}
            style={cellData?.style}
            type={cellData?.type}
            className={cellData?.className}
            stroke={cellData?.stroke}
            onClick={cellData?.onClick}
            alignment={cellData?.alignment}
            iconClassName={cellData?.iconClassName}
            iconColor={cellData?.iconColor}
          />
        );
      case "switch":
        return (
          <Switch
            isLabelFirst={cellData?.isLabelFirst}
            label={cellData?.label}
            labelStyle={cellData?.labelStyle}
            shapeOnOff={cellData?.shapeOnOff}
            style={cellData?.style}
            disable={cellData?.disable}
            className={cellData?.className}
            isCheckedInitially={cellData?.isCheckedInitially}
            onToggle={(event) => {
              updateTableData(rowIndex, cellIndex, event);
              if (cellData?.onToggle) {
                cellData.onToggle(event);
              }
            }}
          />
        );
      case "checkbox":
        return (
          <CheckBox
            onChange={(event) => {
              updateTableData(rowIndex, cellIndex, event?.target?.checked);
              if (cellData?.onChange) {
                cellData.onChange(event?.target?.checked);
              }
            }}
            label={cellData?.label}
            value={cellData?.value}
            disabled={cellData?.disabled}
            ref={cellData?.ref}
            checked={tableData?.[rowIndex]?.values?.[cellIndex] || false}
            inputRef={cellData?.inputRef}
            pageType={cellData?.pageType}
            style={cellData?.style}
            index={cellData?.index}
            isLabelFirst={cellData?.isLabelFirst}
            hideLabel={cellData?.hideLabel}
            props={cellData?.props}
            mainClassName={cellData?.mainClassName}
          />
        );
      case "button":
        return (
          <Button
            iconFill={cellData?.iconFill}
            variation={cellData?.variation}
            type={cellData?.type}
            isDisabled={cellData?.isDisabled}
            showBottom={cellData?.showBottom}
            icon={cellData?.icon}
            size={cellData?.size}
            label={cellData?.label}
            ref={cellData?.ref}
            className={cellData?.className}
            submit={cellData?.submit}
            formId={cellData?.formId}
            onClick={cellData?.onClick}
            title={cellData?.title}
            style={cellData?.style}
            isSuffix={cellData?.isSuffix}
            textStyles={cellData?.textStyles}
            hideDefaultActionIcon={cellData?.hideDefaultActionIcon}
            options={cellData?.options}
            isSearchable={cellData?.isSearchable}
            optionsKey={cellData?.optionsKey}
            onSelect={cellData?.onOptionSelect}
            menuStyles={cellData?.menuStyles}
          />
        );
      case "textinput":
        return (
          <TextInput
            {...cellData}
            onChange={(event) => {
              updateTableData(rowIndex, cellIndex, event?.target?.value);
              if (cellData?.onChange) {
                cellData.onChange(event?.target?.value);
              }
            }}
          ></TextInput>
        );
      case "dropdown":
        return (
          <Dropdown
            {...cellData}
            select={(newValue) => {
              updateTableData(rowIndex, cellIndex, newValue);
              if (cellData?.select) {
                cellData.select(newValue);
              }
            }}
          ></Dropdown>
        );
      case "multiselectdropdown":
        return (
          <MultiSelectDropdown
            {...cellData}
            onSelect={(newValue) => {
              updateTableData(rowIndex, cellIndex, newValue);
              if (cellData?.onSelect) {
                cellData.onSelect(newValue);
              }
            }}
          ></MultiSelectDropdown>
        );
      case "custom":
      default:
        return accessor ? getValueFromAccessor(cellData, accessor) : cellData;
    }
  };

  if (isHeader) {
    return (
      <th ref={cellref} colSpan={colSpan} className={className} style={style}>
        {children}
      </th>
    );
  }

  if (isFooter) {
    return (
      <td ref={cellref} colSpan={colSpan} className={className} style={style}>
        {children}
      </td>
    );
  }

  return (
    <td ref={cellref} colSpan={colSpan} className={`${className} ${columnType}`} style={style}>
      {renderTableCell()}
    </td>
  );
};


TableCell.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  isHeader: PropTypes.bool,
  isFooter: PropTypes.bool,
  colSpan: PropTypes.number,
  columnType: PropTypes.string,
  accessor: PropTypes.string,
  cellData: PropTypes.any,
  cellref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  updateTableData: PropTypes.func,
  tableData: PropTypes.array,
  rowIndex: PropTypes.number,
  cellIndex: PropTypes.number,
};

TableCell.defaultProps = {
  className: "",
  style: {},
  children: []
};

export default TableCell;