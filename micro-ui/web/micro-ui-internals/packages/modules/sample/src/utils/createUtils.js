export const transformCreateData = (data)=>{
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