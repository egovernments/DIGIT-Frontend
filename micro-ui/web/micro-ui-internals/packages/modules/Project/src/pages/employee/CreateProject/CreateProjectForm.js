import { FormComposer, Header, Toast } from "@egovernments/digit-ui-react-components";
import { FormComposerV2 } from "@egovernments/digit-ui-components-core";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import CreateProjectUtils from "../../../utils/createProjectUtils";
import { useHistory } from "react-router-dom";
import debounce from 'lodash/debounce';

const whenHasProjectsHorizontalNavConfig =  [
  {
      name:"Project_Details",
      code:"WORKS_PROJECT_DETAILS",
  },
  {
      name:"Financial_Details",
      code:"WORKS_FINANCIAL_DETAILS",
  }
];

const whenHasSubProjectsHorizontalNavConfig =  [
  {
    name:"Project_Details_In_Sub_Project",
    code:"WORKS_PROJECT_DETAILS",
  },
  {
      name:"Financial_Details_In_Sub_Project",
      code:"WORKS_FINANCIAL_DETAILS",
  },
  {
      name: "Sub_Project_Details_In_Sub_Project",
      code:"WORKS_SUB_PROJECT_DETAILS",
  }
];

const CreateProjectForm = ({t, sessionFormData, setSessionFormData, clearSessionFormData, createProjectConfig, isModify, modify_projectID, modify_projectNumber, modify_addressID, docConfigData}) => {

    const [selectedProjectType, setSelectedProjectType] = useState(createProjectConfig?.defaultValues?.basicDetails_hasSubProjects ? createProjectConfig?.defaultValues?.basicDetails_hasSubProjects : {name : "COMMON_NO", code : "COMMON_NO"});
    const [navTypeConfig, setNavTypeConfig] = useState(whenHasProjectsHorizontalNavConfig);
    const [subTypeOfProjectOptions, setsubTypeOfProjectOptions] = useState([]);
    const [withSubProjectSubSchemeOptions, setWithSubProjectSubSchemeOptions] = useState([]);
    const [noSubProjectSubSchemeOptions, setNoSubProjectSubSchemeOptions] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
    const [currentFormCategory, setCurrentFormCategory] = useState(createProjectConfig?.metaData?.currentFormCategory ? createProjectConfig?.metaData?.currentFormCategory : "project");
    const [showInfoLabel, setShowInfoLabel] = useState(false);
    const [toast, setToast] = useState({show : false, label : "", error : false});
    const history = useHistory();
    const [isEndDateValid, setIsEndDateValid] = useState(true);
    const ULB = Digit.Utils.locale.getCityLocale(tenantId);
    let ULBOptions = []
    ULBOptions.push({code: tenantId, name: t(ULB),  i18nKey: ULB });
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
    const filteredLocalities = wardsAndLocalities?.localities[selectedWard];

    const config = useMemo(
      () => Digit.Utils.preProcessMDMSConfig(t, createProjectConfig, {
        updateDependent : [
          {
            key : 'withSubProject_project_subScheme',
            value : [withSubProjectSubSchemeOptions]
          },
          {
            key : 'noSubProject_subScheme',
            value : [noSubProjectSubSchemeOptions]
          },
          {
            key : 'noSubProject_subTypeOfProject',
            value : [subTypeOfProjectOptions]
          },
          {
            key : 'noSubProject_ulb',
            value : [ULBOptions]
          },
          {
            key : 'noSubProject_ward',
            value : [wardsAndLocalities?.wards]
          },
          {
            key : 'noSubProject_locality',
            value : [filteredLocalities]
          },
          {
            key : "citizenInfoLabel",
            value : [showInfoLabel ? 'project-banner' : 'project-banner display-none']
          },
          {
            key : "noSubProject_endDate",
            value : [!isEndDateValid ? (() => isEndDateValid) : (()=>{})]
          },
          {
            key : "basicDetails_dateOfProposal",
            value : [new Date().toISOString().split("T")[0]]
          },
          {
            key : "basicDetails_projectID",
            value : [!isModify ? "none" : "flex"]
          }
        ]
      }),
      [withSubProjectSubSchemeOptions, noSubProjectSubSchemeOptions, subTypeOfProjectOptions, ULBOptions, wardsAndLocalities, filteredLocalities, showInfoLabel, isEndDateValid]);
      
      const createSubTypesMDMSObject = (subTypesData) => {
      let mdmsData = [];
      for(let subType of subTypesData?.projectSubType) {
        mdmsData.push({code : subType, name : `COMMON_MASTERS_${subType}`});
      }
      return mdmsData;
    }

    // this validation is handled using useform's setError and custom validation type is added. 
    // passing a name which is not associalted to any input will persist the error on submit
    // later on while rendering error, this custom is removed from the name to target the target input element
    const handleErrorForEndDateInSubProjects = (formData, setError, clearErrors, setValue) => {
      if(formData?.withSubProject_project_subProjects) {
        let totalProjects = formData?.withSubProject_project_subProjects.length;
        let subProjects = formData?.withSubProject_project_subProjects;
        for(let index=1; index<=totalProjects; index++) {
          //handle date validation for sub-projects
          if((new Date(subProjects?.[index]?.startDate).getTime()) > (new Date(subProjects?.[index]?.endDate))) {
            setError(`withSubProject_project_subProjects.${index}.endDate_custom`,{ type: "custom" }, { shouldFocus: true });
          }else {
            clearErrors(`withSubProject_project_subProjects.${index}.endDate_custom`);
          }
        }
      }
    }

    const sumTotalEstimatedCost = (sessionFormData, setValue, getValues) => {
      let totalEstimatedCost = 0;
      if(sessionFormData?.withSubProject_project_subProjects) {
        let totalProjects = sessionFormData?.withSubProject_project_subProjects.length;
        let subProjects = sessionFormData?.withSubProject_project_subProjects;
        for(let index=1; index<=totalProjects; index++) {
          if(subProjects[index]?.estimatedCostInRs){
            totalEstimatedCost += Number(getValues(`withSubProject_project_subProjects.${index}.estimatedCostInRs`));
          }
        }
      }
      setValue('withSubProject_project_estimatedCostInRs', totalEstimatedCost);
    }

    const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
      if (!_.isEqual(sessionFormData, formData)) {
        const difference = _.pickBy(sessionFormData, (v, k) => !_.isEqual(formData[k], v));

        //date validation for sub project table
        handleErrorForEndDateInSubProjects(formData, setError, clearErrors, setValue);

        //handle sum of estimated amounts
        sumTotalEstimatedCost(sessionFormData, setValue, getValues);

        if(formData?.basicDetails_hasSubProjects) {
          setSelectedProjectType(formData?.basicDetails_hasSubProjects);
        }
        if(formData.noSubProject_ward) {
            setSelectedWard(formData?.noSubProject_ward?.code)
        }
        if (difference?.noSubProject_ward) {
            setValue("noSubProject_locality", '');
        }
        if(formData?.noSubProject_typeOfProject) {
          let subTypeData = createSubTypesMDMSObject(formData?.noSubProject_typeOfProject);
          setsubTypeOfProjectOptions(subTypeData); 
        } 
        if (difference?.noSubProject_typeOfProject) {
          setValue("noSubProject_subTypeOfProject", '');
        }
        if(formData?.noSubProject_scheme) {
          let subSchemes = formData?.noSubProject_scheme?.subSchemes;
          subSchemes = subSchemes ? subSchemes.map(subScheme => ({ code : `COMMON_MASTERS_${subScheme?.code}`, name : subScheme?.name})) : [];
          setNoSubProjectSubSchemeOptions(subSchemes);
        } 
        if (difference?.noSubProject_scheme) {
          setValue("noSubProject_subScheme", '');
        } 
        if(formData?.withSubProject_project_scheme) {
          let subSchemes = formData?.withSubProject_project_scheme?.subSchemes;
          subSchemes = subSchemes ? subSchemes.map(subScheme => ({ code : `COMMON_MASTERS_${subScheme?.code}`, name : subScheme?.name})) : [];
          setWithSubProjectSubSchemeOptions(subSchemes);
        } 
        if (difference?.withSubProject_project_scheme) {
          setValue("withSubProject_project_subScheme", '');
        }
        setSessionFormData({ ...sessionFormData, ...formData });

        //date validation for project table
        if (difference?.noSubProject_startDate) {
          trigger("noSubProject_endDate", {shouldFocus : true});
        }
        if (difference?.noSubProject_endDate){
          setIsEndDateValid(()=>(new Date(sessionFormData?.noSubProject_startDate).getTime()) < (new Date(formData?.noSubProject_endDate).getTime()));
        }
      }
    }

    const { mutate: CreateProjectMutation } = Digit.Hooks.works.useCreateProject();
    const { mutate: UpdateProjectMutation } = Digit.Hooks.works.useUpdateProject();

    const OnModalSubmit = async (data) => {
      const trimmedData = Digit.Utils.trimStringsInObject(data)
      //Transforming Payload to categories of Basic Details, Projects and Sub-Projects
      const transformedPayload = CreateProjectUtils.payload.transform(trimmedData);

      const modifyParams = {
        modify_projectID,
        modify_projectNumber,
        modify_addressID,
      }

      //Final Payload
      let payload = CreateProjectUtils.payload.create(transformedPayload, selectedProjectType, "", tenantId, docConfigData, modifyParams, createProjectConfig);

      if(!isModify) {
        handleResponseForCreate(payload);
      }else {
        handleResponseForUpdate(payload);
      }
    };

    const debouncedOnModalSubmit = Digit.Utils.debouncing(OnModalSubmit,500);
    const handleResponseForCreate = async (payload) => {
      await CreateProjectMutation(payload, {
        
        onError: async (error, variables) => {
            sendDataToResponsePage("", false, "WORKS_PROJECT_CREATE_FAILURE", false);
        },
        onSuccess: async (responseData, variables) => {
          //for parent with sub-projects send another call for sub-projects array. Add the Parent ID in each sub-project.
          if(selectedProjectType?.code === "COMMON_YES") {
            payload = CreateProjectUtils.payload.create(transformedPayload, selectedProjectType, responseData?.Project[0]?.id, tenantId, docConfigData);
            let parentProjectNumber = responseData?.Project[0]?.projectNumber;
            await CreateProjectMutation(payload, {
              onError :  async (error, variables) => {
                  sendDataToResponsePage("", false, "WORKS_PROJECT_CREATE_FAILURE", false);
              },
              onSuccess: async (responseData, variables) => {
                if(responseData?.ResponseInfo?.Errors) {
                  setToast(()=>({show : true, label : responseData?.ResponseInfo?.Errors?.[0]?.message, error : true}));
                }else if(responseData?.ResponseInfo?.status){
                  sendDataToResponsePage(responseData?.Project?.[0]?.projectNumber, true, "WORKS_PROJECT_CREATED", true);
                  clearSessionFormData();
                }else{
                  setToast(()=>({show : true, label : t("WORKS_ERROR_CREATING_PROJECTS"), error : true}));
                }
              }
            })
          }else{
            if(responseData?.ResponseInfo?.Errors) {
              sendDataToResponsePage("", false, "WORKS_PROJECT_CREATE_FAILURE", false);
            }else if(responseData?.ResponseInfo?.status){
              sendDataToResponsePage(responseData?.Project?.[0]?.projectNumber, true, "WORKS_PROJECT_CREATED", true);
              clearSessionFormData();
            }else{
              sendDataToResponsePage("", false, "WORKS_PROJECT_CREATE_FAILURE", false);
            }
          }
        },
      });
    }

    const handleResponseForUpdate = async (payload) => {
      await UpdateProjectMutation(payload, {
        onError: async (error, variables) => {
            sendDataToResponsePage(modify_projectNumber, false, "WORKS_PROJECT_MODIFICATION_FAILURE", true);
        },
        onSuccess: async (responseData, variables) => {
          //for parent with sub-projects send another call for sub-projects array. Add the Parent ID in each sub-project.
          if(selectedProjectType?.code === "COMMON_YES") {
            payload = CreateProjectUtils.payload.create(transformedPayload, selectedProjectType, responseData?.Project[0]?.id, tenantId, docConfigData);
            let parentProjectNumber = responseData?.Project[0]?.projectNumber;
            await CreateProjectMutation(payload, {
              onError :  async (error, variables) => {
                  sendDataToResponsePage(modify_projectNumber, false, "WORKS_PROJECT_MODIFICATION_FAILURE", true);
              },
              onSuccess: async (responseData, variables) => {
                if(responseData?.ResponseInfo?.Errors) {
                  setToast(()=>({show : true, label : responseData?.ResponseInfo?.Errors?.[0]?.message, error : true}));
                }else if(responseData?.ResponseInfo?.status){
                  sendDataToResponsePage(modify_projectNumber, true, "WORKS_PROJECT_MODIFIED", true);
                  clearSessionFormData();
                }else{
                  setToast(()=>({show : true, label : t("WORKS_ERROR_CREATING_PROJECTS"), error : true}));
                }
              }
            })
          }else{
            if(responseData?.ResponseInfo?.Errors) {
              sendDataToResponsePage(modify_projectNumber, false, "WORKS_PROJECT_MODIFICATION_FAILURE", true);
            }else if(responseData?.ResponseInfo?.status){
              sendDataToResponsePage(modify_projectNumber, true, "WORKS_PROJECT_MODIFIED", true);
              clearSessionFormData();
            }else{
              sendDataToResponsePage(modify_projectNumber, false, "WORKS_PROJECT_MODIFICATION_FAILURE", true);
            }
          }
        },
      });
    }

    const sendDataToResponsePage = (projectNumber, isSuccess, message, showProjectID) => {
      history.push({
        pathname: `/${window?.contextPath}/employee/project/create-project-response`,
        search: `?projectIDs=${projectNumber}&tenantId=${tenantId}&isSuccess=${isSuccess}`,
        state : {
          message : message,
          showProjectID : showProjectID
        }
      }); 
    }

    const handleToastClose = () => {
      setToast({show : false, label : "", error : false});
    }

    //remove Toast after 3s
    useEffect(()=>{
      if(toast?.show) {
        setTimeout(()=>{
          handleToastClose();
        },3000);
      }
    },[toast?.show]);

    useEffect(()=>{
        if(selectedProjectType?.code === "COMMON_YES") {
          setNavTypeConfig(whenHasSubProjectsHorizontalNavConfig);
          setCurrentFormCategory("withSubProject");
          setShowInfoLabel(true);
        }else if(selectedProjectType?.code === "COMMON_NO") {
          setNavTypeConfig(whenHasProjectsHorizontalNavConfig);
          setCurrentFormCategory("noSubProject");
          setShowInfoLabel(false);
        }
    },[selectedProjectType]);

    const handleSubmit = (_data) => {
      // Call the debounced version of onModalSubmit
      debouncedOnModalSubmit(_data);
    };


    return (
        <React.Fragment>
            <Header className="works-header-create">{isModify ? t("COMMON_MODIFY_PROJECT") : t("WORKS_CREATE_PROJECT")}</Header>
          {
            createProjectConfig && (
              <FormComposerV2
                label={!isModify ? "WORKS_CREATE_PROJECT" : "WORKS_MODIFY_PROJECT"}
                config={config?.form?.map((config) => {
                  return {
                    ...config,
                    body: config?.body.filter((a) => !a.hideInEmployee),
                  };
                })}
                onSubmit={handleSubmit}
                submitInForm={false}
                inline={false}
                className="form-no-margin"
                defaultValues={sessionFormData}
                showWrapperContainers={false}
                noBreakLine={true}
                showNavs={config?.metaData?.showNavs}
                showFormInNav={true}
                showMultipleCardsWithoutNavs={false}
                showMultipleCardsInNavs={false}
                horizontalNavConfig={navTypeConfig}
                currentFormCategory={currentFormCategory}
                onFormValueChange={onFormValueChange}
                cardClassName = "mukta-header-card"
            />
           )}
      </React.Fragment>
    )
}

export default CreateProjectForm;