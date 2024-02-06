import { Loader, ProjectIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import CreateProjectForm from "./CreateProjectForm";
import { createProjectConfigMUKTA } from "../../../configs/createProjectConfigMUKTA";
// import { updateDefaultValues } from "../../../utils/modifyProjectUtils";

const CreateProject = () => {
    const {t} = useTranslation();
    const stateTenant = Digit.ULBService.getStateId();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const ULB = Digit.Utils.locale.getCityLocale(tenantId);
    const [isFormReady, setIsFormReady] = useState(false);
    const queryStrings = Digit.Hooks.useQueryParams();
    const isModify = queryStrings?.projectNumber ? true : false;
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
    let ULBOptions = []
    ULBOptions.push({code: tenantId, name: t(ULB),  i18nKey: ULB });

    const tenant = Digit.ULBService.getStateId();

    const { isLoadin: isDocConfigLoading, data : docConfigData } = Digit.Hooks.useCustomMDMS(
        tenant,
        "works",
        [
            {
                "name": "DocumentConfig",
                "filter": `[?(@.module=='Project')]`
            }
        ]
    );

    const searchParams = {
      Projects : [
          {
              tenantId : queryStrings?.tenantId || tenantId,
              projectNumber : queryStrings?.projectNumber
          }
      ]
    }

    const filters = {
      limit : 11,
      offset : 0,
      includeAncestors : true,
      includeDescendants : true
    }

    const findCurrentDate = () => {
      var date = new Date();
      var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
      return dateString;
    } 

    //Fetch Project details for modify flow
    const { isLoading: isProjectLoading, data: project } = Digit.Hooks.project.useProjectSearch({
      tenantId,
      searchParams: {
        Projects : [
            {
                tenantId : queryStrings?.tenantId || tenantId,
                projectNumber : queryStrings?.projectNumber
            }
        ]
      },
      config:{
          enabled: isModify,
          cacheTime:0
      }
    })

    // const { isLoading, data : configs} = Digit.Hooks.useCustomMDMS( //change to data
    //   stateTenant,
    //   Digit.Utils.getConfigModuleName(),
    //   [
    //       {
    //           "name": "CreateProjectConfig"
    //       }
    //   ],
    //   {
    //     select: (data) => {
    //         return data?.[Digit.Utils.getConfigModuleName()]?.CreateProjectConfig[0];
    //     },
    //   }
    // );

    // Use this only while Development - 
    const configs = createProjectConfigMUKTA?.CreateProjectConfig[0];

    const projectSession = Digit.Hooks.useSessionStorage("NEW_PROJECT_CREATE", 
      {}
    );

    const [sessionFormData, setSessionFormData, clearSessionFormData] = projectSession;

    useEffect(()=>{
      //if session project# is diff from queryString project#, reset sessionFormData
      if(sessionFormData?.basicDetails_projectID !== queryStrings?.projectNumber) {
        clearSessionFormData();
      }
    },[])

    useEffect(()=>{
      if(configs && !isProjectLoading && !isDocConfigLoading) {
         // updateDefaultValues({ configs, isModify, sessionFormData, setSessionFormData, findCurrentDate, ULBOptions, project, headerLocale, docConfigData })
        setIsFormReady(true);
      }
    },[configs, isProjectLoading, isDocConfigLoading]);

    // if(isLoading) return <Loader />
    return (
      <React.Fragment>
        {isFormReady && 
          <CreateProjectForm t={t} sessionFormData={sessionFormData} setSessionFormData={setSessionFormData} clearSessionFormData={clearSessionFormData} createProjectConfig={configs} isModify={isModify} modify_projectID={project?.id} modify_projectNumber={queryStrings?.projectNumber} modify_addressID={project?.address?.id} docConfigData={docConfigData}></CreateProjectForm>
        }
        </React.Fragment>
    )
}

export default CreateProject;
