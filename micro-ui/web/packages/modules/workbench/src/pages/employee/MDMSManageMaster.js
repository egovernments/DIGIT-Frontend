import { AddFilled, Button, Header, InboxSearchComposer, Dropdown, Card } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Config as Configg } from "../../configs/searchMDMSConfig";
import _, { drop } from "lodash";
import { Loader } from "@egovernments/digit-ui-components";

function sortByKey(arr, key) {
  return arr.slice().sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });
}

const MDMSManageMaster = () => {
  let Config = _.clone(Configg)
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  let {masterName:modulee,moduleName:master,tenantId} = Digit.Hooks.useQueryParams()
  
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

  const toDropdownObj = (master = "", mod = "") => {
    return {
      name: mod || master,
      code: Digit.Utils.locale.getTransformedLocale(mod ? `WBH_MDMS_${master}_${mod}` : `WBH_MDMS_MASTER_${master}`),
      translatedValue:t(Digit.Utils.locale.getTransformedLocale(mod ? `WBH_MDMS_${master}_${mod}` : `WBH_MDMS_MASTER_${master}`))
    };
  };

  const { isLoading, data: apiData } = Digit.Hooks.useCustomAPIHook({
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria
    },
    config: {
      select: (data) => {
        function onlyUnique(value, index, array) {
          return array.indexOf(value) === index;
        }
        
        const schemas = data?.SchemaDefinitions || [];
        
        // Process the data without setting state
        const obj = {
          mastersAvailable: [],
          schemas: schemas // Include schemas in the returned data
        };
        
        schemas.forEach((schema, idx) => {
          const { code } = schema;
          const splittedString = code.split(".");
          const [master, mod] = splittedString;
          obj[master] = obj[master]?.length > 0 ? [...obj[master], toDropdownObj(master, mod)] : [toDropdownObj(master, mod)];
          obj.mastersAvailable.push(master);
        });
        
        obj.mastersAvailable = obj.mastersAvailable.filter(onlyUnique)
        obj.mastersAvailable = obj.mastersAvailable.map((mas) => toDropdownObj(mas));
        obj.mastersAvailable = sortByKey(obj.mastersAvailable,'translatedValue')
        
        return obj;
      },
    },
  });

  // Extract schemas from apiData (outside of select function)
  const availableSchemas = useMemo(() => apiData?.schemas || [], [apiData]);
  const dropdownData = useMemo(() => {
    const { schemas, ...rest } = apiData || {};
    return rest;
  }, [apiData]);

  // Set currentSchema when there's only one schema
  useEffect(() => {
    if(availableSchemas?.length === 1 && !currentSchema) {
      setCurrentSchema(availableSchemas[0]);
    }
  }, [availableSchemas]);

  useEffect(() => {
    setMasterOptions(dropdownData?.mastersAvailable)
  }, [dropdownData])

  useEffect(() => {
    if(dropdownData?.[masterName?.name]?.length>0){
      setModuleOptions(sortByKey(dropdownData?.[masterName?.name],'translatedValue'))
    }
  }, [masterName, dropdownData])

  // Handle navigation and schema update
  const handleModuleSelection = (e) => {
    setModuleName(e);
    
    if(masterName?.name && e?.name){
      // Update current schema
      const newSchema = availableSchemas.find(schema => schema.code === `${masterName.name}.${e.name}`);
      if (newSchema) {
        setCurrentSchema(newSchema);
      }
      
      // Navigate only if URL params are different
      const currentMaster = new URLSearchParams(window.location.search).get('moduleName');
      const currentModule = new URLSearchParams(window.location.search).get('masterName');
      
      if (currentMaster !== masterName.name || currentModule !== e.name) {
        navigate(`/${window?.contextPath}/employee/workbench/mdms-search-v2?moduleName=${masterName.name}&masterName=${e.name}`);
      }
    }
  };

  // Uncomment and update this when needed
  // useEffect(() => {
  //   if (currentSchema) {
  //     const dropDownOptions = [];
  //     const {
  //       definition: { properties },
  //     } = currentSchema;
      
  //     Object.keys(properties)?.forEach((key) => {
  //       if (properties[key].type === "string" && !properties[key].format) {
  //         dropDownOptions.push({
  //           name:key,
  //           code: key,
  //           i18nKey:Digit.Utils.locale.getTransformedLocale(`${currentSchema.code}_${key}`)
  //         });
  //       }
  //     });

  //     Config.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
  //     Config.actionLink=Config.actionLink+`?moduleName=${masterName?.name}&masterName=${moduleName?.name}`;
      
  //     Config.additionalDetails = {
  //       currentSchemaCode:currentSchema.code
  //     }
      
  //     Config.sections.searchResult.uiConfig.columns = [{
  //       label: "WBH_UNIQUE_IDENTIFIER",
  //       jsonPath: "uniqueIdentifier",
  //       additionalCustomization:true
  //     },...dropDownOptions.map(option => {
  //       return {
  //         label:option.i18nKey,
  //         i18nKey:option.i18nKey,
  //         jsonPath:`data.${option.code}`,
  //         dontShowNA:true
  //       }
  //     })]

  //     setUpdatedConfig(Config)
  //   }
  // }, [currentSchema]);

  if (isLoading) return <Loader page={true} variant={"PageLoader"} />;
  
  return (
    <React.Fragment>
      <Header className="works-header-search">{t(Config?.label)}</Header>
      <div className="jk-header-btn-wrapper">
        <Card className="manage-master-wrapper">
          <Dropdown
            option={masterOptions}
            className={"form-field wbh-mdms-module-name"}
            optionKey="code"
            selected={master && modulee ? toDropdownObj(master) : masterName}
            select={(e) => {
              setMasterName(e);
              setModuleName(null)
              setUpdatedConfig(null)
            }}
            t={t}
            placeholder={t("WBH_MODULE_NAME")}
            disable={master ? true : false}
          />
          <Dropdown
            option={moduleOptions}
            style={{marginRight:"auto" }}
            className={"form-field wbh-mdms-master-name"}
            optionKey="code"
            selected={master && modulee ? toDropdownObj(master,modulee) : moduleName}
            select={handleModuleSelection}
            t={t}
            placeholder={t("WBH_MASTER_NAME")}
            disable={modulee ? true : false}
          />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default MDMSManageMaster;