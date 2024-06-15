import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../hooks/useCustomAPIMutationHook";
import { newConfig } from "../../configs/ProjectCreateConfig";



const ProjectCreate = () => {
  console.log('sss');
  const [toastMessage, setToastMessage] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  // const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS("pg", "exchange", [{ name: "ExchangeServers" }]);
  const [gender, setGender] = useState("");
  const reqCreate = {
     url: `/program-service/project/_create`,
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
          "Project": {
            "tenantId": tenantId,
            "programCode": data.program_code,
            "agencyCode": data.agency_code,
            // "projectCode": "PORJ/2023-24/00001",
            "name": data.name,
            "description": data.description,
            "status": {
              "statusCode": data.status_code,
              "statusMessage": "string"
            },
            "additionalDetails": {}
          }
},
        config: {
          enable: true,
        },
      },
    );

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

export default ProjectCreate;