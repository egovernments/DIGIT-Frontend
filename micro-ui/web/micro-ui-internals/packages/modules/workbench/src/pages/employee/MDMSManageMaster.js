import { AddFilled, Header, Card, CardHeader, CardText, CardSubHeader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Config as Configg } from "../../configs/searchMDMSConfig";
import _, { drop } from "lodash";
import { Loader ,Button} from "@egovernments/digit-ui-components";



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
  const history = useHistory();
  
  let {masterName:modulee,moduleName:master,tenantId} = Digit.Hooks.useQueryParams()
  
  const [availableSchemas, setAvailableSchemas] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [masterOptions,setMasterOptions] = useState([])
  const [moduleOptions,setModuleOptions] = useState([])
  const [showModules, setShowModules] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();
  const SchemaDefCriteria = {
    tenantId:tenantId ,
    limit:500
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
        schemas.forEach((schema) => {
          const { code } = schema;
          const splittedString = code.split(".");
          const [master, mod] = splittedString;
          obj[master] = obj[master]?.length > 0 ? [...obj[master], toDropdownObj(master, mod)] : [toDropdownObj(master, mod)];
          obj.mastersAvailable.push(master);
        });
        
        obj.mastersAvailable = obj.mastersAvailable.filter(onlyUnique)
        obj.mastersAvailable = obj.mastersAvailable.map((mas) => toDropdownObj(mas));
        //sorting based on localised value
        obj.mastersAvailable = sortByKey(obj.mastersAvailable,'translatedValue')
        return obj;
      },
    },
  });


  useEffect(() => {
    setMasterOptions(dropdownData?.mastersAvailable)
    if(master && modulee) {
      setSelectedModule(dropdownData?.mastersAvailable?.find(m => m.name === master))
      setModuleOptions(sortByKey(dropdownData?.[master],'translatedValue'))
      setShowModules(false)
    }
  }, [dropdownData])

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
    setModuleOptions(sortByKey(dropdownData?.[module.name],'translatedValue'))
    setShowModules(false)
  }

  const handleMasterSelect = (master) => {
    history.push(`/${window?.contextPath}/employee/workbench/mdms-search-v2?moduleName=${selectedModule.name}&masterName=${master.name}`)
  }

  const handleBackToModules = () => {
    setSelectedModule(null)
    setModuleOptions([])
    setShowModules(true)
    setSearchQuery("")
  }

  // Filter logic for modules and masters
  const filteredModules = useMemo(() => {
    if (!searchQuery) return masterOptions
    return masterOptions?.filter(module => 
      (module.translatedValue || module.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  }, [masterOptions, searchQuery])

  const filteredMasters = useMemo(() => {
    if (!searchQuery) return moduleOptions
    return moduleOptions?.filter(master => 
      (master.translatedValue || master.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  }, [moduleOptions, searchQuery])
  
  // useEffect(() => {
  //   if (currentSchema) {
  //     const dropDownOptions = [];
  //     const {
  //       definition: { properties },
  //     } = currentSchema;
      
  //     Object.keys(properties)?.forEach((key) => {
  //       if (properties[key].type === "string" && !properties[key].format) {
  //         dropDownOptions.push({
  //           // name: key,
  //           name:key,
  //           code: key,
  //           i18nKey:Digit.Utils.locale.getTransformedLocale(`${currentSchema.code}_${key}`)
  //         });
  //       }
  //     });

  //     Config.sections.search.uiConfig.fields[0].populators.options = dropDownOptions;
  //     Config.actionLink=Config.actionLink+`?moduleName=${masterName?.name}&masterName=${moduleName?.name}`;
  //     // Config.apiDetails.serviceName = `/mdms-v2/v2/_search/${currentSchema.code}`
      
      
  //     Config.additionalDetails = {
  //       currentSchemaCode:currentSchema.code
  //     }
  //     //set the column config
      
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
        {showModules ? (
          <div className="module-cards-container">
            <div className="module-cards-header">
              <CardHeader>{t("WBH_SELECT_MODULE")}</CardHeader>
              <div className="mdms-search-bar-container">
                <TextInput
                  type="text"
                  placeholder={t("WBH_SEARCH_MODULES")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mdms-search-input"
                  style={{ marginTop: "1rem" }}
                />
              </div>
            </div>
            <div className="module-cards-grid">
              {filteredModules?.length > 0 ? (
                filteredModules.map((module, index) => (
                <Card 
                  key={index} 
                  className="module-card clickable"
                  onClick={() => handleModuleSelect(module)}
                >
                  <CardSubHeader className="employee-card-sub-header">
                    {module?.translatedValue?.startsWith("WBH_MDMS_") ? module?.name : module?.translatedValue}
                  </CardSubHeader>
                  <CardText>
                    {t("WBH_CLICK_TO_VIEW_MASTERS")}
                  </CardText>
                </Card>
                ))
              ) : (
                <div className="no-results-message">
                  <CardText>{t("WBH_NO_MODULES_FOUND")}</CardText>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="master-details-container">
              <Button 
                type="button" 
                label={t("WBH_BACK_TO_MODULES")}
                variation={"secondary"}
                onClick={handleBackToModules}
                style={{marginBottom: "1rem"}}
              />
            <div className="master-details-header">
            
              <CardHeader>{selectedModule?.translatedValue || selectedModule?.name} - {t("WBH_MASTERS")}</CardHeader>
              <div className="mdms-search-bar-container">
                <TextInput
                  type="text"
                  placeholder={t("WBH_SEARCH_MASTERS")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mdms-search-input"
                  style={{ marginTop: "1rem" }}
                />
              </div>
            </div>
            <div className="master-cards-grid">
              {filteredMasters?.length > 0 ? (
                filteredMasters.map((master, index) => (
                <Card 
                  key={index} 
                  className="master-card clickable"
                  onClick={() => handleMasterSelect(master)}
                >
                  <CardSubHeader className="employee-card-sub-header">
                    {master?.translatedValue?.startsWith("WBH_MDMS_") ? master?.name : master?.translatedValue}
                  </CardSubHeader>
                  <CardText>
                    {t("WBH_CLICK_TO_MANAGE")}
                  </CardText>
                </Card>
                ))
              ) : (
                <div className="no-results-message">
                  <CardText>{t("WBH_NO_MASTERS_FOUND")}</CardText>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default MDMSManageMaster;
