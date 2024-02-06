import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { AddIcon, DeleteIcon, RemoveIcon, CardLabelError, Loader } from '@egovernments/digit-ui-react-components'
import {TextInput,Dropdown,CustomDropdown,MultiUploadWrapper} from "@egovernments/digit-ui-components-core"
import { Controller } from 'react-hook-form';
import _ from 'lodash';

//these params depend on what the controller of the associated type is sending.
const SubProjectDetailsTable = ({t, register, control, setValue, onChange, errors, sectionFormCategory, selectedFormCategory}) => {
    const orgSession = Digit.Hooks.useSessionStorage("NEW_PROJECT_CREATE",{});
    const [sessionFormData, setSessionFormData, clearSessionFormData] = orgSession;

    //update sub project table with session data
    const renderSubProjectsFromSession = () => {
        if(!sessionFormData?.withSubProject_project_subProjects) {
            return [{
                key: 1,
                isShow: true,
            }];
        }
        let tableState = [];
        for(let i = 1; i<sessionFormData?.withSubProject_project_subProjects?.length; i++) {
            tableState.push({
                key: i,
                isShow: true,
            })
        }
        return tableState;
    }
    const [rows, setRows] = useState(renderSubProjectsFromSession());
    const columns = [
        {label : t('WORKS_SNO'), isMandatory : false },
        {label : t('WORKS_NAME_OF_SUB_PROJECT'), isMandatory : true },
        {label : t('WORKS_ESTIMATED_AMOUNT'), isMandatory : false },
        {label : t('WORKS_PROJECT_TYPE'), isMandatory : true },
        {label : t('WORKS_SUB_PROJECT_TYPE'), isMandatory : false },
        {label : t('WORKS_WORK_NATURE'), isMandatory : false },
        {label : t('WORKS_PROJECT_START_DATE'), isMandatory : false },
        {label : t('WORKS_PROJECT_END_DATE'), isMandatory : false },
        {label : t('WORKS_MODE_OF_ENTRUSTMENT'), isMandatory : false },
        {label : t('WORKS_WARD'), isMandatory : false },
        {label : t('WORKS_LOCALITY'), isMandatory : false },
        {label : t('ES_COMMON_ULB'), isMandatory : false },
        {label : t('WORKS_GEO_LOCATION'), isMandatory : false },
        {label : t('WORKS_UPLOAD_DOCS'), isMandatory : false },
        {label : t('WORKS_ACTIONS'), isMandatory : false }
    ];
    const [subProjectTypeOfProjectOptions, setSubProjectTypeOfProjectOptions] = useState([]);
    const [subProjectSubTypeOfWorkOptions, setSubProjectSubTypeOfProjectOptions] = useState([]);
    const formFieldName = "withSubProject_project_subProjects"; //keep this name diff from the key in config
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId); 
    const [subProjectDetailsSelectedWard, setSubProjectDetailsSelectedWard] = useState([]);
    const [subProjectDetailsLocalities, setSubProjectDetailsLocalities] = useState([]);
    const { data: cities } = Digit.Hooks.useTenants();
    const getCities = () => cities?.filter((e) => e.code.includes(tenantId)) || [];

    const { isLoading, data : wardsAndLocalities } = Digit.Hooks.useLocation(
        tenantId, 'Ward',
        {
            select: (data) => {
                const wards = []
                const localities = {}
                data?.TenantBoundary[0]?.boundary.forEach((item) => {
                    localities[item?.code] = item?.children.map(item => ({ code: item.code, name: item.name, i18nKey: `${headerLocale}_ADMIN_${item?.code}`, label : item?.label }))
                    wards.push({ code: item.code, name: item.name, i18nKey: `${headerLocale}_ADMIN_${item?.code}` })
                });
               return {
                    wards, localities
               }
            }
        });
        
    useEffect(()=>{
        let filteredSubTypeOfProject = ( subProjectTypeOfProjectOptions && subProjectTypeOfProjectOptions?.projectSubType ) ? (
        subProjectTypeOfProjectOptions?.projectSubType.map(projectSubType=>({code : projectSubType, name : `COMMON_MASTERS_${projectSubType}`}))) : [];
        setSubProjectSubTypeOfProjectOptions(filteredSubTypeOfProject);
    },[subProjectTypeOfProjectOptions]);

    useEffect(()=>{
        setSubProjectDetailsLocalities(wardsAndLocalities?.localities[subProjectDetailsSelectedWard?.code] ? wardsAndLocalities?.localities[subProjectDetailsSelectedWard?.code]: [] );
    },[subProjectDetailsSelectedWard]);

    const getDropDownDataFromMDMS = (t, row, inputName, props, register, optionKey="name", options=[]) => {
        const { isLoading, data } = Digit.Hooks.useCustomMDMS(
                Digit.ULBService.getStateId(),
                options?.mdmsConfig?.moduleName,
                [{ name: options?.mdmsConfig?.masterName }],
                {
                select: (data) => {
                    const optionsData = _.get(data, `${options?.mdmsConfig?.moduleName}.${options?.mdmsConfig?.masterName}`, []);
                    return optionsData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `${options?.mdmsConfig?.localePrefix}_${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
                },
                enabled: options?.mdmsConfig ? true : false,
                }
            );
            if (isLoading) {
                return <Loader />;
                //show MDMS data if options are not provided. Options are in use here for pre defined options from config. 
                //Usage example : dependent dropdown
                } else return <Dropdown
                        inputRef={register()}
                        option={options?.mdmsConfig ? data : options}
                        selected={props?.value}
                        optionKey={optionKey}
                        t={t}
                        select={(e)=>handleDropdownChange(e, props, row, inputName)}
                        onBlur={props?.onBlur}
                        optionCardStyles={{maxHeight : '15rem'}}
                    />
    }

    const handleDropdownChange = (e,props, row, inputName) => {
        if(inputName === "typeOfProject") {
            setValue(`${formFieldName}.${row.key}.subTypeOfProject`, '');
            setSubProjectTypeOfProjectOptions(e);
        }
        if(inputName === "ward") {
            setValue(`${formFieldName}.${row.key}.locality`, '');
            setSubProjectDetailsSelectedWard(e);
        }
        props?.onChange(e);
    }

    const getStyles = (type) => {
        if(type === "upload") {
            return { "minWidth": "20rem" };
        }
        if(type === "SNO") {
            return { "minWidth": "2rem" };
        }
        if(type === "PROJECT_NAME") {
            return { "minWidth": "20rem" };
        }
        if(type === "DATE") {
            return { "minWidth": "20rem" };
        }
        return { "minWidth": "14rem" };
    }

    const renderHeader = () => {
        return columns?.map((column, index) => {
            if(column.label === t("WORKS_ACTIONS") || column.label === t("WORKS_SNO")) {
                return <th key={index} style={getStyles("SNO")} >{column?.label}{column?.isMandatory && '*'} </th>
            }
            if(column.label === t("WORKS_UPLOAD_DOCS")) {
                return <th key={index} style={getStyles()} >{column?.label}{` (${t("WORKS_DOC_UPLOAD_HINT")})`} </th>
            }
            return <th key={index} style={getStyles()} >{column?.label}{column?.isMandatory && '*'} </th>
        })
    }

    const showDelete = () => {
        let countIsShow = 0
        rows.map(row => row.isShow && countIsShow++)
        if (countIsShow === 1) {
            return false
        }
        return true
    }
    const removeRow = (row) => {
        //make a new state here which doesn't have this key
        const updatedState = rows.map(e => {
            if (e.key === row.key) {
                return {
                    key: e.key,
                    isShow: false
                }
            }
            return e
        })

        setRows(prev => updatedState)
    }
    const addRow = () => {
        const obj = {
            key: null,
            isShow: true
        }
        obj.key = rows[rows.length - 1].key + 1
        setRows(prev => [...prev, obj])
    }

    const renderErrorIfAny = (row, name, isErrorForDropdown=false) => {
        switch(name) {
            case "projectName" : {
                return <>
                    {errors && ( errors?.[formFieldName]?.[row.key]?.[name]?.type === "pattern" || errors?.[formFieldName]?.[row.key]?.[name]?.type === "required" ) && (
                        <CardLabelError className={!isErrorForDropdown ? 'projects-subProject-details-error' : 'projects-subProject-details-error dropdown-field'} >{t(`PROJECT_PATTERN_ERR_MSG_PROJECT_NAME`)}</CardLabelError>)}
                </>
            }
            case "endDate" : {
                return <>
                {errors && ( errors?.[formFieldName]?.[row.key]?.[`${name}_custom`]?.type === "custom" || errors?.[formFieldName]?.[row.key]?.[`${name}_custom`]?.type === "pattern" || errors?.[formFieldName]?.[row.key]?.[`${name}_custom`]?.type === "required" ) && (
                    <CardLabelError className={!isErrorForDropdown ? 'projects-subProject-details-error' : 'projects-subProject-details-error dropdown-field'} >{t(`COMMON_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE`)}</CardLabelError>)}
                </>
            }
            default : {
                return <>
                {errors && errors?.[formFieldName]?.[row.key]?.[name]?.type === "pattern" && (
                    <CardLabelError className={!isErrorForDropdown ? 'projects-subProject-details-error' : 'projects-subProject-details-error dropdown-field'} >{t(`WORKS_PATTERN_ERR`)}</CardLabelError>)}
                {errors && errors?.[formFieldName]?.[row.key]?.[name]?.type === "required" && (
                    <CardLabelError className={!isErrorForDropdown ? 'projects-subProject-details-error' : 'projects-subProject-details-error dropdown-field'} >{t(`WORKS_REQUIRED_ERR`)}</CardLabelError>)}
            </>
            }
        }
    }

    const renderBody = () => {
        let i = 0
        return rows.map((row, index) => {
            if (row.isShow) i++
            return row.isShow && <tr key={index} style={{ "height": "50%" }}>
                <td style={getStyles('SNO')}>{i}</td>
                <td style={getStyles('PROJECT_NAME')} >
                    <div className='field' style={{ "width": "100%" }} >
                        <TextInput style={{ "marginBottom": "0px" }} name={`${formFieldName}.${row.key}.projectName`} inputRef={(selectedFormCategory === sectionFormCategory) ? register({required : true, pattern: /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i, minLength: 2}) : register({required : false})}/>
                        {renderErrorIfAny(row, "projectName")}
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <TextInput style={{ "marginBottom": "0px" }} name={`${formFieldName}.${row.key}.estimatedCostInRs`} inputRef={register({required : false})} type="number"/>
                        {renderErrorIfAny(row, "estimatedCostInRs")}
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt' style={{ "width": "100%" }} >
                      <Controller
                        control={control}
                        name={`${formFieldName}.${row.key}.typeOfProject`}
                        rules={(selectedFormCategory === sectionFormCategory) ? {required : true} : {}}
                        render={(props)=>(
                                getDropDownDataFromMDMS(t, row, "typeOfProject" , props, register, "name", { 
                                    mdmsConfig: {
                                        masterName: "ProjectType",
                                        moduleName: "works",
                                        localePrefix: "COMMON_MASTERS",
                                }})
                            )}
                      />
                    {renderErrorIfAny(row, "typeOfProject", true)}
                    </div>
                </td>  
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                    <Controller
                        control={control}
                        name={`${formFieldName}.${row.key}.subTypeOfProject`}
                        rules={{ required: false}}
                        render={(props)=>(
                            getDropDownDataFromMDMS(t, row, "subTypeOfProject", props, register, "name",  subProjectSubTypeOfWorkOptions)
                        )}
                      />
                    {renderErrorIfAny(row, "subTypeOfProject", true)}
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                    <Controller
                        control={control}
                        name={`${formFieldName}.${row.key}.natureOfWork`}
                        rules={{ required: false}}
                        render={(props)=>(
                            getDropDownDataFromMDMS(t, row, "natureOfWork", props, register, "name", { 
                                mdmsConfig: {
                                    masterName: "NatureOfWork",
                                    moduleName: "works",
                                    localePrefix: "COMMON_MASTERS",
                            }})
                        )}
                      />
                    {renderErrorIfAny(row, "natureOfWork", true)}
                    </div>
                </td>
                <td style={getStyles("DATE")}>
                    <div className='field sub-projects-details-field-mt' style={{ "width": "100%" }} >
                    <TextInput
                        type={"date"}
                        name={`${formFieldName}.${row.key}.startDate`}
                        onChange={onChange}
                        inputRef={register({required : false})}
                        style={{paddingRight: "3px"}}
                    />
                    {renderErrorIfAny(row, "startDate")}
                    </div>
                </td>  
                <td style={getStyles("DATE")}>
                    <div className='field sub-projects-details-field-mt' style={{ "width": "100%" }} >
                    <TextInput
                        type={"date"}
                        name={`${formFieldName}.${row.key}.endDate`}
                        onChange={onChange}
                        inputRef={register({required : false})}
                        style={{paddingRight: "3px"}}
                    />
                    {renderErrorIfAny(row, "endDate")}
                    </div>
                </td> 
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                    <Controller
                        control={control}
                        name={`${formFieldName}.${row.key}.recommendedModeOfEntrustment`}
                        rules={{ required: false}}
                        render={(props)=>(
                            getDropDownDataFromMDMS(t, row, "recommendedModeOfEntrustment", props, register, "name", { 
                                mdmsConfig: {
                                    masterName: "EntrustmentMode",
                                    moduleName: "works",
                                    localePrefix: "COMMON_MASTERS",
                            }})
                        )}
                      />
                    {renderErrorIfAny(row, "recommendedModeOfEntrustment", true)}
                    </div>
                </td>   
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                        <Controller
                            control={control}
                            name={`${formFieldName}.${row.key}.ward`}
                            rules={{ required: false}}
                            render={(props)=>(
                                getDropDownDataFromMDMS(t, row, "ward", props, register, "i18nKey", wardsAndLocalities?.wards)
                            )}
                        />
                    {renderErrorIfAny(row, "ward", true)}
                    </div>
                </td> 
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                        <Controller
                            control={control}
                            name={`${formFieldName}.${row.key}.locality`}
                            render={(props)=>(
                                getDropDownDataFromMDMS(t, row, "locality", props, register, "i18nKey", subProjectDetailsLocalities)
                            )}
                        />
                    {renderErrorIfAny(row, "locality", true)}
                    </div>
                </td>  
                <td style={getStyles()}>
                    <div className='field sub-projects-details-field-mt ' style={{ "width": "100%" }} >
                        <Controller
                            control={control}
                            name={`${formFieldName}.${row.key}.ulb`}
                            rules={{ required: false}}
                            render={(props)=>(
                                getDropDownDataFromMDMS(t, row, "ulb", props, register, "i18nKey", getCities())
                            )}
                        />
                    {renderErrorIfAny(row, "ulb", true)}
                    </div>
                </td> 
                <td style={getStyles()} >
                    <div className='field' style={{ "width": "100%" }} >
                        <TextInput style={{ "marginBottom": "0px" }} name={`${formFieldName}.${row.key}.geoLocation`} inputRef={register({required : false})}/>
                        {renderErrorIfAny(row, "geoLocation")}
                    </div>
                </td>
                <td style={getStyles("upload")}>
                    <div className='field' style={{ "width": "100%" }} >
                           <Controller
                                name={`${formFieldName}.${row.key}.uploadedFiles`}
                                control={control}
                                rules={{ required: false}}
                                render={({ onChange, ref, value = [] }) => {
                                function getFileStoreData(filesData) {
                                    const numberOfFiles = filesData.length;
                                    let finalDocumentData = [];
                                    if (numberOfFiles > 0) {
                                    filesData.forEach((value) => {
                                        finalDocumentData.push({
                                        fileName: value?.[0],
                                        fileStoreId: value?.[1]?.fileStoreId?.fileStoreId,
                                        documentType: value?.[1]?.file?.type,
                                        });
                                    });
                                    }
                                    //here we need to update the form the same way as the state of the reducer in multiupload, since Upload component within the multiupload wrapper uses that same format of state so we need to set the form data as well in the same way. Previously we were altering it and updating the formData
                                    onChange(numberOfFiles>0?filesData:[]);
                                }
                                return (
                                    <MultiUploadWrapper
                                        t={t}
                                        module="works"
                                        tenantId={Digit.ULBService.getCurrentTenantId()}
                                        getFormState={getFileStoreData}
                                        setuploadedstate={value}
                                        allowedFileTypesRegex={/(.*?)(pdf|docx|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/i}
                                        allowedMaxSizeInMB={5}
                                        maxFilesAllowed={2}
                                        extraStyleName={""}
                                        customClass={"upload-margin-bottom"}
                                        showHintBelow = {false}
                                    />
                                );
                                }}
                            />
                        {renderErrorIfAny(row, "uploadedFiles")}
                    </div>
                </td> 
                <td style={getStyles('SNO')} >{showDelete() && <span onClick={() => removeRow(row)}><DeleteIcon fill={"#B1B4B6"} style={{ "margin": "auto" }} /></span>}</td>
            </tr>
        })
    }

    return (
        <div className="sub-project-table-wrapper">
            <table className='table reports-table sub-work-table project-details-table'>
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <tbody>
                {renderBody()}
                <tr>
                    <td style={getStyles("SNO")}></td>
                    <td style={{ ...getStyles(2), "textAlign": "center" }} onClick={addRow}><span><AddIcon fill={"#F47738"} styles={{ "margin": "auto", "display": "inline", "marginTop": "-2px" }} /><label style={{ "marginLeft": "10px" }}>{t("WORKS_ADD_ITEM")}</label></span></td>
                    <td style={getStyles()}></td>
                    <td style={getStyles()}></td>
                </tr>
            </tbody>
        </table>
        </div>
    )
}
export default SubProjectDetailsTable;