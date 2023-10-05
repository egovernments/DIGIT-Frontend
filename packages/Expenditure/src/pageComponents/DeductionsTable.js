import React, { useState,useEffect,useMemo } from 'react'
import { AddIcon, DeleteIcon,TextInput, CardLabelError,Loader,Dropdown, parse } from '@egovernments/digit-ui-react-components'
import { Controller } from 'react-hook-form';
import _ from "lodash"

const DeductionsTable = ({control,watch,...props}) => {
    const PurchaseBillSession = Digit.Hooks.useSessionStorage("PURCHASE_BILL_CREATE",{});
    const [sessionFormData] = PurchaseBillSession;
    const [totalAmount,setTotalAmount] = useState(0)
    const formFieldName = "deductionDetails" // this will be the key under which the data for this table will be present on onFormSubmit
    
    const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.purchase");

      const tenant = Digit.ULBService.getStateId();
      const { isLoading: isHeadCodesLoading, data: HeadCodes } = Digit.Hooks.useCustomMDMS(
        tenant,
        "expense",
        [
          {
            name: "HeadCodes",
          },
        ],
        {
          select: (data) => {
            return data?.expense?.HeadCodes?.filter((row) => row?.category === "deduction" && row?.service === "works.purchase").map(
              (row) => row.code
            );
          },
          enabled:true
        }
      );

    //update deduction table with session data
    const renderDeductionsFromSession = () => {
        if(!sessionFormData?.deductionDetails) {
            return [{
                key: 1,
                isShow: true,
            }];
        }
        let tableState = [];
        for(let i = 1; i<sessionFormData?.deductionDetails?.length; i++) {
          if(sessionFormData?.deductionDetails[i]) {
            tableState.push({
              key: i,
              isShow: true,
          })
          }
        }
        return tableState;
      }
      //const initialState = renderDeductionsFromSession();
      const [rows, setRows] = useState(renderDeductionsFromSession());

    

    const { t, register, errors, setValue, getValues, formData } = props

    const setTotal = (formData) => {
        const tableData = formData?.[formFieldName]


        const result = tableData?.filter((tableRow, idx) => {
        let include = false
        rows?.map((row) => {
          if (row.isShow && row.key === idx) include = true;
        });
        return include;
      })?.reduce((acc, curr) => acc + parseFloat(curr?.amount || 0), 0);

        setTotalAmount((prevState) => {
            return result
        })

    }

    useEffect(() => {
        setTotal(formData)
    }, [formData,rows]);


    const getStyles = (index) => {
        let obj = {}
        switch (index) {
            case 1:
                obj = { "width": "1rem" }
                break;
            case 2:
                obj = { "width": "30%" }
                break;
            case 3:
                obj = { "width": "30%" }
                break;
            case 4:
                obj = { "width": "20%" }
                break;
            case 5:
                obj = { "width": "3%" }
                break;
            default:
                obj = { "width": "92rem" }
                break;
        }
        return obj
    }
    const columns = [t('WORKS_SNO'), t('EXP_DEDUCTION_NAME'), t('EXP_PERCENTAGE_OR_FIXED'),t('WORKS_AMOUNT'), t('WORKS_COMMENTS'), t('WORKS_ACTIONS')]
    const renderHeader = () => {
        return columns?.map((key, index) => {
            return <th key={index} style={getStyles(index+1)} >
                 {" "}
                {key}{" "}
            </th>
        })
    }

    const showDelete = () => {
        let countIsShow = 1
        rows?.map(row => row.isShow && countIsShow++)
        if (countIsShow === 1) {
            return false
        }
        return true
    }
    const removeRow = (row) => {
        //check if only one row is present
        let totalRows = 0;
        for(let keys of Object.keys(formData?.[formFieldName])) {
          totalRows += 1;
        }
        if(totalRows === 1) {
            setValue(`${formFieldName}.${row.key}.name`,undefined)
            setValue(`${formFieldName}.${row.key}.percentage`,``)
            setValue(`${formFieldName}.${row.key}.amount`,``)
            setValue(`${formFieldName}.${row.key}.comments`,``)
        }else {
          //make a new state here which doesn’t have this key
          const updatedState = rows?.map(e => {
          if (e.key === row.key) {
              return {
              key: e.key,
              isShow: false
              }
          }
          return e
          })
          setValue(`${formFieldName}.${row.key}.amount`,0)
          setRows(prev => updatedState)
        }
    }

    const addRow = () => {
        const obj = {
            key: null,
            isShow: true
        }
        obj.key = rows[rows.length - 1].key + 1
        setRows(prev => [...prev, obj])
    }

    const getDropDownDataFromMDMS = (t, row, inputName, props, register, optionKey = "name", options = []) => {
      
        const { isLoading, data } = Digit.Hooks.useCustomMDMS(
            Digit.ULBService.getStateId(),
            options?.mdmsConfig?.moduleName,
            [{ name: options?.mdmsConfig?.masterName }],
            {
                select: (data) => {
                    const optionsData = _.get(data, `${options?.mdmsConfig?.moduleName}.${options?.mdmsConfig?.masterName}`, []);
                    return optionsData.filter((opt) => HeadCodes?.includes(opt?.code) && opt?.active && Digit?.Customizations?.["commonUiConfig"]?.getBusinessService(opt?.service) === businessService).map((opt) => ({ ...opt, name: `${options?.mdmsConfig?.localePrefix}_${opt.code}` }));
                },
                enabled: options?.mdmsConfig ? true : false,
            }
        );
        
        if (isLoading) {
            return <Loader />;
            //show MDMS data if options are not provided. Options are in use here for pre defined options from config. 
            //Usage example : dependent dropdown
        } else {
            //here filter out the options available to select
            let filteredOptions = []
            if(options?.mdmsConfig){
                filteredOptions = data?.filter(row => {
                    return !formData?.[formFieldName]?.some((formRow)=> formRow?.name?.code === row?.code )
                })
            }
            return <Dropdown
            inputRef={register()}
            option={options?.mdmsConfig ? filteredOptions : options}
            selected={props?.value}
            optionKey={optionKey}
            t={t}
            select={(e) => {
                props.onChange(e);
                handleDropdownChange(e, props, row, inputName)
            }}
            onBlur={props?.onBlur}
            optionCardStyles={{ maxHeight: '15rem' }}
            style={{ marginBottom: "0px" }}
        />
        }
    }

    const handleDropdownChange = (e, props, row, inputName) => {

        //here there are multiple cases that we need to handle
        //1-> if autoCalculated field is true, populate the percentage/lumpsum(type field) , amount field and disable both of them
        //2-> if autocal is false,then let user enter the percentage/lumpsum(type field), amount field
        
        if(!e){
          return; 
        }

        if(e.calculationType==="percentage" ){
                //set the percentage field
                //set the amount field
                //disable both the fields
                const amount = formData?.billDetails_billAmt ? parseFloat(Digit.Utils.dss.convertFormatterToNumber(formData?.billDetails_billAmt) * (parseFloat(e.value)/100)).toFixed(1) : 0
                setValue(`deductionDetails.${row.key}.percentage`,`${e.value} ${t("WORKS_PERCENT")}`)
                setValue(`deductionDetails.${row.key}.amount`,amount)

        }else if(e.calculationType === "lumpsum" && e.value !== null){
                //set both lumpsum and amount field
                setValue(`deductionDetails.${row.key}.percentage`, `${t("EXP_FIXED")}`)
                setValue(`deductionDetails.${row.key}.amount`, e.value)
        }
        else {
            setValue(`deductionDetails.${row.key}.percentage`, `${t("EXP_FIXED")}`)
            setValue(`deductionDetails.${row.key}.amount`, '')
        }
    }

    const isInputDisabled = (inputKey) => {
       const value = watch(inputKey)
       if(!!(value?.value)) return true
       else if (!value) return true
       return false
    }

    const cellContainerStyle = { display: "flex", flexDirection: "column" };
  const errorCardStyle = { width: "100%", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const errorContainerStyles = { display: "block", height: "1rem", overflow: "hidden" };
  const renderBody = useMemo(() => {
    let i = 0;
    return rows.map((row, index) => {
      if (row.isShow) i++;
      return  row.isShow &&  (
        <tr key={index} style={!row?.isShow ? {display:'none'}: {}}>
          <td style={getStyles(1)}>{i}</td>

          <td style={getStyles(2)}>
            <div style={cellContainerStyle}>
              <Controller
                control={control}
                name={`${formFieldName}.${row.key}.name`}
                rules={{
                  required: false,
                  pattern: /^[a-zA-Z0-9_ .$@#\/ ]*$/,
                }}
                render={(props) =>
                  getDropDownDataFromMDMS(t, row, "name", props, register, "name", {
                    mdmsConfig: {
                      masterName: "ApplicableCharges",
                      moduleName: "expense",
                      localePrefix: "COMMON_MASTERS_DEDUCTIONS",
                    },
                  })
                }
              />
            </div>
            <div style={errorContainerStyles}>
              {errors && errors?.[formFieldName]?.[row.key]?.name?.type === "pattern" && (
                <CardLabelError style={errorCardStyle}>{t(`WORKS_PATTERN_ERR`)}</CardLabelError>
              )}
              {errors && errors?.[formFieldName]?.[row.key]?.name?.type === "required" && (
                <CardLabelError style={errorCardStyle}>{t(`WORKS_REQUIRED_ERR`)}</CardLabelError>
              )}
            </div>
          </td>

          <td style={getStyles(3)}>
            <div style={cellContainerStyle}>
              <TextInput
                style={{ marginBottom: "0px" }}
                name={`${formFieldName}.${row.key}.percentage`}
                inputRef={register({
                  required: false,
                  pattern: /^[a-zA-Z0-9_ .$%@#\/ ]*$/,
                })}
                // disable={isInputDisabled(`${formFieldName}.${row.key}.name`)}
                disable={true}
              />
            </div>
            <div style={errorContainerStyles}>
              {/* {errors && errors?.[formFieldName]?.[row.key]?.percentage?.type === "pattern" && (
                      <CardLabelError style={errorCardStyle}>{t(`WORKS_PATTERN_ERR`)}</CardLabelError>)}
                  {errors && errors?.[formFieldName]?.[row.key]?.percentage?.type === "required" && (
                      <CardLabelError style={errorCardStyle}>{t(`WORKS_REQUIRED_ERR`)}</CardLabelError>)} */}
            </div>
          </td>

          <td style={getStyles(4)}>
            <div style={cellContainerStyle}>
              <TextInput
                style={{ marginBottom: "0px", textAlign: "right", paddingRight: "1rem" }}
                name={`${formFieldName}.${row.key}.amount`}
                inputRef={register({
                  required: isInputDisabled(`${formFieldName}.${row.key}.name`) ? false : true,
                  // pattern: /^\d*\.?\d*$/,
                  pattern: /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/
                })}
                disable={isInputDisabled(`${formFieldName}.${row.key}.name`)}
              />
            </div>
            <div style={errorContainerStyles}>
              {errors && errors?.[formFieldName]?.[row.key]?.amount?.type === "pattern" && (
                <CardLabelError style={errorCardStyle}>{t(`WORKS_PATTERN_ERR`)}</CardLabelError>
              )}
              {errors && errors?.[formFieldName]?.[row.key]?.amount?.type === "required" && (
                <CardLabelError style={errorCardStyle}>{t(`WORKS_REQUIRED_ERR`)}</CardLabelError>
              )}
            </div>
          </td>
          <td style={getStyles(5)}>
            <div style={cellContainerStyle}>
              <TextInput
                style={{ marginBottom: "0px" }}
                name={`${formFieldName}.${row.key}.comments`}
                inputRef={register({
                  required: false,
                  pattern: /^[a-zA-Z0-9_ .$%@#\/ ]*$/,
                })}
                disable={false}
              />
            </div>
            <div style={errorContainerStyles}>
              {/* {errors && errors?.[formFieldName]?.[row.key]?.percentage?.type === "pattern" && (
                      <CardLabelError style={errorCardStyle}>{t(`WORKS_PATTERN_ERR`)}</CardLabelError>)}
                  {errors && errors?.[formFieldName]?.[row.key]?.percentage?.type === "required" && (
                      <CardLabelError style={errorCardStyle}>{t(`WORKS_REQUIRED_ERR`)}</CardLabelError>)} */}
            </div>
          </td>
          <td style={getStyles(6)}>
            <div style={cellContainerStyle}>
              {(
                <span onClick={() => removeRow(row)} className="icon-wrapper">
                  <DeleteIcon fill={"#B1B4B6"} />
                </span>
              )}
            </div>
            <div style={errorContainerStyles}></div>
          </td>
        </tr>
      
    )
    });
  }, [rows,totalAmount,formData,isHeadCodesLoading])

    if(isHeadCodesLoading && !HeadCodes?.length>0) return <Loader />

    return (
        <table className='table reports-table sub-work-table' style={{ marginTop: "-2rem" }}>
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <tbody>
                {renderBody}
                <tr>
                    <td colSpan={3} style={{textAlign:"right",fontWeight:"600"}}>{t("TOTAL_DEDUCTIONS")}</td>
                    <td colSpan={1}>{Digit.Utils.dss.formatterWithoutRound(totalAmount? totalAmount: 0, 'number')}</td>
                    <td colSpan={1}></td>
                    <td colSpan={1}></td>
                </tr>
                <tr>
                    <td colSpan={6} style={{ "textAlign": "center" }} onClick={addRow}><span><AddIcon fill={"#F47738"} styles={{ "margin": "auto", "display": "inline", "marginTop": "-2px" }} /><label style={{ "marginLeft": "10px", fontWeight: "600", color:" #F47738" }}>{t("WORKS_ADD_DEDUCTION")}</label></span></td>
                </tr>
            </tbody>
        </table>
    )
}

export default DeductionsTable