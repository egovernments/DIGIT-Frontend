import { convertDateToEpoch } from "../../../../libraries/src/utils/pt";
import _ from "lodash";
const createDocObject = (document, docType, otherDocFileName="Others", isActive, docConfigData) =>{
   let documentType = docConfigData?.works?.DocumentConfig?.[0]?.documents;
    //handle empty Category Name in File Type
    if((otherDocFileName.trim()).length === 0) {
      otherDocFileName = "";
    }
    let payload_modal = {};
    payload_modal.documentType = documentType?.filter(doc=>doc?.name === docType)?.[0]?.code;
    payload_modal.fileStore = document?.[1]?.['fileStoreId']?.['fileStoreId'];
    payload_modal.documentUid = document?.[1]?.['fileStoreId']?.['fileStoreId'];
    payload_modal.key = docType;
    
    let fileName = "";
    if (document?.[1]?.['file']?.['name']) fileName = document?.[1]?.['file']?.['name'];
    else if (document?.[0]) fileName = document?.[0];
    else  fileName = documentType?.filter(doc=>doc?.name === docType)?.[0]?.code;

    payload_modal.additionalDetails = {
      fileName : fileName,
      otherCategoryName :  docType === "doc_others" ? otherDocFileName : ""
    }
    return payload_modal;
}

const fetchDocuments = (documents, otherDocFileName, docConfigData) => {
    let documents_payload_list = [];
  
    //new uploaded docs
    for(let docType of Object.keys(documents)) {
      for(let document of documents[docType]) {
        if(_.isArray(document)) {
        let payload_modal = createDocObject(document, docType, otherDocFileName, "ACTIVE", docConfigData); 
        documents_payload_list.push(payload_modal);
        }
      }
    }
  
    return documents_payload_list;
  }

const fetchDeductions = (deductions, tenantId) => {

    let deductionsList = deductions?.filter(row => row && row.amount!=="0" && row.name && row.amount)?.map(row => {
        const headCode = row?.name?.name.split("_")?.[3] // for existing rows
        return {
            "tenantId": tenantId,
            "headCode": row?.name?.code || headCode,
            "amount": row?.amount,
            "type": "DEDUCTION",
            "paidAmount": 0,
            "status": "ACTIVE",
            "additionalDetails": {
                "comments": row?.comments
            }
        } 
    })
    return deductionsList
}

export const createBillPayload = (data, contract,  docConfigData,workflowDetails) => {

    const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.purchase");
    const tenantId = Digit.ULBService.getCurrentTenantId()
    let DeductionsList = fetchDeductions(data?.deductionDetails, tenantId)

    let payload = {
        bill: {
            "tenantId": tenantId,
            "invoiceDate": convertDateToEpoch(data?.invoiceDetails_invoiceDate),
            "invoiceNumber": data?.invoiceDetails_invoiceNumber,
            "contractNumber": data?.basicDetails_workOrderNumber,
            "projectId": data?.basicDetails_projectID,
            "billDate": convertDateToEpoch(data?.billDetails_billDate), 
            "status": "ACTIVE",
            businessService,
            "billDetails": [
              { 
                "tenantId": tenantId,	
                "billId": null,	
                "netLineItemAmount": null,	
                "referenceId": data?.basicDetails_workOrderNumber,
                "paymentStatus": null,	
                "fromPeriod": convertDateToEpoch(contract?.startDate),
                "toPeriod":convertDateToEpoch(contract?.endDate),
                "payee": {
                  "tenantId": tenantId,
                  "type": "ORG", 
                  "identifier": data?.invoiceDetails_vendor.code,
                  "status": "ACTIVE"
                },
                "lineItems": [
                  {
                    "tenantId": tenantId,
                    "headCode": "MC",
                    "amount": data?.invoiceDetails_materialCost || 0,
                    "type": "PAYABLE", 
                    "paidAmount": 0,
                    "status": "ACTIVE"
                  },
                  {
                    "tenantId": tenantId,
                    "headCode": "GST",
                    "amount": data?.invoiceDetails_gst || 0,
                    "type": "PAYABLE",
                    "paidAmount": 0,
                    "status": "ACTIVE"
                  },
                  ...DeductionsList
                ],
                "payableLineItems": [],
                "additionalDetails": {}
              }
            ],
            "additionalDetails": {
                "totalBillAmount" : String(Digit.Utils.dss.convertFormatterToNumber(data?.billDetails_billAmt)),
                "invoiceNumber" : data?.invoiceDetails_invoiceNumber,
                "invoiceDate" : data?.invoice_date,
                "projectDesc" : data?.basicDetails_projectDesc,
                "projectId": data?.basicDetails_projectID,
                "locality":contract.additionalDetails.locality,
                "ward":contract.additionalDetails.ward,
                "orgName":contract.additionalDetails.orgName,
                "projectName":contract.additionalDetails.projectName,
                "invoiceDate": convertDateToEpoch(data?.invoiceDetails_invoiceDate)
            },
            "documents": fetchDocuments(
              data?.uploadedDocs,
                data?.uploadedDocs?.doc_others_name,
                docConfigData
                ), 
          },
        workflow: {
            "action": "SUBMIT",
            "assignees": workflowDetails.assignees,
            "comment":workflowDetails.comment
          }
    };
    return payload;
}