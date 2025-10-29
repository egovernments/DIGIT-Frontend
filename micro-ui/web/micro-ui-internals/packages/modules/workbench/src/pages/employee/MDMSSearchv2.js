import { AddFilled, Button, Header, InboxSearchComposer, Dropdown,SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Config as Configg } from "../../configs/searchMDMSConfig";
import _, { drop } from "lodash";
import { AlertCard, Loader } from "@egovernments/digit-ui-components";
import DownloadMaster from "../../components/DownloadMaster";

const enableBulkDownload = window?.globalConfigs?.getConfig?.("ENABLE_MDMS_BULK_DOWNLOAD")
? window.globalConfigs.getConfig("ENABLE_MDMS_BULK_DOWNLOAD")
: false;

const toDropdownObj = (master = "", mod = "") => {
  return {
    name: mod || master,
    code: Digit.Utils.locale.getTransformedLocale(mod ? `WBH_MDMS_${master}_${mod}` : `WBH_MDMS_MASTER_${master}`),
  };

  // return {
  //   name: mod || master,
  //   code: mod ? `${mod}` : `${master}`,
  // };
};


const MDMSSearchv2 = () => {
  let Config = _.clone(Configg)
  const { t } = useTranslation();
  const history = useHistory();  
  let {masterName:modulee,moduleName:master,tenantId} = Digit.Hooks.useQueryParams()
  let {from, screen, action} = Digit.Hooks.useQueryParams()

  const additionalParams = {
    from: from,
    screen: screen,
    action: action
  }
  
  Object.keys(additionalParams).forEach(key => {
    if (additionalParams[key] === undefined || additionalParams[key] === null) {
      delete additionalParams[key];
    }
  });
  
  const [availableSchemas, setAvailableSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null);
  const [masterName, setMasterName] = useState(null); //for dropdown
  const [moduleName, setModuleName] = useState(null); //for dropdown
  const [masterOptions,setMasterOptions] = useState([])
  const [moduleOptions,setModuleOptions] = useState([])
  const [updatedConfig,setUpdatedConfig] = useState(null)
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();
  const SchemaDefCriteria = {
    tenantId:tenantId ,
    limit:200
  }
  if(master && modulee ) {
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
        if(schemas?.length===1) setCurrentSchema(schemas?.[0])
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
    //here set current schema based on module and master name
    if(masterName?.name && moduleName?.name){
    setCurrentSchema(availableSchemas.filter(schema => schema.code === `${masterName?.name}.${moduleName?.name}`)?.[0])
    }
  }, [moduleName])
  
  useEffect(() => {
    if (currentSchema) {
      let dropDownOptions = [];
      const {
        definition: { properties },
      } = currentSchema;
      const schemaCodeToValidate = `${master}.${modulee}`;
      Object.keys(properties)?.forEach((key) => {
        if (properties[key].type === "string" && !properties[key].format) {
          dropDownOptions.push({
            // name: key,
            name:key,
            code: key,
            i18nKey:Digit.Utils.locale.getTransformedLocale(`${currentSchema.code}_${key}`)
          });
        }
      });
      dropDownOptions =
      dropDownOptions?.length > 0 &&
      Digit?.Customizations?.["commonUiConfig"]?.["SearchMDMSv2Config"]?.[schemaCodeToValidate]?.sortValidDatesFirst(dropDownOptions)
        ? Digit?.Customizations?.["commonUiConfig"]?.["SearchMDMSv2Config"]?.[schemaCodeToValidate]?.sortValidDatesFirst(dropDownOptions)
        : dropDownOptions;
      Config.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
      Config.actionLink=Config.actionLink+`?moduleName=${masterName?.name}&masterName=${moduleName?.name}`;
      // Config.apiDetails.serviceName = `/mdms-v2/v2/_search/${currentSchema.code}`
      
      
      Config.additionalDetails = {
        currentSchemaCode:currentSchema.code
      }
      //set the column config
      
      // Config.sections.searchResult.uiConfig.columns = [{
      //   label: "WBH_UNIQUE_IDENTIFIER",
      //   jsonPath: "uniqueIdentifier",
      //   additionalCustomization:true
      // },...dropDownOptions.map(option => {
      //   return {
      //     label:option.i18nKey,
      //     i18nKey:option.i18nKey,
      //     jsonPath:`data.${option.code}`,
      //     dontShowNA:true
      //   }
      // })]
    
      Config.sections.searchResult.uiConfig.columns = [...dropDownOptions.map(option => {
        return {
          label:option.i18nKey,
          i18nKey:option.i18nKey,
          jsonPath:`data.${option.code}`,
          dontShowNA:true,
          additionalCustomization: currentSchema?.definition?.["x-ui-schema"]?.[option?.name]?.formatType === "EPOC" ? true : false // To show EPOC values in DATE format added customizations, so making additionalCustomization as true
        }
      }),{
        label:"WBH_ISACTIVE",
        i18nKey:"WBH_ISACTIVE",
        jsonPath:`isActive`,
        additionalCustomization:true
        // dontShowNA:true
      }]
      Config.apiDetails.serviceName=`/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`;
      setUpdatedConfig(Config)
    }
  }, [currentSchema]);

  const handleAddMasterData = () => {
    let actionLink=updatedConfig?.actionLink
    const additionalParamString = new URLSearchParams(additionalParams).toString();
    if(modulee&&master){
      actionLink= `workbench/mdms-add-v2?moduleName=${master}&masterName=${modulee}${additionalParamString ? "&"+additionalParamString : ""}`
    }
    history.push(`/${window?.contextPath}/employee/${actionLink}${additionalParamString ? "&"+additionalParamString : ""}`);
  }

  const onClickRow = ({original:row}) => {
    const [moduleName,masterName] = row.schemaCode.split(".")
    const additionalParamString = new URLSearchParams(additionalParams).toString();
    history.push(`/${window.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${row.uniqueIdentifier}${additionalParamString ? "&"+additionalParamString : ""}`)
  }

  if (isLoading) return <Loader page={true} variant={"PageLoader"} />;
  return (
    <React.Fragment>
      <div style={{display:"flex", justifyContent:"space-between"}}>
      <Header className="digit-form-composer-sub-header">{t(Digit.Utils.workbench.getMDMSLabel(`SCHEMA_` + currentSchema?.code))}</Header>
      {enableBulkDownload&&<DownloadMaster />}
      </div>
      {
        updatedConfig && Digit.Utils.didEmployeeHasAtleastOneRole(updatedConfig?.actionRoles) && Digit.Utils.didEmployeeisAllowed(master,modulee) &&
        <ActionBar >
          <SubmitBar disabled={false} className="mdms-add-btn" onSubmit={handleAddMasterData} label={t("WBH_ADD_MDMS")} />
        </ActionBar>
      }
      <AlertCard additionalElements={[]} label={t("WBH_MDMS_INFO")} text={t("WBH_MDMS_INFO_MESSAGE")} variant="default" style={{marginBottom:"1.5rem",maxWidth:"100%"}}/>

      {updatedConfig && <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig} additionalConfig = {{
          resultsTable:{
            onClickRow
          }
        }}></InboxSearchComposer>
      </div>}
    </React.Fragment>
  );
};

export default MDMSSearchv2;
