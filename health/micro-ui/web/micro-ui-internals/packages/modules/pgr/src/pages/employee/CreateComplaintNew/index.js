import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
// import createWorkOrderConfigMUKTA from "../../../configs/createWorkOrderConfigMUKTA.json";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import CreateComplaintForm from "./createComplaintForm";
import { CreateComplaintConfig } from "../../../configs/CreateComplaintConfig";

const CreateComplaintNew = () => {
    const {t} = useTranslation();
    const queryStrings = Digit.Hooks.useQueryParams();
    const isModify = queryStrings?.workOrderNumber ? true : false;
    const [estimateNumber, setEsimateNumber] = useState(queryStrings?.estimateNumber ? queryStrings?.estimateNumber : "");
    const contractNumber = queryStrings?.workOrderNumber;
    const tenantId = queryStrings?.tenantId;
    const stateTenant = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState([]);
    const [officerInCharge, setOfficerInCharge] = useState([]);
    const [nameOfCBO, setNameOfCBO] = useState([]);
    const [isFormReady, setIsFormReady] = useState(false);
    const tenant = Digit.ULBService.getStateId();

    // const { isLoadin: isDocConfigLoading, data : docConfigData } = Digit.Hooks.useCustomMDMS(
    //     tenant,
    //     "works",
    //     [
    //         {
    //             "name": "DocumentConfig",
    //             "filter": `[?(@.module=='Work Order')]`
    //         }
    //     ]
    // );

    // const { isLoading : isConfigLoading, data : createWorkOrderConfigMUKTA} = Digit.Hooks.useCustomMDMS( //change to data
    // stateTenant,
    // Digit.Utils.getConfigModuleName(),
    // [
    //     {
    //         "name": "CreateComplaintConfig"
    //     }
    // ],
    // {
    //   select: (data) => {
    //       return data?.[Digit.Utils.getConfigModuleName()]?.CreateComplaintConfig[0];
    //   },
    // }
    // );

    // const configs = createWorkOrderConfigMUKTA?.CreateWorkOrderConfig[0];

    //fetching contract data -- modify
    // const { isLoading: isContractLoading,data:contract } = Digit.Hooks.contracts.useContractSearch({
    //     tenantId,
    //     filters: { contractNumber, tenantId },
    //     config:{
    //         enabled: isModify,
    //         cacheTime : 0
    //     }
    // })

    // useEffect(()=>{
    //     //if session WO# is diff from queryString WO#, reset sessionFormData
    //     if(sessionFormData?.basicDetails_workOrdernumber !== queryStrings?.workOrderNumber) {
    //         clearSessionFormData();
    //     }
    // },[])

    // useEffect(()=>{
    //     if(!isContractLoading && isModify) {
    //         setEsimateNumber(contract?.additionalDetails?.estimateNumber)
    //     }
    // },[contract])

    //fetching estimate data
    // const { isLoading: isEstimateLoading,data:estimate } = Digit.Hooks.estimates.useEstimateSearch({
    //     tenantId,
    //     filters: { estimateNumber },
    //     config:{
    //         enabled: !!(estimateNumber)
    //     }
    // })

    // //fetching project data
    // const { isLoading: isProjectLoading, data: project } = Digit.Hooks.project.useProjectSearch({
    //     tenantId,
    //     searchParams: {
    //         Projects: [
    //             {
    //                 tenantId,
    //                 id:estimate?.projectId
    //             }
    //         ]
    //     },
    //     config:{
    //         enabled: !!(estimate?.projectId) 
    //     }
    // })

    const CreateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_CREATE", {});
    const [sessionFormData, setSessionFormData, clearSessionFormData] = CreateComplaintSession;



    

    // useEffect(()=>{
    //     if((estimate && project && createWorkOrderConfigMUKTA && !isLoadingHrmsSearch && !isOrgSearchLoading && !isOverHeadsMasterDataLoading && !isContractLoading && !isDocConfigLoading)) {
    //         updateDefaultValues({ createWorkOrderConfigMUKTA, isModify, sessionFormData, setSessionFormData, contract, estimate, project, handleWorkOrderAmount, overHeadMasterData, createNameOfCBOObject, organisationOptions, createOfficerInChargeObject, assigneeOptions, roleOfCBO, docConfigData});

    //         setDocuments(createDocumentObject(estimate?.additionalDetails?.documents));
    //         setOfficerInCharge(createOfficerInChargeObject(assigneeOptions));
    //         setNameOfCBO(createNameOfCBOObject(organisationOptions));

    //         setIsFormReady(true);
    //     }
    // },[isConfigLoading, isEstimateLoading, isProjectLoading, isLoadingHrmsSearch, isOrgSearchLoading, isOverHeadsMasterDataLoading, isContractLoading, estimate, isRoleOfCBOLoading, isDocConfigLoading]);

    // if(isConfigLoading) return <Loader></Loader>
    return (
        <React.Fragment>
            {
                <CreateComplaintForm t={t} createComplaintConfig={CreateComplaintConfig} sessionFormData={sessionFormData} setSessionFormData={setSessionFormData} clearSessionFormData={clearSessionFormData} tenantId={tenant}  preProcessData={{}}></CreateComplaintForm>
            }
        </React.Fragment>
    )
}

export default CreateComplaintNew;