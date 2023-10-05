import { AddIcon, TextInput, Amount, Button, Dropdown, Loader, DeleteIcon } from "@egovernments/digit-ui-react-components";

import React, { Fragment, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import MeasureCard from "./MeasureCard";

const MeasureTable = (props) => {
  const { register, setValue, arrayProps = {}, config = {} } = props;
  const { key: tableKey, mode } = config;
  const { fields, append, remove } = arrayProps || {};
  const options = {
    masterName: "uom",
    moduleName: "common-masters",
    localePrefix: "ES_COMMON_UOM",
  };
  const setFormValue = useCallback(
    (value) => {
      setValue(tableKey, value);
      setValue(`${tableKey}table`, value);
    },
    [setValue, tableKey]
  );
  const { isLoading, data: UOMData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    options?.moduleName,
    [{ name: options?.masterName }],
    {
      select: (data) => {
        const optionsData = _.get(data, `${options?.moduleName}.${options?.masterName}`, []);
        return optionsData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `${options?.localePrefix}_${opt.code}` }));
      },
      enabled: mode == "CREATEALL",
    }
  );

  const { t } = useTranslation();
  const sum = parseFloat(fields.reduce((acc, row) => acc + parseFloat(row?.amount), 0)?.toFixed?.(2)) || 0;

  // register(tableKey)

  useEffect(() => {
    // console.log("tableKey, fields",tableKey, fields)
    register(tableKey, fields);
    register(`${tableKey}table`, fields);
  }, []);
  const getStyles = (index) => {
    let obj = {};
    switch (index) {
      case 1:
        obj = { width: "1rem" };
        break;
      case 2:
        obj = { width: "30%" };
        break;
      case 3:
        obj = { width: "27rem" };
        break;
      case 4:
        obj = { width: "27rem" };
        break;
      case 5:
        obj = { width: "3%" };
        break;
      default:
        obj = { width: "92rem" };
        break;
    }
    return obj;
  };

  let columns =
    mode == "CREATEALL"
      ? [t("WORKS_SNO"), t("MB_DESCRIPTION"), t("MB_UNIT"), t("MB_RATE"), t("MB_CURRENT_MB_ENTRY"), t("MB_AMOUNT_CURRENT_ENTRY"), t("")]
      : [
          t("WORKS_SNO"),
          t("MB_DESCRIPTION"),
          t("MB_UNIT"),
          t("MB_RATE"),
          t("MB_APPROVER_QUANT"),
          t("MB_CONSUMED_QUANT"),
          t("MB_CURRENT_MB_ENTRY"),
          t("MB_AMOUNT_CURRENT_ENTRY"),
        ];
  const renderHeader = () => {
    return columns?.map((key, index) => {
      return (
        <th key={index} style={getStyles(index + 1)}>
          {" "}
          {key}{" "}
        </th>
      );
    });
  };

  const renderBody = () => {
    // Update the state with the new data
    const handleInputChange = useCallback(
      (key, value, index) => {
        const field = fields[index] || {};
        field[key] = value;
        fields[index] = { ...field };
        setFormValue(fields);
      },
      [setValue, tableKey]
    );
    return fields?.map((row, index) => {
      const consumedQty = row.currentMBEntry;
      const initialState = { tableState: row?.measures };
      const optionsData = UOMData?.map((obj) => ({ code: obj?.code, name: obj?.name }));
      if (isLoading) {
        return <Loader />;
      }
      return (
        <>
          <tr key={index}>
            <td>{index + 1}</td>
            {mode == "CREATEALL" ? (
              <>
                <td>
                  <TextInput
                    style={{ width: "80%", marginTop: "27px", marginLeft: "35px" }}
                    //  {...register(`SOR.${index}.description`)}

                    onChange={(e) => handleInputChange("description", e.target.value, index)}
                    value={row.description}
                  />
                </td>
                <td>
                  <Dropdown
                    // inputRef={register()}
                    option={optionsData}
                    selected={row.uom}
                    optionKey="name"
                    t={t}
                    select={(selectedOption) => handleInputChange("uom", selectedOption, index)}
                    optionCardStyles={{ maxHeight: "15rem" }}
                    style={{ marginBottom: "0px" }}
                  />
                </td>
                <td>
                  <TextInput
                    style={{ width: "80%", marginTop: "20px", marginLeft: "20px" }}
                    onChange={(e) => handleInputChange("unitRate", e.target.value, index)}
                    value={row.unitRate}
                  />
                </td>
              </>
            ) : (
              <>
                <td>{row.description}</td>
                <td>{row.uom}</td>
                <td>
                  <Amount customStyle={{ textAlign: "right" }} value={row?.unitRate?.toFixed?.(2)} t={t} roundOff={false}></Amount>
                </td>
              </>
            )}
            {mode != "CREATEALL" && (
              <>
                <td>
                  <Amount customStyle={{ textAlign: "right" }} value={row?.approvedQuantity?.toFixed?.(2)} t={t} roundOff={false}></Amount>
                </td>
                <td>
                  <Amount customStyle={{ textAlign: "right" }} value={row?.consumedQ?.toFixed?.(2)} t={t} roundOff={false}></Amount>
                </td>
              </>
            )}
            <td>
              <span className="measurement-table-input">
                <TextInput
                  style={{ width: "80%", marginTop: "12px" }}
                  key={row?.id} // important to include key with field's id
                  // {...register(`${tableKey}.${index}.currentMBEntry`)}
                  value={consumedQty}
                  onChange={() => {}}
                  disable={initialState.length > 0 ? "true" : "false"}
                />
                <Button
                  className={"plus-button"}
                  onButtonClick={() => {
                    const measure = {
                      sNo: 0,
                      targetId: 0,
                      isDeduction: false,
                      description: "",
                      id: "",
                      height: 0,
                      width: 0,
                      length: 0,
                      number: 0,
                      noOfunit: 0,
                      rowAmount: 0,
                      consumedRowQuantity: 0,
                    };
                    const measures = fields?.[index]?.measures?.length > 0 ? fields?.[index]?.measures : [measure];
                    fields[index] = { ...fields[index], showMeasure: true, measures: measures };
                    setFormValue(fields);
                  }}
                  label={"+"}
                >
                  <AddIcon className="addIcon" />
                </Button>
              </span>
            </td>

            <td>
              <Amount customStyle={{ textAlign: "right" }} value={row.amount} t={t} roundOff={false}></Amount>
            </td>
            {mode == "CREATEALL" && (
              <td>
                <span className="icon-wrapper" onClick={() => remove(index)}>
                  <DeleteIcon fill={"#B1B4B6"} />
                </span>
              </td>
            )}
          </tr>
          {row?.showMeasure && !initialState.length > 0 && (
            <tr>
              <td colSpan={"1"}></td>
              <td colSpan={mode == "CREATEALL" ? 5 : 7}>
                <MeasureCard
                  columns={[
                    t("WORKS_SNO"),
                    t("MB_IS_DEDUCTION"),
                    t("MB_DESCRIPTION"),
                    t("MB_ONLY_NUMBER"),
                    t("MB_LENGTH"),
                    t("MB_WIDTH"),
                    t("MB_HEIGHT"),
                    t("MB_QUANTITY"),
                  ]}
                  unitRate={row.unitRate}
                  fields={row?.measures || []}
                  register={register}
                  setValue={setFormValue}
                  tableKey={tableKey}
                  tableData={fields}
                  tableIndex={index}
                  mode={mode}
                />
              </td>
            </tr>
          )}
        </>
      );
    });
  };

  return (
    <React.Fragment>
      <table className="table reports-table sub-work-table measurement-table-custom">
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>
          {renderBody()}
          <tr>
            {mode == "CREATEALL" && tableKey == "NONSOR" && (
              <td
                colSpan={6}
                style={{ textAlign: "center" }}
                onClick={() => {
                  append({
                    amount: 0,
                    consumedQ: 0,
                    sNo: fields?.length + 1,
                    currentMBEntry: 0,
                    uom: null,
                    description: "",
                    unitRate: "",
                    contractNumber: "",
                    targetId: "",
                    approvedQuantity: "",
                    measures: [],
                  });
                }}
              >
                <span>
                  <AddIcon fill={"#F47738"} styles={{ margin: "auto", display: "inline", marginTop: "-2px" }} />
                  <label style={{ marginLeft: "10px", fontWeight: "600", color: " #F47738" }}>{t("WORKS_ADD_SOR")}</label>
                </span>
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", margin: "20px" }}>
        <div style={{ display: "flex", flexDirection: "row", fontSize: "1.2rem" }}>
          {/* <span style={{ fontWeight: "bold" }}>`{t("MB_TOTAL")} ${props.config.key} {t("MB_TOTAL_AMOUNT")}`</span> */}
          <span style={{ fontWeight: "bold" }}>
            {t("MB_TOTAL")} {props.config.key} {t("MB_TOTAL_AMOUNT")} :
          </span>
          <span style={{ marginLeft: "3px" }}>
            <Amount customStyle={{ textAlign: "right" }} value={sum?.toFixed?.(2)} t={t} roundOff={false}></Amount>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};
//think more update table should have option to update whole table state similarly card should update back the parent state

export default MeasureTable;