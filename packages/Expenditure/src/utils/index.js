
const setDefaultDocs = (bill) => {
    const documentsObj = {}
    bill?.additionalDetails?.documents.forEach((doc,idx) => {
      
      if(doc?.documentType === "OTHERS") {
        documentsObj["doc_others_name"] = doc?.additionalDetails?.otherCategoryName
      }
  
       documentsObj[`doc_${doc.documentType}`.toLowerCase()] = [
        [
          `${doc.additionalDetails.fileName}`,
          {
            "file":{},
            "fileStoreId":{
              "fileStoreId":doc.fileStore,
              "tenantId":bill.tenantId
            }
          }
        ]
      ]
    })
  
  
  
    return documentsObj
    
  }
  
  const setGSTCost = (bill) => {
    const amount = bill?.billDetails?.[0]?.lineItems?.filter(row=>row?.type==="PAYABLE" && row?.headCode==="GST")
    return amount?.[0]?.amount
  
  }
  
  const setMaterialCost = (bill) => {
    const amount = bill?.billDetails?.[0]?.lineItems?.filter(row=>row?.type==="PAYABLE" && row?.headCode==="MC")
    
    return amount?.[0]?.amount
  }
  
  
  const setDeductionTableData = (bill,charges,t) => {
    const deductions = bill?.billDetails?.[0]?.lineItems?.filter(row=>row?.type==="DEDUCTION").map((row,idx)=>{
      const chargesObject = charges.filter(charge => charge.code === row.headCode)?.[0]
      return {
        "percentage": chargesObject?.calculationType==="percentage"?`${chargesObject.value} ${t("WORKS_PERCENT")}`:`${t("EXP_FIXED")}`,
        "amount": row?.amount,
        "comments": row?.additionalDetails?.comments,
        "name":{
          "name": `COMMON_MASTERS_DEDUCTIONS_${row.headCode}`,
          ...chargesObject?.[0]
        }
    }
    })
    
    if(deductions.length>0) return [null,...deductions]
    else return undefined;
  }
  
  export const updateDefaultValues = ({t, tenantId, configs, findCurrentDate, isModify, sessionFormData, setSessionFormData, contract,  docConfigData, billData, setIsFormReady,charges,org}) => {
    
    const bill = billData?.bills?.[0]
    if(!sessionFormData?.basicDetails_workOrderNumber || !sessionFormData.basicDetails_projectID || !sessionFormData.basicDetails_projectDesc || !sessionFormData.basicDetails_location) {  
      configs.defaultValues.billDetails_billDate = isModify ? Digit.DateUtils.ConvertTimestampToDate(bill?.billDate, 'yyyy-MM-dd') : findCurrentDate(); 
      configs.defaultValues.basicDetails_workOrderNumber = contract?.contractNumber || t("NA");
      configs.defaultValues.basicDetails_projectID = contract?.additionalDetails?.projectId || t("NA");
      configs.defaultValues.basicDetails_projectDesc = contract?.additionalDetails?.projectDesc || t("NA");
      configs.defaultValues.basicDetails_location =  location ? location : t("NA")
      configs.defaultValues.basicDetails_location = contract?.additionalDetails?.ward ? 
        String(
            `${t(Digit.Utils.locale.getCityLocale(tenantId))}, ${t(Digit.Utils.locale.getMohallaLocale(contract?.additionalDetails?.ward, tenantId))}`
        )  : t("NA"); 
      configs.defaultValues.invoiceDetails_vendor =  isModify ? { code: org?.id, name: org?.name, orgNumber: org?.orgNumber} : ""
      configs.defaultValues.invoiceDetails_invoiceNumber = bill?.additionalDetails?.invoiceNumber || ""
      configs.defaultValues.invoiceDetails_invoiceDate = bill?.billDate ? Digit.DateUtils.ConvertTimestampToDate(bill?.billDate, 'yyyy-MM-dd') : ""
  
      if(isModify) {
        
        configs.defaultValues.basicDetails_purchaseBillNumber = bill?.billNumber ? bill?.billNumber  : "";
        configs.defaultValues.basicDetails_workOrderNumber = bill?.referenceId ? bill?.referenceId?.split("_")?.[0] : t("NA");
        configs.defaultValues.basicDetails_projectID = bill?.additionalDetails?.projectId ? bill?.additionalDetails?.projectId : t("NA");
        configs.defaultValues.basicDetails_projectDesc = bill?.additionalDetails?.projectDesc ? bill?.additionalDetails?.projectDesc : t("NA");
        configs.defaultValues.basicDetails_location =  bill?.additionalDetails?.ward ? 
          String(
            `${t(Digit.Utils.locale.getCityLocale(tenantId))}, ${t(Digit.Utils.locale.getMohallaLocale(contract?.additionalDetails?.ward, tenantId))}`
        )  : t("NA"); 
        
      
      configs.defaultValues.uploadedDocs = setDefaultDocs(bill)
      configs.defaultValues.deductionDetails = setDeductionTableData(bill,charges,t)
      configs.defaultValues.invoiceDetails_gst = setGSTCost(bill)
      configs.defaultValues.invoiceDetails_materialCost = setMaterialCost(bill)
      
      }
      setSessionFormData({...sessionFormData, ...configs?.defaultValues});
    }
    setIsFormReady(true)
  }