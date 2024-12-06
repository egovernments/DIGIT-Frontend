import React from "react";
import  { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../configs/PgrCreateConfig";
import useCustomAPIMutationHook from "../../hooks/useCustomAPIMutationHook";
import { transformCreateData } from "../../utils/createUtils";



const complaintCreate = () => {

  const [toastMessage, setToastMessage] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  // const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS("pg", "exchange", [{ name: "ExchangeServers" }]);
  const [gender, setGender] = useState("");
  const reqCreate = {
     url: `/pgr-service/request/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  



  const mutation = useCustomAPIMutationHook(reqCreate);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };


  const onSubmit = async(data) => {
    console.log(data, "data");
    setToastMessage("Form submitted successfully!");
    await mutation.mutate(
      {
        // url: `/mukta/program-service/v1/program/_create`,
        // params: { tenantId: "pg.citya" },
        body: {
         "pgrEntity":{
    "service": {
        "citizen": {
            "tenantId": "mz",
            "id": 1456,
            "userName": "JaneDoeskhjgfkkss",
            "mobileNumber": "1234567990",
            "emailId": "janedoe@example.com",
            "name": "nitiskhgh"
        },
        "tenantId": "mz",
        "serviceCode": "NotEnoughStock",
        "description": "Sample service request description",
        // "accountId": "acc-12345",
        "additionalDetail": {
            "key1": "value1",
            "key2": "value2"
        },
        "applicationStatus": "PENDING",
        "source": "mobile",
        "address": {
            "id": "addr-001",
            "tenantId": "tenant-123",
            "locality": {
                "code": "LOC123",
                "name": "Locality Name",
                "label": "Label for Locality",
                "latitude": "12.971598",
                "longitude": "77.594566",
                "children": [
                    {
                        "code": "CHILD123",
                        "name": "Child Locality Name",
                        "label": "Child Locality Label",
                        "latitude": "12.972345",
                        "longitude": "77.595678",
                        "materializedPath": "/LOC123/CHILD123"
                    }
                ],
                "materializedPath": "/LOC123"
            },
            "geoLocation": {
                "latitude": 12.971598,
                "longitude": 77.594566
            }
        },
        "auditDetails": {
            "createdBy": "admin",
            "createdTime": 1697586735000
        }
    },
    "workflow": {
        "action": "CREATE",
        "state": "INITIATED",
        "verificationDocuments": [
            {
                "id": "1234",
                "documentType": "document"
            }
        ]
    }
    }
},
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          console.log(error, "eryjhtj");
          setShowToast({ key: "error", label: error?.message ? error?.message : error });
        },
        onSuccess: async (data) => {
          console.log("abcd",data);
          
          history.push(
            `/${window.contextPath}/employee/sample/response?orgId=${data?.organisations?.[0]?.orgNumber}&isSuccess=${true}`,
            {
              message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
              text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
              info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
              actionLabel: t("HCM_CAMPAIGN_SUCCESS_RESPONSE_ACTION"),
              // actionLink: `/${window.contextPath}/employee/campaign/my-campaign`,
            }
          );
          Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
        },
      });



    const configs = newConfig;

  };

  return (
    <div>
      <h1> Create Program</h1>
      <FormComposerV2
        label={t("Submit")}
        config={newConfig.map((config) => {
          return {
            ...config,


          };
        })}
        defaultValues={{}}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={{ marginRight: 0 }}

      />
        {/* Toast Component */}
        {toastMessage && (
        <div style={{ backgroundColor: "lightblue", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
          <div>{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

export default complaintCreate;