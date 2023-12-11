import { Header, InboxSearchComposer, Loader, Dropdown, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Config as Configg } from "../../configs/searchMDMSConfig";
import { updateFields, updatedFieldsWithoutSchema, updateConfig, updateConfigWithoutSchema, toDropdownObj } from "../../utils/MDMSSearchUtils";


const MDMSSearchv3 = () => {
    let Config = _.clone(Configg)
    const { t } = useTranslation();
    const history = useHistory();

    let { masterName: modulee, moduleName: master, tenantId } = Digit.Hooks.useQueryParams()

    const [availableSchemas, setAvailableSchemas] = useState([]);
    const [masterName, setMasterName] = useState(null); //for dropdown
    const [moduleName, setModuleName] = useState(null); //for dropdown
    const [masterOptions, setMasterOptions] = useState([])
    const [moduleOptions, setModuleOptions] = useState([])
    const [updatedConfig, setUpdatedConfig] = useState(null)
    tenantId = tenantId || Digit.ULBService.getCurrentTenantId();
    const [schemaFields, setSchemaFields] = useState(null);
    const [currentSchema, setCurrentSchema] = useState(null);

    const SchemaDefCriteria = {
        tenantId: tenantId,
        limit: 100
    }
    if (master && modulee) {
        SchemaDefCriteria.codes = [`${master}.${modulee}`]
    }
    const { isLoading, data: dropdownData } = Digit.Hooks.useCustomAPIHook({
        url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
        params: {

        },
        body: {
            SchemaDefCriteria
        },
        config: {
            select: (data) => {
                function onlyUnique(value, index, array) {
                    return array.indexOf(value) === index;
                }

                //when api is working fine change here(thsese are all schemas available in a tenant)
                // const schemas = sampleSchemaResponse.SchemaDefinitions;
                const schemas = data?.SchemaDefinitions
                setAvailableSchemas(schemas);
                if (schemas?.length === 1) setCurrentSchema(schemas?.[0])
                //now extract moduleNames and master names from this schema
                const obj = {
                    mastersAvailable: [],
                };
                schemas.forEach((schema, idx) => {
                    const { code } = schema;
                    const splittedString = code.split(".");
                    const [master, mod] = splittedString;
                    obj[master] = obj[master]?.length > 0 ? [...obj[master], toDropdownObj(master, mod)] : [toDropdownObj(master, mod)];
                    obj.mastersAvailable.push(master);
                });
                obj.mastersAvailable = obj.mastersAvailable.filter(onlyUnique);
                obj.mastersAvailable = obj.mastersAvailable.map((mas) => toDropdownObj(mas));

                return obj;
            },
        },
    });

    useEffect(() => {
        setMasterOptions(dropdownData?.mastersAvailable)
    }, [dropdownData])

    useEffect(() => {
        setModuleOptions(dropdownData?.[masterName?.name])
    }, [masterName])

    useEffect(() => {
        if (masterName?.name && moduleName?.name) {
            setCurrentSchema(availableSchemas.filter(schema => schema.code === `${masterName?.name}.${moduleName?.name}`)?.[0])
        }
    }, [moduleName])

    useEffect(() => {
        if (schemaFields && currentSchema) {
            const { definition: { properties } } = currentSchema;
            const updatedFields = updateFields(properties, schemaFields, Config, currentSchema);
            var fields = updatedFields?.fields;
            var resultFields = updatedFields?.resultFields;
            var searchAPI = updatedFields?.searchAPI;
            updateConfig(Config, currentSchema, fields, resultFields, searchAPI, masterName, moduleName);
            setUpdatedConfig(Config);
        } else if (currentSchema) {
            const { definition: { properties } } = currentSchema;
            const dropDownOptions = updatedFieldsWithoutSchema(properties, currentSchema);
            updateConfigWithoutSchema(Config, currentSchema, dropDownOptions, masterName, moduleName);
            setUpdatedConfig(Config);
        }
    }, [currentSchema, schemaFields]);

    useEffect(() => {
        const reqCriteria = {
            url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
            params: {},
            body: {
                MdmsCriteria: {
                    tenantId: tenantId,
                    uniqueIdentifiers: [
                        master + "." + modulee
                    ],
                    schemaCode: "Workbench.UISchema"
                },
            },
        };
        Digit.CustomService.getResponse({ ...reqCriteria }).then((result) => {
            if (result.mdms.length > 0) {
                setSchemaFields({ displayFields: result.mdms[0]?.data?.searchResult?.displayFields, searchableFields: result.mdms[0]?.data?.search?.searchableFields, searchAPI: result.mdms[0]?.data?.searchAPI })
            }
        })
    }, [])

    const handleAddMasterData = () => {
        let actionLink = updatedConfig?.actionLink
        if (modulee && master) {
            actionLink = `workbench/mdms-add-v2?moduleName=${master}&masterName=${modulee}`
        }
        history.push(`/${window?.contextPath}/employee/${actionLink}`);
    }

    const onClickRow = ({ original: row }) => {
        const [moduleName, masterName] = row.schemaCode.split(".")
        history.push(`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${row.uniqueIdentifier}`)
    }

    if (isLoading) return <Loader />;
    return (
        <React.Fragment>
            <Header className="digit-form-composer-sub-header">{t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + currentSchema?.code))}</Header>

            {
                updatedConfig && Digit.Utils.didEmployeeHasRole(updatedConfig?.actionRole) &&
                <ActionBar >
                    <SubmitBar disabled={false} className="mdms-add-btn" onSubmit={handleAddMasterData} label={t("WBH_ADD_MDMS")} />
                </ActionBar>
            }
            {updatedConfig && <div className="inbox-search-wrapper">
                <InboxSearchComposer configs={updatedConfig} additionalConfig={{
                    resultsTable: {
                        onClickRow
                    }
                }}></InboxSearchComposer>
            </div>}
        </React.Fragment>
    );
};

export default MDMSSearchv3;
