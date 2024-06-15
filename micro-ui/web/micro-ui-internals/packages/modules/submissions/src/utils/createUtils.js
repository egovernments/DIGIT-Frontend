export const transformCreateData = (data)=>{
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