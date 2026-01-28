export const transformIndividualCreateData = (data)=>{
    return {
        Individual: {
          tenantId: "pg.citya",
          name: {
            givenName: data.applicantname,
          },
          dateOfBirth: null,
          gender: data?.genders?.code,
          mobileNumber: data.phno,
          address: [
            {
              tenantId: "pg.citya",
              pincode: data.pincode,
              city: data.city,
              street: data.street,
              doorNo: data.doorno,
              "locality":
              {
                "code" : data?.locality?.code||"SUN01",
              },
              landmark: data.landmark,
              "type": "PERMANENT"
            },
          ],
          identifiers: null,
          skills: [
              {
                  "type": "DRIVING",
                  "level": "UNSKILLED"
              }
          ],
          "photograph": null,
          additionalFields: {
              "fields": [
                  ...data?.additionalDetails,
                  {
                      "key": "EMPLOYER",
                      "value": "ULB"
                  }
              ]
          },
          isSystemUser: null,
          userDetails: {
              "username": "8821243212",
              "tenantId": "pg.citya",
              "roles": [
                  {
                      "code": "SANITATION_WORKER",
                      "tenantId": "pg.citya"
                  }
              ],
              "type": "CITIZEN"
          },
      },
    }

}

export const transformHRMSCreateData = (data)=>{
    return {
      "Employees": [
        {
            // "id": 9603,
            // "uuid": "52047dac-f39e-48f7-9cc1-06d1481c65a6",
            // "code": "Test_L2",
            "employeeStatus": "EMPLOYED",
            "employeeType": "PERMANENT",
            "dateOfAppointment": 1704067200000,
            "jurisdictions": [
                {
                    // "id": "65718bab-5f8f-4ab5-a16d-42a3b138d110",
                    "hierarchy": "ADMIN",
                    "boundary": "pg.amhara",
                    "boundaryType": "City",
                    "tenantId": "pg.amhara",
                    // "auditDetails": {
                    //     "createdBy": "c16de636-688b-4b42-a123-2d3aaa27bdd8",
                    //     "createdDate": 1737530732383,
                    //     "lastModifiedBy": null,
                    //     "lastModifiedDate": 0
                    // },
                    "isActive": true
                }
            ],
            "assignments": [
                {
                    // "id": "8e6a3113-fd4c-4b86-81ac-a826d8e604fe",
                    "position": 6629,
                    "designation": "AO",
                    "department": "DEPT_13",
                    "fromDate": 1735689600000,
                    "toDate": null,
                    "govtOrderNumber": null,
                    "tenantid": "pg.amhara",
                    "reportingTo": null,
                    // "auditDetails": {
                    //     "createdBy": "c16de636-688b-4b42-a123-2d3aaa27bdd8",
                    //     "createdDate": 1737530732383,
                    //     "lastModifiedBy": null,
                    //     "lastModifiedDate": 0
                    // },
                    "isHOD": false,
                    "isCurrentAssignment": true
                }
            ],
            "serviceHistory": [],
            "education": [],
            "tests": [],
            "tenantId": "pg.amhara",
            "documents": [],
            "deactivationDetails": [],
            "reactivationDetails": [],
            // "auditDetails": {
            //     "createdBy": "c16de636-688b-4b42-a123-2d3aaa27bdd8",
            //     "createdDate": 1737530732383,
            //     "lastModifiedBy": null,
            //     "lastModifiedDate": 0
            // },
            "reActivateEmployee": false,
            "user": {
                // "id": 9603,
                // "uuid": "52047dac-f39e-48f7-9cc1-06d1481c65a6",
                // "userName": "Test_L2",
                "password": null,
                "salutation": null,
                "name": data.applicantname,
                "gender": data?.genders?.code,
                "mobileNumber": data.phno,
                "emailId": "yunuomerdin@gmail.com",
                "altContactNumber": null,
                "pan": null,
                "aadhaarNumber": null,
                "permanentAddress": null,
                "permanentCity": null,
                "permanentPinCode": null,
                "correspondenceCity": null,
                "correspondencePinCode": null,
                "correspondenceAddress": "Ethiopia",
                "active": true,
                "dob": 946665000000,
                "pwdExpiryDate": 1745306732000,
                "locale": null,
                "type": "EMPLOYEE",
                "signature": null,
                "accountLocked": false,
                "roles": [
                    {
                        "name": "Employee",
                        "code": "EMPLOYEE",
                        "description": null,
                        "tenantId": "pg.amhara"
                    }
                ],
                "fatherOrHusbandName": null,
                "relationship": null,
                "bloodGroup": null,
                "identificationMark": null,
                "photo": null,
                "createdBy": "8829",
                "createdDate": 1737530732000,
                // "lastModifiedBy": "8829",
                // "lastModifiedDate": 1737816918000,
                "otpReference": null,
                "tenantId": "pg.amhara"
            },
            "isActive": true
        }
    ]
    }

}

export const transformViewApplication = (id, accid, tenantId) => {
    let requestBody = {
        "ServiceCriteria": {
            "clientId": Digit.UserService.getUser().info.uuid,
            "serviceDefId": id,
            "accountId": accid,
            "tenantId": tenantId,
            "rowVersion": 1,
            "isDeleted": false
        },
        "apiOperation": "CREATE",
    }
    return requestBody;
}

const transformViewCheckList = (code) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let requestBody = {
        "ServiceDefinitionCriteria": {
            "code": code,
            "tenantId": tenantId,
        },
        "includeDeleted": true
    }
    return requestBody;
}

export const transformCreateCheckList = (
    id,
    accid,
    data,
    action = "SUBMIT",
    shouldUpdate,
    defValues
  ) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
  
    // Build a lookup for existing attribute IDs
    const existingAttrMap = {};
    if (shouldUpdate && defValues?.attributes?.length) {
      defValues.attributes.forEach((attr) => {
        existingAttrMap[attr.attributeCode] = attr.id;
      });
    }
  
    const buildAttributes = () => {
      const att = [];
  
      const processField = (key, value, parentKey = null) => {
        const attributeCode = parentKey ? `${parentKey}.${key}` : key;
        const baseAttr = {
          attributeCode,
          tenantId,
        };
  
        if (shouldUpdate && existingAttrMap[attributeCode]) {
          baseAttr.id = existingAttrMap[attributeCode];
        }
  
        if (typeof value === "object" && value !== null && 'code' in value) {
          att.push({
            ...baseAttr,
            dataType: "SingleValueList",
            value: value.code && value.code !== "" ? value.code : null,
          });
  
          if (value[value.code]) {
            for (const k in value[value.code]) {
              processField(
                k,
                value[value.code][k],
                parentKey ? `${parentKey}.${key}.${value.code}` : `${key}.${value.code}`
              );
            }
          }
        } else {
          att.push({
            ...baseAttr,
            dataType: "text",
            value: value !== "" ? value : null,
          });
        }
      };
  
      for (const key in data) {
        processField(key, data[key]);
      }
  
      return att;
    };
    //accid is application Id
    //id is service definition id
    //accountId is user id
  
    let requestBody = {
      Service: {
        clientId: Digit.UserService.getUser().info.uuid,
        serviceDefId: id,
        accountId: accid,
        tenantId,
        attributes: buildAttributes(),
        additionalFields: [{ action }],
      },
      apiOperation: "CREATE",
    };
  
    if (shouldUpdate) {
      requestBody = {
        Service: {
          clientId: Digit.UserService?.getUser()?.info?.uuid,
          serviceDefId: id,
          accountId: accid,
          tenantId,
          attributes: buildAttributes(),
          additionalFields: [{ action }],
          id: defValues?.id,
        },
        apiOperation: "UPDATE",
      };
    }
  
    return requestBody;
  };
  

export default transformViewCheckList;