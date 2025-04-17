// import cloneDeep from "lodash/cloneDeep";
import _ from "lodash";
import { format } from "date-fns";
// import HrmsService from "../../elements/HRMS";
// import { convertEpochToDate } from "../../../utils/pt";

export const WorksSearch = {
    searchEstimate: async (tenantId="pb.jalandhar", filters = {} ) => {
        
        //dymmy response
        //const response = sampleEstimateSearchResponse
        //actual response

        //,
        const response = await Digit.CustomService.getResponse({ url:'/estimate/v1/_search', params:{tenantId,...filters} });
        return response?.estimates
    },
     
   
    viewEstimateScreen: async (t, tenantId, estimateNumber) => {
        const estimateArr = await WorksSearch?.searchEstimate(tenantId, { estimateNumber })
        const estimate = estimateArr?.[0]
        
        const sample = {
          title:" ",
          asSectionHeader: true,
          values: [
            { title: "JAGAN", value: estimate?.tenantId },// added a different view screen
            { title: "EVENTS_NAME_LABEL", value: estimate?.name },
            { title: "EVENTS_CATEGORY_LABEL", value: estimate?.wfStatus },
            { title: "EVENTS_DESCRIPTION_LABEL", value: estimate?.id },
            { title: "EVENTS_FROM_DATE_LABEL", value: format(new Date(estimate?.auditDetails?.createdTime), 'dd/MM/yyyy') },
            { title: "EVENTS_TO_DATE_LABEL", value: format(new Date(estimate?.auditDetails?.createdTime), 'dd/MM/yyyy') },
            { title: "EVENTS_FROM_TIME_LABEL", value: format(new Date(estimate?.auditDetails?.lastModifiedTime), 'hh:mm'), skip: true },
            { title: "EVENTS_TO_TIME_LABEL", value: format(new Date(estimate?.auditDetails?.lastModifiedTime), 'hh:mm'), skip: true },
            { title: "EVENTS_ADDRESS_LABEL", value: estimate?.additionalDetails?.ward },
            { title: "EVENTS_MAP_LABEL",
              map: true,
              value: 'N/A' 
            },
            { title: "EVENTS_ORGANIZER_NAME_LABEL", value: estimate?.estimateNumber },
            { title: "EVENTS_ENTRY_FEE_INR_LABEL", value: estimate?.id },
          ]
        }

        const nonSOR = estimate?.estimateDetails?.filter(row=>row?.category?.includes("NON-SOR") && row?.isActive)
        const overheads = estimate?.estimateDetails?.filter(row => row?.category?.includes("OVERHEAD") && row?.isActive)
        

        const tableHeaderNonSor = [t("WORKS_SNO"), t("EVENTS_DESCRIPTION"), t("PROJECT_UOM"), t("CS_COMMON_RATE"), t("WORKS_ESTIMATED_QUANTITY"), t("WORKS_ESTIMATED_AMOUNT")] 
        const tableHeaderOverheads = [t("WORKS_SNO"), t("WORKS_OVERHEAD"), t("WORKS_PERCENTAGE"), t("WORKS_AMOUNT")]
        
        const tableRowsNonSor = nonSOR?.map((row,index)=>{
            return [
                index+1,
                row?.description,
                t(`ES_COMMON_UOM_${row?.uom}`),
                row?.unitRate,
                row?.noOfunit,
                row?.amountDetail[0]?.amount?.toFixed(2)
            ]
        })
        const totalAmountNonSor = nonSOR?.reduce((acc, row) => row?.amountDetail?.[0]?.amount + acc,0)
        tableRowsNonSor?.push(["","","","" ,t("RT_TOTAL"), totalAmountNonSor])
        
        const tableRowsOverheads = overheads?.map((row, index) => {
            return [
                index + 1,
                t(`ES_COMMON_OVERHEADS_${row?.name}`),
                row?.additionalDetails?.row?.name?.type?.includes("percent") ? `${row?.additionalDetails?.row?.name?.value}%`:t("WORKS_LUMPSUM"),
                row?.amountDetail?.[0]?.amount?.toFixed(2)
            ]
        })
        const totalAmountOverheads = overheads?.reduce((acc, row) => row?.amountDetail?.[0]?.amount + acc, 0)
        tableRowsOverheads?.push(["","", t("RT_TOTAL"), totalAmountOverheads])
        const nonSorItems = {
            title: "WORKS_NON_SOR",
            asSectionHeader: true,
            isTable: true,
            headers: tableHeaderNonSor,
            tableRows: tableRowsNonSor,
            state: estimate,
            tableStyles:{
                rowStyle:{},
                cellStyle: [{}, { "width": "40vw",whiteSpace: 'break-spaces',
                wordBreak: 'break-all' }, {}, {"textAlign":"right"}, {"textAlign":"left"},{"textAlign":"right"}]
            }
        }
        const overheadItems = {
            title: "WORKS_OVERHEADS",
            asSectionHeader: true,
            isTable: true,
            headers: tableHeaderOverheads,
            tableRows: tableRowsOverheads,
            state: estimate,
            tableStyles: {
                rowStyle: {},
                cellStyle: [{}, { "width": "50vw", whiteSpace: 'break-spaces',
                wordBreak: 'break-all' }, {"textAlign":"left"}, { "textAlign": "right" }]
            }
        }
        
        const files = estimate?.additionalDetails?.documents
        const documentDetails = {
            title: "",
            asSectionHeader: true,
            additionalDetails: {
                documents: [{
                    title: "WORKS_RELEVANT_DOCS",
                    BS: 'Works',
                    values: files?.filter(doc=>doc?.fileStoreId)?.map((document) => {
                        return {
                            title: document?.fileType==="Others"?document?.fileName:document?.fileType,
                            documentType: document?.documentType,
                            documentUid: document?.fileStoreId,
                            fileStoreId: document?.fileStoreId,
                        };
                    }),
                },
                ]
            }
        }

        const totalEstAmt = {
            "title": " ",
            "asSectionHeader": true,
            "Component": Digit.ComponentRegistryService.getComponent("ViewTotalEstAmount"),
            "value": Math.round(estimate?.additionalDetails?.totalEstimatedAmount)|| t("NA")
        }

        const labourDetails = {
            "title": "ESTIMATE_LABOUR_ANALYSIS",
            "asSectionHeader": true,
            "Component": Digit.ComponentRegistryService.getComponent("ViewLabourAnalysis"),
            "value": [
                {
                    "title": "ESTIMATE_LABOUR_COST",
                    "value":estimate?.additionalDetails?.labourMaterialAnalysis?.labour || t("NA")
                },
                {
                    "title": "ESTIMATE_MATERIAL_COST",
                    "value": estimate?.additionalDetails?.labourMaterialAnalysis?.material || t("NA")
                },
            ]
        }
        const details = [sample,nonSorItems, overheadItems,totalEstAmt,labourDetails,documentDetails]

        return {
            applicationDetails: details,
            applicationData:estimate,
            isNoDataFound : estimateArr.length === 0 ? true : false
        }
    },
   

}