import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../hooks/useCustomAPIMutationHook";
import { newConfig } from "../../configs/OrganizationCreateConfig";



const OrganizationUpdate = () => {
  const [toastMessage, setToastMessage] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  // const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS("pg", "exchange", [{ name: "ExchangeServers" }]);
  const [gender, setGender] = useState("");
  const {orgId} = Digit.Hooks.useQueryParams();
  const reqCreate = {
     url: `/org-services/organisation/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  

  const requestCriteria = {
    url: "/org-services/organisation/v1/_search",
    changeQueryName: orgId,
    // params: {
    //   tenantId,
    //   offset: 0,
    //   limit: 100,
    //   // includeAncestors: true,
    // },
    body: {
      "SearchCriteria": {
         "tenantId": "pg.citya",
         "orgNumber": orgId
    },
    "Pagination": {
        "offSet": 0,
        "limit": 10
    },
      apiOperation: "SEARCH",
    },
    config: {
      enabled: orgId ? true : false,
      select:(data) => {
        console.log(data)
        debugger
        //call a function and return form data
        //return form data
      }

    },
  };

  const { data: organization, refetch,isLoading:isLoadingOrganistaion } = Digit.Hooks.useCustomAPIHook(requestCriteria);
  console.log("aaaa",organization)


  const mutation = useCustomAPIMutationHook(reqCreate);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };


  const onSubmit = async(data) => {
    console.log("tuyguyg", data);
    setToastMessage("Form submitted successfully!");
    await mutation.mutate(
      {
        body: {
          "organisations": [
            {
                "tenantId": "pg.citya",
                "name": "ShubhangOrg1",
                "applicationStatus": "ACTIVE",
                "dateOfIncorporation": 1684261799000,
                "orgAddress": [
                    {
                        "tenantId": "pg.citya",
                        "doorNo": "",
                        "city": "pg.citya",
                        "boundaryType": "Ward",
                        "boundaryCode": "B1",
                        "street": "",
                        "geoLocation": {}
                    }
                ],
                // "additionalDetails": {
                //     "locality": "SUN01",
                //     "registeredByDept": "",
                //     "deptRegistrationNum": ""
                // },
                "contactDetails": [
                    {
                        "contactName": "Shubhang",
                        "contactMobileNumber": data.contact_number,
                        "contactEmail": data.contact_email
                    }
                ],
                "functions": [
                    {
                        "type": "CBO.MSG",
                        "category": "CBO.NA",
                        "class": "A",
                        "validFrom": 1683743399000,
                        "validTo": 1685557799000
                    }
                ],
                "identifiers": [
                    {
                        "type": "PAN",
                        "value": "XXXXX0123X",
                        "isActive": true
                    }
                ]
            }
        ],
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

export default OrganizationUpdate;