export const updateSessionUtils = {
  computeSessionObject:async (row) => {
    const sessionObj = {}

    const setCurrentPage = () => {
      sessionObj.currentPage = {
        "id": 0,
        "name": "MICROPLAN_DETAILS",
        "component": "MicroplanDetails",
        "checkForCompleteness": true
      }
    }

    //currently hardcoded
    const setMicroplanStatus = () => {
      sessionObj.status = {
        "MICROPLAN_DETAILS": false,
        "UPLOAD_DATA": false,
        "HYPOTHESIS": false,
        "FORMULA_CONFIGURATION": false
      }
    }

    const setMicroplanDetails = () => {
      if(row.name){
        sessionObj.microplanDetails = {
          name:row?.name
        }
        sessionObj.status.MICROPLAN_DETAILS = true
      }
    }

    const setMicroplanHypothesis = () => {
      if(row.assumptions.length > 0){
        sessionObj.hypothesis = row.assumptions
        sessionObj.status.HYPOTHESIS = true
      }
    }

    const setMicroplanRuleEngine = () => {
      if(row.operations.length > 0) {
        sessionObj.ruleEngine = row.operations
        sessionObj.status.FORMULA_CONFIGURATION = true
      }
    }

    const file =  await Digit.UploadServices.Filefetch(["fbae774c-9a10-412f-bd36-2b4da18f1322"],"mz")
    debugger
    setCurrentPage()
    setMicroplanStatus()
    setMicroplanDetails()
    setMicroplanHypothesis()
    setMicroplanRuleEngine()
    


    return sessionObj
  }
}