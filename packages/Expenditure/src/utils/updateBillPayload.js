const updateBillObject = (bill,updates) => {
  
    //update additionalDetails object
    bill.additionalDetails = updates.additionalDetails
    bill.billDate = updates.billDate
    bill.documents = updates.documents
  
    //set all the current deductibles to INACTIVE
    bill?.billDetails?.[0]?.lineItems.forEach(row => {
      if(row.type==="DEDUCTION") row.status = "INACTIVE"
    })
  
    //update the PAYABLE type in lineItems
    const updatedPayables = updates.billDetails?.[0]?.lineItems.filter(row => row.type==="PAYABLE")
    const updatedDeductibles = updates.billDetails?.[0]?.lineItems.filter(row => row.type==="DEDUCTION")
    
    bill?.billDetails?.[0]?.lineItems.forEach(row => {
      if(row.type==="PAYABLE") row.amount = updatedPayables?.filter(item => item.headCode === row.headCode)?.[0].amount
    })
  
    //add in new line items
    bill.billDetails[0].lineItems = [...updatedDeductibles,...bill?.billDetails?.[0]?.lineItems]
  
    //update payee
    bill.billDetails[0].payee = updates.billDetails[0].payee
  
    //add in contractNumber field
    bill.contractNumber = bill.referenceId.split("_")[0]
    return bill
  }
  
  export const updateBillPayload = (billResponse,createPayload) => {
    
    const updatedBill = createPayload?.bill
    return updateBillObject(billResponse,updatedBill)
  }